-- ============================================
-- COMPANY DETAILS (Firemní údaje)
-- ============================================

CREATE TABLE public.company_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Základní údaje
    name TEXT NOT NULL,
    division TEXT,
    -- Adresa
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    zip TEXT NOT NULL,
    country TEXT DEFAULT 'CZ',
    -- Právní údaje
    ico TEXT NOT NULL,
    dic TEXT,
    -- Kontakty obchod
    sales_phone TEXT,
    sales_email TEXT,
    -- Kontakty servis
    service_phone TEXT,
    service_email TEXT,
    -- Otevírací doba
    hours_weekdays TEXT,
    hours_saturday TEXT,
    hours_sunday TEXT,
    -- Sociální sítě
    facebook_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    youtube_url TEXT,
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pro updated_at
CREATE TRIGGER update_company_details_updated_at
    BEFORE UPDATE ON public.company_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.company_details ENABLE ROW LEVEL SECURITY;

-- Veřejné čtení
CREATE POLICY "Company details are publicly viewable"
    ON public.company_details FOR SELECT
    USING (true);

-- Pouze admin/editor může upravovat
CREATE POLICY "Editors can manage company details"
    ON public.company_details FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Vložit výchozí data
INSERT INTO public.company_details (
    name, division, address, city, zip, ico, dic,
    sales_phone, sales_email, service_phone, service_email,
    hours_weekdays,
    facebook_url, instagram_url, linkedin_url, youtube_url
) VALUES (
    'ELEXIM, a.s.',
    'Divize MyBox',
    'Hulínská 1814/1b',
    'Kroměříž',
    '767 01',
    '25565044',
    'CZ25565044',
    '+420 734 597 699',
    'obchod@mybox.eco',
    '+420 739 407 006',
    'servis@mybox.eco',
    'Po–Pá 8:00–16:30',
    'https://www.facebook.com/myboxchargingstations',
    'https://instagram.com/myboxchargingstations',
    'https://www.linkedin.com/company/mybox-charging-stations/',
    'https://www.youtube.com/@myboxchargingstations'
);
