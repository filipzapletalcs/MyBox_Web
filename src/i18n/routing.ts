import { defineRouting } from 'next-intl/routing'

export const locales = ['cs', 'en', 'de'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'cs'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames: {
    // Homepage
    '/': '/',

    // === NABÍJECÍ STANICE ===
    '/nabijeci-stanice': {
      cs: '/nabijeci-stanice',
      en: '/charging-stations',
      de: '/ladestationen',
    },
    // AC kategorie
    '/nabijeci-stanice/ac': {
      cs: '/nabijeci-stanice/ac',
      en: '/charging-stations/ac',
      de: '/ladestationen/ac',
    },
    // AC produkty
    '/nabijeci-stanice/ac/mybox-home': {
      cs: '/nabijeci-stanice/ac/mybox-home',
      en: '/charging-stations/ac/mybox-home',
      de: '/ladestationen/ac/mybox-home',
    },
    '/nabijeci-stanice/ac/mybox-plus': {
      cs: '/nabijeci-stanice/ac/mybox-plus',
      en: '/charging-stations/ac/mybox-plus',
      de: '/ladestationen/ac/mybox-plus',
    },
    '/nabijeci-stanice/ac/mybox-profi': {
      cs: '/nabijeci-stanice/ac/mybox-profi',
      en: '/charging-stations/ac/mybox-profi',
      de: '/ladestationen/ac/mybox-profi',
    },
    '/nabijeci-stanice/ac/mybox-post': {
      cs: '/nabijeci-stanice/ac/mybox-post',
      en: '/charging-stations/ac/mybox-post',
      de: '/ladestationen/ac/mybox-post',
    },
    '/nabijeci-stanice/ac/wallbox': {
      cs: '/nabijeci-stanice/ac/wallbox',
      en: '/charging-stations/ac/wallbox',
      de: '/ladestationen/ac/wallbox',
    },
    // DC kategorie
    '/nabijeci-stanice/dc': {
      cs: '/nabijeci-stanice/dc',
      en: '/charging-stations/dc',
      de: '/ladestationen/dc',
    },
    // DC produkty
    '/nabijeci-stanice/dc/alpitronic-hyc400': {
      cs: '/nabijeci-stanice/dc/alpitronic-hyc400',
      en: '/charging-stations/dc/alpitronic-hyc400',
      de: '/ladestationen/dc/alpitronic-hyc400',
    },
    '/nabijeci-stanice/dc/alpitronic-hyc200': {
      cs: '/nabijeci-stanice/dc/alpitronic-hyc200',
      en: '/charging-stations/dc/alpitronic-hyc200',
      de: '/ladestationen/dc/alpitronic-hyc200',
    },
    '/nabijeci-stanice/dc/alpitronic-hyc50': {
      cs: '/nabijeci-stanice/dc/alpitronic-hyc50',
      en: '/charging-stations/dc/alpitronic-hyc50',
      de: '/ladestationen/dc/alpitronic-hyc50',
    },

    // === NABÍJENÍ PRO FIRMY ===
    '/nabijeni-pro-firmy': {
      cs: '/nabijeni-pro-firmy',
      en: '/corporate-charging',
      de: '/unternehmensladung',
    },
    '/nabijeni-pro-firmy/stanice-do-firem': {
      cs: '/nabijeni-pro-firmy/stanice-do-firem',
      en: '/corporate-charging/workplace-stations',
      de: '/unternehmensladung/firmenstationen',
    },
    '/nabijeni-pro-firmy/sprava-fleetu': {
      cs: '/nabijeni-pro-firmy/sprava-fleetu',
      en: '/corporate-charging/fleet-management',
      de: '/unternehmensladung/flottenverwaltung',
    },
    '/nabijeni-pro-firmy/domaci-nabijeni-pro-zamestnance': {
      cs: '/nabijeni-pro-firmy/domaci-nabijeni-pro-zamestnance',
      en: '/corporate-charging/home-charging-employees',
      de: '/unternehmensladung/heimladung-mitarbeiter',
    },
    '/nabijeni-pro-firmy/uctovani-nakladu': {
      cs: '/nabijeni-pro-firmy/uctovani-nakladu',
      en: '/corporate-charging/cost-accounting',
      de: '/unternehmensladung/kostenabrechnung',
    },
    '/nabijeni-pro-firmy/danove-vyhody': {
      cs: '/nabijeni-pro-firmy/danove-vyhody',
      en: '/corporate-charging/tax-benefits',
      de: '/unternehmensladung/steuervorteile',
    },
    '/nabijeni-pro-firmy/esg-a-elektromobilita': {
      cs: '/nabijeni-pro-firmy/esg-a-elektromobilita',
      en: '/corporate-charging/esg-electromobility',
      de: '/unternehmensladung/esg-elektromobilitaet',
    },

    // === ŘEŠENÍ NABÍJENÍ ===
    '/reseni-nabijeni': {
      cs: '/reseni-nabijeni',
      en: '/charging-solutions',
      de: '/ladeloesungen',
    },
    '/reseni-nabijeni/developeri': {
      cs: '/reseni-nabijeni/developeri',
      en: '/charging-solutions/developers',
      de: '/ladeloesungen/entwickler',
    },
    '/reseni-nabijeni/architekti': {
      cs: '/reseni-nabijeni/architekti',
      en: '/charging-solutions/architects',
      de: '/ladeloesungen/architekten',
    },
    '/reseni-nabijeni/logistika': {
      cs: '/reseni-nabijeni/logistika',
      en: '/charging-solutions/logistics',
      de: '/ladeloesungen/logistik',
    },
    '/reseni-nabijeni/energetika': {
      cs: '/reseni-nabijeni/energetika',
      en: '/charging-solutions/energy-sector',
      de: '/ladeloesungen/energiewirtschaft',
    },
    '/reseni-nabijeni/bytove-domy': {
      cs: '/reseni-nabijeni/bytove-domy',
      en: '/charging-solutions/residential',
      de: '/ladeloesungen/wohngebaeude',
    },
    '/reseni-nabijeni/hotely-restaurace': {
      cs: '/reseni-nabijeni/hotely-restaurace',
      en: '/charging-solutions/hospitality',
      de: '/ladeloesungen/hotellerie',
    },

    // === VÝHODY ŘEŠENÍ ===
    '/vyhody-reseni': {
      cs: '/vyhody-reseni',
      en: '/solution-benefits',
      de: '/loesungsvorteile',
    },
    '/vyhody-reseni/kvalita': {
      cs: '/vyhody-reseni/kvalita',
      en: '/solution-benefits/quality',
      de: '/loesungsvorteile/qualitaet',
    },
    '/vyhody-reseni/cloud-vyhody': {
      cs: '/vyhody-reseni/cloud-vyhody',
      en: '/solution-benefits/cloud-benefits',
      de: '/loesungsvorteile/cloud-vorteile',
    },
    '/vyhody-reseni/design': {
      cs: '/vyhody-reseni/design',
      en: '/solution-benefits/design',
      de: '/loesungsvorteile/design',
    },
    '/vyhody-reseni/poradenstvi': {
      cs: '/vyhody-reseni/poradenstvi',
      en: '/solution-benefits/consulting',
      de: '/loesungsvorteile/beratung',
    },
    '/vyhody-reseni/komplexni-reseni': {
      cs: '/vyhody-reseni/komplexni-reseni',
      en: '/solution-benefits/complete-solution',
      de: '/loesungsvorteile/komplettloesung',
    },
    '/vyhody-reseni/upgrade-stanic': {
      cs: '/vyhody-reseni/upgrade-stanic',
      en: '/solution-benefits/station-upgrade',
      de: '/loesungsvorteile/stationen-upgrade',
    },

    // === ŘÍZENÍ NABÍJENÍ ===
    '/rizeni-nabijeni': {
      cs: '/rizeni-nabijeni',
      en: '/charging-management',
      de: '/lademanagement',
    },
    '/rizeni-nabijeni/cloud-platforma': {
      cs: '/rizeni-nabijeni/cloud-platforma',
      en: '/charging-management/cloud-platform',
      de: '/lademanagement/cloud-plattform',
    },
    '/rizeni-nabijeni/mobilni-aplikace': {
      cs: '/rizeni-nabijeni/mobilni-aplikace',
      en: '/charging-management/mobile-app',
      de: '/lademanagement/mobile-app',
    },
    '/rizeni-nabijeni/dynamicke-rizeni-vykonu': {
      cs: '/rizeni-nabijeni/dynamicke-rizeni-vykonu',
      en: '/charging-management/dynamic-load-management',
      de: '/lademanagement/dynamisches-lastmanagement',
    },

    // === REFERENCE ===
    '/reference': {
      cs: '/reference',
      en: '/references',
      de: '/referenzen',
    },

    // === BLOG ===
    '/blog': {
      cs: '/blog',
      en: '/blog',
      de: '/blog',
    },
    '/blog/[slug]': {
      cs: '/blog/[slug]',
      en: '/blog/[slug]',
      de: '/blog/[slug]',
    },

    // === O NÁS ===
    '/o-nas': {
      cs: '/o-nas',
      en: '/about-us',
      de: '/ueber-uns',
    },
    '/o-nas/vlastni-vyvoj': {
      cs: '/o-nas/vlastni-vyvoj',
      en: '/about-us/own-development',
      de: '/ueber-uns/eigene-entwicklung',
    },
    '/o-nas/tym': {
      cs: '/o-nas/tym',
      en: '/about-us/team',
      de: '/ueber-uns/team',
    },
    '/o-nas/eco-rally': {
      cs: '/o-nas/eco-rally',
      en: '/about-us/eco-rally',
      de: '/ueber-uns/eco-rally',
    },
    '/o-nas/media': {
      cs: '/o-nas/media',
      en: '/about-us/media',
      de: '/ueber-uns/medien',
    },
    '/o-nas/historie': {
      cs: '/o-nas/historie',
      en: '/about-us/history',
      de: '/ueber-uns/geschichte',
    },
    '/o-nas/kariera': {
      cs: '/o-nas/kariera',
      en: '/about-us/careers',
      de: '/ueber-uns/karriere',
    },

    // === KONTAKT ===
    '/kontakt': {
      cs: '/kontakt',
      en: '/contact',
      de: '/kontakt',
    },

    // === POPTÁVKA ===
    '/poptavka': {
      cs: '/poptavka',
      en: '/request-quote',
      de: '/anfrage',
    },
  },
})

export type Pathnames = keyof typeof routing.pathnames
