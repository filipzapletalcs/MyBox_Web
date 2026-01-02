import { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { CTASection } from '@/components/sections'

interface PrivacyPageProps {
  params: Promise<{ locale: string }>
}

const baseUrl = 'https://mybox.eco'

const localizedPaths: Record<string, string> = {
  cs: '/ochrana-osobnich-udaju',
  en: '/privacy-policy',
  de: '/datenschutz',
}

const seoTitles: Record<string, string> = {
  cs: 'Ochrana osobních údajů',
  en: 'Privacy Policy',
  de: 'Datenschutz',
}

const seoDescriptions: Record<string, string> = {
  cs: 'Informace o zpracování osobních údajů společností ELEXIM, a.s. v souladu s GDPR.',
  en: 'Information about personal data processing by ELEXIM, a.s. in accordance with GDPR.',
  de: 'Informationen zur Verarbeitung personenbezogener Daten durch ELEXIM, a.s. gemäß DSGVO.',
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
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

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('legal')

  return (
    <>
      {/* Header section */}
      <section className="pt-32 pb-12">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-text-primary md:text-5xl">
              {seoTitles[locale]}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="prose prose-neutral dark:prose-invert max-w-3xl">
            <h3>Informace o zpracování osobních údajů</h3>
            <p>
              Společnost ELEXIM, a.s. provádí zpracování Vašich osobních údajů z důvodů oprávněného zájmu,
              nebo pokud je to nezbytné pro splnění smlouvy s Vámi ohledně prodeje zboží (nebo pro provedení
              opatření přijatých před uzavřením takové smlouvy), a dále provádí zpracování Vašich osobních údajů,
              které je nezbytné pro plnění veřejnoprávních povinností této společnosti.
            </p>

            <h3>Totožnost a kontaktní údaje správce</h3>
            <p>
              Správcem Vašich osobních údajů je obchodní společnost ELEXIM, a.s., se sídlem Riegrovo nám. 179,
              767 01 Kroměříž, IČO: 25565044, zápis v obchodním rejstříku: spisová značka B 6930 vedená u Krajského soudu v Brně.
            </p>
            <p>
              Kontaktní údaje správce jsou následující: adresa pro doručování Riegrovo nám. 179, 767 01 Kroměříž,
              adresa elektronické pošty info@elexim.net, telefon +420 573 335 009.
            </p>
            <p>Správce nejmenoval pověřence pro ochranu osobních údajů.</p>

            <h3>Právní základ zpracování osobních údajů</h3>
            <p>
              Právním základem zpracování Vašich osobních údajů je skutečnost, že toto zpracování je nezbytné
              pro účely oprávněných zájmů příslušného správce či třetí strany ve smyslu čl. 6 odst. 1 písm. f)
              Nařízení Evropského parlamentu a Rady 2016/679 o ochraně fyzických osob v souvislosti se zpracováním
              osobních údajů a o volném pohybu těchto údajů (GDPR); nebo je nezbytné pro splnění smlouvy mezi
              Vámi a správcem nebo pro provedení opatření správcem před uzavřením takové smlouvy; nebo je nezbytné
              pro splnění právních povinností, které se na správce vztahují.
            </p>

            <h3>Rozsah a účel zpracování osobních údajů</h3>
            <p>Na základě Vašeho souhlasu správce zpracovává tyto údaje: jméno a příjmení, společnost, e-mail, telefonní číslo.</p>
            <p>Účelem zpracování Vašich osobních údajů je:</p>
            <ul>
              <li>oprávněný zájem správce či třetí strany k plnění požadavku subjektu na zaslání nabídky, odpověď na dotaz nebo komentář článku, zboží či služby</li>
              <li>plnění smlouvy mezi Vámi a správcem, včetně doručení zboží a řešení práv z odpovědnosti za vady</li>
            </ul>
            <p>Ze strany správce nedochází k automatickému individuálnímu rozhodování ve smyslu čl. 22 nařízení.</p>

            <h3>Doba uložení osobních údajů</h3>
            <p>
              Vaše osobní údaje budou zpracovávány po dobu trvání účinků práv a povinností ze smlouvy a dále
              po dobu nutnou pro účely archivování podle příslušných obecně závazných právních předpisů,
              nejdéle však po dobu stanovenou obecně závaznými právními předpisy; nebo po dobu 3 let.
            </p>

            <h3>Další příjemci osobních údajů</h3>
            <p>
              Dalšími příjemci Vašich osobních údajů budou zasílatelské společnosti a jiné osoby podílející se
              na dodání zboží či služeb, a osoby zajišťující pro správce technické služby související s provozem
              e-shopu, včetně provozu software a ukládání dat.
            </p>
            <p>
              Správce nemá v úmyslu předat Vaše osobní údaje do třetí země (do země mimo EU) nebo mezinárodní organizaci.
            </p>

            <h3>Práva subjektu údajů</h3>
            <p>
              Za podmínek stanovených v nařízení máte právo požadovat od správce přístup k Vašim osobním údajům,
              právo na opravu nebo výmaz Vašich osobních údajů, popřípadě omezení jejich zpracování, právo vznést
              námitku proti zpracování Vašich osobních údajů a dále právo na přenositelnost Vašich osobních údajů.
            </p>
            <p>
              Pokud byste se domníval(a), že zpracováním Vašich osobních údajů bylo porušeno či je porušováno nařízení,
              máte mimo jiné právo podat stížnost u dozorového úřadu.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </>
  )
}
