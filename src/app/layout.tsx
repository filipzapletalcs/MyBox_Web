// Root layout - required by Next.js but locale layout handles everything
// This layout is here to satisfy Next.js requirements when using [locale] folder

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
