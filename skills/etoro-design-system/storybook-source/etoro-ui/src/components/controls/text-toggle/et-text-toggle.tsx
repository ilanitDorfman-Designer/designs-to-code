import { memo, ReactNode, useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { X1 } from '../../../core/styles/spacing';
import { isRTL } from '../../../utils/rtl';
import { TextToggleProvider, useTextToggleContext, useTextToggleLayoutContext } from './api/context';
import { EtTextToggleProps } from './api/types';
import { SlidingIndicator, ToggleOption } from './components';
import { useToggleAnimation } from './hooks';
import { getSizeConfig } from './utils';

// Pin the indicator's anchor to the *physical* left edge in both directions:
// `doLeftAndRightSwapInRTL` swaps `right` back to physical left in RTL, so the
// worklet's `translateX` can use `onLayout.x` (always physical) unconverted.
// Module-level constant — direction only changes across a full app reload.
const INDICATOR_ANCHOR = isRTL() ? { right: 0 } : { left: 0 };

// ============================================================================
// Toggle Layout Component (Consumes Context)
// ============================================================================

interface ToggleLayoutProps {
  children: ReactNode;
}

function ToggleLayout({ children }: ToggleLayoutProps) {
  const { selectedId, size, variant, stretch, getOptionIndex, optionCount } = useTextToggleContext();
  const { optionLayoutsShared, selectedProgress, layoutsReady } = useTextToggleLayoutContext();
  const { colors } = useEtoroTheme();

  // Container measurement gate — without this the indicator can paint
  // at zero width before the first layout pass.
  const [isInitialized, setIsInitialized] = useState(false);

  const selectedIndex = getOptionIndex(selectedId);
  const sizeConfig = getSizeConfig(size);

  const { animatedIndicatorStyle } = useToggleAnimation(optionCount, optionLayoutsShared, selectedProgress);

  // Held until both the container and every option have laid out, so
  // the indicator doesn't briefly snap from zero-width on first paint.
  const showIndicator = isInitialized && layoutsReady && selectedIndex >= 0;

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      if (!isInitialized && width > 0) setIsInitialized(true);
    },
    [isInitialized],
  );

  // Figma 48459:49167 "Background transparent color" — carbon900 at ~3% opacity (0x08 / 255 ≈ 3.1%).
  const filledBackground = `${colors.carbon900}08`;
  const containerShape = { borderRadius: sizeConfig.borderRadius, height: sizeConfig.height };
  const containerStyle =
    variant === 'outline'
      ? { ...containerShape, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.carbonPrimaryDivider }
      : { ...containerShape, backgroundColor: filledBackground };

  return (
    <View style={[styles.layout, containerStyle]} onLayout={handleLayout}>
      {showIndicator && (
        <Animated.View style={[styles.indicatorContainer, INDICATOR_ANCHOR, animatedIndicatorStyle]}>
          <SlidingIndicator size={size} />
        </Animated.View>
      )}

      <View style={[styles.optionsContainer, stretch && styles.optionsFlex]}>{children}</View>
    </View>
  );
}

// ============================================================================
// Root Component
// ============================================================================

/**
 * EtTextToggle - A text-based toggle selector with smooth sliding animation.
 *
 * Uses compound component pattern with EtTextToggle.Option subcomponents
 * for flexible composition.
 * @example Basic usage
 * ```tsx
 * const [selectedId, setSelectedId] = useState('1d');
 *
 * <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId}>
 *   <EtTextToggle.Option id="1d" label="1D" />
 *   <EtTextToggle.Option id="1w" label="1W" />
 *   <EtTextToggle.Option id="1m" label="1M" />
 * </EtTextToggle>
 * ```
 *
 * @example Full width with custom styling
 * ```tsx
 * <EtTextToggle
 *   selectedId={selected}
 *   onSelectionChange={setSelected}
 *   size="small"
 *   fullWidth
 * >
 *   <EtTextToggle.Option id="buy" label="Buy" />
 *   <EtTextToggle.Option id="sell" label="Sell" />
 * </EtTextToggle>
 * ```
 */
function TextToggleComponent({
  children,
  selectedId,
  onSelectionChange,
  size = 'large',
  variant = 'filled',
  stretch = false,
  disabled = false,
  haptics = true,
  style,
  testID,
}: EtTextToggleProps) {
  return (
    <View style={[styles.container, stretch && styles.fullWidth, style]} testID={testID} accessibilityRole="radiogroup">
      <TextToggleProvider
        selectedId={selectedId}
        onSelectionChange={onSelectionChange}
        size={size}
        variant={variant}
        stretch={stretch}
        disabled={disabled}
        haptics={haptics}
      >
        <ToggleLayout>{children}</ToggleLayout>
      </TextToggleProvider>
    </View>
  );
}

// ============================================================================
// Compound Component Assembly
// ============================================================================

const TextToggleBase = memo(TextToggleComponent);
TextToggleBase.displayName = 'EtTextToggle';

/**
 * EtTextToggle compound component with subcomponents.
 *
 * Subcomponents:
 * - `EtTextToggle.Option` - Individual toggle option
 */
export const EtTextToggle = Object.assign(TextToggleBase, {
  Option: ToggleOption,
});

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
  layout: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  indicatorContainer: {
    position: 'absolute',
    padding: X1 / 2,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  optionsFlex: {
    flex: 1,
  },
});
