'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui'
import { Phone, Mail, Clock, MapPin, ExternalLink } from 'lucide-react'

export function ContactInfoCard() {
  const t = useTranslations('contactPage')

  const contacts = [
    {
      icon: Phone,
      label: t('info.salesSupport'),
      value: '+420 734 597 699',
      href: 'tel:+420734597699',
      highlight: true,
    },
    {
      icon: Phone,
      label: t('info.serviceSupport'),
      value: '+420 739 407 006',
      href: 'tel:+420739407006',
    },
    {
      icon: Mail,
      label: t('info.email'),
      value: 'info@mybox.eco',
      href: 'mailto:info@mybox.eco',
    },
  ]

  return (
    <Card variant="glass" padding="lg" radius="xl" className="sticky top-32">
      {/* Header with gradient accent */}
      <div className="relative mb-8">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
        <h3 className="relative text-xl font-semibold text-text-primary mb-2">
          {t('info.title')}
        </h3>
        <p className="text-sm text-text-muted">
          {t('info.subtitle')}
        </p>
      </div>

      {/* Contact items */}
      <div className="space-y-4 mb-8">
        {contacts.map((contact, index) => {
          const Icon = contact.icon
          return (
            <motion.a
              key={index}
              href={contact.href}
              whileHover={{ x: 4 }}
              className={`
                flex items-start gap-4 p-4 rounded-xl transition-all duration-300 group
                ${contact.highlight
                  ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/15'
                  : 'bg-bg-tertiary/50 hover:bg-bg-tertiary border border-transparent'
                }
              `}
            >
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${contact.highlight
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-bg-elevated text-text-muted group-hover:text-green-400'
                  }
                  transition-colors duration-300
                `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                  {contact.label}
                </p>
                <p
                  className={`
                    font-semibold truncate
                    ${contact.highlight ? 'text-green-400' : 'text-text-primary'}
                  `}
                >
                  {contact.value}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          )
        })}
      </div>

      {/* Opening hours */}
      <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-subtle">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center">
            <Clock className="w-5 h-5 text-text-muted" />
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider">
              {t('info.openingHours')}
            </p>
            <p className="font-semibold text-text-primary">
              Po–Pá 8:00–16:30
            </p>
          </div>
        </div>

        {/* Open/Closed indicator */}
        <OpenStatusBadge />
      </div>

      {/* Decorative corner */}
      <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-to-tl from-green-500/5 to-transparent rounded-xl pointer-events-none" />
    </Card>
  )
}

// Dynamic open/closed status badge
function OpenStatusBadge() {
  const t = useTranslations('contactPage')

  // Check if currently open (Mon-Fri, 8:00-16:30 CET)
  const isOpen = () => {
    const now = new Date()
    const pragueTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
    const day = pragueTime.getDay()
    const hours = pragueTime.getHours()
    const minutes = pragueTime.getMinutes()
    const currentMinutes = hours * 60 + minutes

    // Monday-Friday (1-5), 8:00-16:30 (480-990 minutes)
    const isWeekday = day >= 1 && day <= 5
    const isWorkingHours = currentMinutes >= 480 && currentMinutes <= 990

    return isWeekday && isWorkingHours
  }

  const open = isOpen()

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-2.5 h-2.5 rounded-full ${open ? 'bg-emerald-400' : 'bg-red-400'}`}
        animate={{
          scale: open ? [1, 1.2, 1] : 1,
          opacity: open ? [1, 0.7, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: open ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
      <span className={`text-sm font-medium ${open ? 'text-emerald-400' : 'text-red-400'}`}>
        {open ? t('info.open') : t('info.closed')}
      </span>
    </div>
  )
}
