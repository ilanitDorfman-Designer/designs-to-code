import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type SplitLayoutAsidePosition = 'start' | 'end';

/**
 * Props for the EtSplitLayout compound component.
 *
 * @example
 * ```tsx
 * <EtSplitLayout ratio={[1, 1]} asidePosition="end">
 *   <EtSplitLayout.TopBar>{chrome}</EtSplitLayout.TopBar>
 *   <EtSplitLayout.Main>{content}</EtSplitLayout.Main>
 *   <EtSplitLayout.Aside>{brandPanel}</EtSplitLayout.Aside>
 * </EtSplitLayout>
 * ```
 */
export interface EtSplitLayoutProps {
  /** Compound children: EtSplitLayout.Main, EtSplitLayout.Aside, EtSplitLayout.TopBar. */
  children: ReactNode;
  /**
   * `[main, aside]` flex weights — SEMANTIC order, independent of `asidePosition`.
   * Default `[1, 1]` (50/50). E.g. a multi-step flow with a narrow steps rail on
   * the left: `ratio={[2, 1]} asidePosition="start"` renders rail(1) | content(2).
   */
  ratio?: [number, number];
  /** Which side the aside pane renders on when split. Default `'end'`. */
  asidePosition?: SplitLayoutAsidePosition;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface SplitLayoutMainProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface SplitLayoutAsideProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface SplitLayoutTopBarProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Public context exposed via `useSplitLayoutContext()` — lets consumers react
 * to the layout mode without re-deriving the breakpoint (e.g. a steps rail
 * rendering a collapsed horizontal stepper when `isSplit` is false).
 */
export interface SplitLayoutContextValue {
  /** True when the viewport is at/above `BREAKPOINT_DESKTOP` and the aside pane is mounted. */
  isSplit: boolean;
  /** Resolved `[main, aside]` flex weights. */
  ratio: [number, number];
  asidePosition: SplitLayoutAsidePosition;
  /**
   * Measured height of the TopBar overlay (0 when absent). The bar never
   * displaces content — consumers may use this to inset scroll content on
   * short viewports.
   */
  topBarHeight: number;
}
