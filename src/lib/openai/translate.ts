import { openai } from './client'
import { LOCALE_NAMES, type Locale } from '@/config/locales'

/**
 * Přeloží plain text z češtiny do cílového jazyka
 */
export async function translateText(
  text: string,
  targetLocale: Locale,
  context?: string
): Promise<string> {
  if (!text?.trim()) return ''

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate Czech text to ${LOCALE_NAMES[targetLocale]}.
Context: Website about EV charging stations (MyBox.eco).
Rules:
- Maintain the same tone
- Output ONLY the translated text, nothing else
- Do NOT add any markdown formatting (no **, no *, no #, no links)
- Do NOT add quotation marks around the translation
- Keep technical terms accurate
- Preserve line breaks if present
${context ? `Additional context: ${context}` : ''}`
      },
      { role: 'user', content: text }
    ],
    temperature: 0.3,
  })

  return response.choices[0]?.message?.content || text
}

/**
 * Přeloží TipTap JSON obsah - zachová strukturu, přeloží pouze textové nody
 */
export async function translateTipTapContent(
  content: string,
  targetLocale: Locale,
  context?: string
): Promise<string> {
  if (!content?.trim()) return ''

  try {
    const json = JSON.parse(content)
    const translatedJson = await translateTipTapNode(json, targetLocale, context)
    return JSON.stringify(translatedJson)
  } catch {
    // Fallback - pokud není validní JSON, přelož jako text
    return translateText(content, targetLocale, context)
  }
}

/**
 * Rekurzivní překlad TipTap nodů
 */
async function translateTipTapNode(
  node: unknown,
  targetLocale: Locale,
  context?: string
): Promise<unknown> {
  if (!node || typeof node !== 'object') return node

  const typedNode = node as Record<string, unknown>

  // Přelož textové nody
  if (typedNode.type === 'text' && typeof typedNode.text === 'string') {
    return {
      ...typedNode,
      text: await translateText(typedNode.text, targetLocale, context)
    }
  }

  // Rekurzivně zpracuj children
  if (typedNode.content && Array.isArray(typedNode.content)) {
    const translatedContent = await Promise.all(
      typedNode.content.map((child: unknown) =>
        translateTipTapNode(child, targetLocale, context)
      )
    )
    return { ...typedNode, content: translatedContent }
  }

  return typedNode
}

/**
 * Bulk překlad více polí paralelně
 */
export async function translateFields(
  texts: Record<string, string>,
  targetLocale: Locale,
  context?: string,
  tipTapFields: string[] = ['content'] // Pole která jsou TipTap JSON
): Promise<Record<string, string>> {
  const entries = Object.entries(texts).filter(([, text]) => text?.trim())

  const translations = await Promise.all(
    entries.map(async ([field, text]) => {
      const isTipTap = tipTapFields.includes(field)
      const translated = isTipTap
        ? await translateTipTapContent(text, targetLocale, context)
        : await translateText(text, targetLocale, context)
      return [field, translated] as const
    })
  )

  return Object.fromEntries(translations)
}
