'use client'

import { AlertTriangle, Trash2, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'default'
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Potvrdit',
  cancelText = 'Zrušit',
  variant = 'default',
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  const Icon = variant === 'danger' ? Trash2 : variant === 'warning' ? AlertTriangle : Info

  const iconStyles = cn(
    'h-12 w-12 rounded-xl p-3',
    variant === 'danger' && 'bg-red-500/10 text-red-400',
    variant === 'warning' && 'bg-yellow-500/10 text-yellow-400',
    variant === 'default' && 'bg-blue-500/10 text-blue-400'
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className={iconStyles}>
            <Icon className="h-6 w-6" />
          </div>
          <DialogTitle className="mt-4">{title}</DialogTitle>
          <DialogDescription className="mt-2">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-3 sm:justify-center">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
