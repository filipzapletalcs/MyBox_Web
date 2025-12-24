import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SubmissionDetail } from '@/components/admin/submissions'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: submission, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !submission) {
    notFound()
  }

  // Automaticky označit jako přečtené při zobrazení
  if (!submission.is_read) {
    await supabase
      .from('contact_submissions')
      .update({ is_read: true })
      .eq('id', id)
    submission.is_read = true
  }

  return <SubmissionDetail submission={submission} />
}
