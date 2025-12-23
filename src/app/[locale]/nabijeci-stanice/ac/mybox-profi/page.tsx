import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { getProductBySlug } from '@/lib/transformers/product'
import { ProductPageContent } from '@/components/product'

export default async function MyBoxProfiPage() {
  const locale = (await getLocale()) as 'cs' | 'en' | 'de'
  const product = await getProductBySlug('mybox-profi', locale)

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
