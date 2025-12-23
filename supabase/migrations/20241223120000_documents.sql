-- =====================================================
-- Documents Download Feature - Migration
-- =====================================================

-- Kategorie dokumentů
CREATE TABLE public.document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Překlady kategorií
CREATE TABLE public.document_category_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.document_categories(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_id, locale)
);

-- Dokumenty
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.document_categories(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,

    -- Jazykové verze souboru (cesta v Storage)
    file_cs TEXT,  -- 'katalog-profi-cs.pdf'
    file_en TEXT,  -- 'catalog-profi-en.pdf'
    file_de TEXT,  -- 'katalog-profi-de.pdf'

    -- Metadata souborů
    file_size_cs INTEGER,
    file_size_en INTEGER,
    file_size_de INTEGER,

    -- Fallback konfigurace
    fallback_locale TEXT CHECK (fallback_locale IN ('cs', 'en', 'de')),

    -- Řazení a stav
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(category_id, slug)
);

-- Překlady dokumentů
CREATE TABLE public.document_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(document_id, locale)
);

-- =====================================================
-- Indexy
-- =====================================================

CREATE INDEX idx_document_categories_active ON public.document_categories(is_active) WHERE is_active = true;
CREATE INDEX idx_document_categories_sort ON public.document_categories(sort_order);

CREATE INDEX idx_document_category_translations_category ON public.document_category_translations(category_id);
CREATE INDEX idx_document_category_translations_locale ON public.document_category_translations(locale);

CREATE INDEX idx_documents_category ON public.documents(category_id);
CREATE INDEX idx_documents_active ON public.documents(is_active) WHERE is_active = true;
CREATE INDEX idx_documents_sort ON public.documents(sort_order);

CREATE INDEX idx_document_translations_document ON public.document_translations(document_id);
CREATE INDEX idx_document_translations_locale ON public.document_translations(locale);

-- =====================================================
-- Triggers pro updated_at
-- =====================================================

CREATE TRIGGER update_document_categories_updated_at
    BEFORE UPDATE ON public.document_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- Row Level Security
-- =====================================================

ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_translations ENABLE ROW LEVEL SECURITY;

-- Public read policies (pouze aktivní záznamy)
CREATE POLICY "Public read active document_categories"
    ON public.document_categories
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public read document_category_translations"
    ON public.document_category_translations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.document_categories
            WHERE id = category_id AND is_active = true
        )
    );

CREATE POLICY "Public read active documents"
    ON public.documents
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public read document_translations"
    ON public.document_translations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.documents
            WHERE id = document_id AND is_active = true
        )
    );

-- Admin/Editor write policies
CREATE POLICY "Admin write document_categories"
    ON public.document_categories
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin write document_category_translations"
    ON public.document_category_translations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin write documents"
    ON public.documents
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin write document_translations"
    ON public.document_translations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- =====================================================
-- Storage Bucket
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true,
    262144000,  -- 250 MB
    ARRAY['application/pdf', 'application/zip', 'application/x-zip-compressed']
);

-- Storage policies
CREATE POLICY "Public read documents bucket"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'documents');

CREATE POLICY "Authenticated upload to documents bucket"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'documents'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Admin delete from documents bucket"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'documents'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin update documents bucket"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'documents'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );
