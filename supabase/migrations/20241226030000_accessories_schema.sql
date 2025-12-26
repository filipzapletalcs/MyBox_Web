-- ============================================
-- Migration: Accessories Schema
-- Creates tables for product accessories with translations
-- ============================================

-- ============================================
-- ACCESSORIES (Base table)
-- ============================================

CREATE TABLE public.accessories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACCESSORY TRANSLATIONS
-- ============================================

CREATE TABLE public.accessory_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accessory_id UUID NOT NULL REFERENCES public.accessories(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    name TEXT NOT NULL,
    description TEXT,
    UNIQUE(accessory_id, locale)
);

-- ============================================
-- PRODUCT-ACCESSORY JUNCTION (M:N)
-- ============================================

CREATE TABLE public.product_accessories (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    accessory_id UUID NOT NULL REFERENCES public.accessories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (product_id, accessory_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_accessories_slug ON public.accessories(slug);
CREATE INDEX idx_accessories_is_active ON public.accessories(is_active);
CREATE INDEX idx_accessories_sort_order ON public.accessories(sort_order);
CREATE INDEX idx_accessory_translations_accessory ON public.accessory_translations(accessory_id);
CREATE INDEX idx_accessory_translations_locale ON public.accessory_translations(locale);
CREATE INDEX idx_product_accessories_product ON public.product_accessories(product_id);
CREATE INDEX idx_product_accessories_accessory ON public.product_accessories(accessory_id);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessory_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_accessories ENABLE ROW LEVEL SECURITY;

-- Accessories: Public read for active, editors manage all
CREATE POLICY "Accessories are viewable by everyone"
    ON public.accessories FOR SELECT
    USING (is_active = true);

CREATE POLICY "Editors can view all accessories"
    ON public.accessories FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can manage accessories"
    ON public.accessories FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Accessory translations: Public read, editors manage
CREATE POLICY "Accessory translations are viewable by everyone"
    ON public.accessory_translations FOR SELECT
    USING (true);

CREATE POLICY "Editors can manage accessory translations"
    ON public.accessory_translations FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Product-Accessory junction: Public read, editors manage
CREATE POLICY "Product accessories are viewable by everyone"
    ON public.product_accessories FOR SELECT
    USING (true);

CREATE POLICY "Editors can manage product accessories"
    ON public.product_accessories FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- ============================================
-- GRANTS
-- ============================================

-- Accessories: anon can read, authenticated can manage
GRANT SELECT ON public.accessories TO anon;
GRANT ALL ON public.accessories TO authenticated;

-- Accessory translations: anon can read, authenticated can manage
GRANT SELECT ON public.accessory_translations TO anon;
GRANT ALL ON public.accessory_translations TO authenticated;

-- Product accessories: anon can read, authenticated can manage
GRANT SELECT ON public.product_accessories TO anon;
GRANT ALL ON public.product_accessories TO authenticated;

-- ============================================
-- TRIGGERS for updated_at
-- ============================================

CREATE TRIGGER update_accessories_updated_at
    BEFORE UPDATE ON public.accessories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();
