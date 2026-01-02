export default function BlogLoading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <section className="pt-32 pb-12">
        <div className="container-custom">
          <div className="max-w-2xl">
            {/* Title skeleton */}
            <div className="h-12 w-64 bg-bg-tertiary rounded-lg animate-pulse" />
            {/* Subtitle skeleton */}
            <div className="mt-4 h-6 w-96 bg-bg-tertiary rounded animate-pulse" />
          </div>

          {/* Category filter skeleton */}
          <div className="mt-10 flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-24 bg-bg-tertiary rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid skeleton */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                {/* Image skeleton */}
                <div className="aspect-[16/10] bg-bg-tertiary rounded-xl animate-pulse" />
                {/* Category skeleton */}
                <div className="h-6 w-20 bg-bg-tertiary rounded animate-pulse" />
                {/* Title skeleton */}
                <div className="h-6 w-full bg-bg-tertiary rounded animate-pulse" />
                <div className="h-6 w-3/4 bg-bg-tertiary rounded animate-pulse" />
                {/* Meta skeleton */}
                <div className="h-4 w-32 bg-bg-tertiary rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
