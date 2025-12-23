# CMS Implementation Plan: Blog & Product Management

## Overview

Implementation of a professional CMS system for MyBox.eco website with:
- **Blog management** - Articles with categories, tags, and rich text editor
- **Product management** - Technical specifications, features, images
- **User authentication** - Role-based access control
- **Media library** - Image upload and management
- **Multi-language support** - CS, EN, DE (existing i18n infrastructure)

---

## Technology Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Database | PostgreSQL | Local Docker for dev |
| ORM | Prisma | Type-safe database access |
| Auth | NextAuth.js v5 | Credentials + optional OAuth |
| Validation | Zod | Schema validation |
| Rich Text | TipTap | Headless editor |
| Forms | react-hook-form | Already in project |
| File Upload | Local filesystem (dev) | Uploadthing for prod |
| UI Components | Existing UI library | Extend with admin components |

---

## Phase 1: Database & Prisma Setup

### 1.1 Install Dependencies

```bash
npm install prisma @prisma/client
npm install -D prisma
npx prisma init
```

### 1.2 Docker Compose for Local PostgreSQL

Create file: `docker-compose.yml`

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: mybox_postgres
    environment:
      POSTGRES_USER: mybox
      POSTGRES_PASSWORD: mybox_dev_password
      POSTGRES_DB: mybox_cms
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 1.3 Environment Variables

Create/update file: `.env.local`

```env
# Database
DATABASE_URL="postgresql://mybox:mybox_dev_password@localhost:5432/mybox_cms"

# NextAuth
NEXTAUTH_SECRET="generate-random-secret-here-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Upload (local dev)
UPLOAD_DIR="./public/uploads"
```

### 1.4 Prisma Schema

