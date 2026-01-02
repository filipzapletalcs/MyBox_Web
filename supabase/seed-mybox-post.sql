-- ============================================
-- SEED DATA: MyBox Post
-- Texty z webu mybox.eco, specifikace z datasheetu
-- ============================================

-- Nejprve smažeme existující data pro mybox-post (pokud existují)
DELETE FROM products WHERE slug = 'mybox-post';

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
    'b3000000-0000-0000-0000-000000000003',
    'mybox-post',
    'ac_mybox',
    'MYBOX-POST-44',
    true,
    true,
    2,
    'post_studio_web_cam_4-0000.png',
    'post_studio_web_cam_4-0000.png',
    '/downloads/mybox-post-datasheet.pdf',
    'MyBox-Post-Datasheet.pdf',
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
('b3000000-0000-0000-0000-000000000003', 'cs',
 'MyBox Post',
 'Sloupová AC stanice v čistém designu dodá energii dvěma vozům současně. Vynikne v areálu firmy i na veřejné ploše.',
 'Sloupová nabíjecí stanice s výkonem 2×22 kW pro profesionální využití. Kombinace kaleného skla a lakované/nerezové oceli tvoří ochranu proti nepříznivým podmínkám či vandalům.',
 'MyBox Post - Sloupová nabíjecí stanice 2×22 kW | MyBox.eco',
 'Sloupová AC stanice MyBox Post s výkonem 2×22 kW. 2 nabíjecí body, MID elektroměr, OCPP 1.6, 4G/LTE. Vyrobeno v ČR.'
),
-- English
('b3000000-0000-0000-0000-000000000003', 'en',
 'MyBox Post',
 'Column AC station in clean design delivers energy to two vehicles simultaneously. Stands out in company premises or public areas.',
 'Column charging station with 2×22 kW output for professional use. The combination of tempered glass and painted/stainless steel provides protection against adverse conditions or vandals.',
 'MyBox Post - Column Charging Station 2×22 kW | MyBox.eco',
 'Column AC station MyBox Post with 2×22 kW output. 2 charging points, MID meter, OCPP 1.6, 4G/LTE. Made in Czech Republic.'
),
-- German
('b3000000-0000-0000-0000-000000000003', 'de',
 'MyBox Post',
 'Säulen-AC-Station im klaren Design liefert Energie an zwei Fahrzeuge gleichzeitig. Fällt auf Firmengeländen oder öffentlichen Flächen auf.',
 'Säulen-Ladestation mit 2×22 kW Ausgangsleistung für den professionellen Einsatz. Die Kombination aus gehärtetem Glas und lackiertem/Edelstahl bietet Schutz gegen widrige Bedingungen oder Vandalismus.',
 'MyBox Post - Säulen-Ladestation 2×22 kW | MyBox.eco',
 'Säulen-AC-Station MyBox Post mit 2×22 kW Ausgangsleistung. 2 Ladepunkte, MID-Zähler, OCPP 1.6, 4G/LTE. Hergestellt in Tschechien.'
);

-- ============================================
-- 3. PRODUCT IMAGES (Gallery)
-- ============================================

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order) VALUES
('b3000000-0000-0000-0000-000000000003', 'post_studio_web_cam_4-0000.png', 'MyBox Post sloupová stanice', true, 1);

-- ============================================
-- 4. PRODUCT SPECIFICATIONS
-- ============================================

-- Power category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('b3000000-0000-0000-0000-000000000003', 'model', 'Post 2×22 kW', NULL, 'power', 1, 'Model', 'Model', 'Modell'),
('b3000000-0000-0000-0000-000000000003', 'maxPower', '44', 'kW', 'power', 2, 'Max. výstupní výkon', 'Max. output power', 'Max. Ausgangsleistung'),
('b3000000-0000-0000-0000-000000000003', 'powerPerConnector', '22', 'kW', 'power', 3, 'Výkon na konektor', 'Power per connector', 'Leistung pro Anschluss'),
('b3000000-0000-0000-0000-000000000003', 'voltage', '400 V (±10%)', NULL, 'power', 4, 'Napětí', 'Voltage', 'Spannung'),
('b3000000-0000-0000-0000-000000000003', 'currentPerConnector', '3×32', 'A', 'power', 5, 'Proud na konektor', 'Current per connector', 'Strom pro Anschluss'),
('b3000000-0000-0000-0000-000000000003', 'connectors', '2× Typ 2 zásuvka', NULL, 'power', 6, 'Počet konektorů', 'Number of connectors', 'Anzahl der Anschlüsse');

