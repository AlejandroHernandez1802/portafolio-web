import type { ReactNode } from 'react'
import { pad2 } from '@/lib/format'

// Section titles are H2: the page has a single H1 in the hero (docs/06 §3). The optional index
// draws the spec-sheet callout of the design system: a mono "04" box and an ink rule.

const TONES = {
  default: { text: 'text-ink-1', index: 'border-current', rule: 'after:bg-ink-1' },
  // Deep-navy bands (Section tone="ink"): the index turns sun yellow
  inverse: {
    text: 'text-on-ink-1',
    index: 'border-sun-400 text-sun-400',
    rule: 'after:bg-on-ink-line',
  },
  // The cobalt closing band (Section tone="accent")
  accent: { text: 'text-white', index: 'border-current', rule: 'after:bg-white/40' },
}

const SIZES = {
  md: 'text-h2 stretch-heading',
  xl: 'text-h2-xl stretch-display', // closing title only
}

/** The spec-sheet callout alone, also used by the 404 page with its status code. */
export function SectionIndex({
  index,
  tone = 'default',
  className = '',
}: {
  /** A number is zero-padded ("04"); a string is shown as is ("404") */
  index: number | string
  tone?: keyof typeof TONES
  className?: string
}) {
  const t = TONES[tone]
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-3 after:h-px after:flex-1 ${t.rule} ${className}`}
    >
      <span className={`border px-1.5 py-1 label-mono ${t.index}`}>
        {typeof index === 'number' ? pad2(index) : index}
      </span>
    </div>
  )
}

export function SectionHeading({
  id,
  index,
  tone = 'default',
  size = 'md',
  className = '',
  children,
}: {
  id: string
  /** Section number in page order; rendered zero-padded ("01") */
  index?: number
  tone?: keyof typeof TONES
  size?: keyof typeof SIZES
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`${TONES[tone].text} ${className}`}>
      {index !== undefined && <SectionIndex index={index} tone={tone} className="mb-5" />}
      <h2 id={`${id}-title`} className={SIZES[size]}>
        {children}
      </h2>
    </div>
  )
}
