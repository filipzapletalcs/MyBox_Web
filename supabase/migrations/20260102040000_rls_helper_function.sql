-- =====================================================
-- Migration: Create RLS helper function
-- Purpose: Reduce duplication and improve performance in RLS policies
-- =====================================================

-- Create helper function to check if user is editor or admin
CREATE OR REPLACE FUNCTION is_editor_or_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('admin', 'editor')
  );
END;
$$;

-- Add comment
COMMENT ON FUNCTION is_editor_or_admin() IS 'Returns true if current user has admin or editor role. Used in RLS policies.';

-- Create helper function to check if user is admin only
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'
  );
END;
$$;

-- Add comment
COMMENT ON FUNCTION is_admin() IS 'Returns true if current user has admin role. Used in RLS policies.';

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION is_editor_or_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Note: Existing policies are not migrated to use these functions in this migration
-- to avoid risk. New policies should use these helpers going forward.
-- Future refactoring migration can update existing policies to use these functions.
