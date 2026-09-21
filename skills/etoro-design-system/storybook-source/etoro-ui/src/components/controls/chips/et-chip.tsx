import React, { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { interpolate, type SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { X2, X4 } from '../../../core/styles';
import { EtoroIcon } from '../../../foundations/icon-assets/et-icon';
import { EtChipProps } from './api';
import { useChipContext } from './context';
import { ChipProvider } from './context/chip-provider';
import { useChipState } from './hooks/use-chip-handlers';
import { ChipIcon } from './subcomponents/et-chip-icon';
import { ChipLabel } from './subcomponents/et-chip-label';

const SELECTION_TIMING_MS = 200;
const CLOSE_ICON_SIZE = 14;
const CLOSE_ICON_SPACING = X2;
const CLOSE_SLOT_WIDTH = CLOSE_ICON_SIZE + CLOSE_ICON_SPACING;

function animateSelectionProgress(selectedProgress: SharedValue<number>, isSelected: boolean, lastAnimatedTarget: React.RefObject<number>) {
  const target = isSelected ? 1 : 0;
  if (lastAnimatedTarget.current === target) {
    return;
  }
  lastAnimatedTarget.current = target;
  selectedProgress.set(withTiming(target, { duration: SELECTION_TIMING_MS }));
}

/**
 * EtChip - A selectable chip component
 *
 * Uses compound component pattern for flexible composition.
 *
 * @example With compound children
 * ```tsx
 * <EtChip selected={true} onPress={handlePress}>
 *   <EtChip.Icon iconName="star" />
 *   <EtChip.Label>Chip</EtChip.Label>
 * </EtChip>
 * ```
 *
 */
// Main EtChip component (root)
function EtChipRoot(props: EtChipProps) {
  const { selected = false, disabled = false, onSelectionChange } = props;
  const [optimisticSelected, setOptimisticSelected] = useState<boolean | null>(null);
  const selectedProgress = useSharedValue(selected ? 1 : 0);
  const lastAnimatedTarget = useRef(selected ? 1 : 0);

  const displaySelected = optimisticSelected ?? selected;

  useEffect(() => {
    if (optimisticSelected !== null) {
      if (selected === optimisticSelected) {
        setOptimisticSelected(null);
        return undefined;
      }

      const rollbackId = requestAnimationFrame(() => {
        setOptimisticSelected(null);
        animateSelectionProgress(selectedProgress, selected, lastAnimatedTarget);
      });
      return () => cancelAnimationFrame(rollbackId);
    }

    animateSelectionProgress(selectedProgress, selected, lastAnimatedTarget);
    return undefined;
  }, [selected, optimisticSelected, selectedProgress]);

  const handleSelectionChange = useCallback(
    (nextSelected: boolean) => {
      // Visuals are driven entirely by selectedProgress on the UI thread, so we
      // animate immediately and let React reconcile a11y state afterwards.
      animateSelectionProgress(selectedProgress, nextSelected, lastAnimatedTarget);
      setOptimisticSelected(nextSelected);
      startTransition(() => {
        onSelectionChange?.(nextSelected);
      });
    },
    [onSelectionChange, selectedProgress],
  );

  return (
    <ChipProvider selected={displaySelected} disabled={disabled} selectedProgress={selectedProgress}>
      <ChipContainer {...props} selectedProgress={selectedProgress} onSelectionChange={onSelectionChange ? handleSelectionChange : undefined} />
    </ChipProvider>
  );
}

interface ChipContainerProps extends EtChipProps {
  selectedProgress: SharedValue<number>;
}

// Internal container component that uses context
function ChipContainer(props: ChipContainerProps) {
  const { colors } = useEtoroTheme();
  const { selected, selectedProgress } = useChipContext();

  const haptics = props.haptics ?? true;
  const showCloseOnSelected = props.showCloseOnSelected ?? false;

  const isSelected = selected;
  const isInteractive = (props.onPress !== undefined || props.onSelectionChange !== undefined) && !props.disabled;
  const isDisabled = !isInteractive;
  const shouldShowClose = showCloseOnSelected && isInteractive;
  const closeSlotTestID = props.testID ? `${props.testID}-close-slot` : 'chip-close-slot';

  const borderColor = colors.carbon300;

  // Get state and handlers
  const { animatedStyle, handlePressIn, handlePressOut, handlePress } = useChipState({
    haptics,
    selected,
    selectedProgress: props.selectedProgress,
    colors: {
      transparent: colors.transparent,
      carbon900: colors.carbon900,
    },
    onPress: props.onPress,
    onSelectionChange: props.onSelectionChange,
  });

  // UI-thread reveal: the close slot grows from 0 to its natural width so the
  // chip width (and therefore its siblings in the row) reflow each frame.
  const closeSlotStyle = useAnimatedStyle(() => ({
    width: interpolate(selectedProgress.get(), [0, 1], [0, CLOSE_SLOT_WIDTH]),
    opacity: selectedProgress.get(),
  }));

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      testID={props.testID}
      accessibilityLabel={props.accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
    >
      <Animated.View
        style={[
          styles.container,
          {
            borderColor,
          },
          props.style,
          animatedStyle,
        ]}
      >
        <Animated.View style={styles.contentRow}>{props.children}</Animated.View>
        {shouldShowClose ? (
          <Animated.View style={[styles.closeSlot, closeSlotStyle]} testID={closeSlotTestID}>
            <EtoroIcon
              icon={{ iconName: 'closeSmall' }}
              appearance={{
                size: CLOSE_ICON_SIZE,
                color: colors.carbon050,
              }}
            />
          </Animated.View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

EtChipRoot.displayName = 'EtChip';

/**
 * Export with compound components attached
 */
export const EtChip = Object.assign(React.memo(EtChipRoot), {
  Icon: ChipIcon,
  Label: ChipLabel,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    paddingHorizontal: X4,
    paddingVertical: X2,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
  },
  closeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
});
