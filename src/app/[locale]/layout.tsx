import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'

import { halisR } from '@/lib/fonts'
import { routing } from '@/i18n/routing'
import { Providers } from '@/components/providers'
import { Header, Footer } from '@/components/layout'
import { TooltipProvider } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages()
  const t = messages.metadata as Record<string, string>

  return {
    title: {
      default: t.title,
      template: `%s | MyBox.eco`,
    },
    description: t.description,
    metadataBase: new URL('https://mybox.eco'),
    alternates: {
      canonical: '/',
      languages: {
        cs: '/',
        en: '/en',
        de: '/de',
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: 'https://mybox.eco',
      siteName: 'MyBox.eco',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
          color: '#4ade80',
        },
      ],
    },
    manifest: '/site.webmanifest',
  }
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages for the locale
  const messages = await getMessages()

  // Fetch company details for footer
  const supabase = await createClient()
  const { data: companyDetails } = await supabase
    .from('company_details')
    .select('*')
    .single()

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${halisR.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <TooltipProvider>
              <Header />
              <main className="min-h-screen bg-transparent">{children}</main>
              <Footer companyDetails={companyDetails} />
            </TooltipProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
