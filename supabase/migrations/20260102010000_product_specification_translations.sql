-- =====================================================
-- Migration: Create product_specification_translations table
-- Purpose: Normalize specification labels into translations pattern
-- =====================================================

-- Create translations table
CREATE TABLE IF NOT EXISTS product_specification_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specification_id UUID NOT NULL REFERENCES product_specifications(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_spec_trans_locale CHECK (locale IN ('cs', 'en', 'de')),
  CONSTRAINT uq_spec_trans_locale UNIQUE (specification_id, locale)
);

-- Add comment
COMMENT ON TABLE product_specification_translations IS 'Translations for product specification labels';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_spec_trans_specification
  ON product_specification_translations(specification_id);
CREATE INDEX IF NOT EXISTS idx_spec_trans_locale
  ON product_specification_translations(locale);

-- Migrate existing data from hardcoded columns
INSERT INTO product_specification_translations (specification_id, locale, label)
SELECT id, 'cs', label_cs
FROM product_specifications
WHERE label_cs IS NOT NULL AND label_cs != ''
ON CONFLICT (specification_id, locale) DO NOTHING;

INSERT INTO product_specification_translations (specification_id, locale, label)
SELECT id, 'en', label_en
FROM product_specifications
WHERE label_en IS NOT NULL AND label_en != ''
ON CONFLICT (specification_id, locale) DO NOTHING;

INSERT INTO product_specification_translations (specification_id, locale, label)
SELECT id, 'de', label_de
FROM product_specifications
WHERE label_de IS NOT NULL AND label_de != ''
ON CONFLICT (specification_id, locale) DO NOTHING;

-- RLS Policies
ALTER TABLE product_specification_translations ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Specification translations are viewable by everyone"
  ON product_specification_translations FOR SELECT
  USING (true);

-- Editors can manage
CREATE POLICY "Editors can manage specification translations"
  ON product_specification_translations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'editor')
    )
  );

-- Grant permissions
GRANT SELECT ON product_specification_translations TO anon;
GRANT ALL ON product_specification_translations TO authenticated;

-- Note: The old columns (label_cs, label_en, label_de) are kept for now
-- They will be removed in a future migration after verifying the new pattern works
