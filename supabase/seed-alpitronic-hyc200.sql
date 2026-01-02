-- ============================================
-- SEED DATA: Alpitronic HYC 200
-- Texty z webu mybox.eco, základní informace
-- ============================================

-- Nejprve smažeme existující data pro alpitronic-hyc200 (pokud existují)
DELETE FROM products WHERE slug = 'alpitronic-hyc200';

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
    'c2000000-0000-0000-0000-000000000002',
    'alpitronic-hyc200',
    'dc_alpitronic',
    'ALPITRONIC-HYC200',
    true,
    true,
    11,
    'hyc_200_bok-png.webp',
    'hyc_200_bok-png.webp',
    NULL,
    NULL,
    'alpitronic',
    '100-200 kW',
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
('c2000000-0000-0000-0000-000000000002', 'cs',
 'Alpitronic HYC 200',
 'Alpitronic HYC200 – modulární DC nabíjecí stanice s výkonem až 200 kW. Efektivní, kompaktní a připravená na budoucnost elektromobility. Ideální pro veřejné i firemní nabíjení.',
 'Modulární DC nabíjecí stanice s výkonem 100-200 kW a účinností až 97 %. Škálovatelná architektura umožňuje růst podle potřeb. Ideální pro veřejné a firemní nabíjecí huby.',
 'Alpitronic HYC 200 - DC nabíjecí stanice 200 kW | MyBox.eco',
 'Modulární DC nabíjecí stanice Alpitronic HYC 200 s výkonem až 200 kW. Škálovatelná architektura, účinnost až 97 %, CCS2 konektory.'
),
-- English
('c2000000-0000-0000-0000-000000000002', 'en',
 'Alpitronic HYC 200',
 'Alpitronic HYC200 – modular DC charging station with up to 200 kW power. Efficient, compact and ready for the future of e-mobility. Ideal for public and corporate charging.',
 'Modular DC charging station with 100-200 kW power and up to 97% efficiency. Scalable architecture allows growth according to needs. Ideal for public and corporate charging hubs.',
 'Alpitronic HYC 200 - DC Charging Station 200 kW | MyBox.eco',
 'Modular DC charging station Alpitronic HYC 200 with up to 200 kW power. Scalable architecture, up to 97% efficiency, CCS2 connectors.'
),
-- German
('c2000000-0000-0000-0000-000000000002', 'de',
 'Alpitronic HYC 200',
 'Alpitronic HYC200 – modulare DC-Ladestation mit bis zu 200 kW Leistung. Effizient, kompakt und bereit für die Zukunft der Elektromobilität. Ideal für öffentliches und Firmenladen.',
 'Modulare DC-Ladestation mit 100-200 kW Leistung und bis zu 97 % Effizienz. Skalierbare Architektur ermöglicht Wachstum nach Bedarf. Ideal für öffentliche und Firmen-Ladehubs.',
 'Alpitronic HYC 200 - DC-Ladestation 200 kW | MyBox.eco',
 'Modulare DC-Ladestation Alpitronic HYC 200 mit bis zu 200 kW Leistung. Skalierbare Architektur, bis zu 97 % Effizienz, CCS2-Anschlüsse.'
);

-- ============================================
-- 3. PRODUCT IMAGES (Gallery)
-- ============================================

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order) VALUES
('c2000000-0000-0000-0000-000000000002', 'hyc_200_bok-png.webp', 'Alpitronic HYC 200 boční pohled', true, 1);

-- ============================================
-- 4. PRODUCT SPECIFICATIONS
-- ============================================

-- Power category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('c2000000-0000-0000-0000-000000000002', 'model', 'HYC 200', NULL, 'power', 1, 'Model', 'Model', 'Modell'),
('c2000000-0000-0000-0000-000000000002', 'maxPower', '100-200', 'kW', 'power', 2, 'Škálovatelný výkon', 'Scalable power', 'Skalierbare Leistung'),
('c2000000-0000-0000-0000-000000000002', 'efficiency', '97', '%', 'power', 3, 'Účinnost', 'Efficiency', 'Wirkungsgrad'),
('c2000000-0000-0000-0000-000000000002', 'connectors', '2× CCS2', NULL, 'power', 4, 'Počet konektorů', 'Number of connectors', 'Anzahl der Anschlüsse');

