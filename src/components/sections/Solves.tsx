import type { SiteContent } from '@/content/types'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 2: three outcomes, no jargon (docs/06 §2). Feature tiles of the design system: raised
// paper with a 2 px cobalt top rule, no shadow or radius; the icon is sun on a cobalt square.
export function Solves({ solves }: { solves: SiteContent['solves'] }) {
  return (
    <Section id="solucion" tone="sunken">
      <SectionHeading id="solucion" index={1}>
        {solves.title}
      </SectionHeading>
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {solves.items.map((item) => (
          <li
            key={item.title}
            className="flex flex-col border-t-2 border-accent-500 bg-paper-0 px-6 pt-7 pb-8"
          >
            <span className="inline-grid size-11 place-items-center self-start rounded-xs bg-accent-500 text-sun-400">
              <Icon name={item.icon} className="size-6" />
            </span>
            <h3 className="mt-6 text-h3 tracking-[-0.005em]">{item.title}</h3>
            <p className="mt-2 text-ink-2">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
