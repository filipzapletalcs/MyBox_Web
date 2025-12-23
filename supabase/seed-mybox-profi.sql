-- ============================================
-- SEED DATA: MyBox Profi
-- ============================================

-- Nejprve smažeme existující data pro mybox-profi (pokud existují)
DELETE FROM products WHERE slug = 'mybox-profi';

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
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'mybox-profi',
    'ac_mybox',
    'MYBOX-PROFI',
    true,
    true,
    1,
    '/images/products/profi/profi-front.png',
    '/images/products/profi/profi-black.png',
    '/downloads/mybox-profi-datasheet.pdf',
    'MyBox-Profi-Datasheet.pdf',
    'mybox',
    '2×22 kW',
    'ELEXIM, a.s.',
    'https://mybox.eco',
    'CZ',
    'Nabíjecí stanice pro elektromobily'
);

-- ============================================
-- 2. PRODUCT TRANSLATIONS
-- ============================================

INSERT INTO product_translations (product_id, locale, name, tagline, description, seo_title, seo_description) VALUES
-- Czech
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cs',
 'MyBox Profi',
 'Profesionální wallbox pro 2 elektromobily s řadou pokročilých funkcí. Vyhovuje požadavkům pro intenzivní používání i pokročilou správu zařízení.',
 'Wallbox s výkonem 2×22 kW pro profesionální využití. Kombinace oceli a kaleného skla tvoří ochranu proti nepříznivým podmínkám či mechanickému poškození.',
 'MyBox Profi - Profesionální nabíjecí stanice 2×22 kW | MyBox.eco',
 'Profesionální wallbox MyBox Profi s výkonem 2×22 kW pro firemní využití. 2 nabíjecí body, MID elektroměr, OCPP 1.6. Vyrobeno v ČR.'
),
-- English
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'en',
 'MyBox Profi',
 'Professional wallbox for 2 electric vehicles with a range of advanced features. Meets requirements for intensive use and advanced device management.',
 'Wallbox with 2×22 kW output for professional use. The combination of steel and tempered glass provides protection against adverse conditions or mechanical damage.',
 'MyBox Profi - Professional Charging Station 2×22 kW | MyBox.eco',
 'Professional MyBox Profi wallbox with 2×22 kW output for business use. 2 charging points, MID meter, OCPP 1.6. Made in Czech Republic.'
),
-- German
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'de',
 'MyBox Profi',
 'Professionelle Wallbox für 2 Elektrofahrzeuge mit einer Reihe von erweiterten Funktionen. Erfüllt Anforderungen für intensive Nutzung und erweiterte Geräteverwaltung.',
 'Wallbox mit 2×22 kW Ausgangsleistung für den professionellen Einsatz. Die Kombination aus Stahl und gehärtetem Glas bietet Schutz gegen widrige Bedingungen oder mechanische Beschädigungen.',
 'MyBox Profi - Professionelle Ladestation 2×22 kW | MyBox.eco',
 'Professionelle MyBox Profi Wallbox mit 2×22 kW Ausgangsleistung für den geschäftlichen Einsatz. 2 Ladepunkte, MID-Zähler, OCPP 1.6. Hergestellt in Tschechien.'
);

-- ============================================
-- 3. PRODUCT IMAGES (Gallery)
-- ============================================

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '/images/products/profi/gallery/mybox-profi_office-cam-2_3k_final.jpg', 'MyBox Profi v kancelářském prostředí', true, 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '/images/products/profi/gallery/mybox-profi_office-cam-4_3k_final.jpg', 'MyBox Profi detail', false, 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '/images/products/profi/gallery/mybox-profi_office-cam-6_3k_final.jpg', 'MyBox Profi boční pohled', false, 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '/images/products/profi/gallery/mybox-profi_office-cam-8_3k_final.jpg', 'MyBox Profi v provozu', false, 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '/images/products/profi/gallery/mybox_profi_podzemni_garaz_cam-1_3k_final.jpg', 'MyBox Profi v podzemní garáži', false, 5),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '/images/products/profi/gallery/mybox_profi_podzemni_garaz_cam-3_3k_final.jpg', 'MyBox Profi v garážovém komplexu', false, 6),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '/images/products/profi/gallery/mybox_profi_podzemni_garaz_cam-4_3k_final.jpg', 'MyBox Profi instalace', false, 7),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '/images/products/profi/gallery/mybox_profi_individual.png', 'MyBox Profi individuální design', false, 8);

-- ============================================
-- 4. PRODUCT SPECIFICATIONS
-- ============================================

-- Power category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'model', 'Profi 2×22 kW', NULL, 'power', 1, 'Model', 'Model', 'Modell'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'maxPower', '44', 'kW', 'power', 2, 'Max. výstupní výkon', 'Max. output power', 'Max. Ausgangsleistung'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'powerPerConnector', '22', 'kW', 'power', 3, 'Výkon na konektor', 'Power per connector', 'Leistung pro Anschluss'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'voltage', '400 V (±10%)', NULL, 'power', 4, 'Napětí', 'Voltage', 'Spannung'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'currentPerConnector', '3×32', 'A', 'power', 5, 'Proud na konektor', 'Current per connector', 'Strom pro Anschluss'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'connectors', '2× Typ 2', NULL, 'power', 6, 'Počet konektorů', 'Number of connectors', 'Anzahl der Anschlüsse');

