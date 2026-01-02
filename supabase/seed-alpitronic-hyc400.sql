-- ============================================
-- SEED DATA: Alpitronic HYC 400
-- Texty z webu mybox.eco, základní informace
-- ============================================

-- Nejprve smažeme existující data pro alpitronic-hyc400 (pokud existují)
DELETE FROM products WHERE slug = 'alpitronic-hyc400';

-- ============================================
-- 1. PRODUCT
-- ============================================

INSERT INTO products (
    id,
    slug,
    type,
    sku,
    is_active,
    is_featured,
    sort_order,
    front_image,
    hero_image,
    datasheet_url,
    datasheet_filename,
    brand,
    power,
    manufacturer_name,
    manufacturer_url,
    country_of_origin,
    product_category
) VALUES (
    'c3000000-0000-0000-0000-000000000003',
    'alpitronic-hyc400',
    'dc_alpitronic',
    'ALPITRONIC-HYC400',
    true,
    true,
    12,
    'hyc400_bok-png.webp',
    'hyc400_bok-png.webp',
    NULL,
    NULL,
    'alpitronic',
    '100-400 kW',
    'Alpitronic GmbH',
    'https://www.hypercharger.it',
    'IT',
    'DC nabíjecí stanice'
);

-- ============================================
-- 2. PRODUCT TRANSLATIONS
-- ============================================

INSERT INTO product_translations (product_id, locale, name, tagline, description, seo_title, seo_description) VALUES
-- Czech
('c3000000-0000-0000-0000-000000000003', 'cs',
 'Alpitronic HYC 400',
 'Alpitronic HYC400 – modulární DC nabíjecí stanice s výkonem až 400 kW. Efektivní, kompaktní a připravená na budoucnost elektromobility. Ideální pro veřejné i firemní nabíjení.',
 'Špičková modulární DC nabíjecí stanice s výkonem 100-400 kW a účinností až 97,5 %. Umožňuje současné nabíjení až 3 vozidel. CCS2 s proudem až 500 A (boost 600 A).',
 'Alpitronic HYC 400 - DC nabíjecí stanice 400 kW | MyBox.eco',
 'Špičková DC nabíjecí stanice Alpitronic HYC 400 s výkonem až 400 kW. Škálovatelná architektura, účinnost až 97,5 %, až 3 CCS2 konektory.'
),
-- English
('c3000000-0000-0000-0000-000000000003', 'en',
 'Alpitronic HYC 400',
 'Alpitronic HYC400 – modular DC charging station with up to 400 kW power. Efficient, compact and ready for the future of e-mobility. Ideal for public and corporate charging.',
 'Top-tier modular DC charging station with 100-400 kW power and up to 97.5% efficiency. Enables simultaneous charging of up to 3 vehicles. CCS2 with current up to 500 A (boost 600 A).',
 'Alpitronic HYC 400 - DC Charging Station 400 kW | MyBox.eco',
 'Top-tier DC charging station Alpitronic HYC 400 with up to 400 kW power. Scalable architecture, up to 97.5% efficiency, up to 3 CCS2 connectors.'
),
-- German
('c3000000-0000-0000-0000-000000000003', 'de',
 'Alpitronic HYC 400',
 'Alpitronic HYC400 – modulare DC-Ladestation mit bis zu 400 kW Leistung. Effizient, kompakt und bereit für die Zukunft der Elektromobilität. Ideal für öffentliches und Firmenladen.',
 'Hochwertige modulare DC-Ladestation mit 100-400 kW Leistung und bis zu 97,5 % Effizienz. Ermöglicht gleichzeitiges Laden von bis zu 3 Fahrzeugen. CCS2 mit bis zu 500 A Strom (Boost 600 A).',
 'Alpitronic HYC 400 - DC-Ladestation 400 kW | MyBox.eco',
 'Hochwertige DC-Ladestation Alpitronic HYC 400 mit bis zu 400 kW Leistung. Skalierbare Architektur, bis zu 97,5 % Effizienz, bis zu 3 CCS2-Anschlüsse.'
);

-- ============================================
-- 3. PRODUCT IMAGES (Gallery)
-- ============================================

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order) VALUES
('c3000000-0000-0000-0000-000000000003', 'hyc400_bok-png.webp', 'Alpitronic HYC 400 boční pohled', true, 1);

-- ============================================
-- 4. PRODUCT SPECIFICATIONS
-- ============================================

-- Power category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('c3000000-0000-0000-0000-000000000003', 'model', 'HYC 400', NULL, 'power', 1, 'Model', 'Model', 'Modell'),
('c3000000-0000-0000-0000-000000000003', 'maxPower', '100-400', 'kW', 'power', 2, 'Škálovatelný výkon', 'Scalable power', 'Skalierbare Leistung'),
('c3000000-0000-0000-0000-000000000003', 'maxCurrent', '500 (boost 600)', 'A', 'power', 3, 'Max. proud', 'Max. current', 'Max. Strom'),
('c3000000-0000-0000-0000-000000000003', 'efficiency', '97,5', '%', 'power', 4, 'Účinnost', 'Efficiency', 'Wirkungsgrad'),
('c3000000-0000-0000-0000-000000000003', 'connectors', 'Až 3× CCS2', NULL, 'power', 5, 'Počet konektorů', 'Number of connectors', 'Anzahl der Anschlüsse');

