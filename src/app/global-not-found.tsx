import type { Metadata } from 'next'
import { en } from '@/content/en'
import { es } from '@/content/es'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { SectionIndex } from '@/components/ui/SectionHeading'
import { fontVariables } from '@/lib/fonts'
import './globals.css'

// Bilingual 404 for any unmatched URL (docs/14 ADR-013). It bypasses the [locale] layout, so it
// imports its own styles and font. The export writes it to out/404.html, which Cloudflare serves
// with status 404 (not_found_handling: "404-page"). Next adds the noindex meta automatically.
export const metadata: Metadata = {
  title: `${en.notFound.title} · ${es.notFound.title}`,
}

// English first: the page has one H1, the Spanish column carries an H2
const COLUMNS = [
  { lang: 'en', copy: en.notFound, Title: 'h1' },
  { lang: 'es', copy: es.notFound, Title: 'h2' },
] as const

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <main className="mx-auto grid min-h-dvh max-w-[56rem] content-start gap-12 px-4 py-24 sm:grid-cols-2 sm:px-6">
          {COLUMNS.map(({ lang, copy, Title }) => (
            <section key={lang} lang={lang}>
              {/* The spec-sheet callout of SectionHeading, with the status code as its index */}
              <SectionIndex index="404" className="mb-5" />
              <Title className="text-[2rem] leading-none font-extrabold stretch-heading">
                {copy.title}
              </Title>
              <p className="mt-4 text-ink-2">{copy.body}</p>
              <ButtonLink href={`/${lang}`} iconEnd="arrow" className="mt-6">
                {copy.backHome}
              </ButtonLink>
            </section>
          ))}
        </main>
      </body>
    </html>
  )
}
