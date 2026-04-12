export function fixDouble(value: number, n: number): number {
  const power = Math.pow(10, n)
  return Math.floor(value * power) / power
}


// export const fixDouble = (val: string | number, digit = 2) => {
//   return parseFloat(String(val) || "0").toFixed(digit) // string
// }


export const formatNumber = (val: any) => {
  const num = parseFloat(val)
  return isNaN(num)
    ? "0.00"
    : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}