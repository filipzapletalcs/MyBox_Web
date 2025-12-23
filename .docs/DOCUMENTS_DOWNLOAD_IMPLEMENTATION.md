# Documents Download Feature - Implementation Guide

**Vytvořeno:** 2024-12-23
**Status:** K implementaci

---

## Přehled

Stránka s dokumenty ke stažení (katalogy, manuály, VOP, marketingové materiály) s:
- CMS správou dokumentů v admin panelu
- Jazykovým filtrováním podle aktuální lokalizace webu
- Fallback logikou pro chybějící překlady

---

## Aktuální stav na produkci

Kategorie dokumentů:
- Všeobecné obchodní podmínky
- Katalogové listy
- Tiskové šablony
- Instalační manuály
- Marketingové materiály
- Stavební připravenost

Každý dokument: název, velikost, tlačítko stáhnout.

---

## Datový model

### 1. Nové tabulky v Supabase

**Soubor:** `supabase/migrations/YYYYMMDD_documents.sql`

```sql
-- Kategorie dokumentů
CREATE TABLE document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE document_category_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES document_categories(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    name TEXT NOT NULL,
    description TEXT,
    UNIQUE(category_id, locale)
);

-- Dokumenty
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES document_categories(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,

    -- Jazykové verze souboru (cesta v Storage)
    file_cs TEXT,  -- 'documents/katalog-profi-cs.pdf'
    file_en TEXT,  -- 'documents/catalog-profi-en.pdf'
    file_de TEXT,  -- 'documents/katalog-profi-de.pdf'

    -- Metadata
    file_size_cs INTEGER,
    file_size_en INTEGER,
    file_size_de INTEGER,

    -- Fallback konfigurace
    fallback_locale TEXT CHECK (fallback_locale IN ('cs', 'en', 'de')),

    -- Řazení a stav
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(category_id, slug)
);

CREATE TABLE document_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    title TEXT NOT NULL,
    description TEXT,
    UNIQUE(document_id, locale)
);

-- Indexy
CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_active ON documents(is_active) WHERE is_active = true;
CREATE INDEX idx_document_categories_active ON document_categories(is_active) WHERE is_active = true;

-- RLS
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_translations ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read document_categories" ON document_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read document_category_translations" ON document_category_translations FOR SELECT USING (true);
CREATE POLICY "Public read documents" ON documents FOR SELECT USING (is_active = true);
CREATE POLICY "Public read document_translations" ON document_translations FOR SELECT USING (true);

-- Admin write policies (authenticated users with admin/editor role)
CREATE POLICY "Admin write document_categories" ON document_categories FOR ALL
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'editor')));
CREATE POLICY "Admin write document_category_translations" ON document_category_translations FOR ALL
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'editor')));
CREATE POLICY "Admin write documents" ON documents FOR ALL
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'editor')));
CREATE POLICY "Admin write document_translations" ON document_translations FOR ALL
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'editor')));
```

### 2. Storage bucket

Nový bucket `documents` pro PDF a ZIP soubory:

```sql
-- V Supabase Studio nebo přes API
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);
```

Limity:
- Max velikost: 250 MB (pro ZIP s fotkami)
- Povolené typy: `application/pdf`, `application/zip`, `application/x-zip-compressed`

---

## Fallback logika

### Priorita jazyků

```typescript
const LOCALE_FALLBACKS: Record<Locale, Locale[]> = {
  cs: ['cs'],           // Čeština: pouze CS
  en: ['en'],           // Angličtina: pouze EN
  de: ['de', 'en'],     // Němčina: nejdřív DE, pak EN fallback
}
```

### Funkce pro získání souboru

