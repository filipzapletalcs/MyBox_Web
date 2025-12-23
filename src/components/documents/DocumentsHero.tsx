'use client'

import { motion } from 'framer-motion'
import { FileDown } from 'lucide-react'

interface DocumentsHeroProps {
  title: string
  subtitle: string
}

export function DocumentsHero({ title, subtitle }: DocumentsHeroProps) {
  return (
    <section className="relative bg-gradient-to-b from-bg-secondary to-bg-primary py-8 pt-28 lg:py-12 lg:pt-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-500/10 p-3">
            <FileDown className="h-6 w-6 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary lg:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-base text-text-secondary lg:text-lg">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
