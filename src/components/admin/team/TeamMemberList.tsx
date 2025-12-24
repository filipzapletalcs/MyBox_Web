'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Linkedin,
  UserCircle,
} from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'

interface TeamMemberTranslation {
  locale: string
  name: string
  position: string
  description?: string | null
}

interface TeamMember {
  id: string
  image_url: string | null
  email: string
  phone: string | null
  linkedin_url: string | null
  sort_order: number | null
  is_active: boolean | null
  translations: TeamMemberTranslation[]
}

interface TeamMemberListProps {
  initialMembers: TeamMember[]
}

// Sortable member item component
function SortableMemberItem({
  member,
  onEdit,
  onDelete,
}: {
  member: TeamMember
  onEdit: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Najít český překlad
  const csTranslation = member.translations.find((t) => t.locale === 'cs')
  const name = csTranslation?.name || 'Bez jména'
  const position = csTranslation?.position || ''

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-secondary p-4 transition-colors hover:border-border-default"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab rounded p-1 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Avatar/Photo */}
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-bg-tertiary">
        {member.image_url ? (
          <img
            src={member.image_url}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div className={`flex h-full w-full items-center justify-center ${member.image_url ? 'hidden' : ''}`}>
          <UserCircle className="h-8 w-8 text-text-muted" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-text-primary truncate">{name}</h3>
          {!member.is_active && (
            <Badge variant="warning" size="sm">
              Skrytý
            </Badge>
          )}
        </div>
        <p className="text-sm text-text-muted truncate">{position}</p>
      </div>

      {/* Contact info */}
      <div className="hidden md:flex items-center gap-4 text-sm text-text-muted">
        <a
          href={`mailto:${member.email}`}
          className="flex items-center gap-1 hover:text-green-400 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Mail className="h-4 w-4" />
          <span className="hidden lg:inline">{member.email}</span>
        </a>
        {member.phone && (
          <a
            href={`tel:${member.phone}`}
            className="flex items-center gap-1 hover:text-green-400 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden lg:inline">{member.phone}</span>
          </a>
        )}
        {member.linkedin_url && (
          <a
            href={member.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-green-400 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function TeamMemberList({ initialMembers }: TeamMemberListProps) {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = members.findIndex((m) => m.id === active.id)
      const newIndex = members.findIndex((m) => m.id === over.id)

      const newMembers = arrayMove(members, oldIndex, newIndex)
      setMembers(newMembers)

      // Uložit nové pořadí na server
      try {
        const reorderData = newMembers.map((m, index) => ({
          id: m.id,
          sort_order: index,
        }))

        const response = await fetch('/api/team-members/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ members: reorderData }),
        })

        if (!response.ok) {
          throw new Error('Failed to reorder')
        }

        toast.success('Pořadí uloženo')
      } catch {
        // Vrátit zpět při chybě
        setMembers(initialMembers)
        toast.error('Nepodařilo se uložit pořadí')
      }
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/team-members/${deleteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete')
      }

      setMembers(members.filter((m) => m.id !== deleteId))
      toast.success('Člen týmu byl smazán')
      router.refresh()
    } catch {
      toast.error('Nepodařilo se smazat člena týmu')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Členové týmu</h1>
          <p className="mt-1 text-text-muted">
            Spravujte členy týmu zobrazované na kontaktní stránce
          </p>
        </div>
        <Button onClick={() => router.push('/admin/contacts/team/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Přidat člena
        </Button>
      </div>

      {members.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-bg-tertiary p-4">
              <UserCircle className="h-8 w-8 text-text-muted" />
            </div>
            <p className="mt-4 text-lg font-medium text-text-primary">
              Zatím žádní členové týmu
            </p>
            <p className="mt-1 text-text-muted">
              Přidejte prvního člena týmu
            </p>
            <Button
              className="mt-6"
              onClick={() => router.push('/admin/contacts/team/new')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Přidat člena
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          <p className="mb-4 text-sm text-text-muted">
            Přetažením změníte pořadí členů ({members.length} členů)
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={members.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {members.map((member) => (
                  <SortableMemberItem
                    key={member.id}
                    member={member}
                    onEdit={() => router.push(`/admin/contacts/team/${member.id}`)}
                    onDelete={() => setDeleteId(member.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Card>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Smazat člena týmu"
        description="Opravdu chcete smazat tohoto člena týmu? Tato akce je nevratná."
        confirmText="Smazat"
        cancelText="Zrušit"
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