-- Dimensions category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('c2000000-0000-0000-0000-000000000002', 'protection', 'IP54 / IK10', NULL, 'dimensions', 1, 'Krytí', 'Protection', 'Schutzart'),
('c2000000-0000-0000-0000-000000000002', 'operatingTemp', '-30°C až +55°C', NULL, 'dimensions', 2, 'Provozní teplota', 'Operating temperature', 'Betriebstemperatur');

-- Connectivity category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('c2000000-0000-0000-0000-000000000002', 'protocols', 'OCPP 1.6', NULL, 'connectivity', 1, 'Protokoly', 'Protocols', 'Protokolle'),
('c2000000-0000-0000-0000-000000000002', 'payment', 'Platební terminál', NULL, 'connectivity', 2, 'Platba', 'Payment', 'Bezahlung');

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
    VALUES (fp_power_id, 'c2000000-0000-0000-0000-000000000002', 'power', 'left', 1);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_power_id, 'cs', 'Škálovatelný výkon', '100-200 kW'),
    (fp_power_id, 'en', 'Scalable power', '100-200 kW'),
    (fp_power_id, 'de', 'Skalierbare Leistung', '100-200 kW');

    -- Feature point: Protection
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_protection_id, 'c2000000-0000-0000-0000-000000000002', 'protection', 'left', 2);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_protection_id, 'cs', 'Odolnost', 'IP54 / IK10'),
    (fp_protection_id, 'en', 'Protection', 'IP54 / IK10'),
    (fp_protection_id, 'de', 'Schutzart', 'IP54 / IK10');

    -- Feature point: Connectors
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_connector_id, 'c2000000-0000-0000-0000-000000000002', 'protocol', 'right', 3);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_connector_id, 'cs', 'Pro 2 vozy', 'Kabely CCS2'),
    (fp_connector_id, 'en', 'For 2 cars', 'CCS2 cables'),
    (fp_connector_id, 'de', 'Für 2 Autos', 'CCS2-Kabel');

    -- Feature point: Temperature
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_temperature_id, 'c2000000-0000-0000-0000-000000000002', 'temperature', 'right', 4);

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
    VALUES (cv_white_id, 'c2000000-0000-0000-0000-000000000002', 'white', 'hyc_200_bok-png.webp', 1);

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
    -- Section 1: Modular architecture
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_modular_id, 'c2000000-0000-0000-0000-000000000002', 'hyc_200_bok-png.webp', 'Alpitronic HYC 200 modulární architektura', 1);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_modular_id, 'cs', 'Nabíjecí stanice, která roste s vašimi potřebami', 'MODULÁRNÍ ARCHITEKTURA', 'Alpitronic HYC200 je výkonná DC nabíjecí stanice s modulární architekturou, která umožňuje škálování výkonu od 100 kW až po 200 kW. Stanice je ideální pro rychle se rozvíjející nabíjecí infrastrukturu – kdykoliv můžete navýšit výkon přidáním dalšího modulu. Účinnost až 97 % minimalizuje ztráty energie.'),
    (cs_modular_id, 'en', 'Charging station that grows with your needs', 'MODULAR ARCHITECTURE', 'Alpitronic HYC200 is a powerful DC charging station with modular architecture that allows scaling power from 100 kW to 200 kW. The station is ideal for rapidly developing charging infrastructure – you can increase power at any time by adding another module. Up to 97% efficiency minimizes energy losses.'),
    (cs_modular_id, 'de', 'Ladestation, die mit Ihren Bedürfnissen wächst', 'MODULARE ARCHITEKTUR', 'Alpitronic HYC200 ist eine leistungsstarke DC-Ladestation mit modularer Architektur, die eine Leistungsskalierung von 100 kW bis 200 kW ermöglicht. Die Station ist ideal für sich schnell entwickelnde Ladeinfrastruktur – Sie können die Leistung jederzeit durch Hinzufügen eines weiteren Moduls erhöhen. Bis zu 97 % Effizienz minimiert Energieverluste.');

    -- Section 2: Dynamic power management
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_dynamic_id, 'c2000000-0000-0000-0000-000000000002', 'hyc_200_bok-png.webp', 'Alpitronic HYC 200 dynamické rozdělení', 2);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_dynamic_id, 'cs', 'Dynamické rozdělení výkonu a chytrá správa kabelů', 'INTELIGENTNÍ ŘÍZENÍ', 'HYC200 inteligentně rozděluje výkon mezi dva nabíjecí konektory. Kabely jsou chladicí kapalinou chlazené, což umožňuje vysoké nabíjecí proudy bez přehřívání. Automatický cable management zajišťuje čisté prostředí kolem stanice. Displej s vysokým rozlišením zobrazuje všechny důležité informace.'),
    (cs_dynamic_id, 'en', 'Dynamic power distribution and smart cable management', 'INTELLIGENT CONTROL', 'HYC200 intelligently distributes power between two charging connectors. Cables are liquid-cooled, allowing high charging currents without overheating. Automatic cable management ensures a clean environment around the station. High-resolution display shows all important information.'),
    (cs_dynamic_id, 'de', 'Dynamische Leistungsverteilung und intelligentes Kabelmanagement', 'INTELLIGENTE STEUERUNG', 'HYC200 verteilt die Leistung intelligent zwischen zwei Ladeanschlüssen. Die Kabel sind flüssigkeitsgekühlt, was hohe Ladeströme ohne Überhitzung ermöglicht. Automatisches Kabelmanagement sorgt für eine saubere Umgebung um die Station. Hochauflösendes Display zeigt alle wichtigen Informationen.');

    -- Section 3: Compact design
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_design_id, 'c2000000-0000-0000-0000-000000000002', 'hyc_200_bok-png.webp', 'Alpitronic HYC 200 kompaktní design', 3);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_design_id, 'cs', 'Maximální výkon, minimalistické provedení', 'KOMPAKTNÍ DESIGN', 'Alpitronic HYC200 spojuje vysoký výkon s kompaktními rozměry. Účinnost až 97 % znamená nízké provozní náklady. Robustní konstrukce s krytím IP54/IK10 zaručuje spolehlivý provoz v náročných podmínkách od -30°C do +55°C. Integrovaný platební terminál umožňuje přímé platby kartou.'),
    (cs_design_id, 'en', 'Maximum power, minimalist design', 'COMPACT DESIGN', 'Alpitronic HYC200 combines high power with compact dimensions. Up to 97% efficiency means low operating costs. Robust construction with IP54/IK10 protection guarantees reliable operation in demanding conditions from -30°C to +55°C. Integrated payment terminal enables direct card payments.'),
    (cs_design_id, 'de', 'Maximale Leistung, minimalistisches Design', 'KOMPAKTES DESIGN', 'Alpitronic HYC200 kombiniert hohe Leistung mit kompakten Abmessungen. Bis zu 97 % Effizienz bedeutet niedrige Betriebskosten. Robuste Konstruktion mit IP54/IK10-Schutz garantiert zuverlässigen Betrieb unter anspruchsvollen Bedingungen von -30°C bis +55°C. Integriertes Zahlungsterminal ermöglicht direkte Kartenzahlungen.');
END $$;

-- ============================================
-- 8. PRODUCT FEATURES (Badges)
-- ============================================

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'c2000000-0000-0000-0000-000000000002', id FROM product_features WHERE slug = 'dc-fast'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'c2000000-0000-0000-0000-000000000002', id FROM product_features WHERE slug = 'commercial'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'c2000000-0000-0000-0000-000000000002', id FROM product_features WHERE slug = 'smart-management'
ON CONFLICT DO NOTHING;
