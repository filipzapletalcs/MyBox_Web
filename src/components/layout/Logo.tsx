'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  className?: string
  variant?: 'default' | 'white' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, variant = 'default', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { width: 100, height: 28 },
    md: { width: 130, height: 36 },
    lg: { width: 160, height: 44 },
  }

  return (
    <Link
      href="/"
      className={cn(
        'relative block transition-opacity hover:opacity-80',
        className
      )}
    >
      <Image
        src="/logo/logo-mybox.svg"
        alt="MyBox.eco"
        width={sizes[size].width}
        height={sizes[size].height}
        priority
        className={cn(
          variant === 'white' && 'brightness-0 invert',
          variant === 'dark' && 'brightness-0'
        )}
      />
    </Link>
  )
}
