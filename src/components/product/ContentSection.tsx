'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ContentSectionProps } from '@/types/product'

const easeOut = [0.25, 0.1, 0.25, 1] as const

const textVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}

const imageVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}

const reversedTextVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}

const reversedImageVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}

export function ContentSection({
  title,
  subtitle,
  content,
  image,
  reverse = false,
  className,
}: ContentSectionProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container-custom">
        <div
          className={cn(
            'grid gap-12 lg:gap-20 items-center',
            'lg:grid-cols-2'
          )}
        >
          {/* Text Content */}
          <motion.div
            variants={reverse ? reversedTextVariants : textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className={cn(
              'flex flex-col',
              reverse && 'lg:order-2'
            )}
          >
            {subtitle && (
              <span className="text-green-500 font-medium text-sm uppercase tracking-wider mb-3">
                {subtitle}
              </span>
            )}

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              {title}
            </h2>

            <div className="text-base md:text-lg text-text-secondary leading-relaxed space-y-4">
              {typeof content === 'string' ? (
                content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                content
              )}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            variants={reverse ? reversedImageVariants : imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className={cn(
              'relative aspect-[4/3] w-full overflow-hidden rounded-2xl',
              'bg-bg-secondary border border-border-subtle',
              reverse && 'lg:order-1'
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
