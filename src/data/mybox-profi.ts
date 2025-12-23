import type { FullProductData } from '@/types/product'
import { getProductImageUrl } from '@/lib/supabase/storage'

export const myboxProfiData: FullProductData = {
  id: 'mybox-profi',
  slug: 'mybox-profi',
  name: 'MyBox Profi',
  type: 'ac',
  brand: 'mybox',
  power: '2×22 kW',
  tagline: 'Profesionální wallbox pro 2 elektromobily s řadou pokročilých funkcí. Vyhovuje požadavkům pro intenzivní používání i pokročilou správu zařízení.',
  description: 'Wallbox s výkonem 2×22 kW pro profesionální využití. Kombinace oceli a kaleného skla tvoří ochranu proti nepříznivým podmínkám či mechanickému poškození.',

  // SEO & Structured Data
  sku: 'MYBOX-PROFI',
  category: 'Nabíjecí stanice pro elektromobily',
  manufacturer: {
    name: 'ELEXIM, a.s.',
    url: 'https://mybox.eco',
  },
  countryOfOrigin: 'CZ',

  heroImage: getProductImageUrl('profi/profi-black.png'),

  // Gallery
  gallery: [
    {
      id: 'profi-gallery-1',
      src: getProductImageUrl('profi/gallery/mybox-profi_office-cam-2_3k_final.jpg'),
      alt: 'MyBox Profi v kancelářském prostředí',
    },
    {
      id: 'profi-gallery-2',
      src: getProductImageUrl('profi/gallery/mybox-profi_office-cam-4_3k_final.jpg'),
      alt: 'MyBox Profi detail',
    },
    {
      id: 'profi-gallery-3',
      src: getProductImageUrl('profi/gallery/mybox-profi_office-cam-6_3k_final.jpg'),
      alt: 'MyBox Profi boční pohled',
    },
    {
      id: 'profi-gallery-4',
      src: getProductImageUrl('profi/gallery/mybox-profi_office-cam-8_3k_final.jpg'),
      alt: 'MyBox Profi v provozu',
    },
    {
      id: 'profi-gallery-5',
      src: getProductImageUrl('profi/gallery/mybox_profi_podzemni_garaz_cam-1_3k_final.jpg'),
      alt: 'MyBox Profi v podzemní garáži',
    },
    {
      id: 'profi-gallery-6',
      src: getProductImageUrl('profi/gallery/mybox_profi_podzemni_garaz_cam-3_3k_final.jpg'),
      alt: 'MyBox Profi v garážovém komplexu',
    },
    {
      id: 'profi-gallery-7',
      src: getProductImageUrl('profi/gallery/mybox_profi_podzemni_garaz_cam-4_3k_final.jpg'),
      alt: 'MyBox Profi instalace',
    },
    {
      id: 'profi-gallery-8',
      src: getProductImageUrl('profi/gallery/mybox_profi_individual.png'),
      alt: 'MyBox Profi individuální design',
    },
  ],

  // Color variants
  colorVariants: {
    black: {
      id: 'black',
      label: 'Černé sklo',
      image: getProductImageUrl('profi/profi-black.png'),
    },
    white: {
      id: 'white',
      label: 'Bílé sklo',
      image: getProductImageUrl('profi/profi-white.webp'),
    },
  },

  // Front view for feature showcase
  frontImage: getProductImageUrl('profi/profi-front.png'),

  // Feature points for showcase
  featurePoints: [
    {
      id: 'power',
      icon: 'power',
      label: 'Výkon',
      value: '2×22 kW',
      position: 'left',
    },
    {
      id: 'protocol',
      icon: 'protocol',
      label: 'Protokol',
      value: 'OCPP 1.6',
      position: 'left',
    },
    {
      id: 'connectivity',
      icon: 'connectivity',
      label: 'Konektivita',
      value: 'WiFi / Ethernet',
      position: 'left',
    },
    {
      id: 'protection',
      icon: 'protection',
      label: 'Krytí',
      value: 'IP54 / IK10',
      position: 'right',
    },
    {
      id: 'meter',
      icon: 'meter',
      label: 'Elektroměr',
      value: 'MID certifikace',
      position: 'right',
    },
    {
      id: 'temperature',
      icon: 'temperature',
      label: 'Provozní teplota',
      value: '-30°C až +50°C',
      position: 'right',
    },
  ],

  // Technical specifications
  specifications: [
    {
      id: 'power',
      icon: 'power',
      title: 'Výkon',
      specs: [
        { key: 'model', label: 'Model', value: 'Profi 2×22 kW' },
        { key: 'maxPower', label: 'Max. výstupní výkon', value: '44', unit: 'kW', highlight: true },
        { key: 'powerPerConnector', label: 'Výkon na konektor', value: '22', unit: 'kW' },
        { key: 'voltage', label: 'Napětí', value: '400 V (±10%)' },
        { key: 'currentPerConnector', label: 'Proud na konektor', value: '3×32', unit: 'A' },
        { key: 'connectors', label: 'Počet konektorů', value: '2× Typ 2' },
      ],
    },
    {
      id: 'dimensions',
      icon: 'dimensions',
      title: 'Rozměry a konstrukce',
      specs: [
        { key: 'dimensions', label: 'Rozměry (Š×V×H)', value: '390 × 630 × 180', unit: 'mm' },
        { key: 'weight', label: 'Hmotnost', value: '25', unit: 'kg' },
        { key: 'protection', label: 'Krytí', value: 'IP54 / IK10', highlight: true },
        { key: 'material', label: 'Materiál', value: 'Kalené sklo, ocel' },
        { key: 'operatingTemp', label: 'Provozní teplota', value: '-30°C až +50°C' },
      ],
    },
    {
      id: 'connectivity',
      icon: 'connectivity',
      title: 'Konektivita',
      specs: [
        { key: 'ethernet', label: 'Ethernet', value: 'RJ45' },
        { key: 'wifi', label: 'WiFi', value: '2.4 GHz b/g/n' },
        { key: 'optional', label: 'Volitelně', value: '4G/LTE, VPN' },
        { key: 'protocols', label: 'Protokoly', value: 'OCPP 1.6, Modbus TCP, MQTT' },
        { key: 'rfid', label: 'RFID', value: 'ISO-14443, NFC, Mifare' },
      ],
    },
    {
      id: 'security',
      icon: 'security',
      title: 'Bezpečnost',
      specs: [
        { key: 'breaker', label: 'Jistič', value: '2× MCB (B) 32A' },
        { key: 'rcd', label: 'Proudový chránič', value: '2× RCD typ A (30mA)' },
        { key: 'rcm', label: 'DC ochrana', value: 'RCM 6mA' },
        { key: 'meter', label: 'Elektroměr', value: 'MID certifikace', highlight: true },
        { key: 'connectorLock', label: 'Zámek konektoru', value: 'Ano' },
        { key: 'doorLock', label: 'Zámek dveří', value: 'Na klíč' },
      ],
    },
  ],

  // SEO content sections
  contentSections: [
    {
      title: 'Profesionální řešení pro firemní dobíjení',
      subtitle: 'Pro business',
      content: 'MyBox Profi je navržen pro náročné firemní prostředí. Díky dvěma nezávislým nabíjecím bodům s výkonem 22 kW umožňuje současné dobíjení dvou elektromobilů. Integrovaný elektroměr s MID certifikací zajišťuje přesné měření spotřeby pro účtování.',
      image: {
        src: getProductImageUrl('profi/gallery/mybox-profi_office-cam-2_3k_final.jpg'),
        alt: 'MyBox Profi v kancelářském prostředí',
      },
    },
    {
      title: 'Odolná konstrukce pro venkovní instalaci',
      subtitle: 'Kvalita a odolnost',
      content: 'Kombinace kaleného skla a lakované nebo nerezové oceli zajišťuje maximální odolnost proti nepříznivým povětrnostním podmínkám i mechanickému poškození. Krytí IP54/IK10 garantuje spolehlivý provoz v náročných podmínkách od -30°C do +50°C.',
      image: {
        src: getProductImageUrl('profi/gallery/mybox_profi_podzemni_garaz_cam-3_3k_final.jpg'),
        alt: 'MyBox Profi v garážovém komplexu',
      },
    },
  ],

  // Datasheet
  datasheet: {
    url: '/downloads/mybox-profi-datasheet.pdf',
    fileName: 'MyBox-Profi-Datasheet.pdf',
  },

  // Features badges
  features: ['dual', 'commercial', 'smart', 'connectivity'],

  // Related products
  relatedProductSlugs: ['mybox-plus', 'mybox-post'],
}
