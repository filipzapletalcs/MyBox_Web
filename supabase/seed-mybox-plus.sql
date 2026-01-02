-- ============================================
-- SEED DATA: MyBox Plus
-- Texty z webu mybox.eco, specifikace z datasheetu
-- ============================================

-- Nejprve smažeme existující data pro mybox-plus (pokud existují)
DELETE FROM products WHERE slug = 'mybox-plus';

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
    'b2000000-0000-0000-0000-000000000002',
    'mybox-plus',
    'ac_mybox',
    'MYBOX-PLUS-22',
    true,
    false,
    3,
    'plus_studio_web_cam_4-0000.png',
    'plus_studio_web_cam_4-0000.png',
    '/downloads/mybox-plus-datasheet.pdf',
    'MyBox-Plus-Datasheet.pdf',
    'mybox',
    '22 kW',
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
('b2000000-0000-0000-0000-000000000002', 'cs',
 'MyBox Plus',
 'Stanice pro domácí i firemní nabíjení zaujme designem. Podle zkosené hrany ji poznáte na první pohled.',
 'Wallbox s výkonem 22 kW pro domácí a semi-profesionální využití. Kombinace kaleného skla a tvrzeného plastu zajišťuje dokonalou odolnost. Dodáváme ve variantě se zásuvkou nebo integrovaným kabelem.',
 'MyBox Plus - Nabíjecí stanice 22 kW | MyBox.eco',
 'Designový wallbox MyBox Plus s výkonem 22 kW. MID elektroměr, RFID, OCPP 1.6. Varianta s kabelem nebo zásuvkou. Vyrobeno v ČR.'
),
-- English
('b2000000-0000-0000-0000-000000000002', 'en',
 'MyBox Plus',
 'Charging station for home and business use impresses with design. You will recognize it at first glance by its beveled edge.',
 'Wallbox with 22 kW output for home and semi-professional use. The combination of tempered glass and hardened plastic ensures perfect durability. Available with socket or integrated cable.',
 'MyBox Plus - Charging Station 22 kW | MyBox.eco',
 'Design wallbox MyBox Plus with 22 kW output. MID meter, RFID, OCPP 1.6. Cable or socket variant. Made in Czech Republic.'
),
-- German
('b2000000-0000-0000-0000-000000000002', 'de',
 'MyBox Plus',
 'Ladestation für Heim- und Geschäftsnutzung beeindruckt durch Design. Sie erkennen sie auf den ersten Blick an der abgeschrägten Kante.',
 'Wallbox mit 22 kW Ausgangsleistung für Heim- und Semi-Profi-Nutzung. Die Kombination aus gehärtetem Glas und gehärtetem Kunststoff gewährleistet perfekte Haltbarkeit. Erhältlich mit Steckdose oder integriertem Kabel.',
 'MyBox Plus - Ladestation 22 kW | MyBox.eco',
 'Design-Wallbox MyBox Plus mit 22 kW Ausgangsleistung. MID-Zähler, RFID, OCPP 1.6. Kabel- oder Steckdosenvariante. Hergestellt in Tschechien.'
);

-- ============================================
-- 3. PRODUCT IMAGES (Gallery)
-- ============================================

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order) VALUES
('b2000000-0000-0000-0000-000000000002', 'plus_studio_web_cam_4-0000.png', 'MyBox Plus pohled z boku', true, 1);

-- ============================================
-- 4. PRODUCT SPECIFICATIONS
-- ============================================

-- Power category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('b2000000-0000-0000-0000-000000000002', 'model', 'Plus 22 kW', NULL, 'power', 1, 'Model', 'Model', 'Modell'),
('b2000000-0000-0000-0000-000000000002', 'maxPower', '22', 'kW', 'power', 2, 'Max. výstupní výkon', 'Max. output power', 'Max. Ausgangsleistung'),
('b2000000-0000-0000-0000-000000000002', 'voltage', '400 V (±10%)', NULL, 'power', 3, 'Napětí', 'Voltage', 'Spannung'),
('b2000000-0000-0000-0000-000000000002', 'currentPerConnector', '3×32', 'A', 'power', 4, 'Proud na konektor', 'Current per connector', 'Strom pro Anschluss'),
('b2000000-0000-0000-0000-000000000002', 'connectors', '1× Typ 2 / kabel', NULL, 'power', 5, 'Konektor', 'Connector', 'Anschluss');

