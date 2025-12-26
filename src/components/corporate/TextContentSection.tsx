'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TextContentSectionProps {
  heading?: string
  content?: string | Record<string, unknown>
  centered?: boolean
  className?: string
}

export function TextContentSection({
  heading,
  content,
  centered = false,
  className,
}: TextContentSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Parse content - could be HTML string or TipTap JSON
  const contentHtml = typeof content === 'string' ? content : null

  return (
    <section ref={containerRef} className={cn('py-16 md:py-24', className)}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className={cn('mx-auto max-w-3xl', centered && 'text-center')}
        >
          {heading && (
            <h2 className="mb-6 text-2xl font-bold text-text-primary md:text-3xl lg:text-4xl">
              {heading}
            </h2>
          )}

          {contentHtml && (
            <div
              className={cn(
                'prose prose-lg prose-invert max-w-none',
                // Custom prose styling
                'prose-headings:text-text-primary prose-headings:font-semibold',
                'prose-p:text-text-secondary prose-p:leading-relaxed',
                'prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline',
                'prose-strong:text-text-primary prose-strong:font-semibold',
                'prose-ul:text-text-secondary prose-ol:text-text-secondary',
                'prose-li:marker:text-green-500'
              )}
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          )}
        </motion.div>
      </div>
    </section>
  )
}
