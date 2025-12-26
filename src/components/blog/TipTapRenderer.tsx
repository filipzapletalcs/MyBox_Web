'use client'

import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { cn } from '@/lib/utils'

export interface TipTapRendererProps {
  content: string // TipTap JSON string
  className?: string
}

// Configure extensions to match the editor
const extensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3],
    },
  }),
  Link.configure({
    openOnClick: true,
    HTMLAttributes: {
      class: 'text-green-400 underline hover:text-green-300 transition-colors',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  }),
]

export function TipTapRenderer({ content, className }: TipTapRendererProps) {
  if (!content) {
    return null
  }

  let html = ''

  try {
    const json = JSON.parse(content)
    html = generateHTML(json, extensions)
  } catch (error) {
    console.error('Failed to parse TipTap content:', error)
    return null
  }

  return (
    <div
      className={cn(
        // Prose styling for dark theme
        'prose prose-invert max-w-none',
        // Headings
        'prose-headings:text-text-primary prose-headings:font-semibold',
        'prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:scroll-mt-24',
        'prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:scroll-mt-24',
        // Paragraphs
        'prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-6',
        // Links
        'prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline prose-a:transition-colors',
        // Strong/Bold
        'prose-strong:text-text-primary prose-strong:font-semibold',
        // Lists
        'prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6',
        'prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6',
        'prose-li:text-text-secondary prose-li:my-2',
        // Blockquotes
        'prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-text-muted',
        // Code
        'prose-code:bg-bg-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-green-400 prose-code:text-sm',
        'prose-pre:bg-bg-tertiary prose-pre:rounded-xl prose-pre:p-4',
        // Horizontal rule
        'prose-hr:border-border-subtle prose-hr:my-10',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  )
}
