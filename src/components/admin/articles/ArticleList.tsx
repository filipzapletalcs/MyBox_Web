'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { cs } from 'date-fns/locale'
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import { DataTable, type ColumnDef } from '@/components/admin/ui/DataTable'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { Badge } from '@/components/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui'
import { Button } from '@/components/ui'

export interface Article {
  id: string
  slug: string
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  is_featured: boolean
  created_at: string
  updated_at: string
  author: {
    full_name: string | null
    email: string
  } | null
  translations: {
    locale: string
    title: string
  }[]
  category: {
    translations: {
      locale: string
      name: string
    }[]
  } | null
  [key: string]: unknown
}

interface ArticleListProps {
  articles: Article[]
  isLoading?: boolean
  onDelete?: (id: string) => Promise<void>
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
  }
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
  draft: { label: 'Koncept', variant: 'default' },
  scheduled: { label: 'Naplánováno', variant: 'warning' },
  published: { label: 'Publikováno', variant: 'success' },
  archived: { label: 'Archivováno', variant: 'danger' },
}

export function ArticleList({
  articles,
  isLoading,
  onDelete,
  pagination,
}: ArticleListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const getTitle = (article: Article, locale = 'cs') => {
    const translation = article.translations.find((t) => t.locale === locale)
    return translation?.title || article.translations[0]?.title || 'Bez názvu'
  }

  const getCategoryName = (article: Article, locale = 'cs') => {
    if (!article.category) return null
    const translation = article.category.translations.find((t) => t.locale === locale)
    return translation?.name || article.category.translations[0]?.name
  }

  const handleDelete = async () => {
    if (!deleteId || !onDelete) return

    setIsDeleting(true)
    try {
      await onDelete(deleteId)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const columns: ColumnDef<Article>[] = [
    {
      id: 'title',
      header: 'Název',
      sortable: true,
      cell: (article) => (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">
            {getTitle(article)}
          </span>
          <span className="text-xs text-text-muted">/{article.slug}</span>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Stav',
      width: '120px',
      cell: (article) => {
        const { label, variant } = statusLabels[article.status] || statusLabels.draft
        return <Badge variant={variant}>{label}</Badge>
      },
    },
    {
      id: 'category',
      header: 'Kategorie',
      width: '150px',
      cell: (article) => {
        const categoryName = getCategoryName(article)
        return categoryName ? (
          <span className="text-text-secondary">{categoryName}</span>
        ) : (
          <span className="text-text-muted">—</span>
        )
      },
    },
    {
      id: 'author',
      header: 'Autor',
      width: '150px',
      cell: (article) => (
        <span className="text-text-secondary">
          {article.author?.full_name || article.author?.email || '—'}
        </span>
      ),
    },
    {
      id: 'translations',
      header: 'Jazyky',
      width: '100px',
      cell: (article) => (
        <div className="flex gap-1">
          {['cs', 'en', 'de'].map((locale) => {
            const hasTranslation = article.translations.some(
              (t) => t.locale === locale
            )
            return (
              <span
                key={locale}
                className={`text-xs uppercase ${hasTranslation ? 'text-green-400' : 'text-text-muted'}`}
              >
                {locale}
              </span>
            )
          })}
        </div>
      ),
    },
    {
      id: 'updated_at',
      header: 'Upraveno',
      sortable: true,
      width: '140px',
      accessorKey: 'updated_at',
      cell: (article) => (
        <span className="text-text-muted">
          {formatDistanceToNow(new Date(article.updated_at), {
            addSuffix: true,
            locale: cs,
          })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      width: '60px',
      cell: (article) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/admin/articles/${article.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Upravit
            </DropdownMenuItem>
            {article.status === 'published' && (
              <DropdownMenuItem
                onClick={() => window.open(`/blog/${article.slug}`, '_blank')}
              >
                <Eye className="mr-2 h-4 w-4" />
                Zobrazit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => setDeleteId(article.id)}
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
      <DataTable
        data={articles}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        rowKey={(article) => article.id}
        onRowClick={(article) => router.push(`/admin/articles/${article.id}`)}
        emptyMessage="Zatím nemáte žádné články"
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Smazat článek?"
        description="Tato akce je nevratná. Článek a všechny jeho překlady budou trvale smazány."
        confirmText="Smazat"
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
