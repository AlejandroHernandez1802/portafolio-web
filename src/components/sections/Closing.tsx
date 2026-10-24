import { site } from '@/content/site'
import type { Locale, SiteContent } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { mailtoHref, whatsappHref } from '@/lib/links'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 9: the cobalt band, once per page. Booking first, on sun yellow; email and WhatsApp
// are outline buttons, which turn white on this band. In Colombia WhatsApp moves ahead of email
// (docs/06 §5) through data-market-order, handled in globals.css next to the other market rules.
export function Closing({ lang, closing }: { lang: Locale; closing: SiteContent['closing'] }) {
  const whatsapp = whatsappHref(closing.whatsapp.prefilledMessage) // null until F0-13
  return (
    <Section id="contacto" tone="accent">
      <SectionHeading id="contacto" index={7} tone="accent" size="xl">
        {closing.title}
      </SectionHeading>
      <p className="mt-6 max-w-[46ch] text-lead">{closing.body}</p>
      <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
        <BookCallLink lang={lang} location="closing" variant="sun" iconStart="calendar">
          {closing.bookCall}
        </BookCallLink>
        <ButtonLink
          variant="outline"
          iconStart="mail"
          href={mailtoHref(closing.email.subject)}
          className="order-2"
          {...trackAttrs('email_click', 'closing')}
        >
          {site.contact.email}
        </ButtonLink>
        {whatsapp && (
          <ButtonLink
            variant="outline"
            iconStart="whatsapp"
            href={whatsapp}
            target="_blank"
            rel="noopener"
            data-market-order="first"
            className="order-3"
            {...trackAttrs('whatsapp_click', 'closing')}
          >
            {closing.whatsapp.label}
          </ButtonLink>
        )}
      </div>
    </Section>
  )
}
