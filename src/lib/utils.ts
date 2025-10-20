import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with intelligent decimal precision
 * - Values >= 1: max 2 decimals
 * - Values < 1 but >= 0.01: max 4 decimals
 * - Values < 0.01: max 8 decimals (for small crypto amounts)
 */
export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) return '0'

  // For very small numbers (crypto micro-units)
  if (Math.abs(num) < 0.01 && num !== 0) {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })
  }

  // For small numbers but not tiny
  if (Math.abs(num) < 1 && num !== 0) {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })
  }

  // For regular numbers
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Format quantity with intelligent decimal precision
 * Shows only necessary decimals, removing trailing zeros
 */
export function formatQuantity(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) return '0'

  // For very small quantities
  if (Math.abs(num) < 0.01 && num !== 0) {
    // Remove trailing zeros
    return num
      .toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 8,
      })
      .replace(/\.?0+$/, '')
  }

  // For small quantities
  if (Math.abs(num) < 1 && num !== 0) {
    return num
      .toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      })
      .replace(/\.?0+$/, '')
  }

  // For regular quantities
  return num
    .toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
    .replace(/\.?0+$/, '')
}

/**
 * Format percentage values safely
 * Handles edge cases like very small percentages and NaN
 */
export function formatPercentage(
  value: number | string | null | undefined
): string {
  if (value === null || value === undefined) return '0.0'

  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num) || !isFinite(num)) return '0.0'

  // For very small percentages (less than 0.1%)
  if (Math.abs(num) < 0.1 && num !== 0) {
    return num.toFixed(2)
  }

  // For regular percentages
  return num.toFixed(1)
}
