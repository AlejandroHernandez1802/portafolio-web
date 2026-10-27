import type { CaseContent, CaseStudy } from '@/content/types'
import { CASE_SECTION } from '@/lib/routes'
import { Chip } from '@/components/ui/Chip'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// The overview (section 02): client, problem and my role as a ruled data sheet, then the stack as part chips
// (product names, never translated). No payments anywhere: MRB's online ordering is another
// team's phase 2. From 1024 px the heading sits in a side column, like the FAQ, which varies
// the rhythm between the full-width bands around it.
export function CaseOverview({
  study,
  overview,
  index,
}: {
  study: CaseStudy
  overview: CaseContent['page']['overview']
  index: number
}) {
  const rows = [overview.client, overview.problem, overview.role]
  const row = 'grid gap-2 border-b border-paper-3 py-6 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8'
  return (
    <Section id={CASE_SECTION.overview} containerClassName="lg:grid lg:grid-cols-12 lg:gap-x-8">
      <SectionHeading id={CASE_SECTION.overview} index={index} className="lg:col-span-4">
        {overview.title}
      </SectionHeading>
      <dl className="mt-10 border-t border-ink-1 lg:col-span-8 lg:mt-0">
        {rows.map((r) => (
          <div key={r.label} className={row}>
            <dt className="label-mono text-ink-2 md:pt-1.5">{r.label}</dt>
            <dd className="max-w-[60ch] text-lead">{r.value}</dd>
          </div>
        ))}
        <div className={row}>
          <dt className="label-mono text-ink-2 md:pt-2.5">{overview.stackLabel}</dt>
          <dd>
            <ul className="flex flex-wrap gap-2">
              {study.stack.map((item) => (
                <Chip key={item} as="li">
                  {item}
                </Chip>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </Section>
  )
}
