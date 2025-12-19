import { setRequestLocale } from 'next-intl/server'
import { ChargingStationsHero } from './ChargingStationsHero'
import { ACDCSelector } from './ACDCSelector'
import { ProductShowcase } from './ProductShowcase'
import { USPSection } from './USPSection'
import { FAQSection } from './FAQSection'

interface ChargingStationsPageProps {
  params: Promise<{ locale: string }>
}

export default async function ChargingStationsPage({ params }: ChargingStationsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      {/* Hero section */}
      <ChargingStationsHero />

      {/* AC DC selector section */}
      <ACDCSelector />

      {/* MyBox Stations section */}
      <ProductShowcase type="mybox" />

      {/* Alpitronic section (reversed layout) */}
      <ProductShowcase type="alpitronic" reverse />

      {/* USP / SEO text section */}
      <USPSection />

      {/* FAQ section */}
      <FAQSection />

      {/* Request quote section - TODO */}

      {/* Newsletter section - TODO */}
    </>
  )
}
