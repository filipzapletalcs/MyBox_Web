'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Briefcase, Wrench } from 'lucide-react'

interface InquiryTypeSelectorProps {
  selected: 'sales' | 'service'
  onChange: (type: 'sales' | 'service') => void
}

export function InquiryTypeSelector({ selected, onChange }: InquiryTypeSelectorProps) {
  const t = useTranslations('contactPage')

  const types = [
    {
      id: 'sales' as const,
      icon: Briefcase,
      label: t('form.inquiryType.sales'),
      description: t('form.inquiryType.salesDesc'),
    },
    {
      id: 'service' as const,
      icon: Wrench,
      label: t('form.inquiryType.service'),
      description: t('form.inquiryType.serviceDesc'),
    },
  ]

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-secondary">
        {t('form.inquiryType.label')}
      </label>
      <div className="grid grid-cols-2 gap-4">
        {types.map((type) => {
          const isSelected = selected === type.id
          const Icon = type.icon

          return (
            <motion.button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-5 rounded-2xl border-2 text-left transition-all duration-300
                ${isSelected
                  ? 'border-green-500/50 bg-green-500/5 shadow-[0_0_30px_rgba(74,222,128,0.15)]'
                  : 'border-border-subtle bg-bg-tertiary hover:border-border-default hover:bg-bg-elevated'
                }
              `}
            >
              {/* Selection indicator */}
              <motion.div
                className="absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                animate={{
                  borderColor: isSelected ? 'rgb(74 222 128)' : 'rgb(var(--border-default))',
                  backgroundColor: isSelected ? 'rgb(74 222 128)' : 'transparent',
                }}
                transition={{ duration: 0.2 }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-black"
                  />
                )}
              </motion.div>

              {/* Icon */}
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300
                  ${isSelected ? 'bg-green-500/20 text-green-400' : 'bg-bg-elevated text-text-muted'}
                `}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Label */}
              <h4
                className={`
                  font-semibold text-lg mb-1 transition-colors duration-300
                  ${isSelected ? 'text-green-400' : 'text-text-primary'}
                `}
              >
                {type.label}
              </h4>

              {/* Description */}
              <p className="text-sm text-text-muted leading-relaxed">
                {type.description}
              </p>

              {/* Glow effect when selected */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-green-500/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layoutId="selectedGlow"
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
