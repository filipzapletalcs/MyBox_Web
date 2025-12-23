# CMS Implementation Plan: Self-Hosted Supabase

## Overview

Implementace CMS systému pro MyBox.eco s využitím **self-hosted Supabase** běžícího na firemním serveru v Docker kontejnerech.

### Funkce
- **Blog management** - Články s kategoriemi, tagy a rich text editorem
- **Product management** - Technické specifikace, vlastnosti, obrázky
- **Media library** - Upload a správa obrázků (Supabase Storage)
- **User authentication** - Supabase Auth s role-based access
- **AI Chatbot knowledge base** - pgvector embeddings pro sémantické vyhledávání
- **Multi-language support** - CS, EN, DE

### Výhody self-hosted řešení
| Aspekt | Benefit |
|--------|---------|
| **Náklady** | Nulové měsíční poplatky (pouze elektřina serveru) |
| **Data** | Zůstávají v ČR - snadnější GDPR compliance |
| **Kontrola** | 100% vlastnictví infrastruktury |
| **Portabilita** | Stejné API jako Supabase Cloud |
| **AI Ready** | pgvector pro chatbot knowledge base |

---

## Technology Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| **Platform** | Supabase (self-hosted) | PostgreSQL + Auth + Storage + Realtime |
| **Database** | PostgreSQL 15 + pgvector | Embeddings pro AI chatbot |
| **Storage** | Supabase Storage | S3-compatible, obrázky a soubory |
| **Auth** | Supabase Auth | JWT tokens, role-based access |
| **ORM** | Supabase Client + Zod | Type-safe database access |
| **Rich Text** | TipTap | Headless editor |
| **Forms** | react-hook-form + Zod | Validace |
| **AI** | OpenAI API | Embeddings pro chatbot |
| **Deployment** | Docker Compose | Na firemním serveru |

---

## Phase 1: Server Infrastructure

### 1.1 Požadavky na server

**Minimální konfigurace:**
```
CPU: 2 cores
RAM: 8 GB
Disk: 100 GB SSD
OS: Ubuntu 22.04 LTS nebo Debian 12
```

**Doporučená konfigurace:**
```
CPU: 4 cores
RAM: 16 GB
Disk: 500 GB SSD
Zálohovací úložiště (NAS/externí disk)
```

### 1.2 Instalace Dockeru

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 1.3 Supabase Self-Hosted Setup

```bash
# Vytvořit adresář pro Supabase
mkdir -p /opt/supabase
cd /opt/supabase

# Stáhnout oficiální Docker konfiguraci
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Zkopírovat example environment
cp .env.example .env
```

### 1.4 Konfigurace prostředí

Upravit soubor `.env` - **DŮLEŽITÉ: Změnit všechny secrets!**

```env
############
# Secrets - ZMĚNIT NA VLASTNÍ HODNOTY!
############

# Postgres password (min 32 znaků)
POSTGRES_PASSWORD=vygenerovat-silne-heslo-min-32-znaku

# JWT Secret (vygenerovat: openssl rand -base64 32)
JWT_SECRET=vas-jwt-secret-min-32-znaku

# API Keys (vygenerovat pomocí návodu níže)
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Dashboard credentials
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=silne-heslo-pro-dashboard

############
# URLs - upravit podle vaší domény
############

SITE_URL=https://cms.mybox.eco
API_EXTERNAL_URL=https://api.mybox.eco

############
# Ports
############

KONG_HTTP_PORT=8000
KONG_HTTPS_PORT=8443
STUDIO_PORT=3000

############
# Storage
############

STORAGE_BACKEND=file
FILE_SIZE_LIMIT=52428800  # 50MB

############
# SMTP (volitelné - pro password reset)
############

SMTP_ADMIN_EMAIL=admin@mybox.eco
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_SENDER_NAME=MyBox CMS
```

### 1.5 Generování JWT klíčů

```bash
# Metoda 1: Pomocí Node.js
node -e "
const crypto = require('crypto');

// Vygenerovat JWT secret
const JWT_SECRET = crypto.randomBytes(32).toString('base64');
console.log('JWT_SECRET=' + JWT_SECRET);

// Pro ANON_KEY a SERVICE_ROLE_KEY použít:
// https://supabase.com/docs/guides/self-hosting#generate-api-keys
"

# Metoda 2: Online generátor
# Navštívit: https://supabase.com/docs/guides/self-hosting#generate-api-keys
```

