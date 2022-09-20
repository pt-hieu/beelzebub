export function pluralize(amount: number, unit: string, suffix = 's') {
  if (amount < 2) return `${amount} ${unit}`
  return `${amount} ${unit}${suffix}`
}
