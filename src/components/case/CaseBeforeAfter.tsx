import type { CaseContent, CaseStudy } from '@/content/types'
import { CASE_SECTION } from '@/lib/routes'
import { DeviceFrame } from '@/components/media/DeviceFrame'
import { ResponsiveImage } from '@/components/media/ResponsiveImage'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { altFor, isPortrait } from './case-media'

// Section 03, before / after as facing panels (design system CompareCard) on the cobalt tint,
// where both the sand and the navy panel stand out. "Before" is the buying process, as text:
// archive.org has no snapshot of an older MRB site (ADR-021). From 1024 px the "after" panel
// is wider and its phone capture (the portrait one of study.media.after; the desktop one is
// already the page hero) rises from its bottom edge. Below 1024 px the panels stay text only:
// phones already saw that capture in the hero, and display:none keeps the lazy image unfetched.
// Phase B turns the panels into the compare slider (ADR-023); without JS they stay as they are.

// Before on sand with ink arrows, after on deep navy with sun checks. The light-to-dark shift
// is the story, so the order never changes.
const PANELS = {
  // Side by side, the seam side gets 48 px of padding: the 44 px arrow on the seam takes 22 px
  // of each panel, and the default 24 px left the text touching it at 768 px
  before: {
    box: 'bg-paper-2 text-ink-1 md:pr-12 lg:pl-10',
    accent: 'text-ink-2', // the label and the bullets
    icon: 'arrow',
  },
  after: {
    // Shares the before panel's ink border, so side by side the two read as one frame
    box: 'bg-deep text-on-ink-1 md:border-l-0 md:pl-12 lg:pr-10',
    accent: 'text-sun-400',
    icon: 'check',
  },
} as const

// Hidden below 1024 px, where "1px" never matters: the lazy image isn't fetched
const PHONE_SIZES = '(min-width: 1280px) 192px, (min-width: 1024px) 160px, 1px'

export function CaseBeforeAfter({
  study,
  beforeAfter,
  alts,
}: {
  study: CaseStudy
  beforeAfter: CaseContent['page']['beforeAfter']
  alts: CaseContent['alts']
}) {
  const phone = study.media.after.find(isPortrait)
  const sides = [
    { side: beforeAfter.before, p: PANELS.before },
    { side: beforeAfter.after, p: PANELS.after },
  ]
  return (
    <Section id={CASE_SECTION.beforeAfter} tone="tint">
      <SectionHeading id={CASE_SECTION.beforeAfter} index={3}>
        {beforeAfter.title}
      </SectionHeading>
      <p className="mt-5 max-w-[60ch] text-lead text-ink-2">{beforeAfter.lead}</p>

      <div
        className={`relative mt-10 grid gap-4 md:grid-cols-2 md:gap-0 lg:mt-14 ${phone ? 'lg:grid-cols-[5fr_7fr]' : ''}`}
      >
        {sides.map(({ side, p }, i) => {
          const withPhone = phone && i === 1
          return (
            <div
              key={side.label}
              className={`border border-ink-1 px-6 pt-7 pb-8 lg:pt-10 ${p.box} ${withPhone ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_10rem] lg:gap-x-8 lg:overflow-hidden lg:pb-0 xl:grid-cols-[minmax(0,1fr)_12rem] xl:gap-x-10' : 'lg:pb-12'}`}
            >
              <div className={withPhone ? 'lg:pb-12' : undefined}>
                <h3 className={`label-mono ${p.accent}`}>{side.label}</h3>
                <ul className="mt-[22px] grid gap-4">
                  {side.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[1.0625rem] leading-[1.55]">
                      <span className={`mt-1 shrink-0 ${p.accent}`}>
                        <Icon name={p.icon} className="size-4" />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {withPhone && (
                // Bottom-aligned and pulled about a third of its height past the panel's edge,
                // which clips it: the top of the phone (island and site header) always shows,
                // at any panel height. The outline separates the ink bezel from the navy panel.
                <DeviceFrame
                  variant="phone"
                  className="hidden self-end outline-1 outline-on-ink-line lg:-mb-28 lg:block xl:-mb-36"
                >
                  <ResponsiveImage image={phone} alt={altFor(alts, phone)} sizes={PHONE_SIZES} />
                </DeviceFrame>
              )}
            </div>
          )
        })}
        {/* The round cobalt arrow on the seam between the panels, only side by side */}
        <span
          aria-hidden="true"
          className={`absolute top-1/2 left-1/2 z-1 hidden size-11 -translate-1/2 place-items-center rounded-full bg-accent-500 text-white md:grid ${phone ? 'lg:left-5/12' : ''}`}
        >
          <Icon name="arrow" className="size-5" />
        </span>
      </div>
    </Section>
  )
}