-- Dimensions category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('c3000000-0000-0000-0000-000000000003', 'protection', 'IP54 / IK10', NULL, 'dimensions', 1, 'Krytí', 'Protection', 'Schutzart'),
('c3000000-0000-0000-0000-000000000003', 'operatingTemp', '-30°C až +55°C', NULL, 'dimensions', 2, 'Provozní teplota', 'Operating temperature', 'Betriebstemperatur');

-- Connectivity category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('c3000000-0000-0000-0000-000000000003', 'protocols', 'OCPP 1.6', NULL, 'connectivity', 1, 'Protokoly', 'Protocols', 'Protokolle'),
('c3000000-0000-0000-0000-000000000003', 'display', '15,6″', NULL, 'connectivity', 2, 'Displej', 'Display', 'Display'),
('c3000000-0000-0000-0000-000000000003', 'payment', 'Platební terminál', NULL, 'connectivity', 3, 'Platba', 'Payment', 'Bezahlung');

-- ============================================
-- 5. PRODUCT FEATURE POINTS
-- ============================================

DO $$
DECLARE
    fp_power_id UUID := gen_random_uuid();
    fp_protection_id UUID := gen_random_uuid();
    fp_connector_id UUID := gen_random_uuid();
    fp_temperature_id UUID := gen_random_uuid();
BEGIN
    -- Feature point: Power
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_power_id, 'c3000000-0000-0000-0000-000000000003', 'power', 'left', 1);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_power_id, 'cs', 'Škálovatelný výkon', '100-400 kW'),
    (fp_power_id, 'en', 'Scalable power', '100-400 kW'),
    (fp_power_id, 'de', 'Skalierbare Leistung', '100-400 kW');

    -- Feature point: Protection
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_protection_id, 'c3000000-0000-0000-0000-000000000003', 'protection', 'left', 2);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_protection_id, 'cs', 'Odolnost', 'IP54 / IK10'),
    (fp_protection_id, 'en', 'Protection', 'IP54 / IK10'),
    (fp_protection_id, 'de', 'Schutzart', 'IP54 / IK10');

    -- Feature point: Connectors
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_connector_id, 'c3000000-0000-0000-0000-000000000003', 'protocol', 'right', 3);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_connector_id, 'cs', 'Pro 3 vozy', 'Kabely CCS2'),
    (fp_connector_id, 'en', 'For 3 cars', 'CCS2 cables'),
    (fp_connector_id, 'de', 'Für 3 Autos', 'CCS2-Kabel');

    -- Feature point: Temperature
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_temperature_id, 'c3000000-0000-0000-0000-000000000003', 'temperature', 'right', 4);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_temperature_id, 'cs', 'Provozní teplota', '-30°C až +55°C'),
    (fp_temperature_id, 'en', 'Operating temp.', '-30°C to +55°C'),
    (fp_temperature_id, 'de', 'Betriebstemp.', '-30°C bis +55°C');
END $$;

-- ============================================
-- 6. PRODUCT COLOR VARIANTS
-- ============================================

DO $$
DECLARE
    cv_white_id UUID := gen_random_uuid();
BEGIN
    -- White variant (Alpitronic standard)
    INSERT INTO product_color_variants (id, product_id, color_key, image_url, sort_order)
    VALUES (cv_white_id, 'c3000000-0000-0000-0000-000000000003', 'white', 'hyc400_bok-png.webp', 1);

    INSERT INTO product_color_variant_translations (variant_id, locale, label) VALUES
    (cv_white_id, 'cs', 'Bílá'),
    (cv_white_id, 'en', 'White'),
    (cv_white_id, 'de', 'Weiß');
END $$;

-- ============================================
-- 7. PRODUCT CONTENT SECTIONS
-- ============================================

DO $$
DECLARE
    cs_modular_id UUID := gen_random_uuid();
    cs_dynamic_id UUID := gen_random_uuid();
    cs_design_id UUID := gen_random_uuid();
