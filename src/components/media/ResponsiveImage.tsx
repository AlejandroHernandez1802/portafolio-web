import { preload } from 'react-dom'
import { getMedia, type KnownMediaKey, type MediaSource } from '@/media'

// A <picture> for one manifest entry (R-05, docs/06 §4): AVIF, then WebP, then an <img> with
// the WebP at a middle width. width/height come from the manifest, so the box is reserved
// before the file arrives (no CLS). Server Component: no JS ships. A key that isn't in the
// manifest (an optional source like the portrait) renders nothing.

/** 1 × 1 transparent GIF: a <source> that "wins" below a breakpoint without a download */
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

export type ResponsiveImageProps = {
  image: KnownMediaKey
  /** From src/content; "" for a decorative image */
  alt: string
  /** The CSS width at each breakpoint, e.g. "(min-width: 1024px) 640px, 100vw" */
  sizes: string
  /** Default lazy. The desktop hero frame and the case page hero use eager + fetchPriority high */
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  /**
   * Viewport width in px below which the image is never downloaded (a blank source matches
   * first), e.g. 1024 for the desktop hero frame, so phones keep text as their LCP (ADR-021).
   * The caller still hides the element below that width.
   */
  hideBelow?: number
  /**
   * Art direction: another manifest entry shown where `media` matches, with the same `sizes`
   * and its own width/height, e.g. the top square of a tall capture on touch screens.
   */
  art?: { media: string; image: KnownMediaKey }
  /** On <picture> */
  className?: string
  /** On <img> */
  imgClassName?: string
}

const srcSet = (list: MediaSource[]) => list.map((s) => `${s.src} ${s.width}w`).join(', ')
const hiddenQuery = (px: number) => `(max-width: ${px - 0.02}px)`

export function ResponsiveImage({
  image,
  alt,
  sizes,
  loading = 'lazy',
  fetchPriority,
  hideBelow,
  art,
  className,
  imgClassName,
}: ResponsiveImageProps) {
  const entry = getMedia(image)
  if (!entry) return null
  const artEntry = art ? getMedia(art.image) : undefined
  const common = {
    width: entry.width,
    height: entry.height,
    loading,
    fetchPriority,
    decoding: 'async' as const,
    className: imgClassName,
  }
  if (entry.svg) {
    // eslint-disable-next-line @next/next/no-img-element -- static export without the optimizer: next/image adds nothing to a pre-encoded file (docs/06 §4)
    return <img src={entry.svg} alt={alt} {...common} />
  }
  const fallback = entry.webp[Math.floor((entry.webp.length - 1) / 2)]
  return (
    <picture className={className}>
      {hideBelow ? <source media={hiddenQuery(hideBelow)} srcSet={BLANK} /> : null}
      {art && artEntry && !artEntry.svg
        ? (['avif', 'webp'] as const).map((type) => (
            <source
              key={type}
              media={art.media}
              type={`image/${type}`}
              srcSet={srcSet(artEntry[type])}
              sizes={sizes}
              width={artEntry.width}
              height={artEntry.height}
            />
          ))
        : null}
      <source type="image/avif" srcSet={srcSet(entry.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(entry.webp)} sizes={sizes} />
      <img src={fallback.src} alt={alt} {...common} />
    </picture>
  )
}

/**
 * Preloads the AVIF srcset of an above-the-fold image (React hoists the <link> into <head>).
 * Pass the same `sizes` as the ResponsiveImage, and `media` to match where it shows, e.g.
 * "(min-width: 1024px)" for the desktop hero, so phones never fetch it.
 */
export function preloadImage(
  image: KnownMediaKey,
  { sizes, media }: { sizes: string; media?: string },
) {
  const entry = getMedia(image)
  if (!entry || entry.svg) return
  preload(entry.avif.at(-1)!.src, {
    as: 'image',
    type: 'image/avif',
    imageSrcSet: srcSet(entry.avif),
    imageSizes: sizes,
    fetchPriority: 'high',
    media,
  })
}
