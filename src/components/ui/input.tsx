import { cn } from '@/lib/utils'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
        className
      )}
      {...props}
    />
  )
}