-- Dimensions category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'dimensions', '390 × 630 × 180', 'mm', 'dimensions', 1, 'Rozměry (Š×V×H)', 'Dimensions (W×H×D)', 'Abmessungen (B×H×T)'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'weight', '25', 'kg', 'dimensions', 2, 'Hmotnost', 'Weight', 'Gewicht'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'protection', 'IP54 / IK10', NULL, 'dimensions', 3, 'Krytí', 'Protection', 'Schutzart'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'material', 'Kalené sklo, ocel', NULL, 'dimensions', 4, 'Materiál', 'Material', 'Material'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'operatingTemp', '-30°C až +50°C', NULL, 'dimensions', 5, 'Provozní teplota', 'Operating temperature', 'Betriebstemperatur');

-- Connectivity category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ethernet', 'RJ45', NULL, 'connectivity', 1, 'Ethernet', 'Ethernet', 'Ethernet'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'wifi', '2.4 GHz b/g/n', NULL, 'connectivity', 2, 'WiFi', 'WiFi', 'WiFi'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'optional', '4G/LTE, VPN', NULL, 'connectivity', 3, 'Volitelně', 'Optional', 'Optional'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'protocols', 'OCPP 1.6, Modbus TCP, MQTT', NULL, 'connectivity', 4, 'Protokoly', 'Protocols', 'Protokolle'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'rfid', 'ISO-14443, NFC, Mifare', NULL, 'connectivity', 5, 'RFID', 'RFID', 'RFID');

-- Security category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'breaker', '2× MCB (B) 32A', NULL, 'security', 1, 'Jistič', 'Circuit breaker', 'Sicherungsautomat'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'rcd', '2× RCD typ A (30mA)', NULL, 'security', 2, 'Proudový chránič', 'Residual current device', 'Fehlerstromschutzschalter'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'rcm', 'RCM 6mA', NULL, 'security', 3, 'DC ochrana', 'DC protection', 'DC-Schutz'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'meter', 'MID certifikace', NULL, 'security', 4, 'Elektroměr', 'Meter', 'Stromzähler'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'connectorLock', 'Ano', NULL, 'security', 5, 'Zámek konektoru', 'Connector lock', 'Steckerverriegelung'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'doorLock', 'Na klíč', NULL, 'security', 6, 'Zámek dveří', 'Door lock', 'Türschloss');

-- ============================================
-- 5. PRODUCT FEATURE POINTS (using gen_random_uuid())
-- ============================================

DO $$
DECLARE
    fp_power_id UUID := gen_random_uuid();
    fp_protocol_id UUID := gen_random_uuid();
    fp_connectivity_id UUID := gen_random_uuid();
    fp_protection_id UUID := gen_random_uuid();
    fp_meter_id UUID := gen_random_uuid();
    fp_temperature_id UUID := gen_random_uuid();
BEGIN
    -- Feature point: Power
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_power_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'power', 'left', 1);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_power_id, 'cs', 'Výkon', '2×22 kW'),
    (fp_power_id, 'en', 'Power', '2×22 kW'),
    (fp_power_id, 'de', 'Leistung', '2×22 kW');

    -- Feature point: Protocol
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_protocol_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'protocol', 'left', 2);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_protocol_id, 'cs', 'Protokol', 'OCPP 1.6'),
    (fp_protocol_id, 'en', 'Protocol', 'OCPP 1.6'),
    (fp_protocol_id, 'de', 'Protokoll', 'OCPP 1.6');

    -- Feature point: Connectivity
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_connectivity_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'connectivity', 'left', 3);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_connectivity_id, 'cs', 'Konektivita', 'WiFi / Ethernet'),
    (fp_connectivity_id, 'en', 'Connectivity', 'WiFi / Ethernet'),
    (fp_connectivity_id, 'de', 'Konnektivität', 'WiFi / Ethernet');

    -- Feature point: Protection
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_protection_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'protection', 'right', 4);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_protection_id, 'cs', 'Krytí', 'IP54 / IK10'),
    (fp_protection_id, 'en', 'Protection', 'IP54 / IK10'),
    (fp_protection_id, 'de', 'Schutzart', 'IP54 / IK10');

    -- Feature point: Meter
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_meter_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'meter', 'right', 5);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_meter_id, 'cs', 'Elektroměr', 'MID certifikace'),
    (fp_meter_id, 'en', 'Meter', 'MID certification'),
    (fp_meter_id, 'de', 'Stromzähler', 'MID-Zertifizierung');

    -- Feature point: Temperature
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_temperature_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'temperature', 'right', 6);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_temperature_id, 'cs', 'Provozní teplota', '-30°C až +50°C'),
    (fp_temperature_id, 'en', 'Operating temp.', '-30°C to +50°C'),
    (fp_temperature_id, 'de', 'Betriebstemp.', '-30°C bis +50°C');
