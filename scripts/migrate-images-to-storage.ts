#!/usr/bin/env npx ts-node

/**
 * Migration script: Upload images from /public to Supabase Storage
 *
 * Structure:
 * - public/images/products/* → product-images bucket
 * - public/images/logos/* → media bucket (logos folder)
 * - public/images/logo-mybox*.svg → STAY in /public (branding)
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = 'http://127.0.0.1:54321'
const serviceRoleKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz'

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images')

interface UploadResult {
  file: string
  bucket: string
  storagePath: string
  success: boolean
  error?: string
  publicUrl?: string
}

const results: UploadResult[] = []

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

async function uploadFile(
  localPath: string,
  bucket: string,
  storagePath: string
): Promise<UploadResult> {
  const result: UploadResult = {
    file: localPath,
    bucket,
    storagePath,
    success: false,
  }

  try {
    const fileBuffer = fs.readFileSync(localPath)
    const mimeType = getMimeType(localPath)

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: true, // Overwrite if exists
      })

    if (error) {
      result.error = error.message
      return result
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath)

    result.success = true
    result.publicUrl = urlData.publicUrl
    return result
  } catch (err) {
    result.error = err instanceof Error ? err.message : 'Unknown error'
    return result
  }
}

async function migrateProductImages() {
  console.log('\n📦 Migrating product images...')

  const productsDir = path.join(IMAGES_DIR, 'products')
  if (!fs.existsSync(productsDir)) {
    console.log('  No products directory found')
    return
  }

  // Recursively find all images
  function findImages(dir: string, basePath: string = ''): string[] {
    const files: string[] = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name

      if (entry.isDirectory()) {
        files.push(...findImages(fullPath, relativePath))
      } else if (/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(entry.name)) {
        files.push(relativePath)
      }
    }
    return files
  }

  const images = findImages(productsDir)
  console.log(`  Found ${images.length} product images`)

  for (const imagePath of images) {
    const localPath = path.join(productsDir, imagePath)
    const storagePath = imagePath // Keep same structure: profi/gallery/image.jpg

    process.stdout.write(`  Uploading ${imagePath}... `)
    const result = await uploadFile(localPath, 'product-images', storagePath)
    results.push(result)

    if (result.success) {
      console.log('✅')
    } else {
      console.log(`❌ ${result.error}`)
    }
  }
}

async function migrateLogoImages() {
  console.log('\n🏢 Migrating partner logos...')

  const logosDir = path.join(IMAGES_DIR, 'logos')
  if (!fs.existsSync(logosDir)) {
    console.log('  No logos directory found')
    return
  }

  const files = fs.readdirSync(logosDir).filter(f =>
    /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(f)
  )

  console.log(`  Found ${files.length} logo images`)

  for (const file of files) {
    const localPath = path.join(logosDir, file)
    const storagePath = `logos/${file}`

    process.stdout.write(`  Uploading ${file}... `)
    const result = await uploadFile(localPath, 'media', storagePath)
    results.push(result)

    if (result.success) {
      console.log('✅')
    } else {
      console.log(`❌ ${result.error}`)
    }
  }
}

async function updateDatabaseUrls() {
  console.log('\n🔄 Updating database URLs...')

  // Update product_images table
  const { data: productImages, error: fetchError } = await supabase
    .from('product_images')
    .select('id, url')

  if (fetchError) {
    console.log(`  ❌ Failed to fetch product images: ${fetchError.message}`)
    return
  }

  console.log(`  Found ${productImages?.length || 0} product image records`)

  for (const img of productImages || []) {
    // Convert /images/products/profi/gallery/image.jpg
    // to storage URL
    if (img.url.startsWith('/images/products/')) {
      const storagePath = img.url.replace('/images/products/', '')
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(storagePath)

      const newUrl = urlData.publicUrl

      const { error: updateError } = await supabase
        .from('product_images')
        .update({ url: newUrl })
        .eq('id', img.id)

      if (updateError) {
        console.log(`  ❌ Failed to update ${img.id}: ${updateError.message}`)
      } else {
        console.log(`  ✅ Updated: ${img.url} → Storage URL`)
      }
    }
  }

  // Update product color variants
  const { data: colorVariants, error: cvError } = await supabase
    .from('product_color_variants')
    .select('id, image_url')

  if (!cvError && colorVariants) {
    console.log(`  Found ${colorVariants.length} color variant records`)

    for (const cv of colorVariants) {
      if (cv.image_url?.startsWith('/images/products/')) {
        const storagePath = cv.image_url.replace('/images/products/', '')
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(storagePath)

        await supabase
          .from('product_color_variants')
          .update({ image_url: urlData.publicUrl })
          .eq('id', cv.id)

        console.log(`  ✅ Updated color variant: ${cv.image_url} → Storage URL`)
      }
    }
  }

  // Update products table (hero_image, front_image)
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, hero_image, front_image')

  if (!prodError && products) {
    for (const prod of products) {
      const updates: Record<string, string> = {}

      if (prod.hero_image?.startsWith('/images/products/')) {
        const storagePath = prod.hero_image.replace('/images/products/', '')
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(storagePath)
        updates.hero_image = urlData.publicUrl
      }

      if (prod.front_image?.startsWith('/images/products/')) {
        const storagePath = prod.front_image.replace('/images/products/', '')
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(storagePath)
        updates.front_image = urlData.publicUrl
      }

      if (Object.keys(updates).length > 0) {
        await supabase
          .from('products')
          .update(updates)
          .eq('id', prod.id)

        console.log(`  ✅ Updated product ${prod.id} images`)
      }
    }
  }
}

async function main() {
  console.log('=' .repeat(60))
  console.log('🚀 MyBox.eco Image Migration to Supabase Storage')
  console.log('=' .repeat(60))

  // Check buckets exist
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketNames = buckets?.map(b => b.name) || []

  console.log(`\n📁 Available buckets: ${bucketNames.join(', ')}`)

  if (!bucketNames.includes('product-images')) {
    console.log('❌ product-images bucket not found!')
    return
  }
  if (!bucketNames.includes('media')) {
    console.log('❌ media bucket not found!')
    return
  }

  await migrateProductImages()
  await migrateLogoImages()
  await updateDatabaseUrls()

  // Summary
  console.log('\n' + '=' .repeat(60))
  console.log('📊 Migration Summary')
  console.log('=' .repeat(60))

  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  console.log(`\nTotal files: ${results.length}`)
  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)

  if (failed > 0) {
    console.log('\nFailed uploads:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.file}: ${r.error}`)
    })
  }

  console.log('\n📝 Next steps:')
  console.log('1. Update components to use getStorageUrl() helper')
  console.log('2. Test that images load correctly')
  console.log('3. Remove migrated images from /public/images/')
  console.log('')
}

main().catch(console.error)
