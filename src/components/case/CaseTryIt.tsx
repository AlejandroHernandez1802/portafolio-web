import type { CaseContent, CaseStudy } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { pad2 } from '@/lib/format'
import { CASE_SECTION } from '@/lib/routes'
import { Section } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'

// A demo's section 01 in place of the results (docs/14 ADR-026): a demo has no client figures
// to show, but it can be tried. On the same deep-navy band the hero capture straddles, the
// steps of its own "How to test" page, each with a link that opens that page of the demo in a
// new tab (demo_open from "case"), then the note that nothing is charged or shipped. Mono
// numbers in sun yellow, like the results' markers.

export function CaseTryIt({
  study,
  tryIt,
  newTab,
  index,
}: {
  study: CaseStudy
  tryIt: NonNullable<CaseContent['page']['tryIt']>
  newTab: string // for screen readers: the link opens a new tab
  index: number
}) {
  const paths = study.tryIt ?? []
  if (paths.length !== tryIt.steps.length) {
    throw new Error(`${study.id}: ${tryIt.steps.length} "Try it" steps but ${paths.length} pages`)
  }
  return (
    <Section id={CASE_SECTION.tryIt} tone="ink" className="pt-12 lg:pt-20">
      <SectionHeading id={CASE_SECTION.tryIt} index={index} tone="inverse">
        {tryIt.title}
      </SectionHeading>
      <p className="mt-5 max-w-[60ch] text-lead text-on-ink-2">{tryIt.lead}</p>
      <ol className="mt-10 grid gap-x-8 gap-y-10 lg:mt-14 lg:grid-cols-3">
        {tryIt.steps.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-4 border-t border-on-ink-line pt-5">
            <span aria-hidden="true" className="label-mono text-sun-400">
              {pad2(i + 1)}
            </span>
            <h3 className="text-[1.25rem] leading-[1.25] font-bold text-on-ink-1 stretch-title">
              {step.title}
            </h3>
            <p className="max-w-[44ch] text-on-ink-2">{step.body}</p>
            <a
              href={study.client.url + paths[i]}
              target="_blank"
              rel="noopener"
              className="mt-auto inline-flex min-h-11 items-center gap-2 self-start font-semibold text-on-ink-1 underline decoration-sun-400 decoration-2 underline-offset-4 hover:text-sun-400"
              {...trackAttrs('demo_open', 'case')}
            >
              {step.cta}
              <span className="sr-only"> {newTab}</span>
              <Icon name="external" className="size-4 shrink-0" />
            </a>
          </li>
        ))}
      </ol>
      <p className="mt-12 border-t border-on-ink-line pt-4 text-sm text-on-ink-2">{tryIt.note}</p>
    </Section>
  )
}
