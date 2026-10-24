import type { SiteContent } from '@/content/types'
import { pad2 } from '@/lib/format'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 5: four steps plus the weekly update line (docs/06 §2), on the deep-navy band. Each
// step hangs from a thin rule with a sun node and a giant condensed numeral (StepCard).
export function Process({ process }: { process: SiteContent['process'] }) {
  return (
    <Section id="proceso" tone="ink">
      <SectionHeading id="proceso" index={3} tone="inverse">
        {process.title}
      </SectionHeading>
      <ol className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
        {process.steps.map((step, i) => (
          <li
            key={step.title}
            className="relative flex flex-col border-t border-on-ink-line pt-6 before:absolute before:top-[-5px] before:left-0 before:size-[9px] before:bg-sun-400"
          >
            <span className="text-numeral text-sun-400 stretch-display tabular-nums">
              {pad2(i + 1)}
            </span>
            <h3 className="mt-5 text-h3">{step.title}</h3>
            <p className="mt-2 text-on-ink-2">{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-12 flex items-center gap-3 border border-on-ink-line px-5 py-4 font-medium">
        <Icon name="calendar" className="size-5 shrink-0 text-sun-400" />
        {process.weeklyUpdate}
      </p>
    </Section>
  )
}
