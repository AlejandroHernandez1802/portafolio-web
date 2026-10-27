import type { CaseContent, CaseStudy, Locale } from '@/content/types'
import { resolveMetrics } from '@/lib/cases'
import { CASE_SECTION } from '@/lib/routes'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// The results bar (section 01) on the deep-navy band that starts behind the hero capture
// (CaseHero .case-bridge), hence the shorter top padding. Big condensed figures with a sun
// marker under each (the static final state; phase B draws it in on scroll, ADR-023) and mono
// labels. A metric whose figure is null is skipped, so there are 3 until the quote count
// exists, and the quote sentence of the source note only shows with that figure.

// One row from 1024 px, whatever the count (literal classes for Tailwind)
const COLS: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
}

export function CaseResults({
  lang,
  study,
  results,
  index,
}: {
  lang: Locale
  study: CaseStudy
  results: NonNullable<CaseContent['page']['results']>
  index: number
}) {
  const metrics = resolveMetrics(results.items, study, lang)
  const source = [results.source.catalog]
  if (study.figures.quotes !== null) source.push(results.source.quotes)
  return (
    <Section id={CASE_SECTION.results} tone="ink" className="pt-12 lg:pt-20">
      <SectionHeading id={CASE_SECTION.results} index={index} tone="inverse">
        {results.title}
      </SectionHeading>
      <dl
        className={`mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-14 ${COLS[metrics.length] ?? ''}`}
      >
        {metrics.map((m) => (
          <div
            key={m.id}
            className="flex min-w-0 flex-col-reverse justify-end gap-4 border-t border-on-ink-line pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
          >
            <dt className="max-w-[26ch] label-mono leading-[1.5] text-on-ink-2">{m.label}</dt>
            <dd>
              <span className="block stretch-display text-numeral text-on-ink-1 tabular-nums">
                {m.value}
              </span>
              <span aria-hidden="true" className="mt-4 block h-1.5 w-14 bg-sun-400" />
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-12 border-t border-on-ink-line pt-4 text-sm text-on-ink-2">
        {source.join(' ')}
      </p>
    </Section>
  )
}
