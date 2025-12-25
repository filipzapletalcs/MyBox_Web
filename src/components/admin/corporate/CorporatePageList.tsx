'use client'

import { useRouter } from 'next/navigation'
import { DataTable, type ColumnDef } from '@/components/admin'
import { Badge } from '@/components/ui/Badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { MoreHorizontal, Pencil, Eye, EyeOff, FileText, Layout } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface CorporatePage {
  id: string
  slug: string
  page_type: 'landing' | 'subpage'
  is_active: boolean | null
  sort_order: number | null
  created_at: string | null
  translations: {
    locale: string
    title: string
  }[]
  sections_count?: number
  [key: string]: unknown
}

interface CorporatePageListProps {
  pages: CorporatePage[]
}

const pageTypeLabels: Record<string, { label: string; color: 'primary' | 'info' }> = {
  landing: { label: 'Landing Page', color: 'primary' },
  subpage: { label: 'Podstránka', color: 'info' },
}

export function CorporatePageList({ pages }: CorporatePageListProps) {
  const router = useRouter()

  const getTranslation = (page: CorporatePage | null, locale: string = 'cs') => {
    if (!page || !page.translations) return null
    return page.translations.find((t) => t.locale === locale) || page.translations[0]
  }

  const columns: ColumnDef<CorporatePage>[] = [
    {
      id: 'name',
      header: 'Stránka',
      sortable: true,
      cell: (page: CorporatePage) => {
        const translation = getTranslation(page)
        const locales = page.translations?.map((t) => t.locale.toUpperCase()) || []
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              {page.page_type === 'landing' ? (
                <Layout className="h-5 w-5 text-blue-500" />
              ) : (
                <FileText className="h-5 w-5 text-purple-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary">
                  {translation?.title || 'Bez názvu'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>/{page.slug}</span>
                {page.sections_count !== undefined && (
                  <>
                    <span className="text-border-default">•</span>
                    <span>{page.sections_count} sekcí</span>
                  </>
                )}
                <span className="text-border-default">•</span>
                <span>{locales.join(', ')}</span>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 'type',
      header: 'Typ',
      cell: (page: CorporatePage) => {
        const typeInfo = pageTypeLabels[page.page_type] || { label: page.page_type, color: 'default' as const }
        return <Badge variant={typeInfo.color}>{typeInfo.label}</Badge>
      },
    },
    {
      id: 'status',
      header: 'Stav',
      cell: (page: CorporatePage) => (
        <div className="flex items-center gap-2">
          {page.is_active ? (
            <Badge variant="success">
              <Eye className="mr-1 h-3 w-3" />
              Aktivní
            </Badge>
          ) : (
            <Badge variant="default">
              <EyeOff className="mr-1 h-3 w-3" />
              Skrytá
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: 'sort_order',
      header: 'Pořadí',
      sortable: true,
      accessorKey: 'sort_order',
      cell: (page: CorporatePage) => (
        <span className="text-text-muted">{page.sort_order}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (page: CorporatePage) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/corporate/${page.id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Upravit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  if (pages.length === 0) {
    return (
      <>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-text-primary">Firemní nabíjení</h1>
          <p className="mt-1 text-text-secondary">
            Spravujte stránky firemního nabíjení
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary py-16">
          <Layout className="h-12 w-12 text-text-muted" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">Zatím žádné stránky</h3>
          <p className="mt-1 text-text-secondary">Stránky se vytvoří automaticky z migrace.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Firemní nabíjení</h1>
        <p className="mt-1 text-text-secondary">
          Spravujte stránky firemního nabíjení a jejich sekce
        </p>
      </div>

      <DataTable
        data={pages}
        columns={columns}
        rowKey={(row) => row.id}
        emptyMessage="Zatím žádné stránky"
      />
    </>
  )
}
