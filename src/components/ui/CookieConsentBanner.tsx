'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import CookieConsent from 'react-cookie-consent'
import { Link } from '@/i18n/navigation'

export function CookieConsentBanner() {
  const t = useTranslations('cookies')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <CookieConsent
      location="bottom"
      buttonText={t('accept')}
      declineButtonText={t('decline')}
      enableDeclineButton
      cookieName="mybox-cookie-consent"
      style={{
        background: 'rgba(23, 23, 23, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '16px 24px',
        alignItems: 'center',
        borderTop: '1px solid rgba(74, 222, 128, 0.2)',
      }}
      buttonStyle={{
        background: '#4ade80',
        color: '#171717',
        fontSize: '14px',
        fontWeight: '500',
        padding: '10px 20px',
        borderRadius: '8px',
        marginLeft: '16px',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#a3a3a3',
        fontSize: '14px',
        padding: '10px 20px',
        borderRadius: '8px',
        border: '1px solid #404040',
      }}
      expires={365}
      onAccept={() => {
        // Enable analytics, etc.
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
          })
        }
      }}
      onDecline={() => {
        // Disable analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('consent', 'update', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
          })
        }
      }}
    >
      <span className="text-sm text-neutral-300">
        {t('message')}{' '}
        <Link
          href="/zasady-cookies"
          className="text-green-400 underline hover:text-green-300"
        >
          {t('learnMore')}
        </Link>
      </span>
    </CookieConsent>
  )
}
