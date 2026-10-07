import type { Metadata } from 'next'
import { site } from '@/content/site'
import { Container } from '@/components/ui/Container'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/sections/Header'
import { getContent } from '@/lib/i18n'

// Privacy policy per language (docs/09 §6.5). The effective date is site.legal.privacyVersion.

export async function generateMetadata(): Promise<Metadata> {
  const { lang, content } = await getContent()
  return {
    title: content.privacy.meta.title,
    description: content.privacy.meta.description,
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: { en: '/en/privacy', es: '/es/privacy' },
    },
  }
}

/** Fills {name}, {email}, {address} and {whatsapp} from site.ts. */
function fill(text: string): string {
  const values: Record<string, string> = {
    name: site.name,
    email: site.contact.email,
    address: site.legal.postalAddress,
    whatsapp: /^\d{10,15}$/.test(site.contact.whatsapp) ? `+${site.contact.whatsapp}` : '—',
  }
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}

export default async function Privacy() {
  const { lang, content } = await getContent()
  const { privacy } = content
  const effective = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-CO', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(site.legal.privacyVersion))

  return (
    <>
      <Header lang={lang} nav={content.nav} path="/privacy" />
      <main id="main" className="pt-24 pb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-[clamp(2rem,5vw,2.75rem)] leading-tight font-bold">
              {privacy.title}
            </h1>
            <p className="mt-3 text-sm text-muted">
              {privacy.effectiveLabel}:{' '}
              <time dateTime={site.legal.privacyVersion}>{effective}</time>
            </p>
            {privacy.sections.map((section) => (
              <section key={section.heading} className="mt-10">
                <h2 className="text-xl font-semibold">{section.heading}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed text-muted">
                    {fill(p)}
                  </p>
                ))}
              </section>
            ))}
            <a
              href={`/${lang}`}
              className="mt-12 inline-block font-semibold text-accent underline-offset-4 hover:underline"
            >
              {privacy.backHome}
            </a>
          </div>
        </Container>
      </main>
      <Footer
        lang={lang}
        footer={content.footer}
        switchLanguage={content.nav.switchLanguage}
        path="/privacy"
      />
    </>
  )
}
