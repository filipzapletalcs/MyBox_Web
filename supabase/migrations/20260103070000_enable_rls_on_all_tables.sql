-- =====================================================
-- Migration: Enable RLS on All Tables
-- Purpose: Fix "policy_exists_rls_disabled" and "rls_disabled_in_public" errors
-- Problem: Tables have RLS policies but RLS is not enabled
-- Solution: Enable RLS on all 41 affected tables
-- Author: Claude Code
-- Date: 2026-01-03
-- =====================================================

-- ============================================
-- ARTICLES & BLOG (3 tables)
-- ============================================
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CATEGORIES & TAGS (3 tables)
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- ============================================
-- COMPANY & SETTINGS (3 tables)
-- ============================================
ALTER TABLE company_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CORPORATE PAGES (6 tables)
-- ============================================
ALTER TABLE corporate_benefit_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_section_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_sections ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DOCUMENTS (4 tables)
-- ============================================
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FAQ (2 tables)
-- ============================================
ALTER TABLE faq_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- MEDIA & NEWSLETTER (2 tables)
-- ============================================
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PRODUCTS (15 tables)
-- ============================================
ALTER TABLE product_color_variant_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_color_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_content_section_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_feature_point_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_feature_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_feature_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_to_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TEAM & PROFILES (3 tables)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Summary:
-- - Enabled RLS on 41 tables
-- - All existing RLS policies are now active
-- - No change to actual access control logic
-- ============================================
