import type { CaseContent, CaseStudy, Locale } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { fillCase } from '@/lib/cases'
import { pagePath, SECTION } from '@/lib/routes'
import { DeviceFrame } from '@/components/media/DeviceFrame'
import { preloadImage, ResponsiveImage } from '@/components/media/ResponsiveImage'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Container'
import { altFor, mobileTwin } from './case-media'
import './case.css'

// The case page opens like the home (docs/14 ADR-020): breadcrumb back to the work page
// (ADR-025), the outcome as the page's only H1, the summary with the live-site link, then the
// facts as a title block of mono cells (a fact whose figure is still null, like the phase 1
// weeks, is skipped).
// Below them the capture, which straddles the deep-navy results band (.case-bridge):
// - From 768 px, the desktop capture in a browser frame is the page's LCP: eager, high priority
//   and preloaded for that media only.
// - Below 768 px it is never downloaded (hideBelow). Its phone twin comes instead, after the
//   summary, link and facts, so phones keep text as their LCP (ADR-021). Lazy and display:none
//   from 768 px, so desktops never fetch it.
const DESKTOP_FROM = 768
// The container's content box: 72 rem minus the 24 px gutters, or the viewport minus them
const SHOT_SIZES = '(min-width: 1152px) 1104px, calc(100vw - 48px)'
const PHONE_SIZES = '(min-width: 400px) 256px, 64vw'

// The facts: one column below 360 px ("transportadoras" needs ~130 px), two, three, then one
// row from 1024 px whatever their count (literal classes for Tailwind)
const FACT_COLS: Record<number, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
}

export function CaseHero({
  lang,
  study,
  hero,
  breadcrumb,
  alts,
  visitSite,
}: {
  lang: Locale
  study: CaseStudy
  hero: CaseContent['page']['hero']
  breadcrumb: CaseContent['page']['breadcrumb']
  alts: CaseContent['alts']
  visitSite: string
}) {
  const facts = hero.facts.flatMap((fact) => {
    const value = fillCase(fact.value, study, lang)
    return value === null ? [] : [{ label: fact.label, value }]
  })
  const shot = study.media.hero
  const phone = mobileTwin(shot)
  preloadImage(shot, { sizes: SHOT_SIZES, media: `(min-width: ${DESKTOP_FROM}px)` })

  return (
    <Section id={SECTION.hero} backdrop="grid" className="pt-24 pb-0 lg:pt-28 lg:pb-0">
      {/* "Work / Malone Road Belt" (plan §1); JSON-LD keeps the full Home › Work › client path */}
      <nav aria-label={breadcrumb.label}>
        <ol className="flex flex-wrap items-center gap-x-2.5 label-mono text-ink-2">
          <li>
            {/* The padding widens "Work" to a 44 px target without moving the trail */}
            <a
              href={pagePath(lang, 'work')}
              className="-mx-2 inline-flex min-h-11 items-center px-2 underline"
            >
              {breadcrumb.work}
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-1">
            {study.client.name}
          </li>
        </ol>
      </nav>
      {/* Archivo at 62 %, a step below the home H1 so the capture still shows above the fold */}
      <h1
        id={`${SECTION.hero}-title`}
        className="mt-3 stretch-display text-[length:clamp(2.5rem,6.4vw,6rem)] leading-display font-extrabold tracking-display"
      >
        {hero.title}
      </h1>
      <div className="mt-8 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-8">
        <p className="max-w-[60ch] text-lead text-ink-2 lg:col-span-8">{hero.summary}</p>
        <div className="lg:col-span-4 lg:justify-self-end">
          {/* A demo's link counts as demo_open (ADR-026); a client's site is just a link */}
          <ButtonLink
            variant="secondary"
            href={study.client.url}
            target="_blank"
            rel="noopener"
            {...(study.kind === 'demo' && trackAttrs('demo_open', 'case'))}
          >
            {visitSite}
          </ButtonLink>
        </div>
      </div>
      <dl
        className={`mt-10 grid gap-x-6 gap-y-5 border-t border-ink-1 pt-5 min-[22.5rem]:grid-cols-2 sm:grid-cols-3 ${FACT_COLS[facts.length] ?? ''}`}
      >
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="min-w-0 lg:border-l lg:border-paper-3 lg:pl-5 lg:first:border-l-0 lg:first:pl-0"
          >
            <dt className="label-mono text-ink-2">{fact.label}</dt>
            <dd className="mt-2 leading-[1.35] font-semibold wrap-break-word">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="relative mt-12 lg:mt-16">
        {/* Navy from 70 % of the capture down, joining the results band below (1 px of
            overlap, covered by that band, so no seam shows at fractional positions) */}
        <div
          aria-hidden="true"
          className="case-bridge absolute inset-x-0 top-[70%] -bottom-px -z-1"
        />
        <DeviceFrame variant="browser" url={study.client.domain} className="hidden md:block">
          <ResponsiveImage
            image={shot}
            alt={altFor(alts, shot)}
            sizes={SHOT_SIZES}
            loading="eager"
            fetchPriority="high"
            hideBelow={DESKTOP_FROM}
          />
        </DeviceFrame>
        {phone && (
          <DeviceFrame variant="phone" className="mx-auto w-[min(64%,16rem)] md:hidden">
            <ResponsiveImage image={phone} alt={altFor(alts, phone)} sizes={PHONE_SIZES} />
          </DeviceFrame>
        )}
      </div>
    </Section>
  )
}
