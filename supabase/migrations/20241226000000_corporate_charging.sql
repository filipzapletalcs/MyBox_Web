-- ============================================
-- CORPORATE CHARGING SECTION
-- Migrace pro sekci "Firemní nabíjení"
-- ============================================

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE corporate_section_type AS ENUM (
    'hero',
    'client_logos',
    'solution_desc',
    'stations',
    'case_study',
    'gallery',
    'inquiry_form',
    'benefits',
    'features',
    'cta',
    'text_content',
    'faq'
);

-- ============================================
-- CORPORATE PAGES
-- ============================================

CREATE TABLE public.corporate_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    page_type TEXT NOT NULL CHECK (page_type IN ('landing', 'subpage')),
    hero_video_url TEXT,
    hero_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- POZOR: locale je TEXT bez CHECK constraint - flexibilní pro přidání nových jazyků
CREATE TABLE public.corporate_page_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES public.corporate_pages(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    hero_heading TEXT,
    hero_subheading TEXT,
    seo_title TEXT,
    seo_description TEXT,
    UNIQUE(page_id, locale)
);

-- ============================================
-- CORPORATE SECTIONS
-- ============================================

CREATE TABLE public.corporate_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES public.corporate_pages(id) ON DELETE CASCADE,
    section_type corporate_section_type NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.corporate_section_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES public.corporate_sections(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    heading TEXT,
    subheading TEXT,
    content JSONB,
    UNIQUE(section_id, locale)
);

-- ============================================
-- CASE STUDIES
-- ============================================

CREATE TABLE public.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_logo_url TEXT,
    featured_image_url TEXT,
    industry TEXT,
    station_count INTEGER,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.case_study_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    testimonial_text TEXT,
    testimonial_author TEXT,
    seo_title TEXT,
    seo_description TEXT,
    UNIQUE(case_study_id, locale)
);

CREATE TABLE public.case_study_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.case_study_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
    icon TEXT,
    value TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.case_study_metric_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_id UUID NOT NULL REFERENCES public.case_study_metrics(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    label TEXT NOT NULL,
    UNIQUE(metric_id, locale)
);

-- ============================================
-- CORPORATE BENEFITS
-- ============================================

