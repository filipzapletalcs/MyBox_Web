'use client'

import { type ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { LenisProvider } from './LenisProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <LenisProvider>{children}</LenisProvider>
    </ThemeProvider>
  )
}