-- Dimensions category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('b3000000-0000-0000-0000-000000000003', 'dimensions', '370 × 1420 × 200', 'mm', 'dimensions', 1, 'Rozměry (Š×V×H)', 'Dimensions (W×H×D)', 'Abmessungen (B×H×T)'),
('b3000000-0000-0000-0000-000000000003', 'weight', '52', 'kg', 'dimensions', 2, 'Hmotnost', 'Weight', 'Gewicht'),
('b3000000-0000-0000-0000-000000000003', 'protection', 'IP54 / IK10', NULL, 'dimensions', 3, 'Krytí', 'Protection', 'Schutzart'),
('b3000000-0000-0000-0000-000000000003', 'material', 'Kalené sklo, lakovaná/nerezová ocel', NULL, 'dimensions', 4, 'Materiál', 'Material', 'Material'),
('b3000000-0000-0000-0000-000000000003', 'operatingTemp', '-30°C až +50°C', NULL, 'dimensions', 5, 'Provozní teplota', 'Operating temperature', 'Betriebstemperatur');

-- Connectivity category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('b3000000-0000-0000-0000-000000000003', 'ethernet', 'RJ45', NULL, 'connectivity', 1, 'Ethernet', 'Ethernet', 'Ethernet'),
('b3000000-0000-0000-0000-000000000003', 'wifi', '2.4 GHz b/g/n', NULL, 'connectivity', 2, 'WiFi', 'WiFi', 'WiFi'),
('b3000000-0000-0000-0000-000000000003', 'lte', '4G/LTE', NULL, 'connectivity', 3, '4G/LTE', '4G/LTE', '4G/LTE'),
('b3000000-0000-0000-0000-000000000003', 'protocols', 'OCPP 1.6, Modbus TCP, MQTT', NULL, 'connectivity', 4, 'Protokoly', 'Protocols', 'Protokolle'),
('b3000000-0000-0000-0000-000000000003', 'rfid', 'ISO-14443 A&B, NFC, Mifare, Legic', NULL, 'connectivity', 5, 'RFID', 'RFID', 'RFID');

