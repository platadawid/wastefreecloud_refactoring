/**
 * Order Constants
 * 
 * Centralized constants for order/pickup management
 * Includes status mappings, translations, and configuration
 */

import { GarbageOrderStatus } from '@app/shared/models/garbage-orders';
import { PickupOptionKey } from '@app/shared/models/profile';

// ============================================================================
// Status Mappings
// ============================================================================

export type PickupStatusKey =
  | 'waitingForPayment'
  | 'waitingForAccept'
  | 'waitingForPickup'
  | 'waitingForUtilizationFee'
  | 'completed'
  | 'complained'
  | 'resolved'
  | 'cancelled';

export const STATUS_VALUE_TO_KEY: Record<number, PickupStatusKey> = {
  0: 'waitingForPayment',
  1: 'waitingForAccept',
  2: 'waitingForPickup',
  3: 'waitingForUtilizationFee',
  4: 'completed',
  5: 'complained',
  6: 'resolved',
  7: 'cancelled'
} as const;

export const STATUS_KEY_TO_VALUE: Record<PickupStatusKey, number> = {
  waitingForPayment: 0,
  waitingForAccept: 1,
  waitingForPickup: 2,
  waitingForUtilizationFee: 3,
  completed: 4,
  complained: 5,
  resolved: 6,
  cancelled: 7
} as const;

export const STATUS_ORDER: PickupStatusKey[] = [
  'waitingForPayment',
  'waitingForAccept',
  'waitingForPickup',
  'waitingForUtilizationFee',
  'completed',
  'complained',
  'resolved',
  'cancelled'
] as const;

// ============================================================================
// Translation Keys
// ============================================================================

export const STATUS_TRANSLATION_KEY: Record<PickupStatusKey, string> = {
  waitingForPayment: 'myPickups.status.waitingForPayment',
  waitingForAccept: 'myPickups.status.waitingForAccept',
  waitingForPickup: 'myPickups.status.waitingForPickup',
  waitingForUtilizationFee: 'myPickups.status.waitingForUtilizationFee',
  completed: 'myPickups.status.completed',
  complained: 'myPickups.status.complained',
  resolved: 'myPickups.status.resolved',
  cancelled: 'myPickups.status.cancelled'
} as const;

export const PICKUP_OPTION_VALUE_TO_KEY: Record<number, PickupOptionKey> = {
  0: 'smallPickup',
  1: 'pickup',
  2: 'container',
  3: 'specialOrder'
} as const;

export const PICKUP_OPTION_TRANSLATION_KEY: Record<PickupOptionKey, string> = {
  smallPickup: 'myPickups.option.smallPickup',
  pickup: 'myPickups.option.pickup',
  container: 'myPickups.option.container',
  specialOrder: 'myPickups.option.specialOrder'
} as const;

// ============================================================================
// CSS Class Mappings
// ============================================================================

export const STATUS_TO_CSS_CLASS: Record<PickupStatusKey, string> = {
  completed: 'status-chip status-completed',
  waitingForPickup: 'status-chip status-scheduled',
  waitingForAccept: 'status-chip status-scheduled',
  waitingForPayment: 'status-chip status-scheduled',
  waitingForUtilizationFee: 'status-chip status-scheduled',
  resolved: 'status-chip status-scheduled',
  complained: 'status-chip status-complained',
  cancelled: 'status-chip status-cancelled'
} as const;

// For GarbageOrderStatus enum
export const GARBAGE_ORDER_STATUS_TO_CSS_CLASS: Record<GarbageOrderStatus, string> = {
  [GarbageOrderStatus.Completed]: 'status-chip status-completed',
  [GarbageOrderStatus.WaitingForPickup]: 'status-chip status-scheduled',
  [GarbageOrderStatus.WaitingForAccept]: 'status-chip status-scheduled',
  [GarbageOrderStatus.WaitingForPayment]: 'status-chip status-scheduled',
  [GarbageOrderStatus.WaitingForUtilizationFee]: 'status-chip status-scheduled',
  [GarbageOrderStatus.Resolved]: 'status-chip status-scheduled',
  [GarbageOrderStatus.Complained]: 'status-chip status-complained',
  [GarbageOrderStatus.Cancelled]: 'status-chip status-cancelled'
} as const;

export const GARBAGE_ORDER_STATUS_TO_TRANSLATION_KEY: Record<GarbageOrderStatus, string> = {
  [GarbageOrderStatus.WaitingForPayment]: 'myPickups.status.waitingForPayment',
  [GarbageOrderStatus.WaitingForAccept]: 'myPickups.status.waitingForAccept',
  [GarbageOrderStatus.WaitingForPickup]: 'myPickups.status.waitingForPickup',
  [GarbageOrderStatus.WaitingForUtilizationFee]: 'myPickups.status.waitingForUtilizationFee',
  [GarbageOrderStatus.Completed]: 'myPickups.status.completed',
  [GarbageOrderStatus.Complained]: 'myPickups.status.complained',
  [GarbageOrderStatus.Resolved]: 'myPickups.status.resolved',
  [GarbageOrderStatus.Cancelled]: 'myPickups.status.cancelled'
} as const;

// ============================================================================
// Configuration
// ============================================================================

export const ORDER_DEFAULTS = {
  UNKNOWN_GROUP_NAME: 'N/A',
  DEFAULT_ITEMS_PER_PAGE: 10,
  ORDER_NUMBER_FALLBACK: 'N/A'
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get CSS class for a pickup status key
 */
export function getStatusClass(status: PickupStatusKey): string {
  return STATUS_TO_CSS_CLASS[status] ?? 'status-chip status-pending';
}

/**
 * Get CSS class for a GarbageOrderStatus enum value
 */
export function getGarbageOrderStatusClass(status: GarbageOrderStatus): string {
  return GARBAGE_ORDER_STATUS_TO_CSS_CLASS[status] ?? 'status-chip status-pending';
}

/**
 * Get translation key for a pickup status
 */
export function getStatusTranslationKey(status: PickupStatusKey): string {
  return STATUS_TRANSLATION_KEY[status];
}

/**
 * Get translation key for a GarbageOrderStatus enum value
 */
export function getGarbageOrderStatusTranslationKey(status: GarbageOrderStatus): string {
  return GARBAGE_ORDER_STATUS_TO_TRANSLATION_KEY[status];
}

/**
 * Get translation key for a pickup option
 */
export function getPickupOptionTranslationKey(option: PickupOptionKey): string {
  return PICKUP_OPTION_TRANSLATION_KEY[option] ?? PICKUP_OPTION_TRANSLATION_KEY.pickup;
}

/**
 * Convert status value (number) to status key (string)
 */
export function statusValueToKey(value: number): PickupStatusKey {
  return STATUS_VALUE_TO_KEY[value] ?? 'waitingForPayment';
}

/**
 * Convert status key (string) to status value (number)
 */
export function statusKeyToValue(key: PickupStatusKey): number {
  return STATUS_KEY_TO_VALUE[key];
}

/**
 * Convert pickup option value (number) to key (string)
 */
export function pickupOptionValueToKey(value: number): PickupOptionKey {
  return PICKUP_OPTION_VALUE_TO_KEY[value] ?? 'pickup';
}

// Made with Bob
