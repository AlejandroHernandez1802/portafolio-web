import type { ReactNode } from 'react'

// Section titles are H2: the page has a single H1 in the hero (docs/06 §3). An ink rule above
// each one keeps the blueprint rhythm. No section numbers (ADR-027): the sections of a page are
// not steps, so numbering is kept for real sequences (the process, the "Try it" steps).

const TONES = {
  default: { text: 'text-ink-1', rule: 'bg-ink-1' },
  inverse: { text: 'text-on-ink-1', rule: 'bg-on-ink-line' }, // deep-navy bands
  accent: { text: 'text-white', rule: 'bg-white/40' }, // the cobalt closing band
}

const SIZES = {
  md: 'text-h2 stretch-heading',
  xl: 'text-h2-xl stretch-display', // closing title only
}

/** The ink rule over a title, also for titles that are not a SectionHeading (cards, blocks). */
export function HeadingRule({
  tone = 'default',
  className = '',
}: {
  tone?: keyof typeof TONES
  className?: string
}) {
  return <div aria-hidden="true" className={`h-px ${TONES[tone].rule} ${className}`} />
}

/** The spec-sheet callout: a mono box on a rule. Only the 404 page, with its status code. */
export function SectionIndex({ index, className = '' }: { index: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-3 after:h-px after:flex-1 after:bg-ink-1 ${className}`}
    >
      <span className="border border-current px-1.5 py-1 label-mono">{index}</span>
    </div>
  )
}

export function SectionHeading({
  id,
  tone = 'default',
  size = 'md',
  className = '',
  children,
}: {
  id: string
  tone?: keyof typeof TONES
  size?: keyof typeof SIZES
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`${TONES[tone].text} ${className}`}>
      <HeadingRule tone={tone} className="mb-5" />
      <h2 id={`${id}-title`} className={SIZES[size]}>
        {children}
      </h2>
    </div>
  )
}
