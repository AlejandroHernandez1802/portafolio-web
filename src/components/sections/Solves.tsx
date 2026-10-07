import type { SiteContent } from '@/content/types'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 2: three outcomes, no jargon (docs/06 §2).
export function Solves({ solves }: { solves: SiteContent['solves'] }) {
  return (
    <Section id="solucion" className="bg-surface">
      <SectionHeading id="solucion">{solves.title}</SectionHeading>
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {solves.items.map((item) => (
          <li key={item.title} className="rounded-2xl bg-bg p-6">
            <span className="inline-grid size-11 place-items-center rounded-xl bg-accent/10 text-accent">
              <Icon name={item.icon} className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
