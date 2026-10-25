import type { Metadata } from 'next'
import { CasePage, caseMetadata, caseStaticParams } from '@/components/case/CasePage'

// English case pages: /en/work/{slug}. /es/work/* is never generated (docs/14 ADR-020).
export const dynamicParams = false

export function generateStaticParams() {
  return caseStaticParams('en')
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/work/[slug]'>): Promise<Metadata> {
  return caseMetadata('en', (await params).slug)
}

export default async function Page({ params }: PageProps<'/[locale]/work/[slug]'>) {
  return <CasePage lang="en" slug={(await params).slug} />
}
