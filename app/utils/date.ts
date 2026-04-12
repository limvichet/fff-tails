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

  // return `${d}-${m}-${y}`
  return `${d}/${m}/${y}`
}

/* for view or show*/
// export function formatDate(date: string | null) {
//   if (!date) return ""

//   // already correct
//   if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
//     return date
//   }

//   // convert dd-MM-yyyy → yyyy-MM-dd
//   const [d, m, y] = date.split("-")

//   return `${d}/${m}/${y}`
// }

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