import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { type LayoutChangeEvent, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { X3 } from '../../../core/styles/spacing';
import { EtIconV2 } from '../../et-icon-v2';
import { ToastInternalContext, type ToastInternalContextValue } from './api/toast-context';
import type { ToastConfig } from './api/types';
import { DEFAULT_TOAST_DURATION, DEFAULT_TOAST_POSITION, TOAST_ANIMATION, TOAST_DIMENSIONS } from './api/types';
import { useToastController } from './hooks/use-toast-controller';
import { ToastMedia } from './subcomponents/toast-media';
import { ToastMessage } from './subcomponents/toast-message';

const CLOSE_ICON_SIZE = 20;
/** Close inset (X3) + icon size — reserved so message never sits under the X. */
const CLOSE_SLOT_WIDTH = X3 + CLOSE_ICON_SIZE;

interface EtToastInternalProps {
  /** Toast configuration */
  config: ToastConfig;
  /** Callback when toast is dismissed */
  onDismiss: (id: string) => void;
  /** Pre-computed Y offset for stack positioning (negative = moves up) */
  stackOffset?: number;
  /** Pre-computed depth scale (1 = front toast, smaller as it recedes) */
  stackScale?: number;
  /** Pre-computed stack opacity (0 when stacked deeper than the visible count) */
  stackOpacity?: number;
  /** Distance from the front of the stack (0 = newest / front-most toast) */
  frontIndex?: number;
  /** Total number of toasts currently in the stack */
  stackCount?: number;
  /** Whether the stack is currently expanded */
  expanded?: boolean;
  /** Freezes the auto-dismiss timer while the user reads an expanded stack */
  timerPaused?: boolean;
  /** Toggle the collapsed/expanded state of the whole stack */
  onToggleExpand?: () => void;
  /** Callback when the toast's height is measured */
  onHeightMeasured?: (id: string, height: number) => void;
}

/**
 * EtToast - Individual toast notification component
 *
 * Features:
 * - Slide-up entry animation with spring
 * - Swipe down to dismiss
 * - Long press to pause auto-dismiss timer (opacity animated on UI thread)
 * - Sonner-style stacking: toasts pile up with a peek + depth scale when
 *   collapsed, and spread out when the stack is tapped to expand (which also
 *   freezes the auto-dismiss timer so the pile can be read)
 * - Solid `carbon050` surface with a drop shadow (no blur)
 */
export function EtToast({
  config,
  onDismiss,
  stackOffset = 0,
  stackScale = 1,
  stackOpacity = 1,
  frontIndex = 0,
  stackCount = 1,
  expanded = false,
  timerPaused = false,
  onToggleExpand,
  onHeightMeasured,
}: EtToastInternalProps) {
  const { id, type, status, message, duration } = config;
  const variant = config.variant ?? 'inverted';
  const position = config.position ?? DEFAULT_TOAST_POSITION;
  const closable = config.closable === true;
  const closeAccessibilityLabel = config.closeAccessibilityLabel ?? 'Close';
  const { colors } = useEtoroTheme();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // Top anchor tracks the device's safe area (status bar / Dynamic Island)
  // rather than a fixed pixel offset; the bottom anchor keeps its constant.
  const topAnchor = insets.top + TOAST_ANIMATION.TOP_INSET_MARGIN;
  const toastDuration = duration ?? DEFAULT_TOAST_DURATION;
  const toastWidth = Math.min(screenWidth - TOAST_DIMENSIONS.MARGIN_HORIZONTAL * 2, TOAST_DIMENSIONS.MAX_WIDTH);
  const closeIconColor = variant === 'inverted' ? colors.carbon050 : colors.carbon900;

  // Extract type-specific props
  const asset = config.type === 'asset' ? config.asset : undefined;
  const image = config.type === 'image' ? config.image : undefined;
  const assetGroup = config.type === 'assetGroup' ? config.assetGroup : undefined;
  const icon = config.type === 'icon' ? config.icon : undefined;
  const customMedia = config.type === 'custom' ? config.media : undefined;

  // A toast is "behind" when it sits deeper in a collapsed pile. Behind toasts
  // are non-interactive so taps fall through to the front toast (which expands
  // the stack), matching the Sonner pile interaction.
  const isCollapsedBehind = !expanded && frontIndex > 0;

  const handleDismissComplete = useCallback(() => {
    onDismiss(id);
  }, [id, onDismiss]);

  /** Close control dismisses only — must never fire body `onPress` (PBD-1105). */
  const handleClose = useCallback(() => {
    onDismiss(id);
  }, [id, onDismiss]);

  const handlePress = useCallback(() => {
    // Collapsed pile with more than one toast: first tap reveals the stack.
    if (!expanded && stackCount > 1) {
      onToggleExpand?.();
      return;
    }
    // Toast has its own action: fire it, then dismiss (legacy behaviour).
    if (config.onPress) {
      try {
        config.onPress();
      } finally {
        onDismiss(id);
      }
      return;
    }
    // Expanded with no action: tapping collapses the stack back into a pile.
    if (expanded && stackCount > 1) {
      onToggleExpand?.();
    }
  }, [config.onPress, expanded, id, onDismiss, onToggleExpand, stackCount]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      onHeightMeasured?.(id, event.nativeEvent.layout.height);
    },
    [id, onHeightMeasured],
  );

  const { animatedStyle, gesture } = useToastController({
    duration: toastDuration,
    onDismissComplete: handleDismissComplete,
    stackOffset,
    stackScale,
    stackTargetOpacity: stackOpacity,
    gesturesEnabled: !isCollapsedBehind,
    position,
    timerPaused,
  });

  // Internal context for subcomponents — exposes variant so subcomponents
  // (e.g., `ToastMessage`) can pick the right text token.
  const internalContextValue = useMemo<ToastInternalContextValue>(() => ({ type, status, variant }), [type, status, variant]);

  // Pressable when it has an action OR when tapping should expand/collapse the pile.
  const isInteractive = !!config.onPress || stackCount > 1;

  const innerContent: ReactNode = (
    <View style={[styles.content, closable && styles.contentWithClose]}>
      <ToastMedia asset={asset} image={image} assetGroup={assetGroup} icon={icon} customMedia={customMedia} />
      <ToastMessage>{message}</ToastMessage>
    </View>
  );

  const surfaceContent: ReactNode = isInteractive ? (
    <Pressable onPress={handlePress} style={styles.pressable} accessibilityRole="button">
      {innerContent}
    </Pressable>
  ) : (
    innerContent
  );

  const closeControl: ReactNode = closable ? (
    <Pressable
      onPress={handleClose}
      hitSlop={X3}
      style={styles.close}
      accessibilityRole="button"
      accessibilityLabel={closeAccessibilityLabel}
      testID={config.testID ? `${config.testID}-close` : undefined}
    >
      <EtIconV2 name="xmark" size={CLOSE_ICON_SIZE} color={closeIconColor} />
    </Pressable>
  ) : null;

  // Front toast paints on top; deeper toasts recede behind it.
  const zIndex = stackCount - frontIndex;

  return (
    <ToastInternalContext.Provider value={internalContextValue}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          pointerEvents={isCollapsedBehind ? 'none' : 'auto'}
          style={[
            styles.container,
            styles.elevatedShadow,
            position === 'top' ? { top: topAnchor } : styles.anchorBottom,
            { width: toastWidth, zIndex },
            animatedStyle,
          ]}
          onLayout={handleLayout}
          testID={config.testID}
        >
          {variant === 'inverted' ? (
            // Solid carbon900 surface — `carbon900` flips with theme so the
            // toast stays "max contrast" against the page background.
            <View style={[styles.solidLayer, { backgroundColor: colors.carbon800 }]}>
              {surfaceContent}
              {closeControl}
            </View>
          ) : (
            // Default surface: solid carbon050 card with a shadow (no blur).
            <View style={[styles.solidLayer, { backgroundColor: colors.carbon050 }]}>
              {surfaceContent}
              {closeControl}
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </ToastInternalContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minHeight: TOAST_DIMENSIONS.MIN_HEIGHT,
    borderRadius: TOAST_DIMENSIONS.BORDER_RADIUS,
    // No `overflow: 'hidden'` here so the shadow can extend beyond the bounds;
    // the solid surface layer below clips its own content to the rounded corners.
  },
  anchorBottom: {
    bottom: TOAST_ANIMATION.BOTTOM_OFFSET,
  },
  // Drop shadow that lifts the solid card off the page (matches EtCard's API).
  elevatedShadow: {
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.25)',
    elevation: 10,
  },
  // Solid surface shared by the default (carbon050) and `inverted` (carbon900) toasts.
  // Padding lives on `content` (not this layer) so the absolute close control can
  // sit at top/end X3 against the card edge, matching EtBanner chrome.
  solidLayer: {
    flex: 1,
    borderRadius: TOAST_DIMENSIONS.BORDER_RADIUS,
    overflow: 'hidden',
    position: 'relative',
  },
  pressable: {
    flex: 1,
  },
  content: {
    // Fill the solid surface so `alignItems: 'center'` centers against `minHeight`,
    // not just the natural content height (which left a gap below the row).
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: TOAST_DIMENSIONS.CONTENT_GAP,
    paddingHorizontal: TOAST_DIMENSIONS.PADDING_HORIZONTAL,
    paddingVertical: TOAST_DIMENSIONS.PADDING_VERTICAL,
  },
  contentWithClose: {
    paddingEnd: TOAST_DIMENSIONS.PADDING_HORIZONTAL + CLOSE_SLOT_WIDTH,
  },
  close: {
    position: 'absolute',
    top: X3,
    end: X3,
    width: CLOSE_ICON_SIZE,
    height: CLOSE_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
