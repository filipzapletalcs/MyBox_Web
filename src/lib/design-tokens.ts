/**
 * Design System Tokens
 * Centralizované design tokeny pro TypeScript použití
 * Odpovídají CSS proměnným v globals.css
 */

// ===========================
// TYPOGRAPHY
// ===========================

export const typography = {
  size: {
    '2xs': 'var(--text-2xs)',   // 10px
    'xs': 'var(--text-xs)',     // 12px
    'sm': 'var(--text-sm)',     // 14px
    'base': 'var(--text-base)', // 16px
    'md': 'var(--text-md)',     // 18px
    'lg': 'var(--text-lg)',     // 20px
    'xl': 'var(--text-xl)',     // 25px
    '2xl': 'var(--text-2xl)',   // 31px
    '3xl': 'var(--text-3xl)',   // 39px
    '4xl': 'var(--text-4xl)',   // 49px
    '5xl': 'var(--text-5xl)',   // 61px
    '6xl': 'var(--text-6xl)',   // 76px
    '7xl': 'var(--text-7xl)',   // 95px
  },
  leading: {
    none: 'var(--leading-none)',       // 1
    tight: 'var(--leading-tight)',     // 1.15
    snug: 'var(--leading-snug)',       // 1.25
    normal: 'var(--leading-normal)',   // 1.5
    relaxed: 'var(--leading-relaxed)', // 1.625
    loose: 'var(--leading-loose)',     // 1.75
  },
  tracking: {
    tighter: 'var(--tracking-tighter)', // -0.04em
    tight: 'var(--tracking-tight)',     // -0.02em
    normal: 'var(--tracking-normal)',   // 0
    wide: 'var(--tracking-wide)',       // 0.02em
    wider: 'var(--tracking-wider)',     // 0.04em
    widest: 'var(--tracking-widest)',   // 0.08em
  },
} as const

// ===========================
// SPACING
// ===========================

export const spacing = {
  // Base scale (4px grid)
  scale: {
    '0': 'var(--space-0)',       // 0
    'px': 'var(--space-px)',     // 1px
    '0.5': 'var(--space-0-5)',   // 2px
    '1': 'var(--space-1)',       // 4px
    '1.5': 'var(--space-1-5)',   // 6px
    '2': 'var(--space-2)',       // 8px
    '2.5': 'var(--space-2-5)',   // 10px
    '3': 'var(--space-3)',       // 12px
    '3.5': 'var(--space-3-5)',   // 14px
    '4': 'var(--space-4)',       // 16px
    '5': 'var(--space-5)',       // 20px
    '6': 'var(--space-6)',       // 24px
    '7': 'var(--space-7)',       // 28px
    '8': 'var(--space-8)',       // 32px
    '9': 'var(--space-9)',       // 36px
    '10': 'var(--space-10)',     // 40px
    '11': 'var(--space-11)',     // 44px
    '12': 'var(--space-12)',     // 48px
    '14': 'var(--space-14)',     // 56px
    '16': 'var(--space-16)',     // 64px
    '20': 'var(--space-20)',     // 80px
    '24': 'var(--space-24)',     // 96px
    '28': 'var(--space-28)',     // 112px
    '32': 'var(--space-32)',     // 128px
  },
  // Semantic gap hierarchy
  gap: {
    xs: 'var(--gap-xs)',     // 4px - ikony, badges
    sm: 'var(--gap-sm)',     // 8px - related items
    md: 'var(--gap-md)',     // 16px - form fields
    lg: 'var(--gap-lg)',     // 24px - card sections
    xl: 'var(--gap-xl)',     // 32px - grid items
    '2xl': 'var(--gap-2xl)', // 48px - velké sekce
  },
  // Section spacing
  section: {
    sm: 'var(--spacing-section-sm)',    // 64px
    default: 'var(--spacing-section)',  // 96px
    lg: 'var(--spacing-section-lg)',    // 128px
  },
} as const

// ===========================
// FORM COMPONENTS
// ===========================

export const formTokens = {
  input: {
    height: {
      sm: 'var(--input-height-sm)',   // 36px
      md: 'var(--input-height-md)',   // 44px
      lg: 'var(--input-height-lg)',   // 56px
    },
    px: {
      sm: 'var(--input-px-sm)',   // 12px
      md: 'var(--input-px-md)',   // 16px
      lg: 'var(--input-px-lg)',   // 20px
    },
    py: {
      sm: 'var(--input-py-sm)',   // 8px
      md: 'var(--input-py-md)',   // 12px
      lg: 'var(--input-py-lg)',   // 16px
    },
  },
  button: {
    px: {
      sm: 'var(--button-px-sm)',   // 16px
      md: 'var(--button-px-md)',   // 24px
      lg: 'var(--button-px-lg)',   // 32px
      xl: 'var(--button-px-xl)',   // 40px
    },
  },
  card: {
    padding: {
      sm: 'var(--card-padding-sm)',   // 16px
      md: 'var(--card-padding-md)',   // 24px
      lg: 'var(--card-padding-lg)',   // 32px
      xl: 'var(--card-padding-xl)',   // 40px
    },
  },
} as const

// ===========================
// TYPE EXPORTS
// ===========================

export type TypographySize = keyof typeof typography.size
export type TypographyLeading = keyof typeof typography.leading
export type TypographyTracking = keyof typeof typography.tracking

export type SpacingScale = keyof typeof spacing.scale
export type SpacingGap = keyof typeof spacing.gap
export type SpacingSection = keyof typeof spacing.section

export type InputSize = keyof typeof formTokens.input.height
export type ButtonSize = keyof typeof formTokens.button.px
export type CardPadding = keyof typeof formTokens.card.padding