```typescript
// src/lib/utils/documents.ts

import { Locale } from '@/config/locales'

interface Document {
  file_cs: string | null
  file_en: string | null
  file_de: string | null
  file_size_cs: number | null
  file_size_en: number | null
  file_size_de: number | null
  fallback_locale: Locale | null
}

interface ResolvedFile {
  url: string
  size: number
  locale: Locale
  isFallback: boolean
}

const LOCALE_FALLBACKS: Record<Locale, Locale[]> = {
  cs: ['cs'],
  en: ['en'],
  de: ['de', 'en'],
}

export function resolveDocumentFile(
  document: Document,
  requestedLocale: Locale
): ResolvedFile | null {
  const fallbackChain = LOCALE_FALLBACKS[requestedLocale]

  for (const locale of fallbackChain) {
    const fileKey = `file_${locale}` as keyof Document
    const sizeKey = `file_size_${locale}` as keyof Document

    const filePath = document[fileKey] as string | null
    const fileSize = document[sizeKey] as number | null

    if (filePath && fileSize) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      return {
        url: `${supabaseUrl}/storage/v1/object/public/documents/${filePath}`,
        size: fileSize,
        locale,
        isFallback: locale !== requestedLocale,
      }
    }
  }

  // Poslední možnost: explicitní fallback_locale
  if (document.fallback_locale) {
    const locale = document.fallback_locale
    const fileKey = `file_${locale}` as keyof Document
    const sizeKey = `file_size_${locale}` as keyof Document

    const filePath = document[fileKey] as string | null
    const fileSize = document[sizeKey] as number | null

    if (filePath && fileSize) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      return {
        url: `${supabaseUrl}/storage/v1/object/public/documents/${filePath}`,
        size: fileSize,
        locale,
        isFallback: true,
      }
    }
  }

  return null
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
```

---

## API Endpoints

### GET /api/documents

```typescript
// src/app/api/documents/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') || 'cs'
  const categorySlug = searchParams.get('category')

  // Fetch categories with translations
  let categoriesQuery = supabase
    .from('document_categories')
    .select(`
      id,
      slug,
      sort_order,
      document_category_translations!inner(locale, name, description)
    `)
    .eq('is_active', true)
    .eq('document_category_translations.locale', locale)
    .order('sort_order')

  const { data: categories, error: catError } = await categoriesQuery

  if (catError) {
    return NextResponse.json({ error: catError.message }, { status: 500 })
  }

  // Fetch documents with translations
  let documentsQuery = supabase
    .from('documents')
    .select(`
      id,
      slug,
      category_id,
      file_cs,
      file_en,
      file_de,
      file_size_cs,
      file_size_en,
      file_size_de,
      fallback_locale,
      sort_order,
      document_translations!inner(locale, title, description)
    `)
    .eq('is_active', true)
    .eq('document_translations.locale', locale)
    .order('sort_order')

  if (categorySlug) {
    const category = categories?.find(c => c.slug === categorySlug)
    if (category) {
      documentsQuery = documentsQuery.eq('category_id', category.id)
    }
  }

  const { data: documents, error: docError } = await documentsQuery

  if (docError) {
    return NextResponse.json({ error: docError.message }, { status: 500 })
  }

  return NextResponse.json({
    categories: categories || [],
    documents: documents || [],
  })
}
```

### POST /api/documents (Admin)

```typescript
// src/app/api/documents/route.ts (POST část)

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { category_id, slug, translations, files } = body

  // Insert document
  const { data: document, error } = await supabase
    .from('documents')
    .insert({
      category_id,
      slug,
      file_cs: files.cs?.path,
      file_en: files.en?.path,
      file_de: files.de?.path,
      file_size_cs: files.cs?.size,
      file_size_en: files.en?.size,
      file_size_de: files.de?.size,
      fallback_locale: files.fallback,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Insert translations
  const translationInserts = Object.entries(translations).map(([locale, data]) => ({
    document_id: document.id,
    locale,
    title: (data as any).title,
    description: (data as any).description,
  }))

  await supabase.from('document_translations').insert(translationInserts)

  return NextResponse.json({ data: document }, { status: 201 })
}
```

---

## Frontend komponenty

### 1. DocumentsPage

**Soubor:** `src/app/[locale]/dokumenty/page.tsx`

