'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, ConfirmDialog, type ColumnDef } from '@/components/admin'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { MoreHorizontal, Pencil, Trash2, Plus, Award, Eye, EyeOff, Star } from 'lucide-react'
import { INDUSTRY_LABELS, type CaseStudyIndustry } from '@/types/case-study'

export interface CaseStudy {
  id: string
  slug: string
  client_name: string
  client_logo_url: string | null
  industry: string | null
  station_count: number | null
  is_featured: boolean | null
  is_active: boolean | null
  sort_order: number | null
  created_at: string | null
  translations: {
    locale: string
    title: string
  }[]
  [key: string]: unknown
}

interface CaseStudyListProps {
  caseStudies: CaseStudy[]
}

export function CaseStudyList({ caseStudies }: CaseStudyListProps) {
  const router = useRouter()
  const [deleteItem, setDeleteItem] = useState<CaseStudy | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteItem) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/case-studies/${deleteItem.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Nepodařilo se smazat case study')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsDeleting(false)
      setDeleteItem(null)
    }
  }

  const getTranslation = (item: CaseStudy | null, locale: string = 'cs') => {
    if (!item || !item.translations) return null
    return item.translations.find((t) => t.locale === locale) || item.translations[0]
  }

  const columns: ColumnDef<CaseStudy>[] = [
    {
      id: 'name',
      header: 'Case Study',
      sortable: true,
      cell: (item: CaseStudy) => {
        const translation = getTranslation(item)
        const locales = item.translations?.map((t) => t.locale.toUpperCase()) || []
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Award className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary">
                  {translation?.title || item.client_name}
                </span>
                {item.is_featured && (
                  <Badge variant="warning" size="sm">
                    <Star className="mr-1 h-3 w-3" />
                    Featured
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>{item.client_name}</span>
                {item.station_count && (
                  <>
                    <span className="text-border-default">•</span>
                    <span>{item.station_count} stanic</span>
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
      id: 'industry',
      header: 'Odvětví',
      cell: (item: CaseStudy) => {
        if (!item.industry) return <span className="text-text-muted">-</span>
        const label = INDUSTRY_LABELS[item.industry as CaseStudyIndustry] || item.industry
        return <Badge variant="info">{label}</Badge>
      },
    },
    {
      id: 'status',
      header: 'Stav',
      cell: (item: CaseStudy) => (
        <div className="flex items-center gap-2">
          {item.is_active ? (
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
      cell: (item: CaseStudy) => (
        <span className="text-text-muted">{item.sort_order}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (item: CaseStudy) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/case-studies/${item.id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Upravit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteItem(item)}
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

  if (caseStudies.length === 0) {
    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Case Studies</h1>
            <p className="mt-1 text-text-secondary">
              Spravujte reference a případové studie
            </p>
          </div>
          <Button onClick={() => router.push('/admin/case-studies/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nová case study
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary py-16">
          <Award className="h-12 w-12 text-text-muted" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">Zatím žádné case studies</h3>
          <p className="mt-1 text-text-secondary">Vytvořte první případovou studii.</p>
          <Button className="mt-4" onClick={() => router.push('/admin/case-studies/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Vytvořit case study
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Case Studies</h1>
          <p className="mt-1 text-text-secondary">
            Spravujte reference a případové studie
          </p>
        </div>
        <Button onClick={() => router.push('/admin/case-studies/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nová case study
        </Button>
      </div>

      <DataTable
        data={caseStudies}
        columns={columns}
        rowKey={(row) => row.id}
        emptyMessage="Zatím žádné case studies"
      />

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        title="Smazat case study"
        description={`Opravdu chcete smazat "${deleteItem ? getTranslation(deleteItem)?.title || deleteItem.client_name : ''}"? Tato akce je nevratná.`}
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
