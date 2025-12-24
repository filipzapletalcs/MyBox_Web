'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Clock,
  CheckCircle,
  Trash2,
  Save,
} from 'lucide-react'
import { Button, Card, Badge, Textarea, Label } from '@/components/ui'
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
  updated_at: string | null
}

interface SubmissionDetailProps {
  submission: ContactSubmission
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

export function SubmissionDetail({ submission: initialSubmission }: SubmissionDetailProps) {
  const router = useRouter()
  const [submission, setSubmission] = useState(initialSubmission)
  const [notes, setNotes] = useState(submission.notes || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleMarkAsRead = async () => {
    try {
      const response = await fetch(`/api/contact-submissions/${submission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: true }),
      })

      if (!response.ok) throw new Error('Failed to update')

      setSubmission({ ...submission, is_read: true })
      toast.success('Označeno jako přečtené')
    } catch {
      toast.error('Nepodařilo se aktualizovat')
    }
  }

  const handleSaveNotes = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/contact-submissions/${submission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setSubmission({ ...submission, notes })
      toast.success('Poznámky uloženy')
    } catch {
      toast.error('Nepodařilo se uložit poznámky')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/contact-submissions/${submission.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Zpráva smazána')
      router.push('/admin/contacts/submissions')
    } catch {
      toast.error('Nepodařilo se smazat')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/contacts/submissions')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zpět
          </Button>
          <h1 className="text-2xl font-bold text-text-primary">
            Detail zprávy
          </h1>
          {!submission.is_read && (
            <Badge variant="default">Nepřečteno</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!submission.is_read && (
            <Button variant="secondary" onClick={handleMarkAsRead}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Označit jako přečtené
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Smazat
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Kontaktní údaje
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-text-muted mt-0.5" />
                <div>
                  <p className="text-sm text-text-muted">Společnost</p>
                  <p className="font-medium text-text-primary">{submission.company}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-text-muted mt-0.5" />
                <div>
                  <p className="text-sm text-text-muted">Kontaktní osoba</p>
                  <p className="font-medium text-text-primary">{submission.contact_person}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-text-muted mt-0.5" />
                <div>
                  <p className="text-sm text-text-muted">E-mail</p>
                  <a
                    href={`mailto:${submission.email}`}
                    className="font-medium text-green-400 hover:text-green-300"
                  >
                    {submission.email}
                  </a>
                </div>
              </div>
              {submission.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-text-muted mt-0.5" />
                  <div>
                    <p className="text-sm text-text-muted">Telefon</p>
                    <a
                      href={`tel:${submission.phone}`}
                      className="font-medium text-green-400 hover:text-green-300"
                    >
                      {submission.phone}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-text-muted mt-0.5" />
                <div>
                  <p className="text-sm text-text-muted">Lokalita</p>
                  <p className="font-medium text-text-primary">{submission.location}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Message */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Zpráva
            </h2>
            <p className="text-text-secondary whitespace-pre-wrap">
              {submission.message}
            </p>
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                Interní poznámky
              </h2>
              <Button
                size="sm"
                onClick={handleSaveNotes}
                isLoading={isSaving}
                disabled={notes === (submission.notes || '')}
              >
                <Save className="mr-2 h-4 w-4" />
                Uložit
              </Button>
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Přidejte interní poznámky k této zprávě..."
              rows={4}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Informace
            </h2>
            <div className="space-y-4">
              <div>
                <Label className="text-text-muted">Typ stanice</Label>
                <p className="font-medium text-text-primary">
                  {stationTypeLabels[submission.station_type] || submission.station_type}
                </p>
              </div>
              <div>
                <Label className="text-text-muted">Segment</Label>
                <p className="font-medium text-text-primary">
                  {segmentLabels[submission.segment] || submission.segment}
                </p>
              </div>
              {submission.created_at && (
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-text-muted mt-1" />
                  <div>
                    <p className="text-sm text-text-muted">Odesláno</p>
                    <p className="text-sm text-text-primary">
                      {format(new Date(submission.created_at), 'PPpp', { locale: cs })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Rychlé akce
            </h2>
            <div className="space-y-2">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => window.open(`mailto:${submission.email}`, '_blank')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Odpovědět e-mailem
              </Button>
              {submission.phone && (
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => window.open(`tel:${submission.phone}`, '_blank')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Zavolat
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
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
