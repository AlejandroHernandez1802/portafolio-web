import type { SiteContent } from '@/content/types'
import { SECTION } from '@/lib/routes'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// FAQ of the home (ADR-024): native <details>, no JavaScript (docs/06 §1). At most 8 questions. On the light
// cobalt band; from 1024 px the title sticks beside the list (5/7 columns). Each row (design
// system FaqItem) is an ink rule, unnumbered (not a sequence, ADR-027), and its chevron flips when open: it
// unfolds in place, so no arrow, which promises another page (docs/15 H3).
export function Faq({ faq }: { faq: SiteContent['faq'] }) {
  return (
    <Section
      id={SECTION.faq}
      tone="tint"
      containerClassName="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-12"
    >
      <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
        <SectionHeading id={SECTION.faq}>{faq.title}</SectionHeading>
      </div>
      <div className="border-t border-ink-1">
        {faq.items.map((item) => (
          <details key={item.q} className="group border-b border-ink-1">
            <summary className="group/q grid min-h-16 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3.5 text-[1.0625rem] leading-[1.35] font-semibold [&::-webkit-details-marker]:hidden">
              <span className="decoration-accent-500 decoration-2 underline-offset-4 group-hover/q:underline">
                {item.q}
              </span>
              <Icon
                name="chevron"
                className="size-5 shrink-0 text-ink-1 group-open:rotate-180 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out"
              />
            </summary>
            <p className="max-w-[65ch] pr-8 pb-6 text-ink-2">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
