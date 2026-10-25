import type { KnownMediaKey } from '@/media'
import { site } from '@/content/site'
import type {
  CaseContent,
  CaseStudy,
  Locale,
  PriceByMarket,
  ServiceTile,
  ServiceTileId,
  SiteContent,
} from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { fillCase } from '@/lib/cases'
import { ABOUT_SECTION, anchorHref, pagePath, SECTION, SERVICE_ORDER } from '@/lib/routes'
import { HookStage } from '@/components/hero/HookStage'
import { DeviceFrame } from '@/components/media/DeviceFrame'
import { ResponsiveImage } from '@/components/media/ResponsiveImage'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Price } from '@/components/ui/Price'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 02, "What your store includes" (docs/14 ADR-020): a bento of the 7 services, whose
// outcome labels are the old "What I solve" lines. Desktop, 3 columns:
//   A A B      A (2 × 2) the catalog search on MRB, in a browser frame cropped by the tile
//   A A B      B (1 × 2) the hook stage, played once in view (hook.css)
//   G G C      G (2 × 1) design (ADR-025): the text beside the MRB brochure spread, C the
//   D E F        Portuguese home, D and E mono lists, F the care plan (its price only with
//   O O O        site.features.pricing), O the ownership note across, with its link
// Tablets: A across, then B G, C D and E F in pairs, and O across. Phones: one column in DOM
// order, so A and B come first. A and B carry the large type; a media tile that ends up taller
// than its content shows more of its capture. Tiles hang from a 2 px ink rule that turns cobalt
// on hover; the device captures are tinted. Phase B swaps the A and C captures for loop clips
// (the capture stays as the poster, ADR-022). The bento is the summary of the services page
// (ADR-024): the link beside the lead goes there, one block per tile, and O links to the prices
// on the About page, or to how I work while the prices are hidden (ADR-025).

// overflow-clip, not hidden: a hidden tile is a scroll container, and the stage's view()
// timeline would measure against the tile instead of the page (hook.css)
const TILE =
  'relative flex min-w-0 flex-col overflow-clip p-6 sm:p-8 before:absolute before:inset-x-0 before:top-0 before:h-0.5'
const RULE =
  'before:bg-ink-1 hover:before:bg-accent-500 motion-safe:before:transition-colors motion-safe:before:duration-200'
const PAPER = 'bg-paper-0'
const TINT = 'bg-linear-to-b/srgb from-accent-100 to-accent-50'

/** Per-tile layout; the media tiles bleed their frame off the right and bottom edges */
const LAYOUT: Record<ServiceTileId, string> = {
  catalog: `${TINT} md:col-span-2 lg:row-span-2`,
  quote: `${PAPER} lg:row-span-2`,
  // Text and print piece side by side from 1024 px
  design: `${PAPER} lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-x-8`,
  languages: TINT,
  seo: PAPER,
  analytics: PAPER,
  care: PAPER,
}

/** Proof media of a tile (study.media.services): frame width against the tile, visible height */
const MEDIA: Partial<Record<ServiceTileId, { frame: string; crop: string; sizes: string }>> = {
  catalog: {
    frame: 'w-[118%] sm:w-[112%]',
    crop: 'h-56 sm:h-72 lg:h-80',
    sizes: '(min-width: 768px) 800px, 112vw',
  },
  languages: {
    frame: 'w-[150%]',
    crop: 'h-44 sm:h-48',
    sizes: '(min-width: 1024px) 500px, (min-width: 768px) 530px, 150vw',
  },
}

/** Alt of a case capture; '' for a key the copy doesn't describe */
const altOf = (alts: CaseContent['alts'], key: KnownMediaKey) =>
  (alts as Partial<Record<KnownMediaKey, string>>)[key] ?? ''

function TileText({
  tile,
  proof,
  large,
}: {
  tile: ServiceTile
  proof: string | null
  large: boolean
}) {
  return (
    <>
      <p className="label-mono leading-[1.5] text-accent-700">{tile.outcome}</p>
      <h3
        className={
          large
            ? 'mt-4 max-w-[28ch] stretch-heading text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.02] font-extrabold tracking-[-0.01em]'
            : 'mt-3 text-[1.375rem] leading-[1.15] font-bold tracking-[-0.01em] stretch-title'
        }
      >
        {tile.title}
      </h3>
      <p className={`mt-3 text-ink-2 ${large ? 'max-w-[52ch] text-lead' : ''}`}>{tile.body}</p>
      {proof && (
        <p className="mt-5 flex items-start gap-2.5 label-mono leading-[1.5] text-ink-1">
          <span aria-hidden="true" className="mt-[5px] size-2 shrink-0 bg-sun-400" />
          {proof}
        </p>
      )}
    </>
  )
}

