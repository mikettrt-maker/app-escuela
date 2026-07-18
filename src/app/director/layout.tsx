import { getSession } from '@/lib/session'
import { Sidebar } from '@/components/ui/sidebar'

export default async function DirectorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <div className="flex min-h-screen">
      <Sidebar userName={session?.nombre} userEmail={session?.email} />
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  )
}
