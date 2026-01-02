'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { HeroSection } from '@/components/sections'
import { Button, ArrowRightIcon } from '@/components/ui'
import {
  ProductImageGallery,
  ColorVariantSlider,
  TechnicalSpecifications,
  ContentSection,
  ProductFeatureShowcase,
  DownloadButton,
  AccessoriesSection,
} from '@/components/product'
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo'
import { getVideoUrl } from '@/lib/supabase/storage'
import type { FullProductData } from '@/types/product'

interface ProductPageContentProps {
  product: FullProductData
  /** Base path for breadcrumbs, e.g. "/nabijeci-stanice/ac" */
  basePath: string
  /** Category name for breadcrumbs, e.g. "AC stanice" */
  categoryName: string
}

export function ProductPageContent({
  product,
  basePath,
  categoryName,
}: ProductPageContentProps) {
  const t = useTranslations('common')
  const baseUrl = 'https://mybox.eco'
  const productUrl = `${baseUrl}${basePath}/${product.slug}`

  return (
    <>
      {/* Structured Data */}
      <ProductJsonLd product={product} url={productUrl} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Domů', url: baseUrl },
          { name: 'Nabíjecí stanice', url: `${baseUrl}/nabijeci-stanice` },
          { name: categoryName, url: `${baseUrl}${basePath}` },
          { name: product.name, url: productUrl },
        ]}
      />

      {/* Hero Section */}
      <HeroSection
        videoSrc={product.heroVideo || getVideoUrl('videos/hero-stations.mp4')}
        height="full"
        align="left"
      >
        <div className="w-full md:max-w-2xl lg:max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {product.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-10 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl"
          >
            {product.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-start"
          >
            <Button asChild size="lg" className="group min-w-[200px]">
              <Link href="/poptavka">
                {t('interested')}
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="min-w-[200px] border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50"
            >
              <a href="#specifikace">{t('technicalSpecs')}</a>
            </Button>
          </motion.div>
        </div>
      </HeroSection>

      {/* Feature Showcase */}
      {product.featurePoints && product.frontImage && (
        <ProductFeatureShowcase
          productImage={product.frontImage}
          productAlt={`${product.name} čelní pohled`}
          features={product.featurePoints}
          className="bg-bg-primary"
        />
      )}

      {/* Product Gallery */}
      <section className="py-6 md:py-10 lg:py-16 bg-bg-primary">
        <div className="container-custom">
          <ProductImageGallery
            images={product.gallery}
            productName={product.name}
          />
        </div>
      </section>

      {/* Color Variants */}
      {product.colorVariants && (
        <section className="py-10 md:py-16 lg:py-24 bg-bg-secondary">
          <div className="container-custom">
            <div className="section-header mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
                Barevné varianty
              </h2>
              <p className="text-lg text-text-secondary">
                Vyberte si z elegantního černého nebo moderního bílého skla
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <ColorVariantSlider
                blackVariant={product.colorVariants.black}
                whiteVariant={product.colorVariants.white}
                productName={product.name}
              />
            </div>
          </div>
        </section>
      )}

      {/* Content Sections (SEO) */}
      {product.contentSections?.map((section, index) => (
        <ContentSection
          key={index}
          title={section.title}
          subtitle={section.subtitle}
          content={section.content}
          image={section.image}
          reverse={index % 2 === 1}
          className={index % 2 === 0 ? 'bg-bg-secondary' : 'bg-bg-primary'}
        />
      ))}

      {/* Accessories Section */}
      {product.accessories && product.accessories.length > 0 && (
        <AccessoriesSection
          accessories={product.accessories}
          productName={product.name}
          className="bg-bg-secondary"
        />
      )}

      {/* Technical Specifications */}
      <TechnicalSpecifications
        specifications={product.specifications}
        className="bg-bg-secondary"
      />

      {/* Bottom CTA */}
      <section className="py-10 md:py-16 lg:py-24 bg-bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Máte zájem o {product.name}?
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Kontaktujte nás pro nezávaznou nabídku nebo více informací
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/kontakt"
              className="inline-flex items-center px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
            >
              Kontaktovat nás
            </Link>
            {product.datasheet && (
              <DownloadButton
                href={product.datasheet.url}
                fileName={product.datasheet.fileName}
                label="Stáhnout datasheet"
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
