# MyBox.eco

Prezentační web pro českého výrobce nabíjecích stanic pro elektromobily.

## Technologie

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **Animace:** Framer Motion
- **i18n:** next-intl (CS, EN, DE)
- **UI Primitiva:** Radix UI
- **Font:** HalisR (vlastní)

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
│   ├── [locale]/                 # Lokalizované stránky
│   │   ├── layout.tsx           # Root layout s providery
│   │   ├── page.tsx             # Homepage
│   │   ├── nabijeci-stanice/    # Nabíjecí stanice sekce
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── ChargingStationsHero.tsx
│   │   │   ├── ACDCSelector.tsx
│   │   │   ├── ProductShowcase.tsx
│   │   │   ├── USPSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── ac/              # AC stanice
│   │   │   └── dc/              # DC stanice
│   │   ├── nabijeni-pro-firmy/  # B2B sekce
│   │   ├── reseni-nabijeni/     # Segmenty
│   │   ├── vyhody-reseni/       # Výhody
│   │   ├── rizeni-nabijeni/     # Cloud, App, DLM
│   │   ├── reference/           # Case studies
│   │   ├── blog/                # Blog
│   │   ├── o-nas/               # O nás
│   │   ├── kontakt/             # Kontakt
│   │   └── poptavka/            # Poptávkový formulář
│   ├── api/                     # API routes
│   └── globals.css              # Globální styly + design tokens
├── components/
│   ├── layout/                  # Layout komponenty
│   │   ├── Header.tsx          # Navigace
│   │   ├── Footer.tsx          # Patička
│   │   ├── Logo.tsx            # Logo komponenta
│   │   ├── MegaMenu.tsx        # Mega menu navigace
│   │   ├── LanguageSwitcher.tsx # Přepínač jazyků
│   │   └── ThemeToggle.tsx     # Dark/Light mode
│   ├── sections/               # Sekční komponenty
│   │   ├── Hero.tsx
│   │   ├── HeroVideo.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTA.tsx
│   │   └── Newsletter.tsx
│   ├── ui/                     # UI primitiva (shadcn-style)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Accordion.tsx
│   │   ├── Dialog.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts            # Barrel export
│   └── providers/
│       └── Providers.tsx       # Theme + další providery
├── lib/
│   ├── fonts.ts                # HalisR font konfigurace
│   ├── utils.ts                # Utility funkce (cn, etc.)
│   ├── design-tokens.ts        # TypeScript design tokens
│   └── metadata.ts             # SEO helpers
├── i18n/
│   ├── request.ts              # next-intl konfigurace
│   ├── navigation.ts           # Lokalizovaná navigace
│   └── routing.ts              # Route mapping
├── messages/                   # Překlady
│   ├── cs.json                 # Čeština
│   ├── en.json                 # Angličtina
│   └── de.json                 # Němčina
├── data/
│   ├── navigation.ts           # Navigační struktura
│   └── products.ts             # Produktová data
└── types/
    └── index.ts                # TypeScript typy
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

Každý produkt má SEO pole v datovém souboru:

```typescript
// src/data/mybox-profi.ts
export const myboxProfiData: FullProductData = {
  // Základní info
  name: 'MyBox Profi',
  tagline: 'Profesionální wallbox...',
  description: 'Wallbox s výkonem 2×22 kW...',

  // SEO & Structured Data
  sku: 'MYBOX-PROFI',
  category: 'Nabíjecí stanice pro elektromobily',
  manufacturer: {
    name: 'ELEXIM, a.s.',
    url: 'https://mybox.eco',
  },
  countryOfOrigin: 'CZ',

  // Specifikace → additionalProperty
  specifications: [...],
}
```

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

### Implementace

Kompletní implementační plán včetně:
- Docker Compose konfigurace
- SQL schéma s RLS policies
- Next.js integrace
- AI chatbot API
- Backup skripty

📄 **Viz:** [CMS_IMPLEMENTATION_PLAN.md](./CMS_IMPLEMENTATION_PLAN.md)

### Struktura (plánovaná)

```
/src
├── app/
│   ├── [locale]/
│   │   └── admin/              # CMS administrace
│   │       ├── layout.tsx      # Admin layout s auth
│   │       ├── page.tsx        # Dashboard
│   │       ├── posts/          # Správa článků
│   │       ├── products/       # Správa produktů
│   │       ├── media/          # Media library
│   │       └── knowledge/      # AI knowledge base
│   └── api/
│       ├── chat/               # AI chatbot endpoint
│       └── webhooks/           # Supabase webhooks
├── lib/
│   └── supabase/
│       ├── client.ts           # Browser client
│       ├── server.ts           # Server client
│       └── admin.ts            # Admin client (service role)
└── types/
    └── database.ts             # Generated TypeScript types
```

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

```
/public
├── images/
│   ├── products/          # Produktové fotky
│   ├── logos/             # Loga klientů
│   └── logo-mybox*.svg    # Logo varianty
├── videos/                # Hero videa
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
