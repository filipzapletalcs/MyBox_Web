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
import { MoreHorizontal, Pencil, Trash2, Plus, FolderTree } from 'lucide-react'

export interface Category {
  id: string
  slug: string
  parent_id: string | null
  created_at: string | null
  translations: {
    locale: string
    name: string
    description: string | null
  }[]
  [key: string]: unknown // Index signature for DataTable compatibility
}

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter()
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteCategory) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/categories/${deleteCategory.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Nepodařilo se smazat kategorii')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsDeleting(false)
      setDeleteCategory(null)
    }
  }

  const getTranslation = (category: Category | null, locale: string = 'cs') => {
    if (!category || !category.translations) return null
    return category.translations.find((t) => t.locale === locale) || category.translations[0]
  }

  const getParentName = (parentId: string | null): string | null => {
    if (!parentId) return null
    const parent = categories.find((c) => c.id === parentId)
    if (!parent) return null
    const translation = getTranslation(parent)
    return translation?.name || null
  }

  const columns: ColumnDef<Category>[] = [
    {
      id: 'name',
      header: 'Název',
      sortable: true,
      cell: (category: Category) => {
        const translation = getTranslation(category)
        const locales = category.translations?.map((t) => t.locale.toUpperCase()) || []
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <FolderTree className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="font-medium text-text-primary">
                {translation?.name || 'Bez názvu'}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>{category.slug}</span>
                <span className="text-border-default">•</span>
                <span>{locales.join(', ')}</span>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 'parent',
      header: 'Nadřazená',
      cell: (category: Category) => {
        const parentName = getParentName(category.parent_id)
        return parentName ? (
          <Badge variant="default">{parentName}</Badge>
        ) : (
          <span className="text-text-muted">—</span>
        )
      },
    },
    {
      id: 'articles',
      header: 'Články',
      cell: () => (
        <span className="text-text-muted">—</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (category: Category) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category.id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Upravit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteCategory(category)}
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

  if (categories.length === 0) {
    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Kategorie</h1>
            <p className="mt-1 text-text-secondary">
              Spravujte kategorie pro články
            </p>
          </div>
          <Button onClick={() => router.push('/admin/categories/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nová kategorie
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary py-16">
          <FolderTree className="h-12 w-12 text-text-muted" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">Zatím žádné kategorie</h3>
          <p className="mt-1 text-text-secondary">Vytvořte první kategorii pro organizaci článků.</p>
          <Button className="mt-4" onClick={() => router.push('/admin/categories/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Vytvořit kategorii
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Kategorie</h1>
          <p className="mt-1 text-text-secondary">
            Spravujte kategorie pro články
          </p>
        </div>
        <Button onClick={() => router.push('/admin/categories/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nová kategorie
        </Button>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        rowKey={(row) => row.id}
        emptyMessage="Zatím žádné kategorie"
      />

      <ConfirmDialog
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
        title="Smazat kategorii"
        description={`Opravdu chcete smazat kategorii "${deleteCategory ? getTranslation(deleteCategory)?.name : ''}"? Tato akce je nevratná.`}
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
