#!/bin/bash
#
# MyBox Backup Script v2
# Creates full backup of database and storage using Supabase API
# Preserves all metadata including xattr for storage files
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
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="mybox_backup_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

# Supabase configuration
SUPABASE_URL="http://127.0.0.1:54321"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

# Docker containers
DB_CONTAINER="supabase_db_mybox-eco"

echo -e "${GREEN}=== MyBox Backup v2 ===${NC}"
echo "Backup location: ${BACKUP_PATH}"
echo ""

# Create backup directory
mkdir -p "${BACKUP_PATH}/storage"

# 1. Backup PostgreSQL database
echo -e "${YELLOW}[1/5] Backing up PostgreSQL database...${NC}"
docker exec ${DB_CONTAINER} pg_dump -U postgres -d postgres \
  --no-owner \
  --clean \
  --if-exists \
  > "${BACKUP_PATH}/database.sql"

# 2. Backup storage.objects table separately (for verification)
echo -e "${YELLOW}[2/5] Backing up storage.objects metadata...${NC}"
docker exec ${DB_CONTAINER} psql -U postgres -d postgres -c "
COPY (
  SELECT id, bucket_id, name, owner, created_at, updated_at, last_accessed_at,
         metadata::text, path_tokens, version, owner_id
  FROM storage.objects
) TO STDOUT WITH CSV HEADER
" > "${BACKUP_PATH}/storage_objects.csv"

# Count storage objects
STORAGE_OBJECTS_COUNT=$(tail -n +2 "${BACKUP_PATH}/storage_objects.csv" | wc -l | tr -d ' ')
echo "  Found ${STORAGE_OBJECTS_COUNT} objects in storage.objects"

# 2b. Backup articles and translations (TipTap content as JSON)
echo -e "${YELLOW}[2b/5] Backing up articles and translations...${NC}"
mkdir -p "${BACKUP_PATH}/content"

# Export articles table
docker exec ${DB_CONTAINER} psql -U postgres -d postgres -c "
COPY (
  SELECT id, slug, status, published_at, author_id, category_id,
         featured_image_url, is_featured, view_count, created_at, updated_at
  FROM articles
) TO STDOUT WITH CSV HEADER
" > "${BACKUP_PATH}/content/articles.csv"
ARTICLES_COUNT=$(tail -n +2 "${BACKUP_PATH}/content/articles.csv" | wc -l | tr -d ' ')
echo "  Found ${ARTICLES_COUNT} articles"

# Export article_translations with TipTap content as JSON
docker exec ${DB_CONTAINER} psql -U postgres -d postgres -t -A -c "
SELECT json_agg(row_to_json(t))
FROM (
  SELECT id, article_id, locale, title, excerpt, content, seo_title, seo_description
  FROM article_translations
) t
" > "${BACKUP_PATH}/content/article_translations.json"
ARTICLE_TRANS_COUNT=$(docker exec ${DB_CONTAINER} psql -U postgres -d postgres -t -A -c "SELECT COUNT(*) FROM article_translations")
echo "  Found ${ARTICLE_TRANS_COUNT} article translations"

# Export categories
docker exec ${DB_CONTAINER} psql -U postgres -d postgres -c "
COPY (SELECT * FROM categories) TO STDOUT WITH CSV HEADER
" > "${BACKUP_PATH}/content/categories.csv"

# Export category_translations
docker exec ${DB_CONTAINER} psql -U postgres -d postgres -c "
COPY (SELECT * FROM category_translations) TO STDOUT WITH CSV HEADER
" > "${BACKUP_PATH}/content/category_translations.csv"

# Export tags
docker exec ${DB_CONTAINER} psql -U postgres -d postgres -c "
COPY (SELECT * FROM tags) TO STDOUT WITH CSV HEADER
" > "${BACKUP_PATH}/content/tags.csv"

# Export article_tags (M:N relationship)
docker exec ${DB_CONTAINER} psql -U postgres -d postgres -c "
COPY (SELECT * FROM article_tags) TO STDOUT WITH CSV HEADER
" > "${BACKUP_PATH}/content/article_tags.csv"

echo "  Categories, tags and relationships exported"

# 3. Download storage files via Supabase API
echo -e "${YELLOW}[3/5] Downloading storage files via API...${NC}"

