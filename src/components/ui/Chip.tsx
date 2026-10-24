import type { ReactNode } from 'react'

// Part label from the design system (components/core Chip): mono uppercase with a cobalt
// border, like a tag on a catalog item. Not interactive; `as="li"` inside lists.

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
      className={`inline-flex min-h-8 items-center rounded-xs border px-3 py-1 font-mono text-[12.5px] leading-[1.2] font-medium tracking-[0.04em] whitespace-nowrap uppercase ${TONES[tone]} ${className}`}
    >
      {children}
    </Tag>
  )
}
