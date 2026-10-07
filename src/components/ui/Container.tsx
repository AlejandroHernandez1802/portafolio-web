import type { ReactNode } from 'react'

// 72 rem max width with a 16 px gutter on mobile (docs/06 §3).
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mx-auto w-full max-w-[72rem] px-4 sm:px-6 ${className}`}>{children}</div>
}

/** A page section with the vertical rhythm of docs/06 §3 (py-16 → py-24). */
export function Section({
  id,
  children,
  className = '',
  ...rest
}: {
  id: string
  children: ReactNode
  className?: string
  [data: `data-${string}`]: string | undefined
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`py-16 lg:py-24 ${className}`}
      {...rest}
    >
      <Container>{children}</Container>
    </section>
  )
}
