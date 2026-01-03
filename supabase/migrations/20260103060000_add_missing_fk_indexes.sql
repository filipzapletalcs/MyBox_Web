-- =====================================================
-- Migration: Add Missing Foreign Key Indexes
-- Purpose: Fix "unindexed_foreign_keys" linter warnings
-- Benefit: Improves JOIN performance and DELETE cascade operations
-- Author: Claude Code
-- Date: 2026-01-03
-- =====================================================

-- ============================================
-- ARTICLE TAGS
-- ============================================

-- article_tags.tag_id -> tags(id)
CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id
  ON article_tags(tag_id);

-- ============================================
-- LOCALE FOREIGN KEYS
-- All *_translations tables have locale FK to supported_locales
-- ============================================

-- article_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_article_translations_locale
  ON article_translations(locale);

-- category_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_category_translations_locale
  ON category_translations(locale);

-- corporate_benefit_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_corporate_benefit_translations_locale
  ON corporate_benefit_translations(locale);

-- corporate_page_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_corporate_page_translations_locale
  ON corporate_page_translations(locale);

-- corporate_section_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_corporate_section_translations_locale
  ON corporate_section_translations(locale);

-- faq_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_faq_translations_locale
  ON faq_translations(locale);

-- product_color_variant_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_product_color_variant_translations_locale
  ON product_color_variant_translations(locale);

-- product_content_section_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_product_content_section_translations_locale
  ON product_content_section_translations(locale);

-- product_feature_point_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_product_feature_point_translations_locale
  ON product_feature_point_translations(locale);

-- product_feature_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_product_feature_translations_locale
  ON product_feature_translations(locale);

-- product_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_product_translations_locale
  ON product_translations(locale);

-- team_member_translations.locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_team_member_translations_locale
  ON team_member_translations(locale);

-- ============================================
-- DOCUMENTS
-- ============================================

-- documents.fallback_locale -> supported_locales(code)
CREATE INDEX IF NOT EXISTS idx_documents_fallback_locale
  ON documents(fallback_locale);

-- ============================================
-- PRODUCT RELATIONS
-- ============================================

-- product_images.product_id -> products(id)
CREATE INDEX IF NOT EXISTS idx_product_images_product_id
  ON product_images(product_id);

-- product_to_features.feature_id -> product_features(id)
CREATE INDEX IF NOT EXISTS idx_product_to_features_feature_id
  ON product_to_features(feature_id);

-- ============================================
-- Summary:
-- - Added 16 indexes for unindexed foreign keys
-- - Improves query performance for:
--   - JOIN operations on translation tables by locale
--   - CASCADE DELETE operations
--   - Filtering by foreign key columns
-- ============================================
