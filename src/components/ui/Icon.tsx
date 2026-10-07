// Minimal inline SVG icon set (docs/06 §3): decorative, aria-hidden, colored with currentColor.

const PATHS = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4.35-4.35',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z',
  cart: 'M3 4h2l2.4 11h10.2L20 7H6.2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  whatsapp:
    'M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Zm5-11.5c0 3.6 2.9 6.5 6.5 6.5l1-1.6-2-1-1 1a5 5 0 0 1-2.4-2.4l1-1-1-2L9 8.5Z',
  mail: 'M4 6h16v12H4V6Zm0 0 8 7 8-7',
  calendar: 'M5 5h14v15H5V5Zm0 5h14M9 3v4m6-4v4',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
} as const

export type IconName = keyof typeof PATHS

export function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
