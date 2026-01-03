# MyBox.eco

Prezentační web pro českého výrobce nabíjecích stanic pro elektromobily.

## Technologie

### Core
- **Framework:** Next.js 16 (App Router)
- **React:** 19
- **TypeScript:** 5
- **Styling:** Tailwind CSS 4

### Backend & CMS
- **Databáze:** Supabase (PostgreSQL + Auth + Storage)
- **AI překlady:** OpenAI API

### UI & UX
- **Komponenty:** Radix UI
- **Ikony:** Lucide React
- **Animace:** Framer Motion
- **Rich Text Editor:** TipTap
- **Toasty:** Sonner

### Formuláře & Validace
- **Forms:** React Hook Form
- **Validace:** Zod
- **Styling:** CVA (class-variance-authority)

### Internationalizace
- **i18n:** next-intl (CS, EN, DE)

## Quick Start

```bash
npm install
npm run dev
```

Web běží na [http://localhost:3000](http://localhost:3000)

---

## Architektura projektu

### Struktura složek

```
/src
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Lokalizované veřejné stránky
│   │   ├── layout.tsx           # Root layout s providery
│   │   ├── page.tsx             # Homepage
│   │   ├── nabijeci-stanice/    # Nabíjecí stanice sekce
│   │   │   ├── ac/mybox-profi/  # Produktová stránka (z DB)
│   │   │   └── dc/              # DC stanice
│   │   ├── kontakt/             # Kontakt
│   │   └── blog/                # Blog (ISR + generateStaticParams)
│   ├── admin/                   # CMS administrace (bez i18n)
│   │   ├── login/               # Login stránka
│   │   └── (dashboard)/         # Chráněné admin routes
│   │       ├── articles/        # Správa článků
│   │       ├── categories/      # Správa kategorií
│   │       ├── products/        # Správa produktů
│   │       ├── faqs/            # Správa FAQ
│   │       └── media/           # Media library
│   ├── api/                     # REST API routes
│   │   ├── articles/            # Articles CRUD
│   │   ├── categories/          # Categories CRUD
│   │   ├── products/            # Products CRUD
│   │   ├── faqs/                # FAQs CRUD
│   │   └── media/               # Media upload
│   └── globals.css              # Globální styly + design tokens
├── components/
│   ├── layout/                  # Layout komponenty (Header, Footer, etc.)
│   ├── sections/                # Sekční komponenty (Hero, CTA, FAQ)
│   ├── product/                 # Produktové komponenty
│   │   ├── ProductPageContent.tsx  # Univerzální produkt stránka
│   │   ├── TechnicalSpecifications.tsx
│   │   ├── ColorVariantSlider.tsx
│   │   └── ...
│   ├── admin/                   # CMS admin komponenty
│   │   ├── layout/              # AdminSidebar, AdminHeader
│   │   ├── ui/                  # DataTable, LocaleTabs
│   │   ├── articles/            # TipTap editor, ArticleForm
│   │   └── ...
│   ├── ui/                      # UI primitiva (shadcn-style)
│   ├── seo/                     # SEO komponenty (JSON-LD)
│   └── providers/               # Theme + další providery
├── lib/
│   ├── supabase/                # Supabase clients
│   │   ├── client.ts            # Browser client
│   │   ├── server.ts            # Server client
│   │   └── admin.ts             # Service role client
│   ├── transformers/            # DB → TypeScript transformery
│   │   └── product.ts           # getProductBySlug()
│   ├── validations/             # Zod validation schemas
│   ├── fonts.ts                 # HalisR font konfigurace
│   └── utils.ts                 # Utility funkce (cn, etc.)
├── i18n/                        # Internationalization
├── messages/                    # Překlady (cs, en, de)
├── data/                        # Statická data (postupně migrována do DB)
└── types/
    ├── index.ts                 # TypeScript typy
    ├── product.ts               # Product types
    └── database.ts              # Auto-generated z Supabase

/supabase                        # Supabase konfigurace
├── config.toml                  # Docker konfigurace
├── migrations/                  # SQL migrace
└── seed*.sql                    # Seed data
```

---

## URL Struktura

### Čeština (výchozí - bez prefixu)

| Sekce | URL |
|-------|-----|
| Homepage | `/` |
| Nabíjecí stanice | `/nabijeci-stanice/` |
| AC stanice | `/nabijeci-stanice/ac/` |
| DC stanice | `/nabijeci-stanice/dc/` |
| Pro firmy | `/nabijeni-pro-firmy/` |
| Řešení | `/reseni-nabijeni/` |
| Výhody | `/vyhody-reseni/` |
| Řízení nabíjení | `/rizeni-nabijeni/` |
| Reference | `/reference/` |
| Blog | `/blog/` |
| O nás | `/o-nas/` |
| Kontakt | `/kontakt/` |
| Poptávka | `/poptavka/` |

### Angličtina (`/en/`)

| Sekce | URL |
|-------|-----|
| Homepage | `/en/` |
| Charging Stations | `/en/charging-stations/` |
| AC Stations | `/en/charging-stations/ac/` |
| DC Stations | `/en/charging-stations/dc/` |
| Corporate | `/en/corporate-charging/` |
| Solutions | `/en/charging-solutions/` |
| Benefits | `/en/solution-benefits/` |
| Management | `/en/charging-management/` |
| References | `/en/references/` |
| Blog | `/en/blog/` |
| About | `/en/about-us/` |
| Contact | `/en/contact/` |
| Request Quote | `/en/request-quote/` |

### Němčina (`/de/`)

| Sekce | URL |
|-------|-----|
| Homepage | `/de/` |
| Ladestationen | `/de/ladestationen/` |
| AC Stationen | `/de/ladestationen/ac/` |
| DC Stationen | `/de/ladestationen/dc/` |
| Unternehmen | `/de/unternehmensladung/` |
| Lösungen | `/de/ladeloesungen/` |
| Vorteile | `/de/loesungsvorteile/` |
| Management | `/de/lademanagement/` |
| Referenzen | `/de/referenzen/` |
| Blog | `/de/blog/` |
| Über uns | `/de/ueber-uns/` |
| Kontakt | `/de/kontakt/` |
| Anfrage | `/de/anfrage/` |

---

## Design System

### Barevná paleta

**Dark mode je výchozí.** Minimalistická paleta: černá, bílá, odstíny šedi + zelená pro CTA.

```css
/* Pozadí */
--bg-primary: #000000      /* Hlavní pozadí */
--bg-secondary: #0a0a0a    /* Sekundární */
--bg-tertiary: #141414     /* Karty, sekce */

/* Text */
--text-primary: #ffffff    /* Hlavní text */
--text-secondary: #a3a3a3  /* Sekundární */
--text-muted: #737373      /* Tlumený */

/* Akcentová zelená */
--green-500: #4ade80       /* Hlavní CTA */
--green-600: #22c55e       /* Hover */
```

### Typografie

Font **HalisR** s váhami 100-900. Typografická škála Major Third (1.25).

```css
--text-xs:   0.75rem   /* 12px */
--text-sm:   0.875rem  /* 14px */
--text-base: 1rem      /* 16px */
--text-lg:   1.25rem   /* 20px */
--text-xl:   1.5625rem /* 25px */
--text-2xl:  1.9375rem /* 31px */
--text-3xl:  2.4375rem /* 39px */
--text-4xl:  3.0625rem /* 49px */
--text-5xl:  3.8125rem /* 61px */
```

### Spacing

4px grid system s sémantickými gap tokeny.

```css
--space-1:  0.25rem   /* 4px */
--space-2:  0.5rem    /* 8px */
--space-4:  1rem      /* 16px */
--space-6:  1.5rem    /* 24px */
--space-8:  2rem      /* 32px */
--space-12: 3rem      /* 48px */

--gap-xs:  var(--space-1)   /* ikony, badges */
--gap-sm:  var(--space-2)   /* related items */
--gap-md:  var(--space-4)   /* form fields */
--gap-lg:  var(--space-6)   /* card sections */
--gap-xl:  var(--space-8)   /* grid items */
```

### Form komponenty

Sjednocené velikosti pro Input, Select, Textarea, Button.

```css
--input-height-sm: 2.25rem  /* 36px */
--input-height-md: 2.75rem  /* 44px */
--input-height-lg: 3.5rem   /* 56px */
```

---

## Klíčové komponenty

### Layout

- **Header** - Sticky navigace s mega menu, jazykový přepínač, CTA
- **Footer** - Navigace, kontakt, newsletter, sociální sítě
- **MegaMenu** - Rozbalovací menu s produkty a odkazy

### Sekce

- **HeroVideo** - Fullwidth video s headline a CTA
- **ProductShowcase** - Carousel produktů s detaily
- **ACDCSelector** - Výběr mezi AC a DC sekcí
- **FAQ** - Accordion s častými dotazy
- **CTA** - Call-to-action sekce

### UI Primitiva

Všechny komponenty používají CVA (class-variance-authority) pro varianty:

```tsx
import { Button } from '@/components/ui'

<Button variant="primary" size="lg">
  Poptávka
</Button>
```

---

## SEO & AI Optimalizace

### Meta tagy

Každá stránka má lokalizované:
- Title a description
- Open Graph tagy
- hreflang alternates
- Canonical URL

### Strukturovaná data (Schema.org JSON-LD)

Implementace strukturovaných dat pro lepší indexaci vyhledávači a AI crawlery.

#### Dostupné komponenty

```
/src/components/seo/
├── ProductJsonLd.tsx      # Product, Breadcrumb, Organization, FAQ
└── index.ts               # Barrel export
```

#### ProductJsonLd

Generuje kompletní Product schema z produktových dat:

```tsx
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo'

<ProductJsonLd product={productData} url={canonicalUrl} />
<BreadcrumbJsonLd items={[
  { name: 'Domů', url: baseUrl },
  { name: 'Nabíjecí stanice', url: `${baseUrl}/nabijeci-stanice` },
  { name: product.name, url: productUrl },
]} />
```

**Mapování dat produktu → Schema.org:**

| Pole v datech | Schema.org property |
|---------------|---------------------|
| `name` | `name` |
| `description` | `description` |
| `heroImage`, `gallery` | `image` (array) |
| `sku` | `sku` |
| `category` | `category` |
| `manufacturer.name` | `manufacturer.name` |
| `manufacturer.url` | `manufacturer.url` |
| `countryOfOrigin` | `countryOfOrigin` |
| `specifications[]` | `additionalProperty[]` |

#### OrganizationJsonLd

Pro hlavní layout s daty společnosti:

```tsx
<OrganizationJsonLd />
```

Obsahuje:
- Název společnosti (ELEXIM, a.s.)
- Adresu sídla
- Kontaktní údaje (obchod, servis)
- Sociální sítě

#### FAQJsonLd

Pro FAQ sekce:

```tsx
<FAQJsonLd items={[
  { question: 'Jak dlouho trvá instalace?', answer: '...' },
]} />
```

#### Produktová data pro SEO

Produkty jsou uloženy v Supabase databázi a transformovány na `FullProductData`:

```typescript
// src/app/[locale]/nabijeci-stanice/ac/mybox-profi/page.tsx
import { getProductBySlug } from '@/lib/transformers/product'

export default async function MyBoxProfiPage() {
  const locale = await getLocale()
  const product = await getProductBySlug('mybox-profi', locale)

  return <ProductPageContent product={product} ... />
}
```

Transformer načte z DB a vrátí `FullProductData` s:
- Základní info (name, tagline, description)
- SEO pole (sku, category, manufacturer, countryOfOrigin)
- Specifikace → Schema.org additionalProperty
- Obrázky, barevné varianty, feature points

### Výhody strukturovaných dat

| Pro vyhledávače | Pro AI crawlery |
|-----------------|-----------------|
| Rich snippets ve výsledcích | Přesné citace specifikací |
| Google Shopping integrace | Kontext značky a výrobce |
| Knowledge Graph | Důvěryhodný zdroj |
| Vyšší CTR (20-30%) | Strukturované odpovědi |

### llms.txt

Soubor `/public/llms.txt` pro AI agenty (ChatGPT, Perplexity, Claude) s přehledem:
- Informace o společnosti
- Produktové portfolio
- Kontaktní údaje

### robots.txt

Explicitně povoluje AI crawlery (GPTBot, ClaudeBot, PerplexityBot).

---

## Databázová Architektura (aktualizováno leden 2026)

### Přehled Optimalizací

Projekt prošel kompletní refaktorizací databázového schématu pro lepší konzistenci, výkon a údržbu.

#### Klíčové Změny

| Oblast | Před | Po |
|--------|------|-----|
| **Locale validace** | CHECK constraints | FK na `supported_locales` tabulku |
| **Documents** | Hardcoded `file_cs/en/de` sloupce | Unified `document_translations` pattern |
| **Product specs** | Hardcoded `label_cs/en/de` | `product_specification_translations` tabulka |
| **RLS Policies** | 95+ inline policies | 35 konsolidovaných s `is_editor_or_admin()` |
| **Blog ISR** | Žádné caching | `revalidate = 3600` + `generateStaticParams()` |

#### Flexibilní Správa Jazyků

```sql
-- Přidání nového jazyka (např. polština):
INSERT INTO supported_locales (code, name_native, name_en, sort_order)
VALUES ('pl', 'Polski', 'Polish', 4);

-- Žádná databázová migrace potřeba!
```

Pak stačí upravit `src/config/locales.ts` a přidat překlady.

#### Migrace (chronologicky)

```
supabase/migrations/
├── 20241223000000_initial_schema.sql           # Základní schéma
├── 20241223090000_add_category_parent.sql      # Hierarchie kategorií
├── 20241223100000_product_extensions.sql       # Rozšíření produktů
├── ...
├── 20260102000000_supported_locales.sql        # Locale lookup tabulka
├── 20260102010000_product_specification_translations.sql  # Spec překlady
├── 20260102020000_unify_documents.sql          # Unifikace dokumentů
├── 20260102030000_corporate_constraints.sql    # Data integrity
├── 20260102040000_rls_helper_function.sql      # Helper funkce
├── 20260103000000_drop_document_file_columns.sql  # Cleanup
├── 20260103010000_drop_spec_label_columns.sql     # Cleanup
├── 20260103020000_locale_fk_constraints.sql       # FK místo CHECK
├── 20260103030000_jsonb_schema_validation.sql     # TipTap validace
└── 20260103040000_refactor_rls_policies.sql       # RLS konsolidace
```

#### RLS Helper Funkce

```sql
-- Centralizovaná autorizace
SELECT is_editor_or_admin();  -- true/false
SELECT is_admin();            -- true/false

-- Použití v policies
CREATE POLICY "Editors can manage" ON products
  FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());
```

---

## CMS (Content Management System)

Pro správu obsahu webu (blog, produkty, media) používáme **self-hosted Supabase** běžící na firemním serveru v Docker kontejnerech.

### Technologie

| Komponenta | Technologie |
|------------|-------------|
| **Databáze** | PostgreSQL 15 + pgvector |
| **Auth** | Supabase Auth (JWT) |
| **Storage** | Supabase Storage (S3-compatible) |
| **Rich Text** | TipTap |
| **AI Chatbot** | OpenAI embeddings + pgvector |
| **Deployment** | Docker Compose |

### Funkce

- **Blog management** - Články s kategoriemi, tagy a rich text editorem
- **Product management** - Technické specifikace, vlastnosti, obrázky
- **Media library** - Upload a správa obrázků
- **User authentication** - Role-based access (admin, editor)
- **AI Chatbot knowledge base** - Sémantické vyhledávání v obsahu
- **Multi-language** - Podpora CS, EN, DE

### Výhody self-hosted

| Aspekt | Benefit |
|--------|---------|
| **Náklady** | Nulové měsíční poplatky |
| **Data** | Zůstávají v ČR (GDPR) |
| **Kontrola** | 100% vlastnictví infrastruktury |
| **AI Ready** | pgvector pro chatbot |

### Quick Start (lokální vývoj)

```bash
# 1. Spustit Supabase (vyžaduje Docker)
npx supabase start

# 2. Aplikovat migrace
npx supabase db reset

# 3. Vytvořit admin uživatele
npx ts-node scripts/create-admin.ts

# 4. Spustit Next.js
npm run dev

# Admin panel: http://localhost:3000/admin
# Supabase Studio: http://127.0.0.1:54323
```

### Implementovaná struktura

```
/src
├── app/
│   ├── admin/                  # CMS administrace (bez i18n)
│   │   ├── layout.tsx          # Root admin layout
│   │   ├── login/page.tsx      # Login stránka
│   │   └── (dashboard)/        # Chráněné routes
│   │       ├── layout.tsx      # Dashboard layout (sidebar, header)
│   │       ├── page.tsx        # Dashboard home
│   │       ├── articles/       # CRUD články
│   │       ├── categories/     # CRUD kategorie
│   │       ├── products/       # CRUD produkty
│   │       ├── faqs/           # CRUD FAQ
│   │       └── media/          # Media library
│   └── api/
│       ├── articles/           # Articles REST API
│       ├── categories/         # Categories REST API
│       ├── products/           # Products REST API
│       ├── faqs/               # FAQs REST API
│       ├── tags/               # Tags REST API
│       └── media/              # Media upload API
├── components/
│   └── admin/                  # Admin komponenty
│       ├── layout/             # Sidebar, Header, Breadcrumbs
│       ├── ui/                 # DataTable, LocaleTabs, ConfirmDialog
│       ├── articles/           # TipTap editor, ArticleForm
│       ├── categories/         # CategoryForm, CategoryList
│       ├── products/           # ProductForm, ProductList
│       ├── faqs/               # FaqForm, FaqList
│       └── media/              # MediaLibrary, MediaUploader
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client (cookies)
│   │   └── admin.ts            # Service role client
│   ├── transformers/
│   │   └── product.ts          # DB → FullProductData transformer
│   └── validations/            # Zod schemas
└── types/
    └── database.ts             # Auto-generated z Supabase

/supabase
├── config.toml                 # Supabase konfigurace
├── migrations/                 # SQL migrace
│   ├── 20241223000000_initial_schema.sql
│   ├── 20241223090000_add_category_parent.sql
│   └── 20241223100000_product_extensions.sql
├── seed.sql                    # Základní seed data
└── seed-mybox-profi.sql        # MyBox Profi produkt
```

### API Endpoints

| Endpoint | Metody | Popis |
|----------|--------|-------|
| `/api/articles` | GET, POST | Seznam/vytvoření článků |
| `/api/articles/[id]` | GET, PATCH, DELETE | Detail/úprava/smazání |
| `/api/categories` | GET, POST | Kategorie |
| `/api/products` | GET, POST | Produkty |
| `/api/faqs` | GET, POST | FAQ |
| `/api/tags` | GET, POST | Tagy |
| `/api/media` | POST | Upload souborů |

### Regenerace TypeScript typů

```bash
npx supabase gen types typescript --local > src/types/database.ts
```

### Auto-překlady (OpenAI GPT)

CMS obsahuje funkci automatického překladu obsahu z češtiny do ostatních jazyků.

**Architektura:**

```
src/
├── config/locales.ts              # Centrální konfigurace jazyků
├── lib/openai/
│   ├── client.ts                  # OpenAI client
│   └── translate.ts               # Překladové funkce
├── app/api/translate/route.ts     # Translation API
└── components/admin/ui/
    └── TranslateButton.tsx        # Reusable tlačítko
```

**Použití v admin panelu:**

Tlačítko "Přeložit do EN/DE" vedle LocaleTabs automaticky přeloží všechna textová pole.

**Přidání nového jazyka:**

1. Upravit `src/config/locales.ts`:
   ```typescript
   export const LOCALES = ['cs', 'en', 'de', 'pl'] as const
   ```
2. Přidat překlady do `LocaleTabs` a databáze

📄 **Dokumentace:** [.docs/AUTO_TRANSLATE_IMPLEMENTATION.md](.docs/AUTO_TRANSLATE_IMPLEMENTATION.md)

📄 **Plán:** [CMS_IMPLEMENTATION_PLAN.md](./CMS_IMPLEMENTATION_PLAN.md)

---

## Scripty

```bash
npm run dev       # Development server
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint
```

---

## Assety

### Supabase Storage

Média jsou uložena v Supabase Storage buckety:

| Bucket | Obsah | Max velikost |
|--------|-------|--------------|
| `product-images` | Produktové fotky, galerie | 10 MB |
| `article-images` | Obrázky článků | 5 MB |
| `media` | Videa, loga, ostatní | 50 MB |

**Helper funkce:**

```typescript
import { getProductImageUrl, getMediaUrl } from '@/lib/supabase/storage'

// Produktový obrázek
getProductImageUrl('profi/gallery/image.jpg')
// → http://127.0.0.1:54321/storage/v1/object/public/product-images/profi/gallery/image.jpg

// Video/logo
getMediaUrl('videos/hero.mp4')
```

### Statické soubory

```
/public
├── images/
│   └── logo-mybox*.svg    # Logo varianty
├── favicon.ico
├── site.webmanifest
├── llms.txt              # Pro AI agenty
└── robots.txt
```

---

## Deployment

Doporučený hosting: **Vercel**

```bash
npm run build
# Deploy na Vercel přes Git integraci
```

---

## Licence

Proprietární - MyBox.eco
