import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';

/**
 * Props for the custom bottom sheet handle component.
 * Extends the library's handle props to receive animated values.
 */
export interface EtBottomSheetHandleProps extends BottomSheetHandleProps {
  /**
   * Whether to show the handle indicator.
   * When false, the handle area is still rendered for gesture handling,
   * but the visual indicator is hidden.
   * @default true
   */
  showHandle?: boolean;

  /**
   * Visual variant passed from the parent EtBottomSheet.
   * When `'glass'`, the rounded-top section is transparent so the glass
   * background shows through.
   * @default 'default'
   */
  variant?: 'default' | 'glass';

  /**
   * Overrides the rounded-top color so it matches a custom sheet surface color.
   * Defaults to the `bgNeutralTertiary` theme token. Ignored for `variant="glass"`.
   */
  backgroundColor?: string;

  testID?: string;
}
