import type { Metadata } from 'next'
import { WorkPage, workMetadata } from '@/components/sections/WorkPage'

// Spanish work page: /es/trabajos. /en/trabajos is never generated (docs/14 ADR-025).
export const dynamicParams = false

// Next calls it once per parent locale and merges the result over the parent's params, so
// returning the locale pins the page to its language (the duplicate is dropped), as in the case
// routes (caseStaticParams)
export function generateStaticParams() {
  return [{ locale: 'es' }]
}

export function generateMetadata(): Metadata {
  return workMetadata('es')
}

export default function Page() {
  return <WorkPage lang="es" />
}
