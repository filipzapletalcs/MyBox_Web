-- =====================================================
-- Documents Seed Data - Categories and Documents
-- =====================================================

-- Insert document categories
INSERT INTO public.document_categories (id, slug, sort_order, is_active) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'vop', 1, true),
  ('d1000000-0000-0000-0000-000000000002', 'katalogy', 2, true),
  ('d1000000-0000-0000-0000-000000000003', 'manualy', 3, true),
  ('d1000000-0000-0000-0000-000000000004', 'tiskove-sablony', 4, true),
  ('d1000000-0000-0000-0000-000000000005', 'marketing', 5, true),
  ('d1000000-0000-0000-0000-000000000006', 'stavebni-pripravenost', 6, true);

-- Category translations - CS
INSERT INTO public.document_category_translations (category_id, locale, name, description) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'cs', 'Všeobecné obchodní podmínky', 'Právní dokumenty a obchodní podmínky'),
  ('d1000000-0000-0000-0000-000000000002', 'cs', 'Katalogové listy', 'Technické specifikace a datasheets produktů'),
  ('d1000000-0000-0000-0000-000000000003', 'cs', 'Instalační manuály', 'Návody k instalaci a obsluze nabíjecích stanic'),
  ('d1000000-0000-0000-0000-000000000004', 'cs', 'Tiskové šablony', 'Šablony pro potisk a personalizaci stanic'),
  ('d1000000-0000-0000-0000-000000000005', 'cs', 'Marketingové materiály', 'Fotografie a propagační materiály'),
  ('d1000000-0000-0000-0000-000000000006', 'cs', 'Stavební připravenost', 'Dokumenty pro přípravu instalace');

-- Category translations - EN
INSERT INTO public.document_category_translations (category_id, locale, name, description) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'en', 'Terms and Conditions', 'Legal documents and terms of service'),
  ('d1000000-0000-0000-0000-000000000002', 'en', 'Datasheets', 'Technical specifications and product datasheets'),
  ('d1000000-0000-0000-0000-000000000003', 'en', 'Installation Manuals', 'Installation and operation guides for charging stations'),
  ('d1000000-0000-0000-0000-000000000004', 'en', 'Print Templates', 'Templates for custom printing and personalization'),
  ('d1000000-0000-0000-0000-000000000005', 'en', 'Marketing Materials', 'Photos and promotional materials'),
  ('d1000000-0000-0000-0000-000000000006', 'en', 'Site Preparation', 'Documents for installation preparation');

-- Category translations - DE
INSERT INTO public.document_category_translations (category_id, locale, name, description) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'de', 'Allgemeine Geschäftsbedingungen', 'Rechtliche Dokumente und AGB'),
  ('d1000000-0000-0000-0000-000000000002', 'de', 'Datenblätter', 'Technische Spezifikationen und Produktdatenblätter'),
  ('d1000000-0000-0000-0000-000000000003', 'de', 'Installationsanleitungen', 'Installations- und Bedienungsanleitungen für Ladestationen'),
  ('d1000000-0000-0000-0000-000000000004', 'de', 'Druckvorlagen', 'Vorlagen für individuelle Bedruckung und Personalisierung'),
  ('d1000000-0000-0000-0000-000000000005', 'de', 'Marketingmaterialien', 'Fotos und Werbematerialien'),
  ('d1000000-0000-0000-0000-000000000006', 'de', 'Baubereitung', 'Dokumente zur Installationsvorbereitung');

-- Note: Documents will be added via the admin panel after uploading files to storage.
-- The file paths in the documents table will reference files in the 'documents' bucket.
--
-- Example document structure (to be added after file upload):
--
-- VOP:
--   - MyBox_VOP_2024_CZ-2.pdf (cs)
--   - MyBox_VOP_EN-2.pdf (en)
--
-- Katalogy:
--   - MyBox_katalog_2025_compressed_30mb.pdf (cs)
--   - Katalog ENGLISH-compressed.pdf (en)
--
-- Instalační manuály:
--   - MyBoxHome - CZ manual
--   - MyBoxHome - EN manual
--   - MyBoxPlus - CZ manual
--   - MyBoxPlus - EN manual
--   - MyBoxPost - CZ manual
--   - MyBoxPost - EN manual
--   - MyBoxProfi - CZ manual
--   - MyBoxProfi - EN manual
--   - MyBox eBike - CZ manual
--   - AC Sensor manual
--
-- Datasheets:
--   - MyBox HOME 3.7kW / 11kW / 22kW
--   - MyBox PLUS 11kW / 22kW
--   - MyBox Post 2x22kW
--   - MyBox Profi 2x22kW / 1x43kW
--   - MyBox eBike Basic
--   - MyBox PARK
--
-- Tiskové šablony:
--   - Profi šablona.zip / Profi Template.zip
--   - MyBox_Plus_print_template.pdf
--
-- Marketing (ZIP):
--   - MyBox-Home.zip
--   - MyBox-Plus.zip
--   - MyBox-Post.zip
--   - MyBox-Profi.zip
--   - MyBox-eBike.zip
--   - logo-mybox.zip
--
-- Stavební připravenost:
--   - MyBox_Home_Stavební_příprava.pdf
--   - MyBox_Plus_Stavební_příprava.pdf
--   - MyBox_Post_Stavební_Příprava.pdf
--   - MyBox Profi - stavební příprava.pdf
