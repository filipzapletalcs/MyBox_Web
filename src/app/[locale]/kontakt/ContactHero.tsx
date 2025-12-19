'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui'

// Floating orb component for background decoration
const FloatingOrb = ({
  className,
  delay = 0,
  duration = 20
}: {
  className: string
  delay?: number
  duration?: number
}) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -30, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
)

export function ContactHero() {
  const t = useTranslations('contactPage')

  return (
    <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-bg-primary pt-32 pb-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-secondary" />

      {/* Green glow orbs */}
      <FloatingOrb
        className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-green-500/5 blur-[120px]"
        delay={0}
        duration={25}
      />
      <FloatingOrb
        className="absolute bottom-0 right-[5%] w-[400px] h-[400px] rounded-full bg-green-500/8 blur-[100px]"
        delay={5}
        duration={20}
      />
      <FloatingOrb
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-500/3 blur-[150px]"
        delay={2}
        duration={30}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--border-subtle) 1px, transparent 1px),
                            linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Content */}
      <div className="container-custom relative z-10 px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Badge variant="primary" size="lg" className="mb-6">
            {t('hero.badge')}
          </Badge>
        </motion.div>

        {/* Title with gradient */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-text-primary via-text-primary to-green-400 bg-clip-text text-transparent">
            {t('hero.title')}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          className="mt-12 mx-auto w-24 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      </div>
    </section>
  )
}
