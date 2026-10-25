// Shape of one encoded image in manifest.generated.ts (scripts/build-images.mjs, docs/06 §4)

export type MediaSource = {
  /** Hashed URL under /_next/static/media/ */
  src: string
  /** Pixel width, the `w` descriptor of srcset */
  width: number
}

export type MediaEntry = {
  /** Intrinsic size of the largest variant: the aspect ratio for width/height (no CLS) */
  width: number
  height: number
  /** Ascending widths; empty for an SVG */
  avif: MediaSource[]
  webp: MediaSource[]
  /** Set for vector files (the MRB logo), served as is */
  svg?: string
}
