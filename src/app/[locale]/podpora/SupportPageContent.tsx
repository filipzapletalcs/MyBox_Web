'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import {
  ChevronDown,
  Smartphone,
  Cpu,
  Sun,
  CreditCard,
  Wrench,
  Zap,
  ArrowRight,
  HelpCircle,
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface FAQTranslation {
  id: string
  locale: string
  question: string
  answer: string
}

interface FAQ {
  id: string
  slug: string
  category: string | null
  is_active: boolean
  sort_order: number
  faq_translations: FAQTranslation[]
}

interface SupportPageContentProps {
  locale: string
  faqs: FAQ[]
}

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  app: <Smartphone className="h-6 w-6" />,
  sensor: <Cpu className="h-6 w-6" />,
  solar: <Sun className="h-6 w-6" />,
  rfid: <CreditCard className="h-6 w-6" />,
  installation: <Wrench className="h-6 w-6" />,
  charging: <Zap className="h-6 w-6" />,
  default: <HelpCircle className="h-6 w-6" />,
}

// Category titles and descriptions
const categoryMeta: Record<string, { title: Record<string, string>; description: Record<string, string> }> = {
  app: {
    title: { cs: 'MyBox Aplikace', en: 'MyBox App', de: 'MyBox App' },
    description: {
      cs: 'Stažení, instalace a párování mobilní aplikace',
      en: 'Download, installation and pairing of mobile app',
      de: 'Download, Installation und Kopplung der mobilen App'
    }
  },
  sensor: {
    title: { cs: 'MyBox AC Sensor', en: 'MyBox AC Sensor', de: 'MyBox AC Sensor' },
    description: {
      cs: 'Instalace, nastavení a párování měřicího sensoru',
      en: 'Installation, setup and pairing of the measuring sensor',
      de: 'Installation, Einrichtung und Kopplung des Messsensors'
    }
  },
  solar: {
    title: { cs: 'Solární management', en: 'Solar Management', de: 'Solarmanagement' },
    description: {
      cs: 'Využití přebytků z fotovoltaiky pro nabíjení',
      en: 'Using solar surplus for charging',
      de: 'Nutzung von Solarüberschüssen zum Laden'
    }
  },
  rfid: {
    title: { cs: 'Autorizace nabíjení (RFID)', en: 'Charging Authorization (RFID)', de: 'Ladeautorisierung (RFID)' },
    description: {
      cs: 'Správa přístupu a RFID tagů',
      en: 'Access and RFID tag management',
      de: 'Zugangs- und RFID-Tag-Verwaltung'
    }
  },
  installation: {
    title: { cs: 'Instalace', en: 'Installation', de: 'Installation' },
    description: {
      cs: 'Dotazy k instalaci a zapojení',
      en: 'Installation and wiring questions',
      de: 'Fragen zu Installation und Verkabelung'
    }
  },
  charging: {
    title: { cs: 'Nabíjení', en: 'Charging', de: 'Laden' },
    description: {
      cs: 'Obecné dotazy k nabíjení elektromobilů',
      en: 'General questions about EV charging',
      de: 'Allgemeine Fragen zum Laden von Elektrofahrzeugen'
    }
  },
  default: {
    title: { cs: 'Ostatní', en: 'Other', de: 'Sonstiges' },
    description: {
      cs: 'Další často kladené dotazy',
      en: 'Other frequently asked questions',
      de: 'Andere häufig gestellte Fragen'
    }
  },
}

const uiText = {
  hero: {
    badge: { cs: 'Centrum podpory', en: 'Support Center', de: 'Support-Center' },
    title: { cs: 'Otázky & Odpovědi', en: 'Questions & Answers', de: 'Fragen & Antworten' },
    subtitle: {
      cs: 'Najděte odpovědi na nejčastější dotazy ohledně nabíjecích stanic MyBox, mobilní aplikace a příslušenství.',
      en: 'Find answers to the most frequently asked questions about MyBox charging stations, mobile app and accessories.',
      de: 'Finden Sie Antworten auf die häufigsten Fragen zu MyBox-Ladestationen, mobiler App und Zubehör.'
    },
    searchPlaceholder: {
      cs: 'Hledat v často kladených dotazech...',
      en: 'Search in frequently asked questions...',
      de: 'In häufig gestellten Fragen suchen...'
    }
  },
  noResults: {
    title: { cs: 'Žádné výsledky', en: 'No results', de: 'Keine Ergebnisse' },
    subtitle: {
      cs: 'Pro toto vyhledávání jsme nenašli žádné odpovědi. Zkuste jiný dotaz nebo nás kontaktujte přímo.',
      en: 'No answers found for this search. Try a different query or contact us directly.',
      de: 'Für diese Suche wurden keine Antworten gefunden. Versuchen Sie eine andere Anfrage oder kontaktieren Sie uns direkt.'
    }
  },
  cta: {
    title: { cs: 'Nenašli jste odpověď?', en: "Didn't find an answer?", de: 'Keine Antwort gefunden?' },
    subtitle: {
      cs: 'Náš tým je vám kdykoliv k dispozici. Neváhejte nás kontaktovat s jakýmkoliv dotazem ohledně nabíjecích stanic MyBox.',
      en: 'Our team is always available to help. Feel free to contact us with any questions about MyBox charging stations.',
      de: 'Unser Team steht Ihnen jederzeit zur Verfügung. Kontaktieren Sie uns gerne mit Fragen zu MyBox-Ladestationen.'
    },
    contactButton: { cs: 'Kontaktovat nás', en: 'Contact us', de: 'Kontaktieren Sie uns' },
    docsButton: { cs: 'Stáhnout dokumentaci', en: 'Download documentation', de: 'Dokumentation herunterladen' }
  },
  empty: {
    title: { cs: 'Zatím žádné FAQ', en: 'No FAQ yet', de: 'Noch keine FAQ' },
    subtitle: {
      cs: 'Brzy zde najdete odpovědi na nejčastější dotazy.',
      en: 'Soon you will find answers to the most frequently asked questions here.',
      de: 'Bald finden Sie hier Antworten auf die häufigsten Fragen.'
    }
  }
}

