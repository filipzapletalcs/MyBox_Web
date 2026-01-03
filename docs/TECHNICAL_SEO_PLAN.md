# Technické SEO - Implementační Plán 2026

> Kompletní audit a plán vylepšení technického SEO pro MyBox.eco

## Aktuální Stav

### Core Web Vitals (měřeno localhost)

| Metrika | Naměřeno | Cíl | Status |
|---------|----------|-----|--------|
| **TTFB** | 272ms | < 200ms | ⚠️ Blízko |
| **FCP** | 456ms | < 1.8s | ✅ Výborné |
| **LCP** | ~1.9s* | < 2.5s | ✅ Dobré |
| **CLS** | 0 | < 0.1 | ✅ Výborné |
| **INP** | TBD | < 200ms | 🔍 Změřit |

*LCP odhadnuto z load complete time

### Co Už Máme ✅

- [x] Security headers (X-Frame-Options, HSTS, CSP-ready)
- [x] robots.txt s AI crawlery (GPTBot, ClaudeBot, PerplexityBot...)
- [x] llms.txt pro AI systémy
- [x] Dynamický sitemap.xml (produkty, články, kategorie)
- [x] Hreflang pro 3 jazyky (cs, en, de)
- [x] Open Graph & Twitter Cards
- [x] JSON-LD (Organization, WebSite, Product, BreadcrumbList)
- [x] PWA manifest (site.webmanifest)
- [x] Favicon sada (all sizes)
- [x] Next.js Image optimization (WebP, AVIF)
- [x] Lazy loading obrázků

---

## Fáze 1: Kritické Opravy (Tento Týden)

### 1.1 Viewport Export
**Problém:** Chybí explicitní viewport export v Next.js 14+
**Soubor:** `src/app/[locale]/layout.tsx`

```typescript
// Přidat export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}
```

**Náročnost:** 5 min | **Dopad:** Střední

### 1.2 Product JSON-LD - Přidat Cenu
**Problém:** Offers schema nemá price - Google nezobrazí cenu v rich snippets
**Soubor:** `src/components/seo/ProductJsonLd.tsx`

```typescript
offers: {
  "@type": "Offer",
  "availability": "https://schema.org/InStock",
  "priceCurrency": "CZK",
  "price": product.price || undefined,
  "priceValidUntil": "2026-12-31",
  // nebo pro rozsah:
  "priceSpecification": {
    "@type": "PriceSpecification",
    "minPrice": "29990",
    "maxPrice": "89990",
    "priceCurrency": "CZK"
  }
}
```

**Náročnost:** 15 min | **Dopad:** Vysoký (rich snippets)

### 1.3 Article JSON-LD pro Blog
**Problém:** Blog články nemají Article schema
**Soubor:** Vytvořit `src/components/seo/ArticleJsonLd.tsx`

```typescript
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.excerpt,
  "image": article.image,
  "datePublished": article.published_at,
  "dateModified": article.updated_at,
  "author": {
    "@type": "Person",
    "name": article.author || "MyBox Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "MyBox",
    "logo": "https://mybox.eco/images/logo-mybox.svg"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": canonicalUrl
  }
}
```

**Náročnost:** 30 min | **Dopad:** Vysoký (Google News, Discover)

---

## Fáze 2: Structured Data Rozšíření (Tento Měsíc)

### 2.1 LocalBusiness Schema
**Účel:** Lepší lokální SEO, Google Maps integrace
**Soubor:** Vytvořit `src/components/seo/LocalBusinessJsonLd.tsx`

```typescript
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://mybox.eco/#localbusiness",
  "name": "MyBox - ELEXIM, a.s.",
  "image": "https://mybox.eco/images/og/home-og.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Hulínská 1814/1b",
    "addressLocality": "Kroměříž",
    "postalCode": "767 01",
    "addressCountry": "CZ"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 49.2988,
    "longitude": 17.3928
  },
  "url": "https://mybox.eco",
  "telephone": "+420-734-597-699",
  "email": "info@mybox.eco",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ],
  "priceRange": "$$",
  "currenciesAccepted": "CZK, EUR",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer"
}
```

**Náročnost:** 20 min | **Dopad:** Střední (lokální SEO)

### 2.2 AggregateRating Schema
**Předpoklad:** Máte data o recenzích/hodnoceních
**Přidat do:** `src/components/seo/ProductJsonLd.tsx`

```typescript
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "127",
  "bestRating": "5",
  "worstRating": "1"
},
"review": [
  {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5"
    },
    "author": {
      "@type": "Person",
      "name": "Jan Novák"
    },
    "reviewBody": "Skvělá nabíjecí stanice, instalace proběhla hladce."
  }
]
```

**Náročnost:** 30 min | **Dopad:** Vysoký (hvězdičky v SERPu)

### 2.3 FAQ Schema na Více Stránkách
**Aktuální:** Pouze na /nabijeci-stanice
**Rozšířit na:**
- Produktové stránky (specifické FAQ)
- /podpora
- /kontakt

**Náročnost:** 45 min | **Dopad:** Střední

### 2.4 HowTo Schema
**Pro:** Instalační průvodce, návody
**Použití:** Stránky o instalaci, servisu

```typescript
{
  "@type": "HowTo",
  "name": "Jak nainstalovat nabíjecí stanici MyBox",
  "description": "Průvodce instalací wallboxu MyBox",
  "totalTime": "PT2H",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "CZK",
    "value": "5000"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Výběr lokace",
      "text": "Vyberte vhodné místo pro instalaci..."
    }
  ]
}
```

**Náročnost:** 1 hodina | **Dopad:** Nízký-Střední

---

