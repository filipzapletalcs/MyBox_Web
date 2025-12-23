import type { Pathnames } from '@/i18n/routing'
import { getProductImageUrl } from '@/lib/supabase/storage'

// Filtruje dynamické cesty (obsahující [param]) z Pathnames
// Tímto způsobem routing.ts zůstává jediným zdrojem pravdy
type FilterDynamicPaths<T> = T extends `${string}[${string}]${string}` ? never : T

// Statické cesty odvozené z routing.ts
export type StaticPathname = FilterDynamicPaths<Pathnames>

export interface NavItem {
  label: string
  href: StaticPathname
  children?: NavItem[]
}

export interface NavigationConfig {
  main: NavItem[]
  footer: {
    products: NavItem[]
    solutions: NavItem[]
    company: NavItem[]
  }
}

// Translation keys for navigation labels
export const navigationConfig: NavigationConfig = {
  main: [
    {
      label: 'chargingStations.title',
      href: '/nabijeci-stanice',
      children: [
        // AC stations - Row 1: positions 1-4
        { label: 'chargingStations.products.myboxHome', href: '/nabijeci-stanice/ac/mybox-home' },
        { label: 'chargingStations.products.myboxPlus', href: '/nabijeci-stanice/ac/mybox-plus' },
        { label: 'chargingStations.products.myboxProfi', href: '/nabijeci-stanice/ac/mybox-profi' },
        { label: 'chargingStations.products.myboxPost', href: '/nabijeci-stanice/ac/mybox-post' },
        // Row 1: position 5 is empty (spacer)
        // Row 1: position 6 - Wallbox
        { label: 'chargingStations.products.wallbox', href: '/nabijeci-stanice/ac/wallbox' },
        // DC stations - Row 2: positions 1-3
        { label: 'chargingStations.products.alpitronicHyc400', href: '/nabijeci-stanice/dc/alpitronic-hyc400' },
        { label: 'chargingStations.products.alpitronicHyc200', href: '/nabijeci-stanice/dc/alpitronic-hyc200' },
        { label: 'chargingStations.products.alpitronicHyc50', href: '/nabijeci-stanice/dc/alpitronic-hyc50' },
        // Row 2: positions 4-5 are empty (spacer)
        // Row 2: position 6 - Accessories
        { label: 'chargingStations.accessories', href: '/nabijeci-stanice/prislusenstvi' },
      ],
    },
    {
      label: 'corporateCharging.title',
      href: '/nabijeni-pro-firmy',
      children: [
        { label: 'corporateCharging.workplaceStations', href: '/nabijeni-pro-firmy/stanice-do-firem' },
        { label: 'corporateCharging.fleetManagement', href: '/nabijeni-pro-firmy/sprava-fleetu' },
        { label: 'corporateCharging.homeChargingEmployees', href: '/nabijeni-pro-firmy/domaci-nabijeni-pro-zamestnance' },
        { label: 'corporateCharging.costAccounting', href: '/nabijeni-pro-firmy/uctovani-nakladu' },
        { label: 'corporateCharging.taxBenefits', href: '/nabijeni-pro-firmy/danove-vyhody' },
        { label: 'corporateCharging.esgElectromobility', href: '/nabijeni-pro-firmy/esg-a-elektromobilita' },
      ],
    },
    {
      label: 'chargingSolutions.title',
      href: '/reseni-nabijeni',
      children: [
        { label: 'chargingSolutions.developers', href: '/reseni-nabijeni/developeri' },
        { label: 'chargingSolutions.architects', href: '/reseni-nabijeni/architekti' },
        { label: 'chargingSolutions.logistics', href: '/reseni-nabijeni/logistika' },
        { label: 'chargingSolutions.energySector', href: '/reseni-nabijeni/energetika' },
        { label: 'chargingSolutions.residential', href: '/reseni-nabijeni/bytove-domy' },
        { label: 'chargingSolutions.hospitality', href: '/reseni-nabijeni/hotely-restaurace' },
      ],
    },
    {
      label: 'solutionBenefits.title',
      href: '/vyhody-reseni',
      children: [
        { label: 'solutionBenefits.quality', href: '/vyhody-reseni/kvalita' },
        { label: 'solutionBenefits.cloudBenefits', href: '/vyhody-reseni/cloud-vyhody' },
        { label: 'solutionBenefits.design', href: '/vyhody-reseni/design' },
        { label: 'solutionBenefits.consulting', href: '/vyhody-reseni/poradenstvi' },
        { label: 'solutionBenefits.completeSolution', href: '/vyhody-reseni/komplexni-reseni' },
        { label: 'solutionBenefits.stationUpgrade', href: '/vyhody-reseni/upgrade-stanic' },
      ],
    },
    {
      label: 'chargingManagement.title',
      href: '/rizeni-nabijeni',
      children: [
        { label: 'chargingManagement.cloudPlatform', href: '/rizeni-nabijeni/cloud-platforma' },
        { label: 'chargingManagement.mobileApp', href: '/rizeni-nabijeni/mobilni-aplikace' },
        { label: 'chargingManagement.dynamicLoadManagement', href: '/rizeni-nabijeni/dynamicke-rizeni-vykonu' },
      ],
    },
    {
      label: 'aboutUs.title',
      href: '/o-nas',
      children: [
        { label: 'aboutUs.ownDevelopment', href: '/o-nas/vlastni-vyvoj' },
        { label: 'aboutUs.team', href: '/o-nas/tym' },
        { label: 'aboutUs.ecoRally', href: '/o-nas/eco-rally' },
        { label: 'aboutUs.media', href: '/o-nas/media' },
        { label: 'aboutUs.history', href: '/o-nas/historie' },
        { label: 'aboutUs.careers', href: '/o-nas/kariera' },
      ],
    },
    {
      label: 'navigation.references',
      href: '/reference',
      children: [
        { label: 'references.corporateCharging', href: '/reference/firemni-nabijeni' },
        { label: 'references.publicStations', href: '/reference/verejne-stanice' },
        { label: 'references.residential', href: '/reference/bytove-domy' },
      ],
    },
    {
      label: 'navigation.contact',
      href: '/kontakt',
      children: [
        { label: 'contact.sales', href: '/kontakt/obchod' },
        { label: 'contact.service', href: '/kontakt/servis' },
      ],
    },
  ],
  footer: {
    products: [
      { label: 'chargingStations.products.myboxHome', href: '/nabijeci-stanice/ac/mybox-home' },
      { label: 'chargingStations.products.myboxPlus', href: '/nabijeci-stanice/ac/mybox-plus' },
      { label: 'chargingStations.products.myboxProfi', href: '/nabijeci-stanice/ac/mybox-profi' },
      { label: 'chargingStations.products.myboxPost', href: '/nabijeci-stanice/ac/mybox-post' },
      { label: 'chargingStations.dc.title', href: '/nabijeci-stanice/dc' },
    ],
    solutions: [
      { label: 'corporateCharging.title', href: '/nabijeni-pro-firmy' },
      { label: 'chargingSolutions.title', href: '/reseni-nabijeni' },
      { label: 'solutionBenefits.title', href: '/vyhody-reseni' },
      { label: 'chargingManagement.title', href: '/rizeni-nabijeni' },
    ],
    company: [
      { label: 'footer.links.aboutUs', href: '/o-nas' },
      { label: 'footer.links.references', href: '/reference' },
      { label: 'footer.links.blog', href: '/blog' },
      { label: 'footer.links.documents', href: '/dokumenty' },
      { label: 'footer.links.contact', href: '/kontakt' },
    ],
  },
}

