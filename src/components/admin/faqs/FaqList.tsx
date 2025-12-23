'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, ConfirmDialog, type ColumnDef } from '@/components/admin'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { MoreHorizontal, Pencil, Trash2, Plus, HelpCircle, Eye, EyeOff } from 'lucide-react'

export interface Faq {
  id: string
  slug: string
  category: string | null
  sort_order: number | null
  is_active: boolean | null
  created_at: string | null
  translations: {
    locale: string
    question: string
    answer: string
  }[]
  [key: string]: unknown
}

interface FaqListProps {
  faqs: Faq[]
}

export function FaqList({ faqs }: FaqListProps) {
  const router = useRouter()
  const [deleteFaq, setDeleteFaq] = useState<Faq | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteFaq) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/faqs/${deleteFaq.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Nepodařilo se smazat FAQ')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsDeleting(false)
      setDeleteFaq(null)
    }
  }

  const getTranslation = (faq: Faq | null, locale: string = 'cs') => {
    if (!faq || !faq.translations) return null
    return faq.translations.find((t) => t.locale === locale) || faq.translations[0]
  }

  const columns: ColumnDef<Faq>[] = [
    {
      id: 'question',
      header: 'Otázka',
      sortable: true,
      cell: (faq: Faq) => {
        const translation = getTranslation(faq)
        const locales = faq.translations?.map((t) => t.locale.toUpperCase()) || []
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <HelpCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="max-w-md">
              <div className="font-medium text-text-primary line-clamp-1">
                {translation?.question || 'Bez otázky'}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>{faq.slug}</span>
                <span className="text-border-default">•</span>
                <span>{locales.join(', ')}</span>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 'category',
      header: 'Kategorie',
      cell: (faq: Faq) => (
        faq.category ? (
          <Badge variant="default">{faq.category}</Badge>
        ) : (
          <span className="text-text-muted">—</span>
        )
      ),
    },
    {
      id: 'status',
      header: 'Stav',
      cell: (faq: Faq) => (
        faq.is_active ? (
          <Badge variant="success">
            <Eye className="mr-1 h-3 w-3" />
            Aktivní
          </Badge>
        ) : (
          <Badge variant="default">
            <EyeOff className="mr-1 h-3 w-3" />
            Skrytý
          </Badge>
        )
      ),
    },
    {
      id: 'sort_order',
      header: 'Pořadí',
      sortable: true,
      accessorKey: 'sort_order',
      cell: (faq: Faq) => (
        <span className="text-text-muted">{faq.sort_order}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (faq: Faq) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/faqs/${faq.id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Upravit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteFaq(faq)}
              className="text-red-400 focus:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Smazat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  if (faqs.length === 0) {
    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">FAQ</h1>
            <p className="mt-1 text-text-secondary">
              Spravujte často kladené otázky
            </p>
          </div>
          <Button onClick={() => router.push('/admin/faqs/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nová otázka
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary py-16">
          <HelpCircle className="h-12 w-12 text-text-muted" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">Zatím žádné FAQ</h3>
          <p className="mt-1 text-text-secondary">Vytvořte první otázku a odpověď.</p>
          <Button className="mt-4" onClick={() => router.push('/admin/faqs/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Vytvořit FAQ
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">FAQ</h1>
          <p className="mt-1 text-text-secondary">
            Spravujte často kladené otázky
          </p>
        </div>
        <Button onClick={() => router.push('/admin/faqs/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nová otázka
        </Button>
      </div>

      <DataTable
        data={faqs}
        columns={columns}
        rowKey={(row) => row.id}
        emptyMessage="Zatím žádné FAQ"
      />

      <ConfirmDialog
        open={!!deleteFaq}
        onOpenChange={(open) => !open && setDeleteFaq(null)}
        title="Smazat FAQ"
        description={`Opravdu chcete smazat otázku "${deleteFaq ? getTranslation(deleteFaq)?.question?.substring(0, 50) : ''}..."? Tato akce je nevratná.`}
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
