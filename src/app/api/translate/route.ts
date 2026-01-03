import { NextResponse } from 'next/server'
import { translateFields } from '@/lib/openai'
import { TARGET_LOCALES, LOCALES, type Locale } from '@/config/locales'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    // Autentizace - pouze přihlášení uživatelé mohou překládat
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { texts, targetLocales, context, tipTapFields } = await request.json()

    // Validace texts
    if (!texts || typeof texts !== 'object') {
      return NextResponse.json({ error: 'Missing texts' }, { status: 400 })
    }

    // Validace targetLocales (pokud jsou předané)
    if (targetLocales) {
      const invalidLocales = targetLocales.filter(
        (l: string) => !LOCALES.includes(l as Locale)
      )
      if (invalidLocales.length > 0) {
        return NextResponse.json({ error: 'Invalid target locales' }, { status: 400 })
      }
    }

    // Sanitizace context (omezení délky a odstranění potenciálně nebezpečných znaků)
    const sanitizedContext = context
      ? String(context).substring(0, 500)
      : undefined

    // Použij předané locales nebo defaultní TARGET_LOCALES
    const locales: Locale[] = targetLocales || TARGET_LOCALES

    // Paralelní překlad do všech jazyků
    const translationPromises = locales.map(async (locale) => {
      const translated = await translateFields(texts, locale, sanitizedContext, tipTapFields)
      return [locale, translated] as const
    })

    const results = await Promise.all(translationPromises)
    const translations = Object.fromEntries(results)

    return NextResponse.json({ translations })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}
