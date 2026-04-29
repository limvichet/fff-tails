import { numUnicode } from "~/utils/number"


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

export function formatYear(date: string) {
  return date ? new Date(date).getFullYear() : ""
}


export function formatDateForOutput(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")

  // return `${d}-${m}-${y}`
  return `${d}/${m}/${y}`
}

/* DATE FORMAT HELPER */
export function formatDate(date: string | null) {
  if (!date) return ""

  // Case 1: already yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }

  // Case 2: ISO or datetime (like 2026/03/25T03:04:59.000000Z)
  const parsed = new Date(date)
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0]
  }

  // Case 3: dd-MM-yyyy
  if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    const [d, m, y] = date.split("-")
    // return `${y}-${m}-${d}`
    return `${d}/${m}/${y}`
  }

  return ""
}

export function formatFullDate(dateInput: string) {
  if (!dateInput) return ""

  // accept "12/01/2026" or ISO "2026-01-12"
  let date: Date

  if (dateInput.includes("/")) {
    // format: dd/mm/yyyy
    const [d, m, y] = dateInput.split("/")
    date = new Date(`${y}-${m}-${d}`)
  } else {
    date = new Date(dateInput)
  }

  const day = numUnicode(date.getDate())
  const year = numUnicode(date.getFullYear())

  const monthsKh = [
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ"
  ]

  const month = monthsKh[date.getMonth()]

  return `ថ្ងៃទី${day} ខែ${month} ឆ្នាំ${year}`
}