/** "01", "02"…: the zero-padded numbering of section indexes, plans, steps and questions. */
export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}
