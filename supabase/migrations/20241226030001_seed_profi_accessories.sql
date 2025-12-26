-- ============================================
-- Migration: Seed MyBox Profi Accessories
-- Migrates hardcoded accessory data to database
-- ============================================

DO $$
DECLARE
    cable_holder_id UUID := gen_random_uuid();
    cable_hook_id UUID := gen_random_uuid();
    stand_id UUID := gen_random_uuid();
    profi_product_id UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
BEGIN
    -- ============================================
    -- Insert Accessories
    -- ============================================

    -- 1. Držák kabelu / Cable holder / Kabelhalter
    INSERT INTO accessories (id, slug, image_url, link_url, is_active, sort_order)
    VALUES (
        cable_holder_id,
        'cable-holder',
        '/images/products/profi/gallery/mybox-profi_office-cam-10_bez_kabelu_3k_final.jpg',
        '/poptavka',
        true,
        1
    );

    INSERT INTO accessory_translations (accessory_id, locale, name, description) VALUES
    (cable_holder_id, 'cs', 'Držák kabelu', 'Elegantní držák pro přehledné uložení nabíjecího kabelu'),
    (cable_holder_id, 'en', 'Cable holder', 'Elegant holder for neat storage of charging cable'),
    (cable_holder_id, 'de', 'Kabelhalter', 'Eleganter Halter zur übersichtlichen Aufbewahrung des Ladekabels');

    -- 2. Kabelový háček / Cable hook / Kabelhaken
    INSERT INTO accessories (id, slug, image_url, link_url, is_active, sort_order)
    VALUES (
        cable_hook_id,
        'cable-hook',
        '/images/products/profi/gallery/mybox-profi_office-cam-9_bez_kabelu_3k_final.jpg',
        '/poptavka',
        true,
        2
    );

    INSERT INTO accessory_translations (accessory_id, locale, name, description) VALUES
    (cable_hook_id, 'cs', 'Kabelový háček', 'Praktický háček pro úhledné uskladnění kabelu'),
    (cable_hook_id, 'en', 'Cable hook', 'Practical hook for tidy cable storage'),
    (cable_hook_id, 'de', 'Kabelhaken', 'Praktischer Haken zur ordentlichen Kabelaufbewahrung');

    -- 3. Stojan / Stand / Standsäule
    INSERT INTO accessories (id, slug, image_url, link_url, is_active, sort_order)
    VALUES (
        stand_id,
        'stand',
        '/images/products/profi/gallery/mybox_profi_podzemni_garaz_cam-2_3k_final.jpg',
        '/poptavka',
        true,
        3
    );

    INSERT INTO accessory_translations (accessory_id, locale, name, description) VALUES
    (stand_id, 'cs', 'Stojan', 'Volně stojící sloupek pro instalaci bez nutnosti zdi'),
    (stand_id, 'en', 'Stand', 'Free-standing post for installation without a wall'),
    (stand_id, 'de', 'Standsäule', 'Freistehende Säule für Installation ohne Wand');

    -- ============================================
    -- Link accessories to MyBox Profi
    -- ============================================

    INSERT INTO product_accessories (product_id, accessory_id, sort_order) VALUES
    (profi_product_id, cable_holder_id, 1),
    (profi_product_id, cable_hook_id, 2),
    (profi_product_id, stand_id, 3);

END $$;