### 1.6 Přidání pgvector extension

Upravit `docker-compose.yml` pro podporu pgvector:

```yaml
services:
  db:
    image: supabase/postgres:15.1.0.147
    # ... existující konfigurace ...
    command:
      - postgres
      - -c
      - shared_preload_libraries=pg_stat_statements,pgaudit,plpgsql,plpgsql_check,pg_cron,pg_net,pgsodium,timescaledb,auto_explain,vector
```

### 1.7 Spuštění Supabase

```bash
cd /opt/supabase/supabase/docker

# Spustit všechny služby
docker compose up -d

# Zkontrolovat stav (všechny by měly být "healthy")
docker compose ps

# Zobrazit logy
docker compose logs -f

# Zastavení
docker compose down
```

### 1.8 Dostupné služby

Po spuštění budou dostupné:

| Služba | URL | Popis |
|--------|-----|-------|
| **Studio** | `http://SERVER_IP:3000` | Admin dashboard |
| **API** | `http://SERVER_IP:8000` | REST & Realtime API |
| **Auth** | `http://SERVER_IP:8000/auth/v1` | Authentication |
| **Storage** | `http://SERVER_IP:8000/storage/v1` | File storage |
| **PostgreSQL** | `SERVER_IP:5432` | Direct DB access |

### 1.9 Reverse Proxy s Nginx

Pro produkční nasazení s HTTPS:

```nginx
# /etc/nginx/sites-available/supabase

# API endpoint
server {
    listen 443 ssl http2;
    server_name api.mybox.eco;

    ssl_certificate /etc/letsencrypt/live/api.mybox.eco/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.mybox.eco/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Pro Realtime WebSockets
        proxy_read_timeout 86400;
    }
}

# Studio dashboard
server {
    listen 443 ssl http2;
    server_name cms.mybox.eco;

    ssl_certificate /etc/letsencrypt/live/cms.mybox.eco/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cms.mybox.eco/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# HTTP redirect
server {
    listen 80;
    server_name api.mybox.eco cms.mybox.eco;
    return 301 https://$server_name$request_uri;
}
```

```bash
# Aktivovat konfiguraci
sudo ln -s /etc/nginx/sites-available/supabase /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL certifikáty (Let's Encrypt)
sudo certbot --nginx -d api.mybox.eco -d cms.mybox.eco
```

### 1.10 Alternativa: Cloudflare Tunnel

Pro bezpečný přístup bez otevírání portů na firewallu:

```bash
# Instalace cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Přihlášení k Cloudflare účtu
cloudflared tunnel login

# Vytvoření tunelu
cloudflared tunnel create mybox-cms

# Konfigurace ~/.cloudflared/config.yml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: api.mybox.eco
    service: http://localhost:8000
  - hostname: cms.mybox.eco
    service: http://localhost:3000
  - service: http_status:404

# Spuštění jako systemd služba
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

---

## Phase 2: Database Schema

### 2.1 Připojení k databázi

Přes Supabase Studio (`http://SERVER_IP:3000`) → SQL Editor, nebo:

```bash
# Přímé připojení
docker exec -it supabase-db-1 psql -U postgres
```

### 2.2 Povolit pgvector extension

```sql
-- Povolit vector extension pro AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Ověřit
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### 2.3 Hlavní databázové schéma

Spustit v SQL Editoru:

```sql
-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('admin', 'editor', 'author');
CREATE TYPE article_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE product_type AS ENUM ('ac_mybox', 'dc_alpitronic');

-- ============================================
-- PROFILES (rozšíření auth.users)
-- ============================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'author',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatické vytvoření profilu při registraci
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS pro profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- ============================================
-- CATEGORIES
-- ============================================

CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.category_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    name TEXT NOT NULL,
    description TEXT,
    UNIQUE(category_id, locale)
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT USING (true);

CREATE POLICY "Category translations are viewable by everyone"
    ON public.category_translations FOR SELECT USING (true);

CREATE POLICY "Editors can manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- ============================================
-- TAGS
-- ============================================

CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags are viewable by everyone"
    ON public.tags FOR SELECT USING (true);

CREATE POLICY "Editors can manage tags"
    ON public.tags FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- ============================================
-- ARTICLES
-- ============================================

CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    status article_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    category_id UUID REFERENCES public.categories(id),
    featured_image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.article_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    title TEXT NOT NULL,
    excerpt TEXT,
    content JSONB NOT NULL, -- TipTap JSON content
    seo_title TEXT,
    seo_description TEXT,
    UNIQUE(article_id, locale)
);

CREATE TABLE public.article_tags (
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

-- Publikované články vidí všichni
CREATE POLICY "Published articles are viewable by everyone"
    ON public.articles FOR SELECT
    USING (status = 'published');

-- Autoři vidí své články
CREATE POLICY "Authors can view own articles"
    ON public.articles FOR SELECT
    TO authenticated
    USING (author_id = auth.uid());

-- Editoři vidí všechny články
CREATE POLICY "Editors can view all articles"
    ON public.articles FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Autoři mohou vytvářet články
CREATE POLICY "Authenticated users can create articles"
    ON public.articles FOR INSERT
    TO authenticated
    WITH CHECK (author_id = auth.uid());

-- Autoři mohou upravovat své články, editoři všechny
CREATE POLICY "Authors can update own articles"
    ON public.articles FOR UPDATE
    TO authenticated
    USING (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Editoři mohou mazat
CREATE POLICY "Editors can delete articles"
    ON public.articles FOR DELETE
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Překlady článků
CREATE POLICY "Article translations follow article policy"
    ON public.article_translations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND (status = 'published' OR author_id = auth.uid())
        )
    );

-- ============================================
-- PRODUCTS
-- ============================================

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    type product_type NOT NULL,
    sku TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.product_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    seo_title TEXT,
    seo_description TEXT,
    UNIQUE(product_id, locale)
);

CREATE TABLE public.product_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    spec_key TEXT NOT NULL,
    value TEXT NOT NULL,
    unit TEXT,
    group_name TEXT,
    sort_order INTEGER DEFAULT 0,
    label_cs TEXT,
    label_en TEXT,
    label_de TEXT,
    UNIQUE(product_id, spec_key)
);

CREATE TABLE public.product_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    icon TEXT
);

CREATE TABLE public.product_feature_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_id UUID NOT NULL REFERENCES public.product_features(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    name TEXT NOT NULL,
    description TEXT,
    UNIQUE(feature_id, locale)
);

CREATE TABLE public.product_to_features (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES public.product_features(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, feature_id)
);

CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS pro produkty (veřejně čitelné, editoři mohou upravovat)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_feature_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_to_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
    ON public.products FOR SELECT USING (is_active = true);

CREATE POLICY "Editors can manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Podobné policies pro ostatní product tabulky...
CREATE POLICY "Product translations viewable by everyone"
    ON public.product_translations FOR SELECT USING (true);

CREATE POLICY "Product specs viewable by everyone"
    ON public.product_specifications FOR SELECT USING (true);

CREATE POLICY "Product features viewable by everyone"
    ON public.product_features FOR SELECT USING (true);

CREATE POLICY "Product images viewable by everyone"
    ON public.product_images FOR SELECT USING (true);

-- ============================================
-- FAQ (pro web i chatbot)
-- ============================================

CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.faq_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faq_id UUID NOT NULL REFERENCES public.faqs(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    UNIQUE(faq_id, locale)
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQs are viewable by everyone"
    ON public.faqs FOR SELECT USING (is_active = true);

CREATE POLICY "FAQ translations viewable by everyone"
    ON public.faq_translations FOR SELECT USING (true);

-- ============================================
-- AI KNOWLEDGE BASE (pgvector)
-- ============================================

CREATE TABLE public.knowledge_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    content_type TEXT NOT NULL, -- 'product', 'article', 'faq', 'general'
    source_id UUID,
    source_table TEXT,
    locale TEXT NOT NULL CHECK (locale IN ('cs', 'en', 'de')),
    embedding vector(1536), -- OpenAI text-embedding-ada-002
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pro rychlé vektorové vyhledávání
CREATE INDEX knowledge_embeddings_embedding_idx
    ON public.knowledge_embeddings
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Funkce pro sémantické vyhledávání
CREATE OR REPLACE FUNCTION search_knowledge(
    query_embedding vector(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 5,
    filter_locale TEXT DEFAULT 'cs'
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    content_type TEXT,
    source_id UUID,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        ke.id,
        ke.content,
        ke.content_type,
        ke.source_id,
        ke.metadata,
        1 - (ke.embedding <=> query_embedding) AS similarity
    FROM public.knowledge_embeddings ke
    WHERE
        ke.locale = filter_locale
        AND 1 - (ke.embedding <=> query_embedding) > match_threshold
    ORDER BY ke.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

ALTER TABLE public.knowledge_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Knowledge embeddings are viewable by everyone"
    ON public.knowledge_embeddings FOR SELECT USING (true);

-- ============================================
-- SETTINGS
-- ============================================

CREATE TABLE public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings viewable by admins"
    ON public.settings FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX idx_articles_author_id ON public.articles(author_id);
CREATE INDEX idx_articles_category_id ON public.articles(category_id);
CREATE INDEX idx_products_type ON public.products(type);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_sort_order ON public.products(sort_order);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 2.4 Storage Buckets

Vytvořit přes Supabase Studio → Storage, nebo SQL:

```sql
-- Bucket pro obrázky článků
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('article-images', 'article-images', true, 5242880); -- 5MB limit

-- Bucket pro produktové obrázky
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('product-images', 'product-images', true, 10485760); -- 10MB limit

-- Bucket pro obecná média
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('media', 'media', true, 52428800); -- 50MB limit

-- Storage policies
CREATE POLICY "Public read access for images"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('article-images', 'product-images', 'media'));

CREATE POLICY "Authenticated users can upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id IN ('article-images', 'product-images', 'media'));

CREATE POLICY "Users can update own uploads"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner);

CREATE POLICY "Editors can delete any upload"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        auth.uid() = owner OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );
```

### 2.5 Vytvoření prvního admin uživatele

Přes Supabase Studio → Authentication → Users → Add user:
- Email: `admin@mybox.eco`
- Password: (silné heslo)

Pak nastavit roli v SQL:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@mybox.eco';
```

---

## Phase 3: Next.js Integration

### 3.1 Instalace dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
npm install react-hook-form @hookform/resolvers zod
npm install openai  # pro chatbot embeddings
```

### 3.2 Environment Variables

Přidat do `.env.local`:

```env
# Supabase (self-hosted)
NEXT_PUBLIC_SUPABASE_URL=https://api.mybox.eco
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (pro chatbot embeddings)
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_SITE_URL=https://mybox.eco
```

### 3.3 Supabase Client Setup

**Browser client** - `src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Server client** - `src/lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  )
}
```

**Admin client** - `src/lib/supabase/admin.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Service role client - pouze pro server-side operace!
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

### 3.4 TypeScript Types

Vygenerovat typy z databáze:

```bash
# Pro self-hosted Supabase
npx supabase gen types typescript \
  --db-url "postgresql://postgres:PASSWORD@SERVER_IP:5432/postgres" \
  > src/types/database.ts
```

### 3.5 Middleware

Upravit `src/middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes - vyžadují autentizaci
  if (pathname.startsWith('/admin')) {
    let response = NextResponse.next({
      request: { headers: request.headers },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Nepřihlášený - redirect na login
    if (!user && !pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Přihlášený na login - redirect na dashboard
    if (user && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response
  }

  // Public routes - i18n middleware
  if (!pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    return intlMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

---

## Phase 4: Admin Panel Structure

### 4.1 Directory Structure

```
src/app/admin/
├── layout.tsx                 # Admin layout (bez i18n)
├── login/
│   └── page.tsx              # Login page
├── (dashboard)/
│   ├── layout.tsx            # Dashboard layout se sidebar
│   ├── page.tsx              # Dashboard home
│   ├── articles/
│   │   ├── page.tsx          # Seznam článků
│   │   ├── new/page.tsx      # Nový článek
│   │   └── [id]/page.tsx     # Editace článku
│   ├── products/
│   │   ├── page.tsx          # Seznam produktů
│   │   └── [id]/page.tsx     # Editace produktu
│   ├── categories/
│   │   └── page.tsx
│   ├── faqs/
│   │   └── page.tsx
│   ├── media/
│   │   └── page.tsx          # Media library
│   └── settings/
│       └── page.tsx          # Pouze pro adminy
```

### 4.2 Admin Components

```
src/components/admin/
├── layout/
│   ├── AdminSidebar.tsx      # Boční navigace
│   ├── AdminHeader.tsx       # Horní lišta s user menu
│   └── AdminBreadcrumbs.tsx
├── articles/
│   ├── ArticleList.tsx       # Tabulka článků
│   ├── ArticleForm.tsx       # Formulář s překlady
│   └── ArticleEditor.tsx     # TipTap editor
├── products/
│   ├── ProductList.tsx
│   ├── ProductForm.tsx
│   └── SpecsEditor.tsx       # Editor specifikací
├── media/
│   ├── MediaLibrary.tsx      # Grid všech médií
│   ├── MediaUploader.tsx     # Drag & drop upload
│   └── MediaPicker.tsx       # Modal pro výběr
└── ui/
    ├── DataTable.tsx         # Reusable tabulka
    ├── LocaleTabs.tsx        # CS/EN/DE přepínač
    └── ConfirmDialog.tsx     # Potvrzovací dialog
```

---

## Phase 5: AI Chatbot Integration

### 5.1 Embedding Generation

Vytvořit `src/lib/ai/embeddings.ts`:

```typescript
import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabase/admin'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text.slice(0, 8000), // Max token limit
  })
  return response.data[0].embedding
}

