import { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { DocumentsHero, DocumentCategorySection } from '@/components/documents'
import { CTASection } from '@/components/sections'
import type { Locale } from '@/lib/utils/documents'

interface DocumentsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: DocumentsPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'documents' })

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | MyBox.eco`,
      description: t('subtitle'),
    },
  }
}

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('documents')
  const tCta = await getTranslations('cta')
  const supabase = await createClient()

  // Fetch categories with translations
  const { data: categories } = await supabase
    .from('document_categories')
    .select(`
      id,
      slug,
      sort_order,
      document_category_translations(locale, name, description)
    `)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Fetch documents with translations
  const { data: documents } = await supabase
    .from('documents')
    .select(`
      id,
      slug,
      category_id,
      file_cs,
      file_en,
      file_de,
      file_size_cs,
      file_size_en,
      file_size_de,
      fallback_locale,
      sort_order,
      document_translations(locale, title, description)
    `)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Group documents by category
  type Category = NonNullable<typeof categories>[number]
  const getCategoryTranslation = (
    cat: Category,
    loc: string
  ) => {
    return (
      cat.document_category_translations?.find((t) => t.locale === loc) ||
      cat.document_category_translations?.[0]
    )
  }

  const labels = {
    file: t('file'),
    size: t('size'),
    download: t('download'),
    unavailable: t('unavailable'),
    preview: t('preview'),
  }

  return (
    <>
      <DocumentsHero title={t('title')} subtitle={t('subtitle')} />

      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {categories?.map((category) => {
            const translation = getCategoryTranslation(category, locale)
            const categoryDocs = documents?.filter(
              (d) => d.category_id === category.id
            ).map(d => ({
              ...d,
              fallback_locale: d.fallback_locale as Locale | null
            }))

            if (!categoryDocs?.length) return null

            return (
              <DocumentCategorySection
                key={category.id}
                title={translation?.name || category.slug}
                description={translation?.description}
                documents={categoryDocs}
                locale={locale as Locale}
                labels={labels}
              />
            )
          })}

          {(!categories || categories.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-text-secondary">{t('noDocuments')}</p>
            </div>
          )}
        </div>
      </section>

      <CTASection
        heading={tCta('heading')}
        description={tCta('description')}
        buttonLabel={tCta('button')}
        buttonHref="/kontakt"
      />
    </>
  )
}
