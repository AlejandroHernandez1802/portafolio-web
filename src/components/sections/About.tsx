import Image from 'next/image'
import type { SiteContent } from '@/content/types'
import { publicFileExists } from '@/lib/links'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 8: photo and three lines. Never name the current employer (docs/06 §2).
export function About({ about }: { about: SiteContent['about'] }) {
  const { photo } = about
  const hasPhoto = publicFileExists(photo.src) // the portrait arrives in F0-11
  return (
    <Section id="sobre-mi">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
        {hasPhoto && (
          <Image
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            className="size-40 shrink-0 rounded-2xl object-cover"
          />
        )}
        <div>
          <SectionHeading id="sobre-mi">{about.title}</SectionHeading>
          <div className="mt-4 max-w-prose space-y-2 text-lg leading-relaxed text-muted">
            {about.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
