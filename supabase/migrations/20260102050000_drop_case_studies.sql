-- =====================================================
-- Migration: Drop case studies tables
-- Purpose: Remove unused case studies feature
-- =====================================================

-- Drop tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS case_study_metric_translations CASCADE;
DROP TABLE IF EXISTS case_study_metrics CASCADE;
DROP TABLE IF EXISTS case_study_images CASCADE;
DROP TABLE IF EXISTS case_study_translations CASCADE;
DROP TABLE IF EXISTS case_studies CASCADE;

-- Note: corporate_section_type enum still has 'case_study' value
-- This is safe to keep as it just won't be used
