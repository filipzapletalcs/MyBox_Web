import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 number */}
        <div className="text-[120px] font-bold leading-none text-primary/20 md:text-[180px]">
          404
        </div>

        {/* Title */}
        <h1 className="mt-4 text-2xl font-bold text-text-primary md:text-3xl">
          Stránka nenalezena
        </h1>

        {/* Description */}
        <p className="mt-4 text-text-secondary">
          Omlouváme se, ale stránka kterou hledáte neexistuje nebo byla přesunuta.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Zpět na úvodní stránku
          </Link>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center rounded-full border border-border-secondary px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-bg-secondary"
          >
            Kontaktujte nás
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-border-secondary">
          <p className="text-sm text-text-tertiary mb-4">Možná hledáte:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/nabijeci-stanice"
              className="text-primary hover:underline"
            >
              Nabíjecí stanice
            </Link>
            <Link href="/blog" className="text-primary hover:underline">
              Blog
            </Link>
            <Link href="/o-nas" className="text-primary hover:underline">
              O nás
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
