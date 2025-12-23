-- ============================================
-- FIX CATEGORIES RLS POLICIES
-- The original policy uses FOR ALL with only USING clause,
-- which doesn't work properly for INSERT operations.
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Editors can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Editors can manage category translations" ON public.category_translations;

-- Create separate policies with proper clauses
-- Categories: SELECT (already exists as "Categories are viewable by everyone")

-- Categories: INSERT
CREATE POLICY "Editors can insert categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Categories: UPDATE
CREATE POLICY "Editors can update categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Categories: DELETE
CREATE POLICY "Editors can delete categories"
    ON public.categories FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Category translations: INSERT
CREATE POLICY "Editors can insert category translations"
    ON public.category_translations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Category translations: UPDATE
CREATE POLICY "Editors can update category translations"
    ON public.category_translations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Category translations: DELETE
CREATE POLICY "Editors can delete category translations"
    ON public.category_translations FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );
