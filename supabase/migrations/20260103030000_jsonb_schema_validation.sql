-- =====================================================
-- Migration: Add JSONB schema validation for TipTap content
-- Purpose: Ensure content has valid TipTap document structure
-- Author: Claude Code
-- Date: 2026-01-03
-- =====================================================

-- TipTap documents have structure: { "type": "doc", "content": [...] }
-- This constraint validates the basic structure

ALTER TABLE article_translations
ADD CONSTRAINT chk_content_tiptap_schema
CHECK (
  content IS NULL OR (
    jsonb_typeof(content) = 'object' AND
    content ? 'type' AND
    content->>'type' = 'doc'
  )
);

COMMENT ON CONSTRAINT chk_content_tiptap_schema ON article_translations IS
'Validates TipTap document structure: content must be an object with type="doc"';
