#!/bin/bash
BACKUP_PATH="/Users/filipzapletal/MyBox_Web_26/backups/mybox_backup_20251225_225240/storage"
SUPABASE_URL="http://127.0.0.1:54321"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

UPLOADED=0
FAILED=0

for file in $(find "$BACKUP_PATH" -type f); do
  REL_PATH="${file#$BACKUP_PATH/}"
  BUCKET=$(echo "$REL_PATH" | cut -d'/' -f1)
  FILE_NAME=$(echo "$REL_PATH" | cut -d'/' -f2-)

  [ -z "$BUCKET" ] || [ -z "$FILE_NAME" ] && continue

  # Detect mime type
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

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    "${SUPABASE_URL}/storage/v1/object/${BUCKET}/${FILE_NAME}" \
    -H "Authorization: Bearer ${SERVICE_KEY}" \
    -H "Content-Type: ${MIME}" \
    --data-binary "@${file}")

  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    UPLOADED=$((UPLOADED + 1))
    echo "✓ ${BUCKET}/${FILE_NAME}"
  else
    FAILED=$((FAILED + 1))
    echo "✗ ${BUCKET}/${FILE_NAME} (HTTP ${HTTP_CODE})"
  fi
done

echo ""
echo "Uploaded: $UPLOADED, Failed: $FAILED"
