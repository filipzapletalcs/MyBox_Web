import type { Pathnames } from '@/i18n/routing'

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
      label: 'navigation.chargingStations',
      href: '/nabijeci-stanice',
      children: [
        {
          label: 'chargingStations.ac.title',
          href: '/nabijeci-stanice/ac',
          children: [
            { label: 'chargingStations.products.myboxHome', href: '/nabijeci-stanice/ac/mybox-home' },
            { label: 'chargingStations.products.myboxPlus', href: '/nabijeci-stanice/ac/mybox-plus' },
            { label: 'chargingStations.products.myboxProfi', href: '/nabijeci-stanice/ac/mybox-profi' },
            { label: 'chargingStations.products.myboxPost', href: '/nabijeci-stanice/ac/mybox-post' },
            { label: 'chargingStations.products.wallbox', href: '/nabijeci-stanice/ac/wallbox' },
          ],
        },
        {
          label: 'chargingStations.dc.title',
          href: '/nabijeci-stanice/dc',
          children: [
            { label: 'chargingStations.products.alpitronicHyc400', href: '/nabijeci-stanice/dc/alpitronic-hyc400' },
            { label: 'chargingStations.products.alpitronicHyc200', href: '/nabijeci-stanice/dc/alpitronic-hyc200' },
            { label: 'chargingStations.products.alpitronicHyc50', href: '/nabijeci-stanice/dc/alpitronic-hyc50' },
          ],
        },
      ],
    },
    {
      label: 'navigation.corporateCharging',
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
      label: 'navigation.chargingSolutions',
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
      label: 'navigation.solutionBenefits',
      href: '/vyhody-reseni',
    },
    {
      label: 'navigation.chargingManagement',
      href: '/rizeni-nabijeni',
      children: [
        { label: 'chargingManagement.cloudPlatform', href: '/rizeni-nabijeni/cloud-platforma' },
        { label: 'chargingManagement.mobileApp', href: '/rizeni-nabijeni/mobilni-aplikace' },
        { label: 'chargingManagement.dynamicLoadManagement', href: '/rizeni-nabijeni/dynamicke-rizeni-vykonu' },
      ],
    },
    {
      label: 'navigation.aboutUs',
      href: '/o-nas',
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
      { label: 'footer.links.contact', href: '/kontakt' },
    ],
  },
}