// Product images mapping for mega menu
export const productImages: Record<string, string> = {
  // AC stations
  '/nabijeci-stanice/ac/mybox-home': getProductImageUrl('home_studio_web_cam_4-0000.png'),
  '/nabijeci-stanice/ac/mybox-plus': getProductImageUrl('plus_studio_web_cam_4-0000.png'),
  '/nabijeci-stanice/ac/mybox-profi': getProductImageUrl('profi_studio_web_cam_4-0000.png'),
  '/nabijeci-stanice/ac/mybox-post': getProductImageUrl('post_studio_web_cam_4-0000.png'),
  // DC stations
  '/nabijeci-stanice/dc/alpitronic-hyc400': getProductImageUrl('hyc400_bok-png.webp'),
  '/nabijeci-stanice/dc/alpitronic-hyc200': getProductImageUrl('hyc_200_bok-png.webp'),
  '/nabijeci-stanice/dc/alpitronic-hyc50': getProductImageUrl('hyc50_bok-png.webp'),
}

// Helper to determine menu type based on href
export function getMenuType(href: string): 'products' | 'categories' | null {
  if (href === '/nabijeci-stanice') return 'products'
  // All other items with children get categories menu
  const item = navigationConfig.main.find((i) => i.href === href)
  if (item?.children) return 'categories'
  return null
}
