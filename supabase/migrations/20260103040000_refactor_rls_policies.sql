-- =====================================================
-- Migration: Refactor RLS policies to use helper function
-- Purpose: Centralized, maintainable access control
-- Author: Claude Code
-- Date: 2026-01-03
-- =====================================================

-- Verify helper function exists
DO $$ BEGIN
  PERFORM is_editor_or_admin();
EXCEPTION
  WHEN undefined_function THEN
    RAISE EXCEPTION 'Helper function is_editor_or_admin() does not exist. Run migration 20260102040000 first.';
END $$;

-- ============================================
-- Helper function to refactor policies
-- ============================================

CREATE OR REPLACE FUNCTION refactor_editor_policies(p_table TEXT)
RETURNS VOID AS $$
BEGIN
  -- Drop all existing editor policies for this table
  EXECUTE format(
    'DROP POLICY IF EXISTS "Editors can insert %I" ON %I',
    replace(p_table, '_', ' '), p_table
  );
  EXECUTE format(
    'DROP POLICY IF EXISTS "Editors can update %I" ON %I',
    replace(p_table, '_', ' '), p_table
  );
  EXECUTE format(
    'DROP POLICY IF EXISTS "Editors can delete %I" ON %I',
    replace(p_table, '_', ' '), p_table
  );
  EXECUTE format(
    'DROP POLICY IF EXISTS "Editors can manage %I" ON %I',
    replace(p_table, '_', ' '), p_table
  );
  EXECUTE format(
    'DROP POLICY IF EXISTS "Editors can view all %I" ON %I',
    replace(p_table, '_', ' '), p_table
  );

  -- Create new consolidated policy
  EXECUTE format(
    'CREATE POLICY "Editors can manage %I" ON %I FOR ALL TO authenticated USING (is_editor_or_admin()) WITH CHECK (is_editor_or_admin())',
    replace(p_table, '_', ' '), p_table
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PRODUCTS & RELATED TABLES
-- ============================================

-- products
DROP POLICY IF EXISTS "Editors can insert products" ON products;
DROP POLICY IF EXISTS "Editors can update products" ON products;
DROP POLICY IF EXISTS "Editors can delete products" ON products;
CREATE POLICY "Editors can manage products" ON products
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_translations
DROP POLICY IF EXISTS "Editors can insert product translations" ON product_translations;
DROP POLICY IF EXISTS "Editors can update product translations" ON product_translations;
DROP POLICY IF EXISTS "Editors can delete product translations" ON product_translations;
CREATE POLICY "Editors can manage product translations" ON product_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_specifications
DROP POLICY IF EXISTS "Editors can insert product specs" ON product_specifications;
DROP POLICY IF EXISTS "Editors can update product specs" ON product_specifications;
DROP POLICY IF EXISTS "Editors can delete product specs" ON product_specifications;
CREATE POLICY "Editors can manage product specifications" ON product_specifications
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_specification_translations
DROP POLICY IF EXISTS "Editors can manage product specification translations" ON product_specification_translations;
CREATE POLICY "Editors can manage product specification translations" ON product_specification_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_images
DROP POLICY IF EXISTS "Editors can insert product images" ON product_images;
DROP POLICY IF EXISTS "Editors can update product images" ON product_images;
DROP POLICY IF EXISTS "Editors can delete product images" ON product_images;
CREATE POLICY "Editors can manage product images" ON product_images
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_features
DROP POLICY IF EXISTS "Editors can insert product features" ON product_features;
DROP POLICY IF EXISTS "Editors can update product features" ON product_features;
DROP POLICY IF EXISTS "Editors can delete product features" ON product_features;
CREATE POLICY "Editors can manage product features" ON product_features
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_feature_translations
DROP POLICY IF EXISTS "Editors can insert product feature translations" ON product_feature_translations;
DROP POLICY IF EXISTS "Editors can update product feature translations" ON product_feature_translations;
DROP POLICY IF EXISTS "Editors can delete product feature translations" ON product_feature_translations;
CREATE POLICY "Editors can manage product feature translations" ON product_feature_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_to_features
DROP POLICY IF EXISTS "Editors can insert product to features" ON product_to_features;
DROP POLICY IF EXISTS "Editors can update product to features" ON product_to_features;
DROP POLICY IF EXISTS "Editors can delete product to features" ON product_to_features;
CREATE POLICY "Editors can manage product to features" ON product_to_features
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_feature_points
DROP POLICY IF EXISTS "Editors can insert feature points" ON product_feature_points;
DROP POLICY IF EXISTS "Editors can update feature points" ON product_feature_points;
DROP POLICY IF EXISTS "Editors can delete feature points" ON product_feature_points;
CREATE POLICY "Editors can manage product feature points" ON product_feature_points
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_feature_point_translations
DROP POLICY IF EXISTS "Editors can insert feature point translations" ON product_feature_point_translations;
DROP POLICY IF EXISTS "Editors can update feature point translations" ON product_feature_point_translations;
DROP POLICY IF EXISTS "Editors can delete feature point translations" ON product_feature_point_translations;
CREATE POLICY "Editors can manage product feature point translations" ON product_feature_point_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_color_variants
DROP POLICY IF EXISTS "Editors can insert color variants" ON product_color_variants;
DROP POLICY IF EXISTS "Editors can update color variants" ON product_color_variants;
DROP POLICY IF EXISTS "Editors can delete color variants" ON product_color_variants;
CREATE POLICY "Editors can manage product color variants" ON product_color_variants
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_color_variant_translations
DROP POLICY IF EXISTS "Editors can insert color variant translations" ON product_color_variant_translations;
DROP POLICY IF EXISTS "Editors can update color variant translations" ON product_color_variant_translations;
DROP POLICY IF EXISTS "Editors can delete color variant translations" ON product_color_variant_translations;
CREATE POLICY "Editors can manage product color variant translations" ON product_color_variant_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_content_sections
DROP POLICY IF EXISTS "Editors can insert content sections" ON product_content_sections;
DROP POLICY IF EXISTS "Editors can update content sections" ON product_content_sections;
DROP POLICY IF EXISTS "Editors can delete content sections" ON product_content_sections;
CREATE POLICY "Editors can manage product content sections" ON product_content_sections
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_content_section_translations
DROP POLICY IF EXISTS "Editors can insert content section translations" ON product_content_section_translations;
DROP POLICY IF EXISTS "Editors can update content section translations" ON product_content_section_translations;
DROP POLICY IF EXISTS "Editors can delete content section translations" ON product_content_section_translations;
CREATE POLICY "Editors can manage product content section translations" ON product_content_section_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- product_documents
DROP POLICY IF EXISTS "Editors can insert product documents" ON product_documents;
DROP POLICY IF EXISTS "Editors can update product documents" ON product_documents;
DROP POLICY IF EXISTS "Editors can delete product documents" ON product_documents;
CREATE POLICY "Editors can manage product documents" ON product_documents
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- ============================================
-- ARTICLES & BLOG
-- ============================================

-- articles (Note: authors have separate policies for own content)
DROP POLICY IF EXISTS "Editors can delete articles" ON articles;
CREATE POLICY "Editors can manage articles" ON articles
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- article_translations
DROP POLICY IF EXISTS "Editors can manage article translations" ON article_translations;
CREATE POLICY "Editors can manage article translations" ON article_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- categories
DROP POLICY IF EXISTS "Editors can manage categories" ON categories;
DROP POLICY IF EXISTS "Editors can update categories" ON categories;
DROP POLICY IF EXISTS "Editors can delete categories" ON categories;
CREATE POLICY "Editors can manage categories" ON categories
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- category_translations
DROP POLICY IF EXISTS "Editors can insert category translations" ON category_translations;
DROP POLICY IF EXISTS "Editors can update category translations" ON category_translations;
DROP POLICY IF EXISTS "Editors can delete category translations" ON category_translations;
CREATE POLICY "Editors can manage category translations" ON category_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- tags
DROP POLICY IF EXISTS "Editors can insert tags" ON tags;
DROP POLICY IF EXISTS "Editors can update tags" ON tags;
DROP POLICY IF EXISTS "Editors can delete tags" ON tags;
CREATE POLICY "Editors can manage tags" ON tags
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- ============================================
-- FAQS
-- ============================================

DROP POLICY IF EXISTS "Editors can insert FAQs" ON faqs;
DROP POLICY IF EXISTS "Editors can update FAQs" ON faqs;
DROP POLICY IF EXISTS "Editors can delete FAQs" ON faqs;
CREATE POLICY "Editors can manage FAQs" ON faqs
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

DROP POLICY IF EXISTS "Editors can insert FAQ translations" ON faq_translations;
DROP POLICY IF EXISTS "Editors can update FAQ translations" ON faq_translations;
DROP POLICY IF EXISTS "Editors can delete FAQ translations" ON faq_translations;
CREATE POLICY "Editors can manage FAQ translations" ON faq_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- ============================================
-- CORPORATE PAGES
-- ============================================

DROP POLICY IF EXISTS "Editors can insert corporate pages" ON corporate_pages;
DROP POLICY IF EXISTS "Editors can update corporate pages" ON corporate_pages;
DROP POLICY IF EXISTS "Editors can delete corporate pages" ON corporate_pages;
DROP POLICY IF EXISTS "Editors can view all corporate pages" ON corporate_pages;
CREATE POLICY "Editors can manage corporate pages" ON corporate_pages
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

DROP POLICY IF EXISTS "Editors can insert corporate page translations" ON corporate_page_translations;
DROP POLICY IF EXISTS "Editors can update corporate page translations" ON corporate_page_translations;
DROP POLICY IF EXISTS "Editors can delete corporate page translations" ON corporate_page_translations;
DROP POLICY IF EXISTS "Editors can view all corporate page translations" ON corporate_page_translations;
CREATE POLICY "Editors can manage corporate page translations" ON corporate_page_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

DROP POLICY IF EXISTS "Editors can insert corporate sections" ON corporate_sections;
DROP POLICY IF EXISTS "Editors can update corporate sections" ON corporate_sections;
DROP POLICY IF EXISTS "Editors can delete corporate sections" ON corporate_sections;
DROP POLICY IF EXISTS "Editors can view all corporate sections" ON corporate_sections;
CREATE POLICY "Editors can manage corporate sections" ON corporate_sections
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

DROP POLICY IF EXISTS "Editors can insert corporate section translations" ON corporate_section_translations;
DROP POLICY IF EXISTS "Editors can update corporate section translations" ON corporate_section_translations;
DROP POLICY IF EXISTS "Editors can delete corporate section translations" ON corporate_section_translations;
DROP POLICY IF EXISTS "Editors can view all corporate section translations" ON corporate_section_translations;
CREATE POLICY "Editors can manage corporate section translations" ON corporate_section_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

DROP POLICY IF EXISTS "Editors can insert corporate benefits" ON corporate_benefits;
DROP POLICY IF EXISTS "Editors can update corporate benefits" ON corporate_benefits;
DROP POLICY IF EXISTS "Editors can delete corporate benefits" ON corporate_benefits;
DROP POLICY IF EXISTS "Editors can view all corporate benefits" ON corporate_benefits;
CREATE POLICY "Editors can manage corporate benefits" ON corporate_benefits
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

DROP POLICY IF EXISTS "Editors can insert corporate benefit translations" ON corporate_benefit_translations;
DROP POLICY IF EXISTS "Editors can update corporate benefit translations" ON corporate_benefit_translations;
DROP POLICY IF EXISTS "Editors can delete corporate benefit translations" ON corporate_benefit_translations;
DROP POLICY IF EXISTS "Editors can view all corporate benefit translations" ON corporate_benefit_translations;
CREATE POLICY "Editors can manage corporate benefit translations" ON corporate_benefit_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- ============================================
-- ACCESSORIES
-- ============================================

DROP POLICY IF EXISTS "Editors can manage accessories" ON accessories;
DROP POLICY IF EXISTS "Editors can view all accessories" ON accessories;
CREATE POLICY "Editors can manage accessories" ON accessories
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

DROP POLICY IF EXISTS "Editors can manage accessory translations" ON accessory_translations;
CREATE POLICY "Editors can manage accessory translations" ON accessory_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

DROP POLICY IF EXISTS "Editors can manage product accessories" ON product_accessories;
CREATE POLICY "Editors can manage product accessories" ON product_accessories
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- ============================================
-- TEAM & COMPANY
-- ============================================

DROP POLICY IF EXISTS "Editors can manage team members" ON team_members;
DROP POLICY IF EXISTS "Editors can view all team members" ON team_members;
CREATE POLICY "Editors can manage team members" ON team_members
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

DROP POLICY IF EXISTS "Editors can manage team member translations" ON team_member_translations;
CREATE POLICY "Editors can manage team member translations" ON team_member_translations
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

DROP POLICY IF EXISTS "Editors can manage company details" ON company_details;
CREATE POLICY "Editors can manage company details" ON company_details
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- ============================================
-- MEDIA
-- ============================================

DROP POLICY IF EXISTS "Editors can insert media" ON media;
DROP POLICY IF EXISTS "Editors can update media" ON media;
DROP POLICY IF EXISTS "Editors can delete media" ON media;
CREATE POLICY "Editors can manage media" ON media
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());

-- ============================================
-- CONTACT (Admin only)
-- ============================================

DROP POLICY IF EXISTS "Editors can manage contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Editors can view contact submissions" ON contact_submissions;
CREATE POLICY "Admins can manage contact submissions" ON contact_submissions
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- CLEANUP
-- ============================================

DROP FUNCTION IF EXISTS refactor_editor_policies(TEXT);

-- Add index for better policy performance
CREATE INDEX IF NOT EXISTS idx_profiles_role_admin_editor
  ON profiles(role)
  WHERE role IN ('admin', 'editor');

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND policyname LIKE 'Editors can manage%';

  RAISE NOTICE 'Created % consolidated editor management policies', policy_count;
END $$;
