-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================

-- ============================================
-- A) CREATE TABLE
-- ============================================

CREATE TABLE public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.newsletter_subscribers IS 'Newsletter subscribers for MyBox.eco';
COMMENT ON COLUMN public.newsletter_subscribers.locale IS 'Preferred language: cs, en, or de';
COMMENT ON COLUMN public.newsletter_subscribers.is_active IS 'Whether subscription is active';
COMMENT ON COLUMN public.newsletter_subscribers.unsubscribed_at IS 'Timestamp when user unsubscribed';

-- ============================================
-- B) INDEXES
-- ============================================

CREATE INDEX idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_is_active ON public.newsletter_subscribers(is_active);
CREATE INDEX idx_newsletter_subscribers_locale ON public.newsletter_subscribers(locale);

-- ============================================
-- C) TRIGGER FOR updated_at
-- ============================================

CREATE TRIGGER update_newsletter_subscribers_updated_at
    BEFORE UPDATE ON public.newsletter_subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- D) ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public can subscribe (INSERT only)
CREATE POLICY "Anyone can subscribe to newsletter"
    ON public.newsletter_subscribers FOR INSERT
    WITH CHECK (true);

-- Admins can view all subscribers
CREATE POLICY "Admins can view newsletter subscribers"
    ON public.newsletter_subscribers FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Admins can update subscribers
CREATE POLICY "Admins can update newsletter subscribers"
    ON public.newsletter_subscribers FOR UPDATE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Admins can delete subscribers
CREATE POLICY "Admins can delete newsletter subscribers"
    ON public.newsletter_subscribers FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
