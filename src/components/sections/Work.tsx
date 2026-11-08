import type { CaseStudy, Locale, SiteContent } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { casePath, pagePath, SECTION } from '@/lib/routes'
import { CaseCard } from '@/components/case/CaseCard'
import { ResponsiveImage } from '@/components/media/ResponsiveImage'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// The home's work section, the summary of the work page (ADR-025, ADR-027). In a portfolio the
// work is the show: the featured client case enters as its full card (the live site on the
// blueprint plate, the outcome and its figures), and the other cases follow as compact rows with
// a large thumbnail, each straight to its page. Everything comes from cases.ts, so a new case
// joins on its own. case_mrb_view fires when the section is 50 % visible for 1 s (docs/12 §3).

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
  const featured = studies.find((study) => study.kind === 'client') ?? studies[0]
  const rest = studies.filter((study) => study !== featured)
  return (
    <Section id={SECTION.work} data-track-view="case_mrb_view">
      <SectionHeading id={SECTION.work}>{work.title}</SectionHeading>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
        <p className="max-w-[48ch] text-[clamp(1.125rem,1.8vw,1.375rem)] leading-[1.4] font-medium text-ink-2 stretch-title">
          {work.lead}
        </p>
        <ButtonLink variant="secondary" href={pagePath(lang, 'work')}>
          {work.allWork}
        </ButtonLink>
      </div>

      {featured && (
        <div className="mt-12 lg:mt-16">
          <CaseCard
            lang={lang}
            study={featured}
            copy={cases[featured.id]}
            labels={work.card}
            headingId={`${SECTION.work}-${featured.id}-title`}
            headingLevel="h3"
          />
        </div>
      )}

      {rest.length > 0 && (
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16">
          {rest.map((study) => {
            const copy = cases[study.id]
            return (
              <li key={study.id} className="min-w-0">
                <a
                  href={casePath(lang, study.id)}
                  className="group flex h-full items-center gap-4 border border-ink-1 bg-paper-0 p-3 text-ink-1 no-underline hover:bg-accent-50 sm:gap-5 sm:p-4"
                  {...trackAttrs('case_open', 'work')}
                >
                  <ResponsiveImage
                    image={study.media.cardTop ?? study.media.card}
                    alt=""
                    sizes="(min-width: 640px) 160px, 112px"
                    className="shrink-0"
                    imgClassName="block size-28 border border-paper-3 object-cover object-top sm:size-40"
                  />
                  <span className="flex min-w-0 flex-col gap-2">
                    {/* Beside the thumbnail it has ~140 px on a 320 px phone: let it wrap */}
                    {study.kind === 'demo' && (
                      <Chip className="max-w-full self-start whitespace-normal!">
                        {work.card.demoBadge}
                      </Chip>
                    )}
                    <span className="text-[1.1875rem] leading-[1.2] font-bold stretch-title underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-accent-500">
                      {study.client.name}
                    </span>
                    <span className="text-[0.9375rem] leading-[1.4] text-ink-1">
                      {copy.card.outcome}
                    </span>
                    <span className="text-caption text-ink-2">{copy.card.industry}</span>
                  </span>
                  <Icon
                    name="arrow"
                    className="ml-auto size-5 shrink-0 self-center text-accent-500 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:translate-x-[3px]"
                  />
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </Section>
  )
}
