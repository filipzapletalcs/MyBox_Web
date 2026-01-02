'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { navigationConfig } from '@/data/navigation'

interface CompanyDetails {
  name: string
  division: string | null
  address: string
  city: string
  zip: string
  country: string | null
  ico: string
  dic: string | null
  facebook_url: string | null
  instagram_url: string | null
  linkedin_url: string | null
  youtube_url: string | null
}

interface FooterProps {
  companyDetails?: CompanyDetails | null
}

// Social icons
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M16.667 2.5H3.333A.833.833 0 002.5 3.333v13.334c0 .46.373.833.833.833h13.334c.46 0 .833-.373.833-.833V3.333a.833.833 0 00-.833-.833zM6.667 15H4.167V8.333h2.5V15zM5.417 7.292a1.458 1.458 0 110-2.917 1.458 1.458 0 010 2.917zM15.833 15h-2.5v-3.25c0-.775-.014-1.775-1.083-1.775-1.084 0-1.25.847-1.25 1.72V15h-2.5V8.333H11v.909h.035c.291-.552 1.003-1.134 2.065-1.134 2.208 0 2.617 1.454 2.617 3.345V15h.116z"
      fill="currentColor"
    />
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M18.333 10c0-4.6-3.733-8.333-8.333-8.333S1.667 5.4 1.667 10c0 4.158 3.042 7.608 7.016 8.233v-5.825H6.458V10h2.225V7.937c0-2.2 1.308-3.412 3.308-3.412.959 0 1.959.171 1.959.171v2.159h-1.104c-1.087 0-1.425.675-1.425 1.37V10h2.433l-.391 2.408H11.42v5.825c3.975-.625 7.016-4.075 7.016-8.233h-.104z"
      fill="currentColor"
    />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 6.667a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm0 5.5a2.167 2.167 0 110-4.334 2.167 2.167 0 010 4.334z"
      fill="currentColor"
    />
    <path
      d="M13.75 3.75h-7.5A2.503 2.503 0 003.75 6.25v7.5a2.503 2.503 0 002.5 2.5h7.5a2.503 2.503 0 002.5-2.5v-7.5a2.503 2.503 0 00-2.5-2.5zm1.333 10a1.335 1.335 0 01-1.333 1.333h-7.5A1.335 1.335 0 014.917 13.75v-7.5A1.335 1.335 0 016.25 4.917h7.5a1.335 1.335 0 011.333 1.333v7.5z"
      fill="currentColor"
    />
    <circle cx="14" cy="6" r="0.75" fill="currentColor" />
  </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M17.79 6.04c-.2-.75-.79-1.34-1.54-1.54C14.88 4.17 10 4.17 10 4.17s-4.88 0-6.25.33c-.75.2-1.34.79-1.54 1.54C1.88 7.42 1.88 10 1.88 10s0 2.58.33 3.96c.2.75.79 1.34 1.54 1.54 1.37.33 6.25.33 6.25.33s4.88 0 6.25-.33c.75-.2 1.34-.79 1.54-1.54.33-1.38.33-3.96.33-3.96s0-2.58-.33-3.96zM8.33 12.5V7.5L12.5 10l-4.17 2.5z"
      fill="currentColor"
    />
  </svg>
)

