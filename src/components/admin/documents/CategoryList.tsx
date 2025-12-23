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
  FolderOpen,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

export interface DocumentCategory {
  id: string
  slug: string
  sort_order: number | null
  is_active: boolean | null
  created_at: string | null
  document_category_translations: {
    locale: string
    name: string
    description: string | null
  }[]
  [key: string]: unknown
}

interface CategoryListProps {
  categories: DocumentCategory[]
}

export function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter()
  const [deleteCategory, setDeleteCategory] = useState<DocumentCategory | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteCategory) return

    setIsDeleting(true)
    try {
      const response = await fetch(
        `/api/documents/categories/${deleteCategory.id}`,
        {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Nepodařilo se smazat kategorii')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsDeleting(false)
      setDeleteCategory(null)
    }
  }

  const getTranslation = (
    cat: DocumentCategory | null,
    locale: string = 'cs'
  ) => {
    if (!cat || !cat.document_category_translations) return null
    return (
      cat.document_category_translations.find((t) => t.locale === locale) ||
      cat.document_category_translations[0]
    )
  }

  const columns: ColumnDef<DocumentCategory>[] = [
    {
      id: 'name',
      header: 'Název',
      sortable: true,
      cell: (cat: DocumentCategory) => {
        const translation = getTranslation(cat)
        const locales =
          cat.document_category_translations?.map((t) =>
            t.locale.toUpperCase()
          ) || []
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <FolderOpen className="h-5 w-5 text-green-500" />
            </div>
            <div className="max-w-md">
              <div className="font-medium text-text-primary">
                {translation?.name || cat.slug}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>{cat.slug}</span>
                <span className="text-border-default">•</span>
                <span>{locales.join(', ')}</span>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 'description',
      header: 'Popis',
      cell: (cat: DocumentCategory) => {
        const translation = getTranslation(cat)
        return translation?.description ? (
          <span className="text-text-secondary line-clamp-1">
            {translation.description}
          </span>
        ) : (
          <span className="text-text-muted">—</span>
        )
      },
    },
    {
      id: 'status',
      header: 'Stav',
      cell: (cat: DocumentCategory) =>
        cat.is_active ? (
          <Badge variant="success">
            <Eye className="mr-1 h-3 w-3" />
            Aktivní
          </Badge>
        ) : (
          <Badge variant="default">
            <EyeOff className="mr-1 h-3 w-3" />
            Skrytá
          </Badge>
        ),
    },
    {
      id: 'sort_order',
      header: 'Pořadí',
      sortable: true,
      accessorKey: 'sort_order',
      cell: (cat: DocumentCategory) => (
        <span className="text-text-muted">{cat.sort_order}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (cat: DocumentCategory) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(`/admin/documents/categories/${cat.id}`)
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Upravit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteCategory(cat)}
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

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/documents">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Kategorie dokumentů
            </h1>
            <p className="mt-1 text-text-secondary">
              Spravujte kategorie pro dokumenty
            </p>
          </div>
        </div>
        <Button onClick={() => router.push('/admin/documents/categories/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nová kategorie
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary py-16">
          <FolderOpen className="h-12 w-12 text-text-muted" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">
            Zatím žádné kategorie
          </h3>
          <p className="mt-1 text-text-secondary">
            Vytvořte první kategorii dokumentů.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push('/admin/documents/categories/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Vytvořit kategorii
          </Button>
        </div>
      ) : (
        <DataTable
          data={categories}
          columns={columns}
          rowKey={(row) => row.id}
          emptyMessage="Zatím žádné kategorie"
        />
      )}

      <ConfirmDialog
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
        title="Smazat kategorii"
        description={`Opravdu chcete smazat kategorii "${deleteCategory ? getTranslation(deleteCategory)?.name : ''}"? Kategorii lze smazat pouze pokud neobsahuje žádné dokumenty.`}
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
