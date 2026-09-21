export interface EtRangeSliderProps {
  /**
   * Minimum value of the slider.
   * @default 0
   */
  min?: number;

  /**
   * Maximum value of the slider.
   * @default 100
   */
  max?: number;

  /**
   * Current value (controlled).
   * @default midpoint between min and max
   */
  value?: number;

  /**
   * Called with the updated value while dragging.
   */
  onValueChange?: (value: number) => void;

  /**
   * Thumb color preset: 'positive' (green) or 'negative' (red).
   * @default 'positive'
   */
  cursorColor?: 'positive' | 'negative';

  /**
   * Already translated label for minimum value.
   * @default 'MIN'
   */
  minLabel?: string;

  /**
   * Already translated label for maximum value.
   * @default 'MAX'
   */
  maxLabel?: string;

  /**
   * Optional test identifier.
   */
  testID?: string;
}
