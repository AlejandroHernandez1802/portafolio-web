import Image from 'next/image'
import type { SiteContent } from '@/content/types'
import { publicFileExists } from '@/lib/links'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 8: photo and three lines. Never name the current employer (docs/06 §2).
// The lines read as a spec sheet: an ink rule on top and hairlines between rows. Until the
// portrait exists they span the container, under the full-width rule of the heading.
export function About({ about }: { about: SiteContent['about'] }) {
  const { photo } = about
  const hasPhoto = publicFileExists(photo.src) // the portrait arrives in F0-11
  return (
    <Section id="sobre-mi">
      <SectionHeading id="sobre-mi" index={6}>
        {about.title}
      </SectionHeading>
      <div
        className={`mt-10 grid gap-8 ${hasPhoto ? 'md:grid-cols-[240px_minmax(0,1fr)] md:items-start md:gap-12' : ''}`}
      >
        {hasPhoto && (
          <Image
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            className="aspect-square w-full max-w-60 border border-ink-1 object-cover"
          />
        )}
        <div className="border-t border-ink-1">
          {about.lines.map((line) => (
            <p key={line} className="border-b border-paper-3 py-4.5 text-lead">
              {line}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}
