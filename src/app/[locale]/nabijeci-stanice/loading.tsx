export default function ChargingStationsLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <section className="relative h-[60vh] min-h-[500px] bg-bg-secondary">
        <div className="container-custom h-full flex items-center">
          <div className="max-w-2xl">
            {/* Title skeleton */}
            <div className="h-14 w-80 bg-bg-tertiary rounded-lg animate-pulse" />
            {/* Subtitle skeleton */}
            <div className="mt-4 h-6 w-full bg-bg-tertiary rounded animate-pulse" />
            <div className="mt-2 h-6 w-3/4 bg-bg-tertiary rounded animate-pulse" />
            {/* CTA skeleton */}
            <div className="mt-8 flex gap-4">
              <div className="h-12 w-40 bg-primary/20 rounded-full animate-pulse" />
              <div className="h-12 w-40 bg-bg-tertiary rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* AC/DC Selector skeleton */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-bg-tertiary rounded-lg mx-auto animate-pulse" />
            <div className="mt-4 h-6 w-96 bg-bg-tertiary rounded mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="h-64 bg-bg-tertiary rounded-2xl animate-pulse" />
            <div className="h-64 bg-bg-tertiary rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>

      {/* Products skeleton */}
      <section className="py-20 bg-bg-secondary">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-bg-tertiary rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
