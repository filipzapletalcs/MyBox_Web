import { NextResponse } from 'next/server'
import { translateFields } from '@/lib/openai'
import { TARGET_LOCALES, type Locale } from '@/config/locales'

export async function POST(request: Request) {
  try {
    const { texts, targetLocales, context, tipTapFields } = await request.json()

    // Validace
    if (!texts || typeof texts !== 'object') {
      return NextResponse.json({ error: 'Missing texts' }, { status: 400 })
    }

    // Použij předané locales nebo defaultní TARGET_LOCALES
    const locales: Locale[] = targetLocales || TARGET_LOCALES

    // Paralelní překlad do všech jazyků
    const translationPromises = locales.map(async (locale) => {
      const translated = await translateFields(texts, locale, context, tipTapFields)
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
