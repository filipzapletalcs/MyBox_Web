import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

// GET /api/media - Seznam souborů
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const bucket = (searchParams.get('bucket') || 'media') as BucketName
  const path = searchParams.get('path') || ''

  if (!Object.keys(BUCKET_LIMITS).includes(bucket)) {
    return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
  }

  const { data, error } = await supabase.storage.from(bucket).list(path, {
    limit: 100,
    sortBy: { column: 'created_at', order: 'desc' },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Add public URLs to files
  const filesWithUrls = data
    .filter((item) => item.id) // Filter out folders
    .map((file) => {
      const filePath = path ? `${path}/${file.name}` : file.name
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      return {
        ...file,
        url: publicUrl,
        bucket,
        path: filePath,
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

  // Generate unique filename
  const ext = file.name.split('.').pop()
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const filename = `${timestamp}-${randomStr}.${ext}`

  // Build path with user folder for ownership
  const basePath = folder ? `${user.id}/${folder}` : user.id
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
    return NextResponse.json({ error: error.message }, { status: 500 })
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

  if (!Object.keys(BUCKET_LIMITS).includes(bucket)) {
    return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
  }

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
