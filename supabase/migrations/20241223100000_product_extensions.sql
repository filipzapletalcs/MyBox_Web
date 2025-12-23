-- ============================================
-- PRODUCT EXTENSIONS
-- Rozšíření pro plnou podporu MyBox Profi dat
-- ============================================

-- Rozšíření products tabulky
ALTER TABLE products ADD COLUMN IF NOT EXISTS front_image TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS hero_video TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS datasheet_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS datasheet_filename TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS power TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS manufacturer_name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS manufacturer_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS country_of_origin TEXT DEFAULT 'CZ';
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_category TEXT;

-- ============================================
-- PRODUCT FEATURE POINTS
-- 6 klíčových vlastností produktu (zobrazení u obrázku)
-- ============================================

CREATE TABLE IF NOT EXISTS product_feature_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    icon TEXT NOT NULL, -- 'power', 'protocol', 'connectivity', 'protection', 'meter', 'temperature'
    position TEXT NOT NULL CHECK (position IN ('left', 'right')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_feature_point_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_point_id UUID NOT NULL REFERENCES product_feature_points(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    UNIQUE(feature_point_id, locale)
);

-- ============================================
-- PRODUCT COLOR VARIANTS
-- Barevné varianty produktu (black, white)
-- ============================================

CREATE TABLE IF NOT EXISTS product_color_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    color_key TEXT NOT NULL, -- 'black', 'white'
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, color_key)
);

CREATE TABLE IF NOT EXISTS product_color_variant_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES product_color_variants(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    label TEXT NOT NULL,
    UNIQUE(variant_id, locale)
);

-- ============================================
-- PRODUCT CONTENT SECTIONS
-- SEO bloky s textem a obrázkem
-- ============================================

CREATE TABLE IF NOT EXISTS product_content_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT,
    image_alt TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_content_section_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES product_content_sections(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT NOT NULL,
    UNIQUE(section_id, locale)
);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE product_feature_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_feature_point_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_color_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_color_variant_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_content_section_translations ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Feature points viewable by everyone"
    ON product_feature_points FOR SELECT USING (true);

CREATE POLICY "Feature point translations viewable by everyone"
    ON product_feature_point_translations FOR SELECT USING (true);

CREATE POLICY "Color variants viewable by everyone"
    ON product_color_variants FOR SELECT USING (true);

CREATE POLICY "Color variant translations viewable by everyone"
    ON product_color_variant_translations FOR SELECT USING (true);

CREATE POLICY "Content sections viewable by everyone"
    ON product_content_sections FOR SELECT USING (true);

CREATE POLICY "Content section translations viewable by everyone"
    ON product_content_section_translations FOR SELECT USING (true);

-- Editor write access
CREATE POLICY "Editors can manage feature points"
    ON product_feature_points FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage feature point translations"
    ON product_feature_point_translations FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage color variants"
    ON product_color_variants FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage color variant translations"
    ON product_color_variant_translations FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage content sections"
    ON product_content_sections FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage content section translations"
    ON product_content_section_translations FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_feature_points_product ON product_feature_points(product_id);
CREATE INDEX IF NOT EXISTS idx_color_variants_product ON product_color_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_content_sections_product ON product_content_sections(product_id);
