'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TeamMemberForm } from '@/components/admin/team'
import type { TeamMemberFormData } from '@/lib/validations/team-member'

export default function NewTeamMemberPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: TeamMemberFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create team member')
      }

      toast.success('Člen týmu byl vytvořen')
      router.push('/admin/contacts/team')
      router.refresh()
    } catch (error) {
      console.error('Error creating team member:', error)
      toast.error(
        error instanceof Error ? error.message : 'Nepodařilo se vytvořit člena týmu'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return <TeamMemberForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
}
