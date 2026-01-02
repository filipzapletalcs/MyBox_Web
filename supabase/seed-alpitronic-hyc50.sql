-- ============================================
-- SEED DATA: Alpitronic HYC 50
-- Texty z webu mybox.eco, základní informace
-- ============================================

-- Nejprve smažeme existující data pro alpitronic-hyc50 (pokud existují)
DELETE FROM products WHERE slug = 'alpitronic-hyc50';

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
    'c1000000-0000-0000-0000-000000000001',
    'alpitronic-hyc50',
    'dc_alpitronic',
    'ALPITRONIC-HYC50',
    true,
    false,
    10,
    'hyc50_bok-png.webp',
    'hyc50_bok-png.webp',
    NULL,
    NULL,
    'alpitronic',
    '50 kW',
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
('c1000000-0000-0000-0000-000000000001', 'cs',
 'Alpitronic HYC 50',
 'Alpitronic HYC50 – kompaktní DC nabíjecí stanice s výkonem až 50 kW. Tichá, efektivní a flexibilní pro širokou škálu instalací. Ideální pro firemní i veřejné nabíjecí lokality.',
 'Kompaktní DC nabíjecí stanice s výkonem 50 kW, která kombinuje kompaktní rozměry s vysokou efektivitou (až 97 %). Ideální pro firemní i veřejné nabíjecí lokality.',
 'Alpitronic HYC 50 - DC nabíjecí stanice 50 kW | MyBox.eco',
 'Kompaktní DC nabíjecí stanice Alpitronic HYC 50 s výkonem 50 kW. Účinnost až 97 %, CCS2 konektory. Ideální pro firemní a veřejné nabíjení.'
),
-- English
('c1000000-0000-0000-0000-000000000001', 'en',
 'Alpitronic HYC 50',
 'Alpitronic HYC50 – compact DC charging station with up to 50 kW power. Quiet, efficient and flexible for a wide range of installations. Ideal for corporate and public charging locations.',
 'Compact DC charging station with 50 kW power that combines compact dimensions with high efficiency (up to 97%). Ideal for corporate and public charging locations.',
 'Alpitronic HYC 50 - DC Charging Station 50 kW | MyBox.eco',
 'Compact DC charging station Alpitronic HYC 50 with 50 kW power. Up to 97% efficiency, CCS2 connectors. Ideal for corporate and public charging.'
),
-- German
('c1000000-0000-0000-0000-000000000001', 'de',
 'Alpitronic HYC 50',
 'Alpitronic HYC50 – kompakte DC-Ladestation mit bis zu 50 kW Leistung. Leise, effizient und flexibel für eine Vielzahl von Installationen. Ideal für Firmen- und öffentliche Ladestandorte.',
 'Kompakte DC-Ladestation mit 50 kW Leistung, die kompakte Abmessungen mit hoher Effizienz (bis zu 97 %) kombiniert. Ideal für Firmen- und öffentliche Ladestandorte.',
 'Alpitronic HYC 50 - DC-Ladestation 50 kW | MyBox.eco',
 'Kompakte DC-Ladestation Alpitronic HYC 50 mit 50 kW Leistung. Bis zu 97 % Effizienz, CCS2-Anschlüsse. Ideal für Firmen- und öffentliches Laden.'
);

-- ============================================
-- 3. PRODUCT IMAGES (Gallery)
-- ============================================

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'hyc50_bok-png.webp', 'Alpitronic HYC 50 boční pohled', true, 1);

-- ============================================
-- 4. PRODUCT SPECIFICATIONS
-- ============================================

-- Power category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('c1000000-0000-0000-0000-000000000001', 'model', 'HYC 50', NULL, 'power', 1, 'Model', 'Model', 'Modell'),
('c1000000-0000-0000-0000-000000000001', 'maxPower', '50', 'kW', 'power', 2, 'Max. výstupní výkon', 'Max. output power', 'Max. Ausgangsleistung'),
('c1000000-0000-0000-0000-000000000001', 'efficiency', '97', '%', 'power', 3, 'Účinnost', 'Efficiency', 'Wirkungsgrad'),
('c1000000-0000-0000-0000-000000000001', 'connectors', '2× CCS2', NULL, 'power', 4, 'Počet konektorů', 'Number of connectors', 'Anzahl der Anschlüsse');

