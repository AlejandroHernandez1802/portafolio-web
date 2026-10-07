import { site } from '@/content/site'
import type { Locale, SiteContent } from '@/content/types'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { Container } from '@/components/ui/Container'

// Fixed 48 px header that always carries the compact booking CTA (docs/05 §8).
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
    <header className="fixed inset-x-0 top-0 z-50 h-12 border-b border-surface bg-bg/95 backdrop-blur">
      <Container className="flex h-full items-center justify-between gap-3">
        <a href={`/${lang}`} className="flex min-w-0 items-baseline gap-2 font-semibold">
          <span className="truncate">{site.name}</span>
          <span className="hidden truncate text-sm font-normal text-muted sm:inline">
            · {nav.tagline}
          </span>
        </a>
        <nav className="flex shrink-0 items-center gap-3">
          <a
            href={`/${other}${path}`}
            lang={other}
            hrefLang={other}
            className="inline-flex min-h-9 items-center px-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
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
