import { setRequestLocale } from 'next-intl/server'
import { HeroVideo, ClientLogos, SolutionsGrid } from '@/components/sections'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      {/* Hero with video background */}
      <HeroVideo videoSrc="/videos/hero-landing.mp4" />

      {/* Client logos carousel */}
      <ClientLogos />

      {/* Solutions grid */}
      <SolutionsGrid />

      {/* More sections coming... */}
    </>
  )
}
