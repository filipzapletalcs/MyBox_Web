-- =====================================================
-- Migration: Create supported_locales lookup table
-- Purpose: Flexible locale management for future language additions
-- =====================================================

-- Create supported_locales table
CREATE TABLE IF NOT EXISTS supported_locales (
  code TEXT PRIMARY KEY,
  name_native TEXT NOT NULL,
  name_en TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE supported_locales IS 'Lookup table for supported languages. Add new locales here to enable them across the application.';

-- Insert initial locales
INSERT INTO supported_locales (code, name_native, name_en, sort_order) VALUES
  ('cs', 'Čeština', 'Czech', 1),
  ('en', 'English', 'English', 2),
  ('de', 'Deutsch', 'German', 3)
ON CONFLICT (code) DO NOTHING;

-- Create index for active locales
CREATE INDEX IF NOT EXISTS idx_supported_locales_active ON supported_locales(is_active) WHERE is_active = true;

-- RLS Policies
ALTER TABLE supported_locales ENABLE ROW LEVEL SECURITY;

-- Everyone can read locales
CREATE POLICY "Locales are viewable by everyone"
  ON supported_locales FOR SELECT
  USING (true);

-- Only admins can modify locales
CREATE POLICY "Admins can manage locales"
  ON supported_locales FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- Grant permissions
GRANT SELECT ON supported_locales TO anon;
GRANT SELECT ON supported_locales TO authenticated;
