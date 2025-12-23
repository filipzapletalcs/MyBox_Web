'use client'

import { useRouter } from 'next/navigation'
import { ArticleList, type Article } from '@/components/admin/articles'

interface ArticleListWrapperProps {
  articles: Article[]
}

export function ArticleListWrapper({ articles }: ArticleListWrapperProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      router.refresh()
    } else {
      const error = await response.json()
      alert(error.error || 'Chyba při mazání článku')
    }
  }

  return <ArticleList articles={articles} onDelete={handleDelete} />
}
