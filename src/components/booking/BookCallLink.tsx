import type { ReactNode } from 'react'
import { site } from '@/content/site'
import type { Locale, TrackLocation } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { calHref } from '@/lib/links'
import { ButtonLink, type ButtonLinkProps } from '@/components/ui/ButtonLink'
import { CAL_NAMESPACE } from './cal'

// Every booking CTA (docs/07 §2.2): a real link to Cal.com that opens in a new tab without JS.
// CalLoader turns it into the popup once the embed has loaded. Looks are ButtonLink's, e.g.
// primary + arrow in the hero and pricing, sun + calendar on the cobalt closing band.
export function BookCallLink({
  lang,
  location,
  children,
  variant = 'primary',
  size = 'md',
  iconStart,
  iconEnd,
  className,
}: Pick<ButtonLinkProps, 'variant' | 'size' | 'iconStart' | 'iconEnd' | 'className'> & {
  lang: Locale
  location: TrackLocation
  children: ReactNode
}) {
  return (
    <ButtonLink
      href={calHref(lang)}
      target="_blank"
      rel="noopener"
      variant={variant}
      size={size}
      iconStart={iconStart}
      iconEnd={iconEnd}
      className={className}
      data-cal-link={site.contact.calLink[lang]}
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-config='{"layout":"month_view"}'
      {...trackAttrs('book_call_click', location)}
    >
      {children}
    </ButtonLink>
  )
}
