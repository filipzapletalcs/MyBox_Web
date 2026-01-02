-- ============================================
-- SEED DATA: MyBox Home
-- Texty z webu mybox.eco, specifikace z datasheetu
-- ============================================

-- Nejprve smažeme existující data pro mybox-home (pokud existují)
DELETE FROM products WHERE slug = 'mybox-home';

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
    'b1000000-0000-0000-0000-000000000001',
    'mybox-home',
    'ac_mybox',
    'MYBOX-HOME-22',
    true,
    false,
    4,
    'home_studio_web_cam_4-0000.png',
    'home_studio_web_cam_4-0000.png',
    '/downloads/mybox-home-datasheet.pdf',
    'MyBox-Home-Datasheet.pdf',
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
('b1000000-0000-0000-0000-000000000001', 'cs',
 'MyBox Home',
 'Stanice pro domácí nabíjení, na kterou se spolehnete. Špičkové komponenty i pokročilé funkce převzala od vyšších modelů.',
 'Wallbox s výkonem 22 kW pro domácí využití. Kombinace plastu a kaleného skla tvoří ochranu proti nepříznivým podmínkám či mechanickému poškození. Měníme standard domácího nabíjení díky evropským komponentům.',
 'MyBox Home - Domácí nabíjecí stanice 22 kW | MyBox.eco',
 'Kompaktní wallbox MyBox Home s výkonem 22 kW pro domácí nabíjení. WiFi, OCPP 1.6, RFID. Podpora dotace NZÚ. Vyrobeno v ČR.'
),
-- English
('b1000000-0000-0000-0000-000000000001', 'en',
 'MyBox Home',
 'Home charging station you can rely on. Premium components and advanced features inherited from higher models.',
 'Wallbox with 22 kW output for home use. The combination of plastic and tempered glass provides protection against adverse conditions or mechanical damage. We are changing the standard of home charging with European components.',
 'MyBox Home - Home Charging Station 22 kW | MyBox.eco',
 'Compact MyBox Home wallbox with 22 kW output for home charging. WiFi, OCPP 1.6, RFID. NZU subsidy support. Made in Czech Republic.'
),
-- German
('b1000000-0000-0000-0000-000000000001', 'de',
 'MyBox Home',
 'Heimladestation, auf die Sie sich verlassen können. Premium-Komponenten und erweiterte Funktionen von höheren Modellen übernommen.',
 'Wallbox mit 22 kW Ausgangsleistung für den Heimgebrauch. Die Kombination aus Kunststoff und gehärtetem Glas bietet Schutz gegen widrige Bedingungen oder mechanische Beschädigungen. Wir verändern den Standard des Heimladens mit europäischen Komponenten.',
 'MyBox Home - Heimladestation 22 kW | MyBox.eco',
 'Kompakte MyBox Home Wallbox mit 22 kW Ausgangsleistung für Heimladung. WiFi, OCPP 1.6, RFID. NZU-Förderung. Hergestellt in Tschechien.'
);

-- ============================================
-- 3. PRODUCT IMAGES (Gallery)
-- ============================================

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order) VALUES
('b1000000-0000-0000-0000-000000000001', 'home_studio_web_cam_4-0000.png', 'MyBox Home pohled z boku', true, 1);

-- ============================================
-- 4. PRODUCT SPECIFICATIONS
-- ============================================

-- Power category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('b1000000-0000-0000-0000-000000000001', 'model', 'Home 22 kW', NULL, 'power', 1, 'Model', 'Model', 'Modell'),
('b1000000-0000-0000-0000-000000000001', 'maxPower', '22', 'kW', 'power', 2, 'Max. výstupní výkon', 'Max. output power', 'Max. Ausgangsleistung'),
('b1000000-0000-0000-0000-000000000001', 'voltage', '400 V (±10%)', NULL, 'power', 3, 'Napětí', 'Voltage', 'Spannung'),
('b1000000-0000-0000-0000-000000000001', 'currentPerConnector', '3×32', 'A', 'power', 4, 'Proud na konektor', 'Current per connector', 'Strom pro Anschluss'),
('b1000000-0000-0000-0000-000000000001', 'connectors', '1× integrovaný kabel', NULL, 'power', 5, 'Konektor', 'Connector', 'Anschluss');

-- Dimensions category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('b1000000-0000-0000-0000-000000000001', 'dimensions', '200 × 305 × 105', 'mm', 'dimensions', 1, 'Rozměry (Š×V×H)', 'Dimensions (W×H×D)', 'Abmessungen (B×H×T)'),
('b1000000-0000-0000-0000-000000000001', 'weight', '4,5', 'kg', 'dimensions', 2, 'Hmotnost', 'Weight', 'Gewicht'),
('b1000000-0000-0000-0000-000000000001', 'protection', 'IP54 / IK10', NULL, 'dimensions', 3, 'Krytí', 'Protection', 'Schutzart'),
('b1000000-0000-0000-0000-000000000001', 'material', 'Plast a kalené sklo', NULL, 'dimensions', 4, 'Materiál', 'Material', 'Material'),
('b1000000-0000-0000-0000-000000000001', 'operatingTemp', '-30°C až +50°C', NULL, 'dimensions', 5, 'Provozní teplota', 'Operating temperature', 'Betriebstemperatur');

