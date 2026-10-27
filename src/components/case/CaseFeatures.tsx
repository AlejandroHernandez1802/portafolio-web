import type { ReactNode } from 'react'
import type { CaseContent, CaseStudy, KnownMediaKey, Locale } from '@/content/types'
import { fillCase } from '@/lib/cases'
import { pad2 } from '@/lib/format'
import { CASE_SECTION } from '@/lib/routes'
import { DeviceFrame } from '@/components/media/DeviceFrame'
import { ResponsiveImage } from '@/components/media/ResponsiveImage'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { altFor, logoOf, mobileTwin, spreadOf } from './case-media'
import './case.css'

// "What I built" (section 04, 03 on a demo): one row per study.features entry, in order. From 1024 px each row
// is a 5/7 split, text and capture, and the capture switches sides row by row. The capture sits
// on a blueprint plate (case.css) in the frame the data names:
// - browser: the desktop capture; when it has a phone twin (product-desktop → product-mobile),
//   the phone overlaps its lower right corner.
// - phone: the phone rises from the plate's bottom edge, so every plate keeps a similar height.
// - plain: a print piece (the brochure) with its inside spread, under the case's logo.
// - media null: a text-only row (analytics: no client data on screen), set as a wide ruled
//   callout that breaks the zigzag.
// Phase B swaps the search, language and quote captures for clips (ADR-022): the image inside
// each DeviceFrame is where the LoopVideo goes, with this capture as its poster.

// Widths at each breakpoint: the plate spans 7 of 12 columns from 1024 px (~544 px of frame
// inside its padding at 1280), the full container below
const SIZES = {
  browser: '(min-width: 1024px) 560px, calc(100vw - 72px)',
  browserWithTwin:
    '(min-width: 1024px) 470px, (min-width: 640px) calc(86vw - 60px), calc(100vw - 72px)',
  twin: '(min-width: 1024px) 132px, (min-width: 640px) 24vw, 1px', // hidden below 640 px
  phone: '(min-width: 1024px) 240px, 62vw',
  logo: '288px',
  cover: '(min-width: 1024px) 210px, 36vw',
  spread: '(min-width: 1024px) 340px, 56vw',
}

type Alts = CaseContent['alts']
type Feature = CaseStudy['features'][number]
type Frame = Feature['frame']
type Row = Feature & { title: string; body: string; captureLeft: boolean }

function Plate({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`case-plate ${className}`}>{children}</div>
}

/** A capture on its plate, in the frame the data names; the services page reuses it (plain) */
export function Capture({
  media,
  frame,
  url,
  alts,
}: {
  media: KnownMediaKey
  frame: Frame
  url: string
  alts: Alts
}) {
  if (frame === 'phone') {
    return (
      // No bottom padding and the phone pulled past the edge: the plate clips its lower third
      <Plate className="overflow-hidden px-6 pt-8 sm:pt-10 lg:pt-12">
        <DeviceFrame variant="phone" className="mx-auto -mb-36 w-[min(62%,15rem)] lg:-mb-40">
          <ResponsiveImage image={media} alt={altFor(alts, media)} sizes={SIZES.phone} />
        </DeviceFrame>
      </Plate>
    )
  }

  if (frame === 'browser') {
    const twin = mobileTwin(media)
    return (
      <Plate className="p-5 sm:p-8 lg:p-10">
        {/* With a twin, from 640 px the browser leaves 14 % on the right and the phone (24 %
            wide) overlaps its lower right corner: its top at ~40 % of the browser's height,
            hanging into a bottom padding of 21 % of the width (percent padding resolves
            against the width, so the composition scales). Narrower, the phone would be ~50 px
            wide, so it stays hidden (and, lazy, unfetched). The phone's placement sits on a
            wrapper: .device sets position: relative outside the utilities layer, so an
            `absolute` on the frame itself would lose. */}
        <div className={twin ? 'case-twin relative sm:pb-[21%]' : undefined}>
          <DeviceFrame variant="browser" url={url} className={twin ? 'sm:mr-[14%]' : undefined}>
            <ResponsiveImage
              image={media}
              alt={altFor(alts, media)}
              sizes={twin ? SIZES.browserWithTwin : SIZES.browser}
            />
          </DeviceFrame>
          {twin && (
            <div className="absolute right-0 bottom-0 hidden w-[24%] sm:block">
              <DeviceFrame variant="phone">
                <ResponsiveImage image={twin} alt={altFor(alts, twin)} sizes={SIZES.twin} />
              </DeviceFrame>
            </div>
          )}
        </div>
      </Plate>
    )
  }

  // plain: printed material, natural color, lifted off the plate like a sheet on a desk
  const logo = logoOf(media)
  const spread = spreadOf(media)
  const sheet = 'block h-auto w-full shadow-2'
  return (
    <Plate className="grid gap-8 p-5 sm:p-8 lg:p-10">
      {logo && (
        <ResponsiveImage
          image={logo}
          alt={altFor(alts, logo)}
          sizes={SIZES.logo}
          imgClassName="mx-auto block h-auto w-[min(70%,18rem)]"
        />
      )}
      <div
        className={`grid items-end gap-4 sm:gap-6 ${spread ? 'grid-cols-[minmax(0,5fr)_minmax(0,8fr)]' : 'mx-auto w-[min(60%,16rem)]'}`}
      >
        <ResponsiveImage
          image={media}
          alt={altFor(alts, media)}
          sizes={SIZES.cover}
          className="block"
          imgClassName={sheet}
        />
        {spread && (
          <ResponsiveImage
            image={spread}
            alt={altFor(alts, spread)}
            sizes={SIZES.spread}
            className="block"
            imgClassName={sheet}
          />
        )}
      </div>
    </Plate>
  )
}

