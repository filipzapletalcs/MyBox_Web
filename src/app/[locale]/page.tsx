import { setRequestLocale } from 'next-intl/server'
import { HeroVideo, ClientLogos, SolutionsGrid } from '@/components/sections'
import { getVideoUrl } from '@/lib/supabase/storage'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      {/* Hero with video background */}
      <HeroVideo videoSrc={getVideoUrl('videos/hero-landing.mp4')} />

      {/* Client logos carousel */}
      <ClientLogos />

      {/* Solutions grid */}
      <SolutionsGrid />

      {/* More sections coming... */}
    </>
  )
}
