import { site } from '@/content/site'
import type { Locale, SiteContent } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { HeroHeadline } from '@/components/hero/HeroHeadline'
import { HookStage } from '@/components/hero/HookStage'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'

// Section 1 (docs/05 §2, §8). DOM order = reading and focus order: H1 → subtitle → CTAs → trust
// line → stage. Grid areas move the stage under the H1 on mobile; it's not focusable. From
// 1024 px the H1 runs across the container, with the copy left and the stage right. The
// blueprint grid behind it is the only patterned backdrop of the page (design system).
export function Hero({ lang, hero }: { lang: Locale; hero: SiteContent['hero'] }) {
  const { demoStore } = site.features
  const disclosure = site.caseMrb.disclosure
  const secondary = demoStore
    ? { href: site.demoUrl, label: hero.secondaryCta.demo, track: trackAttrs('demo_open', 'hero') }
    : {
        href: '#caso',
        label:
          disclosure === 'named' ? hero.secondaryCta.caseNamed : hero.secondaryCta.caseAnonymized,
        track: {},
      }

  return (
    <Section
      id="inicio"
      backdrop="grid"
      className="pt-20 pb-16 lg:pt-28 lg:pb-24"
      containerClassName="grid gap-6 [grid-template-areas:'h1'_'stage'_'copy'] lg:grid-cols-2 lg:items-center lg:gap-12 lg:[grid-template-areas:'h1_h1'_'copy_stage']"
    >
      <HeroHeadline id="inicio-title" className="[grid-area:h1]">
        {hero.headlines[site.hero.activeHeadline]}
      </HeroHeadline>
      <div className="flex min-w-0 flex-col gap-6 [grid-area:copy]">
        <p className="max-w-[52ch] text-lead text-ink-2">{hero.subtitle}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <BookCallLink lang={lang} location="hero" iconEnd="arrow">
            {hero.primaryCta}
          </BookCallLink>
          <ButtonLink variant="secondary" href={secondary.href} {...secondary.track}>
            {secondary.label}
          </ButtonLink>
        </div>
        <p className="flex max-w-[52ch] items-start gap-2.5 border-t border-paper-3 pt-4 text-sm leading-body text-ink-2">
          <Icon name="check" className="mt-[3px] size-4 shrink-0 text-ok-600" />
          <span>{hero.trustLine[disclosure]}</span>
        </p>
      </div>
      <div className="min-w-0 [grid-area:stage]">
        <HookStage stage={hero.stage} href={demoStore ? site.demoUrl : '#caso'} />
      </div>
    </Section>
  )
}
