'use client'

import { cn } from '@/lib/utils'
import type { DownloadButtonProps } from '@/types/product'

// Document icon
function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

// Download icon
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

export function DownloadButton({
  href,
  label = 'Stáhnout datasheet',
  fileName,
  className,
}: DownloadButtonProps) {
  return (
    <a
      href={href}
      download={fileName}
      className={cn(
        'inline-flex items-center gap-3 px-6 py-3',
        'bg-bg-secondary hover:bg-bg-tertiary',
        'border border-border-subtle hover:border-green-500/30',
        'rounded-xl transition-all duration-200',
        'group',
        className
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
        <DocumentIcon className="w-5 h-5 text-green-500" />
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-medium text-text-primary">
          {label}
        </span>
        <span className="text-xs text-text-secondary">
          PDF dokument
        </span>
      </div>

      <DownloadIcon className="w-5 h-5 text-text-secondary group-hover:text-green-500 transition-colors ml-2" />
    </a>
  )
}
