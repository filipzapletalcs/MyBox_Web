-- =====================================================
-- Migration: Drop deprecated file columns from documents
-- Purpose: Complete unification of documents to use translations pattern
-- Prerequisites: Data already migrated to document_translations.file_path/file_size
-- =====================================================

-- Drop the old language-specific file columns
ALTER TABLE documents
  DROP COLUMN IF EXISTS file_cs,
  DROP COLUMN IF EXISTS file_en,
  DROP COLUMN IF EXISTS file_de,
  DROP COLUMN IF EXISTS file_size_cs,
  DROP COLUMN IF EXISTS file_size_en,
  DROP COLUMN IF EXISTS file_size_de;

-- Add NOT NULL constraint to file_path in translations (optional, for data integrity)
-- Note: Keeping nullable for backwards compatibility with documents without files

-- Add comment explaining the new pattern
COMMENT ON TABLE document_translations IS 'Document translations including file paths. file_path contains the storage path for the document in this locale.';
