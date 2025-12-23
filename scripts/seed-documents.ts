/**
 * Script to upload documents and create database records
 * Run with: npx tsx scripts/seed-documents.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const SUPABASE_URL = 'http://127.0.0.1:54321'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const DOCUMENTS_DIR = '/Users/filipzapletal/MyBox_Web_26/Documents'

// Category IDs from seed data
const CATEGORIES = {
  vop: 'd1000000-0000-0000-0000-000000000001',
  katalogy: 'd1000000-0000-0000-0000-000000000002',
  manualy: 'd1000000-0000-0000-0000-000000000003',
  'tiskove-sablony': 'd1000000-0000-0000-0000-000000000004',
  marketing: 'd1000000-0000-0000-0000-000000000005',
  'stavebni-pripravenost': 'd1000000-0000-0000-0000-000000000006',
}

// Document definitions with file mappings
interface DocumentDef {
  slug: string
  category: keyof typeof CATEGORIES
  files: {
    cs?: string
    en?: string
    de?: string
  }
  translations: {
    cs: { title: string; description?: string }
    en: { title: string; description?: string }
    de?: { title: string; description?: string }
  }
  fallback_locale?: 'cs' | 'en' | 'de'
}

const DOCUMENTS: DocumentDef[] = [
  // VOP
  {
    slug: 'vop-2024',
    category: 'vop',
    files: {
      cs: 'MyBox_VOP_2024_CZ-2 (2).pdf',
      en: 'MyBox_VOP_EN-2 (1).pdf',
    },
    translations: {
      cs: { title: 'Všeobecné obchodní podmínky 2024', description: 'Aktuální obchodní podmínky společnosti MyBox' },
      en: { title: 'General Terms and Conditions 2024', description: 'Current terms and conditions of MyBox' },
    },
    fallback_locale: 'cs',
  },

  // Katalogy
  {
    slug: 'katalog-2025',
    category: 'katalogy',
    files: {
      cs: 'MyBox_katalog_2025_compressed_30mb (1).pdf',
      en: 'Katalog ENGLISH-compressed (1).pdf',
    },
    translations: {
      cs: { title: 'Katalog produktů 2025', description: 'Kompletní katalog nabíjecích stanic MyBox' },
      en: { title: 'Product Catalog 2025', description: 'Complete catalog of MyBox charging stations' },
    },
    fallback_locale: 'cs',
  },

  // Manuály
  {
    slug: 'manual-mybox-home',
    category: 'manualy',
    files: {
      cs: 'MyBoxHome_22kw_instalacni_a_uživatelský_manual_CZ (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox HOME - Instalační manuál', description: 'Návod k instalaci a obsluze stanice MyBox HOME' },
      en: { title: 'MyBox HOME - Installation Manual', description: 'Installation and operation guide for MyBox HOME' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'manual-mybox-plus',
    category: 'manualy',
    files: {
      cs: 'MyBoxPlus_instalacni_a_uzivatelsky_manual_CZ (1).pdf',
      en: 'MyBoxPlus_manual_EN_draft3 (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox PLUS - Instalační manuál', description: 'Návod k instalaci a obsluze stanice MyBox PLUS' },
      en: { title: 'MyBox PLUS - Installation Manual', description: 'Installation and operation guide for MyBox PLUS' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'manual-mybox-post',
    category: 'manualy',
    files: {
      cs: 'MyBoxPost_instalacni_a_uzivatelsky_manual_CZ (1).pdf',
      en: 'MyBoxPost_manual_EN draft - 2.0 (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox POST - Instalační manuál', description: 'Návod k instalaci a obsluze stanice MyBox POST' },
      en: { title: 'MyBox POST - Installation Manual', description: 'Installation and operation guide for MyBox POST' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'manual-mybox-profi',
    category: 'manualy',
    files: {
      cs: 'MyBoxProfi_instalacni_a_uzivatelskymanual_CZ (1).pdf',
      en: 'MyBoxProfi_manual_EN DRAFT - 2.0 (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox PROFI - Instalační manuál', description: 'Návod k instalaci a obsluze stanice MyBox PROFI' },
      en: { title: 'MyBox PROFI - Installation Manual', description: 'Installation and operation guide for MyBox PROFI' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'manual-mybox-ebike',
    category: 'manualy',
    files: {
      cs: 'MyBox_eBike_instalacni_a_uzivatelsky_manual (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox eBike - Instalační manuál', description: 'Návod k instalaci a obsluze stanice MyBox eBike' },
      en: { title: 'MyBox eBike - Installation Manual', description: 'Installation and operation guide for MyBox eBike' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'manual-ac-sensor',
    category: 'manualy',
    files: {
      cs: 'AC_Sensor_Uživatelský_manuál_2025 (1).pdf',
    },
    translations: {
      cs: { title: 'AC Sensor - Uživatelský manuál', description: 'Uživatelský manuál pro AC Sensor' },
      en: { title: 'AC Sensor - User Manual', description: 'User manual for AC Sensor' },
    },
    fallback_locale: 'cs',
  },

  // Datasheets - HOME
  {
    slug: 'datasheet-home-3-7kw',
    category: 'katalogy',
    files: {
      cs: 'MyBox_HOME_3,7KW_datasheet (3).pdf',
    },
    translations: {
      cs: { title: 'MyBox HOME 3,7 kW - Datasheet', description: 'Technický list stanice MyBox HOME 3,7 kW' },
      en: { title: 'MyBox HOME 3.7 kW - Datasheet', description: 'Technical datasheet for MyBox HOME 3.7 kW' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'datasheet-home-11kw',
    category: 'katalogy',
    files: {
      cs: 'MyBox_HOME_11KW_datasheet_2str (3).pdf',
    },
    translations: {
      cs: { title: 'MyBox HOME 11 kW - Datasheet', description: 'Technický list stanice MyBox HOME 11 kW' },
      en: { title: 'MyBox HOME 11 kW - Datasheet', description: 'Technical datasheet for MyBox HOME 11 kW' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'datasheet-home-22kw',
    category: 'katalogy',
    files: {
      cs: 'MyBox_HOME_datasheet_2str (2) (3).pdf',
      en: 'MyBox_HOME_datasheet_2str_EN_Draft (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox HOME 22 kW - Datasheet', description: 'Technický list stanice MyBox HOME 22 kW' },
      en: { title: 'MyBox HOME 22 kW - Datasheet', description: 'Technical datasheet for MyBox HOME 22 kW' },
    },
    fallback_locale: 'cs',
  },

  // Datasheets - PLUS
  {
    slug: 'datasheet-plus-11kw',
    category: 'katalogy',
    files: {
      cs: 'MyBox_PLUS_datasheet_11kW (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox PLUS 11 kW - Datasheet', description: 'Technický list stanice MyBox PLUS 11 kW' },
      en: { title: 'MyBox PLUS 11 kW - Datasheet', description: 'Technical datasheet for MyBox PLUS 11 kW' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'datasheet-plus-22kw',
    category: 'katalogy',
    files: {
      cs: 'MyBox_PLUS_datasheet_2str (1) (3).pdf',
      en: 'MyBox_PLUS_datasheet_EN Final (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox PLUS 22 kW - Datasheet', description: 'Technický list stanice MyBox PLUS 22 kW' },
      en: { title: 'MyBox PLUS 22 kW - Datasheet', description: 'Technical datasheet for MyBox PLUS 22 kW' },
    },
    fallback_locale: 'cs',
  },

  // Datasheets - POST
  {
    slug: 'datasheet-post-2x22kw',
    category: 'katalogy',
    files: {
      cs: 'MyBox_Post_2x22kW_datasheet_2str (2) (2).pdf',
    },
    translations: {
      cs: { title: 'MyBox POST 2x22 kW - Datasheet', description: 'Technický list stanice MyBox POST 2x22 kW' },
      en: { title: 'MyBox POST 2x22 kW - Datasheet', description: 'Technical datasheet for MyBox POST 2x22 kW' },
    },
    fallback_locale: 'cs',
  },

  // Datasheets - PROFI
  {
    slug: 'datasheet-profi-2x22kw',
    category: 'katalogy',
    files: {
      cs: 'MyBox_Profi_2x22kW_datasheet_2str (1) (3).pdf',
    },
    translations: {
      cs: { title: 'MyBox PROFI 2x22 kW - Datasheet', description: 'Technický list stanice MyBox PROFI 2x22 kW' },
      en: { title: 'MyBox PROFI 2x22 kW - Datasheet', description: 'Technical datasheet for MyBox PROFI 2x22 kW' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'datasheet-profi-1x43kw',
    category: 'katalogy',
    files: {
      cs: 'MyBox_Profi_1x43kW_datasheet_2str (3) (3).pdf',
      en: 'MyBox_Profi_1x43kW_datasheet_2str_EN (1) (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox PROFI 1x43 kW - Datasheet', description: 'Technický list stanice MyBox PROFI 1x43 kW' },
      en: { title: 'MyBox PROFI 1x43 kW - Datasheet', description: 'Technical datasheet for MyBox PROFI 1x43 kW' },
    },
    fallback_locale: 'cs',
  },

  // Datasheets - eBike
  {
    slug: 'datasheet-ebike-basic',
    category: 'katalogy',
    files: {
      cs: 'MyBox_eBike_Basic_datasheet_2str (2).pdf',
      en: 'MyBox_eBike_Basic_datasheet_EN Draft 2str (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox eBike Basic - Datasheet', description: 'Technický list stanice MyBox eBike Basic' },
      en: { title: 'MyBox eBike Basic - Datasheet', description: 'Technical datasheet for MyBox eBike Basic' },
    },
    fallback_locale: 'cs',
  },

  // Datasheets - PARK
  {
    slug: 'datasheet-park',
    category: 'katalogy',
    files: {
      en: 'MyBox_PARK_datasheet_EN final 2str (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox PARK - Datasheet', description: 'Technický list stanice MyBox PARK' },
      en: { title: 'MyBox PARK - Datasheet', description: 'Technical datasheet for MyBox PARK' },
    },
    fallback_locale: 'en',
  },

  // Tiskové šablony
  {
    slug: 'sablona-profi',
    category: 'tiskove-sablony',
    files: {
      cs: 'Profi šablona (1) (1).zip',
      en: 'Profi Template.zip',
    },
    translations: {
      cs: { title: 'MyBox PROFI - Tisková šablona', description: 'Šablona pro potisk stanice MyBox PROFI' },
      en: { title: 'MyBox PROFI - Print Template', description: 'Print template for MyBox PROFI station' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'sablona-plus',
    category: 'tiskove-sablony',
    files: {
      cs: 'MyBox_Plus_print_template (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox PLUS - Tisková šablona', description: 'Šablona pro potisk stanice MyBox PLUS' },
      en: { title: 'MyBox PLUS - Print Template', description: 'Print template for MyBox PLUS station' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'sablona-post-sklo',
    category: 'tiskove-sablony',
    files: {
      cs: 'My_Box_Post_Sklo_Tisková data_27.9.2023_odsazení 4mm (1) (1) (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox POST - Šablona pro sklo', description: 'Tisková data pro skleněný panel stanice MyBox POST' },
      en: { title: 'MyBox POST - Glass Print Template', description: 'Print data for MyBox POST glass panel' },
    },
    fallback_locale: 'cs',
  },

  // Marketing
  {
    slug: 'marketing-home',
    category: 'marketing',
    files: {
      cs: 'MyBox-Home.zip',
    },
    translations: {
      cs: { title: 'MyBox HOME - Marketingové materiály', description: 'Fotografie a propagační materiály pro MyBox HOME' },
      en: { title: 'MyBox HOME - Marketing Materials', description: 'Photos and promotional materials for MyBox HOME' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'marketing-plus',
    category: 'marketing',
    files: {
      cs: 'MyBox-Plus.zip',
    },
    translations: {
      cs: { title: 'MyBox PLUS - Marketingové materiály', description: 'Fotografie a propagační materiály pro MyBox PLUS' },
      en: { title: 'MyBox PLUS - Marketing Materials', description: 'Photos and promotional materials for MyBox PLUS' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'marketing-post',
    category: 'marketing',
    files: {
      cs: 'MyBox-Post.zip',
    },
    translations: {
      cs: { title: 'MyBox POST - Marketingové materiály', description: 'Fotografie a propagační materiály pro MyBox POST' },
      en: { title: 'MyBox POST - Marketing Materials', description: 'Photos and promotional materials for MyBox POST' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'marketing-profi',
    category: 'marketing',
    files: {
      cs: 'MyBox-Profi.zip',
    },
    translations: {
      cs: { title: 'MyBox PROFI - Marketingové materiály', description: 'Fotografie a propagační materiály pro MyBox PROFI' },
      en: { title: 'MyBox PROFI - Marketing Materials', description: 'Photos and promotional materials for MyBox PROFI' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'marketing-ebike',
    category: 'marketing',
    files: {
      cs: 'MyBox-eBike.zip',
    },
    translations: {
      cs: { title: 'MyBox eBike - Marketingové materiály', description: 'Fotografie a propagační materiály pro MyBox eBike' },
      en: { title: 'MyBox eBike - Marketing Materials', description: 'Photos and promotional materials for MyBox eBike' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'logo-mybox',
    category: 'marketing',
    files: {
      cs: 'logo-mybox (1).zip',
    },
    translations: {
      cs: { title: 'Logo MyBox', description: 'Logo MyBox v různých formátech' },
      en: { title: 'MyBox Logo', description: 'MyBox logo in various formats' },
    },
    fallback_locale: 'cs',
  },

  // Stavební připravenost
  {
    slug: 'stavebni-priprava-home',
    category: 'stavebni-pripravenost',
    files: {
      cs: 'MyBox_Home_Stavební_příprava (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox HOME - Stavební připravenost', description: 'Dokumentace pro přípravu instalace stanice MyBox HOME' },
      en: { title: 'MyBox HOME - Site Preparation', description: 'Site preparation documentation for MyBox HOME' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'stavebni-priprava-plus',
    category: 'stavebni-pripravenost',
    files: {
      cs: 'MyBox_Plus_Stavební_příprava (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox PLUS - Stavební připravenost', description: 'Dokumentace pro přípravu instalace stanice MyBox PLUS' },
      en: { title: 'MyBox PLUS - Site Preparation', description: 'Site preparation documentation for MyBox PLUS' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'stavebni-priprava-post',
    category: 'stavebni-pripravenost',
    files: {
      cs: 'MyBox_Post_Stavební_Příprava (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox POST - Stavební připravenost', description: 'Dokumentace pro přípravu instalace stanice MyBox POST' },
      en: { title: 'MyBox POST - Site Preparation', description: 'Site preparation documentation for MyBox POST' },
    },
    fallback_locale: 'cs',
  },
  {
    slug: 'stavebni-priprava-profi',
    category: 'stavebni-pripravenost',
    files: {
      cs: 'MyBox Profi - stavební příprava (1) (1).pdf',
    },
    translations: {
      cs: { title: 'MyBox PROFI - Stavební připravenost', description: 'Dokumentace pro přípravu instalace stanice MyBox PROFI' },
      en: { title: 'MyBox PROFI - Site Preparation', description: 'Site preparation documentation for MyBox PROFI' },
    },
    fallback_locale: 'cs',
  },
]

function slugify(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-\.]/g, '')
    .replace(/-+/g, '-')
}

async function uploadFile(filename: string): Promise<{ path: string; size: number } | null> {
  const filePath = path.join(DOCUMENTS_DIR, filename)

  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ File not found: ${filename}`)
    return null
  }

  const fileBuffer = fs.readFileSync(filePath)
  const fileSize = fileBuffer.length
  const storagePath = slugify(filename)

  const contentType = filename.toLowerCase().endsWith('.pdf')
    ? 'application/pdf'
    : 'application/zip'

  console.log(`  📤 Uploading: ${filename} -> ${storagePath} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`)

  const { error } = await supabase.storage
    .from('documents')
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    console.error(`  ❌ Upload error: ${error.message}`)
    return null
  }

  console.log(`  ✅ Uploaded: ${storagePath}`)
  return { path: storagePath, size: fileSize }
}

async function createDocument(doc: DocumentDef, sortOrder: number): Promise<void> {
  console.log(`\n📄 Processing: ${doc.slug}`)

  // Upload files
  const uploadedFiles: Record<string, { path: string; size: number }> = {}

  for (const [locale, filename] of Object.entries(doc.files)) {
    if (filename) {
      const result = await uploadFile(filename)
      if (result) {
        uploadedFiles[locale] = result
      }
    }
  }

  if (Object.keys(uploadedFiles).length === 0) {
    console.error(`  ❌ No files uploaded for ${doc.slug}, skipping`)
    return
  }

  // Create document record
  const documentData = {
    category_id: CATEGORIES[doc.category],
    slug: doc.slug,
    file_cs: uploadedFiles.cs?.path || null,
    file_en: uploadedFiles.en?.path || null,
    file_de: uploadedFiles.de?.path || null,
    file_size_cs: uploadedFiles.cs?.size || null,
    file_size_en: uploadedFiles.en?.size || null,
    file_size_de: uploadedFiles.de?.size || null,
    fallback_locale: doc.fallback_locale || 'cs',
    sort_order: sortOrder,
    is_active: true,
  }

  const { data: insertedDoc, error: docError } = await supabase
    .from('documents')
    .insert(documentData)
    .select('id')
    .single()

  if (docError) {
    console.error(`  ❌ Document insert error: ${docError.message}`)
    return
  }

  console.log(`  ✅ Document created: ${insertedDoc.id}`)

  // Create translations
  const translations = []

  for (const [locale, trans] of Object.entries(doc.translations)) {
    if (trans) {
      translations.push({
        document_id: insertedDoc.id,
        locale,
        title: trans.title,
        description: trans.description || null,
      })
    }
  }

  const { error: transError } = await supabase
    .from('document_translations')
    .insert(translations)

  if (transError) {
    console.error(`  ❌ Translations insert error: ${transError.message}`)
    return
  }

  console.log(`  ✅ Translations created: ${translations.length}`)
}

async function main() {
  console.log('🚀 Starting document seeding...\n')

  // Group documents by category for sort order
  const docsByCategory: Record<string, DocumentDef[]> = {}

  for (const doc of DOCUMENTS) {
    if (!docsByCategory[doc.category]) {
      docsByCategory[doc.category] = []
    }
    docsByCategory[doc.category].push(doc)
  }

  let globalSortOrder = 0

  for (const [category, docs] of Object.entries(docsByCategory)) {
    console.log(`\n📁 Category: ${category}`)
    console.log('='.repeat(50))

    for (const doc of docs) {
      await createDocument(doc, globalSortOrder++)
    }
  }

  console.log('\n✨ Document seeding complete!')
}

main().catch(console.error)
