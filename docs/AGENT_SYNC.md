# Agent Synchronization - MyBox CMS

## Stav projektu

**Poslední aktualizace:** 2024-12-23 18:00

---

## Agent 1 (Backend) - Hotové

### Infrastruktura
- [x] Supabase Docker setup (`npx supabase init && start`)
- [x] `.env.local` s klíči
- [x] SQL migrace aplikovány
- [x] Seed data (categories, tags, product_features) - `supabase/seed.sql`

### Supabase Integration
- [x] `src/lib/supabase/client.ts`
- [x] `src/lib/supabase/server.ts`
- [x] `src/lib/supabase/admin.ts`
- [x] `src/types/database.ts` (vygenerováno)

### Middleware & Auth
- [x] `src/middleware.ts` - Supabase auth pro /admin routes
- [x] `src/app/admin/layout.tsx`
- [x] `src/app/admin/login/page.tsx`
- [x] `src/app/admin/(dashboard)/layout.tsx` (základní verze)
- [x] `src/app/admin/(dashboard)/page.tsx`

### API Routes
- [x] `src/app/api/articles/route.ts` (GET, POST)
- [x] `src/app/api/articles/[id]/route.ts` (GET, PATCH, DELETE)
- [x] `src/app/api/categories/route.ts` (GET, POST)
- [x] `src/app/api/categories/[id]/route.ts` (GET, PATCH, DELETE)
- [x] `src/app/api/tags/route.ts` (GET, POST)
- [x] `src/app/api/tags/[id]/route.ts` (DELETE)
- [x] `src/app/api/products/route.ts` (GET, POST)
- [x] `src/app/api/products/[id]/route.ts` (GET, PATCH, DELETE)
- [x] `src/app/api/faqs/route.ts` (GET, POST)
- [x] `src/app/api/faqs/[id]/route.ts` (GET, PATCH, DELETE)
- [x] `src/app/api/media/route.ts` (GET, POST, DELETE)

### Validace
- [x] `src/lib/validations/article.ts`
- [x] `src/lib/validations/category.ts`
- [x] `src/lib/validations/product.ts`
- [x] `src/lib/validations/faq.ts`

---

## Agent 2 (Frontend) - HOTOVÉ

### Layout komponenty
- [x] `src/components/admin/layout/AdminSidebar.tsx` - 280px fixed, responsive
- [x] `src/components/admin/layout/AdminHeader.tsx` - breadcrumbs + user menu
- [x] `src/components/admin/layout/AdminBreadcrumbs.tsx` - auto-generated
- [x] `src/app/admin/(dashboard)/layout.tsx` - UPRAVENO s Sidebar + Header

### UI komponenty
- [x] `src/components/admin/ui/DataTable.tsx` - sorting, pagination, selection
- [x] `src/components/admin/ui/LocaleTabs.tsx` - CS/EN/DE přepínač
- [x] `src/components/admin/ui/ConfirmDialog.tsx` - danger/warning varianty

### TipTap Editor
- [x] TipTap instalace (`@tiptap/react`, `@tiptap/starter-kit`, etc.)
- [x] `src/components/admin/articles/EditorToolbar.tsx`
- [x] `src/components/admin/articles/ArticleEditor.tsx`

### Article management
- [x] `src/components/admin/articles/ArticleList.tsx`
- [x] `src/components/admin/articles/ArticleForm.tsx`
- [x] `src/app/admin/(dashboard)/articles/page.tsx` - seznam
- [x] `src/app/admin/(dashboard)/articles/new/page.tsx` - nový článek
- [x] `src/app/admin/(dashboard)/articles/[id]/page.tsx` - editace

### Index exports
- [x] `src/components/admin/index.ts`
- [x] `src/components/admin/layout/index.ts`
- [x] `src/components/admin/ui/index.ts`
- [x] `src/components/admin/articles/index.ts`

---

## Sdílené soubory (NEKOPÍROVAT)

Tyto soubory jsou hotové a Agent 2 je může používat:

```typescript
// Import Supabase client
import { createClient } from '@/lib/supabase/client'  // browser
import { createClient } from '@/lib/supabase/server' // server

// Import Database types
import type { Database } from '@/types/database'
```

---

## Supabase Studio

**URL:** http://127.0.0.1:54323

Zde můžeš:
- Prohlížet/editovat data
- Testovat SQL queries
- Vytvořit admin uživatele (Authentication → Users)

---

## API Endpoints

| Endpoint | Metody | Popis |
|----------|--------|-------|
| `/api/articles` | GET, POST | Seznam/vytvoření článků |
| `/api/articles/[id]` | GET, PATCH, DELETE | Detail/úprava/smazání |
| `/api/categories` | GET, POST | Seznam/vytvoření kategorií |
| `/api/categories/[id]` | GET, PATCH, DELETE | Detail/úprava/smazání |
| `/api/tags` | GET, POST | Seznam/vytvoření tagů |
| `/api/tags/[id]` | DELETE | Smazání tagu |
| `/api/products` | GET, POST | Seznam/vytvoření produktů |
| `/api/products/[id]` | GET, PATCH, DELETE | Detail/úprava/smazání |
| `/api/faqs` | GET, POST | Seznam/vytvoření FAQ |
| `/api/faqs/[id]` | GET, PATCH, DELETE | Detail/úprava/smazání |
| `/api/media` | GET, POST, DELETE | Upload/seznam/smazání souborů |

---

## Poznámky

### Pro Agenta 2:
- Sidebar má být 280px wide, fixed
- Použij existující UI komponenty z `src/components/ui/`
- Primary color: green-500 (#16a34a)
- CVA pattern viz `src/components/ui/Button.tsx`

### Závislosti k instalaci (Agent 2):
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder
```

---

## Problémy / Blocker

*Žádné aktuální problémy*

---

## Další kroky Agent 1

- [x] Products API routes - HOTOVO
- [x] Vytvořit admin uživatele - HOTOVO (admin@mybox.eco / admin123)
- [x] Media upload API - HOTOVO
- [x] FAQs API routes - HOTOVO
- [ ] AI embeddings (později)

---

## Vytvoření Admin Uživatele

### Krok 1: Vytvořit uživatele v Supabase Studio
1. Otevři http://127.0.0.1:54323
2. Jdi na **Authentication → Users**
3. Klikni **Add user → Create new user**
4. Zadej email a heslo (např. `admin@mybox.eco` / `admin123`)
5. Zaškrtni **Auto Confirm User**

### Krok 2: Nastavit roli admin
V SQL Editoru spusť:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@mybox.eco';
```

### Test přihlášení
- URL: http://localhost:3000/admin/login
- Email: admin@mybox.eco
- Heslo: admin123