# Get list of buckets
BUCKETS=$(curl -s "${SUPABASE_URL}/storage/v1/bucket" \
  -H "Authorization: Bearer ${SERVICE_KEY}" | \
  grep -o '"name":"[^"]*"' | cut -d'"' -f4)

TOTAL_FILES=0
TOTAL_SIZE=0

# Function to recursively download files from a prefix
download_prefix() {
  local bucket="$1"
  local prefix="$2"

  # Get all items at this prefix
  local RESPONSE=$(curl -s "${SUPABASE_URL}/storage/v1/object/list/${bucket}" \
    -H "Authorization: Bearer ${SERVICE_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"prefix\":\"${prefix}\",\"limit\":1000}")

  # Parse JSON response - extract name and id (id is null for folders)
  # Items with "id":null are folders, items with "id":"uuid" are files
  echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for item in data:
        name = item.get('name', '')
        item_id = item.get('id')
        if item_id is None:
            print('DIR:' + name)
        else:
            print('FILE:' + name)
except:
    pass
" | while read -r line; do
    local TYPE="${line%%:*}"
    local NAME="${line#*:}"

    [ -z "$NAME" ] && continue

    if [ "$TYPE" = "DIR" ]; then
      # Recursively process subdirectory
      local new_prefix="${prefix}${NAME}/"
      download_prefix "$bucket" "$new_prefix"
    else
      # Download file
      local full_path="${prefix}${NAME}"
      local OUTPUT_FILE="${BACKUP_PATH}/storage/${bucket}/${full_path}"
      mkdir -p "$(dirname "$OUTPUT_FILE")"

      HTTP_CODE=$(curl -s -w "%{http_code}" -o "$OUTPUT_FILE" \
        "${SUPABASE_URL}/storage/v1/object/${bucket}/${full_path}" \
        -H "Authorization: Bearer ${SERVICE_KEY}")

      if [ "$HTTP_CODE" = "200" ]; then
        FILE_SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE" 2>/dev/null || echo "0")
        echo "DOWNLOADED:${FILE_SIZE}:${full_path}"
      else
        echo -e "    ${RED}Failed: ${full_path} (HTTP ${HTTP_CODE})${NC}" >&2
        rm -f "$OUTPUT_FILE"
      fi
    fi
  done
}

for bucket in $BUCKETS; do
  echo -e "${BLUE}  Bucket: ${bucket}${NC}"
  mkdir -p "${BACKUP_PATH}/storage/${bucket}"

  # Download all files recursively
  RESULTS=$(download_prefix "$bucket" "")

  # Count results
  while IFS= read -r line; do
    if [[ "$line" == DOWNLOADED:* ]]; then
      SIZE=$(echo "$line" | cut -d: -f2)
      FILE=$(echo "$line" | cut -d: -f3-)
      TOTAL_SIZE=$((TOTAL_SIZE + SIZE))
      TOTAL_FILES=$((TOTAL_FILES + 1))
      echo "    Downloaded: ${FILE}"
    fi
  done <<< "$RESULTS"
done

echo "  Total files downloaded: ${TOTAL_FILES}"

# 4. Get comprehensive database statistics
echo -e "${YELLOW}[4/5] Getting database statistics...${NC}"
docker exec ${DB_CONTAINER} psql -U postgres -d postgres -c "
SELECT
  'products' as table_name, COUNT(*) as rows FROM products
