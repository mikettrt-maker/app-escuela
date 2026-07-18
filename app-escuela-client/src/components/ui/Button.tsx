import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
}

export function Button({
  children, onClick, type = 'button', variant = 'primary',
  size = 'md', disabled = false, className = '',
}: ButtonProps) {
  const base = 'rounded-xl font-medium transition-all duration-150 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30',
    danger: 'text-[var(--error)] border border-[var(--border)] hover:bg-red-500/10 hover:border-red-500/30',
    secondary: 'text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-hover)]',
    ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-sm',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={variant === 'primary' ? { background: 'var(--gradient)' } : undefined}
    >
      {children}
    </button>
  )
}