CREATE TABLE public.corporate_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.corporate_pages(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.corporate_sections(id) ON DELETE CASCADE,
    icon TEXT,
    color_accent TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.corporate_benefit_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benefit_id UUID NOT NULL REFERENCES public.corporate_benefits(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    UNIQUE(benefit_id, locale)
);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.corporate_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_section_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_study_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_study_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_study_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_study_metric_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_benefit_translations ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Corporate pages viewable by everyone"
    ON public.corporate_pages FOR SELECT USING (is_active = true);

CREATE POLICY "Corporate page translations viewable by everyone"
    ON public.corporate_page_translations FOR SELECT USING (true);

CREATE POLICY "Corporate sections viewable by everyone"
    ON public.corporate_sections FOR SELECT USING (is_active = true);

CREATE POLICY "Corporate section translations viewable by everyone"
    ON public.corporate_section_translations FOR SELECT USING (true);

CREATE POLICY "Case studies viewable by everyone"
    ON public.case_studies FOR SELECT USING (is_active = true);

CREATE POLICY "Case study translations viewable by everyone"
    ON public.case_study_translations FOR SELECT USING (true);

CREATE POLICY "Case study images viewable by everyone"
    ON public.case_study_images FOR SELECT USING (true);

CREATE POLICY "Case study metrics viewable by everyone"
    ON public.case_study_metrics FOR SELECT USING (true);

CREATE POLICY "Case study metric translations viewable by everyone"
    ON public.case_study_metric_translations FOR SELECT USING (true);

CREATE POLICY "Corporate benefits viewable by everyone"
    ON public.corporate_benefits FOR SELECT USING (is_active = true);

CREATE POLICY "Corporate benefit translations viewable by everyone"
    ON public.corporate_benefit_translations FOR SELECT USING (true);

-- Editor management policies (using is_editor helper function if exists, otherwise inline check)
CREATE POLICY "Editors can manage corporate pages"
    ON public.corporate_pages FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage corporate page translations"
    ON public.corporate_page_translations FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage corporate sections"
    ON public.corporate_sections FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage corporate section translations"
    ON public.corporate_section_translations FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage case studies"
    ON public.case_studies FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage case study translations"
    ON public.case_study_translations FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage case study images"
    ON public.case_study_images FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage case study metrics"
    ON public.case_study_metrics FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage case study metric translations"
    ON public.case_study_metric_translations FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage corporate benefits"
    ON public.corporate_benefits FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can manage corporate benefit translations"
    ON public.corporate_benefit_translations FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_corporate_pages_slug ON public.corporate_pages(slug);
CREATE INDEX idx_corporate_pages_type ON public.corporate_pages(page_type);
CREATE INDEX idx_corporate_pages_active ON public.corporate_pages(is_active);
CREATE INDEX idx_corporate_sections_page_id ON public.corporate_sections(page_id);
CREATE INDEX idx_corporate_sections_sort ON public.corporate_sections(sort_order);
CREATE INDEX idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX idx_case_studies_featured ON public.case_studies(is_featured);
CREATE INDEX idx_case_studies_active ON public.case_studies(is_active);
CREATE INDEX idx_case_study_images_case_study ON public.case_study_images(case_study_id);
CREATE INDEX idx_case_study_metrics_case_study ON public.case_study_metrics(case_study_id);
CREATE INDEX idx_corporate_benefits_page ON public.corporate_benefits(page_id);
CREATE INDEX idx_corporate_benefits_section ON public.corporate_benefits(section_id);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_corporate_pages_updated_at
    BEFORE UPDATE ON public.corporate_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_corporate_sections_updated_at
    BEFORE UPDATE ON public.corporate_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_case_studies_updated_at
    BEFORE UPDATE ON public.case_studies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_corporate_benefits_updated_at
    BEFORE UPDATE ON public.corporate_benefits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA - Initial pages structure
-- ============================================

-- Landing page
INSERT INTO public.corporate_pages (slug, page_type, sort_order) VALUES
    ('landing', 'landing', 0),
    ('stanice-do-firem', 'subpage', 1),
    ('sprava-fleetu', 'subpage', 2),
    ('domaci-nabijeni-pro-zamestnance', 'subpage', 3),
    ('uctovani-nakladu', 'subpage', 4),
    ('danove-vyhody', 'subpage', 5),
    ('esg-a-elektromobilita', 'subpage', 6);

-- Czech translations for pages
INSERT INTO public.corporate_page_translations (page_id, locale, title, hero_heading, seo_title, seo_description)
SELECT
    id,
    'cs',
    CASE slug
        WHEN 'landing' THEN 'Firemní nabíjení'
        WHEN 'stanice-do-firem' THEN 'Stanice do firem'
        WHEN 'sprava-fleetu' THEN 'Správa fleetu'
        WHEN 'domaci-nabijeni-pro-zamestnance' THEN 'Domácí nabíjení pro zaměstnance'
        WHEN 'uctovani-nakladu' THEN 'Účtování nákladů'
        WHEN 'danove-vyhody' THEN 'Daňové výhody'
        WHEN 'esg-a-elektromobilita' THEN 'ESG a elektromobilita'
    END,
    CASE slug
        WHEN 'landing' THEN 'Komplexní řešení nabíjení pro vaši firmu'
        WHEN 'stanice-do-firem' THEN 'Nabíjecí stanice pro váš provoz'
        WHEN 'sprava-fleetu' THEN 'Efektivní správa firemního fleetu'
        WHEN 'domaci-nabijeni-pro-zamestnance' THEN 'Nabíjení u zaměstnanců doma'
        WHEN 'uctovani-nakladu' THEN 'Přehledné účtování nákladů na nabíjení'
        WHEN 'danove-vyhody' THEN 'Využijte daňové výhody elektromobility'
        WHEN 'esg-a-elektromobilita' THEN 'Splňte ESG cíle s elektromobilitou'
    END,
    CASE slug
        WHEN 'landing' THEN 'Firemní nabíjení elektromobilů | MyBox.eco'
        WHEN 'stanice-do-firem' THEN 'Nabíjecí stanice do firem | MyBox.eco'
        WHEN 'sprava-fleetu' THEN 'Správa fleetu elektromobilů | MyBox.eco'
        WHEN 'domaci-nabijeni-pro-zamestnance' THEN 'Domácí nabíjení pro zaměstnance | MyBox.eco'
        WHEN 'uctovani-nakladu' THEN 'Účtování nákladů na nabíjení | MyBox.eco'
        WHEN 'danove-vyhody' THEN 'Daňové výhody elektromobility | MyBox.eco'
        WHEN 'esg-a-elektromobilita' THEN 'ESG a elektromobilita | MyBox.eco'
    END,
    CASE slug
        WHEN 'landing' THEN 'Komplexní řešení nabíjení elektromobilů pro firmy. Nabíjecí stanice, správa fleetu, účtování nákladů a daňové výhody.'
        WHEN 'stanice-do-firem' THEN 'Nabíjecí stanice pro firemní parkoviště a provozovny. AC i DC řešení na míru.'
        WHEN 'sprava-fleetu' THEN 'Efektivní správa firemního fleetu elektromobilů s MyBox Cloud platformou.'
        WHEN 'domaci-nabijeni-pro-zamestnance' THEN 'Řešení domácího nabíjení pro zaměstnance s přehledným vyúčtováním.'
        WHEN 'uctovani-nakladu' THEN 'Přehledné účtování nákladů na nabíjení elektromobilů pro firmy.'
        WHEN 'danove-vyhody' THEN 'Daňové výhody a odpočty při pořízení nabíjecích stanic a elektromobilů.'
        WHEN 'esg-a-elektromobilita' THEN 'Splňte ESG cíle vaší firmy s elektromobilitou a nabíjecí infrastrukturou.'
    END
FROM public.corporate_pages;

-- Sections for landing page
INSERT INTO public.corporate_sections (page_id, section_type, sort_order, config)
SELECT
    id,
    unnest(ARRAY['hero', 'client_logos', 'solution_desc', 'stations', 'case_study', 'gallery', 'inquiry_form']::corporate_section_type[]),
    generate_series(0, 6),
    '{}'::jsonb
FROM public.corporate_pages
WHERE slug = 'landing';
