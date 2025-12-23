#!/usr/bin/env npx ts-node

/**
 * Sync files from Supabase Storage to media table
 * Also uploads videos from /public/videos
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

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

async function uploadVideos() {
  console.log('\n🎬 Uploading videos...')

  const videosDir = path.join(process.cwd(), 'public', 'videos')
  if (!fs.existsSync(videosDir)) {
    console.log('  No videos directory found')
    return
  }

  const files = fs.readdirSync(videosDir).filter(f =>
    /\.(mp4|webm|mov)$/i.test(f)
  )

  console.log(`  Found ${files.length} video files`)

  for (const file of files) {
    const localPath = path.join(videosDir, file)
    const storagePath = `videos/${file}`

    process.stdout.write(`  Uploading ${file}... `)

    try {
      const fileBuffer = fs.readFileSync(localPath)
      const mimeType = getMimeType(localPath)

      const { error } = await supabase.storage
        .from('media')
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        })

      if (error) {
        console.log(`❌ ${error.message}`)
      } else {
        console.log('✅')
      }
    } catch (err) {
      console.log(`❌ ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }
}

async function syncStorageToMediaTable() {
  console.log('\n📊 Syncing Storage to media table...')

  const buckets = ['product-images', 'article-images', 'media']
  let totalSynced = 0

  for (const bucket of buckets) {
    console.log(`\n  Bucket: ${bucket}`)

    // List all files in bucket (recursively)
    const files = await listAllFiles(bucket, '')
    console.log(`    Found ${files.length} files`)

    for (const file of files) {
      // Check if already in media table
      const { data: existing } = await supabase
        .from('media')
        .select('id')
        .eq('file_path', `${bucket}/${file.name}`)
        .single()

      if (existing) {
        continue // Already synced
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(file.name)

      // Insert into media table
      const { error } = await supabase.from('media').insert({
        filename: path.basename(file.name),
        original_filename: path.basename(file.name),
        file_path: `${bucket}/${file.name}`,
        file_size: file.metadata?.size || 0,
        mime_type: file.metadata?.mimetype || getMimeType(file.name),
        alt_text: null,
      })

      if (error) {
        console.log(`    ❌ ${file.name}: ${error.message}`)
      } else {
        totalSynced++
        console.log(`    ✅ ${file.name}`)
      }
    }
  }

  console.log(`\n  Total synced: ${totalSynced} files`)
}

async function listAllFiles(bucket: string, folder: string): Promise<any[]> {
  const allFiles: any[] = []

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, { limit: 1000 })

  if (error || !data) {
    return allFiles
  }

  for (const item of data) {
    const itemPath = folder ? `${folder}/${item.name}` : item.name

    if (item.id === null) {
      // It's a folder, recurse
      const subFiles = await listAllFiles(bucket, itemPath)
      allFiles.push(...subFiles)
    } else {
      // It's a file
      allFiles.push({ ...item, name: itemPath })
    }
  }

  return allFiles
}

async function main() {
  console.log('=' .repeat(60))
  console.log('🔄 Sync Storage to Media Table')
  console.log('=' .repeat(60))

  await uploadVideos()
  await syncStorageToMediaTable()

  // Show final count
  const { count } = await supabase
    .from('media')
    .select('*', { count: 'exact', head: true })

  console.log('\n' + '=' .repeat(60))
  console.log(`📁 Media table now has ${count} files`)
  console.log('=' .repeat(60))
  console.log('')
}

main().catch(console.error)
