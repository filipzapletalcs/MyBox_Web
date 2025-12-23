-- =====================================================
-- FIX RLS PERFORMANCE WARNINGS
-- 1. auth_rls_initplan - wrap auth.uid() in (select ...)
-- 2. multiple_permissive_policies - merge duplicate SELECT policies
-- =====================================================

-- =====================================================
-- PROFILES
-- =====================================================

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING ((select auth.uid()) = id);

-- =====================================================
-- CATEGORIES - merge SELECT policies
-- =====================================================

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Editors can manage categories" ON public.categories;
-- Drop policies from previous fix migration (20241223140000)
DROP POLICY IF EXISTS "Editors can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Editors can update categories" ON public.categories;
DROP POLICY IF EXISTS "Editors can delete categories" ON public.categories;

-- Public SELECT for everyone (no auth needed)
CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

-- Editors can INSERT, UPDATE, DELETE
CREATE POLICY "Editors can manage categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete categories"
    ON public.categories FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- CATEGORY_TRANSLATIONS - merge SELECT policies
-- =====================================================

DROP POLICY IF EXISTS "Category translations are viewable by everyone" ON public.category_translations;
DROP POLICY IF EXISTS "Editors can manage category translations" ON public.category_translations;
-- Drop policies from previous fix migration (20241223140000)
DROP POLICY IF EXISTS "Editors can insert category translations" ON public.category_translations;
DROP POLICY IF EXISTS "Editors can update category translations" ON public.category_translations;
DROP POLICY IF EXISTS "Editors can delete category translations" ON public.category_translations;

CREATE POLICY "Category translations are viewable by everyone"
    ON public.category_translations FOR SELECT
    USING (true);

CREATE POLICY "Editors can insert category translations"
    ON public.category_translations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update category translations"
    ON public.category_translations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete category translations"
    ON public.category_translations FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- TAGS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage tags" ON public.tags;

CREATE POLICY "Editors can insert tags"
    ON public.tags FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update tags"
    ON public.tags FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete tags"
    ON public.tags FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- ARTICLES - merge SELECT policies
-- =====================================================

DROP POLICY IF EXISTS "Published articles are viewable by everyone" ON public.articles;
DROP POLICY IF EXISTS "Authors can view own articles" ON public.articles;
DROP POLICY IF EXISTS "Editors can view all articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can create articles" ON public.articles;
DROP POLICY IF EXISTS "Authors can update own articles" ON public.articles;
DROP POLICY IF EXISTS "Editors can delete articles" ON public.articles;

-- Merged SELECT policy: published OR own OR editor
CREATE POLICY "Articles viewable policy"
    ON public.articles FOR SELECT
    USING (
        status = 'published'
        OR author_id = (select auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Authenticated users can create articles"
    ON public.articles FOR INSERT
    TO authenticated
    WITH CHECK (author_id = (select auth.uid()));

CREATE POLICY "Authors can update own articles"
    ON public.articles FOR UPDATE
    TO authenticated
    USING (
        author_id = (select auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete articles"
    ON public.articles FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- ARTICLE_TRANSLATIONS - merge SELECT policies
-- =====================================================

DROP POLICY IF EXISTS "Article translations follow article policy" ON public.article_translations;
DROP POLICY IF EXISTS "Article translations editable by authors" ON public.article_translations;

-- Merged SELECT policy
CREATE POLICY "Article translations viewable policy"
    ON public.article_translations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (
                status = 'published'
                OR author_id = (select auth.uid())
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
            )
        )
    );

CREATE POLICY "Article translations insert by authors"
    ON public.article_translations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (author_id = (select auth.uid()) OR
                EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')))
        )
    );

CREATE POLICY "Article translations update by authors"
    ON public.article_translations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (author_id = (select auth.uid()) OR
                EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')))
        )
    );

CREATE POLICY "Article translations delete by authors"
    ON public.article_translations FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (author_id = (select auth.uid()) OR
                EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')))
        )
    );

-- =====================================================
-- ARTICLE_TAGS
-- =====================================================

DROP POLICY IF EXISTS "Article tags follow article policy" ON public.article_tags;

CREATE POLICY "Article tags select"
    ON public.article_tags FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (
                status = 'published'
                OR author_id = (select auth.uid())
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
            )
        )
    );

