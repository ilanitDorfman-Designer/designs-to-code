import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import type { Edges } from 'react-native-safe-area-context';
import { initialWindowMetrics, SafeAreaView, SafeAreaViewProps, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEtoroTheme } from '../../../core/hooks';
import { useOverlayContent, useScreenContext } from '../api/context';
import { AnimatedHeaderContainer } from './animated-header-container';
import { GradientWrapper } from './gradient-wrapper';

/** Left + right only — used when a TopBar/overlay is registered and reaches the physical top edge. */
export const ET_SCREEN_CONTENT_SAFE_AREA_EDGES: Edges = ['left', 'right'];

/**
 * Default edges for regular screens without registered top chrome.
 */
const ET_SCREEN_CONTENT_DEFAULT_SAFE_AREA_EDGES: Edges = ['top', 'left', 'right', 'bottom'];

interface ScreenContentRendererProps {
  gradient?: boolean;
  style?: StyleProp<ViewStyle>;
  safeAreaProps?: Omit<SafeAreaViewProps, 'children' | 'style'>;
  children: ReactNode;
}

function withoutTopEdge(edges: Edges): Edges {
  if (Array.isArray(edges)) return edges.filter((edge) => edge !== 'top') as Edges;
  return { ...(edges as Record<string, unknown>), top: 'off' } as Edges;
}

/** True when `edges` asks for the top inset, in either the array or record form of {@link Edges}. */
function includesTopEdge(edges: Edges): boolean {
  if (Array.isArray(edges)) return edges.includes('top');
  const top = (edges as Record<string, string>).top;
  return top != null && top !== 'off';
}

/**
 * Top safe-area inset that is already correct on the very first frame — even inside a freshly
 * presented modal, where the live provider reports `top: 0` for a frame or two and would otherwise
 * jam content against the status bar on first open. `initialWindowMetrics` carries the static
 * launch-time inset, so we use the larger of the two until the live value resolves; on warm renders
 * they agree, so the result is unchanged.
 */
function useStableTopInset(): number {
  const { top } = useSafeAreaInsets();
  return Math.max(top, initialWindowMetrics?.insets.top ?? 0);
}

/**
 * Composes the screen's visual structure from focused subcomponents:
 * GradientWrapper -> SafeAreaView -> body + overlay + topbar.
 *
 * Render order matters for z-stacking when the children are inline (no explicit zIndex):
 *   1. `children` — the body (scrolled content) renders first → underneath
 *   2. `OverlayContainer` — registered `<EtScreenOverlay>` content renders above body,
 *      directly below topbar content
 *   3. `AnimatedHeaderContainer` — topbar renders last with its own absolute + zIndex 1000
 *
 * SafeAreaView only ever applies the left/right/bottom edges; the top inset is applied manually
 * from a first-frame-stable value (see {@link useStableTopInset}). When a topbar or overlay is
 * registered, the top inset is skipped entirely so the absolutely-positioned children of those
 * slots can reach the physical screen top (status bar area) themselves.
 */
export function ScreenContentRenderer({ gradient, style, safeAreaProps, children }: ScreenContentRendererProps) {
  const { edges: callerEdges, ...safeAreaViewProps } = safeAreaProps ?? {};
  const { shouldShowTopBar, hasOverlay } = useScreenContext();
  // The live overlay node is published on a dedicated context so its identity churn (new JSX on
  // every parent render) does not invalidate the main screen context value — see the comment on
  // `OverlayContentContext` in `api/context.tsx`. Only this renderer needs the actual node.
  const overlayContent = useOverlayContent();
  const { colors } = useEtoroTheme();
  const stableTopInset = useStableTopInset();

  // A registered TopBar/overlay reaches the physical top edge itself; otherwise the screen owns the
  // top inset.
  const ownsTopEdge = shouldShowTopBar || hasOverlay;

  const requestedEdges = callerEdges ?? (ownsTopEdge ? ET_SCREEN_CONTENT_SAFE_AREA_EDGES : ET_SCREEN_CONTENT_DEFAULT_SAFE_AREA_EDGES);
  // SafeAreaView never applies the top edge — it's added manually below from a first-frame-stable
  // inset so modals don't flash content under the status bar (see useStableTopInset).
  const safeAreaEdges = withoutTopEdge(requestedEdges);
  const applyTopInset = !ownsTopEdge && includesTopEdge(requestedEdges);

  return (
    <GradientWrapper gradient={gradient}>
      <SafeAreaView
        edges={safeAreaEdges}
        style={[styles.container, applyTopInset && { paddingTop: stableTopInset }, style, { backgroundColor: colors.backgroundBase }]}
        {...safeAreaViewProps}
      >
        {children}
        {overlayContent && (
          <View pointerEvents="box-none" style={styles.overlay}>
            {overlayContent}
          </View>
        )}
        {shouldShowTopBar && <AnimatedHeaderContainer />}
      </SafeAreaView>
    </GradientWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Match the market page progressive-blur layering: above scrolled body, but just below the
    // animated header (1000). Transparent raw topbars therefore reveal overlay blur behind their
    // status-bar/action strip, while topbar buttons remain tappable and visually on top.
    zIndex: 999,
  },
});
