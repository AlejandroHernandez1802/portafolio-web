import type { CaseFigureId, CaseStudy, Locale, Metric } from '@/content/types'

// Fills case figures into copy at build time. The numbers live once in content/cases.ts and the
// texts reference them as {products}, {languages}… A text whose figure is still null (the quote
// count, the phase 1 weeks) resolves to null, and the caller skips that cell, line or row.

const NUMBER_LOCALE: Record<Locale, string> = { en: 'en-US', es: 'es-CO' }

export function formatFigure(value: number, lang: Locale): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[lang]).format(value)
}

/** "August 2026" / "agosto de 2026", for {launched}. */
export function formatMonth(iso: string, lang: Locale): string {
  return new Intl.DateTimeFormat(NUMBER_LOCALE[lang], {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

/** A figure as display text, or null while it has no verified value. */
export function figureText(study: CaseStudy, id: CaseFigureId, lang: Locale): string | null {
  const value = study.figures[id]
  return value === null ? null : formatFigure(value, lang)
}

/** Replaces {figure} and {launched}; null when any figure in the text is still null. */
export function fillCase(text: string, study: CaseStudy, lang: Locale): string | null {
  let missing = false
  const filled = text.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (key === 'launched') return formatMonth(study.launched, lang)
    if (!(key in study.figures)) return match
    const value = figureText(study, key as CaseFigureId, lang)
    if (value === null) missing = true
    return value ?? match
  })
  return missing ? null : filled
}

export type ResolvedMetric = { id: CaseFigureId; value: string; label: string }

/** Metrics with a value, in order; the label may use placeholders too. */
export function resolveMetrics(
  metrics: Metric[],
  study: CaseStudy,
  lang: Locale,
  limit = Infinity,
): ResolvedMetric[] {
  const resolved: ResolvedMetric[] = []
  for (const { figure, label } of metrics) {
    const value = figureText(study, figure, lang)
    const text = fillCase(label, study, lang)
    if (value !== null && text !== null) resolved.push({ id: figure, value, label: text })
  }
  return resolved.slice(0, limit)
}