-- Dimensions category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('b2000000-0000-0000-0000-000000000002', 'dimensions', '280 × 410 × 120', 'mm', 'dimensions', 1, 'Rozměry (Š×V×H)', 'Dimensions (W×H×D)', 'Abmessungen (B×H×T)'),
('b2000000-0000-0000-0000-000000000002', 'weight', '8,5-13,5', 'kg', 'dimensions', 2, 'Hmotnost', 'Weight', 'Gewicht'),
('b2000000-0000-0000-0000-000000000002', 'protection', 'IP54 / IK10', NULL, 'dimensions', 3, 'Krytí', 'Protection', 'Schutzart'),
('b2000000-0000-0000-0000-000000000002', 'material', 'Kalené sklo, tvrzený plast', NULL, 'dimensions', 4, 'Materiál', 'Material', 'Material'),
('b2000000-0000-0000-0000-000000000002', 'operatingTemp', '-30°C až +50°C', NULL, 'dimensions', 5, 'Provozní teplota', 'Operating temperature', 'Betriebstemperatur');

-- Connectivity category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('b2000000-0000-0000-0000-000000000002', 'ethernet', 'RJ45', NULL, 'connectivity', 1, 'Ethernet', 'Ethernet', 'Ethernet'),
('b2000000-0000-0000-0000-000000000002', 'wifi', '2.4 GHz b/g/n', NULL, 'connectivity', 2, 'WiFi', 'WiFi', 'WiFi'),
('b2000000-0000-0000-0000-000000000002', 'protocols', 'Modbus TCP, MQTT, OCPP 1.6', NULL, 'connectivity', 3, 'Protokoly', 'Protocols', 'Protokolle'),
('b2000000-0000-0000-0000-000000000002', 'rfid', 'ISO-14443 A&B, NFC, Mifare, Legic', NULL, 'connectivity', 4, 'RFID', 'RFID', 'RFID'),
('b2000000-0000-0000-0000-000000000002', 'fve', 'Modbus, MQTT', NULL, 'connectivity', 5, 'Zapojení s FVE', 'PV integration', 'PV-Integration');

-- Security category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('b2000000-0000-0000-0000-000000000002', 'breaker', 'MCB 32A', NULL, 'security', 1, 'Jistič', 'Circuit breaker', 'Sicherungsautomat'),
('b2000000-0000-0000-0000-000000000002', 'rcd', 'RCD typ A (30 mA)', NULL, 'security', 2, 'Proudový chránič', 'Residual current device', 'Fehlerstromschutzschalter'),
('b2000000-0000-0000-0000-000000000002', 'rcm', 'RCM 6mA DC', NULL, 'security', 3, 'DC ochrana', 'DC protection', 'DC-Schutz'),
('b2000000-0000-0000-0000-000000000002', 'meter', 'MID třída 1', NULL, 'security', 4, 'Elektroměr', 'Meter', 'Stromzähler');

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
    VALUES (fp_power_id, 'b2000000-0000-0000-0000-000000000002', 'power', 'left', 1);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_power_id, 'cs', 'Výkon', '22 kW'),
    (fp_power_id, 'en', 'Power', '22 kW'),
    (fp_power_id, 'de', 'Leistung', '22 kW');

    -- Feature point: Protection
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_protection_id, 'b2000000-0000-0000-0000-000000000002', 'protection', 'left', 2);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_protection_id, 'cs', 'Krytí', 'IP54 / IK10'),
    (fp_protection_id, 'en', 'Protection', 'IP54 / IK10'),
    (fp_protection_id, 'de', 'Schutzart', 'IP54 / IK10');

    -- Feature point: Connector
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_connector_id, 'b2000000-0000-0000-0000-000000000002', 'protocol', 'right', 3);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_connector_id, 'cs', 'Pro 1 vůz', 'Kabel / zásuvka'),
    (fp_connector_id, 'en', 'For 1 car', 'Cable / socket'),
    (fp_connector_id, 'de', 'Für 1 Auto', 'Kabel / Steckdose');

    -- Feature point: Temperature
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_temperature_id, 'b2000000-0000-0000-0000-000000000002', 'temperature', 'right', 4);

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
    VALUES (cv_black_id, 'b2000000-0000-0000-0000-000000000002', 'black', 'plus_studio_web_cam_4-0000.png', 1);

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
    cs_cable_id UUID := gen_random_uuid();
    cs_app_id UUID := gen_random_uuid();
