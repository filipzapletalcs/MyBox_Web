-- ============================================
-- FIX GRANTS FOR CORPORATE CHARGING TABLES
-- Přidání SELECT práv pro anon roli
-- ============================================

-- Grant SELECT to anon role for public read access
GRANT SELECT ON public.corporate_pages TO anon;
GRANT SELECT ON public.corporate_page_translations TO anon;
GRANT SELECT ON public.corporate_sections TO anon;
GRANT SELECT ON public.corporate_section_translations TO anon;
GRANT SELECT ON public.corporate_benefits TO anon;
GRANT SELECT ON public.corporate_benefit_translations TO anon;
GRANT SELECT ON public.case_studies TO anon;
GRANT SELECT ON public.case_study_translations TO anon;
GRANT SELECT ON public.case_study_images TO anon;
GRANT SELECT ON public.case_study_metrics TO anon;
GRANT SELECT ON public.case_study_metric_translations TO anon;
