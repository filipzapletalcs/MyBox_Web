-- ============================================
-- Migration: Update MyBox Profi Content Sections
-- ============================================

-- Delete existing content sections for MyBox Profi
DELETE FROM product_content_sections
WHERE product_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Insert new content sections with proper texts
DO $$
DECLARE
    section1_id UUID := gen_random_uuid();
    section2_id UUID := gen_random_uuid();
    section3_id UUID := gen_random_uuid();
BEGIN
    -- Section 1: ČISTÝ DESIGN A ODOLNOST
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (section1_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            '/images/products/profi/gallery/mybox_profi_individual.png',
            'MyBox Profi designová stanice', 1);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (section1_id, 'cs', 'Designová stanice pro náročné', 'ČISTÝ DESIGN A ODOLNOST',
     'Nabíjecí stanici MyBox Profi jsme navrhli s důrazem na čistý a nadčasový design. Zaujme, ať už ji umístíte na zeď, nebo pevný sloupek. Design čelního panelu si navíc můžete přizpůsobit, aby vás dokonale reprezentoval.

Nabíjejte spolehlivě. Díky prémiové konstrukci bude stanice ve skvělé kondici po mnoho let. Odolá dešti, mrazu i vandalům. Ocelový plášť a kalené sklo ochrání špičkové komponenty.'),
    (section1_id, 'en', 'Design station for the demanding', 'CLEAN DESIGN AND DURABILITY',
     'We designed the MyBox Profi charging station with emphasis on clean and timeless design. It will impress whether you mount it on a wall or a fixed post. You can also customize the front panel design to perfectly represent you.

Charge reliably. Thanks to premium construction, the station will remain in excellent condition for many years. It withstands rain, frost, and vandals. Steel casing and tempered glass protect top-notch components.'),
    (section1_id, 'de', 'Designstation für Anspruchsvolle', 'KLARES DESIGN UND LANGLEBIGKEIT',
     'Wir haben die Ladestation MyBox Profi mit Schwerpunkt auf klares und zeitloses Design entwickelt. Sie beeindruckt, egal ob Sie sie an einer Wand oder einem festen Pfosten montieren. Sie können das Design der Frontplatte auch anpassen, um Sie perfekt zu repräsentieren.

Laden Sie zuverlässig. Dank der Premium-Konstruktion bleibt die Station viele Jahre in ausgezeichnetem Zustand. Sie widersteht Regen, Frost und Vandalismus. Stahlgehäuse und gehärtetes Glas schützen Spitzenkomponenten.');

    -- Section 2: JEDNODUCHÁ OBSLUHA
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (section2_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            '/images/products/profi/gallery/mybox-profi_office-cam-2_3k_final.jpg',
            'MyBox Profi jednoduchá obsluha', 2);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (section2_id, 'cs', 'Aby dobíjení bylo snazší než tankování', 'JEDNODUCHÁ OBSLUHA',
     'Stanici MyBox Profi jsme navrhli s důrazem na intuitivní obsluhu. Stačí jen přijet, připojit kabel a začít dobíjet. Snadno a bezpečně. Bez nastavování nebo rizika záměny konektorů (nebo paliva).

Součástí stanice je Smart LED indikátor, který zlepšuje přehled o stavu nabíjení. Navíc máte na výběr mezi variantou se dvěma zásuvkami a dvěma integrovanými kabely. S volbou vám rádi pomůžeme.'),
    (section2_id, 'en', 'To make charging easier than refueling', 'SIMPLE OPERATION',
     'We designed the MyBox Profi station with emphasis on intuitive operation. Just arrive, connect the cable, and start charging. Easy and safe. No setup required or risk of connector (or fuel) mix-up.

The station includes a Smart LED indicator that improves overview of charging status. Plus, you can choose between a variant with two sockets and two integrated cables. We will be happy to help you choose.'),
    (section2_id, 'de', 'Damit das Laden einfacher ist als Tanken', 'EINFACHE BEDIENUNG',
     'Wir haben die Station MyBox Profi mit Schwerpunkt auf intuitive Bedienung entwickelt. Kommen Sie einfach an, schließen Sie das Kabel an und beginnen Sie zu laden. Einfach und sicher. Keine Einrichtung erforderlich oder Risiko einer Verwechslung von Steckern (oder Kraftstoff).

Die Station enthält einen Smart-LED-Indikator, der den Überblick über den Ladestatus verbessert. Außerdem können Sie zwischen einer Variante mit zwei Steckdosen und zwei integrierten Kabeln wählen. Wir helfen Ihnen gerne bei der Auswahl.');

    -- Section 3: MODERNÍ TECHNOLOGIE
    INSERT INTO product_content_sections (id, product_id, image_url, image_alt, sort_order)
    VALUES (section3_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            '/images/products/profi/gallery/mybox_profi_podzemni_garaz_cam-1_3k_final.jpg',
            'MyBox Profi moderní technologie', 3);

    INSERT INTO product_content_section_translations (section_id, locale, title, subtitle, content) VALUES
    (section3_id, 'cs', 'Jeden wallbox. Desítky funkcí', 'MODERNÍ TECHNOLOGIE',
     'MyBox Profi je stanice určená pro náročné a profesionální uživatele. S tím souvisí i velký počet pokročilých funkcí, díky kterým vyhoví náročným požadavkům pro veřejné i fleetové nabíjení.

Stanice zapadá do konceptu ekosystému MyBox. Umožňuje propojení s dalšími stanicemi. Komunikuje přes protokol OCPP a podporuje napojení na různé řídicí systémy. Připojí se k internetu a využívá Cloud.'),
    (section3_id, 'en', 'One wallbox. Dozens of features', 'MODERN TECHNOLOGY',
     'MyBox Profi is a station designed for demanding and professional users. This includes a large number of advanced features that meet demanding requirements for public and fleet charging.

The station fits into the MyBox ecosystem concept. It allows connection with other stations. It communicates via OCPP protocol and supports connection to various control systems. It connects to the internet and uses the Cloud.'),
    (section3_id, 'de', 'Eine Wallbox. Dutzende von Funktionen', 'MODERNE TECHNOLOGIE',
     'MyBox Profi ist eine Station für anspruchsvolle und professionelle Benutzer. Dazu gehören zahlreiche erweiterte Funktionen, die anspruchsvolle Anforderungen für öffentliches und Flottenladung erfüllen.

Die Station passt in das MyBox-Ökosystem-Konzept. Sie ermöglicht die Verbindung mit anderen Stationen. Sie kommuniziert über das OCPP-Protokoll und unterstützt die Verbindung zu verschiedenen Steuerungssystemen. Sie verbindet sich mit dem Internet und nutzt die Cloud.');
END $$;
