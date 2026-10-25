import type { KnownMediaKey } from '@/media'
import type { CaseContent, CaseStudy, Locale, SiteContent } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { resolveMetrics } from '@/lib/cases'
import { casePath } from '@/lib/routes'
import { DeviceFrame } from '@/components/media/DeviceFrame'
import { ResponsiveImage } from '@/components/media/ResponsiveImage'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Chip } from '@/components/ui/Chip'
import { SectionIndex } from '@/components/ui/SectionHeading'

// A featured case, results first (docs/14 ADR-020). From 1024 px a 7/5 split: the live site in a
// browser frame on a blueprint plate, then the meta line, the outcome (H2), the first 3 metrics
// that have a value (the quote count joins once cases.ts has it), the built chips and the two
// links. The full-page capture slides down while any part of the card is hovered or focused
// (data-device-hover, device-frame.css); touch screens, which never hover, get only its top
// square (media.cardTop), half the bytes. The plate repeats the case link for the pointer
// only: aria-hidden and out of the tab order, like the hero stage (docs/05 §7). The cards live on
// the work page (ADR-025): numbered like the blocks of the services page, the outcome as their
// H2 under the page's H1. `reverse` puts the plate on the right from 1024 px (every other card,
// ADR-024); a demo store carries the "Demo · my own project" chip over its meta line and never
// shows client figures.

const PLATE =
  'flex items-center justify-center border border-ink-1 bg-accent-50 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-size-[var(--grid-size)_var(--grid-size)] bg-position-[-1px_-1px] p-4 sm:p-8'

/** Alt of a case capture; '' for a key the copy doesn't describe */
const altOf = (alts: CaseContent['alts'], key: KnownMediaKey) =>
  (alts as Partial<Record<KnownMediaKey, string>>)[key] ?? ''

export function CaseCard({
  lang,
  study,
  copy,
  labels,
  index,
  headingId,
  reverse = false,
}: {
  lang: Locale
  study: CaseStudy
  copy: CaseContent
  labels: SiteContent['work']['card']
  index: number // its number on the work page, from 1
  headingId: string // the H2, which names the card's section
  reverse?: boolean
}) {
  const { card } = copy
  const href = casePath(lang, study.id)
  // A demo store has no client results to show, whatever its copy lists
  const metrics = study.kind === 'demo' ? [] : resolveMetrics(card.metrics, study, lang, 3)
  return (
    <article
      data-device-hover
      className={`grid gap-8 lg:gap-12 ${reverse ? 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]' : 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]'}`}
    >
      <a
        href={href}
        aria-hidden="true"
        tabIndex={-1}
        title={labels.viewCase}
        className={`${PLATE} ${reverse ? 'lg:order-last' : ''}`}
        {...trackAttrs('case_open', 'work')}
      >
        {/* A square screen: the tall capture shows more of the page and fills the plate */}
        <DeviceFrame
          variant="browser"
          url={study.client.domain}
          aspect="1 / 1"
          scrollOnHover
          className="w-full"
        >
          <ResponsiveImage
            image={study.media.card}
            alt={altOf(copy.alts, study.media.card)}
            sizes="(min-width: 1152px) 552px, (min-width: 1024px) 48vw, calc(100vw - 66px)"
            art={study.media.cardTop && { media: '(hover: none)', image: study.media.cardTop }}
          />
        </DeviceFrame>
      </a>

      <div className="flex min-w-0 flex-col lg:py-2">
        <SectionIndex index={index} className="mb-5" />
        {study.kind === 'demo' && (
          <Chip tone="ink" className="mb-3 self-start">
            {labels.demoBadge}
          </Chip>
        )}
        <p className="label-mono leading-[1.5] text-ink-2">{card.meta}</p>
        <h2
          id={headingId}
          className="mt-4 stretch-heading text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.02] font-extrabold tracking-[-0.01em]"
        >
          {card.outcome}
        </h2>

        {/* Rows on a shared 2-column subgrid so the numbers line up whatever their width.
            The sun marker under each number is the final state of the phase B reveal (ADR-023) */}
        {metrics.length > 0 && (
          <dl className="mt-8 grid grid-cols-[max-content_minmax(0,1fr)] border-t border-ink-1">
            {metrics.map((m) => (
              <div
                key={m.id}
                className="col-span-2 grid grid-cols-subgrid items-center gap-x-5 border-b border-paper-3 py-4"
              >
                <dt className="col-start-2 row-start-1 label-mono leading-[1.5] text-ink-2">
                  {m.label}
                </dt>
                <dd className="col-start-1 row-start-1">
                  <span className="relative isolate stretch-display text-[clamp(2.75rem,5vw,4rem)] leading-[0.85] font-extrabold tabular-nums before:absolute before:inset-x-[-0.08em] before:bottom-[0.14em] before:-z-10 before:h-[0.3em] before:bg-sun-400">
                    {m.value}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}

        <h3 className="mt-8 label-mono text-ink-2">{labels.builtLabel}</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {card.built.map((item) => (
            <Chip key={item} as="li">
              {item}
            </Chip>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-auto lg:pt-8">
          <ButtonLink href={href} iconEnd="arrow" {...trackAttrs('case_open', 'work')}>
            {labels.viewCase}
          </ButtonLink>
          <ButtonLink variant="secondary" href={study.client.url} target="_blank" rel="noopener">
            {copy.visitSite}
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
