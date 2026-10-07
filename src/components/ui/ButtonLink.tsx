import type { AnchorHTMLAttributes } from 'react'
import { Icon } from './Icon'

// A real <a> rendered on the server (docs/06 §3): works without JS and accepts data-track*
// and data-cal-* attributes. Touch target ≥ 44 × 44 px.

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant
  size?: 'md' | 'sm'
  [data: `data-${string}`]: string | undefined
}

type Variant = keyof typeof VARIANTS

const VARIANTS = {
  primary: 'bg-accent font-semibold text-white motion-safe:transition-colors hover:bg-accent/90',
  secondary: 'font-semibold text-accent underline-offset-4 hover:underline',
  outline:
    'border border-muted font-semibold text-fg motion-safe:transition-colors hover:bg-surface',
  // For dark sections (closing)
  light: 'bg-bg font-semibold text-fg motion-safe:transition-colors hover:bg-surface',
  outlineLight:
    'border border-bg/50 font-semibold text-bg motion-safe:transition-colors hover:bg-bg/10',
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: Props) {
  const box =
    variant === 'secondary'
      ? 'min-h-11 gap-1.5'
      : size === 'sm'
        ? 'min-h-9 rounded-lg px-3 text-sm'
        : 'min-h-12 rounded-xl px-6 py-3 text-center'
  return (
    <a
      className={`inline-flex max-w-full items-center justify-center gap-2 ${box} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
      {variant === 'secondary' && <Icon name="arrow" className="size-4" />}
    </a>
  )
}
