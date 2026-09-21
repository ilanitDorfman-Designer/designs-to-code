import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { LiquidGlassContext } from '../../core/liquid-glass';
import { X1, X6, X15 } from '../../core/styles';
import type { EtTopbarAnimatedRootProps, EtTopbarRootProps } from './api';
import { useTopbarLayout } from './hooks';
import { TopbarAction, TopbarEnd, TopbarMiddle, TopbarSlots, TopbarStart, TopbarStepProgress, TopbarTitle } from './subcomponents';

/**
 * A flexible topbar component using compound component pattern.
 * Supports start, middle, and end slots with automatic layout.
 *
 * The middle slot is absolutely positioned and centered, while start and end
 * slots have higher z-index to ensure touch targets remain accessible.
 *
 * Slot naming uses start/middle/end for RTL-aware semantics:
 * - **Start**: Leading edge (left in LTR, right in RTL)
 * - **Middle**: Centered content
 * - **End**: Trailing edge (right in LTR, left in RTL)
 *
 * On iOS 26+ with Liquid Glass, the background becomes transparent and
 * Start/End actions are wrapped in glass capsules automatically.
 *
 * @example Basic topbar with centered title
 * ```tsx
 * <EtTopbar>
 *   <EtTopbar.Middle>
 *     <EtTopbar.Title>Page Title</EtTopbar.Title>
 *   </EtTopbar.Middle>
 * </EtTopbar>
 * ```
 *
 * @example Topbar with back button and title
 * ```tsx
 * <EtTopbar>
 *   <EtTopbar.Start>
 *     <EtTopbar.Action accessibilityLabel="Go back" onPress={goBack}>
 *       <EtoroIcon name="chevronLeft" size={24} />
 *     </EtTopbar.Action>
 *   </EtTopbar.Start>
 *   <EtTopbar.Middle>
 *     <EtTopbar.Title>Settings</EtTopbar.Title>
 *   </EtTopbar.Middle>
 * </EtTopbar>
 * ```
 *
 * @example Topbar with step progress bar
 * ```tsx
 * <EtTopbar>
 *   <EtTopbar.End>
 *     <EtTopbar.Action accessibilityLabel="More" onPress={openMenu}>
 *       <EtoroIcon name="moreVertical" size={24} />
 *     </EtTopbar.Action>
 *   </EtTopbar.End>
 *   <EtTopbar.StepProgress steps={5} currentStep={2} stepProgress={progress} />
 * </EtTopbar>
 * ```
 */
function EtTopbarRoot({ children, style, disableLiquidGlass: forceDisable, ...props }: EtTopbarRootProps) {
  const { slots, backgroundStyle, liquidGlassContextValue } = useTopbarLayout(children);
  const hasStepProgress = slots.stepProgressElement != null;
  const disableGlass = forceDisable || !liquidGlassContextValue.isLiquidGlass;
  // When glass actually renders, the root must be transparent so the glass capsules
  // refract the content behind the bar (matching the Home top bar). Painting the opaque
  // `backgroundBase` here would sit flush behind the capsules and flatten the glass,
  // leaving the actions nearly invisible (the Watchlist/Portfolio regression).
  const rootBackgroundStyle = disableGlass ? backgroundStyle : transparentBackgroundStyle;

  return (
    <LiquidGlassContext.Provider value={liquidGlassContextValue}>
      <View style={[hasStepProgress ? styles.rootColumn : styles.root, rootBackgroundStyle, style]} {...props}>
        {hasStepProgress ? (
          <>
            <View style={styles.slotsRow}>
              <TopbarSlots slots={slots} disableLiquidGlass={disableGlass} />
            </View>
            {slots.stepProgressElement}
          </>
        ) : (
          <TopbarSlots slots={slots} disableLiquidGlass={disableGlass} />
        )}
      </View>
    </LiquidGlassContext.Provider>
  );
}

EtTopbarRoot.displayName = 'EtTopbar.Root';

/** Animated variant using Animated.View for scroll-driven animations. */
function EtTopbarAnimatedRoot({ children, style, ...props }: EtTopbarAnimatedRootProps) {
  const { slots, backgroundStyle, liquidGlassContextValue } = useTopbarLayout(children);
  const hasStepProgress = slots.stepProgressElement != null;
  // See EtTopbarRoot: transparent when glass renders so capsules refract content behind the bar.
  const rootBackgroundStyle = liquidGlassContextValue.isLiquidGlass ? transparentBackgroundStyle : backgroundStyle;

  return (
    <LiquidGlassContext.Provider value={liquidGlassContextValue}>
      <Animated.View style={[hasStepProgress ? styles.rootColumn : styles.root, rootBackgroundStyle, style]} {...props}>
        {hasStepProgress ? (
          <>
            <View style={styles.slotsRow}>
              <TopbarSlots slots={slots} disableLiquidGlass={!liquidGlassContextValue.isLiquidGlass} />
            </View>
            {slots.stepProgressElement}
          </>
        ) : (
          <TopbarSlots slots={slots} disableLiquidGlass={!liquidGlassContextValue.isLiquidGlass} />
        )}
      </Animated.View>
    </LiquidGlassContext.Provider>
  );
}

EtTopbarAnimatedRoot.displayName = 'EtTopbar.Animated';

export const EtTopbar = Object.assign(EtTopbarRoot, {
  Animated: EtTopbarAnimatedRoot,
  Start: TopbarStart,
  Middle: TopbarMiddle,
  End: TopbarEnd,
  Action: TopbarAction,
  Title: TopbarTitle,
  StepProgress: TopbarStepProgress,
});

/** Transparent fill used when Liquid Glass renders, so glass capsules refract the content behind the bar. */
const transparentBackgroundStyle = { backgroundColor: 'transparent' } as const;

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: X6,
    minHeight: X15,
    width: '100%',
  },
  rootColumn: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: X6,
    minHeight: X15,
    width: '100%',
    gap: X1,
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});
