-- =====================================================
-- Migration: Drop deprecated label columns from product_specifications
-- Purpose: Complete the migration to translations pattern
-- =====================================================

-- Drop old hardcoded label columns (data was migrated to product_specification_translations)
ALTER TABLE product_specifications
  DROP COLUMN IF EXISTS label_cs,
  DROP COLUMN IF EXISTS label_en,
  DROP COLUMN IF EXISTS label_de;

-- Add comment documenting the change
COMMENT ON TABLE product_specifications IS 'Product specifications - labels are now in product_specification_translations table';
