import type { SiteContent } from '@/content/types'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 7: native <details>, no JavaScript (docs/06 §1). At most 8 questions.
export function Faq({ faq }: { faq: SiteContent['faq'] }) {
  return (
    <Section id="preguntas" className="bg-surface">
      <SectionHeading id="preguntas">{faq.title}</SectionHeading>
      <div className="mt-10 max-w-3xl divide-y divide-border/60 rounded-2xl bg-bg px-6">
        {faq.items.map((item) => (
          <details key={item.q} className="group py-2">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
              {item.q}
              <Icon
                name="arrow"
                className="size-4 shrink-0 text-muted group-open:rotate-90 motion-safe:transition-transform"
              />
            </summary>
            <p className="pb-4 leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
