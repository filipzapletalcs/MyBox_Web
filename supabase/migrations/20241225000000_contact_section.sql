-- ============================================
-- CONTACT SECTION: Team Members, Submissions, Company Settings
-- ============================================

-- ============================================
-- A) TEAM MEMBERS (Členové týmu)
-- ============================================

CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    linkedin_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.team_member_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    description TEXT,
    UNIQUE(team_member_id, locale)
);

-- Indexy pro team_members
CREATE INDEX idx_team_members_sort_order ON public.team_members(sort_order);
CREATE INDEX idx_team_members_is_active ON public.team_members(is_active);
CREATE INDEX idx_team_member_translations_member ON public.team_member_translations(team_member_id);

-- Trigger pro updated_at
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS pro team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member_translations ENABLE ROW LEVEL SECURITY;

-- Veřejné čtení aktivních členů
CREATE POLICY "Active team members are viewable by everyone"
    ON public.team_members FOR SELECT
    USING (is_active = true);

-- Editori vidí všechny členy
CREATE POLICY "Editors can view all team members"
    ON public.team_members FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Editori mohou spravovat členy
CREATE POLICY "Editors can manage team members"
    ON public.team_members FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Veřejné čtení překladů
CREATE POLICY "Team member translations are viewable by everyone"
    ON public.team_member_translations FOR SELECT
    USING (true);

-- Editori mohou spravovat překlady
CREATE POLICY "Editors can manage team member translations"
    ON public.team_member_translations FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- ============================================
-- B) CONTACT SUBMISSIONS (Zprávy z formuláře)
-- ============================================

CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    station_type TEXT NOT NULL,
    location TEXT NOT NULL,
    segment TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexy pro contact_submissions
CREATE INDEX idx_contact_submissions_is_read ON public.contact_submissions(is_read);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_station_type ON public.contact_submissions(station_type);

-- Trigger pro updated_at
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS pro contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Kdokoli může vytvořit zprávu (z veřejného formuláře)
CREATE POLICY "Anyone can create contact submissions"
    ON public.contact_submissions FOR INSERT
    WITH CHECK (true);

-- Pouze editori mohou číst zprávy
CREATE POLICY "Editors can view contact submissions"
    ON public.contact_submissions FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Editori mohou spravovat zprávy
CREATE POLICY "Editors can manage contact submissions"
    ON public.contact_submissions FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- ============================================
-- C) COMPANY SETTINGS (Firemní údaje)
-- Využíváme existující tabulku settings
-- ============================================

-- Přidáme policy pro veřejné čtení company settings
CREATE POLICY "Company settings are publicly viewable"
    ON public.settings FOR SELECT
    USING (key LIKE 'company_%');

-- ============================================
-- D) STORAGE BUCKET pro team member images
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('team-images', 'team-images', true, 5242880)
ON CONFLICT (id) DO NOTHING;

-- Storage policies pro team-images bucket
CREATE POLICY "Public read access for team images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'team-images');

CREATE POLICY "Authenticated users can upload team images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'team-images');

CREATE POLICY "Authenticated users can update team images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'team-images');

CREATE POLICY "Editors can delete team images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'team-images' AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );
