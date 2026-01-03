'use client'

import { type ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { LenisProvider } from './LenisProvider'
import { MotionProvider } from './MotionProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <LenisProvider>{children}</LenisProvider>
      </MotionProvider>
    </ThemeProvider>
  )
}
