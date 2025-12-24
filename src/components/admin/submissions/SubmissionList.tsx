'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { cs } from 'date-fns/locale'
import {
  Eye,
  Trash2,
  Mail,
  Phone,
  Building2,
  MapPin,
  Clock,
  CheckCircle,
  Circle,
} from 'lucide-react'
import { Button, Card, Badge, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label } from '@/components/ui'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'

interface ContactSubmission {
  id: string
  company: string
  contact_person: string
  email: string
  phone: string | null
  station_type: string
  location: string
  segment: string
  message: string
  is_read: boolean | null
  notes: string | null
  created_at: string | null
}

interface SubmissionListProps {
  initialSubmissions: ContactSubmission[]
}

const stationTypeLabels: Record<string, string> = {
  'ac-home': 'AC Home',
  'ac-company': 'AC Firma',
  dc: 'DC',
  service: 'Servis',
  other: 'Jiné',
}

const segmentLabels: Record<string, string> = {
  home: 'Domácnost',
  company: 'Firma',
  developer: 'Developer',
  municipality: 'Obec',
  hospitality: 'Hospitality',
  retail: 'Retail',
  fleet: 'Fleet',
  other: 'Jiné',
}

export function SubmissionList({ initialSubmissions }: SubmissionListProps) {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === 'unread') return !s.is_read
    if (filter === 'read') return s.is_read
    return true
  })

  const unreadCount = submissions.filter((s) => !s.is_read).length

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contact-submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: true }),
      })

      if (!response.ok) throw new Error('Failed to update')

      setSubmissions(
        submissions.map((s) => (s.id === id ? { ...s, is_read: true } : s))
      )
      toast.success('Označeno jako přečtené')
    } catch {
      toast.error('Nepodařilo se aktualizovat')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/contact-submissions/${deleteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      setSubmissions(submissions.filter((s) => s.id !== deleteId))
      toast.success('Zpráva byla smazána')
    } catch {
      toast.error('Nepodařilo se smazat zprávu')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Zprávy z formuláře</h1>
          <p className="mt-1 text-text-muted">
            {unreadCount > 0
              ? `${unreadCount} nepřečtených zpráv`
              : 'Všechny zprávy přečteny'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm">Filtr:</Label>
            <Select value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread' | 'read')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny ({submissions.length})</SelectItem>
                <SelectItem value="unread">Nepřečtené ({unreadCount})</SelectItem>
                <SelectItem value="read">Přečtené ({submissions.length - unreadCount})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-bg-tertiary p-4">
              <Mail className="h-8 w-8 text-text-muted" />
            </div>
            <p className="mt-4 text-lg font-medium text-text-primary">
              {filter === 'unread'
                ? 'Žádné nepřečtené zprávy'
                : 'Zatím žádné zprávy'}
            </p>
            <p className="mt-1 text-text-muted">
              Zprávy z kontaktního formuláře se zobrazí zde
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card
              key={submission.id}
              className={`p-6 transition-all hover:border-green-500/30 ${
                !submission.is_read ? 'border-l-4 border-l-green-500' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    {!submission.is_read ? (
                      <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                    ) : (
                      <CheckCircle className="h-3 w-3 text-text-muted" />
                    )}
                    <h3 className="font-semibold text-text-primary truncate">
                      {submission.company}
                    </h3>
                    <Badge
                      variant={submission.is_read ? 'outline' : 'primary'}
                      size="sm"
                    >
                      {stationTypeLabels[submission.station_type] || submission.station_type}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {segmentLabels[submission.segment] || submission.segment}
                    </Badge>
                  </div>

                  {/* Contact info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-3">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {submission.contact_person}
                    </span>
                    <a
                      href={`mailto:${submission.email}`}
                      className="flex items-center gap-1 hover:text-green-400"
                    >
                      <Mail className="h-4 w-4" />
                      {submission.email}
                    </a>
                    {submission.phone && (
                      <a
                        href={`tel:${submission.phone}`}
                        className="flex items-center gap-1 hover:text-green-400"
                      >
                        <Phone className="h-4 w-4" />
                        {submission.phone}
                      </a>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {submission.location}
                    </span>
                  </div>

                  {/* Message preview */}
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {submission.message}
                  </p>

                  {/* Timestamp */}
                  {submission.created_at && (
                    <div className="flex items-center gap-1 mt-3 text-xs text-text-muted">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(submission.created_at), {
                        addSuffix: true,
                        locale: cs,
                      })}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!submission.is_read && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMarkAsRead(submission.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Přečteno
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/contacts/submissions/${submission.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(submission.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Smazat zprávu"
        description="Opravdu chcete smazat tuto zprávu? Tato akce je nevratná."
        confirmText="Smazat"
        cancelText="Zrušit"
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
