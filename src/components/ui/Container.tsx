import type { ReactNode } from 'react'
import './section.css'

// 72 rem max width with a 16 px gutter on mobile (docs/06 §3).
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mx-auto w-full max-w-[72rem] px-4 sm:px-6 ${className}`}>{children}</div>
}

// Band surfaces from the design system (components/layout). Bands are soft gradients between
// palette neighbors, never flat blocks; ink and accent switch the focus ring to sun yellow.
const TONES = {
  paper: 'bg-paper-1 text-ink-1',
  raised: 'bg-paper-0 text-ink-1',
  sunken: 'bg-linear-to-b/srgb from-paper-2 to-sand-50 text-ink-1',
  tint: 'bg-linear-to-b/srgb from-accent-100 to-accent-50 text-ink-1',
  ink: 'on-ink bg-deep text-on-ink-1',
  // The closing call to action only: one per page
  accent: 'on-ink on-accent bg-linear-160/srgb from-accent-500 to-accent-600 text-white',
}

type SectionTone = keyof typeof TONES

/** A page section with the vertical rhythm of docs/06 §3 (py-16 → py-24). */
export function Section({
  id,
  children,
  tone = 'paper',
  backdrop = 'none',
  className = '',
  containerClassName = '',
  ...rest
}: {
  id: string
  children: ReactNode
  tone?: SectionTone
  /** `grid`: the blueprint backdrop of the hero (section.css) */
  backdrop?: 'none' | 'grid'
  className?: string
  /** Classes for the inner Container, e.g. a layout grid */
  containerClassName?: string
  [data: `data-${string}`]: string | undefined
}) {
  const grid = backdrop === 'grid' ? 'section--grid' : ''
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative py-16 lg:py-24 ${TONES[tone]} ${grid} ${className}`}
      {...rest}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}
