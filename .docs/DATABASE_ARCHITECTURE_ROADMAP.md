# MyBox.eco - Databázová Architektura 2.0
## Komplexní Plán pro Performance, Security, SEO & AI-Ready

> **Status:** TODO - Plán pro budoucí implementaci
> **Vytvořeno:** 2026-01-03
> **Priorita:** Nízká (není na pořadu dne)

---

## Executive Summary

Aktuální stav databáze je solidní, ale pro **future-proof** a **agent-friendly** architekturu doporučuji implementovat následující oblasti:

| Priorita | Oblast | Business Value |
|----------|--------|----------------|
| Kritická | pgvector + Embeddings | AI chatbot, semantic search, recommendations |
| Kritická | Full-Text Search | Rychlé vyhledávání produktů/článků |
| Vysoká | Audit Trail | GDPR compliance, bezpečnost, debugging |
| Vysoká | Slug History | SEO - zachování link juice při přejmenování |
| Střední | Content Versioning | Rollback, preview, A/B testing |
| Střední | Materialized Views | Performance pro komplexní dotazy |
| Nice-to-have | pg_cron Jobs | Automatizace (cleanup, reporting) |

---

## FÁZE 1: AI-Ready Databáze (Agent-Friendly)

### 1.1 Instalace pgvector

```sql
-- Povolit rozšíření
CREATE EXTENSION IF NOT EXISTS vector;

-- Ověřit instalaci
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
```

### 1.2 Knowledge Base pro RAG (Retrieval Augmented Generation)

```sql
-- Tabulka pro chunky obsahu (pro AI retrieval)
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Zdroj dat
  source_type TEXT NOT NULL CHECK (source_type IN (
    'product', 'article', 'faq', 'document', 'page'
  )),
  source_id UUID NOT NULL,
  source_locale TEXT REFERENCES supported_locales(code),

  -- Obsah
  chunk_index INT NOT NULL DEFAULT 0,  -- Pořadí chunku v dokumentu
  content TEXT NOT NULL,               -- Textový obsah
  content_hash TEXT GENERATED ALWAYS AS (md5(content)) STORED,

  -- Embedding (1536 dimenzí pro OpenAI ada-002, 3072 pro text-embedding-3-large)
  embedding vector(1536),

  -- Metadata pro filtering
  metadata JSONB DEFAULT '{}',
  /*
    metadata example:
    {
      "title": "MyBox Profi",
      "product_type": "ac_mybox",
      "category": "specifications",
      "keywords": ["22kW", "wallbox", "OCPP"]
    }
  */

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(source_type, source_id, source_locale, chunk_index)
);

-- HNSW index pro rychlé similarity search (lepší než IVFFlat pro < 1M vektorů)
CREATE INDEX idx_knowledge_chunks_embedding
ON knowledge_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Index pro filtrování
CREATE INDEX idx_knowledge_chunks_source ON knowledge_chunks(source_type, source_id);
CREATE INDEX idx_knowledge_chunks_locale ON knowledge_chunks(source_locale);
CREATE INDEX idx_knowledge_chunks_metadata ON knowledge_chunks USING gin(metadata);

-- RLS
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Knowledge chunks are readable by everyone"
  ON knowledge_chunks FOR SELECT USING (true);
CREATE POLICY "Editors can manage knowledge chunks"
  ON knowledge_chunks FOR ALL TO authenticated
  USING (is_editor_or_admin())
  WITH CHECK (is_editor_or_admin());
```

### 1.3 Semantic Search Function

```sql
-- Funkce pro semantic search (RAG retrieval)
CREATE OR REPLACE FUNCTION search_knowledge(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10,
  filter_source_type TEXT DEFAULT NULL,
  filter_locale TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  source_type TEXT,
  source_id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.source_type,
    kc.source_id,
    kc.content,
    kc.metadata,
    1 - (kc.embedding <=> query_embedding) as similarity
  FROM knowledge_chunks kc
  WHERE
    (filter_source_type IS NULL OR kc.source_type = filter_source_type)
    AND (filter_locale IS NULL OR kc.source_locale = filter_locale)
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### 1.4 Agent Conversations & Actions Log

```sql
-- Historie konverzací s AI agentem (pro analytics a debugging)
CREATE TABLE agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,           -- Pro groupování zpráv
  user_id UUID REFERENCES auth.users(id),  -- NULL pro anonymní

  -- Konverzace
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- Metadata
  model TEXT,                         -- gpt-4, claude-3, etc.
  tokens_used INT,
  latency_ms INT,

  -- Retrieval context (které chunks byly použity)
  retrieved_chunks UUID[],            -- Reference na knowledge_chunks

  -- Feedback
  feedback_rating INT CHECK (feedback_rating BETWEEN 1 AND 5),
  feedback_text TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agent_conversations_session ON agent_conversations(session_id);
