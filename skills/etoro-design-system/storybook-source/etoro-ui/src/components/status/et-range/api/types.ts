export interface EtRangeProps {
  /**
   * Minimum value displayed on the left side
   * @default 0
   */
  min?: number;

  /**
   * Maximum value displayed on the right side
   * @default 100
   */
  max?: number;

  /**
   * Current value to place the cursor between min and max
   * @default midpoint between min and max
   */
  value?: number;

  /**
   * Cursor color preset.
   * 'green' -> positive gradient
   * 'red'   -> negative gradient
   * @default 'green'
   */
  cursorColor?: 'green' | 'red';

  /**
   * Width of the scrubber track
   * @default 'auto' (fills container)
   */
  width?: number | 'auto';

  /**
   * Height of the cursor indicator
   * @default 37 (SVG native height)
   */
  cursorHeight?: number;

  /**
   * Format function for displaying values
   * @default (value) => value.toFixed(2)
   */
  formatValue?: (value: number) => string;

  /**
   * Override the track background color (defaults to theme `bgActionDisabled`).
   * Useful when the range is rendered on a surface where the default track is not visible.
   */
  trackColor?: string;
}