-- Security category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('b3000000-0000-0000-0000-000000000003', 'breaker', '2× MCB (B) 32A', NULL, 'security', 1, 'Jistič', 'Circuit breaker', 'Sicherungsautomat'),
('b3000000-0000-0000-0000-000000000003', 'rcd', '2× RCD typ A (30mA)', NULL, 'security', 2, 'Proudový chránič', 'Residual current device', 'Fehlerstromschutzschalter'),
('b3000000-0000-0000-0000-000000000003', 'rcm', '2× RCM 6mA', NULL, 'security', 3, 'DC ochrana', 'DC protection', 'DC-Schutz'),
('b3000000-0000-0000-0000-000000000003', 'meter', 'MID třída 1', NULL, 'security', 4, 'Elektroměr', 'Meter', 'Stromzähler'),
('b3000000-0000-0000-0000-000000000003', 'connectorLock', 'Ano', NULL, 'security', 5, 'Zámek konektoru', 'Connector lock', 'Steckerverriegelung'),
('b3000000-0000-0000-0000-000000000003', 'doorLock', 'Na klíč', NULL, 'security', 6, 'Zámek dveří', 'Door lock', 'Türschloss');

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
    VALUES (fp_power_id, 'b3000000-0000-0000-0000-000000000003', 'power', 'left', 1);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_power_id, 'cs', 'Výkon', '2×22 kW'),
    (fp_power_id, 'en', 'Power', '2×22 kW'),
    (fp_power_id, 'de', 'Leistung', '2×22 kW');

    -- Feature point: Protection
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_protection_id, 'b3000000-0000-0000-0000-000000000003', 'protection', 'left', 2);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_protection_id, 'cs', 'Krytí', 'IP54 / IK10'),
    (fp_protection_id, 'en', 'Protection', 'IP54 / IK10'),
    (fp_protection_id, 'de', 'Schutzart', 'IP54 / IK10');

    -- Feature point: Connectors
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_connector_id, 'b3000000-0000-0000-0000-000000000003', 'protocol', 'right', 3);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_connector_id, 'cs', 'Pro 2 vozy', '2× Typ 2'),
    (fp_connector_id, 'en', 'For 2 cars', '2× Type 2'),
    (fp_connector_id, 'de', 'Für 2 Autos', '2× Typ 2');

    -- Feature point: Temperature
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_temperature_id, 'b3000000-0000-0000-0000-000000000003', 'temperature', 'right', 4);

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
BEGIN
    -- Black variant
    INSERT INTO product_color_variants (id, product_id, color_key, image_url, sort_order)
    VALUES (cv_black_id, 'b3000000-0000-0000-0000-000000000003', 'black', 'post_studio_web_cam_4-0000.png', 1);

    INSERT INTO product_color_variant_translations (variant_id, locale, label) VALUES
    (cv_black_id, 'cs', 'Černá'),
    (cv_black_id, 'en', 'Black'),
    (cv_black_id, 'de', 'Schwarz');
END $$;

-- ============================================
-- 7. PRODUCT CONTENT SECTIONS
-- ============================================

DO $$
DECLARE
    cs_design_id UUID := gen_random_uuid();
    cs_comfort_id UUID := gen_random_uuid();
    cs_smart_id UUID := gen_random_uuid();
