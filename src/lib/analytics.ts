import type { TrackLocation } from '@/content/types'

// Event names and the tracking attributes every CTA carries (docs/12 §3). A typo in a
// data-track value fails to compile because components build them with trackAttrs().

export type EventName =
  | 'landing'
  | 'book_call_click'
  | 'booking_completed'
  | 'whatsapp_click'
  | 'email_click'
  | 'case_mrb_view'
  | 'currency_switch'
  | 'demo_open'

type ClickEvent = Extract<
  EventName,
  'book_call_click' | 'whatsapp_click' | 'email_click' | 'demo_open'
>

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void }
  }
}

/** Sends an event to Umami. If a blocker removed the script, nothing happens. */
export function track(event: EventName, data?: Record<string, string>) {
  window.umami?.track(event, data)
}

/** data-* attributes read by TrackingListener on click. */
export function trackAttrs(event: ClickEvent, location: TrackLocation) {
  return { 'data-track': event, 'data-track-location': location }
}