export async function upsertKnowledgeEmbedding({
  content,
  contentType,
  sourceId,
  sourceTable,
  locale,
  metadata = {},
}: {
  content: string
  contentType: 'product' | 'article' | 'faq' | 'general'
  sourceId?: string
  sourceTable?: string
  locale: 'cs' | 'en' | 'de'
  metadata?: Record<string, unknown>
}) {
  const embedding = await generateEmbedding(content)

  const { error } = await supabaseAdmin
    .from('knowledge_embeddings')
    .upsert({
      content,
      content_type: contentType,
      source_id: sourceId,
      source_table: sourceTable,
      locale,
      embedding: embedding as unknown as string, // Supabase accepts array as string
      metadata,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'source_id,source_table,locale',
    })

  if (error) throw error
}

export async function searchKnowledge(
  query: string,
  locale: 'cs' | 'en' | 'de' = 'cs',
  limit: number = 5
) {
  const queryEmbedding = await generateEmbedding(query)

  const { data, error } = await supabaseAdmin.rpc('search_knowledge', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: limit,
    filter_locale: locale,
  })

  if (error) throw error
  return data
}
```

### 5.2 Chatbot API Route

Vytvořit `src/app/api/chat/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { searchKnowledge } from '@/lib/ai/embeddings'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `Jsi pomocný asistent pro MyBox - českého výrobce nabíjecích stanic pro elektromobily.

Odpovídej na dotazy zákazníků ohledně:
- Nabíjecích stanic (AC wallboxy MyBox, DC rychlonabíječky)
- Instalace a technických parametrů
- Cen a dostupnosti
- Služeb a servisu

Pravidla:
1. Používej POUZE informace z poskytnutého kontextu
2. Pokud nevíš odpověď, řekni to upřímně
3. Doporuč kontaktovat obchodní oddělení pro detaily
4. Odpovídej přátelsky a profesionálně
5. Odpovídej v jazyce dotazu

Kontakt na obchodní oddělení:
- Telefon: +420 734 597 699
- Email: info@mybox.eco
- Web: https://mybox.eco/kontakt`

export async function POST(request: NextRequest) {
  try {
    const { message, locale = 'cs', history = [] } = await request.json()

    // Vyhledat relevantní kontext
    const relevantDocs = await searchKnowledge(message, locale, 5)

    const context = relevantDocs
      ?.map((doc: { content: string }) => doc.content)
      .join('\n\n---\n\n') || ''

    // Sestavit zprávy
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: `Relevantní informace z databáze:\n\n${context}` },
      ...history.slice(-10), // Poslední konverzace
      { role: 'user', content: message },
    ]

    // Generovat odpověď
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    return NextResponse.json({
      response: completion.choices[0].message.content,
      sources: relevantDocs?.map((doc: { content_type: string; source_id: string }) => ({
        type: doc.content_type,
        id: doc.source_id,
      })) || [],
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Omlouváme se, došlo k chybě. Zkuste to prosím znovu.' },
      { status: 500 }
    )
  }
}
```

### 5.3 Automatická indexace obsahu

Vytvořit `src/lib/ai/indexing.ts`:

```typescript
import { supabaseAdmin } from '@/lib/supabase/admin'
import { upsertKnowledgeEmbedding } from './embeddings'

