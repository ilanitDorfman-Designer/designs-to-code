import * as Haptics from 'expo-haptics';
import { memo, useCallback } from 'react';
import { type StyleProp, useWindowDimensions, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { useKeypadDragDismiss } from '../animations';
import type { NumericKeyValue } from '../api/types';
import { getResponsiveKeyRowHeight, KEY_ROWS } from '../constants';
import { numericKeypadStyles as styles } from '../styles';
import { KeypadClearKey } from './keypad-clear-key';
import { KeypadKey } from './keypad-key';
import { KeypadTopBand } from './keypad-top-band';

/**
 * Internal presentational props for {@link NumericKeypadView}. Not part of the public `etoro-ui`
 * surface - consumers use the smart `EtNumericKeypad`, which owns value state and validation.
 */
export interface NumericKeypadViewProps {
  /** Emits the pressed numeric or dot key value. */
  onKeyPress: (value: NumericKeyValue) => void;
  /**
   * Called when the C key is pressed — intended for delete-last-character.
   * When omitted, the C key renders disabled.
   */
  onClear?: () => void;
  /**
   * Called when the C key is long-pressed (~500ms) — intended for a
   * "clear-all / wipe value" gesture. When omitted, no long-press handler
   * is attached and C behaves as a plain delete.
   */
  onClearAll?: () => void;
  /** When `true`, disables all keys at once. */
  disabled?: boolean;
  /** Individual keys to render as disabled (greyed out, non-interactive). */
  disabledKeys?: NumericKeyValue[];
  /** Color of the growing press-feedback circle behind digit/dot keys. */
  pressCircleColor?: string;
  /** When `true`, keys cascade in with a staggered spring entrance on mount. Defaults to `true`. */
  animateEntrance?: boolean;
  /** When `true`, the keypad stretches to fill its parent's height (rows flex). */
  fillHeight?: boolean;
  /** Container style override. */
  style?: StyleProp<ViewStyle>;
  /** Test identifier — keys expose `${testID}-key-${label}`. */
  testID?: string;
  /** Localized accessibility label for the keys container. */
  accessibilityLabel?: string;
  /** Localized accessibility label announced for the C (delete) key. */
  deleteLabel?: string;
  /** Enable haptic feedback on key press. Defaults to true. */
  haptics?: boolean;
  /** When `true`, renders a 28px band above the key rows with a hairline divider + grabber pill. */
  topBand?: boolean;
  /** When provided (and `topBand` is `true`), a downward swipe on the top band calls this callback. */
  onTopBandSwipeDown?: () => void;
  /** Localized accessibility label announced for the interactive top band. */
  topBandAccessibilityLabel?: string;
}

/**
 * NumericKeypadView — the premium, fully-animated 4x3 keypad surface. Internal presentation layer for
 * `EtNumericKeypad`: value-agnostic (the parent owns the value and handles `onKeyPress` / `onClear` /
 * `onClearAll`).
 *
 * Premium feel:
 * - Growing grey circle press feedback behind each digit/dot key.
 * - Inverted pressed state for the C key (filled badge + inverted glyph).
 * - Staggered spring entrance cascade on mount.
 * - Optional hump handle with a drawer-style drag-to-dismiss gesture.
 */
function NumericKeypadViewBase({
  onKeyPress,
  onClear,
  onClearAll,
  disabled = false,
  disabledKeys,
  pressCircleColor,
  animateEntrance = true,
  fillHeight = false,
  topBand = false,
  onTopBandSwipeDown,
  topBandAccessibilityLabel,
  style,
  testID,
  accessibilityLabel,
  deleteLabel,
  haptics = true,
}: NumericKeypadViewProps) {
  const { colors } = useEtoroTheme();
  const { height: windowHeight } = useWindowDimensions();

  const resolvedPressCircleColor = pressCircleColor ?? colors.carbon200;

  // Scale the fixed-height layout down on small/old devices so the grid fits without squeezing the
  // surrounding content. `fillHeight` mode ignores this — the rows flex to the parent instead.
  const rowHeight = getResponsiveKeyRowHeight(windowHeight);

  const rootStyle = fillHeight ? styles.rootFill : styles.root;
  const contentStyle = fillHeight ? styles.contentFill : styles.content;
  const rowStyle = fillHeight ? styles.rowFill : [styles.row, { height: rowHeight }];

  const { panGesture, dragStyle, handleRootLayout } = useKeypadDragDismiss(onTopBandSwipeDown);

  const handleKeyPress = useCallback(
    (key: NumericKeyValue) => {
      if (disabled) return;
      if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      onKeyPress(key);
    },
    [disabled, haptics, onKeyPress],
  );

  const handleClearPress = useCallback(() => {
    if (disabled) return;
    if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onClear?.();
  }, [disabled, haptics, onClear]);

  const handleClearLongPress = useCallback(() => {
    if (disabled || !onClearAll) return;
    if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onClearAll();
  }, [disabled, haptics, onClearAll]);

  return (
    <View style={[rootStyle, style]} onLayout={handleRootLayout} testID={testID} accessibilityRole="none" accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[contentStyle, dragStyle]}>
        {topBand && (
          <KeypadTopBand
            panGesture={onTopBandSwipeDown ? panGesture : undefined}
            accessibilityLabel={topBandAccessibilityLabel}
            testID={testID ? `${testID}-top-band` : undefined}
          />
        )}
        {KEY_ROWS.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={rowStyle}>
            {row.map((key, colIndex) => {
              if (key === 'clear') {
                const isClearDisabled = disabled || !onClear;
                return (
                  <KeypadClearKey
                    key="clear"
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    disabled={isClearDisabled}
                    animateEntrance={animateEntrance}
                    onPress={handleClearPress}
                    onLongPress={onClearAll ? handleClearLongPress : undefined}
                    deleteLabel={deleteLabel}
                    testID={testID ? `${testID}-key-C` : undefined}
                  />
                );
              }

              const isKeyDisabled = disabled || (disabledKeys?.includes(key) ?? false);
              return (
                <KeypadKey
                  key={key}
                  value={key}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  rowHeight={rowHeight}
                  disabled={isKeyDisabled}
                  pressCircleColor={resolvedPressCircleColor}
                  animateEntrance={animateEntrance}
                  onPress={handleKeyPress}
                  testID={testID ? `${testID}-key-${key}` : undefined}
                />
              );
            })}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

NumericKeypadViewBase.displayName = 'NumericKeypadView';

export const NumericKeypadView = memo(NumericKeypadViewBase);

NumericKeypadView.displayName = 'NumericKeypadView';
