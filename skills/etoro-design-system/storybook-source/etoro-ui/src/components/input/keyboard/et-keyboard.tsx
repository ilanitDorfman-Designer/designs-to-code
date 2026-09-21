import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { X1, X2, X4 } from '../../../core/styles/spacing';
import { EtText } from '../../../foundations/text';
import { EtKeyboardCompound, EtKeyboardKeysProps, EtKeyboardProps, EtKeyboardSlotProps, KeyboardKeyValue } from './api/types';

type KeyboardRenderKey = KeyboardKeyValue | 'clear';

const KEY_ROWS: KeyboardRenderKey[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'clear'],
];

function EtKeyboardHeader({ children, style, testID }: EtKeyboardSlotProps) {
  return (
    <View style={[styles.header, style]} testID={testID}>
      {children}
    </View>
  );
}

EtKeyboardHeader.displayName = 'EtKeyboard.Header';

function EtKeyboardActions({ children, style, testID }: EtKeyboardSlotProps) {
  return (
    <View style={[styles.actions, style]} testID={testID}>
      {children}
    </View>
  );
}

EtKeyboardActions.displayName = 'EtKeyboard.Actions';

function EtKeyboardKeys({
  onKeyPress,
  onClear,
  onClearAll,
  disabled = false,
  disabledKeys,
  style,
  keyColor,
  keyTextStyle,
  testID,
  accessibilityLabel = 'Numeric keyboard',
  deleteLabel = 'Delete',
  haptics = true,
}: EtKeyboardKeysProps) {
  const { colors } = useEtoroTheme();

  const handlePress = React.useCallback(
    (key: KeyboardRenderKey) => {
      if (disabled) {
        return;
      }

      if (haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }

      if (key === 'clear') {
        onClear?.();
        return;
      }

      onKeyPress(key);
    },
    [disabled, haptics, onClear, onKeyPress],
  );

  const handleClearLongPress = React.useCallback(() => {
    if (disabled || !onClearAll) {
      return;
    }

    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }

    onClearAll();
  }, [disabled, haptics, onClearAll]);

  return (
    <View style={[styles.keysContainer, style]} testID={testID} accessibilityRole="none" accessibilityLabel={accessibilityLabel}>
      {KEY_ROWS.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.keyRow}>
          {row.map((key) => {
            const isClear = key === 'clear';
            const isKeyDisabled = disabled || (isClear && !onClear) || (!isClear && (disabledKeys?.includes(key as KeyboardKeyValue) ?? false));
            const keyLabel = isClear ? 'C' : key;
            // A `keyColor` override applies to every key regardless of state, so the keypad
            // keeps a uniform color rather than dimming to the disabled token.
            const resolvedKeyColor = keyColor ?? (isKeyDisabled ? colors.textDisabledPrimaryNeutral : colors.textPrimaryNeutral);

            return (
              <Pressable
                key={key}
                style={({ pressed }) => [styles.keyButton, pressed && !isKeyDisabled ? styles.keyButtonPressed : null]}
                onPress={() => handlePress(key)}
                onLongPress={isClear && onClearAll ? handleClearLongPress : undefined}
                disabled={isKeyDisabled}
                accessibilityRole="button"
                accessibilityLabel={isClear ? deleteLabel : key === '.' ? 'Decimal point' : `Keyboard key ${keyLabel}`}
                testID={testID ? `${testID}-key-${keyLabel}` : undefined}
              >
                {isClear ? (
                  <View style={styles.clearBadge}>
                    <Svg width={46} height={39} viewBox="0 0 46 39" style={StyleSheet.absoluteFillObject}>
                      <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.218 30.8627L0.652954 19.4932L10.218 8.08913C16.5425 -0.279039 28.526 -1.99656 36.9826 4.28778C45.4392 10.5715 47.1679 22.4779 40.8434 30.88C37.2313 35.6789 31.5526 38.5029 25.522 38.5C19.4925 38.4994 14.653 35.5 10.218 30.8627Z"
                        fill="none"
                        stroke={resolvedKeyColor}
                        strokeWidth={1}
                      />
                    </Svg>
                    <EtText variant="num-ml" style={[styles.clearLabel, keyTextStyle, { color: resolvedKeyColor }]}>
                      C
                    </EtText>
                  </View>
                ) : (
                  <EtText variant="num-ml" style={[keyTextStyle, { color: resolvedKeyColor }]}>
                    {keyLabel}
                  </EtText>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

EtKeyboardKeys.displayName = 'EtKeyboard.Keys';

function EtKeyboardBase({ children, style, testID }: EtKeyboardProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
    </View>
  );
}

EtKeyboardBase.displayName = 'EtKeyboard';

/**
 * @deprecated Use `EtNumericKeypad` instead. `EtKeyboard` is the legacy classic keypad and is kept
 * only for existing consumers (deposit, wallet, CVV, 2FA/OTP, phone). New numeric-input flows should
 * use the premium, value-managed `EtNumericKeypad` from `etoro-ui`.
 */
export const EtKeyboard: EtKeyboardCompound = Object.assign(React.memo(EtKeyboardBase), {
  Header: EtKeyboardHeader,
  Keys: EtKeyboardKeys,
  Actions: EtKeyboardActions,
});

EtKeyboard.displayName = 'EtKeyboard';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    marginBottom: X4,
  },
  keysContainer: {
    width: '100%',
  },
  keyRow: {
    flexDirection: 'row',
  },
  keyButton: {
    flex: 1,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: X2,
  },
  keyButtonPressed: {
    opacity: 0.7,
  },
  clearBadge: {
    width: 46,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearLabel: {
    marginLeft: X1,
  },
  actions: {
    marginTop: X4,
  },
});