export function Services({
  lang,
  services,
  study,
  caseCopy,
  carePrice,
  priceLabels,
  stageHref,
  stageEvent,
}: {
  lang: Locale
  services: SiteContent['services']
  study: CaseStudy // fills the proof lines and gives the proof media
  caseCopy: CaseContent // alts of the proof media
  carePrice: PriceByMarket // pricing.plans[2].price, on tile F
  priceLabels: SiteContent['pricing']['priceLabels']
  stageHref: string // where the clickable stage goes: the case page (v1), the demo (v2)
  stageEvent: 'case_open' | 'demo_open' // what a click on it counts as
}) {
  return (
    <Section id={SECTION.services} tone="sunken">
      <SectionHeading id={SECTION.services} index={2}>
        {services.title}
      </SectionHeading>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <p className="max-w-[60ch] text-lead text-ink-2">{services.lead}</p>
        <ButtonLink variant="secondary" href={pagePath(lang, 'services')}>
          {services.allServices}
        </ButtonLink>
      </div>
      <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {SERVICE_ORDER.map((id) => {
          const tile = services.tiles[id]
          const proof = tile.proof ? fillCase(tile.proof, study, lang) : null
          const key = study.media.services[id]
          const media = key ? MEDIA[id] : undefined
          return (
            <li key={id} className={`${TILE} ${RULE} ${LAYOUT[id]}`}>
              {id === 'design' ? (
                <div className="min-w-0">
                  <TileText tile={tile} proof={proof} large={false} />
                </div>
              ) : (
                <TileText tile={tile} proof={proof} large={id === 'catalog' || id === 'quote'} />
              )}
              {tile.list && (
                <ul className="mt-6 border-t border-ink-1">
                  {tile.list.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-b border-paper-3 py-3 label-mono leading-[1.4]"
                    >
                      {/* On the first line: (16.8 px line − 6 px square) / 2 */}
                      <span
                        aria-hidden="true"
                        className="mt-[5px] size-1.5 shrink-0 bg-accent-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {id === 'quote' && (
                <HookStage
                  stage={services.stage}
                  href={stageHref}
                  track={trackAttrs(stageEvent, 'stage')}
                  className="mt-8 shrink-0 grow"
                />
              )}
              {id === 'care' && site.features.pricing && (
                // Pinned to the bottom of the tile, at least 24 px under the body
                <div className="mt-auto pt-6">
                  <div className="border-t border-ink-1 pt-5">
                    <Price price={carePrice} lang={lang} labels={priceLabels} />
                  </div>
                </div>
              )}
              {id === 'design' && key && (
                // The print piece as a sheet on the desk, bleeding off the right and bottom edges
                // like the captures; beside the text from 1024 px, where the row sets its height
                <div className="-mr-6 -mb-6 h-56 shrink-0 grow overflow-hidden pt-8 pl-4 sm:-mr-8 sm:-mb-8 sm:h-64 lg:h-auto lg:pt-2 lg:pl-0">
                  <ResponsiveImage
                    image={key}
                    alt={altOf(caseCopy.alts, key)}
                    sizes="(min-width: 1024px) 440px, (min-width: 768px) 400px, 100vw"
                    className="block"
                    imgClassName="block h-auto w-[115%] max-w-none shadow-2"
                  />
                </div>
              )}
              {key && media && (
                // Cropped by the tile: pulled into its right and bottom padding. A fixed height (a
                // flex-basis alone would count the whole frame in the row), grown into any height
                // the row gives the tile
                <div
                  className={`-mr-6 -mb-6 shrink-0 grow overflow-hidden pt-8 sm:-mr-8 sm:-mb-8 ${media.crop}`}
                >
                  <DeviceFrame variant="browser" url={study.client.domain} className={media.frame}>
                    <ResponsiveImage
                      image={key}
                      alt={altOf(caseCopy.alts, key)}
                      sizes={media.sizes}
                    />
                  </DeviceFrame>
                </div>
              )}
            </li>
          )
        })}
        {/* The closing note spans the last row; ownership is part of every build */}
        <li
          className={`${TILE} on-ink justify-between gap-6 bg-deep text-on-ink-1 before:bg-sun-400 md:col-span-2 lg:col-span-3 lg:flex-row lg:items-end`}
        >
          {/* Set a step above the tile titles: it is the one statement of the grid, and at
              tile size it left the navy block half empty */}
          <p className="max-w-[20ch] stretch-heading text-[clamp(2rem,4vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.01em]">
            {services.ownership}
          </p>
          <ButtonLink
            variant="outlineLight"
            iconEnd="arrow"
            href={anchorHref(
              pagePath(lang, 'about'),
              site.features.pricing ? ABOUT_SECTION.pricing : ABOUT_SECTION.process,
            )}
            className="self-start lg:self-end"
          >
            {site.features.pricing ? services.pricingLink : services.processLink}
          </ButtonLink>
        </li>
      </ul>
    </Section>
  )
}
