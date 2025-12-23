# Agent 2 (Frontend) - Implementace

**Datum:** 2024-12-23
**Projekt:** MyBox.eco CMS

---

## Vytvořené soubory a struktura

### 1. Layout komponenty

```
src/components/admin/layout/
├── AdminSidebar.tsx      # Boční navigace, 280px fixed
├── AdminHeader.tsx       # Header s breadcrumbs a user menu
├── AdminBreadcrumbs.tsx  # Auto-generated breadcrumbs
└── index.ts              # Exports
```

**AdminSidebar:**
- Logo MyBox s CMS badge
- Navigační menu s lucide-react ikonami
- Active state s green accent
- Responsive - skrývá se na mobile
- User info + logout button

**AdminHeader:**
- Breadcrumbs (auto-generated z URL)
- Notifications bell (placeholder)
- User dropdown menu (settings, logout)

---

### 2. UI komponenty

```
src/components/admin/ui/
├── DataTable.tsx         # Reusable tabulka
├── LocaleTabs.tsx        # CS/EN/DE přepínač
├── ConfirmDialog.tsx     # Potvrzovací dialog
└── index.ts              # Exports
```

**DataTable:**
- Sorting (kliknutelné hlavičky)
- Pagination s navigací
- Row selection (checkboxy)
- Loading skeleton
- Empty state
- Custom cell renderery

**LocaleTabs:**
- CS/EN/DE přepínač
- Status indikátor (complete/partial/empty)
- Green accent pro aktivní tab

**ConfirmDialog:**
- Varianty: danger, warning, default
- Async onConfirm s loading state
- Wrapper nad Radix Dialog

---

### 3. TipTap Editor

```
src/components/admin/articles/
├── EditorToolbar.tsx     # Toolbar s formátováním
└── ArticleEditor.tsx     # TipTap wrapper
```

**Nainstalované závislosti:**
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder date-fns
```

**Funkce editoru:**
- Bold, Italic
- Heading 2, Heading 3
- Bullet list, Ordered list
- Link insertion s modal
- Undo/Redo
- Clear formatting
- JSON output pro databázi

---

### 4. Article Management

```
src/components/admin/articles/
├── ArticleEditor.tsx
├── EditorToolbar.tsx
├── ArticleList.tsx       # Tabulka článků
├── ArticleForm.tsx       # Formulář s LocaleTabs
└── index.ts
```

**ArticleList:**
- DataTable s články
- Sloupce: Název, Stav, Kategorie, Autor, Jazyky, Upraveno
- Actions dropdown (Upravit, Zobrazit, Smazat)
- ConfirmDialog pro mazání

**ArticleForm:**
- react-hook-form + zod validace
- LocaleTabs pro CS/EN/DE
- Auto-generate slug z českého titulku
- Sidebar: slug, kategorie, featured image, is_featured
- SEO sekce: title, description

---

### 5. Article Pages

```
src/app/admin/(dashboard)/articles/
├── page.tsx                    # Seznam článků
├── ArticleListWrapper.tsx      # Client wrapper
├── new/
│   ├── page.tsx               # Nový článek
│   └── NewArticleForm.tsx     # Form wrapper
└── [id]/
    ├── page.tsx               # Editace článku
    └── EditArticleForm.tsx    # Form wrapper
```

---

### 6. Dashboard Layout Update

Upravený soubor `src/app/admin/(dashboard)/layout.tsx`:
- Import AdminSidebar a AdminHeader
- Fetch user profile pro user info
- Sidebar vlevo (280px)
- Header nahoře
- Main content s padding

---

## Import Patterns

```typescript
// Všechny admin komponenty
import {
  AdminSidebar,
  AdminHeader,
  DataTable,
  LocaleTabs,
  ConfirmDialog,
  ArticleEditor,
  ArticleList,
  ArticleForm
} from '@/components/admin'

// Jednotlivé moduly
import { DataTable } from '@/components/admin/ui/DataTable'
import { ArticleEditor } from '@/components/admin/articles/ArticleEditor'
```

---

## Design System

### Barvy (z globals.css)
- Primary accent: `green-500` (#16a34a)
- Active state: `bg-green-500/15 text-green-400`
- Background: `bg-bg-primary`, `bg-bg-secondary`, `bg-bg-tertiary`
- Text: `text-text-primary`, `text-text-secondary`, `text-text-muted`
- Border: `border-border-subtle`, `border-border-default`

### Komponenty využité z src/components/ui/
- Button (primary, secondary, ghost, danger)
- Card
- Input, Textarea, Select
- Dialog, DropdownMenu
- Badge
- Tooltip

### CVA Pattern
Všechny nové komponenty následují CVA pattern z Button.tsx.

---

## Integrace s API (Agent 1)

### Fetch článků (server-side)
```typescript
const supabase = await createClient()
const { data } = await supabase
  .from('articles')
  .select(`
    id, slug, status, is_featured, created_at, updated_at,
    author:profiles(full_name, email),
    translations:article_translations(locale, title),
    category:categories(translations:category_translations(locale, name))
  `)
```

### Create/Update článku (client-side)
```typescript
// Create
await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})

// Update
await fetch(`/api/articles/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})

// Delete
await fetch(`/api/articles/${id}`, { method: 'DELETE' })
```

---

## Další kroky (TODO)

- [ ] Categories management pages
- [ ] Products management pages
- [ ] FAQs management pages
- [ ] Media library (upload, picker)
- [ ] Blog frontend pages
- [ ] Product migration to DB

---

## Struktura souborů

```
src/components/admin/
├── index.ts
├── layout/
│   ├── index.ts
│   ├── AdminSidebar.tsx
│   ├── AdminHeader.tsx
│   └── AdminBreadcrumbs.tsx
├── ui/
│   ├── index.ts
│   ├── DataTable.tsx
│   ├── LocaleTabs.tsx
│   └── ConfirmDialog.tsx
└── articles/
    ├── index.ts
    ├── ArticleEditor.tsx
    ├── EditorToolbar.tsx
    ├── ArticleList.tsx
    └── ArticleForm.tsx

src/app/admin/(dashboard)/
├── layout.tsx (UPRAVENO)
├── page.tsx
└── articles/
    ├── page.tsx
    ├── ArticleListWrapper.tsx
    ├── new/
    │   ├── page.tsx
    │   └── NewArticleForm.tsx
    └── [id]/
        ├── page.tsx
        └── EditArticleForm.tsx
```