CREATE INDEX idx_agent_conversations_user ON agent_conversations(user_id);
CREATE INDEX idx_agent_conversations_created ON agent_conversations(created_at DESC);

-- Agent actions (co agent udělal - pro audit)
CREATE TABLE agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES agent_conversations(id),

  action_type TEXT NOT NULL,          -- 'search', 'recommend', 'contact_form', etc.
  action_input JSONB,                 -- Vstup akce
  action_output JSONB,                -- Výstup akce
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS - uživatelé vidí pouze své konverzace
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations"
  ON agent_conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Anyone can insert conversations"
  ON agent_conversations FOR INSERT
  WITH CHECK (true);
```

---

## FÁZE 2: Full-Text Search

### 2.1 Přidání Czech FTS Configuration

```sql
-- Czech není v PostgreSQL defaultně, ale můžeme použít 'simple' + custom dictionary
-- nebo Hunspell slovník

-- Pro začátek použijeme simple s českými stop words
CREATE TEXT SEARCH DICTIONARY czech_simple (
  TEMPLATE = simple,
  STOPWORDS = czech  -- Vyžaduje soubor /usr/share/postgresql/tsearch_data/czech.stop
);

CREATE TEXT SEARCH CONFIGURATION czech (COPY = simple);
ALTER TEXT SEARCH CONFIGURATION czech
  ALTER MAPPING FOR word WITH czech_simple;
```

### 2.2 FTS Sloupce pro Články

```sql
-- Přidat tsvector sloupce pro full-text search
ALTER TABLE article_translations
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(
    -- Extract text from TipTap JSON
    (SELECT string_agg(node->>'text', ' ')
     FROM jsonb_array_elements(content->'content') AS node
     WHERE node->>'text' IS NOT NULL
    ), ''
  )), 'C')
) STORED;

-- GIN index pro rychlé vyhledávání
CREATE INDEX idx_article_translations_search
ON article_translations USING gin(search_vector);
```

### 2.3 FTS pro Produkty

```sql
ALTER TABLE product_translations
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(tagline, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(description, '')), 'C')
) STORED;

CREATE INDEX idx_product_translations_search
ON product_translations USING gin(search_vector);
```

### 2.4 Unified Search Function

```sql
-- Jednotné vyhledávání napříč obsahem
CREATE OR REPLACE FUNCTION search_content(
  query TEXT,
  locale TEXT DEFAULT 'cs',
  content_types TEXT[] DEFAULT ARRAY['article', 'product', 'faq'],
  limit_per_type INT DEFAULT 5
)
RETURNS TABLE (
  content_type TEXT,
  id UUID,
  slug TEXT,
  title TEXT,
  excerpt TEXT,
  rank REAL
)
LANGUAGE plpgsql
AS $$
DECLARE
  ts_query tsquery;