CREATE POLICY "Article tags insert"
    ON public.article_tags FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (author_id = (select auth.uid()) OR
                EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')))
        )
    );

CREATE POLICY "Article tags update"
    ON public.article_tags FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (author_id = (select auth.uid()) OR
                EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')))
        )
    );

CREATE POLICY "Article tags delete"
    ON public.article_tags FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (author_id = (select auth.uid()) OR
                EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')))
        )
    );

-- =====================================================
-- PRODUCTS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage products" ON public.products;

CREATE POLICY "Editors can insert products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update products"
    ON public.products FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete products"
    ON public.products FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- PRODUCT_TRANSLATIONS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage product translations" ON public.product_translations;

CREATE POLICY "Editors can insert product translations"
    ON public.product_translations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update product translations"
    ON public.product_translations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete product translations"
    ON public.product_translations FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- PRODUCT_SPECIFICATIONS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage product specs" ON public.product_specifications;

CREATE POLICY "Editors can insert product specs"
    ON public.product_specifications FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update product specs"
    ON public.product_specifications FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete product specs"
    ON public.product_specifications FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- PRODUCT_FEATURES
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage product features" ON public.product_features;

CREATE POLICY "Editors can insert product features"
    ON public.product_features FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update product features"
    ON public.product_features FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete product features"
    ON public.product_features FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- PRODUCT_FEATURE_TRANSLATIONS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage product feature translations" ON public.product_feature_translations;

CREATE POLICY "Editors can insert product feature translations"
    ON public.product_feature_translations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update product feature translations"
    ON public.product_feature_translations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete product feature translations"
    ON public.product_feature_translations FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- PRODUCT_TO_FEATURES
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage product to features" ON public.product_to_features;

CREATE POLICY "Editors can insert product to features"
    ON public.product_to_features FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update product to features"
    ON public.product_to_features FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete product to features"
    ON public.product_to_features FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- PRODUCT_IMAGES
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage product images" ON public.product_images;

CREATE POLICY "Editors can insert product images"
    ON public.product_images FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update product images"
    ON public.product_images FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete product images"
    ON public.product_images FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- FAQS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage FAQs" ON public.faqs;

CREATE POLICY "Editors can insert FAQs"
    ON public.faqs FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update FAQs"
    ON public.faqs FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete FAQs"
    ON public.faqs FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- FAQ_TRANSLATIONS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage FAQ translations" ON public.faq_translations;

CREATE POLICY "Editors can insert FAQ translations"
    ON public.faq_translations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can update FAQ translations"
    ON public.faq_translations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete FAQ translations"
    ON public.faq_translations FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

-- =====================================================
-- SETTINGS
-- =====================================================

DROP POLICY IF EXISTS "Settings viewable by admins" ON public.settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;

CREATE POLICY "Settings viewable by admins"
    ON public.settings FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role = 'admin')
    );

CREATE POLICY "Admins can insert settings"
    ON public.settings FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role = 'admin')
    );

CREATE POLICY "Admins can update settings"
    ON public.settings FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role = 'admin')
    );

CREATE POLICY "Admins can delete settings"
    ON public.settings FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role = 'admin')
    );

-- =====================================================
-- PRODUCT_FEATURE_POINTS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage feature points" ON public.product_feature_points;

CREATE POLICY "Editors can insert feature points"
    ON public.product_feature_points FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update feature points"
    ON public.product_feature_points FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete feature points"
    ON public.product_feature_points FOR DELETE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

-- =====================================================
-- PRODUCT_FEATURE_POINT_TRANSLATIONS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage feature point translations" ON public.product_feature_point_translations;

CREATE POLICY "Editors can insert feature point translations"
    ON public.product_feature_point_translations FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update feature point translations"
    ON public.product_feature_point_translations FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete feature point translations"
    ON public.product_feature_point_translations FOR DELETE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

-- =====================================================
-- PRODUCT_COLOR_VARIANTS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage color variants" ON public.product_color_variants;

CREATE POLICY "Editors can insert color variants"
    ON public.product_color_variants FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update color variants"
    ON public.product_color_variants FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete color variants"
    ON public.product_color_variants FOR DELETE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