BEGIN
    -- Section 1: Powerful and modular
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_modular_id, 'c3000000-0000-0000-0000-000000000003', 'hyc400_bok-png.webp', 'Alpitronic HYC 400 výkonná a modulární', 1);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_modular_id, 'cs', 'Výkonná a modulární nabíjecí stanice', 'ŠPIČKA V DC NABÍJENÍ', 'Alpitronic HYC400 představuje špičku v oblasti DC nabíjení. Díky modulární architektuře lze výkon flexibilně škálovat od 100 kW až po 400 kW. Účinnost až 97,5 % minimalizuje ztráty energie a provozní náklady. Stanice je navržena pro nejnáročnější veřejné nabíjecí huby a dálniční odpočívky.'),
    (cs_modular_id, 'en', 'Powerful and modular charging station', 'TOP-TIER DC CHARGING', 'Alpitronic HYC400 represents the pinnacle of DC charging. Thanks to modular architecture, power can be flexibly scaled from 100 kW to 400 kW. Up to 97.5% efficiency minimizes energy losses and operating costs. The station is designed for the most demanding public charging hubs and highway rest stops.'),
    (cs_modular_id, 'de', 'Leistungsstarke und modulare Ladestation', 'SPITZE IM DC-LADEN', 'Alpitronic HYC400 stellt die Spitze des DC-Ladens dar. Dank modularer Architektur kann die Leistung flexibel von 100 kW bis 400 kW skaliert werden. Bis zu 97,5 % Effizienz minimiert Energieverluste und Betriebskosten. Die Station ist für die anspruchsvollsten öffentlichen Ladehubs und Autobahnraststätten konzipiert.');

    -- Section 2: Dynamic power for 3 vehicles
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_dynamic_id, 'c3000000-0000-0000-0000-000000000003', 'hyc400_bok-png.webp', 'Alpitronic HYC 400 dynamické nabíjení', 2);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_dynamic_id, 'cs', 'Dynamické rozdělení výkonu a chytrá správa kabelů', 'NABÍJENÍ AŽ 3 VOZIDEL', 'HYC400 umožňuje současné nabíjení až tří vozidel. CCS2 konektory podporují proud až 500 A (s boost módem až 600 A), což umožňuje extrémně rychlé nabíjení nejnovějších elektromobilů. Kapalinově chlazené kabely zajišťují bezpečný provoz i při maximálním výkonu. Automatický cable management udržuje okolí stanice v pořádku.'),
    (cs_dynamic_id, 'en', 'Dynamic power distribution and smart cable management', 'CHARGING UP TO 3 VEHICLES', 'HYC400 enables simultaneous charging of up to three vehicles. CCS2 connectors support current up to 500 A (with boost mode up to 600 A), enabling extremely fast charging of the latest EVs. Liquid-cooled cables ensure safe operation even at maximum power. Automatic cable management keeps the station surroundings tidy.'),
    (cs_dynamic_id, 'de', 'Dynamische Leistungsverteilung und intelligentes Kabelmanagement', 'LADEN BIS ZU 3 FAHRZEUGE', 'HYC400 ermöglicht das gleichzeitige Laden von bis zu drei Fahrzeugen. CCS2-Anschlüsse unterstützen Ströme bis zu 500 A (mit Boost-Modus bis zu 600 A), was extrem schnelles Laden der neuesten E-Fahrzeuge ermöglicht. Flüssigkeitsgekühlte Kabel gewährleisten einen sicheren Betrieb auch bei maximaler Leistung. Automatisches Kabelmanagement hält die Umgebung der Station ordentlich.');

    -- Section 3: Compact design
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_design_id, 'c3000000-0000-0000-0000-000000000003', 'hyc400_bok-png.webp', 'Alpitronic HYC 400 kompaktní design', 3);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_design_id, 'cs', 'Moderní technologie, minimální prostorové nároky', 'INTUITIVNÍ OVLÁDÁNÍ', 'Robustní konstrukce splňuje normy IP54 a IK10 pro spolehlivý provoz od -30°C do +55°C. Intuitivní 15,6″ displej poskytuje přehledné informace o průběhu nabíjení. Integrovaný platební terminál umožňuje rychlé a bezpečné platby. Kompaktní design maximalizuje výkon na jednotku zastavěné plochy.'),
    (cs_design_id, 'en', 'Modern technology, minimal space requirements', 'INTUITIVE OPERATION', 'Robust construction meets IP54 and IK10 standards for reliable operation from -30°C to +55°C. Intuitive 15.6″ display provides clear information about charging progress. Integrated payment terminal enables fast and secure payments. Compact design maximizes power per unit of floor space.'),
    (cs_design_id, 'de', 'Moderne Technologie, minimale Platzanforderungen', 'INTUITIVE BEDIENUNG', 'Robuste Konstruktion erfüllt IP54- und IK10-Standards für zuverlässigen Betrieb von -30°C bis +55°C. Intuitives 15,6″ Display bietet klare Informationen über den Ladefortschritt. Integriertes Zahlungsterminal ermöglicht schnelle und sichere Zahlungen. Kompaktes Design maximiert die Leistung pro Flächeneinheit.');
END $$;

-- ============================================
-- 8. PRODUCT FEATURES (Badges)
-- ============================================

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'c3000000-0000-0000-0000-000000000003', id FROM product_features WHERE slug = 'dc-fast'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'c3000000-0000-0000-0000-000000000003', id FROM product_features WHERE slug = 'commercial'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'c3000000-0000-0000-0000-000000000003', id FROM product_features WHERE slug = 'smart-management'
ON CONFLICT DO NOTHING;
