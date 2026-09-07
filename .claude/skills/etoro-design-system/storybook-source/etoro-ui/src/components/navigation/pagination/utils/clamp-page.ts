/**
 * Clamps a page number to valid bounds (0 to totalPages - 1).
 *
 * @param page - The page number to clamp
 * @param totalPages - Total number of pages
 * @returns The clamped page number within valid bounds
 *
 * @example
 * ```tsx
 * clampPage(-1, 5); // returns 0
 * clampPage(10, 5); // returns 4
 * clampPage(2, 5);  // returns 2
 * ```
 */
export function clampPage(page: number, totalPages: number): number {
  return Math.max(0, Math.min(page, totalPages - 1));
}