-- Dimensions category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('c1000000-0000-0000-0000-000000000001', 'protection', 'IP54 / IK10', NULL, 'dimensions', 1, 'Krytí', 'Protection', 'Schutzart'),
('c1000000-0000-0000-0000-000000000001', 'operatingTemp', '-30°C až +55°C', NULL, 'dimensions', 2, 'Provozní teplota', 'Operating temperature', 'Betriebstemperatur');

-- Connectivity category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('c1000000-0000-0000-0000-000000000001', 'protocols', 'OCPP 1.6', NULL, 'connectivity', 1, 'Protokoly', 'Protocols', 'Protokolle'),
('c1000000-0000-0000-0000-000000000001', 'payment', 'Platební terminál', NULL, 'connectivity', 2, 'Platba', 'Payment', 'Bezahlung');

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
    VALUES (fp_power_id, 'c1000000-0000-0000-0000-000000000001', 'power', 'left', 1);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_power_id, 'cs', 'Vysoký výkon', '50 kW'),
    (fp_power_id, 'en', 'High power', '50 kW'),
    (fp_power_id, 'de', 'Hohe Leistung', '50 kW');

    -- Feature point: Protection
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_protection_id, 'c1000000-0000-0000-0000-000000000001', 'protection', 'left', 2);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_protection_id, 'cs', 'Odolnost', 'IP54 / IK10'),
    (fp_protection_id, 'en', 'Protection', 'IP54 / IK10'),
    (fp_protection_id, 'de', 'Schutzart', 'IP54 / IK10');

    -- Feature point: Connectors
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_connector_id, 'c1000000-0000-0000-0000-000000000001', 'protocol', 'right', 3);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_connector_id, 'cs', 'Pro 2 vozy', 'Kabely CCS2'),
    (fp_connector_id, 'en', 'For 2 cars', 'CCS2 cables'),
    (fp_connector_id, 'de', 'Für 2 Autos', 'CCS2-Kabel');

    -- Feature point: Temperature
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_temperature_id, 'c1000000-0000-0000-0000-000000000001', 'temperature', 'right', 4);

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
    VALUES (cv_white_id, 'c1000000-0000-0000-0000-000000000001', 'white', 'hyc50_bok-png.webp', 1);

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
    cs_power_id UUID := gen_random_uuid();
    cs_dynamic_id UUID := gen_random_uuid();
    cs_smart_id UUID := gen_random_uuid();
