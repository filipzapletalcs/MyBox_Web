import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { getProductBySlug } from '@/lib/transformers/product'
import { ProductPageContent } from '@/components/product'

const PRODUCT_SLUG = 'mybox-home'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const product = await getProductBySlug(PRODUCT_SLUG, locale as 'cs' | 'en' | 'de')

  if (!product) {
    return {
      title: 'Produkt nenalezen',
    }
  }

  const title = `${product.name} | ${product.power}`
  const description = product.tagline || product.description?.slice(0, 160)
  const ogImage = product.heroImage || product.gallery?.[0]?.src

  return {
    title,
    description,
    keywords: [
      product.name,
      product.brand,
      'nabíjecí stanice',
      'elektromobil',
      'AC nabíjení',
      product.power,
      'MyBox',
      'ELEXIM',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
      siteName: 'MyBox.eco',
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    alternates: {
      canonical: `https://mybox.eco/nabijeci-stanice/ac/${PRODUCT_SLUG}`,
      languages: {
        cs: `https://mybox.eco/nabijeci-stanice/ac/${PRODUCT_SLUG}`,
        en: `https://mybox.eco/en/charging-stations/ac/${PRODUCT_SLUG}`,
        de: `https://mybox.eco/de/ladestationen/ac/${PRODUCT_SLUG}`,
      },
    },
  }
}

export default async function MyBoxHomePage() {
  const locale = (await getLocale()) as 'cs' | 'en' | 'de'
  const product = await getProductBySlug(PRODUCT_SLUG, locale)

  if (!product) {
    notFound()
  }

  return (
    <ProductPageContent
      product={product}
      basePath="/nabijeci-stanice/ac"
      categoryName="AC stanice"
    />
  )
}
