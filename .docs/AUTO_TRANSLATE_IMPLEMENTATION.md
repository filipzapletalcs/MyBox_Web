# Auto Translation Feature - Implementation Guide

**Vytvořeno:** 2024-12-23
**Status:** Připraveno k implementaci

---

## Přehled

Automatický překlad obsahu v admin panelu pomocí OpenAI GPT-4.

### Funkce
- Bulk překlad z češtiny do všech jazyků jedním tlačítkem
- Flexibilní architektura pro snadné přidávání jazyků
- Reusable TranslateButton komponenta

---

## Soubory k vytvoření/úpravě

| # | Soubor | Akce | Popis |
|---|--------|------|-------|
| 1 | `src/config/locales.ts` | Create | Centrální konfigurace jazyků |
| 2 | `src/lib/openai/client.ts` | Create | OpenAI client wrapper |
| 3 | `src/lib/openai/translate.ts` | Create | Překladové funkce |
| 4 | `src/app/api/translate/route.ts` | Create | Translation API endpoint |
| 5 | `src/components/admin/ui/TranslateButton.tsx` | Create | Reusable tlačítko |
| 6 | `src/components/admin/articles/ArticleForm.tsx` | Edit | Přidat TranslateButton |
| 7 | `src/components/admin/categories/CategoryForm.tsx` | Edit | Přidat TranslateButton |
| 8 | `src/components/admin/products/ProductForm.tsx` | Edit | Přidat TranslateButton |

---

## 1. Centrální konfigurace jazyků

**Soubor:** `src/config/locales.ts`

```typescript
export const LOCALES = ['cs', 'en', 'de'] as const
export type Locale = (typeof LOCALES)[number]

export const SOURCE_LOCALE: Locale = 'cs'
export const TARGET_LOCALES = LOCALES.filter(l => l !== SOURCE_LOCALE) as Locale[]

export const LOCALE_NAMES: Record<Locale, string> = {
  cs: 'Čeština',
  en: 'English',
  de: 'Deutsch',
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  cs: '🇨🇿',
  en: '🇬🇧',
  de: '🇩🇪',
}
```

**Pro přidání nového jazyka:** Stačí přidat do `LOCALES` pole (např. `'pl'`).

---

## 2. OpenAI Client

**Soubor:** `src/lib/openai/client.ts`

```typescript
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
```

**Soubor:** `src/lib/openai/translate.ts`

```typescript
import { openai } from './client'
import { Locale, LOCALE_NAMES } from '@/config/locales'

export async function translateText(
  text: string,
  targetLocale: Locale,
  context?: string
): Promise<string> {
  if (!text?.trim()) return ''

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Levnější než gpt-4-turbo, stále kvalitní
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the following Czech text to ${LOCALE_NAMES[targetLocale]}.
Context: This is for a website about EV charging stations (MyBox.eco).
Maintain the same tone and formatting. If the text contains HTML or markdown, preserve it.
${context ? `Additional context: ${context}` : ''}`
      },
      { role: 'user', content: text }
    ],
    temperature: 0.3,
  })

  return response.choices[0]?.message?.content || text
}

export async function translateMultiple(
  texts: Record<string, string>,
  targetLocales: Locale[],
  context?: string
): Promise<Record<Locale, Record<string, string>>> {
  const results: Record<string, Record<string, string>> = {}

  // Paralelní překlad pro rychlost
  const promises = targetLocales.flatMap(locale =>
    Object.entries(texts)
      .filter(([_, text]) => text?.trim())
      .map(async ([field, text]) => ({
        locale,
        field,
        value: await translateText(text, locale, context)
      }))
  )

  const translations = await Promise.all(promises)

  // Sestavit výsledek
  for (const { locale, field, value } of translations) {
    if (!results[locale]) results[locale] = {}
    results[locale][field] = value
  }

  return results as Record<Locale, Record<string, string>>
}
```

---

## 3. Translation API Endpoint

**Soubor:** `src/app/api/translate/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { translateMultiple } from '@/lib/openai/translate'
import { TARGET_LOCALES, Locale } from '@/config/locales'

export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { texts, targetLocales, context } = await request.json()

    // Validace
    if (!texts || typeof texts !== 'object') {
      return NextResponse.json({ error: 'Invalid texts' }, { status: 400 })
    }

    const locales = (targetLocales || TARGET_LOCALES) as Locale[]
    const translations = await translateMultiple(texts, locales, context)

    return NextResponse.json({ translations })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}
```

---

## 4. TranslateButton Component

**Soubor:** `src/components/admin/ui/TranslateButton.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Languages, Check, AlertCircle } from 'lucide-react'
import { TARGET_LOCALES, Locale } from '@/config/locales'

