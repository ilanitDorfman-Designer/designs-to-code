import type { ReactNode } from 'react';
import type { ScrollViewProps, ViewProps } from 'react-native';

/**
 * Optional loading behavior shared by `EtView` / `EtScrollView`.
 *
 * Without a `skeleton`, the container is a plain `View` / `ScrollView`. Provide a
 * `skeleton` to make it loading-aware: while `loading` is `true` the skeleton is
 * shown; when it flips `false` the skeleton dissolves to reveal the children.
 */
export interface EtLoadableProps {
  /** While `true` the skeleton is shown; flipping to `false` dissolves it to reveal the content. */
  loading?: boolean;
  /**
   * Placeholder shown while loading. When omitted the container behaves as a plain
   * `View` / `ScrollView` with zero loading overhead.
   */
  skeleton?: ReactNode;
  /**
   * Make the loading-phase skeleton wrapper fill its parent (`flex: 1`). Set this
   * when the skeleton's root relies on `flex: 1` to size itself (e.g. a full-screen
   * list placeholder) — without it, a `flex: 1` (flexBasis `0%`) root collapses
   * inside the otherwise auto-height wrapper.
   */
  fill?: boolean;
  /** Override the dissolve duration (ms). */
  duration?: number;
  /**
   * Solid backdrop color behind the skeleton during its dissolve overlay.
   * Defaults to the theme screen base (`colors.backgroundBase`). Override when
   * the region sits on a non-default surface and the skeleton lacks its own
   * background.
   */
  skeletonBackground?: string;
}

export interface EtViewProps extends ViewProps, EtLoadableProps {}

export interface EtScrollViewProps extends ScrollViewProps, EtLoadableProps {}
