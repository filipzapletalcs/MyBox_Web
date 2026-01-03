import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sanitizePath, isValidPath } from '@/lib/utils/validation'

type BucketName = 'article-images' | 'product-images' | 'media'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]

const BUCKET_LIMITS: Record<BucketName, number> = {
  'article-images': 5 * 1024 * 1024, // 5MB
  'product-images': 10 * 1024 * 1024, // 10MB
  media: 50 * 1024 * 1024, // 50MB
}

// GET /api/media - Seznam souborů (z media tabulky)
// Veřejný endpoint - nepotřebuje autentizaci pro listing
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)
  const bucket = searchParams.get('bucket') as BucketName | 'all' | null

  // Read from media table
  let query = supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  // Filter by bucket (if specified and not 'all' or 'media')
  // 'media' = show all files (for backwards compatibility with "Všechna média")
  if (bucket && bucket !== 'media' && bucket !== 'all') {
    if (!Object.keys(BUCKET_LIMITS).includes(bucket)) {
      return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
    }
    query = query.like('file_path', `${bucket}/%`)
  }
  // When bucket is 'media' or 'all' or not specified, show ALL files

  const { data, error } = await query

  if (error) {
    console.error('Media list error:', error)
    return NextResponse.json({ error: 'Failed to list media' }, { status: 500 })
  }

  // Transform to expected format with public URLs
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'

  const filesWithUrls = (data || []).map((file) => {
    // file_path is like "product-images/profi/gallery/image.jpg"
    // Extract bucket and path
    const parts = file.file_path.split('/')
    const fileBucket = parts[0]
    const filePath = parts.slice(1).join('/')

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${file.file_path}`

    return {
      id: file.id,
      name: file.filename,
      url: publicUrl,
      bucket: fileBucket,
      path: filePath,
      created_at: file.created_at,
      metadata: {
        size: file.file_size,
        mimetype: file.mime_type,
      },
    }
  })

  return NextResponse.json({ data: filesWithUrls })
}

// POST /api/media - Upload souboru
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const bucket = (formData.get('bucket') as BucketName) || 'media'
  const folder = formData.get('folder') as string | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!Object.keys(BUCKET_LIMITS).includes(bucket)) {
    return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
  }

  // Validate file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error: 'Invalid file type',
        allowed: ALLOWED_MIME_TYPES,
      },
      { status: 400 }
    )
  }

  // Validate file size
  if (file.size > BUCKET_LIMITS[bucket]) {
    return NextResponse.json(
      {
        error: `File too large. Max size: ${BUCKET_LIMITS[bucket] / 1024 / 1024}MB`,
      },
      { status: 400 }
    )
  }

  // Validate and sanitize folder path
  const sanitizedFolder = sanitizePath(folder)
  if (folder && !sanitizedFolder) {
    return NextResponse.json(
      { error: 'Invalid folder path' },
      { status: 400 }
    )
  }

  // Generate unique filename
  const ext = file.name.split('.').pop()
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const filename = `${timestamp}-${randomStr}.${ext}`

  // Build path with user folder for ownership
  const basePath = sanitizedFolder ? `${user.id}/${sanitizedFolder}` : user.id
  const filePath = `${basePath}/${filename}`

  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const fileBuffer = new Uint8Array(arrayBuffer)

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    console.error('Media upload error:', error)
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 })
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return NextResponse.json(
    {
      data: {
        path: data.path,
        url: publicUrl,
        bucket,
        filename,
        size: file.size,
        type: file.type,
      },
    },
    { status: 201 }
  )
}

// DELETE /api/media - Smazání souboru
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const bucket = (searchParams.get('bucket') || 'media') as BucketName
  const path = searchParams.get('path')

  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 })
  }

  // Validate path to prevent path traversal
  if (!isValidPath(path)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  if (!Object.keys(BUCKET_LIMITS).includes(bucket)) {
    return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
  }

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    console.error('Media delete error:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