BEGIN
  -- Vytvořit tsquery s podporou pro prefix matching
  ts_query := plainto_tsquery('simple', query);

  RETURN QUERY

  -- Články
  SELECT
    'article'::TEXT as content_type,
    a.id,
    a.slug,
    at.title,
    at.excerpt,
    ts_rank(at.search_vector, ts_query) as rank
  FROM articles a
  JOIN article_translations at ON a.id = at.article_id
  WHERE
    'article' = ANY(content_types)
    AND at.locale = search_content.locale
    AND a.status = 'published'
    AND at.search_vector @@ ts_query
  ORDER BY rank DESC
  LIMIT limit_per_type

  UNION ALL

  -- Produkty
  SELECT
    'product'::TEXT,
    p.id,
    p.slug,
    pt.name,
    pt.tagline,
    ts_rank(pt.search_vector, ts_query)
  FROM products p
  JOIN product_translations pt ON p.id = pt.product_id
  WHERE
    'product' = ANY(content_types)
    AND pt.locale = search_content.locale
    AND p.is_active = true
    AND pt.search_vector @@ ts_query
  ORDER BY ts_rank(pt.search_vector, ts_query) DESC
  LIMIT limit_per_type

  UNION ALL

  -- FAQ
  SELECT
    'faq'::TEXT,
    f.id,
    f.slug,
    ft.question,
    LEFT(ft.answer, 200),
    ts_rank(to_tsvector('simple', ft.question || ' ' || ft.answer), ts_query)
  FROM faqs f
  JOIN faq_translations ft ON f.id = ft.faq_id
  WHERE
    'faq' = ANY(content_types)
    AND ft.locale = search_content.locale
    AND f.is_active = true
    AND to_tsvector('simple', ft.question || ' ' || ft.answer) @@ ts_query
  ORDER BY ts_rank(to_tsvector('simple', ft.question || ' ' || ft.answer), ts_query) DESC
  LIMIT limit_per_type;
END;
$$;

-- Použití:
-- SELECT * FROM search_content('nabíjecí stanice', 'cs');
-- SELECT * FROM search_content('wallbox 22kW', 'en', ARRAY['product']);
```

### 2.5 Trigram Search pro Fuzzy Matching

```sql
-- Povolit pg_trgm pro podobnostní vyhledávání (typos, partial matches)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Index pro fuzzy search na názvy produktů
CREATE INDEX idx_product_translations_name_trgm
ON product_translations USING gin(name gin_trgm_ops);

-- Funkce pro autocomplete/suggest
CREATE OR REPLACE FUNCTION suggest_products(
  query TEXT,
  locale TEXT DEFAULT 'cs',
  limit_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name TEXT,
  similarity REAL
)
LANGUAGE sql
AS $$
  SELECT
    p.id,
    p.slug,
    pt.name,
    similarity(pt.name, query) as similarity
  FROM products p
  JOIN product_translations pt ON p.id = pt.product_id
  WHERE
    pt.locale = suggest_products.locale
    AND p.is_active = true
    AND pt.name % query  -- Trigram similarity
  ORDER BY similarity DESC
  LIMIT limit_count;
