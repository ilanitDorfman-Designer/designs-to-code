import { EtTableColumn } from '../api/types';
import { MIN_COLUMN_WIDTH } from './render-utils';

export const EMPTY_COLUMNS: EtTableColumn[] = [];

export const calculateVisibleColumns = (columns: EtTableColumn[]): EtTableColumn[] => {
  let baseColumns = columns;
  baseColumns = baseColumns.filter((column) => column.visible !== false);
  return baseColumns;
};

/**
 * Computes cumulative horizontal snap offsets from column widths so that a
 * horizontal ScrollView snaps to column boundaries instead of showing
 * partially visible columns.
 *
 * @returns Array of pixel offsets: `[0, w0, w0+w1, …, totalWidth]`
 */
export function computeColumnSnapOffsets(columns: Pick<EtTableColumn, 'width'>[]): number[] {
  const offsets: number[] = [0];
  let cumulative = 0;
  for (const col of columns) {
    cumulative += col.width ?? MIN_COLUMN_WIDTH;
    offsets.push(cumulative);
  }
  return offsets;
}

export function computeColumnsTotalWidth(columns: Pick<EtTableColumn, 'width'>[]): number {
  return columns.reduce((total, col) => total + (col.width ?? MIN_COLUMN_WIDTH), 0);
}

export function generateKeyExtractor<T>(item: T, index: number): string {
  // Try to use id field if available, otherwise use index
  if (item && typeof item === 'object' && 'id' in item) {
    return String((item as Record<string, unknown>)['id']);
  }
  return index.toString();
}

/**
 * Helper function to compare values for sorting
 * - Numbers are sorted numerically
 * - Strings with % are sorted by their numeric value
 * - Everything else is sorted alphabetically
 */
export function compareValues(a: unknown, b: unknown): number {
  // Handle null/undefined
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  // Preserve legacy sorting semantics for non-primitive values.

  const aStr = typeof a === 'string' ? a : String(a);

  const bStr = typeof b === 'string' ? b : String(b);

  // Check if both are numbers
  const aNum = Number(a);
  const bNum = Number(b);
  if (!isNaN(aNum) && !isNaN(bNum)) {
    return aNum - bNum;
  }

  // Check if both are percentages (e.g., "5.2%", "-3.4%")
  const aIsPercentage = aStr.includes('%');
  const bIsPercentage = bStr.includes('%');

  if (aIsPercentage && bIsPercentage) {
    const aPercentNum = parseFloat(aStr.replace('%', ''));
    const bPercentNum = parseFloat(bStr.replace('%', ''));
    if (!isNaN(aPercentNum) && !isNaN(bPercentNum)) {
      return aPercentNum - bPercentNum;
    }
  }

  // Fallback to alphabetical sorting
  return aStr.localeCompare(bStr);
}
