import type { ReactNode } from 'react'

// Part label from the design system (components/core Chip): a cobalt border, like a tag on a
// catalog item. Sentence case in Archivo since ADR-027 (no mono, no all caps). Not interactive; `as="li"` inside lists.

const TONES = {
  default: 'border-accent-500 bg-accent-100 text-accent-700',
  ink: 'border-deep bg-deep text-on-ink-1',
  accent: 'border-accent-500 bg-accent-500 text-white', // at most once per view
}

export function Chip({
  tone = 'default',
  as: Tag = 'span',
  className = '',
  children,
}: {
  tone?: keyof typeof TONES
  as?: 'span' | 'li'
  className?: string
  children: ReactNode
}) {
  return (
    <Tag
      className={`inline-flex min-h-8 items-center rounded-xs border px-3 py-1 text-[0.8125rem] leading-[1.2] font-semibold whitespace-nowrap ${TONES[tone]} ${className}`}
    >
      {children}
    </Tag>
  )
}
