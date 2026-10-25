import { site } from '@/content/site'
import type { CaseContent, CaseStudy, Locale, SiteContent } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { casePath } from '@/lib/routes'
import { hasMedia } from '@/media'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { HeroHeadline } from '@/components/hero/HeroHeadline'
import { HeroShowcase } from '@/components/hero/HeroShowcase'
import { ResponsiveImage } from '@/components/media/ResponsiveImage'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { FiguresStrip } from './FiguresStrip'

// Section 1 (docs/05 §2, §8; R-06). DOM order = reading and focus order: H1 → subtitle → CTAs →
// trust line → figures → showcase, so on phones the LCP stays text and the only capture comes
// after the figures (docs/14 ADR-021). From 1024 px the H1 runs across the 12 columns; under it
// the copy takes 5 and the device frames 7, and the figures strip closes the band full width.
// The blueprint grid behind it is the only patterned backdrop of the page (design system);
// overflow-x is clipped so the frames' glow and offset lines never cause a sideways scroll.

const AVATAR = 'portrait/avatar' as const // R-09; the check icon stands in until it exists

export function Hero({
  lang,
  hero,
  study,
  caseCopy,
  pricing,
}: {
  lang: Locale
  hero: SiteContent['hero']
  study: CaseStudy // the featured case: showcase media and figures
  caseCopy: CaseContent // its alts
  pricing: SiteContent['pricing'] // the store plan's price for the figures strip
}) {
  const { demoStore } = site.features
  const caseHref = casePath(lang, study.id)
  const secondary = demoStore
    ? { href: site.demoUrl, label: hero.secondaryCta.demo, track: trackAttrs('demo_open', 'hero') }
    : { href: caseHref, label: hero.secondaryCta.case, track: trackAttrs('case_open', 'hero') }
  // "You work directly with me · Colombia, UTC−5": the promise, then the where in mono
  const [trust, ...trustMeta] = hero.trustLine.split(' · ')

  return (
    <Section
      id="inicio"
      backdrop="grid"
      className="overflow-x-clip pt-[calc(var(--header-h)+2rem)] pb-16 lg:pt-[calc(var(--header-h)+4rem)] lg:pb-24"
      containerClassName="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-12"
    >
      <HeroHeadline id="inicio-title" className="min-w-0 lg:col-span-12">
        {hero.headlines[site.hero.activeHeadline]}
      </HeroHeadline>
      <div className="flex min-w-0 flex-col gap-6 lg:col-span-5 lg:row-start-2 lg:gap-7">
        <p className="max-w-[52ch] text-lead text-ink-2">{hero.subtitle}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <BookCallLink lang={lang} location="hero" iconEnd="arrow">
            {hero.primaryCta}
          </BookCallLink>
          <ButtonLink variant="secondary" href={secondary.href} {...secondary.track}>
            {secondary.label}
          </ButtonLink>
        </div>
        <div className="flex max-w-[52ch] items-center gap-3.5 border-t border-paper-3 pt-5">
          {hasMedia(AVATAR) ? (
            <ResponsiveImage
              image={AVATAR}
              alt={site.name}
              sizes="48px"
              loading="eager"
              fetchPriority="low"
              className="shrink-0"
              imgClassName="size-12 rounded-full object-cover shadow-[0_0_0_2px_var(--paper-1),0_0_0_3px_var(--ink-1)]"
            />
          ) : (
            <Icon name="check" className="size-5 shrink-0 self-start text-ok-600" />
          )}
          <p className="text-[0.9375rem] leading-[1.35]">
            <span className="block font-semibold text-ink-1">{trust}</span>
            {trustMeta.length > 0 ? (
              <span className="mt-1.5 block label-mono leading-[1.3] text-ink-2">
                {trustMeta.join(' · ')}
              </span>
            ) : null}
          </p>
        </div>
      </div>
      <div className="mt-6 min-w-0 lg:col-span-12 lg:row-start-3 lg:mt-4">
        <FiguresStrip
          lang={lang}
          figures={hero.figures}
          study={study}
          price={pricing.plans[1].price}
          priceLabels={pricing.priceLabels}
        />
      </div>
      <div className="mt-12 min-w-0 lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:mt-0 lg:self-start">
        <HeroShowcase
          study={study}
          alts={caseCopy.alts}
          label={hero.showcase.label}
          href={caseHref}
          linkTitle={hero.secondaryCta.case}
        />
      </div>
    </Section>
  )
}
