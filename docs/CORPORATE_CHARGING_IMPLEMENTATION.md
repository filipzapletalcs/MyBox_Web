# Implementace sekce "Firemní nabíjení" pro MyBox.eco

## Shrnutí

Implementace landing page a 6 podstránek pro firemní nabíjení s plně editovatelným obsahem v admin CMS, SEO optimalizací a podporou překladů.

**Důležité: Flexibilní jazykový systém**
- Žádné hardcoded jazyky v DB (bez CHECK constraints)
- Využití centrální konfigurace `src/config/locales.ts`
- Integrace existujícího AI překladače (TranslateButton)
- Při přidání nového jazyka (např. polštiny) stačí upravit config

---

## 1. Databázové schéma

### Nová migrace: `supabase/migrations/20241226000000_corporate_charging.sql`

#### 1.1 Corporate Pages (stránky)
```sql
-- POZOR: Nepoužíváme CHECK constraints na locale - flexibilní pro nové jazyky
CREATE TABLE public.corporate_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,  -- 'landing', 'stanice-do-firem', etc.
    page_type TEXT NOT NULL CHECK (page_type IN ('landing', 'subpage')),
    hero_video_url TEXT,
    hero_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.corporate_page_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES public.corporate_pages(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,  -- BEZ CHECK constraint - flexibilní pro nové jazyky
    title TEXT NOT NULL,
    subtitle TEXT,
    hero_heading TEXT,
    hero_subheading TEXT,
    seo_title TEXT,
    seo_description TEXT,
    UNIQUE(page_id, locale)
);
```

#### 1.2 Corporate Sections (sekce stránek)
```sql
CREATE TYPE corporate_section_type AS ENUM (
    'hero', 'client_logos', 'solution_desc', 'stations',
    'case_study', 'gallery', 'inquiry_form', 'benefits',
    'features', 'cta', 'text_content', 'faq'
);

CREATE TABLE public.corporate_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES public.corporate_pages(id) ON DELETE CASCADE,
    section_type corporate_section_type NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}',  -- section-specific config
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.corporate_section_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES public.corporate_sections(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,  -- BEZ CHECK - flexibilní
    heading TEXT,
    subheading TEXT,
    content JSONB,  -- TipTap JSON
    UNIQUE(section_id, locale)
);
```

#### 1.3 Case Studies (reference)
```sql
CREATE TABLE public.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_logo_url TEXT,
    featured_image_url TEXT,
    industry TEXT,  -- 'logistics', 'manufacturing', 'retail'
    station_count INTEGER,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.case_study_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,  -- BEZ CHECK - flexibilní
    title TEXT NOT NULL,
    subtitle TEXT,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    testimonial_text TEXT,
    testimonial_author TEXT,
    seo_title TEXT,
    seo_description TEXT,
    UNIQUE(case_study_id, locale)
);

CREATE TABLE public.case_study_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.case_study_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
    icon TEXT,
    value TEXT NOT NULL,  -- '85%', '24/7', '150'
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.case_study_metric_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_id UUID NOT NULL REFERENCES public.case_study_metrics(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,  -- BEZ CHECK - flexibilní
    label TEXT NOT NULL,  -- 'Snížení nákladů', 'Dostupnost'
    UNIQUE(metric_id, locale)
);
```

#### 1.4 Benefits (výhody pro podstránky)
```sql
CREATE TABLE public.corporate_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.corporate_pages(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.corporate_sections(id) ON DELETE CASCADE,
    icon TEXT,
    color_accent TEXT,  -- 'green', 'blue', 'purple'
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.corporate_benefit_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benefit_id UUID NOT NULL REFERENCES public.corporate_benefits(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,  -- BEZ CHECK - flexibilní
    title TEXT NOT NULL,
    description TEXT,
    UNIQUE(benefit_id, locale)
);
```

---

## 1.5 Flexibilní jazykový systém

### Centrální konfigurace: `src/config/locales.ts`
```typescript
// Pro přidání nového jazyka stačí upravit zde:
export const LOCALES = ['cs', 'en', 'de', 'pl'] as const  // přidat 'pl'
export type Locale = (typeof LOCALES)[number]

export const LOCALE_NAMES: Record<Locale, string> = {
  cs: 'Čeština',
  en: 'English',
  de: 'Deutsch',
  pl: 'Polski',  // přidat
}
```

### Integrace AI překladače (TranslateButton)
- Využijeme existující `TranslateButton` ve všech admin formulářích
- Automaticky překládá z CS do ostatních jazyků
- Podporuje TipTap JSON content
- Import: `import { TranslateButton } from '@/components/admin/ui/TranslateButton'`