END $$;

-- ============================================
-- 6. PRODUCT COLOR VARIANTS
-- ============================================

DO $$
DECLARE
    cv_black_id UUID := gen_random_uuid();
    cv_white_id UUID := gen_random_uuid();
BEGIN
    -- Black variant
    INSERT INTO product_color_variants (id, product_id, color_key, image_url, sort_order)
    VALUES (cv_black_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'black', '/images/products/profi/profi-black.png', 1);

    INSERT INTO product_color_variant_translations (variant_id, locale, label) VALUES
    (cv_black_id, 'cs', 'Černé sklo'),
    (cv_black_id, 'en', 'Black glass'),
    (cv_black_id, 'de', 'Schwarzes Glas');

    -- White variant
    INSERT INTO product_color_variants (id, product_id, color_key, image_url, sort_order)
    VALUES (cv_white_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'white', '/images/products/profi/profi-white.webp', 2);

    INSERT INTO product_color_variant_translations (variant_id, locale, label) VALUES
    (cv_white_id, 'cs', 'Bílé sklo'),
    (cv_white_id, 'en', 'White glass'),
    (cv_white_id, 'de', 'Weißes Glas');
END $$;

-- ============================================
-- 7. PRODUCT CONTENT SECTIONS
-- ============================================

DO $$
DECLARE
    cs_business_id UUID := gen_random_uuid();
    cs_outdoor_id UUID := gen_random_uuid();
BEGIN
    -- Section 1: Business solution
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_business_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '/images/products/profi/gallery/mybox-profi_office-cam-2_3k_final.jpg', 'MyBox Profi v kancelářském prostředí', 1);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_business_id, 'cs', 'Profesionální řešení pro firemní dobíjení', 'Pro business', 'MyBox Profi je navržen pro náročné firemní prostředí. Díky dvěma nezávislým nabíjecím bodům s výkonem 22 kW umožňuje současné dobíjení dvou elektromobilů. Integrovaný elektroměr s MID certifikací zajišťuje přesné měření spotřeby pro účtování.'),
    (cs_business_id, 'en', 'Professional solution for corporate charging', 'For business', 'MyBox Profi is designed for demanding corporate environments. With two independent charging points rated at 22 kW, it enables simultaneous charging of two electric vehicles. The integrated MID-certified meter ensures accurate consumption measurement for billing.'),
    (cs_business_id, 'de', 'Professionelle Lösung für Firmenladung', 'Für Unternehmen', 'MyBox Profi ist für anspruchsvolle Unternehmensumgebungen konzipiert. Mit zwei unabhängigen Ladepunkten mit je 22 kW ermöglicht er das gleichzeitige Laden von zwei Elektrofahrzeugen. Der integrierte MID-zertifizierte Zähler gewährleistet eine genaue Verbrauchsmessung für die Abrechnung.');

    -- Section 2: Outdoor durability
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_outdoor_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '/images/products/profi/gallery/mybox_profi_podzemni_garaz_cam-3_3k_final.jpg', 'MyBox Profi v garážovém komplexu', 2);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_outdoor_id, 'cs', 'Odolná konstrukce pro venkovní instalaci', 'Kvalita a odolnost', 'Kombinace kaleného skla a lakované nebo nerezové oceli zajišťuje maximální odolnost proti nepříznivým povětrnostním podmínkám i mechanickému poškození. Krytí IP54/IK10 garantuje spolehlivý provoz v náročných podmínkách od -30°C do +50°C.'),
    (cs_outdoor_id, 'en', 'Durable construction for outdoor installation', 'Quality and durability', 'The combination of tempered glass and painted or stainless steel ensures maximum resistance to adverse weather conditions and mechanical damage. IP54/IK10 protection guarantees reliable operation in demanding conditions from -30°C to +50°C.'),
    (cs_outdoor_id, 'de', 'Robuste Konstruktion für Außeninstallation', 'Qualität und Haltbarkeit', 'Die Kombination aus gehärtetem Glas und lackiertem oder rostfreiem Stahl gewährleistet maximale Beständigkeit gegen widrige Witterungsbedingungen und mechanische Beschädigungen. Die Schutzart IP54/IK10 garantiert einen zuverlässigen Betrieb unter anspruchsvollen Bedingungen von -30°C bis +50°C.');
END $$;

-- ============================================
-- 8. PRODUCT FEATURES (Badges)
-- ============================================

-- Link to existing features (if they exist)
INSERT INTO product_to_features (product_id, feature_id)
SELECT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', id FROM product_features WHERE slug = 'dual'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', id FROM product_features WHERE slug = 'commercial'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', id FROM product_features WHERE slug = 'smart'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', id FROM product_features WHERE slug = 'connectivity'
ON CONFLICT DO NOTHING;
