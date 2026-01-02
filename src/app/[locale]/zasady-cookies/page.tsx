import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { CTASection } from '@/components/sections'

interface CookiesPageProps {
  params: Promise<{ locale: string }>
}

const baseUrl = 'https://mybox.eco'

const localizedPaths: Record<string, string> = {
  cs: '/zasady-cookies',
  en: '/cookie-policy',
  de: '/cookie-richtlinie',
}

const seoTitles: Record<string, string> = {
  cs: 'Zásady cookies',
  en: 'Cookie Policy',
  de: 'Cookie-Richtlinie',
}

const seoDescriptions: Record<string, string> = {
  cs: 'Informace o používání cookies na webu MyBox.eco a jak je spravovat.',
  en: 'Information about cookie usage on MyBox.eco and how to manage them.',
  de: 'Informationen zur Verwendung von Cookies auf MyBox.eco und deren Verwaltung.',
}

export async function generateMetadata({ params }: CookiesPageProps): Promise<Metadata> {
  const { locale } = await params

  const title = seoTitles[locale]
  const description = seoDescriptions[locale]
  const canonicalUrl = `${baseUrl}${localizedPaths[locale]}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        cs: `${baseUrl}${localizedPaths.cs}`,
        en: `${baseUrl}${localizedPaths.en}`,
        de: `${baseUrl}${localizedPaths.de}`,
      },
    },
    openGraph: {
      title: `${title} | MyBox.eco`,
      description,
      url: canonicalUrl,
      siteName: 'MyBox.eco',
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      {/* Header section */}
      <section className="pt-32 pb-12">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-text-primary md:text-5xl">
              {seoTitles[locale]}
            </h1>
            <p className="mt-4 text-text-secondary">
              Poslední aktualizace: Leden 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="prose prose-neutral dark:prose-invert max-w-3xl">
            <h3>1. Úvod</h3>
            <p>
              Naše webové stránky https://mybox.eco používají cookies a další související technologie.
              Cookies také vkládají třetí strany, které jsme zapojili. V níže uvedeném dokumentu vás
              informujeme o používání cookies na našem webu.
            </p>

            <h3>2. Co jsou soubory cookies?</h3>
            <p>
              Soubor cookie je malý jednoduchý soubor, který je odeslán spolu se stránkami tohoto webu
              a uložen prohlížečem na pevný disk počítače nebo jiného zařízení. Informace v nich uložené
              mohou být vráceny našim serverům nebo serverům příslušných třetích stran během následné návštěvy.
            </p>

            <h3>3. Co jsou skripty?</h3>
            <p>
              Skript je část programového kódu, který slouží k tomu, aby naše webové stránky fungovaly
              správně a interaktivně. Tento kód je spuštěn na našem serveru nebo na vašem zařízení.
            </p>

            <h3>4. Co je to webový maják?</h3>
            <p>
              Webový maják (nebo pixelová značka) je malý, neviditelný kus textu nebo obrázku na webu,
              který se používá ke sledování provozu na webu.
            </p>

            <h3>5. Typy cookies</h3>

            <h4>5.1 Technické nebo funkční soubory cookies</h4>
            <p>
              Některé soubory cookies zajišťují, že určité části webu fungují správně a že vaše uživatelské
              preference zůstávají známé. Umístěním funkčních souborů cookies usnadňujeme návštěvu našich
              webových stránek. Tyto cookies můžeme umístit bez vašeho souhlasu.
            </p>

            <h4>5.2 Statistické cookies</h4>
            <p>
              Statistické soubory cookies využíváme k optimalizaci webových stránek pro naše uživatele.
              Díky těmto statistickým cookies získáváme přehled o používání našich webových stránek.
              Žádáme vás o povolení k ukládání statistických souborů cookies.
            </p>

            <h4>5.3 Marketingové/Sledovací cookies</h4>
            <p>
              Marketingové/sledovací cookies jsou soubory cookies, které se používají k vytváření uživatelských
              profilů k zobrazování reklamy nebo ke sledování uživatele na tomto webu nebo na několika webech
              pro podobné marketingové účely.
            </p>

            <h3>6. Souhlas</h3>
            <p>
              Když poprvé navštívíte náš web, ukážeme vám vyskakovací okno s vysvětlením o cookies.
              Jakmile kliknete na „Přijmout vše", vyjadřujete svůj souhlas s používáním kategorií souborů
              cookies popsaných v těchto Zásadách cookies.
            </p>

            <h3>7. Povolení/zakázání a odstranění cookies</h3>
            <p>
              Pomocí internetového prohlížeče můžete automaticky nebo ručně mazat soubory cookies.
              Můžete také určit, že některé soubory cookies nemusí být umístěny. Další možností je změnit
              nastavení internetového prohlížeče tak, aby se vám při každém uložení souboru cookies zobrazila zpráva.
            </p>
            <p>
              Vezměte prosím na vědomí, že náš web nemusí fungovat správně, pokud jsou deaktivovány všechny cookies.
            </p>

            <h3>8. Vaše práva</h3>
            <p>Pokud jde o vaše osobní údaje, máte následující práva:</p>
            <ul>
              <li>Právo vědět, proč jsou vaše osobní údaje potřebné a jak dlouho budou uchovány</li>
              <li>Právo na přístup k vašim osobním údajům</li>
              <li>Právo na opravu, výmaz nebo omezení zpracování vašich údajů</li>
              <li>Právo odvolat souhlas</li>
              <li>Právo na přenos vašich údajů</li>
              <li>Právo vznést námitku proti zpracování</li>
            </ul>

            <h3>9. Kontaktní údaje</h3>
            <p>V případě dotazů ohledně cookies nás prosím kontaktujte:</p>
            <address className="not-italic">
              <strong>ELEXIM, a.s.</strong><br />
              Riegrovo nám. 179, 767 01 Kroměříž<br />
              Česká republika<br />
              E-mail: info@elexim.net<br />
              Telefon: +420 573 335 009
            </address>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </>
  )
}
