#!/usr/bin/env npx ts-node

/**
 * API Endpoint Test Script
 * Testuje všechny CRUD operace přes Supabase admin client
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const serviceRoleKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz'

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

interface TestResult {
  name: string
  success: boolean
  error?: string
}

const results: TestResult[] = []

function log(message: string, type: 'info' | 'success' | 'error' = 'info') {
  const prefix =
    type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'
  console.log(`${prefix} ${message}`)
}

async function testArticles() {
  log('Testing Articles API...', 'info')

  // GET all
  const { data: articles, error: getError } = await supabase
    .from('articles')
    .select('*, article_translations(*)')
    .limit(10)

  if (getError) {
    results.push({ name: 'Articles GET', success: false, error: getError.message })
    log(`GET articles failed: ${getError.message}`, 'error')
  } else {
    results.push({ name: 'Articles GET', success: true })
    log(`GET articles: ${articles?.length || 0} items`, 'success')
  }

  // Get admin user for author_id (required field)
  const { data: adminProfile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single()

  if (profileError || !adminProfile) {
    results.push({ name: 'Articles POST', success: false, error: 'No admin user found for author_id' })
    log('POST article failed: No admin user found', 'error')
    return
  }

  // POST
  const { data: newArticle, error: postError } = await supabase
    .from('articles')
    .insert({
      slug: 'test-article-' + Date.now(),
      status: 'draft',
      author_id: adminProfile.id,
    })
    .select()
    .single()

  if (postError) {
    results.push({ name: 'Articles POST', success: false, error: postError.message })
    log(`POST article failed: ${postError.message}`, 'error')
    return
  }

  results.push({ name: 'Articles POST', success: true })
  log(`POST article: created ${newArticle.id}`, 'success')

  // Add translation
  const { error: translationError } = await supabase
    .from('article_translations')
    .insert({
      article_id: newArticle.id,
      locale: 'cs',
      title: 'Test článek',
      excerpt: 'Krátký popis',
      content: { type: 'doc', content: [] },
    })

  if (translationError) {
    log(`POST translation failed: ${translationError.message}`, 'error')
  } else {
    log('POST translation: created', 'success')
  }

  // PATCH
  const { error: patchError } = await supabase
    .from('articles')
    .update({ status: 'published' })
    .eq('id', newArticle.id)

  if (patchError) {
    results.push({ name: 'Articles PATCH', success: false, error: patchError.message })
    log(`PATCH article failed: ${patchError.message}`, 'error')
  } else {
    results.push({ name: 'Articles PATCH', success: true })
    log('PATCH article: updated status', 'success')
  }

  // DELETE
  const { error: deleteError } = await supabase
    .from('articles')
    .delete()
    .eq('id', newArticle.id)

  if (deleteError) {
    results.push({ name: 'Articles DELETE', success: false, error: deleteError.message })
    log(`DELETE article failed: ${deleteError.message}`, 'error')
  } else {
    results.push({ name: 'Articles DELETE', success: true })
    log('DELETE article: deleted', 'success')
  }
}

async function testCategories() {
  log('\nTesting Categories API...', 'info')

  // GET all
  const { data: categories, error: getError } = await supabase
    .from('categories')
    .select('*, category_translations(*)')
    .limit(10)

  if (getError) {
    results.push({ name: 'Categories GET', success: false, error: getError.message })
    log(`GET categories failed: ${getError.message}`, 'error')
  } else {
    results.push({ name: 'Categories GET', success: true })
    log(`GET categories: ${categories?.length || 0} items`, 'success')
  }

  // POST
  const { data: newCategory, error: postError } = await supabase
    .from('categories')
    .insert({
      slug: 'test-category-' + Date.now(),
    })
    .select()
    .single()

  if (postError) {
    results.push({ name: 'Categories POST', success: false, error: postError.message })
    log(`POST category failed: ${postError.message}`, 'error')
    return
  }

  results.push({ name: 'Categories POST', success: true })
  log(`POST category: created ${newCategory.id}`, 'success')

  // Add translation
  const { error: translationError } = await supabase
    .from('category_translations')
    .insert({
      category_id: newCategory.id,
      locale: 'cs',
      name: 'Test kategorie',
    })

  if (translationError) {
    log(`POST category translation failed: ${translationError.message}`, 'error')
  } else {
    log('POST category translation: created', 'success')
  }

  // PATCH
  const { error: patchError } = await supabase
    .from('categories')
    .update({ slug: 'test-category-updated-' + Date.now() })
    .eq('id', newCategory.id)

  if (patchError) {
    results.push({ name: 'Categories PATCH', success: false, error: patchError.message })
    log(`PATCH category failed: ${patchError.message}`, 'error')
  } else {
    results.push({ name: 'Categories PATCH', success: true })
    log('PATCH category: updated slug', 'success')
  }

  // DELETE
  const { error: deleteError } = await supabase
    .from('categories')
    .delete()
    .eq('id', newCategory.id)

  if (deleteError) {
    results.push({ name: 'Categories DELETE', success: false, error: deleteError.message })
    log(`DELETE category failed: ${deleteError.message}`, 'error')
  } else {
    results.push({ name: 'Categories DELETE', success: true })
    log('DELETE category: deleted', 'success')
  }
}

async function testProducts() {
  log('\nTesting Products API...', 'info')

  // GET all
  const { data: products, error: getError } = await supabase
    .from('products')
    .select('*, product_translations(*)')
    .limit(10)

  if (getError) {
    results.push({ name: 'Products GET', success: false, error: getError.message })
    log(`GET products failed: ${getError.message}`, 'error')
  } else {
    results.push({ name: 'Products GET', success: true })
    log(`GET products: ${products?.length || 0} items`, 'success')
  }

  // Test existing MyBox Profi product
  const { data: myboxProfi, error: myboxError } = await supabase
    .from('products')
    .select(`
      *,
      product_translations(*),
      product_images(*),
      product_specifications(*),
      product_feature_points(*, product_feature_point_translations(*)),
      product_color_variants(*, product_color_variant_translations(*)),
      product_content_sections(*, product_content_section_translations(*))
    `)
    .eq('slug', 'mybox-profi')
    .single()

  if (myboxError) {
    results.push({ name: 'Products GET mybox-profi', success: false, error: myboxError.message })
    log(`GET mybox-profi failed: ${myboxError.message}`, 'error')
  } else {
    results.push({ name: 'Products GET mybox-profi', success: true })
    log(`GET mybox-profi: found with ${myboxProfi?.product_translations?.length || 0} translations, ${myboxProfi?.product_specifications?.length || 0} specs, ${myboxProfi?.product_images?.length || 0} images`, 'success')
  }

  // POST new product (type must be 'ac_mybox' or 'dc_alpitronic')
  const { data: newProduct, error: postError } = await supabase
    .from('products')
    .insert({
      slug: 'test-product-' + Date.now(),
      type: 'ac_mybox',
      is_active: false,
    })
    .select()
    .single()

  if (postError) {
    results.push({ name: 'Products POST', success: false, error: postError.message })
    log(`POST product failed: ${postError.message}`, 'error')
    return
  }

  results.push({ name: 'Products POST', success: true })
  log(`POST product: created ${newProduct.id}`, 'success')

  // Add translation
  const { error: translationError } = await supabase
    .from('product_translations')
    .insert({
      product_id: newProduct.id,
      locale: 'cs',
      name: 'Test produkt',
      tagline: 'Test tagline',
      description: 'Test popis',
    })

  if (translationError) {
    log(`POST product translation failed: ${translationError.message}`, 'error')
  } else {
    log('POST product translation: created', 'success')
  }

  // DELETE
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', newProduct.id)

  if (deleteError) {
    results.push({ name: 'Products DELETE', success: false, error: deleteError.message })
    log(`DELETE product failed: ${deleteError.message}`, 'error')
  } else {
    results.push({ name: 'Products DELETE', success: true })
    log('DELETE product: deleted', 'success')
  }
}

async function testFaqs() {
  log('\nTesting FAQs API...', 'info')

  // GET all
  const { data: faqs, error: getError } = await supabase
    .from('faqs')
    .select('*, faq_translations(*)')
    .limit(10)

  if (getError) {
    results.push({ name: 'FAQs GET', success: false, error: getError.message })
    log(`GET faqs failed: ${getError.message}`, 'error')
  } else {
    results.push({ name: 'FAQs GET', success: true })
    log(`GET faqs: ${faqs?.length || 0} items`, 'success')
  }

  // POST
  const { data: newFaq, error: postError } = await supabase
    .from('faqs')
    .insert({
      slug: 'test-faq-' + Date.now(),
      is_active: true,
    })
    .select()
    .single()

  if (postError) {
    results.push({ name: 'FAQs POST', success: false, error: postError.message })
    log(`POST faq failed: ${postError.message}`, 'error')
    return
  }

  results.push({ name: 'FAQs POST', success: true })
  log(`POST faq: created ${newFaq.id}`, 'success')

  // Add translation
  const { error: translationError } = await supabase
    .from('faq_translations')
    .insert({
      faq_id: newFaq.id,
      locale: 'cs',
      question: 'Test otázka?',
      answer: 'Test odpověď.',
    })

  if (translationError) {
    log(`POST faq translation failed: ${translationError.message}`, 'error')
  } else {
    log('POST faq translation: created', 'success')
  }

  // DELETE
  const { error: deleteError } = await supabase
    .from('faqs')
    .delete()
    .eq('id', newFaq.id)

  if (deleteError) {
    results.push({ name: 'FAQs DELETE', success: false, error: deleteError.message })
    log(`DELETE faq failed: ${deleteError.message}`, 'error')
  } else {
    results.push({ name: 'FAQs DELETE', success: true })
    log('DELETE faq: deleted', 'success')
  }
}

async function testTags() {
  log('\nTesting Tags API...', 'info')

  // GET all (tags has name directly, no translations table)
  const { data: tags, error: getError } = await supabase
    .from('tags')
    .select('*')
    .limit(10)

  if (getError) {
    results.push({ name: 'Tags GET', success: false, error: getError.message })
    log(`GET tags failed: ${getError.message}`, 'error')
  } else {
    results.push({ name: 'Tags GET', success: true })
    log(`GET tags: ${tags?.length || 0} items`, 'success')
  }

  // POST (name is required directly on tags table)
  const { data: newTag, error: postError } = await supabase
    .from('tags')
    .insert({
      slug: 'test-tag-' + Date.now(),
      name: 'Test tag',
    })
    .select()
    .single()

  if (postError) {
    results.push({ name: 'Tags POST', success: false, error: postError.message })
    log(`POST tag failed: ${postError.message}`, 'error')
    return
  }

  results.push({ name: 'Tags POST', success: true })
  log(`POST tag: created ${newTag.id}`, 'success')

  // PATCH
  const { error: patchError } = await supabase
    .from('tags')
    .update({ name: 'Updated test tag' })
    .eq('id', newTag.id)

  if (patchError) {
    results.push({ name: 'Tags PATCH', success: false, error: patchError.message })
    log(`PATCH tag failed: ${patchError.message}`, 'error')
  } else {
    results.push({ name: 'Tags PATCH', success: true })
    log('PATCH tag: updated name', 'success')
  }

  // DELETE
  const { error: deleteError } = await supabase
    .from('tags')
    .delete()
    .eq('id', newTag.id)

  if (deleteError) {
    results.push({ name: 'Tags DELETE', success: false, error: deleteError.message })
    log(`DELETE tag failed: ${deleteError.message}`, 'error')
  } else {
    results.push({ name: 'Tags DELETE', success: true })
    log('DELETE tag: deleted', 'success')
  }
}

async function testMedia() {
  log('\nTesting Media API...', 'info')

  // GET all
  const { data: media, error: getError } = await supabase
    .from('media')
    .select('*')
    .limit(10)

  if (getError) {
    results.push({ name: 'Media GET', success: false, error: getError.message })
    log(`GET media failed: ${getError.message}`, 'error')
  } else {
    results.push({ name: 'Media GET', success: true })
    log(`GET media: ${media?.length || 0} items`, 'success')
  }

  // Storage bucket test
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

  if (bucketsError) {
    results.push({ name: 'Storage buckets', success: false, error: bucketsError.message })
    log(`Storage buckets failed: ${bucketsError.message}`, 'error')
  } else {
    results.push({ name: 'Storage buckets', success: true })
    log(`Storage buckets: ${buckets?.map((b) => b.name).join(', ') || 'none'}`, 'success')
  }
}

async function main() {
  console.log('=' .repeat(50))
  console.log('🧪 MyBox.eco API Test Suite')
  console.log('=' .repeat(50))

  await testArticles()
  await testCategories()
  await testProducts()
  await testFaqs()
  await testTags()
  await testMedia()

  console.log('\n' + '=' .repeat(50))
  console.log('📊 Test Summary')
  console.log('=' .repeat(50))

  const passed = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  console.log(`\nTotal: ${results.length} tests`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)

  if (failed > 0) {
    console.log('\nFailed tests:')
    results.filter((r) => !r.success).forEach((r) => {
      console.log(`  - ${r.name}: ${r.error}`)
    })
  }

  console.log('\n')
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(console.error)
