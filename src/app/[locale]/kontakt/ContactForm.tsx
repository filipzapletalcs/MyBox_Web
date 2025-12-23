'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FadeIn } from '@/components/animations'
import { Check, Loader2, ChevronDown } from 'lucide-react'

// Form validation schema
const contactFormSchema = z.object({
  company: z.string().min(2, 'Required'),
  contactPerson: z.string().min(2, 'Required'),
  stationType: z.string().min(1, 'Required'),
  location: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  segment: z.string().min(1, 'Required'),
  message: z.string().min(10, 'Min 10 characters'),
  consent: z.boolean().refine((val) => val === true, 'Required'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

// Custom select component for green form
function FormSelect({
  label,
  error,
  options,
  ...props
}: {
  label: string
  error?: string
  options: { value: string; label: string }[]
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="pt-4">
      <div className="relative">
        <select
          {...props}
          className={`
            w-full appearance-none bg-transparent border-b-2
            ${error ? 'border-red-300' : 'border-white/30 focus:border-white'}
            text-white
            py-3 pr-10 text-base
            focus:outline-none transition-colors
            [&>option]:bg-green-600 [&>option]:text-white
          `}
        >
          <option value="" className="text-white/50">{label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
      </div>
      {error && <p className="mt-2 text-sm text-red-200">{error}</p>}
    </div>
  )
}

// Custom input component for green form
function FormInput({
  label,
  error,
  ...props
}: {
  label: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="pt-4">
      <input
        {...props}
        placeholder={label}
        className={`
          w-full bg-transparent border-b-2
          ${error ? 'border-red-300' : 'border-white/30 focus:border-white'}
          text-white placeholder:text-white/50
          py-3 text-base
          focus:outline-none transition-colors
        `}
      />
      {error && <p className="mt-2 text-sm text-red-200">{error}</p>}
    </div>
  )
}

// Custom textarea component for green form
function FormTextarea({
  label,
  error,
  ...props
}: {
  label: string
  error?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="pt-4">
      <textarea
        {...props}
        placeholder={label}
        className={`
          w-full bg-transparent border-b-2
          ${error ? 'border-red-300' : 'border-white/30 focus:border-white'}
          text-white placeholder:text-white/50
          py-3 text-base resize-none min-h-[100px]
          focus:outline-none transition-colors
        `}
      />
      {error && <p className="mt-2 text-sm text-red-200">{error}</p>}
    </div>
  )
}

export function ContactForm() {
  const t = useTranslations('contactPage')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('Form data:', data)
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const contactInfo = {
    salesPhone: '+420 734 597 699',
    salesEmail: 'obchod@mybox.eco',
    servicePhone: '+420 739 407 006',
    serviceEmail: 'servis@mybox.eco',
  }

  // Get translated options
  const stationOptions = [
    { value: 'ac-home', label: t('form.stationOptions.acHome') },
    { value: 'ac-company', label: t('form.stationOptions.acCompany') },
    { value: 'dc', label: t('form.stationOptions.dc') },
    { value: 'service', label: t('form.stationOptions.service') },
    { value: 'other', label: t('form.stationOptions.other') },
  ]

  const locationOptions = [
    { value: 'prague', label: t('form.locationOptions.prague') },
    { value: 'central-bohemia', label: t('form.locationOptions.centralBohemia') },
    { value: 'south-bohemia', label: t('form.locationOptions.southBohemia') },
    { value: 'plzen', label: t('form.locationOptions.plzen') },
    { value: 'karlovy-vary', label: t('form.locationOptions.karlovyVary') },
    { value: 'usti', label: t('form.locationOptions.usti') },
    { value: 'liberec', label: t('form.locationOptions.liberec') },
    { value: 'hradec', label: t('form.locationOptions.hradec') },
    { value: 'pardubice', label: t('form.locationOptions.pardubice') },
    { value: 'vysocina', label: t('form.locationOptions.vysocina') },
    { value: 'south-moravia', label: t('form.locationOptions.southMoravia') },
    { value: 'olomouc', label: t('form.locationOptions.olomouc') },
    { value: 'zlin', label: t('form.locationOptions.zlin') },
    { value: 'moravia-silesia', label: t('form.locationOptions.moraviaSilesia') },
  ]

  const segmentOptions = [
    { value: 'home', label: t('form.segmentOptions.home') },
    { value: 'company', label: t('form.segmentOptions.company') },
    { value: 'developer', label: t('form.segmentOptions.developer') },
    { value: 'municipality', label: t('form.segmentOptions.municipality') },
    { value: 'hospitality', label: t('form.segmentOptions.hospitality') },
    { value: 'retail', label: t('form.segmentOptions.retail') },
    { value: 'fleet', label: t('form.segmentOptions.fleet') },
    { value: 'other', label: t('form.segmentOptions.other') },
  ]

  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 bg-bg-primary overflow-hidden">
      <div className="container-custom px-6 relative z-10">
        {/* Section header */}
        <FadeIn direction="up">
          <div className="section-header mb-20 md:mb-28">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-0 mt-16">
          {/* Left column - Contact Info */}
          <FadeIn direction="up" delay={0.1}>
            <div className="bg-bg-secondary p-8 md:p-12 lg:p-16 h-full">
              {/* Company name */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-text-primary mb-1">ELEXIM, a.s. – Divize MyBox</h2>
                <div className="text-text-secondary text-sm leading-normal mt-3">
                  <span className="block">Hulínská 1814/1b</span>
                  <span className="block">767 01 Kroměříž</span>
                  <span className="block">Česká republika</span>
                </div>
                <div className="mt-4 text-sm text-text-secondary">
                  <span className="block"><span className="font-semibold text-text-primary">IČ:</span> 25565044</span>
                  <span className="block"><span className="font-semibold text-text-primary">DIČ:</span> CZ25565044</span>
                </div>
              </div>

              {/* Sales contact */}
              <div className="mb-8">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-3">
                  {t('info.salesSupport')}
                </p>
                <a
                  href={`tel:${contactInfo.salesPhone.replace(/\s/g, '')}`}
                  className="block text-2xl font-bold text-text-primary hover:text-green-400 transition-colors mb-1"
                >
                  {contactInfo.salesPhone}
                </a>
                <a
                  href={`mailto:${contactInfo.salesEmail}`}
                  className="block text-lg text-text-primary hover:text-green-400 transition-colors"
                >
                  {contactInfo.salesEmail}
                </a>
              </div>

              {/* Service contact */}
              <div className="mb-8">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-3">
                  {t('info.serviceSupport')}
                </p>
                <a
                  href={`tel:${contactInfo.servicePhone.replace(/\s/g, '')}`}
                  className="block text-2xl font-bold text-text-primary hover:text-green-400 transition-colors mb-1"
                >
                  {contactInfo.servicePhone}
                </a>
                <a
                  href={`mailto:${contactInfo.serviceEmail}`}
                  className="block text-lg text-text-primary hover:text-green-400 transition-colors"
                >
                  {contactInfo.serviceEmail}
                </a>
              </div>

              {/* Opening hours */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                    {t('info.openingHours')} (Po–Pá)
                  </p>
                  <p className="text-xl font-bold text-text-primary">8:00–16:30</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                    Servisní doba (Po–Pá)
                  </p>
                  <p className="text-xl font-bold text-text-primary">8:00–16:30</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right column - Form (Green) */}
          <FadeIn direction="up" delay={0.2}>
            <div className="bg-gradient-to-br from-green-500 via-green-500 to-green-600 p-8 md:p-12 lg:p-16 h-full">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('form.title')}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                {/* Company & Contact Person */}
                <div className="grid sm:grid-cols-2 gap-x-6">
                  <FormInput
                    {...register('company')}
                    label={t('form.company')}
                    error={errors.company?.message}
                  />
                  <FormInput
                    {...register('contactPerson')}
                    label={t('form.contactPerson')}
                    error={errors.contactPerson?.message}
                  />
                </div>

                {/* Station Type & Location */}
                <div className="grid sm:grid-cols-2 gap-x-6">
                  <FormSelect
                    {...register('stationType')}
                    label={t('form.stationType')}
                    options={stationOptions}
                    error={errors.stationType?.message}
                  />
                  <FormSelect
                    {...register('location')}
                    label={t('form.location')}
                    options={locationOptions}
                    error={errors.location?.message}
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-x-6">
                  <FormInput
                    {...register('email')}
                    type="email"
                    label={t('form.email')}
                    error={errors.email?.message}
                  />
                  <FormInput
                    {...register('phone')}
                    type="tel"
                    label={t('form.phone')}
                  />
                </div>

                {/* Segment */}
                <FormSelect
                  {...register('segment')}
                  label={t('form.segment')}
                  options={segmentOptions}
                  error={errors.segment?.message}
                />

                {/* Message */}
                <FormTextarea
                  {...register('message')}
                  label={t('form.message')}
                  error={errors.message?.message}
                />

                {/* Consent checkbox */}
                <div className="flex items-start gap-3 pt-6">
                  <input
                    {...register('consent')}
                    type="checkbox"
                    id="consent"
                    className="mt-0.5 w-5 h-5 rounded border-2 border-white/30 bg-transparent checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-sm text-white/80 leading-snug cursor-pointer">
                    {t('form.consent')}
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-sm text-red-200">{errors.consent.message}</p>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    whileHover={{ scale: isSubmitting || isSuccess ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting || isSuccess ? 1 : 0.98 }}
                    className={`
                      px-8 py-4 rounded-none font-semibold text-base uppercase tracking-wider
                      flex items-center justify-center gap-3 transition-all duration-300
                      ${isSuccess
                        ? 'bg-emerald-700 text-white cursor-default'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                      }
                      disabled:opacity-70 disabled:cursor-not-allowed
                    `}
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3"
                        >
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t('form.sending')}
                        </motion.div>
                      ) : isSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-3"
                        >
                          <Check className="w-5 h-5" />
                          {t('form.success')}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {t('form.submit')}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