-- Connectivity category
INSERT INTO product_specifications (product_id, spec_key, value, unit, group_name, sort_order, label_cs, label_en, label_de) VALUES
('b1000000-0000-0000-0000-000000000001', 'wifi', '2.4 GHz b/g/n', NULL, 'connectivity', 1, 'WiFi', 'WiFi', 'WiFi'),
('b1000000-0000-0000-0000-000000000001', 'protocols', 'Modbus TCP, MQTT, OCPP 1.6', NULL, 'connectivity', 2, 'Protokoly', 'Protocols', 'Protokolle'),
('b1000000-0000-0000-0000-000000000001', 'rfid', 'ISO-14443 A&B, Mifare 13.56MHz', NULL, 'connectivity', 3, 'RFID', 'RFID', 'RFID'),
('b1000000-0000-0000-0000-000000000001', 'powerControl', 'mód 3 PWM podle ISO/IEC 61851-1', NULL, 'connectivity', 4, 'Ovládání výkonu', 'Power control', 'Leistungssteuerung'),
('b1000000-0000-0000-0000-000000000001', 'fve', 'Modbus, MQTT', NULL, 'connectivity', 5, 'Zapojení s FVE', 'PV integration', 'PV-Integration');

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
    VALUES (fp_power_id, 'b1000000-0000-0000-0000-000000000001', 'power', 'left', 1);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_power_id, 'cs', 'Výkon', '22 kW'),
    (fp_power_id, 'en', 'Power', '22 kW'),
    (fp_power_id, 'de', 'Leistung', '22 kW');

    -- Feature point: Protection
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_protection_id, 'b1000000-0000-0000-0000-000000000001', 'protection', 'left', 2);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_protection_id, 'cs', 'Krytí', 'IP54 / IK10'),
    (fp_protection_id, 'en', 'Protection', 'IP54 / IK10'),
    (fp_protection_id, 'de', 'Schutzart', 'IP54 / IK10');

    -- Feature point: Connector
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_connector_id, 'b1000000-0000-0000-0000-000000000001', 'protocol', 'right', 3);

    INSERT INTO product_feature_point_translations (feature_point_id, locale, label, value) VALUES
    (fp_connector_id, 'cs', 'Pro 1 vůz', 'Integrovaný kabel'),
    (fp_connector_id, 'en', 'For 1 car', 'Integrated cable'),
    (fp_connector_id, 'de', 'Für 1 Auto', 'Integriertes Kabel');

    -- Feature point: Temperature
    INSERT INTO product_feature_points (id, product_id, icon, position, sort_order)
    VALUES (fp_temperature_id, 'b1000000-0000-0000-0000-000000000001', 'temperature', 'right', 4);

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
    VALUES (cv_black_id, 'b1000000-0000-0000-0000-000000000001', 'black', 'home_studio_web_cam_4-0000.png', 1);

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
    -- Section 1: Design
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_design_id, 'b1000000-0000-0000-0000-000000000001', 'home_studio_web_cam_4-0000.png', 'MyBox Home designová stanice', 1);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_design_id, 'cs', 'Designový kousek do garáže i před dům', 'ČISTÝ DESIGN A ODOLNOST', 'Čistý design stanice MyBox Home podtrhne styl vašeho domu, ať už bude v garáži, nebo venku. Využijte možnosti individuálního potisku čelního panelu a ozvláštněte wallbox svým oblíbeným vzorem nebo rodinným symbolem. Měníme standard domácího nabíjení. Chceme totiž, abyste elektromobily nabíjeli spolehlivě nejen na veřejných hubech, ale i doma. Díky evropským komponentům a odolnému tělu vám bude stanice sloužit mnoho let.'),
    (cs_design_id, 'en', 'Design piece for garage and outdoors', 'CLEAN DESIGN AND DURABILITY', 'The clean design of the MyBox Home station will complement the style of your home, whether in the garage or outside. Take advantage of the option for custom front panel printing and personalize your wallbox with your favorite pattern or family symbol. We are changing the standard of home charging. We want you to charge your electric cars reliably not only at public hubs, but also at home. Thanks to European components and a durable body, the station will serve you for many years.'),
    (cs_design_id, 'de', 'Designstück für Garage und Außenbereich', 'KLARES DESIGN UND HALTBARKEIT', 'Das klare Design der MyBox Home Station unterstreicht den Stil Ihres Hauses, ob in der Garage oder im Freien. Nutzen Sie die Möglichkeit des individuellen Frontpanel-Drucks und personalisieren Sie Ihre Wallbox mit Ihrem Lieblingsmuster oder Familiensymbol. Wir verändern den Standard des Heimladens. Wir möchten, dass Sie Ihre Elektroautos zuverlässig nicht nur an öffentlichen Hubs, sondern auch zu Hause laden. Dank europäischer Komponenten und robuster Bauweise wird die Station Ihnen viele Jahre dienen.');

    -- Section 2: Comfort
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_comfort_id, 'b1000000-0000-0000-0000-000000000001', 'home_studio_web_cam_4-0000.png', 'MyBox Home jednoduchá obsluha', 2);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_comfort_id, 'cs', 'Nabíjejte pohodlně. Během dne i noci', 'JEDNODUCHÁ OBSLUHA', 'Obsluha domácí stanice vám zabere pár okamžiků. Zaparkujete, připojíte nabíjecí kabel a nic dalšího neřešíte. Díky Smart LED indikátoru a mobilní aplikaci budete mít o stavu nabíjecího konektoru přehled, ať už budete nabíjet přes den, nebo v noci. Součástí stanice je jeden integrovaný kabel. Hledání vlastního dobíjecího kabelu a připojování do zásuvky tak nebudete řešit.'),
    (cs_comfort_id, 'en', 'Charge comfortably. Day and night', 'SIMPLE OPERATION', 'Operating the home station takes just a few moments. You park, connect the charging cable and nothing else to worry about. Thanks to the Smart LED indicator and mobile app, you will have an overview of the charging connector status whether you charge during the day or at night. The station includes one integrated cable. You wont have to deal with finding your own charging cable and plugging it in.'),
    (cs_comfort_id, 'de', 'Laden Sie bequem. Tag und Nacht', 'EINFACHE BEDIENUNG', 'Die Bedienung der Heimstation dauert nur wenige Augenblicke. Sie parken, schließen das Ladekabel an und müssen sich um nichts weiter kümmern. Dank der Smart LED-Anzeige und der mobilen App haben Sie den Überblick über den Ladeanschlussstatus, ob Sie tagsüber oder nachts laden. Die Station enthält ein integriertes Kabel. Sie müssen sich nicht um die Suche nach einem eigenen Ladekabel kümmern.');

    -- Section 3: Smart Home
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (cs_smart_id, 'b1000000-0000-0000-0000-000000000001', 'home_studio_web_cam_4-0000.png', 'MyBox Home chytrá domácnost', 3);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (cs_smart_id, 'cs', 'Součást vaší chytré domácnosti', 'MODERNÍ TECHNOLOGIE', 'Stanice zapadá do ekosystému MyBox a vychází z trendu chytrých domácností. Připojí se k internetu a využívá vlastní Cloud, s CPO případně dalšími systémy. Ovládejte wallbox jednoduše pomocí chytrého telefonu. Díky mobilní aplikaci MyBox budete mít o průběhu nabíjení neustálý přehled. Po propojení s fotovoltaickou elektrárnou pak jednoduše využijete i přebytky energie.'),
    (cs_smart_id, 'en', 'Part of your smart home', 'MODERN TECHNOLOGY', 'The station fits into the MyBox ecosystem and follows the smart home trend. It connects to the internet and uses its own Cloud, with CPO or other systems. Control the wallbox easily using your smartphone. Thanks to the MyBox mobile app, you will have constant overview of the charging process. After connecting to a photovoltaic system, you can easily use surplus energy.'),
    (cs_smart_id, 'de', 'Teil Ihres Smart Home', 'MODERNE TECHNOLOGIE', 'Die Station fügt sich in das MyBox-Ökosystem ein und folgt dem Smart-Home-Trend. Sie verbindet sich mit dem Internet und nutzt die eigene Cloud, mit CPO oder anderen Systemen. Steuern Sie die Wallbox einfach mit Ihrem Smartphone. Dank der MyBox Mobile App haben Sie ständigen Überblick über den Ladevorgang. Nach der Verbindung mit einer Photovoltaikanlage können Sie überschüssige Energie einfach nutzen.');
END $$;

-- ============================================
-- 8. PRODUCT FEATURES (Badges)
-- ============================================

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b1000000-0000-0000-0000-000000000001', id FROM product_features WHERE slug = 'smart-management'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b1000000-0000-0000-0000-000000000001', id FROM product_features WHERE slug = 'cloud-ready'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b1000000-0000-0000-0000-000000000001', id FROM product_features WHERE slug = 'czech-made'
ON CONFLICT DO NOTHING;

INSERT INTO product_to_features (product_id, feature_id)
SELECT 'b1000000-0000-0000-0000-000000000001', id FROM product_features WHERE slug = 'easy-install'
ON CONFLICT DO NOTHING;