UNION ALL SELECT 'product_translations', COUNT(*) FROM product_translations
UNION ALL SELECT 'product_images', COUNT(*) FROM product_images
UNION ALL SELECT 'product_features', COUNT(*) FROM product_features
UNION ALL SELECT 'product_feature_translations', COUNT(*) FROM product_feature_translations
UNION ALL SELECT 'product_content_sections', COUNT(*) FROM product_content_sections
UNION ALL SELECT 'product_content_section_translations', COUNT(*) FROM product_content_section_translations
UNION ALL SELECT 'product_specifications', COUNT(*) FROM product_specifications
UNION ALL SELECT 'product_specification_translations', COUNT(*) FROM product_specification_translations
UNION ALL SELECT 'documents', COUNT(*) FROM documents
UNION ALL SELECT 'document_translations', COUNT(*) FROM document_translations
UNION ALL SELECT 'product_documents', COUNT(*) FROM product_documents
UNION ALL SELECT 'accessories', COUNT(*) FROM accessories
UNION ALL SELECT 'accessory_translations', COUNT(*) FROM accessory_translations
UNION ALL SELECT 'product_accessories', COUNT(*) FROM product_accessories
UNION ALL SELECT 'articles', COUNT(*) FROM articles
UNION ALL SELECT 'article_translations', COUNT(*) FROM article_translations
UNION ALL SELECT 'article_tags', COUNT(*) FROM article_tags
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'category_translations', COUNT(*) FROM category_translations
UNION ALL SELECT 'tags', COUNT(*) FROM tags
UNION ALL SELECT 'media', COUNT(*) FROM media
UNION ALL SELECT 'storage.objects', COUNT(*) FROM storage.objects
UNION ALL SELECT 'storage.buckets', COUNT(*) FROM storage.buckets
ORDER BY table_name;
" > "${BACKUP_PATH}/stats.txt" 2>/dev/null || echo "Could not get stats"

# 5. Create metadata file
echo -e "${YELLOW}[5/5] Creating metadata...${NC}"

# Calculate human-readable size
if [ $TOTAL_SIZE -gt 1048576 ]; then
  SIZE_HUMAN="$((TOTAL_SIZE / 1048576)) MB"
elif [ $TOTAL_SIZE -gt 1024 ]; then
  SIZE_HUMAN="$((TOTAL_SIZE / 1024)) KB"
else
  SIZE_HUMAN="${TOTAL_SIZE} B"
fi

cat > "${BACKUP_PATH}/metadata.json" << EOF
{
  "backup_name": "${BACKUP_NAME}",
  "backup_version": "2.0",
  "created_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "created_at_local": "$(date +"%Y-%m-%d %H:%M:%S")",
  "database_container": "${DB_CONTAINER}",
  "storage_files_count": ${TOTAL_FILES},
  "storage_objects_count": ${STORAGE_OBJECTS_COUNT},
  "storage_total_size": ${TOTAL_SIZE},
  "storage_total_size_human": "${SIZE_HUMAN}",
  "hostname": "$(hostname)",
  "supabase_url": "${SUPABASE_URL}",
  "notes": "Storage files downloaded via Supabase API to preserve metadata"
}
EOF

# Create compressed archive
echo -e "${YELLOW}Creating compressed archive...${NC}"
cd "${BACKUP_DIR}"
tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"

# Calculate sizes
SQL_SIZE=$(du -h "${BACKUP_PATH}/database.sql" | cut -f1)
STORAGE_SIZE=$(du -sh "${BACKUP_PATH}/storage" 2>/dev/null | cut -f1 || echo "0")
ARCHIVE_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -f1)

# Summary
echo ""
echo -e "${GREEN}=== Backup Complete ===${NC}"
echo "Location: ${BACKUP_PATH}"
echo "Archive:  ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz (${ARCHIVE_SIZE})"
echo ""
CONTENT_SIZE=$(du -sh "${BACKUP_PATH}/content" 2>/dev/null | cut -f1 || echo "0")

echo "Contents:"
echo "  - Database SQL: ${SQL_SIZE}"
echo "  - Storage CSV:  $(du -h "${BACKUP_PATH}/storage_objects.csv" | cut -f1) (${STORAGE_OBJECTS_COUNT} records)"
echo "  - Storage files: ${STORAGE_SIZE} (${TOTAL_FILES} files)"
echo "  - Content exports: ${CONTENT_SIZE} (${ARTICLES_COUNT} articles, ${ARTICLE_TRANS_COUNT} translations)"
echo ""
echo -e "${GREEN}Database statistics:${NC}"
cat "${BACKUP_PATH}/stats.txt" 2>/dev/null || echo "N/A"
echo ""

# Cleanup old backups (keep last 5)
echo -e "${YELLOW}Cleaning up old backups (keeping last 5)...${NC}"
cd "${BACKUP_DIR}"
ls -dt mybox_backup_* 2>/dev/null | grep -v ".tar.gz" | tail -n +6 | xargs rm -rf 2>/dev/null || true
ls -t mybox_backup_*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true

echo -e "${GREEN}Done!${NC}"
