import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { CTASection } from '@/components/sections'

interface TermsPageProps {
  params: Promise<{ locale: string }>
}

const baseUrl = 'https://mybox.eco'

const localizedPaths: Record<string, string> = {
  cs: '/obchodni-podminky',
  en: '/terms-of-service',
  de: '/agb',
}

const seoTitles: Record<string, string> = {
  cs: 'Obchodní podmínky',
  en: 'Terms of Service',
  de: 'Allgemeine Geschäftsbedingungen',
}

const seoDescriptions: Record<string, string> = {
  cs: 'Obchodní podmínky společnosti ELEXIM, a.s. pro nákup nabíjecích stanic MyBox.',
  en: 'Terms of service of ELEXIM, a.s. for the purchase of MyBox charging stations.',
  de: 'Allgemeine Geschäftsbedingungen der ELEXIM, a.s. für den Kauf von MyBox Ladestationen.',
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
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

export default async function TermsPage({ params }: TermsPageProps) {
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
              Platné od: 1. ledna 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="prose prose-neutral dark:prose-invert max-w-3xl">
            <h3>1. Základní ustanovení</h3>
            <p>
              Tyto obchodní podmínky upravují vzájemná práva a povinnosti mezi společností ELEXIM, a.s.
              jako prodávajícím a zákazníkem jako kupujícím při prodeji nabíjecích stanic pro elektromobily
              a souvisejících služeb.
            </p>

            <h3>2. Prodávající</h3>
            <address className="not-italic">
              <strong>ELEXIM, a.s.</strong><br />
              Riegrovo nám. 179, 767 01 Kroměříž<br />
              IČO: 25565044<br />
              DIČ: CZ25565044<br />
              Zapsáno v obchodním rejstříku vedeném Krajským soudem v Brně, spisová značka B 6930
            </address>

            <h3>3. Objednávka a uzavření smlouvy</h3>
            <p>
              Objednávku lze učinit prostřednictvím poptávkového formuláře na webu mybox.eco,
              e-mailem nebo telefonicky. Smlouva je uzavřena okamžikem potvrzení objednávky prodávajícím.
            </p>

            <h3>4. Cena a platební podmínky</h3>
            <p>
              Ceny jsou uvedeny bez DPH, není-li uvedeno jinak. Platba se provádí na základě faktury
              se splatností 14 dní, není-li dohodnuto jinak. U větších zakázek může být vyžadována záloha.
            </p>

            <h3>5. Dodací podmínky</h3>
            <p>
              Dodací lhůta je obvykle 2-4 týdny od potvrzení objednávky v závislosti na skladové dostupnosti.
              Přesný termín dodání bude upřesněn při potvrzení objednávky. Doprava je zajištěna prodávajícím
              na adresu určenou kupujícím.
            </p>

            <h3>6. Záruka a reklamace</h3>
            <p>
              Na nabíjecí stanice MyBox poskytujeme záruku 36 měsíců od data prodeje.
              Reklamace se uplatňuje prostřednictvím servisního oddělení na e-mailu servis@mybox.eco
              nebo telefonicky na +420 739 407 006.
            </p>

            <h3>7. Servis a podpora</h3>
            <p>
              Nabízíme komplexní servisní podporu včetně vzdálené diagnostiky, pravidelné údržby
              a oprav. Servisní podmínky jsou definovány v samostatné servisní smlouvě (SLA).
            </p>

            <h3>8. Odstoupení od smlouvy</h3>
            <p>
              Spotřebitel má právo odstoupit od smlouvy bez udání důvodu do 14 dnů od převzetí zboží.
              Toto právo se nevztahuje na zboží upravené podle přání zákazníka nebo zboží, které bylo
              již nainstalováno.
            </p>

            <h3>9. Ochrana osobních údajů</h3>
            <p>
              Zpracování osobních údajů se řídí naším Prohlášením o ochraně osobních údajů,
              které je dostupné na našich webových stránkách.
            </p>

            <h3>10. Závěrečná ustanovení</h3>
            <p>
              Tyto obchodní podmínky nabývají účinnosti dnem jejich zveřejnění.
              Prodávající si vyhrazuje právo na změnu těchto podmínek.
              Vztahy neupravené těmito podmínkami se řídí právním řádem České republiky.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </>
  )
}
