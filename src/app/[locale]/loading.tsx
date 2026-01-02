export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-border-secondary" />
          <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>
        {/* Text */}
        <p className="text-text-secondary text-sm">Načítání...</p>
      </div>
    </div>
  )
}
