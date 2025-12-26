import { Cpu } from 'lucide-react'

export default function TechnologyPage() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary py-16">
      <Cpu className="h-12 w-12 text-text-muted" />
      <h3 className="mt-4 text-lg font-medium text-text-primary">Připravujeme</h3>
      <p className="mt-1 text-text-secondary">
        Sekce technologií bude brzy k dispozici.
      </p>
    </div>
  )
}
