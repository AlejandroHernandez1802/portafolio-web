import type { CaseContent } from '@/content/types'
import { getMedia, hasMedia, type KnownMediaKey } from '@/media'

// Media lookups shared by the case page sections (R-08). Server-only: they read the manifest.
// Companions follow the capture pipeline's names (scripts/shots.config.mjs): "x-desktop" has
// a phone twin "x-mobile", a print piece "x" its inside pages "x-spread", and every case has a
// "<case>/logo". A companion that wasn't captured is simply not shown.

function existing(key: string): KnownMediaKey | null {
  return hasMedia(key as KnownMediaKey) ? (key as KnownMediaKey) : null
}

/** The phone capture of the same page as a desktop one: mrb/home-desktop → mrb/home-mobile */
export function mobileTwin(key: KnownMediaKey): KnownMediaKey | null {
  return key.endsWith('-desktop') ? existing(key.replace(/-desktop$/, '-mobile')) : null
}

/** The inside spread of a print piece: mrb/brochure → mrb/brochure-spread */
export function spreadOf(key: KnownMediaKey): KnownMediaKey | null {
  return existing(`${key}-spread`)
}

/** The logo of the case a key belongs to: mrb/brochure → mrb/logo */
export function logoOf(key: KnownMediaKey): KnownMediaKey | null {
  return existing(`${key.split('/')[0]}/logo`)
}

/** A phone-shaped capture (taller than wide), e.g. for the "after" panel */
export function isPortrait(key: KnownMediaKey): boolean {
  const entry = getMedia(key)
  return entry !== undefined && entry.height > entry.width
}

/** The alt of a capture; a missing one fails the build instead of shipping an empty alt. */
export function altFor(alts: CaseContent['alts'], key: KnownMediaKey): string {
  const alt = (alts as Partial<Record<KnownMediaKey, string>>)[key]
  if (alt === undefined) throw new Error(`Missing alt text for ${key}`)
  return alt
}
