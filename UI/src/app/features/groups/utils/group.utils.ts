/**
 * Group Utilities
 * Helper functions for group-related operations
 */

/**
 * Avatar colors palette
 */
const AVATAR_COLORS = [
  '#2bb673', // Primary green
  '#1f8b56', // Dark green
  '#198754', // Success green
  '#0d6efd', // Primary blue
  '#20c997', // Teal
  '#6f42c1', // Purple
  '#fd7e14'  // Orange
] as const;

/**
 * Default avatar color (gray)
 */
const DEFAULT_AVATAR_COLOR = '#6c757d';

/**
 * Generate a consistent avatar color based on a name
 * Uses a simple hash function to ensure the same name always gets the same color
 * 
 * @param name - The name to generate color for
 * @returns Hex color string
 */
export function getAvatarColor(name: string): string {
  if (!name || !name.trim()) {
    return DEFAULT_AVATAR_COLOR;
  }

  // Simple hash function: sum of character codes
  const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  
  // Use modulo to get consistent index
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/**
 * Format order number for display
 * Sanitizes and formats order ID into readable format
 * 
 * @param id - Order ID to format
 * @returns Formatted order number (e.g., "ABCD-1234")
 */
export function formatOrderNumber(id: string): string {
  if (!id) {
    return 'N/A';
  }

  // Remove non-alphanumeric characters and convert to uppercase
  const cleaned = id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  if (!cleaned) {
    return 'N/A';
  }

  // Format as XXXX-XXXX if longer than 8 characters
  return cleaned.length <= 8 
    ? cleaned 
    : `${cleaned.slice(0, 4)}-${cleaned.slice(-4)}`;
}

/**
 * Get initials from a name
 * Useful for avatar placeholders
 * 
 * @param name - Full name
 * @returns Initials (max 2 characters)
 */
export function getInitials(name: string): string {
  if (!name || !name.trim()) {
    return '?';
  }

  const words = name.trim().split(/\s+/);
  
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

// Made with Bob
