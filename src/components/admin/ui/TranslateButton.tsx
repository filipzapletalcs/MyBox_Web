'use client'

import { useState } from 'react'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui'
import { TARGET_LOCALES, type Locale } from '@/config/locales'
import { toast } from 'sonner'

interface TranslateButtonProps {
  sourceTexts: Record<string, string>
  onTranslated: (locale: Locale, field: string, value: string) => void
  disabled?: boolean
  context?: string
  tipTapFields?: string[] // Pole která jsou TipTap JSON
}

export function TranslateButton({
  sourceTexts,
  onTranslated,
  disabled,
  context,
  tipTapFields = ['content']
}: TranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false)

  // Dynamický label z konfigurace
  const targetLabels = TARGET_LOCALES.map(l => l.toUpperCase()).join('/')

  const handleTranslate = async () => {
    setIsTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: sourceTexts,
          targetLocales: TARGET_LOCALES,
          context,
          tipTapFields
        })
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const { translations } = await response.json()

      // Update form fields
      for (const [locale, fields] of Object.entries(translations)) {
        for (const [field, value] of Object.entries(fields as Record<string, string>)) {
          onTranslated(locale as Locale, field, value)
        }
      }

      toast.success(`Přeloženo do ${targetLabels}`)
    } catch (error) {
      console.error('Translation error:', error)
      toast.error('Chyba při překladu')
    } finally {
      setIsTranslating(false)
    }
  }

  const hasContent = Object.values(sourceTexts).some(t => t?.trim())

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleTranslate}
      disabled={disabled || isTranslating || !hasContent}
      isLoading={isTranslating}
    >
      <Languages className="mr-2 h-4 w-4" />
      {isTranslating ? 'Překládám...' : `Přeložit do ${targetLabels}`}
    </Button>
  )
}
