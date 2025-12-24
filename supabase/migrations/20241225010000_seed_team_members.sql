-- ============================================
-- SEED DATA: Team Members (14 členů)
-- ============================================

-- Jindřich Geisler
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/jindrich-geisler.jpg', 'jindra@mybox.eco', NULL, NULL, 1, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Jindřich Geisler', 'Ředitel společnosti', NULL FROM public.team_members WHERE email = 'jindra@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Jindřich Geisler', 'CEO', NULL FROM public.team_members WHERE email = 'jindra@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Jindřich Geisler', 'Geschäftsführer', NULL FROM public.team_members WHERE email = 'jindra@mybox.eco';

-- Michal Fojtík
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/michal-fojtik.jpg', 'michal@mybox.eco', '+420 799 114 899', NULL, 2, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Michal Fojtík MBA', 'Ředitel divize', NULL FROM public.team_members WHERE email = 'michal@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Michal Fojtík MBA', 'Division Director', NULL FROM public.team_members WHERE email = 'michal@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Michal Fojtík MBA', 'Abteilungsleiter', NULL FROM public.team_members WHERE email = 'michal@mybox.eco';

-- Ondřej Miškovský
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/ondrej-miskovsky.jpg', 'ondrej.miskovsky@mybox.eco', '+420 603 402 372', NULL, 3, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Ondřej Miškovský', 'Obchodní manažer', NULL FROM public.team_members WHERE email = 'ondrej.miskovsky@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Ondřej Miškovský', 'Sales Manager', NULL FROM public.team_members WHERE email = 'ondrej.miskovsky@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Ondřej Miškovský', 'Vertriebsleiter', NULL FROM public.team_members WHERE email = 'ondrej.miskovsky@mybox.eco';

-- Radomír Muška
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/radomir-muska.jpg', 'radomir@mybox.eco', '+420 730 151 954', NULL, 4, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Radomír Muška', 'Obchodní manažer', NULL FROM public.team_members WHERE email = 'radomir@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Radomír Muška', 'Sales Manager', NULL FROM public.team_members WHERE email = 'radomir@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Radomír Muška', 'Vertriebsleiter', NULL FROM public.team_members WHERE email = 'radomir@mybox.eco';

-- Marek Veselský
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/marek-veselsky.jpg', 'marek@mybox.eco', '+420 734 597 699', NULL, 5, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Marek Veselský', 'Obchodní manažer', NULL FROM public.team_members WHERE email = 'marek@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Marek Veselský', 'Sales Manager', NULL FROM public.team_members WHERE email = 'marek@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Marek Veselský', 'Vertriebsleiter', NULL FROM public.team_members WHERE email = 'marek@mybox.eco';

-- Tomáš Kraus
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/tomas-kraus.jpg', 'tomas.kraus@mybox.eco', '+420 739 407 006', NULL, 6, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Tomáš Kraus', 'Servisní technik', NULL FROM public.team_members WHERE email = 'tomas.kraus@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Tomáš Kraus', 'Service Technician', NULL FROM public.team_members WHERE email = 'tomas.kraus@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Tomáš Kraus', 'Servicetechniker', NULL FROM public.team_members WHERE email = 'tomas.kraus@mybox.eco';

-- Tomáš Kada
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/tomas-kada.jpg', 'tomas@mybox.eco', NULL, NULL, 7, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Ing. Tomáš Kada', 'Produktový specialista', NULL FROM public.team_members WHERE email = 'tomas@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Ing. Tomáš Kada', 'Product Specialist', NULL FROM public.team_members WHERE email = 'tomas@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Ing. Tomáš Kada', 'Produktspezialist', NULL FROM public.team_members WHERE email = 'tomas@mybox.eco';

-- Zuzana Fojtíková
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/zuzana-fojtikova.jpg', 'zuzana@mybox.eco', '+420 799 114 919', NULL, 8, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Zuzana Fojtíková', 'Backoffice', NULL FROM public.team_members WHERE email = 'zuzana@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Zuzana Fojtíková', 'Backoffice', NULL FROM public.team_members WHERE email = 'zuzana@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Zuzana Fojtíková', 'Backoffice', NULL FROM public.team_members WHERE email = 'zuzana@mybox.eco';

-- Radmila Struhelková
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/radmila-struhelkova.jpg', 'radmila.struhelkova@mybox.eco', '+420 605 079 479', NULL, 9, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Radmila Struhelková', 'Backoffice', NULL FROM public.team_members WHERE email = 'radmila.struhelkova@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Radmila Struhelková', 'Backoffice', NULL FROM public.team_members WHERE email = 'radmila.struhelkova@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Radmila Struhelková', 'Backoffice', NULL FROM public.team_members WHERE email = 'radmila.struhelkova@mybox.eco';

-- Radek Cícha
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/radek-cicha.jpg', 'radek.cicha@mybox.eco', '+420 737 820 888', NULL, 10, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Ing. Radek Cícha', 'Vedoucí výroby', NULL FROM public.team_members WHERE email = 'radek.cicha@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Ing. Radek Cícha', 'Production Manager', NULL FROM public.team_members WHERE email = 'radek.cicha@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Ing. Radek Cícha', 'Produktionsleiter', NULL FROM public.team_members WHERE email = 'radek.cicha@mybox.eco';

-- Filip Zapletal
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/filip-zapletal.jpg', 'filip@mybox.eco', '+420 734 597 700', NULL, 11, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Filip Zapletal', 'Marketing manager', NULL FROM public.team_members WHERE email = 'filip@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Filip Zapletal', 'Marketing Manager', NULL FROM public.team_members WHERE email = 'filip@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Filip Zapletal', 'Marketing Manager', NULL FROM public.team_members WHERE email = 'filip@mybox.eco';

-- Radek Ešler
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/radek-esler.jpg', 'radek@mybox.eco', NULL, NULL, 12, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Ing. Radek Ešler', 'Manažer výroby', NULL FROM public.team_members WHERE email = 'radek@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Ing. Radek Ešler', 'Production Manager', NULL FROM public.team_members WHERE email = 'radek@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Ing. Radek Ešler', 'Produktionsleiter', NULL FROM public.team_members WHERE email = 'radek@mybox.eco';

-- Petr Zapletal
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/petr-zapletal.jpg', 'petr@mybox.eco', NULL, NULL, 13, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'Mgr. Petr Zapletal', 'Manažer vývoje', NULL FROM public.team_members WHERE email = 'petr@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'Mgr. Petr Zapletal', 'Development Manager', NULL FROM public.team_members WHERE email = 'petr@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'Mgr. Petr Zapletal', 'Entwicklungsleiter', NULL FROM public.team_members WHERE email = 'petr@mybox.eco';

-- Jan Kovalovský
INSERT INTO public.team_members (id, image_url, email, phone, linkedin_url, sort_order, is_active)
VALUES (gen_random_uuid(), '/images/team/jan-kovalovsky.jpg', 'jan@mybox.eco', NULL, NULL, 14, true);

INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'cs', 'MA. Jan Kovalovský', 'Designer', NULL FROM public.team_members WHERE email = 'jan@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'en', 'MA. Jan Kovalovský', 'Designer', NULL FROM public.team_members WHERE email = 'jan@mybox.eco';
INSERT INTO public.team_member_translations (team_member_id, locale, name, position, description)
SELECT id, 'de', 'MA. Jan Kovalovský', 'Designer', NULL FROM public.team_members WHERE email = 'jan@mybox.eco';
