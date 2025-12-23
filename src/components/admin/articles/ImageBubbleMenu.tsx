'use client'

import { useState, useCallback, useEffect } from 'react'
import { BubbleMenu } from '@tiptap/react/menus'
import { type Editor } from '@tiptap/react'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Trash2,
  Type,
  Check,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ImageAlignment, ImageSize } from './extensions/CustomImage'

interface ImageBubbleMenuProps {
  editor: Editor
}

function MenuButton({
  onClick,
  isActive,
  children,
  title,
  variant = 'default',
}: {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  title: string
  variant?: 'default' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'rounded p-1.5 transition-colors',
        variant === 'danger'
          ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
          : isActive
            ? 'bg-green-500/20 text-green-400'
            : 'text-text-secondary hover:bg-white/10 hover:text-text-primary'
      )}
    >
      {children}
    </button>
  )
}

function MenuDivider() {
  return <div className="mx-1 h-5 w-px bg-border-subtle" />
}

export function ImageBubbleMenu({ editor }: ImageBubbleMenuProps) {
  const [showAltInput, setShowAltInput] = useState(false)
  const [altText, setAltText] = useState('')

  // Get current image attributes
  const getCurrentAlignment = useCallback((): ImageAlignment => {
    const attrs = editor.getAttributes('image')
    return (attrs.alignment as ImageAlignment) || 'center'
  }, [editor])

  const getCurrentSize = useCallback((): ImageSize => {
    const attrs = editor.getAttributes('image')
    return (attrs.size as ImageSize) || 'full'
  }, [editor])

  const getCurrentAlt = useCallback((): string => {
    const attrs = editor.getAttributes('image')
    return (attrs.alt as string) || ''
  }, [editor])

  // Update alt text when image changes
  useEffect(() => {
    if (editor.isActive('image')) {
      setAltText(getCurrentAlt())
    }
  }, [editor, getCurrentAlt])

  const setAlignment = (alignment: ImageAlignment) => {
    editor.chain().focus().setImageAlignment(alignment).run()
  }

  const setSize = (size: ImageSize) => {
    editor.chain().focus().setImageSize(size).run()
  }

  const saveAltText = () => {
    editor.chain().focus().setImageAlt(altText).run()
    setShowAltInput(false)
  }

  const cancelAltEdit = () => {
    setAltText(getCurrentAlt())
    setShowAltInput(false)
  }

  const deleteImage = () => {
    editor.chain().focus().deleteSelection().run()
  }

  const currentAlignment = getCurrentAlignment()
  const currentSize = getCurrentSize()

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => editor.isActive('image')}
      className="flex items-center gap-0.5 rounded-lg border border-border-subtle bg-bg-secondary p-1 shadow-xl"
    >
      {showAltInput ? (
        // Alt text editing mode
        <div className="flex items-center gap-2 px-1">
          <Type className="h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Popis obrázku (alt text)..."
            className="w-48 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                saveAltText()
              }
              if (e.key === 'Escape') {
                cancelAltEdit()
              }
            }}
          />
          <button
            type="button"
            onClick={saveAltText}
            className="rounded p-1 text-green-400 hover:bg-green-500/20"
            title="Uložit"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={cancelAltEdit}
            className="rounded p-1 text-text-muted hover:bg-white/10 hover:text-text-primary"
            title="Zrušit"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Alignment */}
          <div className="flex items-center">
            <MenuButton
              onClick={() => setAlignment('left')}
              isActive={currentAlignment === 'left'}
              title="Zarovnat vlevo"
            >
              <AlignLeft className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => setAlignment('center')}
              isActive={currentAlignment === 'center'}
              title="Zarovnat na střed"
            >
              <AlignCenter className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => setAlignment('right')}
              isActive={currentAlignment === 'right'}
              title="Zarovnat vpravo"
            >
              <AlignRight className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => setAlignment('full')}
              isActive={currentAlignment === 'full'}
              title="Přes celou šířku"
            >
              <Maximize2 className="h-4 w-4" />
            </MenuButton>
          </div>

          <MenuDivider />

          {/* Size */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSize('small')}
              title="Malý"
              className={cn(
                'rounded px-1.5 py-1 text-xs font-medium transition-colors',
                currentSize === 'small'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-text-secondary hover:bg-white/10 hover:text-text-primary'
              )}
            >
              S
            </button>
            <button
              type="button"
              onClick={() => setSize('medium')}
              title="Střední"
              className={cn(
                'rounded px-1.5 py-1 text-xs font-medium transition-colors',
                currentSize === 'medium'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-text-secondary hover:bg-white/10 hover:text-text-primary'
              )}
            >
              M
            </button>
            <button
              type="button"
              onClick={() => setSize('large')}
              title="Velký"
              className={cn(
                'rounded px-1.5 py-1 text-xs font-medium transition-colors',
                currentSize === 'large'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-text-secondary hover:bg-white/10 hover:text-text-primary'
              )}
            >
              L
            </button>
            <button
              type="button"
              onClick={() => setSize('full')}
              title="Plná šířka"
              className={cn(
                'rounded px-1.5 py-1 text-xs font-medium transition-colors',
                currentSize === 'full'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-text-secondary hover:bg-white/10 hover:text-text-primary'
              )}
            >
              100%
            </button>
          </div>

          <MenuDivider />

          {/* Alt text */}
          <MenuButton
            onClick={() => {
              setAltText(getCurrentAlt())
              setShowAltInput(true)
            }}
            isActive={!!getCurrentAlt()}
            title="Upravit alt text"
          >
            <Type className="h-4 w-4" />
          </MenuButton>

          <MenuDivider />

          {/* Delete */}
          <MenuButton onClick={deleteImage} title="Smazat obrázek" variant="danger">
            <Trash2 className="h-4 w-4" />
          </MenuButton>
        </>
      )}
    </BubbleMenu>
  )
}
