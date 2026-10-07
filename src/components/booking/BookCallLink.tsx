import type { ReactNode } from 'react'
import { site } from '@/content/site'
import type { Locale, TrackLocation } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { calHref } from '@/lib/links'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { CAL_NAMESPACE } from './cal'

// Every booking CTA (docs/07 §2.2): a real link to Cal.com that opens in a new tab without JS.
// CalLoader turns it into the popup once the embed has loaded.
export function BookCallLink({
  lang,
  location,
  children,
  variant = 'primary',
  size = 'md',
  className,
}: {
  lang: Locale
  location: TrackLocation
  children: ReactNode
  variant?: 'primary' | 'outline' | 'light'
  size?: 'md' | 'sm'
  className?: string
}) {
  return (
    <ButtonLink
      href={calHref(lang)}
      target="_blank"
      rel="noopener"
      variant={variant}
      size={size}
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
