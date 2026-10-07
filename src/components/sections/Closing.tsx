import { site } from '@/content/site'
import type { Locale, SiteContent } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { mailtoHref, whatsappHref } from '@/lib/links'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 9. Booking first; in Colombia WhatsApp moves ahead of email (docs/06 §5) through
// data-market-order, handled in globals.css next to the other market rules.
export function Closing({ lang, closing }: { lang: Locale; closing: SiteContent['closing'] }) {
  const whatsapp = whatsappHref(closing.whatsapp.prefilledMessage) // null until F0-13
  return (
    <Section id="contacto" className="bg-fg text-bg">
      <SectionHeading id="contacto">{closing.title}</SectionHeading>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-bg/80">{closing.body}</p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <BookCallLink lang={lang} location="closing" variant="light">
          <Icon name="calendar" />
          {closing.bookCall}
        </BookCallLink>
        <ButtonLink
          variant="outlineLight"
          href={mailtoHref(closing.email.subject)}
          className="order-2"
          {...trackAttrs('email_click', 'closing')}
        >
          <Icon name="mail" />
          {site.contact.email}
        </ButtonLink>
        {whatsapp && (
          <ButtonLink
            variant="outlineLight"
            href={whatsapp}
            target="_blank"
            rel="noopener"
            data-market-order="first"
            className="order-3"
            {...trackAttrs('whatsapp_click', 'closing')}
          >
            <Icon name="whatsapp" />
            {closing.whatsapp.label}
          </ButtonLink>
        )}
      </div>
    </Section>
  )
}
