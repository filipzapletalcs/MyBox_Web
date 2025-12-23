import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Získat statistiky
  const [articlesCount, productsCount, categoriesCount] = await Promise.all([
    supabase.from('articles').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p className="text-green-700 dark:text-green-400">
          Přihlášen jako: <strong>{user?.email}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm text-neutral-500 dark:text-neutral-400">
            Články
          </h3>
          <p className="text-3xl font-bold mt-2">{articlesCount.count || 0}</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm text-neutral-500 dark:text-neutral-400">
            Produkty
          </h3>
          <p className="text-3xl font-bold mt-2">{productsCount.count || 0}</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm text-neutral-500 dark:text-neutral-400">
            Kategorie
          </h3>
          <p className="text-3xl font-bold mt-2">
            {categoriesCount.count || 0}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Rychlé akce</h2>
        <div className="flex gap-4">
          <a
            href="/admin/articles/new"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Nový článek
          </a>
          <a
            href="/admin/products"
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
          >
            Spravovat produkty
          </a>
        </div>
      </div>
    </div>
  )
}