BEGIN
    -- Section 1: Design & Durability
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_design_id, 'b3000000-0000-0000-0000-000000000003', 'post_studio_web_cam_4-0000.png', 'MyBox Post design a odolnost', 1);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_design_id, 'cs', 'Ihned zaujme. Vydrží roky', 'PRÉMIOVÁ KONSTRUKCE', 'Čistý design stanice je nadčasový. Díky prémiové konstrukci bude stanice v kondici po mnoho let. Odolá dešti, mrazu i vandalům. Kombinaci kaleného skla s lakovanou nebo nerezovou ocelí použijeme podle požadavků vaší lokality. Elegantní prosvícení kaleného skla vytváří na okolí bezpečný dojem. Díky LED Smart osvětlení budete mít přehled o aktuálním stavu stanice.'),
    (cs_design_id, 'en', 'Immediately impresses. Lasts for years', 'PREMIUM CONSTRUCTION', 'The clean design of the station is timeless. Thanks to premium construction, the station will stay in shape for many years. It will withstand rain, frost and vandals. We use a combination of tempered glass with painted or stainless steel according to your location requirements. Elegant illuminated tempered glass creates a safe impression on the surroundings. Thanks to LED Smart lighting, you will have an overview of the current station status.'),
    (cs_design_id, 'de', 'Sofort beeindruckend. Hält Jahre', 'PREMIUM-KONSTRUKTION', 'Das klare Design der Station ist zeitlos. Dank Premium-Konstruktion wird die Station viele Jahre in Form bleiben. Sie hält Regen, Frost und Vandalismus stand. Wir verwenden eine Kombination aus gehärtetem Glas mit lackiertem oder Edelstahl entsprechend Ihren Standortanforderungen. Elegant beleuchtetes gehärtetes Glas erzeugt einen sicheren Eindruck auf die Umgebung. Dank LED-Smart-Beleuchtung haben Sie den Überblick über den aktuellen Stationsstatus.');

    -- Section 2: Easy operation
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_comfort_id, 'b3000000-0000-0000-0000-000000000003', 'post_studio_web_cam_4-0000.png', 'MyBox Post snadná obsluha', 2);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_comfort_id, 'cs', 'Nabíjejte pohodlně', 'SNADNÁ OBSLUHA', 'Obsluha nabíjecí stanice MyBox Post je snadná a intuitivní. Přijedete, připojíte, nabíjíte. Řidiči elektromobilů snadno načtou své RFID karty a za pár okamžiků už nabíjí. Při nabíjení přehledně uložíte kabel do speciálního držáku na stanici. Autorizace nabíjení je možná pomocí RFID karty nebo QR kódu.'),
    (cs_comfort_id, 'en', 'Charge comfortably', 'EASY OPERATION', 'Operating the MyBox Post charging station is easy and intuitive. You arrive, connect, charge. EV drivers easily read their RFID cards and start charging in moments. During charging, you can neatly store the cable in a special holder on the station. Charging authorization is possible via RFID card or QR code.'),
    (cs_comfort_id, 'de', 'Laden Sie bequem', 'EINFACHE BEDIENUNG', 'Die Bedienung der MyBox Post Ladestation ist einfach und intuitiv. Sie kommen an, schließen an, laden. E-Auto-Fahrer lesen einfach ihre RFID-Karten und starten das Laden in Sekunden. Während des Ladens können Sie das Kabel ordentlich in einer speziellen Halterung an der Station verstauen. Die Ladeautorisierung ist per RFID-Karte oder QR-Code möglich.');

    -- Section 3: Smart features
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_smart_id, 'b3000000-0000-0000-0000-000000000003', 'post_studio_web_cam_4-0000.png', 'MyBox Post chytré funkce', 3);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_smart_id, 'cs', 'Chytré funkce. Nové příležitosti', 'CLOUD A KONEKTIVITA', 'Stanice zapadá do celého ekosystému MyBox. Připojí se k internetu a využívá vlastní Cloud, případně CPO systémy třetích stran. Podpora protokolu OCPP 1.6 zajišťuje snadné napojení na většinu backendových systémů. Díky MID certifikovanému elektroměru můžete jednoduše účtovat za nabíjení. Load management umožňuje inteligentně řídit výkon podle aktuálních potřeb.'),
    (cs_smart_id, 'en', 'Smart features. New opportunities', 'CLOUD AND CONNECTIVITY', 'The station fits into the entire MyBox ecosystem. It connects to the internet and uses its own Cloud or third-party CPO systems. Support for OCPP 1.6 protocol ensures easy connection to most backend systems. Thanks to the MID-certified meter, you can easily bill for charging. Load management allows intelligent power control according to current needs.'),
    (cs_smart_id, 'de', 'Intelligente Funktionen. Neue Möglichkeiten', 'CLOUD UND KONNEKTIVITÄT', 'Die Station fügt sich in das gesamte MyBox-Ökosystem ein. Sie verbindet sich mit dem Internet und nutzt die eigene Cloud oder CPO-Systeme von Drittanbietern. Die Unterstützung des OCPP 1.6-Protokolls gewährleistet eine einfache Verbindung zu den meisten Backend-Systemen. Dank des MID-zertifizierten Zählers können Sie einfach für das Laden abrechnen. Lastmanagement ermöglicht eine intelligente Leistungssteuerung nach aktuellen Bedürfnissen.');
END $$;

-- ============================================
-- 8. PRODUCT FEATURES (Badges)
-- ============================================

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b3000000-0000-0000-0000-000000000003', id FROM product_features WHERE slug = 'dual'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b3000000-0000-0000-0000-000000000003', id FROM product_features WHERE slug = 'commercial'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b3000000-0000-0000-0000-000000000003', id FROM product_features WHERE slug = 'smart-management'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b3000000-0000-0000-0000-000000000003', id FROM product_features WHERE slug = 'cloud-ready'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b3000000-0000-0000-0000-000000000003', id FROM product_features WHERE slug = 'czech-made'
ON CONFLICT DO NOTHING;