const TITLE =
  'stretch-heading text-[length:clamp(1.75rem,3vw,2.5rem)] leading-heading font-extrabold'

export function CaseFeatures({
  lang,
  study,
  features,
  alts,
  index,
}: {
  lang: Locale
  study: CaseStudy
  features: CaseContent['page']['features']
  alts: Alts
  index: number
}) {
  // A row whose text uses a figure that is still null is skipped, and the count follows. Rows
  // with a capture alternate sides: the first has it on the left.
  const rows: Array<Row> = []
  let captures = 0
  for (const feature of study.features) {
    const item = features.items[feature.id]
    if (!item) throw new Error(`Missing copy for the "${feature.id}" row of ${study.id}`)
    const body = fillCase(item.body, study, lang)
    if (body === null) continue
    const captureLeft = feature.media !== null && captures++ % 2 === 0
    rows.push({ ...feature, title: item.title, body, captureLeft })
  }

  return (
    <Section id={CASE_SECTION.features}>
      <SectionHeading id={CASE_SECTION.features} index={index}>
        {features.title}
      </SectionHeading>
      <ol className="mt-12 grid gap-16 lg:mt-16 lg:gap-28">
        {rows.map((row, i) => {
          // Decorative counter: the <ol> already gives the position
          const counter = (
            <span aria-hidden="true" className="label-mono text-accent-700">
              {pad2(i + 1)} / {pad2(rows.length)}
            </span>
          )

          if (row.media === null) {
            return (
              <li
                key={row.id}
                data-feature={row.id}
                className="grid gap-4 border-y border-ink-1 py-10 lg:grid-cols-12 lg:gap-8 lg:py-14"
              >
                <div className="lg:col-span-5">
                  {counter}
                  <h3 className={`mt-4 ${TITLE}`}>{row.title}</h3>
                </div>
                <p className="max-w-[60ch] text-lead text-ink-2 lg:col-span-7 lg:pt-8">
                  {row.body}
                </p>
              </li>
            )
          }

          // Text first in the DOM (heading, then its proof); from 1024 px the capture moves to
          // the left on every other row
          return (
            <li
              key={row.id}
              data-feature={row.id}
              className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-5">
                {counter}
                <h3 className={`mt-4 ${TITLE}`}>{row.title}</h3>
                <p className="mt-4 max-w-[52ch] text-lead text-ink-2">{row.body}</p>
              </div>
              <div className={`min-w-0 lg:col-span-7 ${row.captureLeft ? 'lg:order-first' : ''}`}>
                <Capture
                  media={row.media}
                  frame={row.frame}
                  url={study.client.domain}
                  alts={alts}
                />
              </div>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
