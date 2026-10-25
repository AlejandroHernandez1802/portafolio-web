import { site } from '@/content/site'
import type { SiteContent, TrackLocation } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { ABOUT_SECTION } from '@/lib/routes'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// LinkedIn in the place of the prices while site.features.pricing is off (docs/14 ADR-025): a
// profile card, an ink-ruled sheet like the plans it replaces, with the LinkedIn mark, the call
// to action and the profile address in mono. It opens a new tab (said to screen readers) and
// counts as linkedin_open. The About page gives it a section (02, #linkedin); the home summary
// shows the card alone.

/** linkedin.com/in/…, the address as people read it */
const PROFILE = site.contact.linkedin.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')

export function LinkedInCard({
  linkedin,
  location,
  className = '',
}: {
  linkedin: SiteContent['linkedin']
  location: TrackLocation
  className?: string
}) {
  return (
    <a
      href={site.contact.linkedin}
      target="_blank"
      rel="noopener"
      className={`group flex items-center gap-4 border border-ink-1 bg-paper-0 p-4 text-ink-1 no-underline hover:bg-accent-50 sm:gap-5 sm:p-5 ${className}`}
      {...trackAttrs('linkedin_open', location)}
    >
      <Icon name="linkedin" className="size-10 shrink-0 text-accent-500 sm:size-12" />
      <span className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[1.0625rem] leading-[1.25] font-bold stretch-title underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-accent-500">
          {linkedin.cta}
          <span className="sr-only"> {linkedin.newTab}</span>
        </span>
        <span className="label-mono leading-[1.5] wrap-anywhere text-ink-2">{PROFILE}</span>
      </span>
      <Icon name="external" className="ml-auto size-5 shrink-0 text-accent-500" />
    </a>
  )
}

export function LinkedIn({
  linkedin,
  index,
}: {
  linkedin: SiteContent['linkedin']
  index: number
}) {
  return (
    <Section id={ABOUT_SECTION.linkedin}>
      <SectionHeading id={ABOUT_SECTION.linkedin} index={index}>
        {linkedin.title}
      </SectionHeading>
      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-12">
        <p className="max-w-[42ch] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.3] font-medium tracking-[-0.005em] stretch-title lg:col-span-7">
          {linkedin.body}
        </p>
        <LinkedInCard linkedin={linkedin} location="about" className="lg:col-span-5" />
      </div>
    </Section>
  )
}
