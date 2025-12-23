-- Seed script pro MyBox CMS
-- Spustit po db reset nebo ručně v Supabase Studio

-- Poznámka: Admin uživatele vytvořit ručně v Supabase Studio:
-- 1. Jdi na http://127.0.0.1:54323
-- 2. Authentication → Users → Add User
-- 3. Email: admin@mybox.eco, Password: (silné heslo)
-- 4. Po vytvoření spusť tento SQL pro nastavení role:

-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'admin@mybox.eco';

-- Ukázkové kategorie
INSERT INTO public.categories (id, slug, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'novinky', 1),
  ('22222222-2222-2222-2222-222222222222', 'navody', 2),
  ('33333333-3333-3333-3333-333333333333', 'elektromobilita', 3);

INSERT INTO public.category_translations (category_id, locale, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'cs', 'Novinky', 'Nejnovější zprávy a aktuality'),
  ('11111111-1111-1111-1111-111111111111', 'en', 'News', 'Latest news and updates'),
  ('11111111-1111-1111-1111-111111111111', 'de', 'Neuigkeiten', 'Neueste Nachrichten und Updates'),
  ('22222222-2222-2222-2222-222222222222', 'cs', 'Návody', 'Praktické návody a tipy'),
  ('22222222-2222-2222-2222-222222222222', 'en', 'Guides', 'Practical guides and tips'),
  ('22222222-2222-2222-2222-222222222222', 'de', 'Anleitungen', 'Praktische Anleitungen und Tipps'),
  ('33333333-3333-3333-3333-333333333333', 'cs', 'Elektromobilita', 'Vše o elektromobilitě'),
  ('33333333-3333-3333-3333-333333333333', 'en', 'E-Mobility', 'Everything about e-mobility'),
  ('33333333-3333-3333-3333-333333333333', 'de', 'E-Mobilität', 'Alles über E-Mobilität');

-- Ukázkové tagy
INSERT INTO public.tags (slug, name) VALUES
  ('elektromobily', 'Elektromobily'),
  ('nabijeni', 'Nabíjení'),
  ('wallbox', 'Wallbox'),
  ('mybox', 'MyBox'),
  ('dotace', 'Dotace'),
  ('instalace', 'Instalace');

-- Product features
INSERT INTO public.product_features (id, slug, icon) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'smart-management', 'Cpu'),
  ('f2222222-2222-2222-2222-222222222222', 'cloud-ready', 'Cloud'),
  ('f3333333-3333-3333-3333-333333333333', 'czech-made', 'Flag'),
  ('f4444444-4444-4444-4444-444444444444', 'warranty-3y', 'Shield'),
  ('f5555555-5555-5555-5555-555555555555', 'easy-install', 'Wrench'),
  ('f6666666-6666-6666-6666-666666666666', 'energy-meter', 'Gauge');

INSERT INTO public.product_feature_translations (feature_id, locale, name, description) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'cs', 'Chytré řízení', 'Vzdálené ovládání a monitoring'),
  ('f1111111-1111-1111-1111-111111111111', 'en', 'Smart Management', 'Remote control and monitoring'),
  ('f1111111-1111-1111-1111-111111111111', 'de', 'Smart Management', 'Fernsteuerung und Überwachung'),
  ('f2222222-2222-2222-2222-222222222222', 'cs', 'Cloud připojení', 'Cloudová správa a aktualizace'),
  ('f2222222-2222-2222-2222-222222222222', 'en', 'Cloud Ready', 'Cloud management and updates'),
  ('f2222222-2222-2222-2222-222222222222', 'de', 'Cloud-fähig', 'Cloud-Management und Updates'),
  ('f3333333-3333-3333-3333-333333333333', 'cs', 'Vyrobeno v ČR', 'Česká kvalita a podpora'),
  ('f3333333-3333-3333-3333-333333333333', 'en', 'Made in Czech Republic', 'Czech quality and support'),
  ('f3333333-3333-3333-3333-333333333333', 'de', 'Made in Tschechien', 'Tschechische Qualität und Support'),
  ('f4444444-4444-4444-4444-444444444444', 'cs', '3 roky záruka', 'Rozšířená záruční doba'),
  ('f4444444-4444-4444-4444-444444444444', 'en', '3 Year Warranty', 'Extended warranty period'),
  ('f4444444-4444-4444-4444-444444444444', 'de', '3 Jahre Garantie', 'Verlängerte Garantiezeit'),
  ('f5555555-5555-5555-5555-555555555555', 'cs', 'Snadná instalace', 'Rychlá a jednoduchá montáž'),
  ('f5555555-5555-5555-5555-555555555555', 'en', 'Easy Installation', 'Quick and simple mounting'),
  ('f5555555-5555-5555-5555-555555555555', 'de', 'Einfache Installation', 'Schnelle und einfache Montage'),
  ('f6666666-6666-6666-6666-666666666666', 'cs', 'Měření energie', 'Integrovaný elektroměr'),
  ('f6666666-6666-6666-6666-666666666666', 'en', 'Energy Metering', 'Integrated energy meter'),
  ('f6666666-6666-6666-6666-666666666666', 'de', 'Energiemessung', 'Integrierter Energiezähler');