// Indexovat produkt do knowledge base
export async function indexProduct(productId: string) {
  const { data: product } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      product_translations(*),
      product_specifications(*)
    `)
    .eq('id', productId)
    .single()

  if (!product) return

  for (const translation of product.product_translations || []) {
    const specs = (product.product_specifications || [])
      .map((s: { label_cs?: string; spec_key: string; value: string; unit?: string }) =>
        `${s.label_cs || s.spec_key}: ${s.value}${s.unit || ''}`
      )
      .join(', ')

    const content = `
Produkt: ${translation.name}
Typ: ${product.type === 'ac_mybox' ? 'AC nabíjecí stanice MyBox' : 'DC rychlonabíjecí stanice'}
${translation.tagline ? `Popis: ${translation.tagline}` : ''}
${translation.description || ''}
Technické parametry: ${specs}
    `.trim()

    await upsertKnowledgeEmbedding({
      content,
      contentType: 'product',
      sourceId: productId,
      sourceTable: 'products',
      locale: translation.locale as 'cs' | 'en' | 'de',
      metadata: {
        name: translation.name,
        slug: product.slug,
        type: product.type,
      },
    })
  }
}

// Indexovat FAQ
export async function indexFaq(faqId: string) {
  const { data: faq } = await supabaseAdmin
    .from('faqs')
    .select(`*, faq_translations(*)`)
    .eq('id', faqId)
    .single()

  if (!faq) return

  for (const translation of faq.faq_translations || []) {
    await upsertKnowledgeEmbedding({
      content: `Otázka: ${translation.question}\nOdpověď: ${translation.answer}`,
      contentType: 'faq',
      sourceId: faqId,
      sourceTable: 'faqs',
      locale: translation.locale as 'cs' | 'en' | 'de',
      metadata: {
        question: translation.question,
        category: faq.category,
      },
    })
  }
}

// Indexovat článek
export async function indexArticle(articleId: string) {
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select(`*, article_translations(*)`)
    .eq('id', articleId)
    .single()

  if (!article || article.status !== 'published') return

  for (const translation of article.article_translations || []) {
    // Extrahovat text z TipTap JSON
    const textContent = extractTextFromTipTap(translation.content)

    await upsertKnowledgeEmbedding({
      content: `${translation.title}\n\n${translation.excerpt || ''}\n\n${textContent}`,
      contentType: 'article',
      sourceId: articleId,
      sourceTable: 'articles',
      locale: translation.locale as 'cs' | 'en' | 'de',
      metadata: {
        title: translation.title,
        slug: article.slug,
      },
    })
  }
}

function extractTextFromTipTap(content: unknown): string {
  if (!content || typeof content !== 'object') return ''

  const doc = content as { content?: Array<{ type?: string; text?: string; content?: unknown }> }
  if (!doc.content) return ''

  return doc.content
    .map((node) => {
      if (node.type === 'text') return node.text || ''
      if (node.content) return extractTextFromTipTap(node)
      return ''
    })
    .join(' ')
    .trim()
}
```

---

## Phase 6: Backup & Maintenance

### 6.1 Automatické zálohy

Vytvořit `/opt/supabase/backup.sh`:

```bash
#!/bin/bash

# Konfigurace
BACKUP_DIR="/backups/supabase"
DATE=$(date +%Y-%m-%d_%H-%M)
RETENTION_DAYS=30

# Vytvořit adresář
mkdir -p $BACKUP_DIR

# Záloha databáze
echo "Backing up database..."
docker exec supabase-db-1 pg_dump -U postgres -F c postgres > $BACKUP_DIR/db_$DATE.dump

# Komprese
gzip $BACKUP_DIR/db_$DATE.dump

# Záloha storage volumes
echo "Backing up storage..."
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz /opt/supabase/supabase/docker/volumes/storage

# Smazat staré zálohy
find $BACKUP_DIR -type f -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE"
echo "Files:"
ls -lh $BACKUP_DIR/*$DATE*
```

Nastavit cron:

```bash
chmod +x /opt/supabase/backup.sh

# Přidat do crontab
crontab -e

# Denní záloha v 3:00
0 3 * * * /opt/supabase/backup.sh >> /var/log/supabase-backup.log 2>&1
```

### 6.2 Obnovení ze zálohy

```bash
# Obnovit databázi
gunzip -c /backups/supabase/db_2024-01-15_03-00.dump.gz | \
  docker exec -i supabase-db-1 pg_restore -U postgres -d postgres -c

# Obnovit storage
tar -xzf /backups/supabase/storage_2024-01-15_03-00.tar.gz -C /
```

### 6.3 Monitoring

```bash
# Healthcheck
curl -f http://localhost:8000/health

# Logy
docker compose logs -f --tail=100 db
docker compose logs -f --tail=100 rest
docker compose logs -f --tail=100 auth

# Stav kontejnerů
docker compose ps

# Využití disku
docker system df
```

### 6.4 Aktualizace Supabase

```bash
cd /opt/supabase/supabase/docker

# Záloha před aktualizací!
/opt/supabase/backup.sh

# Stáhnout nejnovější verzi
git pull

# Zastavit služby
docker compose down

# Aktualizovat image
docker compose pull

# Spustit
docker compose up -d

# Ověřit
docker compose ps
curl -f http://localhost:8000/health
```

---

## Implementation Checklist

### Phase 1: Infrastructure
- [ ] Připravit server s Dockerem
- [ ] Naklonovat Supabase repo
- [ ] Nakonfigurovat `.env` s vlastními secrets
- [ ] Vygenerovat JWT klíče
- [ ] Spustit `docker compose up -d`
- [ ] Nastavit reverse proxy (Nginx nebo Cloudflare Tunnel)
- [ ] Nastavit SSL certifikáty
- [ ] Ověřit přístup k Studio dashboard

### Phase 2: Database
- [ ] Povolit pgvector extension
- [ ] Spustit SQL migraci schématu
- [ ] Vytvořit storage buckety
- [ ] Vytvořit prvního admin uživatele
- [ ] Nastavit automatické zálohy

### Phase 3: Next.js
- [ ] Nainstalovat Supabase dependencies
- [ ] Nakonfigurovat environment variables
- [ ] Vytvořit Supabase client soubory
- [ ] Vygenerovat TypeScript typy
- [ ] Upravit middleware

### Phase 4: Admin Panel
- [ ] Vytvořit admin layout
- [ ] Implementovat login/logout
- [ ] CRUD pro články
- [ ] CRUD pro produkty
- [ ] CRUD pro FAQ
- [ ] Media library s uploadem
- [ ] TipTap editor

### Phase 5: Chatbot
- [ ] Nastavit OpenAI API
- [ ] Implementovat embedding generation
- [ ] Vytvořit search_knowledge RPC
- [ ] Chat API endpoint
- [ ] Automatická indexace obsahu
- [ ] Chatbot UI komponenta

### Phase 6: Migration
- [ ] Migrovat existující produkty do DB
- [ ] Indexovat produkty pro chatbot
- [ ] Přidat FAQ obsah
- [ ] Upravit frontend pro čtení z DB
- [ ] Testování

---

## Security Notes

- **JWT klíče** uchovávat bezpečně, nikdy necommitovat do gitu
- **Service role key** nikdy nepoužívat na frontendu
- **RLS policies** vždy aktivní na všech tabulkách
- Pravidelně **aktualizovat** Docker images
- **Firewall** - otevřít pouze potřebné porty (nebo použít Cloudflare Tunnel)
- **Monitoring** - sledovat přístupové logy

## Performance Notes

- Využívat **Supabase cache** pro časté dotazy
- **Indexy** na často filtrované sloupce
- **Lazy loading** pro obrázky
- **Edge caching** přes Cloudflare
- **Connection pooling** - Supabase to řeší automaticky
