import type { AnchorHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'

// A real <a> rendered on the server (docs/06 §3): works without JS and accepts data-track*
// and data-cal-* attributes. Touch target ≥ 44 × 44 px (sm: 36 px, header only). States follow
// the design system: hover darkens or fills, press drops 1 px with an inset shadow, the
// trailing arrow shifts 3 px; transitions only run without prefers-reduced-motion.

type ButtonVariant = keyof typeof VARIANTS
type ButtonSize = 'md' | 'sm'

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  iconStart?: IconName
  /** `secondary` ends with an arrow by default; pass null to remove it */
  iconEnd?: IconName | null
  [data: `data-${string}`]: string | undefined
}

const PRESS = 'active:translate-y-px active:shadow-press'

const VARIANTS = {
  // Cobalt with white text (8.2:1): the action color
  primary: `bg-accent-500 text-white hover:bg-accent-600 ${PRESS}`,
  // Text link with a 2 px cobalt underline and an arrow (styles on the label below)
  secondary: '',
  // Cobalt outline; white on the cobalt closing band
  outline:
    'text-accent-700 inset-ring-[1.5px] inset-ring-accent-500 hover:bg-accent-100 active:translate-y-px on-accent:text-white on-accent:inset-ring-white/60 on-accent:hover:bg-white/12',
  // Sun yellow with ink text (12:1): the main CTA on the cobalt band
  sun: `bg-sun-400 text-ink-1 hover:bg-sun-300 ${PRESS}`,
  ink: `bg-deep text-on-ink-1 hover:bg-ink-4 ${PRESS}`,
  // For deep-navy bands
  light: `bg-paper-1 text-ink-1 hover:bg-paper-0 ${PRESS}`,
  outlineLight:
    'text-on-ink-1 inset-ring-[1.5px] inset-ring-on-ink-1/50 hover:bg-on-ink-1/10 active:translate-y-px',
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  iconStart,
  iconEnd,
  className = '',
  children,
  ...rest
}: ButtonLinkProps) {
  const text = variant === 'secondary'
  const end = iconEnd === undefined ? (text ? 'arrow' : null) : iconEnd
  const icon = text || size === 'sm' ? 'size-4 shrink-0' : 'size-5 shrink-0'
  const box = text
    ? 'min-h-11 gap-1.5'
    : size === 'sm'
      ? 'min-h-9 gap-1.5 rounded-sm px-3 text-sm'
      : 'min-h-12 gap-2.5 rounded-sm px-[22px] py-3 text-center'
  return (
    <a
      className={`group inline-flex max-w-full items-center justify-center leading-[1.2] font-semibold no-underline [-webkit-tap-highlight-color:transparent] motion-safe:transition-[background-color,box-shadow,translate] motion-safe:duration-120 motion-safe:ease-out ${box} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {iconStart && <Icon name={iconStart} className={icon} />}
      {/* Balanced: a label that wraps on a 320 px phone splits evenly, no orphan word. An
          unbreakable one (the email address at 280 px) may break anywhere instead of overflowing */}
      <span
        className={
          text
            ? 'text-balance wrap-anywhere underline decoration-accent-500 decoration-2 underline-offset-[5px] group-hover:decoration-current on-accent:decoration-white/60'
            : 'text-balance wrap-anywhere'
        }
      >
        {children}
      </span>
      {end && (
        <Icon
          name={end}
          className={`${icon} motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:translate-x-[3px]`}
        />
      )}
    </a>
  )
}
