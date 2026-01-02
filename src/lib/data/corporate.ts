import { createClient } from '@/lib/supabase/server'
import type {
  CorporatePageFull,
  CorporateSectionWithTranslations,
  CorporateBenefitWithTranslations,
} from '@/types/corporate'

/**
 * Fetch a corporate page by slug with all related data
 */
export async function getCorporatePage(
  slug: string
): Promise<CorporatePageFull | null> {
  const supabase = await createClient()

  const { data: page, error } = await supabase
    .from('corporate_pages')
    .select(
      `
      *,
      translations:corporate_page_translations(*),
      sections:corporate_sections(
        *,
        translations:corporate_section_translations(*)
      )
    `
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching corporate page:', slug, error)
    return null
  }

  if (!page) {
    console.error('Corporate page not found:', slug)
    return null
  }

  // Sort sections by sort_order
  const sortedSections = (page.sections || []).sort(
    (a: CorporateSectionWithTranslations, b: CorporateSectionWithTranslations) =>
      (a.sort_order ?? 0) - (b.sort_order ?? 0)
  )

  return {
    ...page,
    sections: sortedSections,
  } as CorporatePageFull
}

/**
 * Fetch benefits for a page or section
 */
export async function getCorporateBenefits(
  pageId?: string,
  sectionId?: string
): Promise<CorporateBenefitWithTranslations[]> {
  const supabase = await createClient()

  let query = supabase
    .from('corporate_benefits')
    .select(
      `
      *,
      translations:corporate_benefit_translations(*)
    `
    )
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (pageId) {
    query = query.eq('page_id', pageId)
  }

  if (sectionId) {
    query = query.eq('section_id', sectionId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching benefits:', error)
    return []
  }

  return (data || []) as CorporateBenefitWithTranslations[]
}

/**
 * Fetch all corporate subpages for navigation
 */
export async function getCorporateSubpages(): Promise<
  { slug: string; title: string }[]
> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('corporate_pages')
    .select(
      `
      slug,
      translations:corporate_page_translations(locale, title)
    `
    )
    .eq('page_type', 'subpage')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching subpages:', error)
    return []
  }

  return (data || []).map((page) => ({
    slug: page.slug,
    // Get Czech title as default
    title:
      page.translations?.find((t: { locale: string }) => t.locale === 'cs')
        ?.title ||
      page.translations?.[0]?.title ||
      page.slug,
  }))
}
