import type { Metadata } from 'next'
import { WorkPage, workMetadata } from '@/components/sections/WorkPage'

// English work page: /en/work. /es/work is never generated (docs/14 ADR-025).
export const dynamicParams = false

// Next calls it once per parent locale and merges the result over the parent's params, so
// returning the locale pins the page to its language (the duplicate is dropped), as in the case
// routes (caseStaticParams)
export function generateStaticParams() {
  return [{ locale: 'en' }]
}

export function generateMetadata(): Metadata {
  return workMetadata('en')
}

export default function Page() {
  return <WorkPage lang="en" />
}
