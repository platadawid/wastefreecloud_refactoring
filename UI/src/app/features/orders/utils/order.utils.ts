/**
 * Order Utility Functions
 * 
 * Shared utility functions for order/pickup management
 */

import { ORDER_DEFAULTS } from '../constants/order.constants';

/**
 * Format order ID to a readable order number
 * 
 * @param id - The order ID (UUID or similar)
 * @returns Formatted order number (e.g., "ABCD-1234" or "ABCD1234")
 * 
 * @example
 * formatOrderNumber('abc-123-def-456') // Returns: "ABC1-3456"
 * formatOrderNumber('short') // Returns: "SHORT"
 * formatOrderNumber('') // Returns: "N/A"
 */
export function formatOrderNumber(id: string): string {
  const cleaned = id?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  if (!cleaned) {
    return ORDER_DEFAULTS.ORDER_NUMBER_FALLBACK;
  }

  return cleaned.length <= 8 ? cleaned : `${cleaned.slice(0, 4)}-${cleaned.slice(-4)}`;
}

/**
 * Validate if a date is in the future
 * 
 * @param date - Date to validate
 * @returns True if date is in the future
 */
export function isFutureDate(date: Date | string | null): boolean {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
}

/**
 * Calculate days until a date
 * 
 * @param date - Target date
 * @returns Number of days until the date (negative if in the past)
 */
export function daysUntil(date: Date | string | null): number {
  if (!date) return 0;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = dateObj.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format cost with currency
 * 
 * @param cost - Cost value
 * @param currency - Currency symbol (default: 'PLN')
 * @returns Formatted cost string
 */
export function formatCost(cost: number, currency: string = 'PLN'): string {
  if (!Number.isFinite(cost)) return `0.00 ${currency}`;
  return `${cost.toFixed(2)} ${currency}`;
}

// Made with Bob
