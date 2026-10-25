import type { ReactNode } from 'react'
import type { CaseStudy, Locale, SiteContent, WorkCategory } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { casePath, pagePath, SECTION } from '@/lib/routes'
import { ResponsiveImage } from '@/components/media/ResponsiveImage'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 01 of the home, the summary of the work page (docs/14 ADR-025): what I do as a big
// first-person lead with the button to the work page, beside a spec sheet of the work itself
// (an ink rule on top, hairlines between rows, mono labels, as in the About facts): the
// categories and the industries of the featured cases as chips, and one row per case with its
// thumbnail, straight to its page. Both lists come from the cases, so a demo store adds its
// own when it joins cases.ts, and nothing shows without a case behind it. case_mrb_view fires
// when the section is 50 % visible for 1 s (docs/12 §3).

function SpecRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-paper-3 py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-8">
      {/* Level with the first line of chips (32 px tall) and with the top of a project card */}
      <dt className="label-mono leading-[1.5] text-ink-2 sm:pt-2">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  )
}

export function Work({
  lang,
  work,
  studies,
  cases,
}: {
  lang: Locale
  work: SiteContent['work']
  studies: CaseStudy[] // featuredCases
  cases: SiteContent['cases'] // copy per case id
}) {
  const categories = (Object.keys(work.categories) as WorkCategory[]).filter((category) =>
    studies.some((study) => study.categories.includes(category)),
  )
  const industries = [...new Set(studies.map((study) => cases[study.id].card.industry))]
  return (
    <Section id={SECTION.work} data-track-view="case_mrb_view">
      <SectionHeading id={SECTION.work} index={1}>
        {work.title}
      </SectionHeading>
      <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-x-12">
        <div className="flex min-w-0 flex-col items-start gap-8 lg:col-span-5">
          <p className="max-w-[42ch] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.3] font-medium tracking-[-0.005em] stretch-title">
            {work.lead}
          </p>
          <ButtonLink href={pagePath(lang, 'work')} iconEnd="arrow">
            {work.allWork}
          </ButtonLink>
        </div>

        <dl className="min-w-0 border-t border-ink-1 lg:col-span-7">
          <SpecRow label={work.categoriesLabel}>
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Chip key={category} as="li">
                  {work.categories[category]}
                </Chip>
              ))}
            </ul>
          </SpecRow>
          <SpecRow label={work.industriesLabel}>
            <ul className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                // An industry can be longer than a phone is wide: let it wrap
                <Chip key={industry} as="li" tone="ink" className="max-w-full whitespace-normal!">
                  {industry}
                </Chip>
              ))}
            </ul>
          </SpecRow>
          <SpecRow label={work.projectsLabel}>
            <ul className="grid gap-3">
              {studies.map((study) => {
                const copy = cases[study.id]
                return (
                  <li key={study.id}>
                    <a
                      href={casePath(lang, study.id)}
                      className="group flex items-center gap-4 border border-ink-1 bg-paper-0 p-3 text-ink-1 no-underline hover:bg-accent-50"
                      {...trackAttrs('case_open', 'work')}
                    >
                      <ResponsiveImage
                        image={study.media.cardTop ?? study.media.card}
                        alt=""
                        sizes="80px"
                        className="shrink-0"
                        imgClassName="block size-20 border border-paper-3 object-cover object-top"
                      />
                      <span className="flex min-w-0 flex-col gap-1.5">
                        {study.kind === 'demo' && (
                          <Chip className="self-start">{work.card.demoBadge}</Chip>
                        )}
                        <span className="text-[1.0625rem] leading-[1.25] font-bold stretch-title underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-accent-500">
                          {study.client.name}
                        </span>
                        <span className="text-[0.9375rem] leading-[1.4] text-ink-2">
                          {copy.card.outcome}
                        </span>
                      </span>
                      <Icon
                        name="arrow"
                        className="ml-auto size-5 shrink-0 text-accent-500 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:translate-x-[3px]"
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </SpecRow>
        </dl>
      </div>
    </Section>
  )
}
