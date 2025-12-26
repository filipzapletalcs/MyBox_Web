-- ============================================
-- FIX RLS POLICIES FOR CORPORATE CHARGING
-- Přidání explicitních SELECT policies pro editory
-- ============================================

-- Drop existing "ALL" policies and replace with specific ones
-- Corporate Pages
DROP POLICY IF EXISTS "Editors can manage corporate pages" ON public.corporate_pages;

CREATE POLICY "Editors can view all corporate pages"
    ON public.corporate_pages FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can insert corporate pages"
    ON public.corporate_pages FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update corporate pages"
    ON public.corporate_pages FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete corporate pages"
    ON public.corporate_pages FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Corporate Page Translations
DROP POLICY IF EXISTS "Editors can manage corporate page translations" ON public.corporate_page_translations;

CREATE POLICY "Editors can view all corporate page translations"
    ON public.corporate_page_translations FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can insert corporate page translations"
    ON public.corporate_page_translations FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update corporate page translations"
    ON public.corporate_page_translations FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete corporate page translations"
    ON public.corporate_page_translations FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Corporate Sections
DROP POLICY IF EXISTS "Editors can manage corporate sections" ON public.corporate_sections;

CREATE POLICY "Editors can view all corporate sections"
    ON public.corporate_sections FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can insert corporate sections"
    ON public.corporate_sections FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update corporate sections"
    ON public.corporate_sections FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete corporate sections"
    ON public.corporate_sections FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Corporate Section Translations
DROP POLICY IF EXISTS "Editors can manage corporate section translations" ON public.corporate_section_translations;

CREATE POLICY "Editors can view all corporate section translations"
    ON public.corporate_section_translations FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can insert corporate section translations"
    ON public.corporate_section_translations FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update corporate section translations"
    ON public.corporate_section_translations FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete corporate section translations"
    ON public.corporate_section_translations FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Case Studies
DROP POLICY IF EXISTS "Editors can manage case studies" ON public.case_studies;

CREATE POLICY "Editors can view all case studies"
    ON public.case_studies FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can insert case studies"
    ON public.case_studies FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update case studies"
    ON public.case_studies FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete case studies"
    ON public.case_studies FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Case Study Translations
DROP POLICY IF EXISTS "Editors can manage case study translations" ON public.case_study_translations;

CREATE POLICY "Editors can view all case study translations"
    ON public.case_study_translations FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can insert case study translations"
    ON public.case_study_translations FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update case study translations"
    ON public.case_study_translations FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete case study translations"
    ON public.case_study_translations FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Case Study Images
DROP POLICY IF EXISTS "Editors can manage case study images" ON public.case_study_images;

CREATE POLICY "Editors can view all case study images"
    ON public.case_study_images FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can insert case study images"
    ON public.case_study_images FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update case study images"
    ON public.case_study_images FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete case study images"
    ON public.case_study_images FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Case Study Metrics
DROP POLICY IF EXISTS "Editors can manage case study metrics" ON public.case_study_metrics;

CREATE POLICY "Editors can view all case study metrics"
    ON public.case_study_metrics FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can insert case study metrics"
    ON public.case_study_metrics FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update case study metrics"
    ON public.case_study_metrics FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete case study metrics"
    ON public.case_study_metrics FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Case Study Metric Translations
DROP POLICY IF EXISTS "Editors can manage case study metric translations" ON public.case_study_metric_translations;

CREATE POLICY "Editors can view all case study metric translations"
    ON public.case_study_metric_translations FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can insert case study metric translations"
    ON public.case_study_metric_translations FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update case study metric translations"
    ON public.case_study_metric_translations FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete case study metric translations"
    ON public.case_study_metric_translations FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Corporate Benefits
DROP POLICY IF EXISTS "Editors can manage corporate benefits" ON public.corporate_benefits;

CREATE POLICY "Editors can view all corporate benefits"
    ON public.corporate_benefits FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can insert corporate benefits"
    ON public.corporate_benefits FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update corporate benefits"
    ON public.corporate_benefits FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete corporate benefits"
    ON public.corporate_benefits FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Corporate Benefit Translations
DROP POLICY IF EXISTS "Editors can manage corporate benefit translations" ON public.corporate_benefit_translations;

CREATE POLICY "Editors can view all corporate benefit translations"
    ON public.corporate_benefit_translations FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can insert corporate benefit translations"
    ON public.corporate_benefit_translations FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can update corporate benefit translations"
    ON public.corporate_benefit_translations FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE POLICY "Editors can delete corporate benefit translations"
    ON public.corporate_benefit_translations FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));
