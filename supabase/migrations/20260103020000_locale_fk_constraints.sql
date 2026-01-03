-- =====================================================
-- Migration: Replace CHECK constraints with FK to supported_locales
-- Purpose: Flexible locale management - add new locale = just INSERT
-- Author: Claude Code
-- Date: 2026-01-03
-- =====================================================

-- Verify supported_locales table exists and has data
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM supported_locales WHERE code = 'cs') THEN
    RAISE EXCEPTION 'supported_locales table is empty. Run migration 20260102000000 first.';
  END IF;
END $$;

-- ============================================
-- DROP CHECK CONSTRAINTS
-- ============================================

-- accessory_translations
ALTER TABLE accessory_translations
  DROP CONSTRAINT IF EXISTS accessory_translations_locale_check;

-- article_translations
ALTER TABLE article_translations
  DROP CONSTRAINT IF EXISTS article_translations_locale_check;

-- category_translations
ALTER TABLE category_translations
  DROP CONSTRAINT IF EXISTS category_translations_locale_check;

-- corporate_benefit_translations
ALTER TABLE corporate_benefit_translations
  DROP CONSTRAINT IF EXISTS chk_corporate_benefit_trans_locale;

-- corporate_page_translations
ALTER TABLE corporate_page_translations
  DROP CONSTRAINT IF EXISTS chk_corporate_page_trans_locale;

-- corporate_section_translations
ALTER TABLE corporate_section_translations
  DROP CONSTRAINT IF EXISTS chk_corporate_section_trans_locale;

-- document_category_translations
ALTER TABLE document_category_translations
  DROP CONSTRAINT IF EXISTS document_category_translations_locale_check;

-- document_translations
ALTER TABLE document_translations
  DROP CONSTRAINT IF EXISTS document_translations_locale_check;

-- documents (fallback_locale)
ALTER TABLE documents
  DROP CONSTRAINT IF EXISTS documents_fallback_locale_check;

-- faq_translations
ALTER TABLE faq_translations
  DROP CONSTRAINT IF EXISTS faq_translations_locale_check;

-- newsletter_subscribers
ALTER TABLE newsletter_subscribers
  DROP CONSTRAINT IF EXISTS newsletter_subscribers_locale_check;

-- product_color_variant_translations
ALTER TABLE product_color_variant_translations
  DROP CONSTRAINT IF EXISTS product_color_variant_translations_locale_check;

-- product_content_section_translations
ALTER TABLE product_content_section_translations
  DROP CONSTRAINT IF EXISTS product_content_section_translations_locale_check;

-- product_feature_point_translations
ALTER TABLE product_feature_point_translations
  DROP CONSTRAINT IF EXISTS product_feature_point_translations_locale_check;

-- product_feature_translations
ALTER TABLE product_feature_translations
  DROP CONSTRAINT IF EXISTS product_feature_translations_locale_check;

-- product_specification_translations
ALTER TABLE product_specification_translations
  DROP CONSTRAINT IF EXISTS chk_spec_trans_locale;

-- product_translations
ALTER TABLE product_translations
  DROP CONSTRAINT IF EXISTS product_translations_locale_check;

-- team_member_translations
ALTER TABLE team_member_translations
  DROP CONSTRAINT IF EXISTS team_member_translations_locale_check;

-- ============================================
-- ADD FOREIGN KEY CONSTRAINTS
-- ============================================

-- accessory_translations
ALTER TABLE accessory_translations
  ADD CONSTRAINT fk_accessory_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- article_translations
ALTER TABLE article_translations
  ADD CONSTRAINT fk_article_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- category_translations
ALTER TABLE category_translations
  ADD CONSTRAINT fk_category_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- corporate_benefit_translations
ALTER TABLE corporate_benefit_translations
  ADD CONSTRAINT fk_corporate_benefit_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- corporate_page_translations
ALTER TABLE corporate_page_translations
  ADD CONSTRAINT fk_corporate_page_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- corporate_section_translations
ALTER TABLE corporate_section_translations
  ADD CONSTRAINT fk_corporate_section_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- document_category_translations
ALTER TABLE document_category_translations
  ADD CONSTRAINT fk_document_category_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- document_translations
ALTER TABLE document_translations
  ADD CONSTRAINT fk_document_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- documents (fallback_locale)
ALTER TABLE documents
  ADD CONSTRAINT fk_documents_fallback_locale
  FOREIGN KEY (fallback_locale) REFERENCES supported_locales(code);

-- faq_translations
ALTER TABLE faq_translations
  ADD CONSTRAINT fk_faq_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- newsletter_subscribers
ALTER TABLE newsletter_subscribers
  ADD CONSTRAINT fk_newsletter_subscribers_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- product_color_variant_translations
ALTER TABLE product_color_variant_translations
  ADD CONSTRAINT fk_product_color_variant_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- product_content_section_translations
ALTER TABLE product_content_section_translations
  ADD CONSTRAINT fk_product_content_section_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- product_feature_point_translations
ALTER TABLE product_feature_point_translations
  ADD CONSTRAINT fk_product_feature_point_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- product_feature_translations
ALTER TABLE product_feature_translations
  ADD CONSTRAINT fk_product_feature_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- product_specification_translations
ALTER TABLE product_specification_translations
  ADD CONSTRAINT fk_product_specification_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- product_translations
ALTER TABLE product_translations
  ADD CONSTRAINT fk_product_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- team_member_translations
ALTER TABLE team_member_translations
  ADD CONSTRAINT fk_team_member_translations_locale
  FOREIGN KEY (locale) REFERENCES supported_locales(code);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON CONSTRAINT fk_article_translations_locale ON article_translations IS
'Ensures locale exists in supported_locales table. Add new language by INSERT into supported_locales.';

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
DECLARE
  fk_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO fk_count
  FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY'
    AND constraint_name LIKE 'fk_%_locale';

  IF fk_count < 17 THEN
    RAISE WARNING 'Expected at least 17 FK constraints, found %', fk_count;
  ELSE
    RAISE NOTICE 'Successfully added % FK constraints for locales', fk_count;
  END IF;
END $$;