```typescript
import { getLocale, getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { DocumentsHero } from '@/components/documents/DocumentsHero'
import { DocumentCategorySection } from '@/components/documents/DocumentCategorySection'
import { CTASection } from '@/components/sections/CTASection'

export default async function DocumentsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('documents')
  const supabase = await createClient()

  // Fetch data
  const { data: categories } = await supabase
    .from('document_categories')
    .select(`
      id,
      slug,
      sort_order,
      document_category_translations(locale, name, description)
    `)
    .eq('is_active', true)
    .order('sort_order')

  const { data: documents } = await supabase
    .from('documents')
    .select(`
      *,
      document_translations(locale, title, description)
    `)
    .eq('is_active', true)
    .order('sort_order')

  return (
    <>
      <DocumentsHero
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <section className="py-16 lg:py-24">
        <div className="container">
          {categories?.map((category) => {
            const translation = category.document_category_translations
              .find((t: any) => t.locale === locale)

            const categoryDocs = documents?.filter(
              (d) => d.category_id === category.id
            )

            if (!categoryDocs?.length) return null

            return (
              <DocumentCategorySection
                key={category.id}
                title={translation?.name || category.slug}
                description={translation?.description}
                documents={categoryDocs}
                locale={locale}
              />
            )
          })}
        </div>
      </section>

      <CTASection />
    </>
  )
}
```

### 2. DocumentCategorySection

**Soubor:** `src/components/documents/DocumentCategorySection.tsx`

```typescript
'use client'

import { DocumentRow } from './DocumentRow'
import { Locale } from '@/config/locales'

interface Props {
  title: string
  description?: string
  documents: any[]
  locale: string
}

export function DocumentCategorySection({ title, description, documents, locale }: Props) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-text-primary mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-text-secondary mb-6">{description}</p>
      )}

      <div className="rounded-xl border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_100px_120px] gap-4 px-6 py-3 bg-bg-secondary border-b border-border-subtle text-sm text-text-muted">
          <span>Soubor</span>
          <span className="text-right">Velikost</span>
          <span className="text-right">Stáhnout</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border-subtle">
          {documents.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              locale={locale as Locale}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 3. DocumentRow

**Soubor:** `src/components/documents/DocumentRow.tsx`

```typescript
'use client'

