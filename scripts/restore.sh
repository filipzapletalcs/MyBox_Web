#!/bin/bash
#
# MyBox Restore Script v2
# Restores database and storage from backup using Supabase API
# Properly creates xattr metadata for storage files
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/Users/filipzapletal/MyBox_Web_26/backups}"
DB_CONTAINER="supabase_db_mybox-eco"
STORAGE_CONTAINER="supabase_storage_mybox-eco"

# Supabase configuration
SUPABASE_URL="http://127.0.0.1:54321"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

# Check if backup path provided
if [ -z "$1" ]; then
  echo -e "${YELLOW}Usage: $0 <backup_name_or_archive>${NC}"
  echo ""
  echo "Available backups:"
  echo ""

  # List available backups
  if [ -d "${BACKUP_DIR}" ]; then
    for archive in "${BACKUP_DIR}"/*.tar.gz; do
      if [ -f "$archive" ]; then
        name=$(basename "$archive" .tar.gz)
        size=$(du -h "$archive" | cut -f1)
        echo "  - ${name} (${size})"
      fi
    done
    echo ""
    for dir in "${BACKUP_DIR}"/mybox_backup_*; do
      if [ -d "$dir" ] && [ ! -f "${dir}.tar.gz" ]; then
        name=$(basename "$dir")
        echo "  - ${name} (uncompressed)"
      fi
    done
  else
    echo "  No backups found in ${BACKUP_DIR}"
  fi
  exit 1
fi

BACKUP_INPUT="$1"

# Determine if it's an archive or directory
if [[ "$BACKUP_INPUT" == *.tar.gz ]]; then
  ARCHIVE_PATH="${BACKUP_DIR}/${BACKUP_INPUT}"
  if [ ! -f "$ARCHIVE_PATH" ]; then
    ARCHIVE_PATH="$BACKUP_INPUT"
  fi

  if [ ! -f "$ARCHIVE_PATH" ]; then
    echo -e "${RED}Error: Archive not found: ${ARCHIVE_PATH}${NC}"
    exit 1
  fi

  echo -e "${YELLOW}Extracting archive...${NC}"
  BACKUP_NAME=$(basename "$ARCHIVE_PATH" .tar.gz)
  BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

  cd "${BACKUP_DIR}"
  tar -xzf "$ARCHIVE_PATH"
else
  BACKUP_NAME="$BACKUP_INPUT"
  BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

  if [ ! -d "$BACKUP_PATH" ]; then
    echo -e "${RED}Error: Backup directory not found: ${BACKUP_PATH}${NC}"
    exit 1
  fi
fi

echo -e "${GREEN}=== MyBox Restore v2 ===${NC}"
echo "Restoring from: ${BACKUP_PATH}"
echo ""

# Show metadata
if [ -f "${BACKUP_PATH}/metadata.json" ]; then
  echo -e "${YELLOW}Backup metadata:${NC}"
  cat "${BACKUP_PATH}/metadata.json"
  echo ""
fi

# Confirm
echo -e "${RED}WARNING: This will REPLACE all current data!${NC}"
read -p "Are you sure you want to continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
  echo "Aborted."
  exit 0
fi

# 1. Restore database
if [ -f "${BACKUP_PATH}/database.sql" ]; then
  echo -e "${YELLOW}[1/5] Restoring PostgreSQL database...${NC}"

  # Truncate all tables instead of dropping schema
  # This preserves extensions and schema structure
  docker exec ${DB_CONTAINER} psql -U postgres -d postgres -c "
    DO \$\$
    DECLARE
      r RECORD;
    BEGIN
      -- Disable triggers temporarily
      SET session_replication_role = replica;

      -- Truncate all tables in public schema
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;

      -- Clear storage.objects (but keep buckets)
      TRUNCATE storage.objects CASCADE;

      -- Re-enable triggers
      SET session_replication_role = DEFAULT;
    END \$\$;
  " 2>/dev/null || echo "Warning: Some truncate operations failed, continuing..."

  # Restore from dump
  docker exec -i ${DB_CONTAINER} psql -U postgres -d postgres < "${BACKUP_PATH}/database.sql" 2>&1 | \
    grep -v "already exists" | grep -v "does not exist" | head -20 || true

  echo -e "${GREEN}Database restored!${NC}"
else
  echo -e "${RED}Error: No database.sql found!${NC}"
  exit 1
fi

# 2. Fix permissions (disable RLS, add GRANTs)
echo -e "${YELLOW}[2/5] Setting up permissions (RLS off, GRANTs)...${NC}"
docker exec ${DB_CONTAINER} psql -U postgres -d postgres -c "
-- Disable RLS on all tables
DO \$\$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
  END LOOP;
END \$\$;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Storage permissions
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon, authenticated, service_role;
" 2>/dev/null || echo "Warning: Some permission operations failed"

echo -e "${GREEN}Permissions configured!${NC}"

# 3. Clear existing storage files via API
echo -e "${YELLOW}[3/5] Clearing existing storage...${NC}"

# Get list of buckets
BUCKETS=$(curl -s "${SUPABASE_URL}/storage/v1/bucket" \
  -H "Authorization: Bearer ${SERVICE_KEY}" | \
  grep -o '"name":"[^"]*"' | cut -d'"' -f4)

for bucket in $BUCKETS; do
  # Get all files in bucket
  FILES=$(curl -s "${SUPABASE_URL}/storage/v1/object/list/${bucket}" \
    -H "Authorization: Bearer ${SERVICE_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"prefix":"","limit":1000}' | \
    grep -o '"name":"[^"]*"' | cut -d'"' -f4 || echo "")

  for file in $FILES; do
    [ -z "$file" ] && continue
    curl -s -X DELETE \
      "${SUPABASE_URL}/storage/v1/object/${bucket}/${file}" \
      -H "Authorization: Bearer ${SERVICE_KEY}" > /dev/null 2>&1 || true
  done
done

# Also clear storage.objects table to ensure clean state
docker exec ${DB_CONTAINER} psql -U postgres -d postgres -c "TRUNCATE storage.objects CASCADE;" 2>/dev/null || true

echo -e "${GREEN}Storage cleared!${NC}"

# 4. Upload storage files via Supabase API
if [ -d "${BACKUP_PATH}/storage" ]; then
  echo -e "${YELLOW}[4/5] Uploading storage files via API...${NC}"

  UPLOADED=0
  FAILED=0

  # Find all files in storage backup
  while IFS= read -r -d '' file; do
    # Get relative path from storage directory
    REL_PATH="${file#${BACKUP_PATH}/storage/}"
    BUCKET=$(echo "$REL_PATH" | cut -d'/' -f1)
    FILE_NAME=$(echo "$REL_PATH" | cut -d'/' -f2-)

    [ -z "$BUCKET" ] || [ -z "$FILE_NAME" ] && continue

    # Detect mime type from extension
    EXT="${FILE_NAME##*.}"
    case "$EXT" in
      png) MIME="image/png" ;;
      jpg|jpeg) MIME="image/jpeg" ;;
      gif) MIME="image/gif" ;;
      webp) MIME="image/webp" ;;
      svg) MIME="image/svg+xml" ;;
      pdf) MIME="application/pdf" ;;
      zip) MIME="application/zip" ;;
      mp4) MIME="video/mp4" ;;
      webm) MIME="video/webm" ;;
      *) MIME="application/octet-stream" ;;
    esac

    echo -e "${BLUE}  Uploading: ${BUCKET}/${FILE_NAME}${NC}"

    # Upload via API
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
      "${SUPABASE_URL}/storage/v1/object/${BUCKET}/${FILE_NAME}" \
      -H "Authorization: Bearer ${SERVICE_KEY}" \
      -H "Content-Type: ${MIME}" \
      --data-binary "@${file}")

    HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    BODY=$(echo "$RESPONSE" | head -n -1)

    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
      UPLOADED=$((UPLOADED + 1))
    else
      echo -e "    ${RED}Failed (HTTP ${HTTP_CODE}): ${BODY}${NC}"
      FAILED=$((FAILED + 1))
    fi

  done < <(find "${BACKUP_PATH}/storage" -type f -print0)

  echo ""
  echo -e "${GREEN}Storage upload complete!${NC}"
  echo "  Uploaded: ${UPLOADED}"
  echo "  Failed: ${FAILED}"
else
  echo -e "${YELLOW}[4/5] No storage folder found, skipping...${NC}"
fi

# 5. Restart storage container and verify
echo -e "${YELLOW}[5/5] Restarting storage container...${NC}"
docker restart ${STORAGE_CONTAINER} > /dev/null 2>&1 || true
sleep 3

# Verify database
echo ""
echo -e "${YELLOW}Verifying restore...${NC}"
docker exec ${DB_CONTAINER} psql -U postgres -d postgres -c "
SELECT
  'products' as table_name, COUNT(*) as rows FROM products
UNION ALL SELECT 'product_translations', COUNT(*) FROM product_translations
UNION ALL SELECT 'product_images', COUNT(*) FROM product_images
UNION ALL SELECT 'documents', COUNT(*) FROM documents
UNION ALL SELECT 'media', COUNT(*) FROM media
UNION ALL SELECT 'storage.objects', COUNT(*) FROM storage.objects
ORDER BY table_name;
" 2>/dev/null || echo "Could not verify"

# Test storage
echo ""
echo -e "${YELLOW}Testing storage access...${NC}"
TEST_FILE=$(curl -s "${SUPABASE_URL}/storage/v1/object/list/product-images" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"prefix":"","limit":1}' | \
  grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$TEST_FILE" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    "${SUPABASE_URL}/storage/v1/object/public/product-images/${TEST_FILE}")
  echo "  Test file: product-images/${TEST_FILE}"
  echo "  HTTP status: ${HTTP_CODE}"

  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "  ${GREEN}Storage is working!${NC}"
  else
    echo -e "  ${RED}Storage may have issues${NC}"
  fi
else
  echo "  No files found in product-images bucket"
fi

echo ""
echo -e "${GREEN}=== Restore Complete ===${NC}"
echo ""
echo "Summary:"
echo "  - Database restored from SQL dump"
echo "  - RLS disabled on all tables"
echo "  - GRANT permissions set for anon/authenticated/service_role"
echo "  - Storage files uploaded via API (with proper xattr)"
echo "  - Storage container restarted"
echo ""
echo "Next steps:"
echo "  1. Restart your Next.js dev server: npm run dev"
echo "  2. Verify the application works correctly"
echo "  3. Check Supabase Studio at http://127.0.0.1:54323"
