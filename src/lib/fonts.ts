import localFont from 'next/font/local'

export const halisR = localFont({
  src: [
    {
      path: '../../public/fonts/HalisR-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HalisR-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HalisR-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HalisR-Book.otf',
      weight: '350',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HalisR-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HalisR-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HalisR-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HalisR-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-halis',
  display: 'swap',
})
