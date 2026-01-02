-- =====================================================
-- Migration: Add corporate module constraints
-- Purpose: Fix data integrity issues and add locale checks
-- =====================================================

-- Fix corporate_benefits with dual FK references
-- If benefit has section_id, clear page_id (section already belongs to a page)
UPDATE corporate_benefits
SET page_id = NULL
WHERE page_id IS NOT NULL AND section_id IS NOT NULL;

-- Add XOR constraint: benefit must belong to either page OR section, not both
ALTER TABLE corporate_benefits
ADD CONSTRAINT chk_benefits_single_parent
CHECK (
  (page_id IS NOT NULL AND section_id IS NULL) OR
  (page_id IS NULL AND section_id IS NOT NULL)
);

-- Add locale CHECK constraints to corporate translations tables

-- corporate_page_translations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_corporate_page_trans_locale'
  ) THEN
    ALTER TABLE corporate_page_translations
    ADD CONSTRAINT chk_corporate_page_trans_locale
    CHECK (locale IN ('cs', 'en', 'de'));
  END IF;
END $$;

-- corporate_section_translations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_corporate_section_trans_locale'
  ) THEN
    ALTER TABLE corporate_section_translations
    ADD CONSTRAINT chk_corporate_section_trans_locale
    CHECK (locale IN ('cs', 'en', 'de'));
  END IF;
END $$;

-- corporate_benefit_translations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_corporate_benefit_trans_locale'
  ) THEN
    ALTER TABLE corporate_benefit_translations
    ADD CONSTRAINT chk_corporate_benefit_trans_locale
    CHECK (locale IN ('cs', 'en', 'de'));
  END IF;
END $$;

-- case_study_translations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_case_study_trans_locale'
  ) THEN
    ALTER TABLE case_study_translations
    ADD CONSTRAINT chk_case_study_trans_locale
    CHECK (locale IN ('cs', 'en', 'de'));
  END IF;
END $$;

-- case_study_metric_translations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_case_study_metric_trans_locale'
  ) THEN
    ALTER TABLE case_study_metric_translations
    ADD CONSTRAINT chk_case_study_metric_trans_locale
    CHECK (locale IN ('cs', 'en', 'de'));
  END IF;
END $$;

-- Add comments
COMMENT ON CONSTRAINT chk_benefits_single_parent ON corporate_benefits IS 'Ensures benefit belongs to exactly one parent (page OR section)';
