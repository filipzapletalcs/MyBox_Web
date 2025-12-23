'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ProductImageGalleryProps } from '@/types/product'

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
}

const transition = {
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1] as const,
}

export function ProductImageGallery({
  images,
  productName,
  className,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const handleThumbnailClick = useCallback((index: number) => {
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }, [activeIndex])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && activeIndex > 0) {
      setDirection(-1)
      setActiveIndex(activeIndex - 1)
    } else if (e.key === 'ArrowRight' && activeIndex < images.length - 1) {
      setDirection(1)
      setActiveIndex(activeIndex + 1)
    }
  }, [activeIndex, images.length])

  if (!images.length) return null

  return (
    <div
      className={cn('flex flex-col gap-4', className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`${productName} galerie`}
    >
      {/* Main Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-bg-secondary border border-border-subtle">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                'relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden',
                'bg-bg-secondary border-2 transition-all duration-200',
                'hover:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-bg-primary',
                index === activeIndex
                  ? 'border-green-500 shadow-[0_0_10px_rgba(22,163,74,0.3)]'
                  : 'border-border-subtle'
              )}
              aria-label={`Zobrazit obrázek ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image counter */}
      <div className="flex justify-center">
        <span className="text-sm text-text-secondary">
          {activeIndex + 1} / {images.length}
        </span>
      </div>
    </div>
  )
}
