# Agent 1 (Backend) - Implementace

**Datum:** 2024-12-23
**Projekt:** MyBox.eco CMS

---

## Vytvořené soubory a struktura

### 1. Supabase Integrace

```
src/lib/supabase/
├── client.ts      # Browser Supabase client
├── server.ts      # Server-side client s cookies
└── admin.ts       # Service role client pro admin operace
```

**client.ts** - Pro client-side komponenty:
```typescript
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

**server.ts** - Pro Server Components a Route Handlers:
```typescript
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

**admin.ts** - Pro operace vyžadující service role (bypasuje RLS):
```typescript
import { supabaseAdmin } from '@/lib/supabase/admin'
```

---

### 2. TypeScript Typy

```
src/types/database.ts
```

Automaticky vygenerované typy z Supabase schématu. Import:
```typescript
import type { Database } from '@/types/database'
```

---

### 3. Middleware (Auth)

```
src/middleware.ts
```

- Chrání `/admin/*` routes
- Vyžaduje přihlášení pro přístup do adminu
- Přesměruje nepřihlášené na `/admin/login`
- Zachovává next-intl middleware pro veřejné stránky

---

### 4. Admin Autentizace

```
src/app/admin/
├── layout.tsx              # Základní admin layout
├── login/page.tsx          # Přihlašovací stránka
└── (dashboard)/
    ├── layout.tsx          # Dashboard layout (sidebar, header)
    └── page.tsx            # Dashboard home se statistikami
```

**Přihlašovací údaje:**
- Email: `admin@mybox.eco`
- Heslo: `admin123`

---

### 5. API Routes

#### Articles
```
src/app/api/articles/
├── route.ts          # GET (seznam), POST (vytvoření)
└── [id]/route.ts     # GET, PATCH, DELETE
```

#### Categories
```
src/app/api/categories/
├── route.ts          # GET (seznam), POST (vytvoření)
└── [id]/route.ts     # GET, PATCH, DELETE
```

#### Tags
```
src/app/api/tags/
├── route.ts          # GET (seznam), POST (vytvoření)
└── [id]/route.ts     # DELETE
```

#### Products
```
src/app/api/products/
├── route.ts          # GET (seznam s filtry), POST (vytvoření)
└── [id]/route.ts     # GET, PATCH, DELETE
```

#### FAQs
```
src/app/api/faqs/
├── route.ts          # GET (seznam), POST (vytvoření)
└── [id]/route.ts     # GET, PATCH, DELETE
```

#### Media
```
src/app/api/media/
└── route.ts          # GET (seznam), POST (upload), DELETE (smazání)
```

Podporované buckety:
- `article-images` (5MB limit)
- `product-images` (10MB limit)
- `media` (50MB limit)

---

### 6. Validační schémata (Zod)

```
src/lib/validations/
├── article.ts        # createArticleSchema, updateArticleSchema
├── category.ts       # createCategorySchema, updateCategorySchema
├── product.ts        # createProductSchema, updateProductSchema
└── faq.ts            # createFaqSchema, updateFaqSchema
```

Příklad použití:
```typescript
import { createArticleSchema } from '@/lib/validations/article'

const parsed = createArticleSchema.safeParse(body)
if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
}
```

---

### 7. Databázové migrace

```
supabase/migrations/
└── 20241223000000_initial_schema.sql
```

Obsahuje:
- ENUM typy (user_role, article_status, product_type)
- Tabulky: profiles, categories, tags, articles, products, FAQs
- Překladové tabulky (*_translations)
- RLS policies
- Triggery pro automatickou správu

---

### 8. Seed Data

```
supabase/seed.sql
```

Obsahuje:
- Výchozí kategorie (Elektromobilita, Nabíjecí stanice, Technologie)
- Tagy (AC nabíjení, DC nabíjení, apod.)
- Product features (Nabíjecí výkon, WiFi, LAN, atd.)

---

### 9. Utility skripty

```
scripts/create-admin.ts
```

Skript pro vytvoření admin uživatele přes Supabase Admin API.

---

## Environment Variables

Soubor `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Supabase Studio

**URL:** http://127.0.0.1:54323

Zde lze:
- Prohlížet a editovat data
- Spouštět SQL queries
- Spravovat uživatele (Authentication → Users)
- Nastavovat Storage buckety

---

## Závislosti přidané do package.json

```json
{
  "@supabase/supabase-js": "^2.x",
  "@supabase/ssr": "^0.x"
}
```

---

## API Dokumentace

### GET /api/articles

Query parametry:
- `category` - filtr podle slug kategorie
- `status` - filtr podle stavu (draft, published, scheduled, archived)
- `author_id` - filtr podle ID autora

### POST /api/articles

Body:
```json
{
  "slug": "clanek-url",
  "category_id": "uuid",
  "featured_image": "url",
  "translations": [
    {
      "locale": "cs",
      "title": "Název",
      "content": {},
      "excerpt": "Krátký popis",
      "meta_title": "SEO title",
      "meta_description": "SEO popis"
    }
  ],
  "tag_ids": ["uuid1", "uuid2"]
}
```

### GET /api/products

Query parametry:
- `type` - filtr podle typu (ac_mybox, dc_alpitronic)
- `active` - filtr podle is_active (true/false)

### POST /api/products

Body:
```json
{
  "slug": "produkt-url",
  "type": "ac_mybox",
  "translations": [...],
  "specifications": [...],
  "feature_ids": [...]
}
```

---

## Poznámky pro Agenta 2

### Soubory, které NEUPRAVOVAT:
- `src/middleware.ts` - auth je hotová
- `src/lib/supabase/*` - clients jsou hotové

### Import patterns:
```typescript
// Browser komponenty
import { createClient } from '@/lib/supabase/client'

// Server Components / API Routes
import { createClient } from '@/lib/supabase/server'

// Database typy
import type { Database } from '@/types/database'
type Article = Database['public']['Tables']['articles']['Row']
```

### Fetch z API:
```typescript
// Client-side
const response = await fetch('/api/articles')
const { data } = await response.json()

// Server-side (doporučeno)
const supabase = await createClient()
const { data } = await supabase.from('articles').select('*, article_translations(*)')
```

---

## Další kroky

- [x] Products API
- [x] Admin uživatel vytvořen
- [x] Media upload API
- [x] FAQs API routes
- [ ] AI embeddings (pgvector) - bude v další fázi
