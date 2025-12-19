'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  className?: string
  variant?: 'white' | 'dark' | 'auto'
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, variant = 'auto', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { width: 100, height: 28 },
    md: { width: 130, height: 36 },
    lg: { width: 160, height: 44 },
  }

  // Pro fixní varianty zobrazíme jen jedno logo
  if (variant === 'white') {
    return (
      <Link
        href="/"
        className={cn(
          'relative block transition-all duration-300 hover:opacity-80',
          className
        )}
      >
        <Image
          src="/images/logo-mybox--white.svg"
          alt="MyBox.eco"
          width={sizes[size].width}
          height={sizes[size].height}
          priority
        />
      </Link>
    )
  }

  if (variant === 'dark') {
    return (
      <Link
        href="/"
        className={cn(
          'relative block transition-all duration-300 hover:opacity-80',
          className
        )}
      >
        <Image
          src="/images/logo-mybox.svg"
          alt="MyBox.eco"
          width={sizes[size].width}
          height={sizes[size].height}
          priority
        />
      </Link>
    )
  }

  // variant="auto" - zobrazíme oba a přepneme pomocí CSS tříd
  return (
    <Link
      href="/"
      className={cn(
        'relative block transition-all duration-300 hover:opacity-80',
        className
      )}
      style={{ width: sizes[size].width, height: sizes[size].height }}
    >
      {/* Černé logo - zobrazí se v light mode */}
      <Image
        src="/images/logo-mybox.svg"
        alt="MyBox.eco"
        width={sizes[size].width}
        height={sizes[size].height}
        priority
        className="logo-dark absolute inset-0 h-auto w-auto"
      />
      {/* Bílé logo - zobrazí se v dark mode (výchozí) */}
      <Image
        src="/images/logo-mybox--white.svg"
        alt="MyBox.eco"
        width={sizes[size].width}
        height={sizes[size].height}
        priority
        className="logo-white absolute inset-0 h-auto w-auto"
      />
    </Link>
  )
}
