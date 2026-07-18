import { getSession } from '@/lib/session'
import { PadresHeader } from '@/components/padres-header'

export default async function PadresLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <PadresHeader userName={session?.nombre} />
      <main className="p-6">{children}</main>
    </div>
  )
}