export function Footer({ companyDetails }: FooterProps) {
  const t = useTranslations()

  // Helper function to get nested translation
  const getTranslation = (key: string) => {
    try {
      const parts = key.split('.')
      if (parts.length === 2) {
        return t(`${parts[0]}.${parts[1]}` as any)
      }
      if (parts.length === 3) {
        return t(`${parts[0]}.${parts[1]}.${parts[2]}` as any)
      }
      return t(key as any)
    } catch {
      return key
    }
  }

  const currentYear = new Date().getFullYear()

  // Build social links from companyDetails or use fallback
  const socialLinks = [
    companyDetails?.linkedin_url && { icon: LinkedInIcon, href: companyDetails.linkedin_url, label: 'LinkedIn' },
    companyDetails?.facebook_url && { icon: FacebookIcon, href: companyDetails.facebook_url, label: 'Facebook' },
    companyDetails?.instagram_url && { icon: InstagramIcon, href: companyDetails.instagram_url, label: 'Instagram' },
    companyDetails?.youtube_url && { icon: YouTubeIcon, href: companyDetails.youtube_url, label: 'YouTube' },
  ].filter(Boolean) as { icon: typeof LinkedInIcon; href: string; label: string }[]

  // Fallback if no companyDetails
  const defaultSocialLinks = [
    { icon: LinkedInIcon, href: 'https://www.linkedin.com/company/mybox-charging-stations/', label: 'LinkedIn' },
    { icon: FacebookIcon, href: 'https://www.facebook.com/myboxchargingstations', label: 'Facebook' },
    { icon: InstagramIcon, href: 'https://instagram.com/myboxchargingstations', label: 'Instagram' },
    { icon: YouTubeIcon, href: 'https://www.youtube.com/@myboxchargingstations', label: 'YouTube' },
  ]

  const activeSocialLinks = socialLinks.length > 0 ? socialLinks : defaultSocialLinks

  return (
    <footer className="border-t border-border-subtle bg-bg-secondary">
      {/* Main footer */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Logo className="mb-10" />
            <p className="mb-12 max-w-xs text-sm leading-loose text-text-secondary">
              {t('footer.tagline')}
            </p>

            {/* Company info */}
            <div className="mt-6 text-sm">
              <span className="block font-semibold text-text-primary">
                {companyDetails ? `${companyDetails.name}${companyDetails.division ? ` – ${companyDetails.division}` : ''}` : 'ELEXIM, a.s. – Divize MyBox'}
              </span>
              <address className="mt-3 not-italic text-text-secondary">
                <span className="block">{companyDetails?.address || 'Hulínská 1814/1b'}</span>
                <span className="block">{companyDetails ? `${companyDetails.zip} ${companyDetails.city}` : '767 01 Kroměříž'}</span>
                <span className="block">{t('common.countryName')}</span>
              </address>
              <span className="mt-3 block text-text-secondary">{t('common.ico')}: {companyDetails?.ico || '25565044'}</span>
              <span className="block text-text-secondary">{t('common.dic')}: {companyDetails?.dic || 'CZ25565044'}</span>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {/* Products */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-primary">
                {t('chargingStations.title')}
              </h3>
              <ul className="space-y-2">
                {navigationConfig.footer.products.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'text-sm text-text-secondary transition-colors duration-150',
                        'hover:text-green-400'
                      )}
                    >
                      {getTranslation(item.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-primary">
                {t('chargingSolutions.title')}
              </h3>
              <ul className="space-y-2">
                {navigationConfig.footer.solutions.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'text-sm text-text-secondary transition-colors duration-150',
                        'hover:text-green-400'
                      )}
                    >
                      {getTranslation(item.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-primary">
                {t('footer.company')}
              </h3>
              <ul className="space-y-2">
                {navigationConfig.footer.company.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'text-sm text-text-secondary transition-colors duration-150',
                        'hover:text-green-400'
                      )}
                    >
                      {getTranslation(item.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-subtle">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <div className="flex items-center gap-6">
            <span className="text-xs text-text-muted">
              &copy; {currentYear} {t('footer.company')}. {t('footer.allRightsReserved')}.
            </span>

            {/* Social links */}
            <div className="flex gap-3">
              {activeSocialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted transition-colors hover:text-green-400"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/ochrana-osobnich-udaju"
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              {t('footer.privacyPolicy')}
            </Link>
            <Link
              href="/obchodni-podminky"
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              {t('footer.terms')}
            </Link>
            <Link
              href="/zasady-cookies"
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              {t('footer.cookiesLink')}
            </Link>

            {/* Divider */}
            <div className="h-4 w-px bg-border-subtle" />

            {/* Theme & Language */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
