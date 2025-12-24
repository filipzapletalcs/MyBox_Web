import { createClient } from '@/lib/supabase/server'
import { CompanyDetailsForm } from '@/components/admin/settings/CompanyDetailsForm'

export default async function CompanySettingsPage() {
  const supabase = await createClient()

  const { data: companyDetails, error } = await supabase
    .from('company_details')
    .select('*')
    .single()

  if (error || !companyDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">
          Nepodařilo se načíst firemní údaje. Zkontrolujte databázi.
        </p>
      </div>
    )
  }

  return <CompanyDetailsForm initialData={companyDetails} />
}
