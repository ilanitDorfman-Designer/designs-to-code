import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { WithTimingConfig } from 'react-native-reanimated';

/**
 * Props for {@link EtMotionSwap}.
 *
 * Both `first` and `second` are always mounted. Switching `showSecond` animates
 * the active layer in and the outgoing layer out using opacity + a directional
 * translate — all on the UI thread, no JS-bridge involvement.
 *
 * @example Horizontal swap (← →)
 * ```tsx
 * <EtMotionSwap axis="x" showSecond={mode === 'units'} first={<DollarsView />} second={<UnitsView />} />
 * ```
 *
 * @example Vertical swap (↑ ↓)
 * ```tsx
 * <EtMotionSwap axis="y" showSecond={showAlt} first={<PrimaryFigure />} second={<AltFigure />} />
 * ```
 */
export interface EtMotionSwapProps {
  /**
   * When `false` (default), the `first` layer is visible and the `second`
   * layer is invisible. When `true`, they swap: `second` slides in and
   * `first` slides out.
   */
  showSecond: boolean;

  /**
   * Direction of the enter/exit slide.
   * - `'x'`: outgoing slides toward `-distance` (left / leading); incoming
   *   from `+distance` (right / trailing).
   * - `'y'`: outgoing slides toward `-distance` (up); incoming from
   *   `+distance` (down).
   */
  axis: 'x' | 'y';

  /**
   * Pixel distance the entering/exiting layer travels during the transition.
   * @default 14
   */
  distance?: number;

  /**
   * When `true`, only opacity is animated — no directional translate.
   * Prefer for heavy subtrees (e.g. Skia counters) where sliding adds GPU cost.
   * @default false
   */
  opacityOnly?: boolean;

  /**
   * When `true`, each layer is rasterized to a hardware texture before fading.
   * Useful as a fallback when child content is expensive to alpha-composite.
   * @default false
   */
  rasterizeLayers?: boolean;

  /** The first (default) content layer. */
  first: ReactNode;

  /** The second (alternate) content layer. */
  second: ReactNode;

  /**
   * Timing config for the crossfade. Override when a faster/slower timing curve is needed.
   * Defaults to `{ duration: 220 }` — a crisp sub-quarter-second crossfade.
   */
  timingConfig?: WithTimingConfig;

  /** Style applied to the outer container View. */
  style?: StyleProp<ViewStyle>;

  /** Test identifier passed to the root container. */
  testID?: string;
}
