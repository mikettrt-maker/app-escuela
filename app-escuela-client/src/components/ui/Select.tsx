import React from 'react'

interface SelectProps {
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function Select({ name, value, onChange, required, children, className = '' }: SelectProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${className}`}
    >
      {children}
    </select>
  )
}
