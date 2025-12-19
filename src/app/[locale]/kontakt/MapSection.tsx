'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui'
import { FadeIn } from '@/components/animations'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'

// Company location coordinates
const LOCATION = {
  lat: 49.2985,
  lng: 17.3933,
  address: 'Hulínská 1814/1b, 767 01 Kroměříž',
}

// Google Maps embed URL with dark styling
const MAPS_EMBED_URL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2607.5!2d${LOCATION.lng}!3d${LOCATION.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4713a6c2a8b5a5a5%3A0x0!2sHul%C3%ADnsk%C3%A1%201814%2F1b%2C%20767%2001%20Krom%C4%9B%C5%99%C3%AD%C5%BE!5e0!3m2!1scs!2scz!4v1700000000000!5m2!1scs!2scz`

// Direct Google Maps link for navigation
const MAPS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${LOCATION.lat},${LOCATION.lng}`

export function MapSection() {
  const t = useTranslations('contactPage')

  return (
    <section id="map" className="relative bg-bg-primary overflow-hidden">
      {/* Section header */}
      <div className="container-custom px-6 py-12 md:py-16">
        <FadeIn direction="up">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              {t('map.title')}
            </h2>
            <p className="text-text-secondary">
              {t('map.subtitle')}
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Map container */}
      <FadeIn direction="up" delay={0.2}>
        <div className="relative h-[400px] md:h-[500px]">
          {/* Map iframe */}
          <div className="absolute inset-0 grayscale-[0.3] contrast-[1.05]">
            <iframe
              src={MAPS_EMBED_URL}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MyBox Location"
            />
          </div>

          {/* Subtle top gradient for header transition */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-bg-primary/30 to-transparent pointer-events-none" />

          {/* Address overlay card */}
          <div className="absolute bottom-8 left-6 right-6 md:left-auto md:right-8 md:max-w-sm pointer-events-auto">
            <Card variant="glass" padding="md" radius="xl" className="backdrop-blur-xl">
              <div className="flex items-start gap-4">
                {/* Pin icon with pulse animation */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-400" />
                  </div>
                  {/* Pulse effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-green-500/20"
                    animate={{
                      scale: [1, 1.4, 1.4],
                      opacity: [0.5, 0, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                </div>

                {/* Address */}
                <div className="flex-1">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    {t('map.ourAddress')}
                  </p>
                  <p className="font-semibold text-text-primary leading-snug">
                    {LOCATION.address}
                  </p>
                </div>
              </div>

              {/* Quick action buttons */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-border-subtle">
                <motion.a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                    bg-green-500 text-black font-semibold text-sm
                    hover:bg-green-400 transition-colors
                  "
                >
                  <Navigation className="w-4 h-4" />
                  {t('map.getDirections')}
                </motion.a>

                <motion.a
                  href={`https://www.google.com/maps/search/?api=1&query=${LOCATION.lat},${LOCATION.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                    bg-bg-tertiary text-text-primary font-semibold text-sm
                    hover:bg-bg-elevated transition-colors border border-border-subtle
                  "
                >
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </div>
            </Card>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-green-500/30 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-green-500/30 rounded-tr-lg pointer-events-none" />
        </div>
      </FadeIn>
    </section>
  )
}
