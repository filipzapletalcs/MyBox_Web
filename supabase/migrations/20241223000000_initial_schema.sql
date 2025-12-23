-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('admin', 'editor', 'author');
CREATE TYPE article_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE product_type AS ENUM ('ac_mybox', 'dc_alpitronic');

-- ============================================
-- PROFILES (rozšíření auth.users)
-- ============================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'author',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatické vytvoření profilu při registraci
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS pro profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- ============================================
-- CATEGORIES
-- ============================================

CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.category_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    name TEXT NOT NULL,
    description TEXT,
    UNIQUE(category_id, locale)
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT USING (true);

CREATE POLICY "Category translations are viewable by everyone"
    ON public.category_translations FOR SELECT USING (true);

CREATE POLICY "Editors can manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can manage category translations"
    ON public.category_translations FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- ============================================
-- TAGS
-- ============================================

CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags are viewable by everyone"
    ON public.tags FOR SELECT USING (true);

CREATE POLICY "Editors can manage tags"
    ON public.tags FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- ============================================
-- ARTICLES
-- ============================================

CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    status article_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    category_id UUID REFERENCES public.categories(id),
    featured_image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.article_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    title TEXT NOT NULL,
    excerpt TEXT,
    content JSONB NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    UNIQUE(article_id, locale)
);

CREATE TABLE public.article_tags (
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are viewable by everyone"
    ON public.articles FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authors can view own articles"
    ON public.articles FOR SELECT
    TO authenticated
    USING (author_id = auth.uid());

CREATE POLICY "Editors can view all articles"
    ON public.articles FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Authenticated users can create articles"
    ON public.articles FOR INSERT
    TO authenticated
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own articles"
    ON public.articles FOR UPDATE
    TO authenticated
    USING (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Editors can delete articles"
    ON public.articles FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Article translations follow article policy"
    ON public.article_translations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (status = 'published' OR author_id = auth.uid())
        )
    );

CREATE POLICY "Article translations editable by authors"
    ON public.article_translations FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (author_id = auth.uid() OR
                EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')))
        )
    );

CREATE POLICY "Article tags follow article policy"
    ON public.article_tags FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (author_id = auth.uid() OR
                EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')))
        )
    );

-- ============================================
-- PRODUCTS
-- ============================================

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    type product_type NOT NULL,
    sku TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.product_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    seo_title TEXT,
    seo_description TEXT,
    UNIQUE(product_id, locale)
);

CREATE TABLE public.product_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    spec_key TEXT NOT NULL,
    value TEXT NOT NULL,
    unit TEXT,
    group_name TEXT,
    sort_order INTEGER DEFAULT 0,
    label_cs TEXT,
    label_en TEXT,
    label_de TEXT,
    UNIQUE(product_id, spec_key)
);

CREATE TABLE public.product_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    icon TEXT
);

CREATE TABLE public.product_feature_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_id UUID NOT NULL REFERENCES public.product_features(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    name TEXT NOT NULL,
    description TEXT,
    UNIQUE(feature_id, locale)
);

CREATE TABLE public.product_to_features (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES public.product_features(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, feature_id)
);

CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_feature_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_to_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
    ON public.products FOR SELECT USING (is_active = true);

CREATE POLICY "Editors can manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Product translations viewable by everyone"
    ON public.product_translations FOR SELECT USING (true);

CREATE POLICY "Editors can manage product translations"
    ON public.product_translations FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Product specs viewable by everyone"
    ON public.product_specifications FOR SELECT USING (true);

CREATE POLICY "Editors can manage product specs"
    ON public.product_specifications FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Product features viewable by everyone"
    ON public.product_features FOR SELECT USING (true);

CREATE POLICY "Editors can manage product features"
    ON public.product_features FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Product feature translations viewable by everyone"
    ON public.product_feature_translations FOR SELECT USING (true);

CREATE POLICY "Editors can manage product feature translations"
    ON public.product_feature_translations FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Product to features viewable by everyone"
    ON public.product_to_features FOR SELECT USING (true);

CREATE POLICY "Editors can manage product to features"
    ON public.product_to_features FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "Product images viewable by everyone"
    ON public.product_images FOR SELECT USING (true);

CREATE POLICY "Editors can manage product images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- ============================================
-- FAQ
-- ============================================

CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.faq_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faq_id UUID NOT NULL REFERENCES public.faqs(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    UNIQUE(faq_id, locale)
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQs are viewable by everyone"
    ON public.faqs FOR SELECT USING (is_active = true);

CREATE POLICY "Editors can manage FAQs"
    ON public.faqs FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

CREATE POLICY "FAQ translations viewable by everyone"
    ON public.faq_translations FOR SELECT USING (true);

CREATE POLICY "Editors can manage FAQ translations"
    ON public.faq_translations FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- ============================================
-- SETTINGS
-- ============================================

CREATE TABLE public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings viewable by admins"
    ON public.settings FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage settings"
    ON public.settings FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX idx_articles_author_id ON public.articles(author_id);
CREATE INDEX idx_articles_category_id ON public.articles(category_id);
CREATE INDEX idx_products_type ON public.products(type);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_sort_order ON public.products(sort_order);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- STORAGE BUCKETS
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('article-images', 'article-images', true, 5242880);

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('product-images', 'product-images', true, 10485760);

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('media', 'media', true, 52428800);

-- Storage policies
CREATE POLICY "Public read access for images"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('article-images', 'product-images', 'media'));

CREATE POLICY "Authenticated users can upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id IN ('article-images', 'product-images', 'media'));

CREATE POLICY "Users can update own uploads"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Editors can delete any upload"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        auth.uid()::text = (storage.foldername(name))[1] OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );
