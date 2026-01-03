import { cn } from '@/lib/utils'

export interface LightweightRendererProps {
  content: string // TipTap JSON string
  className?: string
}

// TipTap JSON types
interface TipTapMark {
  type: 'bold' | 'italic' | 'strike' | 'code' | 'link'
  attrs?: {
    href?: string
    target?: string
    rel?: string
    class?: string
  }
}

interface TipTapNode {
  type: string
  attrs?: Record<string, unknown>
  content?: TipTapNode[]
  text?: string
  marks?: TipTapMark[]
}

interface TipTapDoc {
  type: 'doc'
  content: TipTapNode[]
}

// Image alignment and size classes
const alignmentClasses: Record<string, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
  full: 'w-full',
}

const sizeClasses: Record<string, string> = {
  small: 'max-w-xs',
  medium: 'max-w-md',
  large: 'max-w-2xl',
  full: 'max-w-full',
}

// Render marks (bold, italic, link, etc.)
function renderMarks(text: string, marks?: TipTapMark[]): string {
  if (!marks || marks.length === 0) return escapeHtml(text)

  let result = escapeHtml(text)

  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        result = `<strong>${result}</strong>`
        break
      case 'italic':
        result = `<em>${result}</em>`
        break
      case 'strike':
        result = `<s>${result}</s>`
        break
      case 'code':
        result = `<code>${result}</code>`
        break
      case 'link':
        result = `<a href="${escapeHtml(mark.attrs?.href || '')}" target="_blank" rel="noopener noreferrer" class="text-green-400 underline hover:text-green-300 transition-colors">${result}</a>`
        break
    }
  }

  return result
}

// Escape HTML special characters
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Render a single node to HTML
function renderNode(node: TipTapNode): string {
  switch (node.type) {
    case 'text':
      return renderMarks(node.text || '', node.marks)

    case 'paragraph':
      return `<p>${renderContent(node.content)}</p>`

    case 'heading': {
      const level = (node.attrs?.level as number) || 2
      return `<h${level}>${renderContent(node.content)}</h${level}>`
    }

    case 'bulletList':
      return `<ul>${renderContent(node.content)}</ul>`

    case 'orderedList':
      return `<ol>${renderContent(node.content)}</ol>`

    case 'listItem':
      return `<li>${renderContent(node.content)}</li>`

    case 'blockquote':
      return `<blockquote>${renderContent(node.content)}</blockquote>`

    case 'codeBlock': {
      const language = (node.attrs?.language as string) || ''
      return `<pre><code${language ? ` class="language-${language}"` : ''}>${renderContent(node.content)}</code></pre>`
    }

    case 'horizontalRule':
      return '<hr />'

    case 'hardBreak':
      return '<br />'

    case 'image': {
      const src = (node.attrs?.src as string) || ''
      const alt = (node.attrs?.alt as string) || ''
      const alignment = (node.attrs?.alignment as string) || 'center'
      const size = (node.attrs?.size as string) || 'full'

      const baseClasses = 'rounded-lg h-auto my-6 block'
      const classes = `${baseClasses} ${alignmentClasses[alignment] || alignmentClasses.center} ${sizeClasses[size] || sizeClasses.full}`

      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="${classes}" loading="lazy" />`
    }

    default:
      // For unknown node types, try to render content if available
      if (node.content) {
        return renderContent(node.content)
      }
      return ''
  }
}

// Render an array of nodes
function renderContent(content?: TipTapNode[]): string {
  if (!content) return ''
  return content.map(renderNode).join('')
}

// Main render function
function renderTipTapJson(doc: TipTapDoc): string {
  if (!doc || doc.type !== 'doc' || !doc.content) {
    return ''
  }
  return renderContent(doc.content)
}

export function LightweightRenderer({ content, className }: LightweightRendererProps) {
  if (!content) {
    return null
  }

  let html = ''

  try {
    const json = JSON.parse(content) as TipTapDoc
    html = renderTipTapJson(json)
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
