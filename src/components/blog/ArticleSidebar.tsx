'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Share2, Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  text: string
  level: number
}

export interface ArticleSidebarProps {
  content: string // TipTap JSON string
  tags?: { id: string; name: string; slug: string }[]
  tocLabel?: string
  shareLabel?: string
  tagsLabel?: string
}

export function ArticleSidebar({
  content,
  tags,
  tocLabel = 'Obsah článku',
  shareLabel = 'Sdílet',
  tagsLabel = 'Štítky'
}: ArticleSidebarProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [copied, setCopied] = useState(false)

  // Extract headings from TipTap JSON
  useEffect(() => {
    try {
      const json = JSON.parse(content)
      const headings: TOCItem[] = []

      const extractHeadings = (nodes: { type: string; attrs?: { level?: number }; content?: { type: string; text?: string }[] }[]) => {
        nodes.forEach((node) => {
          if (node.type === 'heading' && node.attrs?.level && node.content) {
            const text = node.content
              .filter((c) => c.type === 'text')
              .map((c) => c.text)
              .join('')
            if (text) {
              const id = text
                .toLowerCase()
                .replace(/[^a-z0-9čďěňřšťůýžáéíóú\s]/gi, '')
                .replace(/\s+/g, '-')
              headings.push({ id, text, level: node.attrs.level })
            }
          }
        })
      }

      if (json.content) {
        extractHeadings(json.content)
      }

      setTocItems(headings)
    } catch {
      // Invalid JSON, no TOC
    }
  }, [content])

  // Track active heading on scroll
  useEffect(() => {
    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [tocItems])

  // Copy link handler
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard not available
    }
  }

  // Share URL
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = typeof document !== 'undefined' ? document.title : ''

  return (
    <aside className="sticky top-24 space-y-8">
      {/* Table of Contents */}
      {tocItems.length > 0 && (
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
            {tocLabel}
          </h4>
          <nav className="space-y-1">
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  'block py-1.5 text-sm transition-colors duration-200',
                  item.level === 3 && 'pl-4',
                  activeId === item.id
                    ? 'text-green-400 font-medium'
                    : 'text-text-secondary hover:text-text-primary'
                )}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(item.id)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Share buttons */}
      <div>
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
          {shareLabel}
        </h4>
        <div className="flex gap-2">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              'bg-bg-tertiary text-text-secondary',
              'transition-all duration-200',
              'hover:bg-bg-elevated hover:text-text-primary'
            )}
            aria-label="Share on Twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              'bg-bg-tertiary text-text-secondary',
              'transition-all duration-200',
              'hover:bg-bg-elevated hover:text-text-primary'
            )}
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              'bg-bg-tertiary text-text-secondary',
              'transition-all duration-200',
              'hover:bg-bg-elevated hover:text-text-primary'
            )}
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <button
            onClick={handleCopyLink}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              'bg-bg-tertiary text-text-secondary',
              'transition-all duration-200',
              copied
                ? 'bg-green-500/20 text-green-400'
                : 'hover:bg-bg-elevated hover:text-text-primary'
            )}
            aria-label="Copy link"
          >
            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
            {tagsLabel}
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className={cn(
                  'inline-flex items-center px-3 py-1 rounded-full',
                  'text-xs font-medium',
                  'bg-bg-tertiary text-text-secondary',
                  'border border-border-subtle'
                )}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