BEGIN
    -- Section 1: Design
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_design_id, 'b2000000-0000-0000-0000-000000000002', 'plus_studio_web_cam_4-0000.png', 'MyBox Plus designová stanice', 1);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_design_id, 'cs', 'Nabíjecí stanice s citem pro detail', 'ČISTÝ DESIGN A ODOLNOST', 'Nabíjecí stanici MyBox Plus poznáte na první pohled podle zkosené hrany. Kombinace kaleného skla a tvrzeného plastu zajišťuje dokonalou odolnost. Vynikne sama o sobě i jako součást sady. Proveďte úpravu čelní strany stanice na míru a podtrhněte svůj osobitý styl. Díky LED Smart osvětlení budete mít přehled o aktuálním stavu stanice a nabíjení.'),
    (cs_design_id, 'en', 'Charging station with attention to detail', 'CLEAN DESIGN AND DURABILITY', 'You will recognize the MyBox Plus charging station at first glance by its beveled edge. The combination of tempered glass and hardened plastic ensures perfect durability. It stands out on its own or as part of a set. Customize the front of the station and emphasize your personal style. Thanks to LED Smart lighting, you will have an overview of the current station and charging status.'),
    (cs_design_id, 'de', 'Ladestation mit Liebe zum Detail', 'KLARES DESIGN UND HALTBARKEIT', 'Sie erkennen die MyBox Plus Ladestation auf den ersten Blick an der abgeschrägten Kante. Die Kombination aus gehärtetem Glas und gehärtetem Kunststoff gewährleistet perfekte Haltbarkeit. Sie fällt einzeln oder als Teil eines Sets auf. Passen Sie die Vorderseite der Station an und betonen Sie Ihren persönlichen Stil. Dank LED-Smart-Beleuchtung haben Sie den Überblick über den aktuellen Stations- und Ladestatus.');

    -- Section 2: Cable options
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_cable_id, 'b2000000-0000-0000-0000-000000000002', 'plus_studio_web_cam_4-0000.png', 'MyBox Plus varianta s kabelem', 2);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_cable_id, 'cs', 'Kabel nebo zásuvku? Volba je na vás', 'FLEXIBILNÍ ŘEŠENÍ', 'Stanici MyBox Plus upravíme do podoby, která vám bude vyhovovat. Dodáváme ji ve variantě se zásuvkou, nebo integrovaným kabelem. Oba typy využívají konektor Typ 2 podle standardu IEC 62196-2. Kabel je napevno připojený k wallboxu a po nabíjení jej přehledně uložíte do speciálního držáku na stanici.'),
    (cs_cable_id, 'en', 'Cable or socket? The choice is yours', 'FLEXIBLE SOLUTION', 'We will customize the MyBox Plus station to suit your needs. We deliver it with a socket or integrated cable. Both types use a Type 2 connector according to the IEC 62196-2 standard. The cable is permanently connected to the wallbox and after charging, you can neatly store it in a special holder on the station.'),
    (cs_cable_id, 'de', 'Kabel oder Steckdose? Die Wahl liegt bei Ihnen', 'FLEXIBLE LÖSUNG', 'Wir passen die MyBox Plus Station an Ihre Bedürfnisse an. Wir liefern sie mit Steckdose oder integriertem Kabel. Beide Typen verwenden einen Typ-2-Stecker nach IEC 62196-2 Standard. Das Kabel ist fest mit der Wallbox verbunden und kann nach dem Laden ordentlich in einer speziellen Halterung an der Station verstaut werden.');

    -- Section 3: Mobile app
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_app_id, 'b2000000-0000-0000-0000-000000000002', 'plus_studio_web_cam_4-0000.png', 'MyBox Plus mobilní aplikace', 3);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_app_id, 'cs', 'Ovládejte wallbox pomocí aplikace', 'CHYTRÁ KONEKTIVITA', 'Díky mobilní aplikaci MyBox budete mít stanici pod kontrolou, ať už budete kdekoliv. Můžete ji používat jako dálkové ovládání a mít přehled o stavu nabíjení elektromobilu. Nastavte si limit spotřeby pro jednotlivé RFID karty nebo hlídejte, kolik elektřiny jste spotřebovali za posledních 30 dní. Napojením na fotovoltaickou elektrárnu můžete využívat i přebytky energie.'),
    (cs_app_id, 'en', 'Control the wallbox via the app', 'SMART CONNECTIVITY', 'Thanks to the MyBox mobile app, you will have the station under control wherever you are. You can use it as a remote control and keep track of your EV charging status. Set consumption limits for individual RFID cards or monitor how much electricity you have used in the last 30 days. By connecting to a photovoltaic system, you can also use surplus energy.'),
    (cs_app_id, 'de', 'Steuern Sie die Wallbox über die App', 'INTELLIGENTE KONNEKTIVITÄT', 'Dank der MyBox Mobile App haben Sie die Station unter Kontrolle, egal wo Sie sind. Sie können sie als Fernbedienung verwenden und den Ladestatus Ihres E-Fahrzeugs verfolgen. Legen Sie Verbrauchsgrenzen für einzelne RFID-Karten fest oder überwachen Sie, wie viel Strom Sie in den letzten 30 Tagen verbraucht haben. Durch die Verbindung mit einer Photovoltaikanlage können Sie auch überschüssige Energie nutzen.');
END $$;

-- ============================================
-- 8. PRODUCT FEATURES (Badges)
-- ============================================

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b2000000-0000-0000-0000-000000000002', id FROM product_features WHERE slug = 'smart-management'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b2000000-0000-0000-0000-000000000002', id FROM product_features WHERE slug = 'cloud-ready'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b2000000-0000-0000-0000-000000000002', id FROM product_features WHERE slug = 'czech-made'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b2000000-0000-0000-0000-000000000002', id FROM product_features WHERE slug = 'easy-install'
ON CONFLICT DO NOTHING;
