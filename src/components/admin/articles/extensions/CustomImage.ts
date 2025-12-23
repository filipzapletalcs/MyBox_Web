'use client'

import Image from '@tiptap/extension-image'

export type ImageAlignment = 'left' | 'center' | 'right' | 'full'
export type ImageSize = 'small' | 'medium' | 'large' | 'full'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      setImageAlignment: (alignment: ImageAlignment) => ReturnType
      setImageSize: (size: ImageSize) => ReturnType
      setImageAlt: (alt: string) => ReturnType
    }
  }
}

export const CustomImage = Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),
      alignment: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-alignment') || 'center',
        renderHTML: (attributes) => ({
          'data-alignment': attributes.alignment,
        }),
      },
      size: {
        default: 'full',
        parseHTML: (element) => element.getAttribute('data-size') || 'full',
        renderHTML: (attributes) => ({
          'data-size': attributes.size,
        }),
      },
      alt: {
        default: '',
        parseHTML: (element) => element.getAttribute('alt') || '',
        renderHTML: (attributes) => ({
          alt: attributes.alt || '',
        }),
      },
    }
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageAlignment:
        (alignment: ImageAlignment) =>
        ({ commands }) => {
          return commands.updateAttributes('image', { alignment })
        },
      setImageSize:
        (size: ImageSize) =>
        ({ commands }) => {
          return commands.updateAttributes('image', { size })
        },
      setImageAlt:
        (alt: string) =>
        ({ commands }) => {
          return commands.updateAttributes('image', { alt })
        },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const alignment = HTMLAttributes['data-alignment'] || 'center'
    const size = HTMLAttributes['data-size'] || 'full'

    // Alignment classes
    const alignmentClasses: Record<ImageAlignment, string> = {
      left: 'mr-auto',
      center: 'mx-auto',
      right: 'ml-auto',
      full: 'w-full',
    }

    // Size classes
    const sizeClasses: Record<ImageSize, string> = {
      small: 'max-w-xs',
      medium: 'max-w-md',
      large: 'max-w-2xl',
      full: 'max-w-full',
    }

    const baseClasses = 'rounded-lg h-auto my-6 block'
    const classes = `${baseClasses} ${alignmentClasses[alignment as ImageAlignment]} ${sizeClasses[size as ImageSize]}`

    return [
      'img',
      {
        ...HTMLAttributes,
        class: classes,
      },
    ]
  },
})
