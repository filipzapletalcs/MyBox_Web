import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// DELETE /api/tags/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase.from('tags').delete().eq('id', id)

  if (error) {
    console.error('Tag delete error:', error)
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
