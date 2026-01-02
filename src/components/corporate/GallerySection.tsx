'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui'

interface GalleryImage {
  url: string
  alt?: string
}

export interface GallerySectionProps {
  heading?: string
  subheading?: string
  images?: GalleryImage[]
  className?: string
}

export function GallerySection({
  heading = 'Galerie realizací',
  subheading = 'Ukázky našich instalací pro firemní klienty',
  images,
  className,
}: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Default placeholder images if none provided
  const displayImages = images || [
    { url: '/images/gallery/corporate-1.jpg', alt: 'Firemní instalace 1' },
    { url: '/images/gallery/corporate-2.jpg', alt: 'Firemní instalace 2' },
    { url: '/images/gallery/corporate-3.jpg', alt: 'Firemní instalace 3' },
    { url: '/images/gallery/corporate-4.jpg', alt: 'Firemní instalace 4' },
    { url: '/images/gallery/corporate-5.jpg', alt: 'Firemní instalace 5' },
    { url: '/images/gallery/corporate-6.jpg', alt: 'Firemní instalace 6' },
  ]

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const goToPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + displayImages.length) % displayImages.length)
    }
  }
  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % displayImages.length)
    }
  }

  return (
    <>
      <section className={cn('py-20 md:py-28', className)} role="region" aria-label={heading}>
        <div className="container-custom">
          {/* Header */}
          <div className="mb-12 text-center">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1"
            >
              <ImageIcon className="h-3 w-3 text-green-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-green-400">
                Galerie
              </span>
            </div>

            <h2
              className="text-3xl font-bold text-text-primary md:text-4xl"
            >
              {heading}
            </h2>

            {subheading && (
              <p
                className="mx-auto mt-4 max-w-xl text-lg text-text-secondary"
              >
                {subheading}
              </p>
            )}
          </div>

          {/* Gallery grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayImages.map((image, index) => (
              <motion.button
                key={index}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-bg-primary"
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Galerie obrázek ${index + 1}`}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onError={(e) => {
                    // Fallback for missing images
                    e.currentTarget.style.display = 'none'
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />

                {/* Zoom icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Navigation */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                goToPrev()
              }}
              className="absolute left-4 z-10 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 z-10 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] max-w-[85vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayImages[lightboxIndex].url}
                alt={displayImages[lightboxIndex].alt || ''}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              {lightboxIndex + 1} / {displayImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
