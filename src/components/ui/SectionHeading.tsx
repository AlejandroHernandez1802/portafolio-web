import type { ReactNode } from 'react'

// Section titles are H2: the page has a single H1 in the hero (docs/06 §3).
export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={`${id}-title`}
      className="text-[clamp(1.5rem,4vw,2.25rem)] leading-tight font-bold tracking-tight text-balance"
    >
      {children}
    </h2>
  )
}