interface TranslateButtonProps {
  sourceTexts: Record<string, string>
  onTranslated: (locale: string, field: string, value: string) => void
  disabled?: boolean
  context?: string
}

export function TranslateButton({
  sourceTexts,
  onTranslated,
  disabled,
  context
}: TranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const targetLabels = TARGET_LOCALES.map(l => l.toUpperCase()).join('/')

  const handleTranslate = async () => {
    setIsTranslating(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: sourceTexts,
          targetLocales: TARGET_LOCALES,
          context
        })
      })

      if (!response.ok) throw new Error('Translation failed')

      const { translations } = await response.json()

      // Volat callback pro každé pole/jazyk
      for (const [locale, fields] of Object.entries(translations)) {
        for (const [field, value] of Object.entries(fields as Record<string, string>)) {
          onTranslated(locale, field, value)
        }
      }

      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    } catch (error) {
      console.error('Translation error:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleTranslate}
      disabled={disabled || isTranslating}
    >
      {status === 'success' ? (
        <>
          <Check className="mr-2 h-4 w-4 text-green-500" />
          Hotovo
        </>
      ) : status === 'error' ? (
        <>
          <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
          Chyba
        </>
      ) : (
        <>
          <Languages className={`mr-2 h-4 w-4 ${isTranslating ? 'animate-pulse' : ''}`} />
          {isTranslating ? 'Překládám...' : `Přeložit do ${targetLabels}`}
        </>
      )}
    </Button>
  )
}
```

---

## 5. Integrace do formulářů

### ArticleForm.tsx

```typescript
import { TranslateButton } from '@/components/admin/ui/TranslateButton'

// V JSX, vedle LocaleTabs:
<div className="flex items-center justify-between">
  <LocaleTabs activeLocale={activeLocale} onChange={setActiveLocale} />
  <TranslateButton
    sourceTexts={{
      title: watch('translations.cs.title'),
      excerpt: watch('translations.cs.excerpt'),
      content: watch('translations.cs.content'),
      seo_title: watch('translations.cs.seo_title'),
      seo_description: watch('translations.cs.seo_description'),
    }}
    onTranslated={(locale, field, value) => {
      setValue(`translations.${locale}.${field}`, value, { shouldDirty: true })
    }}
    disabled={!watch('translations.cs.title')}
    context="blog article about EV charging stations"
  />
</div>
```

### CategoryForm.tsx

```typescript
<TranslateButton
  sourceTexts={{
    name: watch('translations.cs.name'),
    description: watch('translations.cs.description'),
  }}
  onTranslated={(locale, field, value) => {
    setValue(`translations.${locale}.${field}`, value, { shouldDirty: true })
  }}
  disabled={!watch('translations.cs.name')}
  context="category name for blog"
/>
```

### ProductForm.tsx

```typescript
<TranslateButton
  sourceTexts={{
    name: watch('translations.cs.name'),
    tagline: watch('translations.cs.tagline'),
    description: watch('translations.cs.description'),
    seo_title: watch('translations.cs.seo_title'),
    seo_description: watch('translations.cs.seo_description'),
  }}
  onTranslated={(locale, field, value) => {
    setValue(`translations.${locale}.${field}`, value, { shouldDirty: true })
  }}
  disabled={!watch('translations.cs.name')}
  context="product description for EV charging station"
/>
```

---

## 6. Environment Variables

```env
# .env.local
OPENAI_API_KEY=sk-proj-...
```

---

## 7. NPM Dependencies

```bash
npm install openai
```

---

## Přidání nového jazyka

1. Upravit `src/config/locales.ts`:
   ```typescript
   export const LOCALES = ['cs', 'en', 'de', 'pl'] as const  // Přidat 'pl'

   export const LOCALE_NAMES: Record<Locale, string> = {
     cs: 'Čeština',
     en: 'English',
     de: 'Deutsch',
     pl: 'Polski',  // Přidat
   }
   ```

2. Přidat překlady do `LocaleTabs` komponenty

3. Rozšířit DB schéma pokud používá enum pro locale

**Hotovo!** - TranslateButton automaticky použije nový jazyk.

---

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  ← Zpět    Nový článek                    [Uložit]      │
├─────────────────────────────────────────────────────────┤
│  [🇨🇿 Čeština ●] [🇬🇧 English ○] [🇩🇪 Deutsch ○]           │
│                                    [🌐 Přeložit do EN/DE]│
├─────────────────────────────────────────────────────────┤
│  Titulek                                                 │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Jak vybrat správnou nabíjecí stanici                ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## Poznámky

- Použit `gpt-4o-mini` místo `gpt-4-turbo` (10x levnější, kvalitní pro překlady)
- Paralelní volání API pro rychlost
- Autentizace na API endpointu
- Centrální konfigurace jazyků pro snadnou rozšiřitelnost
