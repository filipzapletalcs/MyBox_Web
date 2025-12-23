import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
]

const MAX_FILE_SIZE = 250 * 1024 * 1024 // 250MB

// POST /api/documents/upload - Upload souboru dokumentu
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
  const locale = formData.get('locale') as string | null
  const folder = formData.get('folder') as string | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error: 'Invalid file type. Only PDF and ZIP files are allowed.',
        allowed: ALLOWED_MIME_TYPES,
      },
      { status: 400 }
    )
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      },
      { status: 400 }
    )
  }

  // Generate filename
  const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf'
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)

  // Sanitize original filename for use in path
  const sanitizedName = file.name
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single
    .toLowerCase()
    .substring(0, 50) // Limit length

  const filename = `${sanitizedName}-${timestamp}-${randomStr}.${ext}`

  // Build path
  let filePath = filename
  if (folder) {
    filePath = `${folder}/${filename}`
  }
  if (locale) {
    filePath = `${locale}/${filePath}`
  }

  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const fileBuffer = new Uint8Array(arrayBuffer)

  const { data, error } = await supabase.storage
    .from('documents')
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
  } = supabase.storage.from('documents').getPublicUrl(data.path)

  return NextResponse.json(
    {
      data: {
        path: data.path,
        url: publicUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        locale,
      },
    },
    { status: 201 }
  )
}

// DELETE /api/documents/upload - Smazání souboru
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 })
  }

  const { error } = await supabase.storage.from('documents').remove([path])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
