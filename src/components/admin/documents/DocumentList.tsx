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
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  FileText,
  Eye,
  EyeOff,
  FolderOpen,
} from 'lucide-react'
import { formatFileSize } from '@/lib/utils/documents'
import Link from 'next/link'

export interface Document {
  id: string
  slug: string
  category_id: string
  file_cs: string | null
  file_en: string | null
  file_de: string | null
  file_size_cs: number | null
  file_size_en: number | null
  file_size_de: number | null
  fallback_locale: string | null
  sort_order: number | null
  is_active: boolean | null
  created_at: string | null
  document_translations: {
    locale: string
    title: string
    description: string | null
  }[]
  document_categories?: {
    id: string
    slug: string
    document_category_translations: {
      locale: string
      name: string
    }[]
  } | null
  [key: string]: unknown
}

interface DocumentListProps {
  documents: Document[]
}

export function DocumentList({ documents }: DocumentListProps) {
  const router = useRouter()
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteDoc) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/documents/${deleteDoc.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Nepodařilo se smazat dokument')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsDeleting(false)
      setDeleteDoc(null)
    }
  }

  const getTranslation = (doc: Document | null, locale: string = 'cs') => {
    if (!doc || !doc.document_translations) return null
    return (
      doc.document_translations.find((t) => t.locale === locale) ||
      doc.document_translations[0]
    )
  }

  const getCategoryName = (doc: Document, locale: string = 'cs') => {
    if (!doc.document_categories?.document_category_translations) return '—'
    const translation = doc.document_categories.document_category_translations.find(
      (t) => t.locale === locale
    )
    return translation?.name || doc.document_categories.slug
  }

  const getFileBadges = (doc: Document) => {
    const badges = []
    if (doc.file_cs) badges.push('CS')
    if (doc.file_en) badges.push('EN')
    if (doc.file_de) badges.push('DE')
    return badges
  }

  const getTotalSize = (doc: Document) => {
    return (
      (doc.file_size_cs || 0) +
      (doc.file_size_en || 0) +
      (doc.file_size_de || 0)
    )
  }

  const columns: ColumnDef<Document>[] = [
    {
      id: 'title',
      header: 'Název',
      sortable: true,
      cell: (doc: Document) => {
        const translation = getTranslation(doc)
        const fileBadges = getFileBadges(doc)
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <div className="max-w-md">
              <div className="font-medium text-text-primary line-clamp-1">
                {translation?.title || doc.slug}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>{doc.slug}</span>
                <span className="text-border-default">•</span>
                <div className="flex gap-1">
                  {fileBadges.map((lang) => (
                    <span
                      key={lang}
                      className="rounded bg-green-500/20 px-1.5 py-0.5 text-xs text-green-400"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 'category',
      header: 'Kategorie',
      cell: (doc: Document) => (
        <Badge variant="default">{getCategoryName(doc)}</Badge>
      ),
    },
    {
      id: 'size',
      header: 'Velikost',
      cell: (doc: Document) => {
        const totalSize = getTotalSize(doc)
        return (
          <span className="text-text-muted">
            {totalSize > 0 ? formatFileSize(totalSize) : '—'}
          </span>
        )
      },
    },
    {
      id: 'status',
      header: 'Stav',
      cell: (doc: Document) =>
        doc.is_active ? (
          <Badge variant="success">
            <Eye className="mr-1 h-3 w-3" />
            Aktivní
          </Badge>
        ) : (
          <Badge variant="default">
            <EyeOff className="mr-1 h-3 w-3" />
            Skrytý
          </Badge>
        ),
    },
    {
      id: 'sort_order',
      header: 'Pořadí',
      sortable: true,
      accessorKey: 'sort_order',
      cell: (doc: Document) => (
        <span className="text-text-muted">{doc.sort_order}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (doc: Document) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/admin/documents/${doc.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Upravit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteDoc(doc)}
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

  if (documents.length === 0) {
    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Dokumenty
            </h1>
            <p className="mt-1 text-text-secondary">
              Spravujte dokumenty ke stažení
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" asChild>
              <Link href="/admin/documents/categories">
                <FolderOpen className="mr-2 h-4 w-4" />
                Kategorie
              </Link>
            </Button>
            <Button onClick={() => router.push('/admin/documents/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Nový dokument
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary py-16">
          <FileText className="h-12 w-12 text-text-muted" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">
            Zatím žádné dokumenty
          </h3>
          <p className="mt-1 text-text-secondary">
            Vytvořte první dokument ke stažení.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push('/admin/documents/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Vytvořit dokument
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Dokumenty</h1>
          <p className="mt-1 text-text-secondary">
            Spravujte dokumenty ke stažení
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" asChild>
            <Link href="/admin/documents/categories">
              <FolderOpen className="mr-2 h-4 w-4" />
              Kategorie
            </Link>
          </Button>
          <Button onClick={() => router.push('/admin/documents/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nový dokument
          </Button>
        </div>
      </div>

      <DataTable
        data={documents}
        columns={columns}
        rowKey={(row) => row.id}
        emptyMessage="Zatím žádné dokumenty"
      />

      <ConfirmDialog
        open={!!deleteDoc}
        onOpenChange={(open) => !open && setDeleteDoc(null)}
        title="Smazat dokument"
        description={`Opravdu chcete smazat dokument "${deleteDoc ? getTranslation(deleteDoc)?.title?.substring(0, 50) : ''}"? Tato akce je nevratná a smaže i všechny nahrané soubory.`}
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
