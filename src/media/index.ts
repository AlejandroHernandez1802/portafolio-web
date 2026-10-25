import { media, type KnownMediaKey, type MediaKey } from './manifest.generated'
import type { MediaEntry } from './types'

// Media lookup for Server Components. Optional sources (the portrait, R-09) are absent from
// the manifest until their file exists, so content may name any KnownMediaKey and components
// skip what isn't there (docs/06 §4: missing files never show a placeholder).

export type { KnownMediaKey, MediaKey } from './manifest.generated'
export type { MediaEntry, MediaSource } from './types'

export function hasMedia(key: KnownMediaKey): key is MediaKey {
  return Object.hasOwn(media, key)
}

export function getMedia(key: KnownMediaKey): MediaEntry | undefined {
  return hasMedia(key) ? media[key] : undefined
}
