'use client'

import { motion } from 'framer-motion'
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
} from '@/components/product'
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo'
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
        videoSrc={product.heroVideo || '/videos/hero-stations.mp4'}
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
                Mám zájem
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="min-w-[200px] border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50"
            >
              <a href="#specifikace">Technické parametry</a>
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

      {/* Product Gallery & Info */}
      <section className="py-16 md:py-24 bg-bg-primary">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <ProductImageGallery
              images={product.gallery}
              productName={product.name}
            />

            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                {product.name}
              </h2>
              <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Dynamic features from product */}
              {product.features && product.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.features.slice(0, 4).map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              {product.datasheet && (
                <DownloadButton
                  href={product.datasheet.url}
                  fileName={product.datasheet.fileName}
                  label="Stáhnout datasheet"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Color Variants */}
      {product.colorVariants && (
        <section className="py-16 md:py-24 bg-bg-secondary">
          <div className="container-custom">
            <div className="section-header mb-10 md:mb-14">
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

      {/* Technical Specifications */}
      <TechnicalSpecifications
        specifications={product.specifications}
        className="bg-bg-secondary"
      />

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 bg-bg-primary">
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
