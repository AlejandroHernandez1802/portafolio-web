// The trail over the H1 of the section pages (docs/14 ADR-024), as on the case pages (CaseHero):
// mono, the links padded to a 44 px target without moving the trail, the current page last.
export function Breadcrumb({
  label,
  trail,
  current,
}: {
  label: string // landmark name of the <nav>
  trail: Array<{ href: string; label: string }>
  current: string
}) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-2.5 label-mono text-ink-2">
        {trail.map((step) => (
          <li key={step.href} className="contents">
            <span>
              <a
                href={step.href}
                className="-mx-2 inline-flex min-h-11 items-center px-2 underline"
              >
                {step.label}
              </a>
            </span>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="text-ink-1">
          {current}
        </li>
      </ol>
    </nav>
  )
}
