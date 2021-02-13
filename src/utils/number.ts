/**
 * This is essentially .toFixed(digits)
 * but returns the actual number value, not a string
 */
export function mathRoundDigits(value: number, digits: number): number {
  const power = 10 ** digits // Math.pow
  // 1. Make the fractions into full number by multiplying it.
  // 2. Remove the rest of fraction with Math.floor
  // 3. Divide it with the same power multiplier to make it have the n digits
  return Math.round((value + Number.EPSILON) * power) / power
}
