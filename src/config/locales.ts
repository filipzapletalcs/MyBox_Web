// Centrální konfigurace jazyků
// Pro přidání nového jazyka stačí upravit zde

export const LOCALES = ['cs', 'en', 'de'] as const
export type Locale = (typeof LOCALES)[number]

export const SOURCE_LOCALE: Locale = 'cs'

// Odvozeno automaticky - všechny jazyky kromě zdrojového
export const TARGET_LOCALES = LOCALES.filter(l => l !== SOURCE_LOCALE) as Locale[]

export const LOCALE_NAMES: Record<Locale, string> = {
  cs: 'Čeština',
  en: 'English',
  de: 'Deutsch',
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  cs: '🇨🇿',
  en: '🇬🇧',
  de: '🇩🇪',
}

// Pro přidání nového jazyka (např. polština):
// 1. Přidat 'pl' do LOCALES
// 2. Přidat do LOCALE_NAMES a LOCALE_FLAGS
// 3. Přidat translations schema do form schemas
// 4. Přidat pl.json do src/messages/
// 5. Přidat 'pl' do src/i18n/routing.ts
// Vše ostatní se adaptuje automaticky
