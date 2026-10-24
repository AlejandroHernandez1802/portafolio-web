import type { Metadata } from 'next'
import { site } from '@/content/site'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/sections/Header'
import { pad2 } from '@/lib/format'
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
      <main id="main" className="pt-28 pb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-[clamp(2.25rem,5.5vw,3.5rem)] leading-heading font-extrabold tracking-heading stretch-heading">
              {privacy.title}
            </h1>
            <p className="mt-5 label-mono text-ink-2">
              {privacy.effectiveLabel}:{' '}
              <time dateTime={site.legal.privacyVersion}>{effective}</time>
            </p>
            {/* Numbered like a spec sheet: mono index column and an ink rule per section. The
                email address may break anywhere, so the narrow column never scrolls sideways */}
            {privacy.sections.map((section, i) => (
              <section
                key={section.heading}
                className="mt-10 grid grid-cols-[40px_minmax(0,1fr)] gap-4 border-t border-ink-1 pt-5"
              >
                <span aria-hidden="true" className="pt-[5px] label-mono text-ink-3">
                  {pad2(i + 1)}
                </span>
                <div>
                  <h2 className="text-h3">{section.heading}</h2>
                  {section.paragraphs.map((p) => (
                    <p key={p} className="mt-3 wrap-anywhere text-ink-2">
                      {fill(p)}
                    </p>
                  ))}
                </div>
              </section>
            ))}
            <div className="mt-12">
              <ButtonLink variant="secondary" href={`/${lang}`}>
                {privacy.backHome}
              </ButtonLink>
            </div>
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
