// Charging station products data
import { getProductImageUrl } from '@/lib/supabase/storage'

// Base product type for AC/DC selector
export interface SelectorProduct {
  id: string
  name: string
  power: string
  image: string
  highlight: string
}

// Valid product href routes (must match routing.ts)
export type ProductHref =
  | '/nabijeci-stanice/ac/mybox-plus'
  | '/nabijeci-stanice/ac/mybox-profi'
  | '/nabijeci-stanice/ac/mybox-post'
  | '/nabijeci-stanice/dc/alpitronic-hyc50'
  | '/nabijeci-stanice/dc/alpitronic-hyc200'
  | '/nabijeci-stanice/dc/alpitronic-hyc400'

// Extended product type for product showcase
export interface ShowcaseProduct {
  id: string
  name: string
  power: string
  image: string
  href: ProductHref
  features: string[]
}

// AC products for selector
export const acSelectorProducts: SelectorProduct[] = [
  {
    id: 'home',
    name: 'MyBox HOME',
    power: '7,4 kW',
    image: getProductImageUrl('home_studio_web_cam_4-0000.png'),
    highlight: 'home',
  },
  {
    id: 'plus',
    name: 'MyBox PLUS',
    power: '22 kW',
    image: getProductImageUrl('plus_studio_web_cam_4-0000.png'),
    highlight: 'smart',
  },
  {
    id: 'post',
    name: 'MyBox POST',
    power: '2×22 kW',
    image: getProductImageUrl('post_studio_web_cam_4-0000.png'),
    highlight: 'dual',
  },
  {
    id: 'profi',
    name: 'MyBox PROFI',
    power: '22 kW',
    image: getProductImageUrl('profi_studio_web_cam_4-0000.png'),
    highlight: 'business',
  },
]

// DC products for selector
export const dcSelectorProducts: SelectorProduct[] = [
  {
    id: 'hyc50',
    name: 'Hypercharger 50',
    power: '50 kW',
    image: getProductImageUrl('hyc50_bok-png.webp'),
    highlight: 'compact',
  },
  {
    id: 'hyc200',
    name: 'Hypercharger 200',
    power: '200 kW',
    image: getProductImageUrl('hyc_200_bok-png.webp'),
    highlight: 'versatile',
  },
  {
    id: 'hyc400',
    name: 'Hypercharger 400',
    power: '400 kW',
    image: getProductImageUrl('hyc400_bok-png.webp'),
    highlight: 'ultrafast',
  },
]

// MyBox products for showcase
export const myboxShowcaseProducts: ShowcaseProduct[] = [
  {
    id: 'plus',
    name: 'MyBox Plus',
    power: '22 kW',
    image: getProductImageUrl('plus_studio_web_cam_4-0000.png'),
    href: '/nabijeci-stanice/ac/mybox-plus',
    features: ['wallbox', 'smart', 'connectivity'],
  },
  {
    id: 'profi',
    name: 'MyBox Profi',
    power: '22 kW',
    image: getProductImageUrl('profi_studio_web_cam_4-0000.png'),
    href: '/nabijeci-stanice/ac/mybox-profi',
    features: ['robust', 'commercial', 'fleet'],
  },
  {
    id: 'post',
    name: 'MyBox Post',
    power: '2×22 kW',
    image: getProductImageUrl('post_studio_web_cam_4-0000.png'),
    href: '/nabijeci-stanice/ac/mybox-post',
    features: ['dual', 'pedestal', 'public'],
  },
]

// Alpitronic products for showcase
export const alpitronicShowcaseProducts: ShowcaseProduct[] = [
  {
    id: 'hyc50',
    name: 'Hypercharger 50',
    power: '50 kW',
    image: getProductImageUrl('hyc50_bok-png.webp'),
    href: '/nabijeci-stanice/dc/alpitronic-hyc50',
    features: ['compact', 'entry', 'flexible'],
  },
  {
    id: 'hyc200',
    name: 'Hypercharger 200',
    power: '200 kW',
    image: getProductImageUrl('hyc_200_bok-png.webp'),
    href: '/nabijeci-stanice/dc/alpitronic-hyc200',
    features: ['versatile', 'scalable', 'highway'],
  },
  {
    id: 'hyc400',
    name: 'Hypercharger 400',
    power: '400 kW',
    image: getProductImageUrl('hyc400_bok-png.webp'),
    href: '/nabijeci-stanice/dc/alpitronic-hyc400',
    features: ['ultrafast', 'premium', 'maxpower'],
  },
]

// Company founding year
export const COMPANY_FOUNDED_YEAR = 2017
