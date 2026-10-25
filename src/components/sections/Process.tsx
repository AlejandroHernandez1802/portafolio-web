import type { SiteContent } from '@/content/types'
import { pad2 } from '@/lib/format'
import { ABOUT_SECTION } from '@/lib/routes'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// The About page's section 01 (ADR-024): four steps with their duration chip, then the weekly update and the rounds of
// changes (docs/06 §2), on the deep-navy band. Each step hangs from the timeline with a sun node
// and a giant condensed numeral (StepCard). The timeline is a vertical rail on phones; from
// 768 px the steps have no column gap, so their top rules join into one line per row (one line
// across all 4 from 1024 px). Static for now: phase B fills it with sun on scroll (ADR-023).

const STEP =
  'relative flex flex-col pb-10 pl-9 last:pb-0 md:border-t md:border-on-ink-line md:pt-6 md:pr-6 md:pb-0 md:pl-0'
// Sun node on the rail; on phones a 1 px rail runs from each node down to the next one
const NODE =
  'before:absolute before:top-1.5 before:left-0 before:size-[9px] before:bg-sun-400 md:before:-top-[5px] after:absolute after:top-[15px] after:-bottom-1.5 after:left-1 after:w-px after:bg-on-ink-line last:after:hidden md:after:hidden'

export function Process({ process, index }: { process: SiteContent['process']; index: number }) {
  return (
    <Section id={ABOUT_SECTION.process} tone="ink">
      <SectionHeading id={ABOUT_SECTION.process} index={index} tone="inverse">
        {process.title}
      </SectionHeading>
      <ol className="mt-12 grid md:grid-cols-2 md:gap-y-12 lg:mt-14 lg:grid-cols-4">
        {process.steps.map((step, i) => (
          <li key={step.title} className={`${STEP} ${NODE}`}>
            <span className="stretch-display text-numeral text-sun-400 tabular-nums">
              {pad2(i + 1)}
            </span>
            <h3 className="mt-5 text-h3">{step.title}</h3>
            {/* Duration chip: the outline version of Chip for the deep band */}
            <p className="mt-3 inline-flex min-h-8 items-center self-start rounded-xs border border-on-ink-2/60 px-3 py-1 font-mono text-[12.5px] leading-[1.2] font-medium tracking-[0.04em] text-on-ink-1 uppercase">
              {step.duration}
            </p>
            <p className="mt-3 text-on-ink-2">{step.body}</p>
          </li>
        ))}
      </ol>
      <ul className="mt-14 grid border border-on-ink-line font-medium sm:grid-cols-2">
        <li className="flex items-center gap-3 px-5 py-4">
          <Icon name="calendar" className="size-5 shrink-0 text-sun-400" />
          {process.weeklyUpdate}
        </li>
        <li className="flex items-center gap-3 border-t border-on-ink-line px-5 py-4 sm:border-t-0 sm:border-l">
          <Icon name="check" className="size-5 shrink-0 text-sun-400" />
          {process.changes}
        </li>
      </ul>
    </Section>
  )
}
