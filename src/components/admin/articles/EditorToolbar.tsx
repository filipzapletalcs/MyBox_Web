'use client'

import { type Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Unlink,
  RemoveFormatting,
  Undo,
  Redo,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useState, useCallback } from 'react'

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'rounded-lg p-2 transition-colors',
        isActive
          ? 'bg-green-500/15 text-green-400'
          : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  )
}

function ToolbarSeparator() {
  return <div className="mx-1 h-6 w-px bg-border-subtle" />
}

interface EditorToolbarProps {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const setLink = useCallback(() => {
    if (!editor) return

    if (linkUrl === '') {
      editor.chain().focus().unsetLink().run()
      setShowLinkInput(false)
      return
    }

    // Add https:// if no protocol specified
    const url = linkUrl.match(/^https?:\/\//) ? linkUrl : `https://${linkUrl}`

    editor.chain().focus().setLink({ href: url }).run()
    setLinkUrl('')
    setShowLinkInput(false)
  }, [editor, linkUrl])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border-subtle bg-bg-secondary p-2">
      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Zpět (Ctrl+Z)"
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Vpřed (Ctrl+Y)"
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Tučné (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Kurzíva (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Nadpis 2"
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Nadpis 3"
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Odrážkový seznam"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Číslovaný seznam"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Link */}
      {showLinkInput ? (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="h-8 w-48 rounded-lg border border-border-subtle bg-bg-tertiary px-3 text-sm focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                setLink()
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false)
                setLinkUrl('')
              }
            }}
            autoFocus
          />
          <Button size="sm" onClick={setLink}>
            Vložit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
          >
            Zrušit
          </Button>
        </div>
      ) : (
        <>
          <ToolbarButton
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href
              setLinkUrl(previousUrl || '')
              setShowLinkInput(true)
            }}
            isActive={editor.isActive('link')}
            title="Odkaz"
          >
            <Link className="h-4 w-4" />
          </ToolbarButton>
          {editor.isActive('link') && (
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Odstranit odkaz"
            >
              <Unlink className="h-4 w-4" />
            </ToolbarButton>
          )}
        </>
      )}

      <ToolbarSeparator />

      {/* Clear formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        title="Smazat formátování"
      >
        <RemoveFormatting className="h-4 w-4" />
      </ToolbarButton>
    </div>
  )
}
