import type { CSSProperties, ReactNode } from 'react'
import './device-frame.css'

// Browser and phone frames drawn in CSS around real captures (R-05, ADR-021). Server
// Component, 0 KB JS. The screen has a fixed aspect ratio, so nothing shifts while the image
// loads. The chrome (bar, dots, URL pill, island) is presentational and aria-hidden: the
// image's alt carries the meaning. Device frames are the one floating object allowed
// --shadow-2 outside the hero stage (Design system/readme.md).

export type DeviceKind = 'browser' | 'phone'

/** Aspect ratios of the captures (scripts/shots.config.mjs): 1440 × 900 and 390 × 844 */
const ASPECT: Record<DeviceKind, string> = { browser: '1440 / 900', phone: '390 / 844' }

export type DeviceFrameProps = {
  variant: DeviceKind
  /** Browser only: the address shown in the mono pill, e.g. "malonebelt.com" (from content) */
  url?: string
  /** Screen aspect ratio as "w / h"; defaults to the capture size of the variant */
  aspect?: string
  /**
   * For a tall full-page capture: the screen shows its top, and on hover or keyboard focus
   * (of the frame, or of an ancestor marked data-device-hover) it slides to the bottom in
   * ~3 s. Transform only; off with prefers-reduced-motion.
   */
  scrollOnHover?: boolean
  /** Width and placement; the height follows from the aspect ratio */
  className?: string
  /** A ResponsiveImage (later a <video>): it fills the screen, anchored to the top */
  children: ReactNode
}

export function DeviceFrame({
  variant,
  url,
  aspect = ASPECT[variant],
  scrollOnHover = false,
  className,
  children,
}: DeviceFrameProps) {
  const classes = ['device', `device--${variant}`, scrollOnHover && 'device--scroll', className]
  return (
    <div
      className={classes.filter(Boolean).join(' ')}
      style={{ '--device-aspect': aspect } as CSSProperties}
    >
      {variant === 'browser' ? (
        <div className="device__bar" aria-hidden="true">
          <span className="device__dots">
            <span />
            <span />
            <span />
          </span>
          {url ? <span className="device__url">{url}</span> : <span />}
          <span className="device__spacer" />
        </div>
      ) : null}
      <div className="device__screen">
        {variant === 'phone' ? <span className="device__island" aria-hidden="true" /> : null}
        {scrollOnHover ? <div className="device__scroller">{children}</div> : children}
      </div>
    </div>
  )
}
