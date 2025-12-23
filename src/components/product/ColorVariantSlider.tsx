'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ColorVariantSliderProps } from '@/types/product'

export function ColorVariantSlider({
  blackVariant,
  whiteVariant,
  productName,
  className,
}: ColorVariantSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const calculatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return 50
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    return Math.max(0, Math.min(100, percentage))
  }, [])

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return
    setSliderPosition(calculatePosition(clientX))
  }, [isDragging, calculatePosition])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setSliderPosition(calculatePosition(e.clientX))
  }, [calculatePosition])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX)
  }, [handleMove])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    setSliderPosition(calculatePosition(e.touches[0].clientX))
  }, [calculatePosition])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging) {
      setSliderPosition(calculatePosition(e.touches[0].clientX))
    }
  }, [isDragging, calculatePosition])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition(prev => Math.max(0, prev - 5))
    } else if (e.key === 'ArrowRight') {
      setSliderPosition(prev => Math.min(100, prev + 5))
    }
  }, [])

  // Global mouse up handler
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp)
      window.addEventListener('touchend', handleGlobalMouseUp)
    }
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [isDragging])

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Slider Container */}
      <div
        ref={containerRef}
        className={cn(
          'relative aspect-[4/3] w-full overflow-hidden rounded-2xl',
          'bg-bg-secondary border border-border-subtle',
          'cursor-ew-resize select-none'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label={`Porovnání barevných variant ${productName}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPosition)}
      >
        {/* Background Image (Black variant) */}
        <div className="absolute inset-0">
          <Image
            src={blackVariant.image}
            alt={blackVariant.label}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            priority
          />
        </div>

        {/* Foreground Image with clip-path (White variant) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={whiteVariant.image}
            alt={whiteVariant.label}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            priority
          />
        </div>

        {/* Slider Handle */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
          transition={{ duration: 0.15 }}
        >
          {/* Handle Knob */}
          <div
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-10 h-10 rounded-full bg-white shadow-xl',
              'flex items-center justify-center',
              'border-2 border-green-500',
              isDragging && 'ring-4 ring-green-500/30'
            )}
          >
            {/* Arrows */}
            <div className="flex items-center gap-1 text-green-600">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4 z-20">
          <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-medium">
            {blackVariant.label}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 z-20">
          <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-black text-sm font-medium">
            {whiteVariant.label}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-text-secondary">
        Posunutím slideru porovnejte barevné varianty
      </p>
    </div>
  )
}
