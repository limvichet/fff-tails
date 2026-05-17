export function fixDouble(value: number, n: number): number {
  const power = Math.pow(10, n)
  return Math.floor(value * power) / power
}



export const formatNumber = (val: any) => {
  const num = parseFloat(val)
  return isNaN(num)
    ? "0.00"
    : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}


export const FixNumber = (val: any) => {
  const num = parseFloat(val)
  return isNaN(num)
    ? "0.00"
    : num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/,/g, '')
}

/* convert num to num unicode */
export const numUnicode = (value: string | number): string => {
  if (value === null || value === undefined) return ""

  const map: Record<string, string> = {
    "0": "០",
    "1": "១",
    "2": "២",
    "3": "៣",
    "4": "៤",
    "5": "៥",
    "6": "៦",
    "7": "៧",
    "8": "៨",
    "9": "៩"
  }

  return value
    .toString()
    .split("")
    .map(char => map[char] ?? char) // keep , . etc
    .join("")
}


/* convert num to khmer month */
export const khMonth = (month: number | string): string => {
  const months = [
    "",        // index 0 (not used)
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

  const m = Number(month)

  if (!m || m < 1 || m > 12) return ""

  return months[m] ?? ""
}


export const onInputNumber = <T extends Record<string, any>, K extends keyof T>(
  event: Event,
  field: K,
  form: T
) => {
  const target = event.target as HTMLInputElement
  if (!target) return

  // Allow digits and dot
  let cleanValue = target.value.replace(/[^0-9.]/g, '')

  // Keep only the first dot
  const firstDotIndex = cleanValue.indexOf('.')
  if (firstDotIndex !== -1) {
    cleanValue =
      cleanValue.slice(0, firstDotIndex + 1) +
      cleanValue.slice(firstDotIndex + 1).replace(/\./g, '')
  }

  // Split integer and decimal
  const [integerPart, decimalPartRaw] = cleanValue.split('.')
  const integer = integerPart || ''
  let decimal = decimalPartRaw ?? ''

  // Limit decimal to 2 digits
  decimal = decimal.slice(0, 2)

  // Build final string (keep dot if user typed it)
  cleanValue = decimalPartRaw !== undefined ? `${integer}.${decimal}` : integer

  // Convert to number (but don’t kill the dot-only case)
  const numericValue =
    cleanValue === '' || cleanValue === '.' ? 0 : parseFloat(cleanValue)

  // Update form
  form[field] = numericValue as unknown as T[K]

  // Re-render formatted value (preserve dot if user typed it)
  target.value =
    Number(integer || 0).toLocaleString() +
    (decimalPartRaw !== undefined ? `.${decimal}` : '')
}
