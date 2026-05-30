/**
 * Authentication Constants
 * Centralized constants for authentication module
 */

/**
 * User roles available in the system
 */
export const USER_ROLES = {
  USER: 'User',
  GARBAGE_ADMIN: 'GarbageAdmin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Language preferences
 */
export const LANGUAGE_PREFERENCES = {
  ENGLISH: 'English',
  POLISH: 'Polish'
} as const;

export type LanguagePreference = typeof LANGUAGE_PREFERENCES[keyof typeof LANGUAGE_PREFERENCES];

/**
 * Language code mappings
 */
export const LANGUAGE_CODE_MAP: Record<string, LanguagePreference> = {
  'en': LANGUAGE_PREFERENCES.ENGLISH,
  'pl': LANGUAGE_PREFERENCES.POLISH
};

/**
 * Default values for forms
 */
export const AUTH_DEFAULTS = {
  ROLE: USER_ROLES.USER,
  LANGUAGE: LANGUAGE_PREFERENCES.POLISH,
  MIN_LOADING_TIME_MS: 1000
} as const;

/**
 * Registration wizard configuration
 */
export const REGISTRATION_STEPS = {
  CREDENTIALS: 1,
  ADDRESS: 2,
  PREFERENCES: 3
} as const;

/**
 * Get total steps based on role
 */
export function getTotalSteps(role: UserRole): number {
  return role === USER_ROLES.GARBAGE_ADMIN ? 3 : 2;
}

/**
 * Get control paths for a specific registration step
 */
export function getControlPathsForStep(step: number, isGarbageAdmin: boolean): string[] {
  switch (step) {
    case REGISTRATION_STEPS.CREDENTIALS:
      return ['username', 'email', 'password', 'role'];
    
    case REGISTRATION_STEPS.ADDRESS:
      return ['languagePreference', 'address.city', 'address.postalCode', 'address.street'];
    
    case REGISTRATION_STEPS.PREFERENCES:
      return isGarbageAdmin ? ['pickupOptions'] : [];
    
    default:
      return [];
  }
}

/**
 * Map language code to language preference
 */
export function mapLanguageCodeToPreference(langCode: string | undefined): LanguagePreference {
  if (!langCode) return LANGUAGE_PREFERENCES.POLISH;
  
  const code = langCode.toLowerCase().substring(0, 2);
  return LANGUAGE_CODE_MAP[code] || LANGUAGE_PREFERENCES.ENGLISH;
}

// Made with Bob
