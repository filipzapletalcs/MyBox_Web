/**
 * Script to import articles from old mybox.eco website
 * Run with: npx tsx scripts/import-articles.ts
 */

import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Supabase client for local development
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
)

// Default author ID for imported articles
const DEFAULT_AUTHOR_ID = 'bcb0ff68-327f-44e4-99cc-eac03145be08'

// Category mapping
const categoryMapping: Record<string, string> = {
  'Novinky': '11111111-1111-1111-1111-111111111111',
  'Úvod do elektromobility': '33333333-3333-3333-3333-333333333333',
  'Naše řešení': '22222222-2222-2222-2222-222222222222',
  'Příklady použití': '22222222-2222-2222-2222-222222222222',
  'Případové studie': '44444444-4444-4444-4444-444444444444',
}

// Parse Czech date to ISO format
function parseCzechDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('. ').map(s => s.trim())
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0)
  return date.toISOString()
}

// Extract content from article page
async function extractArticleContent(page: any, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(1000)

  return await page.evaluate(() => {
    // Get featured image from OG meta
    const ogImage = document.querySelector('meta[property="og:image"]')
    const featuredImage = ogImage?.getAttribute('content') || null

    // Get title
    const title = document.querySelector('h1')?.textContent?.trim() || ''

    // Extract slug from URL
    const slug = window.location.pathname.split('/clanek/')[1]?.replace(/\/$/, '') || ''

    // Build TipTap JSON content
    const content: any = { type: 'doc', content: [] }

    // Get main content (skip first div which is hero/breadcrumb)
    const mainDivs = document.querySelectorAll('main > div')

    for (let i = 1; i < mainDivs.length; i++) {
      const div = mainDivs[i]
      // Skip share buttons, related articles, CTA sections
      if (div.querySelector('[class*="share"]') ||
          div.querySelector('.swiper') ||
          div.textContent?.includes('Potřebujete poradit?')) {
        continue
      }

      const elements = div.querySelectorAll('h1, h2, h3, h4, p, ul, ol')

      elements.forEach(el => {
        const tagName = el.tagName

        if (['H1', 'H2', 'H3', 'H4'].includes(tagName)) {
          const text = el.textContent?.trim()
          if (text && text.length > 0) {
            const level = tagName === 'H1' || tagName === 'H2' ? 2 : 3
            content.content.push({
              type: 'heading',
              attrs: { level },
              content: [{ type: 'text', text }]
            })
          }
        } else if (tagName === 'P') {
          const textContent: any[] = []

          // Process nodes iteratively to avoid nested function transpilation issues
          const nodesToProcess: any[] = Array.from(el.childNodes)
          while (nodesToProcess.length > 0) {
            const node = nodesToProcess.shift()
            if (node.nodeType === 3) {
              const text = node.textContent
              if (text && text.trim()) {
                textContent.push({ type: 'text', text })
              }
            } else if (node.nodeName === 'STRONG' || node.nodeName === 'B') {
              const text = node.textContent
              if (text && text.trim()) {
                textContent.push({ type: 'text', marks: [{ type: 'bold' }], text })
              }
            } else if (node.nodeName === 'EM' || node.nodeName === 'I') {
              const text = node.textContent
              if (text && text.trim()) {
                textContent.push({ type: 'text', marks: [{ type: 'italic' }], text })
              }
            } else if (node.nodeName === 'A') {
              const text = node.textContent
              const href = node.getAttribute('href')
              if (text && text.trim() && href) {
                textContent.push({
                  type: 'text',
                  marks: [{ type: 'link', attrs: { href, target: '_blank' } }],
                  text
                })
              }
            } else if (node.childNodes && node.childNodes.length > 0) {
              // Add child nodes to front of queue
              nodesToProcess.unshift(...Array.from(node.childNodes))
            }
          }

          if (textContent.length > 0) {
            content.content.push({
              type: 'paragraph',
              content: textContent
            })
          }
        } else if (tagName === 'UL' || tagName === 'OL') {
          const listItems: any[] = []
          el.querySelectorAll(':scope > li').forEach(li => {
            const text = li.textContent?.trim()
            if (text) {
              listItems.push({
                type: 'listItem',
                content: [{
                  type: 'paragraph',
                  content: [{ type: 'text', text }]
                }]
              })
            }
          })

          if (listItems.length > 0) {
            content.content.push({
              type: tagName === 'UL' ? 'bulletList' : 'orderedList',
              content: listItems
            })
          }
        }
      })
    }

    return {
      slug,
      title,
      featuredImage,
      content: JSON.stringify(content),
      contentLength: content.content.length
    }
  })
}

async function main() {
  console.log('Starting article import...')

  // Load articles list
  const articlesPath = path.join(__dirname, 'articles-to-import.json')
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'))

  // Skip articles that should not be imported
  const skipSlugs = [
    'ekologicka-budova-masarycka-v-praze' // Already imported as Masaryčka case study
  ]

  // Check existing articles
  const { data: existingArticles } = await supabase
    .from('articles')
    .select('slug')

  const existingSlugs = new Set(existingArticles?.map(a => a.slug) || [])

  // Filter articles to import
  const articlesToImport = articles.filter((article: any) => {
    const slug = article.url.split('/clanek/')[1]?.replace(/\/$/, '')
    if (skipSlugs.includes(slug)) {
      console.log(`Skipping ${slug} (manual skip)`)
      return false
    }
    if (existingSlugs.has(slug)) {
      console.log(`Skipping ${slug} (already exists)`)
      return false
    }
    return true
  })

  console.log(`Found ${articlesToImport.length} articles to import`)

  // Launch browser
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  let imported = 0
  let failed = 0

  for (const article of articlesToImport) {
    const slug = article.url.split('/clanek/')[1]?.replace(/\/$/, '')

    try {
      console.log(`\nImporting: ${slug}`)

      // Extract content
      const data = await extractArticleContent(page, article.url)

      if (data.contentLength === 0) {
        console.log(`  Warning: No content extracted for ${slug}`)
      }

      // Determine category (use first matching category)
      let categoryId = null
      for (const cat of article.categories) {
        if (categoryMapping[cat]) {
          categoryId = categoryMapping[cat]
          break
        }
      }

      // Parse date
      const publishedAt = parseCzechDate(article.date)

      // Generate UUID for article
      const articleId = crypto.randomUUID()

      // Insert article
      const { error: articleError } = await supabase
        .from('articles')
        .insert({
          id: articleId,
          slug: data.slug,
          status: 'published',
          published_at: publishedAt,
          updated_at: publishedAt,
          author_id: DEFAULT_AUTHOR_ID,
          category_id: categoryId,
          featured_image_url: data.featuredImage,
          is_featured: false
        })

      if (articleError) {
        throw new Error(`Article insert failed: ${articleError.message}`)
      }

      // Insert Czech translation
      const { error: translationError } = await supabase
        .from('article_translations')
        .insert({
          article_id: articleId,
          locale: 'cs',
          title: data.title,
          excerpt: null,
          content: data.content,
          seo_title: data.title.substring(0, 60),
          seo_description: null
        })

      if (translationError) {
        throw new Error(`Translation insert failed: ${translationError.message}`)
      }

      console.log(`  ✓ Imported: ${data.title.substring(0, 50)}...`)
      imported++

    } catch (error: any) {
      console.error(`  ✗ Failed: ${slug}`, error.message)
      failed++
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  await browser.close()

  console.log(`\n=== Import Complete ===`)
  console.log(`Imported: ${imported}`)
  console.log(`Failed: ${failed}`)
  console.log(`Skipped: ${articles.length - articlesToImport.length}`)
}

main().catch(console.error)
