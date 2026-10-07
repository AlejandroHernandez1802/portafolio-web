import type { SiteContent } from '@/content/types'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 5: four steps plus the weekly update line (docs/06 §2).
export function Process({ process }: { process: SiteContent['process'] }) {
  return (
    <Section id="proceso" className="bg-surface">
      <SectionHeading id="proceso">{process.title}</SectionHeading>
      <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {process.steps.map((step, i) => (
          <li key={step.title} className="rounded-2xl bg-bg p-6">
            <span className="text-sm font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-8 font-medium">{process.weeklyUpdate}</p>
    </Section>
  )
}
