'use client'

import { LazyMotion, domAnimation } from 'framer-motion'
import { ReactNode } from 'react'

interface MotionProviderProps {
  children: ReactNode
}

/**
 * LazyMotion provider that loads only the DOM animation features.
 * This reduces the initial framer-motion bundle by ~50%.
 *
 * Note: Components can still use 'motion' directly - this provider
 * ensures the animation features are loaded once for the entire app.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
