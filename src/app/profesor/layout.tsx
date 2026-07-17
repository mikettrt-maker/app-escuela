import { getSession } from '@/lib/session'
import { ProfesorHeader } from '@/components/profesor-header'

export default async function ProfesorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <ProfesorHeader userName={session?.nombre} />
      <main className="p-6">{children}</main>
    </div>
  )
}
