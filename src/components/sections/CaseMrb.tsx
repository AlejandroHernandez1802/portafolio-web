import Image from 'next/image'
import { site } from '@/content/site'
import type { ImageRef, SiteContent } from '@/content/types'
import { publicFileExists } from '@/lib/links'
import { Icon } from '@/components/ui/Icon'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 3: the MRB case in `named` or `anonymized` mode (docs/04 §6). The metric,
// testimonial and link appear only when they exist and the mode allows them.

function Shots({ images }: { images: ImageRef[] }) {
  const ready = images.filter((img) => publicFileExists(img.src))
  if (ready.length === 0) return null
  return (
    <div className="mt-4 grid gap-3">
      {ready.map((img) => (
        <Image
          key={img.src}
          src={img.src}
          width={img.width}
          height={img.height}
          alt={img.alt}
          className="h-auto w-full rounded-xl border border-surface"
        />
      ))}
    </div>
  )
}

export function CaseMrb({ caseMrb }: { caseMrb: SiteContent['caseMrb'] }) {
  const mode = site.caseMrb.disclosure
  const named = mode === 'named'
  return (
    <Section id="caso" data-track-view="case_mrb_view">
      <SectionHeading id="caso">{caseMrb.title[mode]}</SectionHeading>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted">{caseMrb.summary[mode]}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[caseMrb.before, caseMrb.after].map((side, i) => (
          <div
            key={side.label}
            className={`rounded-2xl p-6 ${i === 0 ? 'bg-surface' : 'border-2 border-accent/30'}`}
          >
            <h3 className="text-sm font-semibold tracking-wide text-muted uppercase">
              {side.label}
            </h3>
            <ul className="mt-4 space-y-3">
              {side.points.map((point) => (
                <li key={point} className="flex gap-3 leading-relaxed">
                  <span className={`mt-1 shrink-0 ${i === 0 ? 'text-muted' : 'text-success'}`}>
                    <Icon name={i === 0 ? 'arrow' : 'check'} className="size-4" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Shots images={side.images[mode]} />
          </div>
        ))}
      </div>

      <h3 className="mt-10 font-semibold">{caseMrb.builtLabel}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {caseMrb.built.map((item) => (
          <li key={item} className="rounded-full bg-surface px-4 py-1.5 text-sm">
            {item}
          </li>
        ))}
      </ul>

      {named && caseMrb.result && (
        <p className="mt-10 text-2xl font-bold">
          {caseMrb.result.metric}{' '}
          <span className="text-base font-normal text-muted">{caseMrb.result.note}</span>
        </p>
      )}
      {named && caseMrb.testimonial && (
        <figure className="mt-8 max-w-prose border-l-4 border-accent pl-5">
          <blockquote className="text-lg leading-relaxed">“{caseMrb.testimonial.quote}”</blockquote>
          <figcaption className="mt-2 text-sm text-muted">
            {caseMrb.testimonial.author}, {caseMrb.testimonial.role}
          </figcaption>
        </figure>
      )}
      {named && caseMrb.link && (
        <ButtonLink
          variant="secondary"
          href={caseMrb.link.href}
          target="_blank"
          rel="noopener"
          className="mt-6"
        >
          {caseMrb.link.label}
        </ButtonLink>
      )}
    </Section>
  )
}
