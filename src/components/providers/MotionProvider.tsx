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
 * Note: Without 'strict' mode, components can use both 'motion' and 'm'.
 * This allows gradual migration while still benefiting from lazy loading.
 * Full tree-shaking would require replacing all 'motion' with 'm' imports.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  )
}
