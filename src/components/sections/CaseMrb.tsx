import Image from 'next/image'
import { site } from '@/content/site'
import type { ImageRef, SiteContent } from '@/content/types'
import { publicFileExists } from '@/lib/links'
import { Icon } from '@/components/ui/Icon'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Chip } from '@/components/ui/Chip'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 3: the MRB case in `named` or `anonymized` mode (docs/04 §6). The metric,
// testimonial and link appear only when they exist and the mode allows them.

function Shots({ images, after }: { images: ImageRef[]; after: boolean }) {
  const ready = images.filter((img) => publicFileExists(img.src))
  if (ready.length === 0) return null
  return (
    <div className="mt-6 grid gap-3">
      {ready.map((img) => (
        <Image
          key={img.src}
          src={img.src}
          width={img.width}
          height={img.height}
          alt={img.alt}
          // Real screenshots with a thin hairline, natural color (design system: images)
          className={`h-auto w-full border ${after ? 'border-on-ink-line' : 'border-paper-3'}`}
        />
      ))}
    </div>
  )
}

// Facing panels (CompareCard): before on sand with ink arrows, after on deep navy with sun
// checks. The light-to-dark shift is the story, so the order never changes.
const PANELS = {
  // Side by side, the seam side gets 48 px of padding: the 44 px arrow on the seam takes 22 px
  // of each panel, and the default 24 px left the text touching it at 768 px
  before: {
    box: 'bg-paper-2 text-ink-1 md:pr-12',
    accent: 'text-ink-2', // the label and the bullets
    icon: 'arrow',
  },
  after: {
    // Shares the before panel's ink border, so side by side the two read as one frame
    box: 'bg-deep text-on-ink-1 md:border-l-0 md:pl-12',
    accent: 'text-sun-400',
    icon: 'check',
  },
} as const

export function CaseMrb({ caseMrb }: { caseMrb: SiteContent['caseMrb'] }) {
  const mode = site.caseMrb.disclosure
  const named = mode === 'named'
  return (
    <Section id="caso" data-track-view="case_mrb_view">
      <SectionHeading id="caso" index={2}>
        {caseMrb.title[mode]}
      </SectionHeading>
      <p className="mt-5 max-w-[60ch] text-lead text-ink-2">{caseMrb.summary[mode]}</p>

      <div className="relative mt-10 grid gap-4 md:grid-cols-2 md:gap-0">
        {[caseMrb.before, caseMrb.after].map((side, i) => {
          const p = PANELS[i === 0 ? 'before' : 'after']
          return (
            <div key={side.label} className={`border border-ink-1 px-6 pt-7 pb-8 ${p.box}`}>
              <h3 className={`label-mono ${p.accent}`}>{side.label}</h3>
              <ul className="mt-[22px] grid gap-3.5">
                {side.points.map((point) => (
                  <li key={point} className="flex gap-3 leading-[1.55]">
                    <span className={`mt-1 shrink-0 ${p.accent}`}>
                      <Icon name={p.icon} className="size-4" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Shots images={side.images[mode]} after={i === 1} />
            </div>
          )
        })}
        {/* The round cobalt arrow on the seam between the panels, only side by side */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 z-1 hidden size-11 -translate-1/2 place-items-center rounded-full bg-accent-500 text-white md:grid"
        >
          <Icon name="arrow" className="size-5" />
        </span>
      </div>

      <h3 className="mt-10 label-mono text-ink-2">{caseMrb.builtLabel}</h3>
      <ul className="mt-3.5 flex flex-wrap gap-2">
        {caseMrb.built.map((item) => (
          <Chip key={item} as="li">
            {item}
          </Chip>
        ))}
      </ul>

      {named && caseMrb.result && (
        <p className="mt-10 text-price stretch-heading">
          {caseMrb.result.metric}{' '}
          <span className="text-base font-normal text-ink-2 stretch-body">
            {caseMrb.result.note}
          </span>
        </p>
      )}
      {/* No card and no left accent bar: just the ink rule above (design system: Testimonial) */}
      {named && caseMrb.testimonial && (
        <figure className="mt-8 max-w-[65ch] border-t border-ink-1 pt-6">
          <blockquote className="text-[clamp(1.375rem,2.4vw,1.75rem)] leading-[1.3] font-semibold tracking-[-0.01em] text-pretty stretch-title">
            “{caseMrb.testimonial.quote}”
          </blockquote>
          <figcaption className="mt-4 label-mono leading-body text-ink-2">
            {caseMrb.testimonial.author}, {caseMrb.testimonial.role}
          </figcaption>
        </figure>
      )}
      {named && caseMrb.link && (
        <div className="mt-6">
          <ButtonLink variant="secondary" href={caseMrb.link.href} target="_blank" rel="noopener">
            {caseMrb.link.label}
          </ButtonLink>
        </div>
      )}
    </Section>
  )
}
