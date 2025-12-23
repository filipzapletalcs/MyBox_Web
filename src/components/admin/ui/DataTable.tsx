'use client'

import { useState, useMemo } from 'react'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

export interface ColumnDef<T> {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  isLoading?: boolean
  pagination?: PaginationState
  onRowSelect?: (selected: T[]) => void
  onRowClick?: (row: T) => void
  emptyMessage?: string
  rowKey?: (row: T) => string
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  isLoading = false,
  pagination,
  onRowSelect,
  onRowClick,
  emptyMessage = 'Žádná data k zobrazení',
  rowKey,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!sortColumn) return data

    const column = columns.find((c) => c.id === sortColumn)
    if (!column?.accessorKey) return data

    return [...data].sort((a, b) => {
      const aVal = a[column.accessorKey as keyof T]
      const bVal = b[column.accessorKey as keyof T]

      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      const comparison = aVal < bVal ? -1 : 1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [data, sortColumn, sortDirection, columns])

  const handleSort = (columnId: string) => {
    const column = columns.find((c) => c.id === columnId)
    if (!column?.sortable) return

    if (sortColumn === columnId) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(columnId)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
      onRowSelect?.([])
    } else {
      const allKeys = new Set(
        data.map((row, i) => rowKey?.(row) || String(i))
      )
      setSelectedRows(allKeys)
      onRowSelect?.(data)
    }
  }

  const handleSelectRow = (row: T, index: number) => {
    const key = rowKey?.(row) || String(index)
    const newSelected = new Set(selectedRows)

    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }

    setSelectedRows(newSelected)
    onRowSelect?.(
      data.filter((r, i) => newSelected.has(rowKey?.(r) || String(i)))
    )
  }

  const getSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ChevronsUpDown className="h-4 w-4 opacity-50" />
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  // Pagination calculations
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1
  const startItem = pagination
    ? (pagination.page - 1) * pagination.pageSize + 1
    : 1
  const endItem = pagination
    ? Math.min(pagination.page * pagination.pageSize, pagination.total)
    : data.length

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border-subtle">
        <table className="w-full">
          <thead className="bg-bg-secondary">
            <tr>
              {onRowSelect && (
                <th className="w-12 px-4 py-3">
                  <div className="h-4 w-4 animate-pulse rounded bg-white/10" />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="px-4 py-3 text-left text-sm font-medium text-text-secondary"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-t border-border-subtle">
                {onRowSelect && (
                  <td className="px-4 py-4">
                    <div className="h-4 w-4 animate-pulse rounded bg-white/10" />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.id} className="px-4 py-4">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary py-16">
        <div className="mb-2 text-4xl">📭</div>
        <p className="text-text-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg-secondary">
            <tr>
              {onRowSelect && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-border-default bg-bg-tertiary text-green-500 focus:ring-green-500/50"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-text-secondary',
                    column.sortable && 'cursor-pointer select-none'
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.id)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && getSortIcon(column.id)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody suppressHydrationWarning>
            {sortedData.map((row, rowIndex) => {
              const key = rowKey?.(row) || String(rowIndex)
              const isSelected = selectedRows.has(key)

              return (
                <tr
                  key={key}
                  className={cn(
                    'border-t border-border-subtle transition-colors',
                    onRowClick && 'cursor-pointer',
                    isSelected
                      ? 'bg-green-500/5'
                      : 'hover:bg-bg-tertiary'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {onRowSelect && (
                    <td
                      className="px-4 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(row, rowIndex)}
                        className="h-4 w-4 rounded border-border-default bg-bg-tertiary text-green-500 focus:ring-green-500/50"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className="px-4 py-4 text-sm text-text-primary"
                    >
                      {column.cell
                        ? column.cell(row)
                        : column.accessorKey
                          ? String(row[column.accessorKey] ?? '')
                          : null}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between border-t border-border-subtle bg-bg-secondary px-4 py-3">
          <div className="text-sm text-text-muted">
            Zobrazeno {startItem}–{endItem} z {pagination.total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Předchozí
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (pagination.page <= 3) {
                  pageNum = i + 1
                } else if (pagination.page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = pagination.page - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pagination.page === pageNum ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => pagination.onPageChange(pageNum)}
                    className="min-w-[36px]"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
            >
              Další
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
