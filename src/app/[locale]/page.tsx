import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <HomePageContent />
}

function HomePageContent() {
  const t = useTranslations('homepage')

  return (
    <>
      {/* Temporary placeholder - will be replaced with actual sections */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center bg-bg-primary px-6 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-text-primary md:text-6xl lg:text-7xl">
          {t('hero.title')}
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-text-secondary md:text-xl">
          {t('hero.subtitle')}
        </p>
        <button className="rounded-full bg-green-500 px-8 py-4 text-lg font-semibold text-black transition-all hover:bg-green-400 hover:scale-105">
          {t('hero.cta')}
        </button>
      </section>
    </>
  )
}
