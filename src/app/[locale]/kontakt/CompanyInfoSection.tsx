'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Card, Badge } from '@/components/ui'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations'
import { Building2, MapPin, FileText, Phone, Mail, Clock, CreditCard } from 'lucide-react'

export function CompanyInfoSection() {
  const t = useTranslations('contactPage')

  const companyData = {
    name: 'ELEXIM, a.s.',
    division: 'Divize MyBox',
    address: 'Hulínská 1814/1b',
    city: '767 01 Kroměříž',
    country: 'Česká republika',
    ico: '25565044',
    dic: 'CZ25565044',
    salesPhone: '+420 734 597 699',
    servicePhone: '+420 739 407 006',
    email: 'info@mybox.eco',
    hours: 'Po–Pá 8:00–16:30',
  }

  return (
    <section className="relative py-20 md:py-28 bg-bg-secondary overflow-hidden">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--text-muted) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Decorative orb */}
      <motion.div
        className="absolute top-1/2 left-[60%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-green-500/3 blur-[150px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container-custom px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <FadeIn direction="up" delay={0.1}>
            <Badge variant="primary" size="lg" className="mb-6">
              {t('company.badge')}
            </Badge>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {t('company.title')}
            </h2>
          </FadeIn>
        </div>

        {/* Info grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Company Name Card */}
          <FadeIn direction="up" delay={0.3} className="md:col-span-2 lg:col-span-1">
            <Card variant="gradient" padding="lg" radius="xl" className="h-full">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary mb-1">
                    {companyData.name}
                  </h3>
                  <p className="text-green-400 font-medium">
                    {companyData.division}
                  </p>
                </div>
              </div>

              {/* Decorative line */}
              <div className="my-6 h-px bg-gradient-to-r from-border-subtle via-green-500/20 to-border-subtle" />

              {/* IČO / DIČ */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-text-muted" />
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider">IČ</p>
                    <p className="font-semibold text-text-primary">{companyData.ico}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-text-muted" />
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider">DIČ</p>
                    <p className="font-semibold text-text-primary">{companyData.dic}</p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Address Card */}
          <FadeIn direction="up" delay={0.4}>
            <Card variant="glass" padding="lg" radius="xl" className="h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    {t('company.address')}
                  </p>
                  <h4 className="font-semibold text-text-primary">Sídlo společnosti</h4>
                </div>
              </div>

              <div className="space-y-1 text-text-secondary">
                <p className="text-lg font-medium text-text-primary">{companyData.address}</p>
                <p>{companyData.city}</p>
                <p>{companyData.country}</p>
              </div>

              {/* Quick link to map */}
              <motion.a
                href="#map"
                className="
                  mt-6 inline-flex items-center gap-2 text-sm text-green-400
                  hover:text-green-300 transition-colors
                "
                whileHover={{ x: 4 }}
              >
                {t('company.showOnMap')}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
            </Card>
          </FadeIn>

          {/* Contact Card */}
          <FadeIn direction="up" delay={0.5}>
            <Card variant="glass" padding="lg" radius="xl" className="h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    {t('company.contactTitle')}
                  </p>
                  <h4 className="font-semibold text-text-primary">Rychlý kontakt</h4>
                </div>
              </div>

              <div className="space-y-4">
                {/* Sales */}
                <a
                  href={`tel:${companyData.salesPhone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">{t('company.salesSupport')}</p>
                    <p className="font-semibold text-green-400">{companyData.salesPhone}</p>
                  </div>
                </a>

                {/* Service */}
                <a
                  href={`tel:${companyData.servicePhone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary/50 hover:bg-bg-tertiary transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center">
                    <Phone className="w-5 h-5 text-text-muted group-hover:text-green-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">{t('company.serviceSupport')}</p>
                    <p className="font-semibold text-text-primary group-hover:text-green-400 transition-colors">
                      {companyData.servicePhone}
                    </p>
                  </div>
                </a>
              </div>
            </Card>
          </FadeIn>
        </div>

        {/* Opening hours banner */}
        <FadeIn direction="up" delay={0.6} className="mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 p-6 rounded-2xl bg-bg-tertiary/50 border border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">
                  {t('company.openingHours')}
                </p>
                <p className="font-semibold text-text-primary">{companyData.hours}</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-border-subtle" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">E-mail</p>
                <a
                  href={`mailto:${companyData.email}`}
                  className="font-semibold text-text-primary hover:text-green-400 transition-colors"
                >
                  {companyData.email}
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
