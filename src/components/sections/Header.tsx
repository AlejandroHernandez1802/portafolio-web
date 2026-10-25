import { site } from '@/content/site'
import type { Locale, NavGroup, SiteContent } from '@/content/types'
import { homePath, type Alternates } from '@/lib/routes'
import { Container } from '@/components/ui/Container'
import { Nav } from '@/components/layout/Nav'

// Fixed 56 px bar on every page (docs/14 ADR-020), always with a booking CTA. The only
// translucent surface of the design system: paper at 92 % over an 8 px blur, hairline below
// (--header-* tokens in globals.css). The brand is the name set in type (no logo yet): Archivo
// 800 at 87.5 % width, with no tagline beside it (ADR-025; it stays in the footer and the OG
// card). Below 330 px only the first name shows, so it is never cut mid-word.
const [firstName, ...surnames] = site.name.split(' ')

export function Header({
  lang,
  content,
  alternates,
  current,
}: {
  lang: Locale
  content: SiteContent // the nav texts, plus the cases and services its dropdowns list
  alternates: Alternates // the same page in each language, for the language link
  current?: NavGroup
}) {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 h-(--header-h) border-b border-paper-3 bg-(--header-bg) backdrop-blur-(--header-blur)">
      <Container className="flex h-full items-center justify-between gap-2 sm:gap-3">
        <a
          href={homePath(lang)}
          className="flex min-h-11 min-w-0 items-center text-ink-1 no-underline"
        >
          <span className="truncate text-base font-extrabold tracking-[-0.01em] stretch-title">
            {firstName}
            <span className="hidden min-[330px]:inline"> {surnames.join(' ')}</span>
          </span>
        </a>
        <Nav lang={lang} content={content} alternates={alternates} current={current} />
      </Container>
    </header>
  )
}