Create file: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER & AUTHENTICATION
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String    // bcrypt hashed
  role          Role      @default(EDITOR)
  avatar        String?
  isActive      Boolean   @default(true)

  articles      Article[]
  sessions      Session[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum Role {
  ADMIN       // Full access: users, settings, all content
  EDITOR      // Articles + products CRUD
  AUTHOR      // Own articles only
}

// ============================================
// BLOG: ARTICLES
// ============================================

model Article {
  id              String    @id @default(cuid())
  slug            String    @unique
  status          ArticleStatus @default(DRAFT)
  publishedAt     DateTime?

  // Relations
  author          User      @relation(fields: [authorId], references: [id])
  authorId        String
  category        Category? @relation(fields: [categoryId], references: [id])
  categoryId      String?
  tags            Tag[]
  translations    ArticleTranslation[]

  // Featured image
  featuredImage   Media?    @relation(fields: [featuredImageId], references: [id])
  featuredImageId String?

  // SEO (fallback if not in translation)
  seoTitle        String?
  seoDescription  String?

  // Metadata
  viewCount       Int       @default(0)
  isFeatured      Boolean   @default(false)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ArticleTranslation {
  id          String   @id @default(cuid())
  locale      String   // cs, en, de
  title       String
  excerpt     String?  @db.Text
  content     String   @db.Text // TipTap JSON content

  // SEO per locale
  seoTitle        String?
  seoDescription  String?

  article     Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  articleId   String

  @@unique([articleId, locale])
}

enum ArticleStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  ARCHIVED
}

// ============================================
// BLOG: CATEGORIES & TAGS
// ============================================

model Category {
  id            String    @id @default(cuid())
  slug          String    @unique
  sortOrder     Int       @default(0)

  translations  CategoryTranslation[]
  articles      Article[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model CategoryTranslation {
  id          String   @id @default(cuid())
  locale      String
  name        String
  description String?

  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  categoryId  String

  @@unique([categoryId, locale])
}

model Tag {
  id        String    @id @default(cuid())
  slug      String    @unique
  name      String    // Display name (can be localized later if needed)

  articles  Article[]

  createdAt DateTime  @default(now())
}

// ============================================
// PRODUCTS
// ============================================

model Product {
  id            String      @id @default(cuid())
  slug          String      @unique
  type          ProductType
  isActive      Boolean     @default(true)
  isFeatured    Boolean     @default(false)
  sortOrder     Int         @default(0)

  // Relations
  translations    ProductTranslation[]
  specifications  ProductSpecification[]
  features        ProductFeature[]  @relation("ProductFeatures")
  images          ProductImage[]

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum ProductType {
  AC_MYBOX
  DC_ALPITRONIC
}

model ProductTranslation {
  id          String   @id @default(cuid())
  locale      String   // cs, en, de
  name        String   // "MyBox PLUS"
  tagline     String?  // Short promotional text
  description String?  @db.Text // Full description

  // SEO
  seoTitle        String?
  seoDescription  String?

  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId   String

  @@unique([productId, locale])
}

model ProductSpecification {
  id          String   @id @default(cuid())
  key         String   // "power", "voltage", "connector_type"
  value       String   // "22", "400", "Type 2"
  unit        String?  // "kW", "V", null
  group       String?  // "electrical", "physical", "connectivity"
  sortOrder   Int      @default(0)

  // Localized label (optional - can use i18n keys instead)
  labelCs     String?
  labelEn     String?
  labelDe     String?

  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId   String

  @@unique([productId, key])
}

model ProductFeature {
  id          String   @id @default(cuid())
  slug        String   @unique // "smart-management", "cloud-ready"
  icon        String?  // Lucide icon name: "Cloud", "Zap", "Shield"

  translations ProductFeatureTranslation[]
  products     Product[] @relation("ProductFeatures")

  createdAt   DateTime @default(now())
}

model ProductFeatureTranslation {
  id          String   @id @default(cuid())
  locale      String
  name        String   // "Smart Management"
  description String?  // "Remote control and monitoring..."

  feature     ProductFeature @relation(fields: [featureId], references: [id], onDelete: Cascade)
  featureId   String

  @@unique([featureId, locale])
}

model ProductImage {
  id          String   @id @default(cuid())
  url         String
  alt         String?
  isPrimary   Boolean  @default(false)
  sortOrder   Int      @default(0)

  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId   String
}

// ============================================
// MEDIA LIBRARY
// ============================================

model Media {
  id          String    @id @default(cuid())
  filename    String    // Original filename
  path        String    // Storage path
  url         String    // Public URL
  mimeType    String    // image/jpeg, image/png, etc.
  size        Int       // Bytes
  width       Int?      // For images
  height      Int?      // For images
  alt         String?   // Alt text for accessibility

  // Relations
  articles    Article[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// ============================================
// SETTINGS (optional, for future use)
// ============================================

model Setting {
  id          String   @id @default(cuid())
  key         String   @unique
  value       String   @db.Text
  type        String   @default("string") // string, number, boolean, json

  updatedAt   DateTime @updatedAt
}
```

### 1.5 Initialize Database

```bash
# Start PostgreSQL
docker-compose up -d

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed initial data
npx prisma db seed
```

---

## Phase 2: Authentication System

### 2.1 Install NextAuth

```bash
npm install next-auth@beta @auth/prisma-adapter
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 2.2 Auth Configuration

Create file: `src/lib/auth.ts`

```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })

        if (!user || !user.isActive) return null

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          user.password
        )

        if (!passwordMatch) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
})
```

Create file: `src/lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
```

### 2.3 Auth API Route

Create file: `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

### 2.4 Middleware for Admin Protection

Update file: `src/middleware.ts`

```typescript
import createMiddleware from "next-intl/middleware"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { routing } from "@/i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: Request) {
  const { pathname } = new URL(request.url)

  // Protect /admin routes (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = await auth()

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Apply i18n middleware for non-admin routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    return intlMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
}
```

### 2.5 TypeScript Types Extension

Create file: `src/types/next-auth.d.ts`

```typescript
import { Role } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface User {
    role: Role
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    id: string
  }
}
```

---

## Phase 3: Admin Panel Structure

### 3.1 Directory Structure

```
src/app/admin/
├── layout.tsx                 # Admin layout (no i18n)
├── login/
│   └── page.tsx              # Login page
├── (dashboard)/
│   ├── layout.tsx            # Dashboard layout with sidebar
│   ├── page.tsx              # Dashboard home
│   ├── articles/
│   │   ├── page.tsx          # Article list
│   │   ├── new/
│   │   │   └── page.tsx      # Create article
│   │   └── [id]/
│   │       └── page.tsx      # Edit article
│   ├── categories/
│   │   └── page.tsx          # Category management
│   ├── products/
│   │   ├── page.tsx          # Product list
│   │   ├── new/
│   │   │   └── page.tsx      # Create product
│   │   └── [id]/
│   │       └── page.tsx      # Edit product
│   ├── media/
│   │   └── page.tsx          # Media library
│   └── users/
│       └── page.tsx          # User management (ADMIN only)
```

### 3.2 Admin Components

```
src/components/admin/
├── layout/
│   ├── AdminLayout.tsx        # Main layout wrapper
│   ├── AdminSidebar.tsx       # Side navigation
│   ├── AdminHeader.tsx        # Top bar with user menu
│   ├── AdminBreadcrumbs.tsx   # Breadcrumb navigation
│   └── AdminPageHeader.tsx    # Page title + actions
├── auth/
│   ├── LoginForm.tsx          # Login form component
│   └── UserMenu.tsx           # User dropdown in header
├── articles/
│   ├── ArticleList.tsx        # DataTable for articles
│   ├── ArticleForm.tsx        # Create/Edit form
│   ├── ArticleEditor.tsx      # TipTap rich text editor
│   ├── ArticleStatusBadge.tsx # Status indicator
│   └── ArticleActions.tsx     # Row actions (edit, delete, publish)
├── products/
│   ├── ProductList.tsx        # DataTable for products
│   ├── ProductForm.tsx        # Create/Edit form
│   ├── SpecificationsEditor.tsx # Dynamic specs form
│   ├── FeaturesSelector.tsx   # Multi-select features
│   └── ProductImageManager.tsx # Image upload & sort
├── categories/
│   ├── CategoryList.tsx
│   └── CategoryForm.tsx
├── media/
│   ├── MediaLibrary.tsx       # Grid view of all media
│   ├── MediaUploader.tsx      # Drag & drop upload
│   ├── MediaPicker.tsx        # Modal for selecting media
│   └── MediaCard.tsx          # Individual media item
├── users/
│   ├── UserList.tsx
│   └── UserForm.tsx
└── ui/
    ├── AdminCard.tsx          # Card wrapper for admin
    ├── DataTable.tsx          # Reusable data table
    ├── Pagination.tsx         # Table pagination
    ├── SearchInput.tsx        # Search with debounce
    ├── FilterDropdown.tsx     # Filter controls
    ├── ConfirmDialog.tsx      # Delete confirmation
    ├── FormSection.tsx        # Form section wrapper
    ├── LocaleTabs.tsx         # Tabs for CS/EN/DE content
    └── StatusSelect.tsx       # Status dropdown
```

---

## Phase 4: API Routes

### 4.1 API Structure

```
src/app/api/
├── auth/[...nextauth]/route.ts
├── articles/
│   ├── route.ts               # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts           # GET, PATCH, DELETE
│       └── publish/
│           └── route.ts       # POST (toggle publish)
├── categories/
│   ├── route.ts               # GET, POST
│   └── [id]/
│       └── route.ts           # GET, PATCH, DELETE
├── tags/
│   ├── route.ts               # GET, POST
│   └── [id]/
│       └── route.ts           # DELETE
├── products/
│   ├── route.ts               # GET, POST
│   └── [id]/
│       ├── route.ts           # GET, PATCH, DELETE
│       └── specifications/
│           └── route.ts       # PUT (bulk update specs)
├── features/
│   ├── route.ts               # GET, POST
│   └── [id]/
│       └── route.ts           # PATCH, DELETE
├── media/
│   ├── route.ts               # GET (list), POST (upload)
│   └── [id]/
│       └── route.ts           # DELETE
└── users/
    ├── route.ts               # GET, POST
    └── [id]/
        └── route.ts           # GET, PATCH, DELETE
```

### 4.2 Validation Schemas

Create file: `src/lib/validations/article.ts`

```typescript
import { z } from "zod"

export const articleTranslationSchema = z.object({
  locale: z.enum(["cs", "en", "de"]),
  title: z.string().min(1, "Title is required").max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
})

export const createArticleSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  featuredImageId: z.string().optional(),
  isFeatured: z.boolean().default(false),
  translations: z
    .array(articleTranslationSchema)
    .min(1, "At least one translation is required"),
})

export const updateArticleSchema = createArticleSchema.partial()

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
```

Create file: `src/lib/validations/product.ts`

```typescript
import { z } from "zod"

export const productTranslationSchema = z.object({
  locale: z.enum(["cs", "en", "de"]),
  name: z.string().min(1, "Name is required").max(100),
  tagline: z.string().max(200).optional(),
  description: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
})

export const productSpecificationSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
  group: z.string().optional(),
  sortOrder: z.number().default(0),
  labelCs: z.string().optional(),
  labelEn: z.string().optional(),
  labelDe: z.string().optional(),
})

