'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui'
import { HeroSection } from './HeroSection'

// Animated arrow icon
const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

interface HeroVideoProps {
  videoSrc?: string
  posterSrc?: string
}

export function HeroVideo({
  videoSrc = '/videos/hero.mp4',
  posterSrc
}: HeroVideoProps) {
  const t = useTranslations('homepage.hero')

  return (
    <HeroSection
      videoSrc={videoSrc}
      posterSrc={posterSrc}
      height="full"
      align="left"
    >
      {/* Content wrapper - limited width on desktop */}
      <div className="w-full md:max-w-2xl lg:max-w-3xl">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="block">{t('title')}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-10 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-start"
        >
          <Button asChild size="lg" className="group min-w-[200px]">
            <Link href="/poptavka">
              {t('cta')}
              <ArrowIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            asChild
            variant="secondary"
            size="lg"
            className="min-w-[200px] border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50"
          >
            <Link href="/nabijeci-stanice">
              {t('ctaSecondary')}
            </Link>
          </Button>
        </motion.div>
      </div>
    </HeroSection>
  )
}
