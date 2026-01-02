import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Locale } from '@/config/locales'

/**
 * Cached query for fetching a single article by slug
 * Uses React cache() for request-level deduplication
 */
export const getArticleBySlug = cache(async (slug: string, locale: Locale) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select(
      `
      id,
      slug,
      featured_image_url,
      published_at,
      status,
      view_count,
      created_at,
      updated_at,
      article_translations!inner(
        locale,
        title,
        excerpt,
        content,
        seo_title,
        seo_description
      ),
      categories(
        id,
        slug,
        category_translations(locale, name)
      ),
      profiles(
        id,
        full_name,
        email,
        avatar_url
      ),
      article_tags(
        tags(id, slug, name)
      )
    `
    )
    .eq('slug', slug)
    .eq('article_translations.locale', locale)
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    return null
  }

  return data
})

/**
 * Cached query for fetching published articles list
 */
export const getPublishedArticles = cache(async (locale: Locale, limit?: number) => {
  const supabase = await createClient()

  let query = supabase
    .from('articles')
    .select(
      `
      id,
      slug,
      featured_image_url,
      published_at,
      article_translations!inner(
        locale,
        title,
        excerpt
      ),
      categories(
        id,
        slug,
        category_translations(locale, name)
      )
    `
    )
    .eq('status', 'published')
    .eq('article_translations.locale', locale)
    .order('published_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return data
})

/**
 * Cached query for fetching articles by category
 */
export const getArticlesByCategory = cache(
  async (categorySlug: string, locale: Locale, limit?: number) => {
    const supabase = await createClient()

    let query = supabase
      .from('articles')
      .select(
        `
      id,
      slug,
      featured_image_url,
      published_at,
      article_translations!inner(
        locale,
        title,
        excerpt
      ),
      categories!inner(
        id,
        slug,
        category_translations(locale, name)
      )
    `
      )
      .eq('status', 'published')
      .eq('article_translations.locale', locale)
      .eq('categories.slug', categorySlug)
      .order('published_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching articles by category:', error)
      return []
    }

    return data
  }
)

/**
 * Cached query for fetching all categories with article counts
 */
export const getCategoriesWithCounts = cache(async (locale: Locale) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select(
      `
      id,
      slug,
      category_translations!inner(locale, name),
      articles(count)
    `
    )
    .eq('category_translations.locale', locale)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
})

/**
 * Type exports for use in components
 */
export type ArticleDetail = NonNullable<Awaited<ReturnType<typeof getArticleBySlug>>>
export type ArticleListItem = Awaited<ReturnType<typeof getPublishedArticles>>[number]
export type CategoryWithCount = Awaited<ReturnType<typeof getCategoriesWithCounts>>[number]
