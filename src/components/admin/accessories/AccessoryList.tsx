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
import { MoreHorizontal, Pencil, Trash2, Plus, Wrench, Eye, EyeOff, Link } from 'lucide-react'

export interface Accessory {
  id: string
  slug: string
  image_url: string | null
  link_url: string | null
  is_active: boolean | null
  sort_order: number | null
  created_at: string | null
  accessory_translations: {
    locale: string
    name: string
    description: string | null
  }[]
  product_accessories?: {
    product_id: string
    products?: {
      slug: string
      product_translations?: { locale: string; name: string }[]
    }
  }[]
}

interface AccessoryListProps {
  accessories: Accessory[]
}

export function AccessoryList({ accessories }: AccessoryListProps) {
  const router = useRouter()
  const [deleteAccessory, setDeleteAccessory] = useState<Accessory | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteAccessory) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/accessories/${deleteAccessory.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Nepodařilo se smazat příslušenství')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsDeleting(false)
      setDeleteAccessory(null)
    }
  }

  const getTranslation = (accessory: Accessory | null, locale: string = 'cs') => {
    if (!accessory || !accessory.accessory_translations) return null
    return accessory.accessory_translations.find((t) => t.locale === locale) || accessory.accessory_translations[0]
  }

  const getProductNames = (accessory: Accessory): string[] => {
    if (!accessory.product_accessories) return []
    return accessory.product_accessories
      .map((pa) => {
        const translation = pa.products?.product_translations?.find((t) => t.locale === 'cs')
        return translation?.name || pa.products?.slug || ''
      })
      .filter(Boolean)
  }

  const columns: ColumnDef<Accessory>[] = [
    {
      id: 'name',
      header: 'Příslušenství',
      sortable: true,
      cell: (accessory: Accessory) => {
        const translation = getTranslation(accessory)
        const locales = accessory.accessory_translations?.map((t) => t.locale.toUpperCase()) || []
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Wrench className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary">
                  {translation?.name || 'Bez názvu'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>{accessory.slug}</span>
                <span className="text-border-default">•</span>
                <span>{locales.join(', ')}</span>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 'products',
      header: 'Produkty',
      cell: (accessory: Accessory) => {
        const productNames = getProductNames(accessory)
        if (productNames.length === 0) {
          return <span className="text-text-muted">-</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {productNames.map((name, index) => (
              <Badge key={index} variant="default" size="sm">
                <Link className="mr-1 h-3 w-3" />
                {name}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      id: 'status',
      header: 'Stav',
      cell: (accessory: Accessory) => (
        <div className="flex items-center gap-2">
          {accessory.is_active ? (
            <Badge variant="success">
              <Eye className="mr-1 h-3 w-3" />
              Aktivní
            </Badge>
          ) : (
            <Badge variant="default">
              <EyeOff className="mr-1 h-3 w-3" />
              Skrytý
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
      cell: (accessory: Accessory) => (
        <span className="text-text-muted">{accessory.sort_order}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (accessory: Accessory) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/products/accessories/${accessory.id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Upravit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteAccessory(accessory)}
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

  if (accessories.length === 0) {
    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Příslušenství</h1>
            <p className="mt-1 text-text-secondary">
              Spravujte příslušenství k nabíjecím stanicím
            </p>
          </div>
          <Button onClick={() => router.push('/admin/products/accessories/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nové příslušenství
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary py-16">
          <Wrench className="h-12 w-12 text-text-muted" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">Zatím žádné příslušenství</h3>
          <p className="mt-1 text-text-secondary">Vytvořte první příslušenství.</p>
          <Button className="mt-4" onClick={() => router.push('/admin/products/accessories/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Vytvořit příslušenství
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Příslušenství</h1>
          <p className="mt-1 text-text-secondary">
            Spravujte příslušenství k nabíjecím stanicím
          </p>
        </div>
        <Button onClick={() => router.push('/admin/products/accessories/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nové příslušenství
        </Button>
      </div>

      <DataTable
        data={accessories}
        columns={columns}
        rowKey={(row) => row.id}
        emptyMessage="Zatím žádné příslušenství"
      />

      <ConfirmDialog
        open={!!deleteAccessory}
        onOpenChange={(open) => !open && setDeleteAccessory(null)}
        title="Smazat příslušenství"
        description={`Opravdu chcete smazat příslušenství "${deleteAccessory ? getTranslation(deleteAccessory)?.name : ''}"? Tato akce je nevratná.`}
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