BEGIN
    -- Section 1: Powerful charging
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_power_id, 'c1000000-0000-0000-0000-000000000001', 'hyc50_bok-png.webp', 'Alpitronic HYC 50 výkonné nabíjení', 1);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_power_id, 'cs', 'Výkonné nabíjení, kompaktní rozměry', 'VYSOKÁ ÚČINNOST', 'Alpitronic HYC50 je moderní DC nabíjecí stanice s výkonem 50 kW, která kombinuje kompaktní rozměry s vysokou efektivitou (až 97 %). Je ideální pro firemní areály, obchodní centra nebo menší veřejné nabíjecí body. Díky tichému provozu a odolné konstrukci vyhovuje i náročnějším podmínkám.'),
    (cs_power_id, 'en', 'Powerful charging, compact dimensions', 'HIGH EFFICIENCY', 'Alpitronic HYC50 is a modern DC charging station with 50 kW power that combines compact dimensions with high efficiency (up to 97%). It is ideal for corporate premises, shopping centers or smaller public charging points. Thanks to quiet operation and durable construction, it also meets more demanding conditions.'),
    (cs_power_id, 'de', 'Leistungsstarkes Laden, kompakte Abmessungen', 'HOHE EFFIZIENZ', 'Alpitronic HYC50 ist eine moderne DC-Ladestation mit 50 kW Leistung, die kompakte Abmessungen mit hoher Effizienz (bis zu 97 %) kombiniert. Sie ist ideal für Firmengelände, Einkaufszentren oder kleinere öffentliche Ladepunkte. Dank des leisen Betriebs und der robusten Konstruktion erfüllt sie auch anspruchsvollere Bedingungen.');

    -- Section 2: Dynamic power distribution
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_dynamic_id, 'c1000000-0000-0000-0000-000000000001', 'hyc50_bok-png.webp', 'Alpitronic HYC 50 dynamické rozdělení', 2);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_dynamic_id, 'cs', 'Dynamické rozdělování výkonu, snadná instalace', 'FLEXIBILNÍ ŘEŠENÍ', 'HYC50 přizpůsobí výkon podle potřeby – dynamicky rozděluje energii mezi dva konektory. Pokud nabíjí pouze jedno vozidlo, dostane plný výkon 50 kW. Kompaktní design usnadňuje instalaci i v omezeném prostoru. Stanice je navržena pro minimální nároky na údržbu.'),
    (cs_dynamic_id, 'en', 'Dynamic power distribution, easy installation', 'FLEXIBLE SOLUTION', 'HYC50 adapts power as needed – dynamically distributing energy between two connectors. If only one vehicle is charging, it gets the full 50 kW power. Compact design makes installation easy even in limited space. The station is designed for minimal maintenance requirements.'),
    (cs_dynamic_id, 'de', 'Dynamische Leistungsverteilung, einfache Installation', 'FLEXIBLE LÖSUNG', 'HYC50 passt die Leistung nach Bedarf an – dynamische Energieverteilung zwischen zwei Anschlüssen. Wenn nur ein Fahrzeug lädt, erhält es die volle Leistung von 50 kW. Das kompakte Design erleichtert die Installation auch auf begrenztem Raum. Die Station ist für minimale Wartungsanforderungen ausgelegt.');

    -- Section 3: Smart features
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_smart_id, 'c1000000-0000-0000-0000-000000000001', 'hyc50_bok-png.webp', 'Alpitronic HYC 50 chytré funkce', 3);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_smart_id, 'cs', 'Efektivní řešení s chytrými funkcemi', 'PLATEBNÍ TERMINÁL', 'HYC50 je nejen výkonná, ale také intuitivní. Integrovaný platební terminál umožňuje rychlé platby kartou. Jasný displej a přehledné LED indikátory usnadňují obsluhu. Podpora protokolu OCPP 1.6 zajišťuje kompatibilitu s většinou backendových systémů.'),
    (cs_smart_id, 'en', 'Efficient solution with smart features', 'PAYMENT TERMINAL', 'HYC50 is not only powerful but also intuitive. The integrated payment terminal enables quick card payments. Clear display and well-arranged LED indicators make operation easy. Support for OCPP 1.6 protocol ensures compatibility with most backend systems.'),
    (cs_smart_id, 'de', 'Effiziente Lösung mit intelligenten Funktionen', 'ZAHLUNGSTERMINAL', 'HYC50 ist nicht nur leistungsstark, sondern auch intuitiv. Das integrierte Zahlungsterminal ermöglicht schnelle Kartenzahlungen. Klares Display und übersichtliche LED-Anzeigen erleichtern die Bedienung. Die Unterstützung des OCPP 1.6-Protokolls gewährleistet die Kompatibilität mit den meisten Backend-Systemen.');
END $$;

-- ============================================
-- 8. PRODUCT FEATURES (Badges)
-- ============================================

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'c1000000-0000-0000-0000-000000000001', id FROM product_features WHERE slug = 'dc-fast'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'c1000000-0000-0000-0000-000000000001', id FROM product_features WHERE slug = 'commercial'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'c1000000-0000-0000-0000-000000000001', id FROM product_features WHERE slug = 'smart-management'
ON CONFLICT DO NOTHING;