-- =====================================================
-- PRODUCT_COLOR_VARIANT_TRANSLATIONS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage color variant translations" ON public.product_color_variant_translations;

CREATE POLICY "Editors can insert color variant translations"
    ON public.product_color_variant_translations FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update color variant translations"
    ON public.product_color_variant_translations FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete color variant translations"
    ON public.product_color_variant_translations FOR DELETE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

-- =====================================================
-- PRODUCT_CONTENT_SECTIONS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage content sections" ON public.product_content_sections;

CREATE POLICY "Editors can insert content sections"
    ON public.product_content_sections FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update content sections"
    ON public.product_content_sections FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete content sections"
    ON public.product_content_sections FOR DELETE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

-- =====================================================
-- PRODUCT_CONTENT_SECTION_TRANSLATIONS
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage content section translations" ON public.product_content_section_translations;

CREATE POLICY "Editors can insert content section translations"
    ON public.product_content_section_translations FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update content section translations"
    ON public.product_content_section_translations FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete content section translations"
    ON public.product_content_section_translations FOR DELETE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')));

-- =====================================================
-- MEDIA
-- =====================================================

DROP POLICY IF EXISTS "Editors can manage media" ON public.media;

CREATE POLICY "Editors can insert media"
    ON public.media FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = (select auth.uid())
        AND profiles.role IN ('admin', 'editor')
    ));

CREATE POLICY "Editors can update media"
    ON public.media FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = (select auth.uid())
        AND profiles.role IN ('admin', 'editor')
    ));

CREATE POLICY "Editors can delete media"
    ON public.media FOR DELETE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = (select auth.uid())
        AND profiles.role IN ('admin', 'editor')
    ));

-- =====================================================
-- DOCUMENT_CATEGORIES - merge SELECT policies
-- =====================================================

DROP POLICY IF EXISTS "Public read active document_categories" ON public.document_categories;
DROP POLICY IF EXISTS "Admin write document_categories" ON public.document_categories;

-- Single SELECT policy - public can see active, admins can see all
CREATE POLICY "Document categories viewable policy"
    ON public.document_categories FOR SELECT
    USING (
        is_active = true
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Admin insert document_categories"
    ON public.document_categories FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin update document_categories"
    ON public.document_categories FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin delete document_categories"
    ON public.document_categories FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );

-- =====================================================
-- DOCUMENT_CATEGORY_TRANSLATIONS - merge SELECT policies
-- =====================================================

DROP POLICY IF EXISTS "Public read document_category_translations" ON public.document_category_translations;
DROP POLICY IF EXISTS "Admin write document_category_translations" ON public.document_category_translations;

-- Single SELECT policy
CREATE POLICY "Document category translations viewable policy"
    ON public.document_category_translations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.document_categories
            WHERE id = category_id AND (
                is_active = true
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
            )
        )
    );

CREATE POLICY "Admin insert document_category_translations"
    ON public.document_category_translations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin update document_category_translations"
    ON public.document_category_translations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin delete document_category_translations"
    ON public.document_category_translations FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );

-- =====================================================
-- DOCUMENTS - merge SELECT policies
-- =====================================================

DROP POLICY IF EXISTS "Public read active documents" ON public.documents;
DROP POLICY IF EXISTS "Admin write documents" ON public.documents;

CREATE POLICY "Documents viewable policy"
    ON public.documents FOR SELECT
    USING (
        is_active = true
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Admin insert documents"
    ON public.documents FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin update documents"
    ON public.documents FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin delete documents"
    ON public.documents FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );

-- =====================================================
-- DOCUMENT_TRANSLATIONS - merge SELECT policies
-- =====================================================

DROP POLICY IF EXISTS "Public read document_translations" ON public.document_translations;
DROP POLICY IF EXISTS "Admin write document_translations" ON public.document_translations;

CREATE POLICY "Document translations viewable policy"
    ON public.document_translations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.documents
            WHERE id = document_id AND (
                is_active = true
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (select auth.uid()) AND role IN ('admin', 'editor'))
            )
        )
    );

CREATE POLICY "Admin insert document_translations"
    ON public.document_translations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin update document_translations"
    ON public.document_translations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin delete document_translations"
    ON public.document_translations FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = (select auth.uid()) AND role IN ('admin', 'editor')
        )
    );
