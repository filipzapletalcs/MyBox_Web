import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import {
  ArticleHero,
  ArticleSidebar,
  TipTapRenderer,
  RelatedArticles
} from '@/components/blog'
import { CTASection } from '@/components/sections'
import { ArticleJsonLd } from '@/components/seo'

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>
}

// Helper to estimate reading time
function estimateReadingTime(content: string): number {
  try {
    const json = JSON.parse(content)
    let wordCount = 0

    const countWords = (nodes: { type: string; text?: string; content?: { type: string; text?: string }[] }[]) => {
      nodes.forEach((node) => {
        if (node.text) {
          wordCount += node.text.split(/\s+/).length
        }
        if (node.content) {
          countWords(node.content)
        }
      })
    }

    if (json.content) {
      countWords(json.content)
    }

    return Math.max(1, Math.ceil(wordCount / 200))
  } catch {
    return 3
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const supabase = await createClient()
  const baseUrl = 'https://mybox.eco'

  const { data: article } = await supabase
    .from('articles')
    .select(`
      slug,
      featured_image_url,
      published_at,
      updated_at,
      article_translations(locale, title, excerpt, seo_title, seo_description)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!article) {
    return { title: 'Článek nenalezen' }
  }

  const translation = article.article_translations?.find(
    (t: { locale: string }) => t.locale === locale
  ) || article.article_translations?.[0]

  const title = translation?.seo_title || translation?.title || 'Článek'
  const description = translation?.seo_description || translation?.excerpt || ''

  // Build canonical URL
  const canonicalUrl = locale === 'cs'
    ? `${baseUrl}/blog/${slug}`
    : `${baseUrl}/${locale}/blog/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        cs: `${baseUrl}/blog/${slug}`,
        en: `${baseUrl}/en/blog/${slug}`,
        de: `${baseUrl}/de/blog/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | MyBox.eco`,
      description,
      url: canonicalUrl,
      siteName: 'MyBox.eco',
      images: article.featured_image_url ? [article.featured_image_url] : [],
      type: 'article',
      ...(article.published_at && {
        publishedTime: new Date(article.published_at).toISOString(),
      }),
      ...(article.updated_at && {
        modifiedTime: new Date(article.updated_at).toISOString(),
      }),
      authors: ['MyBox'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.featured_image_url ? [article.featured_image_url] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations('blog')
  const supabase = await createClient()

  // Fetch article with all relations
  const { data: article } = await supabase
    .from('articles')
    .select(`
      id,
      slug,
      featured_image_url,
      published_at,
      updated_at,
      category_id,
      article_translations(locale, title, excerpt, content, seo_description),
      categories(slug, category_translations(locale, name)),
      profiles(full_name, email),
      article_tags(tags(id, name, slug))
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!article) {
    notFound()
  }

  // Get translation for current locale
  const translation = article.article_translations?.find(
    (t: { locale: string }) => t.locale === locale
  ) || article.article_translations?.[0]

  if (!translation) {
    notFound()
  }

  // Get category info
  const categoryTranslation = article.categories?.category_translations?.find(
    (t: { locale: string }) => t.locale === locale
  ) || article.categories?.category_translations?.[0]

  const category = article.categories && categoryTranslation
    ? { slug: article.categories.slug, name: categoryTranslation.name }
    : null

  // Get tags
  const tags = article.article_tags?.map((at: { tags: { id: string; name: string; slug: string } | null }) => at.tags).filter(Boolean) || []

  // Calculate reading time - content is stored as JSON, stringify if needed
  const contentString = typeof translation.content === 'string'
    ? translation.content
    : JSON.stringify(translation.content || '')
  const readingTime = estimateReadingTime(contentString)

  // Fetch related articles (same category, excluding current)
  let relatedArticles: {
    id: string
    slug: string
    featured_image_url: string | null
    published_at: string | null
    article_translations: { locale: string; title: string; excerpt: string | null }[]
    categories: { slug: string; category_translations: { locale: string; name: string }[] } | null
  }[] = []

  if (article.category_id) {
    const { data: related } = await supabase
      .from('articles')
      .select(`
        id,
        slug,
        featured_image_url,
        published_at,
        article_translations(locale, title, excerpt),
        categories(slug, category_translations(locale, name))
      `)
      .eq('status', 'published')
      .eq('category_id', article.category_id)
      .neq('id', article.id)
      .order('published_at', { ascending: false })
      .limit(3)

    relatedArticles = related || []
  }

  // If not enough related articles from same category, get latest
  if (relatedArticles.length < 3) {
    const { data: latest } = await supabase
      .from('articles')
      .select(`
        id,
        slug,
        featured_image_url,
        published_at,
        article_translations(locale, title, excerpt),
        categories(slug, category_translations(locale, name))
      `)
      .eq('status', 'published')
      .neq('id', article.id)
      .not('id', 'in', `(${relatedArticles.map(a => a.id).join(',') || 'null'})`)
      .order('published_at', { ascending: false })
      .limit(3 - relatedArticles.length)

    if (latest) {
      relatedArticles = [...relatedArticles, ...latest]
    }
  }

  // Build canonical URL for JSON-LD
  const baseUrl = 'https://mybox.eco'
  const canonicalUrl = locale === 'cs'
    ? `${baseUrl}/blog/${slug}`
    : `${baseUrl}/${locale}/blog/${slug}`

  return (
    <>
      {/* JSON-LD Structured Data */}
      <ArticleJsonLd
        title={translation.title}
        description={translation.seo_description || translation.excerpt || ''}
        url={canonicalUrl}
        imageUrl={article.featured_image_url}
        datePublished={article.published_at}
        dateModified={article.updated_at}
        authorName={article.profiles?.full_name}
        categoryName={category?.name}
        locale={locale}
      />

      {/* Hero */}
      <ArticleHero
        title={translation.title}
        excerpt={translation.excerpt}
        featuredImage={article.featured_image_url}
        publishedAt={article.published_at}
        author={article.profiles}
        category={category}
        readingTime={readingTime}
        locale={locale as 'cs' | 'en' | 'de'}
        backLabel={t('backToBlog')}
        readingTimeLabel={t('readingTime')}
      />

      {/* Content + Sidebar */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            {/* Main content */}
            <article className="min-w-0">
              <TipTapRenderer
                content={contentString}
                className="[&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24"
              />

              {/* Author box */}
              {article.profiles && (
                <div className="mt-12 flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-secondary p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 text-lg font-semibold text-green-400">
                    {(article.profiles.full_name || article.profiles.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">{t('author')}</p>
                    <p className="font-medium text-text-primary">
                      {article.profiles.full_name || article.profiles.email.split('@')[0]}
                    </p>
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <ArticleSidebar
                content={contentString}
                tags={tags as { id: string; name: string; slug: string }[]}
                tocLabel={t('tableOfContents')}
                shareLabel={t('share')}
                tagsLabel={t('tags')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <RelatedArticles
          articles={relatedArticles}
          locale={locale as 'cs' | 'en' | 'de'}
          title={t('relatedArticles')}
        />
      )}

      {/* CTA */}
      <CTASection
        heading={t('cta.heading')}
        description={t('cta.description')}
        buttonLabel={t('cta.button')}
        buttonHref="/kontakt"
      />
    </>
  )
}
