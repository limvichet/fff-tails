export function formatDateForInput(date: string | null): string {
  if (!date) return ""

  // already yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }

  // convert dd-MM-yyyy → yyyy-MM-dd
  const [d, m, y] = date.split("-")

  return `${y}-${m}-${d}`
}


export function formatDateForOutput(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")

  return `${d}-${m}-${y}`
}