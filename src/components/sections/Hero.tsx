import { site } from '@/content/site'
import type { Locale, SiteContent } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { HookStage } from '@/components/hero/HookStage'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'

// Section 1 (docs/05 §2, §8). DOM order = reading and focus order: H1 → subtitle → CTAs → trust
// line → stage. Grid areas move the stage under the H1 on mobile; it's not focusable.
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
    <section id="inicio" className="pt-20 pb-16 lg:pt-28 lg:pb-24">
      <Container className="grid gap-x-12 gap-y-6 [grid-template-areas:'h1'_'stage'_'sub'_'cta'_'trust'] lg:grid-cols-[1.1fr_1fr] lg:items-center lg:[grid-template-areas:'h1_stage'_'sub_stage'_'cta_stage'_'trust_stage']">
        <h1 className="text-[clamp(2rem,6vw,3.5rem)] leading-[1.1] font-bold tracking-tight text-balance [grid-area:h1] lg:self-end">
          {hero.headlines[site.hero.activeHeadline]}
        </h1>
        <p className="max-w-prose text-lg leading-relaxed text-muted [grid-area:sub]">
          {hero.subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 [grid-area:cta]">
          <BookCallLink lang={lang} location="hero">
            {hero.primaryCta}
          </BookCallLink>
          <ButtonLink variant="secondary" href={secondary.href} {...secondary.track}>
            {secondary.label}
          </ButtonLink>
        </div>
        <p className="text-sm text-muted [grid-area:trust] lg:self-start">
          {hero.trustLine[disclosure]}
        </p>
        <div className="[grid-area:stage]">
          <HookStage stage={hero.stage} href={demoStore ? site.demoUrl : '#caso'} />
        </div>
      </Container>
    </section>
  )
}
