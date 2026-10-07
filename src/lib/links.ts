import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { site } from '@/content/site'
import type { Locale } from '@/content/types'

// Build-time helpers for external links and optional assets. Server-only (uses node:fs).

/** wa.me link, or null while the number is still a placeholder (docs/07 §3). */
export function whatsappHref(message: string): string | null {
  const number = site.contact.whatsapp
  if (!/^\d{10,15}$/.test(number)) return null
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function mailtoHref(subject: string): string {
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}`
}

export function calHref(lang: Locale): string {
  return `https://cal.com/${site.contact.calLink[lang]}`
}

/** True when a file exists in public/, so missing images (F0-11) are skipped, not broken. */
export function publicFileExists(src: string): boolean {
  return existsSync(join(process.cwd(), 'public', src))
}
