import { site } from '@/content/site'
import type { Locale, SiteContent } from '@/content/types'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { Container } from '@/components/ui/Container'

// Fixed 48 px header that always carries the compact booking CTA (docs/05 §8). The only
// translucent surface of the design system: paper at 90 % over an 8 px blur, hairline below
// (--header-* tokens in globals.css).
// The brand is the name set in type (no logo yet): Archivo 800 at 87.5 % width.
export function Header({
  lang,
  nav,
  path = '',
}: {
  lang: Locale
  nav: SiteContent['nav']
  path?: string // e.g. '/privacy', so the language link keeps the page
}) {
  const other: Locale = lang === 'en' ? 'es' : 'en'
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-(--header-h) border-b border-paper-3 bg-(--header-bg) backdrop-blur-(--header-blur)">
      <Container className="flex h-full items-center justify-between gap-3">
        <a href={`/${lang}`} className="flex min-w-0 items-baseline gap-2 text-ink-1">
          <span className="truncate text-base font-extrabold tracking-[-0.01em] stretch-title">
            {site.name}
          </span>
          <span className="hidden truncate text-sm text-ink-2 sm:inline">· {nav.tagline}</span>
        </a>
        <nav className="flex shrink-0 items-center gap-3">
          <a
            href={`/${other}${path}`}
            lang={other}
            hrefLang={other}
            className="inline-flex min-h-9 items-center px-1 text-sm font-medium text-ink-1 underline decoration-transparent hover:decoration-accent-500"
          >
            {nav.switchLanguage}
          </a>
          <BookCallLink lang={lang} location="header" size="sm">
            {nav.bookCall}
          </BookCallLink>
        </nav>
      </Container>
    </header>
  )
}
