import React from 'react'

interface InputProps {
  name?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  step?: string
  min?: string
  max?: string
  className?: string
}

export function Input({
  name, type = 'text', value, onChange, placeholder,
  required, step, min, max, className = '',
}: InputProps) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      step={step}
      min={min}
      max={max}
      className={`w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-base text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${className}`}
    />
  )
}
