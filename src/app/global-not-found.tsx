import type { Metadata } from 'next'
import { en } from '@/content/en'
import { es } from '@/content/es'
import { inter } from '@/lib/fonts'
import './globals.css'

// Bilingual 404 for any unmatched URL (docs/14 ADR-013). It bypasses the [locale] layout, so it
// imports its own styles and font. The export writes it to out/404.html, which Cloudflare serves
// with status 404 (not_found_handling: "404-page"). Next adds the noindex meta automatically.
export const metadata: Metadata = {
  title: `${en.notFound.title} · ${es.notFound.title}`,
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg font-sans text-fg antialiased">
        <main className="mx-auto grid max-w-3xl gap-12 px-4 py-24 sm:grid-cols-2">
          <section lang="en">
            <h1 className="text-3xl font-bold">{en.notFound.title}</h1>
            <p className="mt-4 text-muted">{en.notFound.body}</p>
            <a href="/en" className="mt-6 inline-block text-accent underline">
              {en.notFound.backHome}
            </a>
          </section>
          <section lang="es">
            <h2 className="text-3xl font-bold">{es.notFound.title}</h2>
            <p className="mt-4 text-muted">{es.notFound.body}</p>
            <a href="/es" className="mt-6 inline-block text-accent underline">
              {es.notFound.backHome}
            </a>
          </section>
        </main>
      </body>
    </html>
  )
}
