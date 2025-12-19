'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button, ArrowRightIcon } from '@/components/ui'
import { HeroSection } from '@/components/sections'

export function ChargingStationsHero() {
  const t = useTranslations('chargingStations.hero')

  return (
    <HeroSection
      videoSrc="/videos/hero-stations.mp4"
      height="full"
      align="center"
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl xl:text-8xl"
      >
        {t('title')}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/80 md:text-xl lg:text-2xl"
        style={{ textWrap: 'balance' }}
      >
        {t('subtitle')}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <Button asChild size="lg" className="group min-w-[200px]">
          <Link href="/poptavka">
            {t('cta')}
            <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>

        <Button
          asChild
          variant="secondary"
          size="lg"
          className="min-w-[200px] border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50"
        >
          <Link href="/nabijeci-stanice/ac">
            {t('ctaSecondary')}
          </Link>
        </Button>
      </motion.div>
    </HeroSection>
  )
}
