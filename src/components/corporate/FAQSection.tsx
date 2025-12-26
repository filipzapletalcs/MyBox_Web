'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export interface FAQSectionProps {
  heading?: string
  subheading?: string
  items?: FAQItem[]
  className?: string
}

function FAQAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FAQItem
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        'border-b border-border-subtle transition-colors duration-200',
        isOpen && 'border-green-500/30'
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            'pr-4 text-lg font-medium transition-colors duration-200',
            isOpen ? 'text-green-400' : 'text-text-primary'
          )}
        >
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200',
            isOpen ? 'bg-green-500/10 text-green-400' : 'bg-bg-tertiary text-text-muted'
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-12 text-text-secondary">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQSection({
  heading = 'Časté dotazy',
  subheading,
  items,
  className,
}: FAQSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Default FAQ items if none provided
  const displayItems = items || [
    {
      question: 'Jak dlouho trvá instalace nabíjecí stanice?',
      answer: 'Standardní instalace trvá 1-2 dny. U větších projektů s více stanicemi počítejte s delší dobou realizace, kterou vám upřesníme při konzultaci.',
    },
    {
      question: 'Jaké jsou provozní náklady?',
      answer: 'Provozní náklady zahrnují spotřebu elektřiny a případný servisní paušál. Díky chytrému řízení nabíjení můžete využít výhodné noční tarify.',
    },
    {
      question: 'Lze využít dotace na nabíjecí infrastrukturu?',
      answer: 'Ano, existují dotační programy pro firemní nabíjecí infrastrukturu. Pomůžeme vám s přípravou žádosti a potřebnou dokumentací.',
    },
    {
      question: 'Jak funguje účtování zaměstnancům?',
      answer: 'Systém automaticky eviduje spotřebu každého uživatele. Můžete nastavit různé tarify, limity nebo nabíjení zdarma jako benefit.',
    },
  ]

  return (
    <section ref={containerRef} className={cn('py-20 md:py-28', className)}>
      <div className="container-custom">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1"
            >
              <HelpCircle className="h-3 w-3 text-green-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-green-400">
                FAQ
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold text-text-primary md:text-4xl"
            >
              {heading}
            </motion.h2>

            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-lg text-text-secondary"
              >
                {subheading}
              </motion.p>
            )}
          </div>

          {/* Accordion */}
          <div className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-bg-secondary/30 px-6">
            {displayItems.map((item, index) => (
              <FAQAccordionItem
                key={index}
                item={item}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