### Úprava LocaleTabs komponenty
- Aktuálně má hardcoded locales - upravíme na import z `config/locales.ts`
- Komponenta bude automaticky zobrazovat všechny nakonfigurované jazyky

### Důležité soubory pro jazykovou flexibilitu:
| Soubor | Účel |
|--------|------|
| `src/config/locales.ts` | Centrální konfigurace jazyků |
| `src/components/admin/ui/LocaleTabs.tsx` | Upravit - import z config |
| `src/components/admin/ui/TranslateButton.tsx` | AI překladač |
| `src/app/api/translate/route.ts` | OpenAI translation API |
| `src/i18n/routing.ts` | Next-intl routing (pro frontend) |

---

## 2. Struktura souborů

### Frontend stránky
```
src/app/[locale]/nabijeni-pro-firmy/
├── page.tsx                              # Landing page
├── CorporateHero.tsx                     # Hero sekce
├── SolutionDescription.tsx               # Popis řešení
├── ChargingStationsShowcase.tsx          # Showcase stanic
├── CaseStudyHighlight.tsx                # Zvýrazněná case study
├── SolutionsGallery.tsx                  # Galerie
├── CorporateInquiryForm.tsx              # Poptávkový formulář
├── stanice-do-firem/page.tsx
├── sprava-fleetu/page.tsx
├── domaci-nabijeni-pro-zamestnance/page.tsx
├── uctovani-nakladu/page.tsx
├── danove-vyhody/page.tsx
└── esg-a-elektromobilita/page.tsx
```

### Admin sekce
```
src/app/admin/(dashboard)/
├── corporate/
│   ├── page.tsx                          # Seznam stránek
│   ├── [id]/page.tsx                     # Edit stránky
│   └── [id]/EditCorporatePageForm.tsx
└── case-studies/
    ├── page.tsx                          # Seznam case studies
    ├── new/page.tsx
    ├── new/NewCaseStudyForm.tsx
    ├── [id]/page.tsx
    └── [id]/EditCaseStudyForm.tsx
```

### Komponenty
```
src/components/
├── corporate/
│   ├── CorporatePageLayout.tsx           # Shared layout
│   ├── CorporateHeroSection.tsx          # DB-driven hero
│   ├── BenefitsGrid.tsx                  # Grid výhod
│   ├── FeaturesList.tsx                  # Seznam funkcí
│   ├── SectionRenderer.tsx               # Renderer sekcí
│   └── SubpageNavigation.tsx             # Navigace mezi stránkami
├── case-studies/
│   ├── CaseStudyCard.tsx                 # Karta pro listing
│   ├── CaseStudyCarousel.tsx             # Carousel
│   └── CaseStudyMetrics.tsx              # Metriky
└── admin/
    ├── corporate/
    │   ├── CorporatePageForm.tsx
    │   ├── CorporatePageList.tsx
    │   └── SectionManager.tsx
    └── case-studies/
        ├── CaseStudyForm.tsx
        ├── CaseStudyList.tsx
        ├── CaseStudyGalleryManager.tsx
        └── CaseStudyMetricsManager.tsx
```

### API routes
```
src/app/api/
├── corporate-pages/
│   ├── route.ts                          # GET list, POST create
│   └── [id]/route.ts                     # GET, PATCH, DELETE
├── corporate-sections/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── reorder/route.ts                  # POST reorder
└── case-studies/
    ├── route.ts
    └── [id]/route.ts
```

### Typy a validace
```
src/lib/validations/
├── corporate-page.ts                     # Zod schema
└── case-study.ts                         # Zod schema

src/types/
├── corporate.ts                          # TypeScript types
└── case-study.ts
```

---

## 3. Implementační kroky

### Fáze 0: Příprava - flexibilní jazyky (0.5 dne)
1. [ ] Upravit `LocaleTabs.tsx` - import z `config/locales.ts` místo hardcoded
2. [ ] Ověřit, že `TranslateButton` funguje správně
3. [ ] Připravit pattern pro dynamické locale tabs ve formulářích

### Fáze 1: Databáze (1-2 dny)
1. [ ] Vytvořit migraci `20241226000000_corporate_charging.sql` (BEZ CHECK constraints na locale)
2. [ ] Spustit `npx supabase db push`
3. [ ] Regenerovat typy `npx supabase gen types typescript --local`
4. [ ] Vytvořit TypeScript typy v `src/types/corporate.ts`
5. [ ] Vytvořit Zod schémata v `src/lib/validations/` (dynamické z config)