function FAQAccordionItem({ question, answer, isOpen, onToggle }: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-border-primary last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-green-400"
      >
        <span className="pr-4 text-base font-medium text-text-primary">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-text-muted transition-transform duration-200",
            isOpen && "rotate-180 text-green-400"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="pb-5 text-text-secondary leading-relaxed prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQCategorySection({
  category,
  faqs,
  locale
}: {
  category: string
  faqs: FAQ[]
  locale: string
}) {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({})

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const meta = categoryMeta[category] || categoryMeta.default
  const icon = categoryIcons[category] || categoryIcons.default

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border-primary bg-bg-secondary p-6 md:p-8"
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            {meta.title[locale] || meta.title.cs}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {meta.description[locale] || meta.description.cs}
          </p>
        </div>
      </div>
      <div className="divide-y divide-border-primary">
        {faqs.map((faq, index) => {
          const translation = faq.faq_translations.find(t => t.locale === locale)
            || faq.faq_translations.find(t => t.locale === 'cs')
            || faq.faq_translations[0]

          if (!translation) return null

          return (
            <FAQAccordionItem
              key={faq.id}
              question={translation.question}
              answer={translation.answer}
              isOpen={openItems[index] || false}
              onToggle={() => toggleItem(index)}
            />
          )
        })}
      </div>
    </motion.div>
  )
}

export function SupportPageContent({ locale, faqs }: SupportPageContentProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || 'default'
    if (!acc[category]) acc[category] = []
    acc[category].push(faq)
    return acc
  }, {} as Record<string, FAQ[]>)

  // Filter FAQs based on search
  const filteredGroupedFaqs = searchQuery
    ? Object.entries(groupedFaqs).reduce((acc, [category, categoryFaqs]) => {
        const filtered = categoryFaqs.filter(faq => {
          const translation = faq.faq_translations.find(t => t.locale === locale)
            || faq.faq_translations[0]
          if (!translation) return false
          return (
            translation.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            translation.answer.toLowerCase().includes(searchQuery.toLowerCase())
          )
        })
        if (filtered.length > 0) acc[category] = filtered
        return acc
      }, {} as Record<string, FAQ[]>)
    : groupedFaqs

  const hasResults = Object.keys(filteredGroupedFaqs).length > 0

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-bg-primary pt-32 pb-16 md:pt-40 md:pb-24">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-green-500/5 blur-3xl" />
        </div>

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
              <HelpCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">
                {uiText.hero.badge[locale as keyof typeof uiText.hero.badge] || uiText.hero.badge.cs}
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold text-text-primary md:text-5xl lg:text-6xl">
              {uiText.hero.title[locale as keyof typeof uiText.hero.title] || uiText.hero.title.cs}
            </h1>

            <p className="mb-8 text-lg text-text-secondary md:text-xl">
              {uiText.hero.subtitle[locale as keyof typeof uiText.hero.subtitle] || uiText.hero.subtitle.cs}
            </p>

            {/* Search */}
            {faqs.length > 0 && (
              <div className="relative mx-auto max-w-xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder={uiText.hero.searchPlaceholder[locale as keyof typeof uiText.hero.searchPlaceholder] || uiText.hero.searchPlaceholder.cs}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border-primary bg-bg-secondary py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="bg-bg-primary py-16 md:py-24">
        <div className="container-custom">
          {faqs.length === 0 ? (
            <div className="mx-auto max-w-md text-center py-16">
              <HelpCircle className="mx-auto mb-4 h-12 w-12 text-text-muted" />
              <h3 className="mb-2 text-xl font-semibold text-text-primary">
                {uiText.empty.title[locale as keyof typeof uiText.empty.title] || uiText.empty.title.cs}
              </h3>
              <p className="text-text-secondary">
                {uiText.empty.subtitle[locale as keyof typeof uiText.empty.subtitle] || uiText.empty.subtitle.cs}
              </p>
            </div>
          ) : hasResults ? (
            <div className="grid gap-8 lg:grid-cols-2">
              {Object.entries(filteredGroupedFaqs).map(([category, categoryFaqs]) => (
                <FAQCategorySection
                  key={category}
                  category={category}
                  faqs={categoryFaqs}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md text-center py-16">
              <Search className="mx-auto mb-4 h-12 w-12 text-text-muted" />
              <h3 className="mb-2 text-xl font-semibold text-text-primary">
                {uiText.noResults.title[locale as keyof typeof uiText.noResults.title] || uiText.noResults.title.cs}
              </h3>
              <p className="text-text-secondary">
                {uiText.noResults.subtitle[locale as keyof typeof uiText.noResults.subtitle] || uiText.noResults.subtitle.cs}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bg-secondary py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">
              {uiText.cta.title[locale as keyof typeof uiText.cta.title] || uiText.cta.title.cs}
            </h2>
            <p className="mb-8 text-lg text-text-secondary">
              {uiText.cta.subtitle[locale as keyof typeof uiText.cta.subtitle] || uiText.cta.subtitle.cs}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="group">
                <Link href="/kontakt">
                  {uiText.cta.contactButton[locale as keyof typeof uiText.cta.contactButton] || uiText.cta.contactButton.cs}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/dokumenty">
                  {uiText.cta.docsButton[locale as keyof typeof uiText.cta.docsButton] || uiText.cta.docsButton.cs}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
