import { createClient } from '@/lib/supabase/server'
import { SubmissionList } from '@/components/admin/submissions'

export const dynamic = 'force-dynamic'

export default async function SubmissionsPage() {
  const supabase = await createClient()

  const { data: submissions, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching submissions:', error)
    return (
      <div className="p-6">
        <p className="text-red-500">Chyba při načítání zpráv</p>
      </div>
    )
  }

  return <SubmissionList initialSubmissions={submissions || []} />
}
