import { hasMedia } from '@/media'
import type { Locale, SiteContent } from '@/content/types'
import { homePath, SECTION } from '@/lib/routes'
import { ResponsiveImage } from '@/components/media/ResponsiveImage'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Section } from '@/components/ui/Container'

// The hero of the About page (docs/14 ADR-024): "You work directly with me" as the H1, then a big
// first-person lead over a facts table that reads as a spec sheet (an ink rule on top,
// hairlines between rows, mono labels). Never name the current employer (docs/06 §2). With the
// portrait in the media manifest ('portrait/about', R-09) it takes a 4:5 column in an ink frame,
// offset on a sun block, and the text sits beside it; without it the lead and the table span
// the container (docs/06 §4: no placeholder). Process and pricing follow on the same page.

export const PORTRAIT = 'portrait/about' as const

export function About({
  lang,
  about,
  breadcrumb,
  crumb,
}: {
  lang: Locale
  about: SiteContent['about']
  breadcrumb: SiteContent['aboutPage']['breadcrumb']
  crumb: string // this page in the trail: the "About" label of the bar
}) {
  const portrait = hasMedia(PORTRAIT)
  return (
    <Section
      id={SECTION.hero}
      backdrop="grid"
      className="pt-[calc(var(--header-h)+2rem)] lg:pt-[calc(var(--header-h)+3rem)]"
    >
      <Breadcrumb
        label={breadcrumb.label}
        trail={[{ href: homePath(lang), label: breadcrumb.home }]}
        current={crumb}
      />
      <h1
        id={`${SECTION.hero}-title`}
        className="mt-3 max-w-[18ch] stretch-display text-[length:clamp(2.5rem,6.4vw,6rem)] leading-display font-extrabold tracking-display"
      >
        {about.title}
      </h1>
      <div
        className={`mt-10 lg:mt-14 ${portrait ? 'grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-start lg:gap-16' : ''}`}
      >
        {portrait && (
          <div className="relative isolate mr-3 mb-3 max-w-sm before:absolute before:inset-0 before:-z-10 before:translate-3 before:bg-sun-400">
            <ResponsiveImage
              image={PORTRAIT}
              alt={about.photo.alt}
              sizes="(min-width: 1024px) 400px, (min-width: 768px) 38vw, 384px"
              loading="eager"
              className="block border border-ink-1 bg-paper-0"
              imgClassName="block aspect-4/5 w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0">
          <p
            className={`leading-[1.3] font-medium tracking-[-0.005em] stretch-title ${portrait ? 'max-w-[38ch] text-[clamp(1.25rem,2vw,1.625rem)]' : 'max-w-[42ch] text-[clamp(1.375rem,2.6vw,2.125rem)]'}`}
          >
            {about.lead}
          </p>
          <dl className="mt-10 border-t border-ink-1">
            {about.facts.map((fact) => (
              <div
                key={fact.label}
                className="grid gap-1.5 border-b border-paper-3 py-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-baseline sm:gap-8 sm:py-5"
              >
                <dt className="label-mono leading-[1.5] text-ink-2">{fact.label}</dt>
                <dd className="text-[1.0625rem] leading-[1.45] font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  )
}
