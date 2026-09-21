import { EtTableBodyFlashListProps } from '../api';

type RegularProps<T> = EtTableBodyFlashListProps<T>;

type FixedModeProps<T> = Omit<RegularProps<T>, 'scrollEnabled' | 'showsVerticalScrollIndicator' | 'onScroll'>;

/**
 * Selects FlashList props allowed for EtTableBodyWithFixedColumn
 * to prevent conflicts in scrolling behavior.
 *
 * @param flashListProps - The original FlashList props on EtTableBody.
 * @returns Filtered FlashList props excluding scroll-related properties.
 */
export function selectFixedModeProps<T>(flashListProps: RegularProps<T> | undefined): FixedModeProps<T> | undefined {
  if (!flashListProps) {
    return undefined;
  }
  const { scrollEnabled: _, showsVerticalScrollIndicator: __, onScroll: ___, ...rest } = flashListProps;
  return rest as FixedModeProps<T>;
}
