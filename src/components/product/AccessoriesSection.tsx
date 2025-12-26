'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import type { AccessoryItem } from '@/types/product'

interface AccessoriesSectionProps {
  accessories: AccessoryItem[]
  title?: string
  subtitle?: string
  productName?: string
  className?: string
}

export function AccessoriesSection({
  accessories,
  title = 'Podle vašich představ',
  subtitle = 'PŘÍSLUŠENSTVÍ',
  productName = 'MyBox',
  className,
}: AccessoriesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeAccessory = accessories[activeIndex]

  return (
    <section className={cn('py-10 md:py-16 lg:py-24 overflow-hidden', className)}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-green-500 font-medium text-sm uppercase tracking-wider mb-3 block">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            {title}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Vnímáme vaše individuální potřeby. K nabíjecím stanicím vám proto dodáme i volitelné příslušenství.
            Finální podobu stanice si přizpůsobíte podle svých představ.
          </p>
        </motion.div>

        {/* Interactive showcase */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-3xl overflow-hidden border border-border-subtle"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeAccessory.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={activeAccessory.image}
                    alt={activeAccessory.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-4 left-4 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
          </motion.div>

          {/* Accessory selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-text-secondary mb-6">
              Příslušenství ke stanici {productName}:
            </p>

            {accessories.map((accessory, index) => (
              <motion.button
                key={accessory.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'w-full text-left p-5 rounded-2xl border transition-all duration-300',
                  'group hover:border-green-500/50',
                  activeIndex === index
                    ? 'bg-bg-secondary border-green-500 shadow-lg shadow-green-500/10'
                    : 'bg-bg-primary border-border-subtle hover:bg-bg-secondary'
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  {/* Index indicator */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                      activeIndex === index
                        ? 'bg-green-500 text-white'
                        : 'bg-bg-tertiary text-text-secondary group-hover:bg-green-500/20 group-hover:text-green-500'
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className={cn(
                        'font-semibold text-lg transition-colors',
                        activeIndex === index
                          ? 'text-green-500'
                          : 'text-text-primary group-hover:text-green-500'
                      )}
                    >
                      {accessory.name}
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">
                      {accessory.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <svg
                    className={cn(
                      'w-5 h-5 transition-all',
                      activeIndex === index
                        ? 'text-green-500 translate-x-0 opacity-100'
                        : 'text-text-tertiary -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.button>
            ))}

            {/* CTA */}
            {activeAccessory.link && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-4"
              >
                <Link
                  href={activeAccessory.link as '/nabijeci-stanice/prislusenstvi'}
                  className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 font-medium transition-colors"
                >
                  Zjistit více o {activeAccessory.name.toLowerCase()}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Thumbnail navigation for mobile */}
        <div className="flex justify-center gap-3 mt-8 lg:hidden">
          {accessories.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all',
                activeIndex === index
                  ? 'bg-green-500 w-8'
                  : 'bg-bg-tertiary hover:bg-green-500/50'
              )}
              aria-label={`Zobrazit příslušenství ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
