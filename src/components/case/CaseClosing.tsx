import type { CaseContent, Locale } from '@/content/types'
import { CASE_SECTION } from '@/lib/routes'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { Container, Section } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'

// The closing (section 05, 04 on a demo): the cobalt band (once per page) with the booking CTA on sun yellow, tracked as
// book_call_click from "case". Then the "next" card, the agency-style "next project" link: the
// next featured case, or the services page after the last one (CasePage, ADR-024). The whole
// card is one link; on hover or focus the title takes the cobalt underline and the arrow moves
// 3 px (motion-safe, transform only).

export type NextLink = { href: string; label: string; title: string; body: string }

export function CaseClosing({
  lang,
  closing,
  next,
  index,
}: {
  lang: Locale
  closing: CaseContent['page']['closing']
  next: NextLink
  index: number
}) {
  return (
    <>
      <Section id={CASE_SECTION.closing} tone="accent">
        <SectionHeading id={CASE_SECTION.closing} index={index} tone="accent" size="xl">
          {closing.title}
        </SectionHeading>
        <p className="mt-6 max-w-[46ch] text-lead">{closing.body}</p>
        <div className="mt-10">
          <BookCallLink lang={lang} location="case" variant="sun" iconStart="calendar">
            {closing.cta}
          </BookCallLink>
        </div>
      </Section>
      <Container className="py-12 lg:py-16">
        <a
          href={next.href}
          className="group grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-6 gap-y-4 border-y border-ink-1 py-8 lg:py-12"
        >
          <span className="col-span-2 label-mono text-ink-2">{next.label}</span>
          <span className="min-w-0">
            <span className="block stretch-heading text-h2 underline decoration-transparent decoration-2 underline-offset-[6px] group-hover:decoration-accent-500 group-focus-visible:decoration-accent-500">
              {next.title}
            </span>
            <span className="mt-3 block max-w-[52ch] text-lead text-ink-2">{next.body}</span>
          </span>
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-full bg-accent-500 text-white group-hover:bg-accent-600 lg:size-16"
          >
            <Icon
              name="arrow"
              className="size-5 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:translate-x-[3px] motion-safe:group-focus-visible:translate-x-[3px] lg:size-6"
            />
          </span>
        </a>
      </Container>
    </>
  )
}