### Fáze 2: API Routes (1-2 dny)
1. [ ] Corporate Pages API (CRUD)
2. [ ] Corporate Sections API (CRUD + reorder)
3. [ ] Case Studies API (CRUD s nested data)

### Fáze 3: Admin CMS (2-3 dny)
1. [ ] Přidat "Firemní nabíjení" do AdminSidebar
2. [ ] CorporatePageList + CorporatePageForm (s LocaleTabs + TranslateButton)
3. [ ] SectionManager s drag-and-drop
4. [ ] CaseStudyList + CaseStudyForm (s LocaleTabs + TranslateButton)
5. [ ] CaseStudyGalleryManager + CaseStudyMetricsManager
6. [ ] Všechny formuláře: integrovat AI překladač pro automatický překlad z CS

### Fáze 4: Frontend komponenty (2-3 dny)
1. [ ] CorporateHeroSection (video/image parallax)
2. [ ] SolutionDescription (split layout)
3. [ ] ChargingStationsShowcase (carousel produktů)
4. [ ] CaseStudyCard + CaseStudyCarousel
5. [ ] BenefitsGrid (animované karty)
6. [ ] SolutionsGallery (lightbox)
7. [ ] CorporateInquiryForm
8. [ ] SectionRenderer (dispatcher)

### Fáze 5: Stránky (1-2 dny)
1. [ ] Landing page `/nabijeni-pro-firmy`
2. [ ] 6 podstránek
3. [ ] generateMetadata pro SEO
4. [ ] SubpageNavigation komponenta

### Fáze 6: SEO a dokončení (1 den)
1. [ ] JSON-LD structured data (Service, BreadcrumbList)
2. [ ] Aktualizovat sitemap.ts
3. [ ] Přidat překlady do messages/*.json
4. [ ] Seed data pro testování

---

## 4. Klíčové soubory k úpravě

| Soubor | Účel |
|--------|------|
| `supabase/migrations/20241226000000_corporate_charging.sql` | Nové tabulky |
| `src/app/admin/(dashboard)/layout.tsx` | Přidat sidebar položku |
| `src/components/admin/layout/AdminSidebar.tsx` | Navigace admin |
| `src/app/sitemap.ts` | SEO sitemap |
| `src/messages/cs.json`, `en.json`, `de.json` | Překlady |

---

## 5. Architektura sekcí

### SectionRenderer pattern
```tsx
function SectionRenderer({ section }: { section: CorporateSection }) {
  const components: Record<SectionType, React.ComponentType> = {
    hero: CorporateHeroSection,
    client_logos: ClientLogosSection,
    solution_desc: SolutionDescription,
    stations: ChargingStationsShowcase,
    case_study: CaseStudyHighlight,
    gallery: SolutionsGallery,
    inquiry_form: CorporateInquiryForm,
    benefits: BenefitsGrid,
    features: FeaturesList,
    cta: CTASection,
    text_content: RichTextSection,
    faq: FAQSection,
  }

  const Component = components[section.section_type]
  return <Component section={section} />
}
```

---

## 6. Landing page struktura (dle PDF)

1. **Hero** - Video pozadí, heading, CTA
2. **Client Logos** - Existující carousel (Volvo, ČEZ, etc.)
3. **Popis řešení** - Text + obrázek split
4. **Nabíjecí stanice** - Showcase produktů
5. **Case Study** - Zvýrazněná reference
6. **Galerie řešení** - Image carousel
7. **Poptávka** - Kontaktní formulář

---

## 7. Podstránky

Každá podstránka bude mít:
- Hero sekci (video/image)
- SEO text content
- Benefits/výhody grid
- FAQ (volitelné)
- CTA sekce

| Slug | Název CS | Obsah |
|------|----------|-------|
| `stanice-do-firem` | Stanice do firem | Workplace charging benefits |
| `sprava-fleetu` | Správa fleetu | Fleet management features |
| `domaci-nabijeni-pro-zamestnance` | Domácí nabíjení | Employee home charging |
| `uctovani-nakladu` | Účtování nákladů | Cost tracking & billing |
| `danove-vyhody` | Daňové výhody | Tax benefits info |
| `esg-a-elektromobilita` | ESG a elektromobilita | ESG compliance |

---

## 8. Interaktivní prvky

- **Parallax scroll** - Hero sekce (Framer Motion)
- **Logo carousel** - Infinite scroll (existující)
- **Product carousel** - Horizontal scroll s navigací
- **Case study slider** - Karty s hover efekty
- **Gallery lightbox** - Fullscreen prohlížení
- **Animated benefits** - Fade-in on scroll
- **Form validation** - React Hook Form + Zod
