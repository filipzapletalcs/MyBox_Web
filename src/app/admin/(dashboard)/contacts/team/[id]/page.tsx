'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TeamMemberForm } from '@/components/admin/team'
import type { TeamMemberFormData } from '@/lib/validations/team-member'

interface TeamMember {
  id: string
  image_url: string | null
  email: string
  phone: string | null
  linkedin_url: string | null
  sort_order: number
  is_active: boolean
  translations: {
    locale: string
    name: string
    position: string
    description?: string | null
  }[]
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditTeamMemberPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [member, setMember] = useState<TeamMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`/api/team-members/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch team member')
        }
        const { data } = await response.json()
        setMember(data)
      } catch (error) {
        console.error('Error fetching team member:', error)
        toast.error('Nepodařilo se načíst člena týmu')
        router.push('/admin/contacts/team')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMember()
  }, [id, router])

  const handleSubmit = async (data: TeamMemberFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update team member')
      }

      toast.success('Změny byly uloženy')
      router.push('/admin/contacts/team')
      router.refresh()
    } catch (error) {
      console.error('Error updating team member:', error)
      toast.error(
        error instanceof Error ? error.message : 'Nepodařilo se uložit změny'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
      </div>
    )
  }

  if (!member) {
    return null
  }

  return (
    <TeamMemberForm
      member={member}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
