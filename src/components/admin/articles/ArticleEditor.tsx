'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorToolbar } from './EditorToolbar'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

export interface ArticleEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  error?: string
}

export function ArticleEditor({
  content,
  onChange,
  placeholder = 'Začněte psát článek...',
  className,
  error,
}: ArticleEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-green-400 underline hover:text-green-300',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-text-muted before:absolute before:top-4 before:left-4 before:pointer-events-none',
      }),
    ],
    content: content ? JSON.parse(content) : '',
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-invert max-w-none',
          'prose-headings:text-text-primary prose-headings:font-semibold',
          'prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4',
          'prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3',
          'prose-p:text-text-secondary prose-p:leading-relaxed',
          'prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline',
          'prose-strong:text-text-primary prose-strong:font-semibold',
          'prose-ul:list-disc prose-ul:pl-6',
          'prose-ol:list-decimal prose-ol:pl-6',
          'prose-li:text-text-secondary',
          'min-h-[400px] p-4 focus:outline-none'
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON())
      onChange(json)
    },
  })

  // Update content when prop changes (e.g., switching locale tabs)
  useEffect(() => {
    if (editor && content) {
      const currentContent = JSON.stringify(editor.getJSON())
      if (currentContent !== content) {
        try {
          editor.commands.setContent(JSON.parse(content))
        } catch {
          // Invalid JSON, ignore
        }
      }
    } else if (editor && !content) {
      editor.commands.setContent('')
    }
  }, [content, editor])

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border transition-colors',
        error
          ? 'border-red-500/50'
          : 'border-border-subtle focus-within:border-green-500/50 focus-within:ring-2 focus-within:ring-green-500/20',
        className
      )}
    >
      <EditorToolbar editor={editor} />
      <div className="relative bg-bg-tertiary">
        <EditorContent editor={editor} />
      </div>
      {error && (
        <div className="border-t border-red-500/20 bg-red-500/5 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