## Fáze 3: Performance Optimalizace

### 3.1 Image Optimization Audit
**Zkontrolovat:**
- [ ] Všechny `<Image>` mají `sizes` atribut
- [ ] Priority loading pro above-the-fold obrázky
- [ ] Placeholder blur pro velké obrázky

**Příklad opravy:**
```tsx
<Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL={product.blurDataUrl}
/>
```

### 3.2 Font Optimization
**Zkontrolovat:**
- [ ] `font-display: swap` pro custom fonty
- [ ] Preload kritických fontů
- [ ] Subset fontů (pouze používané znaky)

### 3.3 Critical CSS
**Next.js automaticky:** ✅
**Ověřit:** Inline kritické CSS pro above-the-fold obsah

### 3.4 JavaScript Optimization
- [ ] Analyzovat bundle size (`npm run analyze`)
- [ ] Code splitting pro velké komponenty
- [ ] Lazy load modálů a off-screen komponent

---

## Fáze 4: Crawlability & Indexace

### 4.1 Internal Linking Audit
**Implementovat:**
- [ ] Related Products na produktových stránkách
- [ ] "Mohlo by vás zajímat" v blogu
- [ ] Breadcrumbs komponenta (vizuální, nejen JSON-LD)

### 4.2 Orphan Pages Check
**Nástroj:** Screaming Frog nebo vlastní crawl
**Cíl:** Každá stránka dostupná max. 3 kliky z homepage

### 4.3 URL Structure Audit
**Zkontrolovat:**
- [ ] Žádné duplicitní URL (trailing slash konzistence)
- [ ] Canonical tags na všech stránkách
- [ ] Redirect chains (max 1 redirect)

### 4.4 XML Sitemap Vylepšení
**Aktuální:** ✅ Dynamický sitemap
**Přidat:**
- [ ] Image sitemap (`<image:image>`)
- [ ] Video sitemap pro stránky s videem
- [ ] News sitemap pro blog (pokud je to news-worthy)

```typescript
// Přidat do sitemap.ts
{
  url: productUrl,
  images: [
    {
      url: product.image,
      title: product.name,
    }
  ]
}
```

---

## Fáze 5: Monitoring & Analytics

### 5.1 Google Search Console
- [ ] Ověřit vlastnictví domény
- [ ] Odeslat sitemap
- [ ] Nastavit preferovanou doménu
- [ ] Monitorovat Core Web Vitals report

### 5.2 Bing Webmaster Tools
- [ ] Registrace a ověření
- [ ] Odeslat sitemap
- [ ] IndexNow implementace (okamžitá indexace)

### 5.3 Rich Results Monitoring
- [ ] Pravidelně testovat v Google Rich Results Test
- [ ] Monitorovat structured data errors v GSC

### 5.4 Performance Monitoring
**Nástroje:**
- Google PageSpeed Insights (produkce)
- Lighthouse CI (v CI/CD pipeline)
- Web Vitals npm package (RUM data)

```typescript
// Přidat do _app nebo layout
import { onCLS, onFID, onLCP, onINP } from 'web-vitals';

function sendToAnalytics(metric) {
  // Poslat do analytics
}

onCLS(sendToAnalytics);
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
```

---

## Fáze 6: Pokročilé SEO (Q2 2026)

### 6.1 IndexNow Implementace
**Účel:** Okamžitá notifikace vyhledávačů o změnách
**Podporuje:** Bing, Yandex, Seznam.cz

```typescript
// API route: /api/indexnow
export async function POST(req: Request) {
  const { url } = await req.json();

  await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'mybox.eco',
      key: process.env.INDEXNOW_KEY,
      urlList: [url]
    })
  });
}
```

### 6.2 Edge SEO (Cloudflare Workers)
**Možnosti:**
- A/B testing title tags
- Dynamické meta tagy podle GEO
- Redirect management

### 6.3 AI Search Optimization
**llms.txt:** ✅ Už máme
**Další kroky:**
- [ ] Přidat llms-full.txt s kompletním obsahem
- [ ] Strukturovaný obsah pro AI scraping
- [ ] Pravidelná aktualizace llms.txt

---

## Checklist - Prioritizace

### Kritické (Do 1 týdne)
- [ ] Viewport export
- [ ] Product price v JSON-LD
- [ ] Article JSON-LD pro blog

### Vysoká priorita (Do 2 týdnů)
- [ ] LocalBusiness schema
- [ ] AggregateRating (pokud máte data)
- [ ] Image sizes audit

### Střední priorita (Do 1 měsíce)
- [ ] FAQ na více stránkách
- [ ] Breadcrumbs komponenta
- [ ] Internal linking vylepšení
- [ ] Google Search Console setup

### Nízká priorita (Q2 2026)
- [ ] IndexNow
- [ ] Video sitemap
- [ ] HowTo schema
- [ ] Web Vitals RUM monitoring

---

## Zdroje

- [Technical SEO Checklist 2026 - NoGood](https://nogood.io/blog/technical-seo-checklist/)
- [Core Web Vitals - web.dev](https://web.dev/vitals/)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [llms.txt Specification](https://llmstxt.org/)

---

## Aktuální SEO Skóre

| Oblast | Skóre | Cíl |
|--------|-------|-----|
| Meta Tags | 9/10 | 10/10 |
| Structured Data | 7/10 | 9/10 |
| Performance | 8/10 | 9/10 |
| Mobile | 9/10 | 10/10 |
| Security | 9/10 | 10/10 |
| Crawlability | 8/10 | 9/10 |
| **Celkem** | **8.3/10** | **9.5/10** |

---

*Poslední aktualizace: 3. ledna 2026*
