import type { CaseContent, CaseStudy } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { hasMedia, type KnownMediaKey } from '@/media'
import { DeviceFrame } from '@/components/media/DeviceFrame'
import { preloadImage, ResponsiveImage } from '@/components/media/ResponsiveImage'
import './showcase.css'

// The real work in the hero (R-06, docs/14 ADR-021): the client's live home in a large browser
// frame, with its quote form in a phone frame over the lower right corner, hanging below it.
// From 1024 px it is the right column, and the browser capture may be the desktop LCP: eager,
// high priority and preloaded for that width only. Below 1024 px only the phone shows, after
// the CTAs and the figures, and the browser capture is never downloaded, so phones keep text as
// their LCP. No capture fades in or starts hidden. A key missing from the media manifest drops
// its frame; with neither, or a case that isn't named, nothing renders (captures name the
// client, ADR-020).

const DESKTOP = '(min-width: 1024px)'

// CSS widths of the captures, shared by each <picture> and the preload so both pick the same
// file: the browser fills 7 of the 12 columns (624 px at the container's 72 rem), the phone's
// screen is 30 % of that minus its bezel, and on phones it is min(16rem, 66 %) of the column.
const BROWSER_SIZES = `(min-width: 1152px) 624px, ${DESKTOP} calc(58.4vw - 48px), 1px`
const PHONE_SIZES = `${DESKTOP} 176px, (min-width: 420px) 240px, 66vw`

export function HeroShowcase({
  study,
  alts,
  label,
  href,
  linkTitle,
}: {
  study: CaseStudy
  alts: CaseContent['alts']
  label: string // caption: hero.showcase.label
  href: string // the case page (casePath)
  linkTitle: string // tooltip of the clickable frames: hero.secondaryCta.case
}) {
  if (study.disclosure !== 'named') return null
  const { browser, phone } = study.media.showcase
  const withBrowser = hasMedia(browser)
  const withPhone = hasMedia(phone)
  if (!withBrowser && !withPhone) return null
  if (withBrowser) preloadImage(browser, { sizes: BROWSER_SIZES, media: DESKTOP })
  const alt = (key: KnownMediaKey) => (alts as Partial<Record<KnownMediaKey, string>>)[key] ?? ''

  return (
    <figure
      className="showcase"
      data-frames={withBrowser && withPhone ? 'both' : withBrowser ? 'browser' : 'phone'}
    >
      {withBrowser ? (
        <div className="showcase__frame showcase__browser">
          <DeviceFrame variant="browser" url={study.client.domain}>
            <ResponsiveImage
              image={browser}
              alt={alt(browser)}
              sizes={BROWSER_SIZES}
              loading="eager"
              fetchPriority="high"
              hideBelow={1024}
            />
          </DeviceFrame>
        </div>
      ) : null}
      {withPhone ? (
        <div className="showcase__frame showcase__phone">
          <DeviceFrame variant="phone">
            {/* Phase B (ADR-022): the quote clip plays here, with this capture as its poster.
                Eager at low priority: in view on desktop, below the fold on phones */}
            <ResponsiveImage
              image={phone}
              alt={alt(phone)}
              sizes={PHONE_SIZES}
              loading="eager"
              fetchPriority="low"
            />
          </DeviceFrame>
        </div>
      ) : null}
      <figcaption className="showcase__caption inline-flex max-w-full items-center gap-2 rounded-xs bg-deep px-3 py-2 label-mono leading-[1.3] text-on-ink-1">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-sun-400" />
        {label}
      </figcaption>
      {/* People click the screenshots: the whole figure opens the case. Hidden from assistive
          tech and out of the tab order like the old stage (docs/05 §7), because the secondary
          CTA goes to the same page; the images keep their alts outside it */}
      <a
        href={href}
        title={linkTitle}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 z-10"
        {...trackAttrs('case_open', 'hero')}
      />
    </figure>
  )
}
