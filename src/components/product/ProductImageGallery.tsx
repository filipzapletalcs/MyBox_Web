'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ProductImageGalleryProps } from '@/types/product'

const easeOut = [0.25, 0.1, 0.25, 1] as const

export function ProductImageGallery({
  images,
  productName,
  className,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setActiveIndex(index)
    }
  }, [images.length])

  const goToPrevious = useCallback(() => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1)
  }, [activeIndex])

  const goToNext = useCallback(() => {
    if (activeIndex < images.length - 1) setActiveIndex(activeIndex + 1)
  }, [activeIndex, images.length])

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    const threshold = 50
    if (info.offset.x > threshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    } else if (info.offset.x < -threshold && activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1)
    }
  }, [activeIndex, images.length])

  if (!images.length) return null

  return (
    <div
      className={cn('relative w-full', className)}
      role="region"
      aria-label={`${productName} galerie`}
    >
      {/* DESKTOP: Carousel s velkými náhledy */}
      <div className="hidden md:block">
        <div className="relative flex items-center gap-4">
          {/* Předchozí obrázek - velký náhled */}
          <button
            onClick={goToPrevious}
            disabled={activeIndex === 0}
            className={cn(
              'relative flex-shrink-0 w-[20%] aspect-[4/5] rounded-2xl overflow-hidden',
              'transition-all duration-300',
              activeIndex === 0
                ? 'opacity-0 pointer-events-none'
                : 'opacity-50 hover:opacity-80 cursor-pointer'
            )}
          >
            {activeIndex > 0 && (
              <Image
                src={images[activeIndex - 1].src}
                alt={images[activeIndex - 1].alt}
                fill
                className="object-contain"
                sizes="20vw"
              />
            )}
          </button>

          {/* Hlavní obrázek */}
          <div className="relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: easeOut }}
                className="absolute inset-0"
              >
                <Image
                  src={images[activeIndex].src}
                  alt={images[activeIndex].alt}
                  fill
                  className="object-contain p-4"
                  sizes="60vw"
                  priority={activeIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Následující obrázek - velký náhled */}
          <button
            onClick={goToNext}
            disabled={activeIndex === images.length - 1}
            className={cn(
              'relative flex-shrink-0 w-[20%] aspect-[4/5] rounded-2xl overflow-hidden',
              'transition-all duration-300',
              activeIndex === images.length - 1
                ? 'opacity-0 pointer-events-none'
                : 'opacity-50 hover:opacity-80 cursor-pointer'
            )}
          >
            {activeIndex < images.length - 1 && (
              <Image
                src={images[activeIndex + 1].src}
                alt={images[activeIndex + 1].alt}
                fill
                className="object-contain"
                sizes="20vw"
              />
            )}
          </button>
        </div>

        {/* Desktop tečky */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === activeIndex
                    ? 'w-8 bg-green-500'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                )}
                aria-label={`Obrázek ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* MOBILE: Swipe galerie s tečkami */}
      <div className="md:hidden">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: easeOut }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
            >
              <Image
                src={images[activeIndex].src}
                alt={images[activeIndex].alt}
                fill
                className={cn(
                  'object-contain p-4 transition-transform',
                  isDragging && 'scale-[0.98]'
                )}
                sizes="100vw"
                priority={activeIndex === 0}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile tečky */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === activeIndex
                    ? 'w-6 bg-green-500'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                )}
                aria-label={`Obrázek ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