export const createProductSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  type: z.enum(["AC_MYBOX", "DC_ALPITRONIC"]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  translations: z
    .array(productTranslationSchema)
    .min(1, "At least one translation is required"),
  specifications: z.array(productSpecificationSchema).optional(),
  featureIds: z.array(z.string()).optional(),
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
```

---

## Phase 5: Rich Text Editor (TipTap)

### 5.1 Install TipTap

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-heading @tiptap/extension-code-block @tiptap/extension-blockquote @tiptap/extension-horizontal-rule @tiptap/extension-text-align
```

### 5.2 Editor Component

Create file: `src/components/admin/articles/ArticleEditor.tsx`

Features to implement:
- Toolbar with formatting buttons
- Headings (H2, H3, H4)
- Bold, Italic, Underline
- Bullet list, Numbered list
- Blockquote
- Code block
- Link insertion
- Image insertion (from media library)
- Horizontal rule
- Text alignment
- Undo/Redo

---

## Phase 6: Public Blog Pages

### 6.1 Blog Routes

```
src/app/[locale]/blog/
├── page.tsx                   # Blog listing with pagination
├── [slug]/
│   └── page.tsx              # Article detail
└── kategorie/
    └── [slug]/
        └── page.tsx          # Articles by category
```

### 6.2 Blog Components

```
src/components/blog/
├── ArticleCard.tsx            # Card for listing
├── ArticleGrid.tsx            # Grid of articles
├── ArticleHeader.tsx          # Title, author, date
├── ArticleContent.tsx         # Rendered TipTap content
├── ArticleSidebar.tsx         # Categories, tags, related
├── ArticleShare.tsx           # Social share buttons
├── CategoryFilter.tsx         # Category navigation
├── TagCloud.tsx               # Popular tags
└── Pagination.tsx             # Blog pagination
```

### 6.3 SEO & Metadata

Each blog page should generate:
- Dynamic title and description
- Open Graph tags
- Twitter cards
- JSON-LD Article schema
- Canonical URLs with hreflang

---

## Phase 7: Product Integration

### 7.1 Update Existing Components

Files to modify:
- `src/app/[locale]/nabijeci-stanice/ProductShowcase.tsx`
- `src/app/[locale]/nabijeci-stanice/ACDCSelector.tsx`

Changes:
1. Fetch products from database instead of hardcoded arrays
2. Use translations based on current locale
3. Display specifications from database
4. Keep existing UI/animations

### 7.2 Data Migration

Create seed script to migrate existing hardcoded products:
- MyBox HOME, PLUS, POST, PROFI
- Hypercharger 50, 200, 400

Include all current:
- Names and descriptions (from messages/*.json)
- Power specifications
- Features
- Images (keep existing paths)

---

## Phase 8: Media Upload System

### 8.1 Local Development Setup

Create file: `src/lib/upload.ts`

```typescript
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { prisma } from "./prisma"

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads"

export async function uploadFile(file: File) {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Generate unique filename
  const timestamp = Date.now()
  const filename = `${timestamp}-${file.name}`
  const path = join(UPLOAD_DIR, filename)

  // Ensure directory exists
  await mkdir(UPLOAD_DIR, { recursive: true })

  // Write file
  await writeFile(path, buffer)

  // Get image dimensions if image
  let width, height
  if (file.type.startsWith("image/")) {
    // Use sharp or similar to get dimensions
  }

  // Save to database
  const media = await prisma.media.create({
    data: {
      filename: file.name,
      path: path,
      url: `/uploads/${filename}`,
      mimeType: file.type,
      size: file.size,
      width,
      height,
    },
  })

  return media
}
```

### 8.2 Upload API Route

Create file: `src/app/api/media/route.ts`

Handle multipart form data upload with:
- File type validation (images only)
- Size limits (e.g., 5MB max)
- Image optimization (optional: sharp)

---

## Implementation Order

### Step 1: Infrastructure (Required First)
- [ ] Create `docker-compose.yml` for PostgreSQL
- [ ] Install Prisma and create schema
- [ ] Set up environment variables
- [ ] Run initial migration
- [ ] Create `src/lib/prisma.ts`

### Step 2: Authentication
- [ ] Install and configure NextAuth.js
- [ ] Create auth API route
- [ ] Update middleware for admin protection
- [ ] Create login page and form
- [ ] Create seed script for initial admin user

### Step 3: Admin Layout
- [ ] Create admin layout structure
- [ ] Build AdminSidebar component
- [ ] Build AdminHeader with user menu
- [ ] Create dashboard page
- [ ] Add breadcrumbs navigation

### Step 4: Article Management
- [ ] Create article API routes (CRUD)
- [ ] Build ArticleList with DataTable
- [ ] Install and configure TipTap editor
- [ ] Build ArticleForm with translations
- [ ] Add category and tag management
- [ ] Implement article publishing flow

### Step 5: Media Library
- [ ] Create upload API route
- [ ] Build MediaLibrary component
- [ ] Build MediaUploader with drag & drop
- [ ] Build MediaPicker for article editor
- [ ] Integrate with TipTap for images

### Step 6: Product Management
- [ ] Create product API routes
- [ ] Build ProductList component
- [ ] Build ProductForm with translations
- [ ] Build SpecificationsEditor
- [ ] Build FeaturesSelector
- [ ] Create seed script for existing products
- [ ] Update ProductShowcase to use database

### Step 7: Public Blog
- [ ] Create blog listing page
- [ ] Create article detail page
- [ ] Create category pages
- [ ] Add pagination
- [ ] Implement SEO metadata
- [ ] Add social sharing

### Step 8: Polish & Testing
- [ ] Error handling throughout
- [ ] Loading states and skeletons
- [ ] Form validation feedback
- [ ] Optimistic updates where appropriate
- [ ] Test all CRUD operations
- [ ] Test role-based access

---

## Database Seed Script

Create file: `prisma/seed.ts`

```typescript
import { PrismaClient, Role, ProductType } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)

  await prisma.user.upsert({
    where: { email: "admin@mybox.eco" },
    update: {},
    create: {
      email: "admin@mybox.eco",
      name: "Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  // Create product features
  const features = [
    { slug: "smart-management", icon: "Cpu" },
    { slug: "cloud-ready", icon: "Cloud" },
    { slug: "czech-made", icon: "Flag" },
    { slug: "warranty-3y", icon: "Shield" },
    // ... more features
  ]

  for (const feature of features) {
    await prisma.productFeature.upsert({
      where: { slug: feature.slug },
      update: {},
      create: {
        slug: feature.slug,
        icon: feature.icon,
        translations: {
          create: [
            { locale: "cs", name: "..." },
            { locale: "en", name: "..." },
            { locale: "de", name: "..." },
          ],
        },
      },
    })
  }

  // Create products (migrate from hardcoded data)
  // ... product creation with translations and specs
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## Notes

### Security Considerations
- All admin routes protected by middleware
- API routes validate session and role
- CSRF protection via NextAuth
- Input sanitization with Zod
- Password hashing with bcrypt (cost factor 12)

### Performance Considerations
- Use React Server Components where possible
- Implement pagination for all lists
- Cache frequently accessed data
- Optimize images on upload
- Use database indexes for common queries

### Multi-language Content
- Each content model has a translations relation
- Admin UI uses LocaleTabs for editing all languages
- Public pages fetch translation based on current locale
- Fallback to default locale (cs) if translation missing
