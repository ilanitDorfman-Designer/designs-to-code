import { PaginationSize } from '../api';

interface DotDimensions {
  /** Width of a default (unselected) dot */
  width: number;
  /** Height of the dot */
  height: number;
  /** Width of a selected dot */
  selectedWidth: number;
  /** Border radius for rounded corners */
  borderRadius: number;
}

/**
 * Get dot dimensions based on the size variant
 */
export function getDotDimensions(size: PaginationSize): DotDimensions {
  switch (size) {
    case 'large':
      return {
        width: 6,
        height: 6,
        selectedWidth: 20,
        borderRadius: 4,
      };
    case 'small':
    default:
      return {
        width: 4,
        height: 4,
        selectedWidth: 20,
        borderRadius: 4,
      };
  }
}
