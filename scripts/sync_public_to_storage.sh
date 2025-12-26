#!/bin/bash
# Sync missing files from public folder to Supabase storage

SUPABASE_URL="http://127.0.0.1:54321"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
PUBLIC_DIR="/Users/filipzapletal/MyBox_Web_26/mybox-eco/public"

UPLOADED=0
FAILED=0

# Upload profi gallery
echo "Uploading profi gallery..."
for file in "$PUBLIC_DIR"/images/products/profi/gallery/*; do
  [ -f "$file" ] || continue
  filename=$(basename "$file")

  EXT="${filename##*.}"
  case "$EXT" in
    png) MIME="image/png" ;;
    jpg|jpeg) MIME="image/jpeg" ;;
    webp) MIME="image/webp" ;;
    *) MIME="application/octet-stream" ;;
  esac

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    "${SUPABASE_URL}/storage/v1/object/product-images/profi/gallery/${filename}" \
    -H "Authorization: Bearer ${SERVICE_KEY}" \
    -H "Content-Type: ${MIME}" \
    --data-binary "@${file}")

  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    UPLOADED=$((UPLOADED + 1))
    echo "✓ profi/gallery/${filename}"
  else
    FAILED=$((FAILED + 1))
    echo "✗ profi/gallery/${filename} (HTTP ${HTTP_CODE})"
  fi
done

# Upload profi root images
echo "Uploading profi root images..."
for file in "$PUBLIC_DIR"/images/products/profi/*.{png,webp,jpg} 2>/dev/null; do
  [ -f "$file" ] || continue
  filename=$(basename "$file")

  EXT="${filename##*.}"
  case "$EXT" in
    png) MIME="image/png" ;;
    jpg|jpeg) MIME="image/jpeg" ;;
    webp) MIME="image/webp" ;;
    *) MIME="application/octet-stream" ;;
  esac

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    "${SUPABASE_URL}/storage/v1/object/product-images/profi/${filename}" \
    -H "Authorization: Bearer ${SERVICE_KEY}" \
    -H "Content-Type: ${MIME}" \
    --data-binary "@${file}")

  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    UPLOADED=$((UPLOADED + 1))
    echo "✓ profi/${filename}"
  else
    FAILED=$((FAILED + 1))
    echo "✗ profi/${filename} (HTTP ${HTTP_CODE})"
  fi
done

# Upload logos
echo "Uploading logos..."
if [ -d "$PUBLIC_DIR/images/logos" ]; then
  for file in "$PUBLIC_DIR"/images/logos/*; do
    [ -f "$file" ] || continue
    filename=$(basename "$file")

    EXT="${filename##*.}"
    case "$EXT" in
      svg) MIME="image/svg+xml" ;;
      png) MIME="image/png" ;;
      *) MIME="application/octet-stream" ;;
    esac

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
      "${SUPABASE_URL}/storage/v1/object/media/logos/${filename}" \
      -H "Authorization: Bearer ${SERVICE_KEY}" \
      -H "Content-Type: ${MIME}" \
      --data-binary "@${file}")

    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
      UPLOADED=$((UPLOADED + 1))
      echo "✓ logos/${filename}"
    else
      FAILED=$((FAILED + 1))
      echo "✗ logos/${filename} (HTTP ${HTTP_CODE})"
    fi
  done
fi

# Upload videos
echo "Uploading videos..."
if [ -d "$PUBLIC_DIR/videos" ]; then
  for file in "$PUBLIC_DIR"/videos/*.mp4; do
    [ -f "$file" ] || continue
    filename=$(basename "$file")

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
      "${SUPABASE_URL}/storage/v1/object/media/videos/${filename}" \
      -H "Authorization: Bearer ${SERVICE_KEY}" \
      -H "Content-Type: video/mp4" \
      --data-binary "@${file}")

    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
      UPLOADED=$((UPLOADED + 1))
      echo "✓ videos/${filename}"
    else
      FAILED=$((FAILED + 1))
      echo "✗ videos/${filename} (HTTP ${HTTP_CODE})"
    fi
  done
fi

echo ""
echo "Uploaded: $UPLOADED, Failed: $FAILED"