$$;
```

---

## FÁZE 3: Audit Trail & GDPR

### 3.1 Audit Log Tabulka

```sql
-- Centrální audit log pro všechny změny
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Co se změnilo
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),

  -- Kdo změnil
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  user_role TEXT,

  -- Co přesně
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],  -- Pouze názvy změněných polí

  -- Kontext
  ip_address INET,
  user_agent TEXT,
  request_id TEXT,        -- Pro korelaci s API logy

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexy pro rychlé dotazy
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_record ON audit_log(record_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- Partitioning pro velké objemy (volitelné)
-- CREATE TABLE audit_log (...) PARTITION BY RANGE (created_at);
```

### 3.2 Audit Trigger Function

```sql
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
  changed TEXT[];
  current_user_id UUID;
  current_user_email TEXT;
  current_user_role TEXT;
BEGIN
  -- Získat info o uživateli
  current_user_id := auth.uid();

  SELECT email, raw_user_meta_data->>'role'
  INTO current_user_email, current_user_role
  FROM auth.users
  WHERE id = current_user_id;

  IF TG_OP = 'DELETE' THEN
    old_data := to_jsonb(OLD);
    new_data := NULL;
  ELSIF TG_OP = 'INSERT' THEN
    old_data := NULL;
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
    -- Zjistit které sloupce se změnily
    SELECT array_agg(key) INTO changed
    FROM (
      SELECT key FROM jsonb_each(to_jsonb(NEW))
      EXCEPT
      SELECT key FROM jsonb_each(to_jsonb(OLD))
      WHERE to_jsonb(NEW)->key = to_jsonb(OLD)->key
    ) diff;
  END IF;

  INSERT INTO audit_log (
    table_name, record_id, action,
    user_id, user_email, user_role,
    old_data, new_data, changed_fields
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    current_user_id, current_user_email, current_user_role,
    old_data, new_data, changed
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;
```

### 3.3 Aplikovat Audit na Klíčové Tabulky

```sql
-- Audit pro články
CREATE TRIGGER audit_articles
AFTER INSERT OR UPDATE OR DELETE ON articles
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Audit pro produkty
CREATE TRIGGER audit_products
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Audit pro uživatelské profily
CREATE TRIGGER audit_profiles
AFTER INSERT OR UPDATE OR DELETE ON profiles
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Audit pro kontaktní formuláře (GDPR)
CREATE TRIGGER audit_contact_submissions
AFTER INSERT OR UPDATE OR DELETE ON contact_submissions
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

### 3.4 GDPR Helper Funkce

```sql
-- Export všech dat uživatele (GDPR právo na přístup)
CREATE OR REPLACE FUNCTION export_user_data(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Pouze admin nebo vlastník dat
  IF NOT (is_admin() OR auth.uid() = target_user_id) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT jsonb_build_object(
    'profile', (SELECT to_jsonb(p) FROM profiles p WHERE id = target_user_id),
    'articles', (SELECT jsonb_agg(to_jsonb(a)) FROM articles a WHERE author_id = target_user_id),
    'contact_submissions', (SELECT jsonb_agg(to_jsonb(cs)) FROM contact_submissions cs WHERE email = (SELECT email FROM auth.users WHERE id = target_user_id)),
    'agent_conversations', (SELECT jsonb_agg(to_jsonb(ac)) FROM agent_conversations ac WHERE user_id = target_user_id),
    'audit_log', (SELECT jsonb_agg(to_jsonb(al)) FROM audit_log al WHERE user_id = target_user_id),
    'exported_at', NOW()
  ) INTO result;

  RETURN result;
END;
$$;

-- Anonymizace dat uživatele (GDPR právo na výmaz)
CREATE OR REPLACE FUNCTION anonymize_user_data(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Pouze admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can anonymize user data';
  END IF;

  -- Anonymizovat profil
  UPDATE profiles
  SET
    full_name = 'Anonymizovaný uživatel',
    email = 'anonymized_' || target_user_id || '@deleted.local',
    avatar_url = NULL,
    updated_at = NOW()
  WHERE id = target_user_id;

  -- Anonymizovat kontaktní formuláře
  UPDATE contact_submissions
  SET
    name = 'Anonymizováno',
    email = 'anonymized@deleted.local',
    phone = NULL,
    message = '[Data byla anonymizována na žádost uživatele]'
  WHERE email = (SELECT email FROM auth.users WHERE id = target_user_id);

  -- Log akci
  INSERT INTO audit_log (table_name, record_id, action, user_id, new_data)
  VALUES ('profiles', target_user_id, 'ANONYMIZE', auth.uid(),
          jsonb_build_object('reason', 'GDPR Right to Erasure'));

  RETURN true;
END;
$$;
```

---

## FÁZE 4: SEO - Slug History & Redirects

### 4.1 Slug History Tabulka

```sql
-- Historie slugů pro 301 redirecty
CREATE TABLE slug_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Entita
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'article', 'product', 'category', 'page', 'document'
  )),
  entity_id UUID NOT NULL,

  -- Slug
  old_slug TEXT NOT NULL,
  new_slug TEXT,           -- NULL pokud entita smazána
  locale TEXT REFERENCES supported_locales(code),

  -- Kontext
  changed_by UUID REFERENCES auth.users(id),
  reason TEXT,             -- 'rename', 'seo_optimization', 'typo_fix', etc.

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(entity_type, old_slug, locale)
);

CREATE INDEX idx_slug_history_lookup ON slug_history(entity_type, old_slug, locale);
CREATE INDEX idx_slug_history_entity ON slug_history(entity_type, entity_id);
```

### 4.2 Trigger pro Automatické Slug Tracking

```sql
CREATE OR REPLACE FUNCTION track_slug_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.slug IS DISTINCT FROM NEW.slug THEN
    INSERT INTO slug_history (entity_type, entity_id, old_slug, new_slug, changed_by, reason)
    VALUES (
      TG_ARGV[0],  -- entity_type passed as trigger argument
      NEW.id,
      OLD.slug,
      NEW.slug,
      auth.uid(),
      'slug_update'
    )
    ON CONFLICT (entity_type, old_slug, locale)
    DO UPDATE SET new_slug = EXCLUDED.new_slug;
  END IF;

  RETURN NEW;
END;
$$;

-- Aplikovat na tabulky se slugy
CREATE TRIGGER track_article_slug
BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION track_slug_change('article');

CREATE TRIGGER track_product_slug
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION track_slug_change('product');

CREATE TRIGGER track_category_slug
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION track_slug_change('category');
```

### 4.3 Redirect Lookup Function

```sql
-- Najít redirect pro starý slug
CREATE OR REPLACE FUNCTION get_slug_redirect(
  p_entity_type TEXT,
  p_old_slug TEXT,
  p_locale TEXT DEFAULT 'cs'
)
RETURNS TABLE (
  new_slug TEXT,
  redirect_type INT  -- 301 = permanent, 302 = temporary
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sh.new_slug,
    301 as redirect_type  -- Vždy 301 pro SEO
  FROM slug_history sh
  WHERE
    sh.entity_type = p_entity_type
    AND sh.old_slug = p_old_slug
    AND (sh.locale = p_locale OR sh.locale IS NULL)
    AND sh.new_slug IS NOT NULL
  ORDER BY sh.created_at DESC
  LIMIT 1;
END;
$$;

-- Použití v Next.js middleware:
-- const redirect = await supabase.rpc('get_slug_redirect', {
--   p_entity_type: 'article',
--   p_old_slug: slug,
--   p_locale: locale
-- });
-- if (redirect.data?.new_slug) {
--   return NextResponse.redirect(new URL(`/blog/${redirect.data.new_slug}`, req.url), 301);
-- }
```

---

## FÁZE 5: Content Versioning

### 5.1 Content Versions Tabulka

```sql
-- Verzování obsahu pro rollback a preview
CREATE TABLE content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Entita
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  locale TEXT REFERENCES supported_locales(code),

  -- Verze
  version_number INT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  is_current BOOLEAN DEFAULT false,  -- Aktuální draft

  -- Obsah (snapshot celé entity)
  content JSONB NOT NULL,

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  published_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,

  -- Change notes
  change_summary TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(entity_type, entity_id, locale, version_number)
);

CREATE INDEX idx_content_versions_entity ON content_versions(entity_type, entity_id, locale);
CREATE INDEX idx_content_versions_published ON content_versions(is_published);
CREATE INDEX idx_content_versions_current ON content_versions(is_current);
```

### 5.2 Version Management Functions

```sql
-- Vytvořit novou verzi (draft)
CREATE OR REPLACE FUNCTION create_content_version(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_locale TEXT,
  p_content JSONB,
  p_change_summary TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_version_number INT;
  new_version_id UUID;
BEGIN
  -- Získat další číslo verze
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO new_version_number
  FROM content_versions
  WHERE entity_type = p_entity_type
    AND entity_id = p_entity_id
    AND locale = p_locale;

  -- Označit předchozí draft jako ne-current
  UPDATE content_versions
  SET is_current = false
  WHERE entity_type = p_entity_type
    AND entity_id = p_entity_id
    AND locale = p_locale
    AND is_current = true;

  -- Vytvořit novou verzi
  INSERT INTO content_versions (
    entity_type, entity_id, locale,
    version_number, is_current, content,
    created_by, change_summary
  ) VALUES (
    p_entity_type, p_entity_id, p_locale,
    new_version_number, true, p_content,
    auth.uid(), p_change_summary
  )
  RETURNING id INTO new_version_id;

  RETURN new_version_id;
END;
$$;

-- Publikovat verzi
CREATE OR REPLACE FUNCTION publish_content_version(p_version_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Unpublish předchozí published verzi
  UPDATE content_versions
  SET is_published = false
  WHERE entity_type = (SELECT entity_type FROM content_versions WHERE id = p_version_id)
    AND entity_id = (SELECT entity_id FROM content_versions WHERE id = p_version_id)
    AND locale = (SELECT locale FROM content_versions WHERE id = p_version_id)
    AND is_published = true;

  -- Publikovat novou verzi
  UPDATE content_versions
  SET
    is_published = true,
    published_by = auth.uid(),
    published_at = NOW()
  WHERE id = p_version_id;

  RETURN true;
END;
$$;

-- Rollback na předchozí verzi
CREATE OR REPLACE FUNCTION rollback_content_version(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_locale TEXT,
  p_target_version INT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  target_content JSONB;
  new_version_id UUID;
BEGIN
  -- Získat obsah cílové verze
  SELECT content INTO target_content
  FROM content_versions
  WHERE entity_type = p_entity_type
    AND entity_id = p_entity_id
    AND locale = p_locale
    AND version_number = p_target_version;

  IF target_content IS NULL THEN
    RAISE EXCEPTION 'Version % not found', p_target_version;
  END IF;

  -- Vytvořit novou verzi s obsahem staré
  SELECT create_content_version(
    p_entity_type, p_entity_id, p_locale,
    target_content,
    'Rollback to version ' || p_target_version
  ) INTO new_version_id;

  RETURN new_version_id;
END;
$$;
```

---

## FÁZE 6: Performance Optimalizace

### 6.1 Materialized Views pro Komplexní Dotazy

```sql
-- Materialized view pro produktový katalog s překlady
CREATE MATERIALIZED VIEW mv_products_catalog AS
SELECT
  p.id,
  p.slug,
  p.type,
  p.sku,
  p.is_active,
  p.is_featured,
  p.hero_image,
  p.front_image,
  p.power,
  p.brand,
  p.sort_order,
  pt.locale,
  pt.name,
  pt.tagline,
  pt.description,
  pt.seo_title,
  pt.seo_description,
  -- Počet specifikací
  (SELECT COUNT(*) FROM product_specifications ps WHERE ps.product_id = p.id) as spec_count,
  -- Počet obrázků
  (SELECT COUNT(*) FROM product_images pi WHERE pi.product_id = p.id) as image_count,
  -- Hlavní obrázek
  (SELECT url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) as primary_image,
  p.updated_at
FROM products p
JOIN product_translations pt ON p.id = pt.product_id
WHERE p.is_active = true;

CREATE UNIQUE INDEX idx_mv_products_catalog ON mv_products_catalog(id, locale);
CREATE INDEX idx_mv_products_catalog_type ON mv_products_catalog(type);
CREATE INDEX idx_mv_products_catalog_featured ON mv_products_catalog(is_featured);

-- Funkce pro refresh (volat po změně produktů)
CREATE OR REPLACE FUNCTION refresh_products_catalog()
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_products_catalog;
$$;
```

### 6.2 Statistiky a Analytics View

```sql
-- Materialized view pro dashboard statistiky
CREATE MATERIALIZED VIEW mv_content_stats AS
SELECT
  'articles' as content_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'published') as published,
  COUNT(*) FILTER (WHERE status = 'draft') as draft,
  MAX(updated_at) as last_updated
FROM articles
UNION ALL
SELECT
  'products',
  COUNT(*),
  COUNT(*) FILTER (WHERE is_active = true),
  COUNT(*) FILTER (WHERE is_active = false),
  MAX(updated_at)
FROM products
UNION ALL
SELECT
  'faqs',
  COUNT(*),
  COUNT(*) FILTER (WHERE is_active = true),
  COUNT(*) FILTER (WHERE is_active = false),
  MAX(updated_at)
FROM faqs
UNION ALL
SELECT
  'documents',
  COUNT(*),
  COUNT(*) FILTER (WHERE is_active = true),
  COUNT(*) FILTER (WHERE is_active = false),
  MAX(updated_at)
FROM documents;

-- Refresh jednou za hodinu pomocí pg_cron (viz níže)
```

### 6.3 pg_cron pro Scheduled Jobs

```sql
-- Povolit pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Refresh materialized views každou hodinu
SELECT cron.schedule(
  'refresh-products-catalog',
  '0 * * * *',  -- Každou hodinu
  'SELECT refresh_products_catalog()'
);

SELECT cron.schedule(
  'refresh-content-stats',
  '*/30 * * * *',  -- Každých 30 minut
  'REFRESH MATERIALIZED VIEW mv_content_stats'
);

-- Cleanup starých audit logů (starší než 1 rok)
SELECT cron.schedule(
  'cleanup-old-audit-logs',
  '0 3 * * 0',  -- Každou neděli ve 3:00
  $$DELETE FROM audit_log WHERE created_at < NOW() - INTERVAL '1 year'$$
);

-- Cleanup starých agent konverzací (starší než 6 měsíců)
SELECT cron.schedule(
  'cleanup-old-conversations',
  '0 4 * * 0',
  $$DELETE FROM agent_conversations WHERE created_at < NOW() - INTERVAL '6 months'$$
);
```

---

## FÁZE 7: Advanced Security

### 7.1 Rate Limiting Table

```sql
-- Rate limiting pro API
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identifikace
  identifier TEXT NOT NULL,        -- IP adresa nebo user_id
  identifier_type TEXT NOT NULL CHECK (identifier_type IN ('ip', 'user', 'api_key')),
  endpoint TEXT NOT NULL,          -- '/api/contact', '/api/translate', etc.

  -- Počítadlo
  request_count INT DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),

  -- Limity (z konfigurace)
  -- 100 req/min pro běžné, 10 req/min pro translate API, etc.

  UNIQUE(identifier, identifier_type, endpoint, window_start)
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits(identifier, identifier_type, endpoint);
CREATE INDEX idx_rate_limits_window ON rate_limits(window_start);

-- Funkce pro kontrolu rate limitu
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_identifier_type TEXT,
  p_endpoint TEXT,
  p_max_requests INT DEFAULT 100,
  p_window_seconds INT DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  current_count INT;
  window_start TIMESTAMPTZ;
BEGIN
  window_start := date_trunc('minute', NOW());

  -- Atomický increment
  INSERT INTO rate_limits (identifier, identifier_type, endpoint, request_count, window_start)
  VALUES (p_identifier, p_identifier_type, p_endpoint, 1, window_start)
  ON CONFLICT (identifier, identifier_type, endpoint, window_start)
  DO UPDATE SET request_count = rate_limits.request_count + 1
  RETURNING request_count INTO current_count;

  RETURN current_count <= p_max_requests;
END;
$$;
```

### 7.2 Suspicious Activity Detection

```sql
-- Detekce podezřelé aktivity
CREATE TABLE security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  event_type TEXT NOT NULL CHECK (event_type IN (
    'failed_login', 'rate_limit_exceeded', 'sql_injection_attempt',
    'xss_attempt', 'unauthorized_access', 'data_export', 'admin_action'
  )),

  -- Kontext
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  endpoint TEXT,

  -- Detaily
  details JSONB,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  -- Akce
  action_taken TEXT,  -- 'blocked', 'logged', 'notified', etc.

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_user ON security_events(user_id);
CREATE INDEX idx_security_events_ip ON security_events(ip_address);
CREATE INDEX idx_security_events_created ON security_events(created_at DESC);
CREATE INDEX idx_security_events_severity ON security_events(severity);
```

---

## Implementační Roadmap

```
IMPLEMENTAČNÍ PRIORITY

TÝDEN 1-2: AI-Ready Foundation
├── pgvector extension
├── knowledge_chunks tabulka
├── Embedding pipeline (OpenAI/Anthropic)
└── search_knowledge() funkce

TÝDEN 3: Full-Text Search
├── pg_trgm extension
├── search_vector sloupce
├── search_content() funkce
└── Autocomplete API

TÝDEN 4: Audit & GDPR
├── audit_log tabulka + triggery
├── GDPR export/anonymize funkce
└── Admin dashboard pro audit

TÝDEN 5: SEO & Versioning
├── slug_history + redirecty
├── content_versions tabulka
└── CMS UI pro verzování

TÝDEN 6: Performance & Security
├── Materialized views
├── pg_cron jobs
├── Rate limiting
└── Security events logging
```

---

## Quick Wins (Implementovat Hned)

### 1. Povolit pgvector (5 minut)
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### 2. Přidat search_vector na produkty (10 minut)
```sql
ALTER TABLE product_translations
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(tagline, '')), 'B')
) STORED;

CREATE INDEX idx_product_translations_search
ON product_translations USING gin(search_vector);
```

### 3. Základní audit trigger (15 minut)
Viz sekce 3.1-3.3 výše.

---

## Další Kroky

1. **Schválit plán** - Které fáze chceš implementovat?
2. **Vytvořit migrace** - Postupně podle priorit
3. **Embedding Pipeline** - Napojit na OpenAI/Anthropic API
4. **Frontend integrace** - Search UI, version preview, audit log view

---

*Tento plán je navržen pro škálování od stovek do milionů záznamů s důrazem na AI-ready architekturu.*