import { Download, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { resolveDocumentFile, formatFileSize } from '@/lib/utils/documents'
import { Locale, LOCALE_FLAGS } from '@/config/locales'

interface Props {
  document: any
  locale: Locale
}

export function DocumentRow({ document, locale }: Props) {
  const translation = document.document_translations?.find(
    (t: any) => t.locale === locale
  )

  const resolvedFile = resolveDocumentFile(document, locale)

  if (!resolvedFile) {
    return (
      <div className="grid grid-cols-[1fr_100px_120px] gap-4 px-6 py-4 items-center opacity-50">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-text-muted" />
          <span className="text-text-primary">{translation?.title || document.slug}</span>
        </div>
        <span className="text-right text-text-muted text-sm">—</span>
        <div className="flex justify-end">
          <span className="text-sm text-text-muted flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Nedostupné
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[1fr_100px_120px] gap-4 px-6 py-4 items-center hover:bg-bg-secondary transition-colors">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-green-500" />
        <span className="text-text-primary">{translation?.title || document.slug}</span>
        {resolvedFile.isFallback && (
          <Badge variant="outline" className="text-xs">
            {LOCALE_FLAGS[resolvedFile.locale]} {resolvedFile.locale.toUpperCase()}
          </Badge>
        )}
      </div>
      <span className="text-right text-text-muted text-sm">
        {formatFileSize(resolvedFile.size)}
      </span>
      <div className="flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          asChild
        >
          <a href={resolvedFile.url} download target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" />
            Stáhnout
          </a>
        </Button>
      </div>
    </div>
  )
}
```

---

## Admin panel

### 1. Documents List

**Soubor:** `src/app/admin/(dashboard)/documents/page.tsx`

```typescript
import { DocumentList } from '@/components/admin/documents/DocumentList'

export default function DocumentsAdminPage() {
  return <DocumentList />
}
```

### 2. DocumentList Component

**Soubor:** `src/components/admin/documents/DocumentList.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/admin/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, FileText, Check, X } from 'lucide-react'
import Link from 'next/link'

export function DocumentList() {
  const [documents, setDocuments] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data...

  const columns = [
    {
      key: 'title',
      label: 'Název',
      render: (doc: any) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-text-muted" />
          {doc.document_translations?.[0]?.title || doc.slug}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kategorie',
      render: (doc: any) => (
        <Badge variant="outline">
          {categories.find((c: any) => c.id === doc.category_id)?.slug}
        </Badge>
      ),
    },
    {
      key: 'files',
      label: 'Soubory',
      render: (doc: any) => (
        <div className="flex gap-1">
          {doc.file_cs && <Badge variant="success">CS</Badge>}
          {doc.file_en && <Badge variant="success">EN</Badge>}
          {doc.file_de && <Badge variant="success">DE</Badge>}
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Aktivní',
      render: (doc: any) => doc.is_active ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      ),
    },
  ]

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dokumenty</h1>
          <p className="text-text-secondary">Správa dokumentů ke stažení</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" asChild>
            <Link href="/admin/documents/categories">
              Kategorie
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/documents/new">
              <Plus className="mr-2 h-4 w-4" />
              Nový dokument
            </Link>
          </Button>
        </div>
      </div>

      <DataTable
        data={documents}
        columns={columns}
        isLoading={isLoading}
      />
    </>
  )
}
```

### 3. DocumentForm Component

**Soubor:** `src/components/admin/documents/DocumentForm.tsx`

Formulář s:
- Výběr kategorie
- LocaleTabs pro překlady (title, description)
- Upload souborů pro každý jazyk (CS, EN, DE)
- Nastavení fallback jazyka
- Toggle is_active

---

## i18n překlady

**Soubor:** `src/messages/cs.json`

```json
{
  "documents": {
    "title": "Dokumenty ke stažení",
    "subtitle": "Katalogové listy, instalační manuály a další materiály",
    "download": "Stáhnout",
    "size": "Velikost",
    "file": "Soubor",
    "unavailable": "Nedostupné",
    "fallbackNote": "Dokument v požadovaném jazyce není k dispozici. Zobrazena je verze v jazyce {locale}."
  }
}
```

---

## Routing

| Locale | URL |
|--------|-----|
| CS | `/dokumenty` |
| EN | `/en/documents` |
| DE | `/de/dokumente` |

**Soubor:** `src/i18n/routing.ts` - přidat pathnames

```typescript
pathnames: {
  // ...existing
  '/dokumenty': {
    cs: '/dokumenty',
    en: '/documents',
    de: '/dokumente',
  },
}
```

---

## Implementační kroky

### Fáze 1: Backend (30 min)
1. [ ] Vytvořit migraci `documents.sql`
2. [ ] Vytvořit `documents` bucket v Storage
3. [ ] Aktualizovat `src/lib/supabase/storage.ts` s helper funkcemi
4. [ ] Vytvořit `src/lib/utils/documents.ts` (fallback logika)
5. [ ] Vytvořit API routes `/api/documents`
6. [ ] Regenerovat TypeScript typy

### Fáze 2: Admin panel (45 min)
1. [ ] `src/app/admin/(dashboard)/documents/page.tsx`
2. [ ] `src/app/admin/(dashboard)/documents/new/page.tsx`
3. [ ] `src/app/admin/(dashboard)/documents/[id]/page.tsx`
4. [ ] `src/app/admin/(dashboard)/documents/categories/page.tsx`
5. [ ] `src/components/admin/documents/DocumentList.tsx`
6. [ ] `src/components/admin/documents/DocumentForm.tsx`
7. [ ] `src/components/admin/documents/DocumentUploader.tsx`
8. [ ] `src/components/admin/documents/CategoryList.tsx`
9. [ ] Přidat do AdminSidebar

### Fáze 3: Frontend (30 min)
1. [ ] `src/app/[locale]/dokumenty/page.tsx`
2. [ ] `src/components/documents/DocumentsHero.tsx`
3. [ ] `src/components/documents/DocumentCategorySection.tsx`
4. [ ] `src/components/documents/DocumentRow.tsx`
5. [ ] Přidat i18n překlady
6. [ ] Přidat routing pathnames
7. [ ] Přidat do navigace

### Fáze 4: Seed data (15 min)
1. [ ] Vytvořit kategorie (VOP, Katalogy, Manuály, Tiskové šablony, Marketing, Stavební připravenost)
2. [ ] Nahrát existující PDF soubory
3. [ ] Vytvořit dokumenty s překlady

---

## Poznámky

- Velké ZIP soubory (100+ MB) mohou vyžadovat delší upload timeout
- Zvážit lazy loading pro stránku s mnoha dokumenty
- Možnost přidat vyhledávání dokumentů
- Možnost přidat filtrování podle produktu (MyBox Profi, Home, etc.)
