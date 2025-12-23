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
import { MoreHorizontal, Pencil, Trash2, Plus, Package, Zap, Eye, EyeOff } from 'lucide-react'

export interface Product {
  id: string
  slug: string
  type: 'ac_mybox' | 'dc_alpitronic'
  sku: string | null
  is_active: boolean | null
  is_featured: boolean | null
  sort_order: number | null
  created_at: string | null
  translations: {
    locale: string
    name: string
    tagline: string | null
  }[]
  [key: string]: unknown
}

interface ProductListProps {
  products: Product[]
}

const productTypeLabels: Record<string, { label: string; color: 'primary' | 'info' }> = {
  ac_mybox: { label: 'AC MyBox', color: 'primary' },
  dc_alpitronic: { label: 'DC Alpitronic', color: 'info' },
}

export function ProductList({ products }: ProductListProps) {
  const router = useRouter()
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteProduct) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/products/${deleteProduct.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Nepodařilo se smazat produkt')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsDeleting(false)
      setDeleteProduct(null)
    }
  }

  const getTranslation = (product: Product | null, locale: string = 'cs') => {
    if (!product || !product.translations) return null
    return product.translations.find((t) => t.locale === locale) || product.translations[0]
  }

  const columns: ColumnDef<Product>[] = [
    {
      id: 'name',
      header: 'Produkt',
      sortable: true,
      cell: (product: Product) => {
        const translation = getTranslation(product)
        const locales = product.translations?.map((t) => t.locale.toUpperCase()) || []
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              {product.type === 'ac_mybox' ? (
                <Package className="h-5 w-5 text-green-500" />
              ) : (
                <Zap className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary">
                  {translation?.name || 'Bez názvu'}
                </span>
                {product.is_featured && (
                  <Badge variant="warning" size="sm">Featured</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>{product.slug}</span>
                {product.sku && (
                  <>
                    <span className="text-border-default">•</span>
                    <span>{product.sku}</span>
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
      cell: (product: Product) => {
        const typeInfo = productTypeLabels[product.type] || { label: product.type, color: 'default' as const }
        return (
          <Badge variant={typeInfo.color}>{typeInfo.label}</Badge>
        )
      },
    },
    {
      id: 'status',
      header: 'Stav',
      cell: (product: Product) => (
        <div className="flex items-center gap-2">
          {product.is_active ? (
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
      cell: (product: Product) => (
        <span className="text-text-muted">{product.sort_order}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (product: Product) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Upravit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteProduct(product)}
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

  if (products.length === 0) {
    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Produkty</h1>
            <p className="mt-1 text-text-secondary">
              Spravujte nabíjecí stanice a příslušenství
            </p>
          </div>
          <Button onClick={() => router.push('/admin/products/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nový produkt
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary py-16">
          <Package className="h-12 w-12 text-text-muted" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">Zatím žádné produkty</h3>
          <p className="mt-1 text-text-secondary">Vytvořte první produkt.</p>
          <Button className="mt-4" onClick={() => router.push('/admin/products/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Vytvořit produkt
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Produkty</h1>
          <p className="mt-1 text-text-secondary">
            Spravujte nabíjecí stanice a příslušenství
          </p>
        </div>
        <Button onClick={() => router.push('/admin/products/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nový produkt
        </Button>
      </div>

      <DataTable
        data={products}
        columns={columns}
        rowKey={(row) => row.id}
        emptyMessage="Zatím žádné produkty"
      />

      <ConfirmDialog
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
        title="Smazat produkt"
        description={`Opravdu chcete smazat produkt "${deleteProduct ? getTranslation(deleteProduct)?.name : ''}"? Tato akce je nevratná.`}
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
