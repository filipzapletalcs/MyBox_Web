-- =====================================================
-- Migration: Unify documents translations pattern
-- Purpose: Move file_* columns from documents to document_translations
-- =====================================================

-- Add file columns to document_translations
ALTER TABLE document_translations
ADD COLUMN IF NOT EXISTS file_path TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT;

-- Add comment
COMMENT ON COLUMN document_translations.file_path IS 'Path to the file in storage bucket';
COMMENT ON COLUMN document_translations.file_size IS 'File size in bytes';

-- Migrate existing data from documents table
-- CS locale
UPDATE document_translations dt
SET
  file_path = d.file_cs,
  file_size = d.file_size_cs
FROM documents d
WHERE dt.document_id = d.id
AND dt.locale = 'cs'
AND dt.file_path IS NULL
AND d.file_cs IS NOT NULL;

-- EN locale
UPDATE document_translations dt
SET
  file_path = d.file_en,
  file_size = d.file_size_en
FROM documents d
WHERE dt.document_id = d.id
AND dt.locale = 'en'
AND dt.file_path IS NULL
AND d.file_en IS NOT NULL;

-- DE locale
UPDATE document_translations dt
SET
  file_path = d.file_de,
  file_size = d.file_size_de
FROM documents d
WHERE dt.document_id = d.id
AND dt.locale = 'de'
AND dt.file_path IS NULL
AND d.file_de IS NOT NULL;

-- Create missing translations for locales that have files but no translation record
INSERT INTO document_translations (document_id, locale, title, description, file_path, file_size)
SELECT d.id, 'cs', COALESCE(
  (SELECT title FROM document_translations WHERE document_id = d.id AND locale = 'cs'),
  d.slug
), '', d.file_cs, d.file_size_cs
FROM documents d
WHERE d.file_cs IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM document_translations dt
  WHERE dt.document_id = d.id AND dt.locale = 'cs'
)
ON CONFLICT (document_id, locale) DO UPDATE
SET file_path = EXCLUDED.file_path, file_size = EXCLUDED.file_size;

INSERT INTO document_translations (document_id, locale, title, description, file_path, file_size)
SELECT d.id, 'en', COALESCE(
  (SELECT title FROM document_translations WHERE document_id = d.id AND locale = 'en'),
  d.slug
), '', d.file_en, d.file_size_en
FROM documents d
WHERE d.file_en IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM document_translations dt
  WHERE dt.document_id = d.id AND dt.locale = 'en'
)
ON CONFLICT (document_id, locale) DO UPDATE
SET file_path = EXCLUDED.file_path, file_size = EXCLUDED.file_size;

INSERT INTO document_translations (document_id, locale, title, description, file_path, file_size)
SELECT d.id, 'de', COALESCE(
  (SELECT title FROM document_translations WHERE document_id = d.id AND locale = 'de'),
  d.slug
), '', d.file_de, d.file_size_de
FROM documents d
WHERE d.file_de IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM document_translations dt
  WHERE dt.document_id = d.id AND dt.locale = 'de'
)
ON CONFLICT (document_id, locale) DO UPDATE
SET file_path = EXCLUDED.file_path, file_size = EXCLUDED.file_size;

-- Add index for file lookups
CREATE INDEX IF NOT EXISTS idx_document_trans_file_path
  ON document_translations(file_path)
  WHERE file_path IS NOT NULL;

-- Note: Old columns (file_cs, file_en, file_de, file_size_cs, file_size_en, file_size_de)
-- are kept in documents table for backwards compatibility during transition.
-- They will be removed in a later migration after frontend/API is updated.
