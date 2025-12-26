'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button, Input, Textarea } from '@/components/ui'
import { Send, CheckCircle, Building2, Phone, Mail } from 'lucide-react'

const formSchema = z.object({
  company: z.string().min(2, 'Zadejte název firmy'),
  name: z.string().min(2, 'Zadejte jméno'),
  email: z.string().email('Zadejte platný email'),
  phone: z.string().optional(),
  stationCount: z.string().optional(),
  message: z.string().min(10, 'Zpráva musí mít alespoň 10 znaků'),
})

type FormData = z.infer<typeof formSchema>

export interface InquiryFormSectionProps {
  heading?: string
  subheading?: string
  className?: string
}

export function InquiryFormSection({
  heading = 'Nezávazná poptávka',
  subheading = 'Vyplňte formulář a my vás budeme kontaktovat do 24 hodin',
  className,
}: InquiryFormSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      // Here you would send the form data to your API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          type: 'corporate_inquiry',
        }),
      })

      if (!response.ok) {
        throw new Error('Chyba při odesílání')
      }

      setIsSubmitted(true)
      reset()
    } catch (error) {
      alert('Něco se pokazilo. Zkuste to prosím znovu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={containerRef} className={cn('py-20 md:py-28', className)}>
      <div className="container-custom">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1">
              <Mail className="h-3 w-3 text-green-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-green-400">
                Kontakt
              </span>
            </div>

            <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl">
              {heading}
            </h2>

            <p className="mb-8 text-lg text-text-secondary">
              {subheading}
            </p>

            {/* Contact info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-secondary/50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <Phone className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-text-muted">Telefon</div>
                  <a
                    href="tel:+420123456789"
                    className="text-lg font-medium text-text-primary hover:text-green-400"
                  >
                    +420 123 456 789
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-secondary/50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <Mail className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-text-muted">Email</div>
                  <a
                    href="mailto:firmy@mybox.eco"
                    className="text-lg font-medium text-text-primary hover:text-green-400"
                  >
                    firmy@mybox.eco
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-secondary/50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <Building2 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-text-muted">Adresa</div>
                  <div className="text-lg font-medium text-text-primary">
                    MyBox s.r.o., Praha
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {isSubmitted ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/5 p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-text-primary">
                  Děkujeme za poptávku!
                </h3>
                <p className="mb-6 text-text-secondary">
                  Budeme vás kontaktovat do 24 hodin.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setIsSubmitted(false)}
                >
                  Odeslat další poptávku
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-2xl border border-border-subtle bg-bg-secondary/50 p-6 md:p-8"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Název firmy *"
                    {...register('company')}
                    error={errors.company?.message}
                    placeholder="Vaše firma s.r.o."
                  />
                  <Input
                    label="Kontaktní osoba *"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="Jan Novák"
                  />
                  <Input
                    label="Email *"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="jan@firma.cz"
                  />
                  <Input
                    label="Telefon"
                    type="tel"
                    {...register('phone')}
                    placeholder="+420 123 456 789"
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Předpokládaný počet stanic"
                      {...register('stationCount')}
                      placeholder="např. 5-10"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Textarea
                      label="Zpráva *"
                      {...register('message')}
                      error={errors.message?.message}
                      placeholder="Popište vaše požadavky..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full bg-green-500 text-white hover:bg-green-400"
                    isLoading={isSubmitting}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Odeslat poptávku
                  </Button>
                </div>

                <p className="mt-4 text-center text-xs text-text-muted">
                  Odesláním souhlasíte se zpracováním osobních údajů.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
