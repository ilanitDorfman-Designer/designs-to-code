import { useEtInject } from '@etoro/common/di/react';
import { ClipboardService } from '@etoro/common/infra/clipboard/core';
import React, { Children, isValidElement, useCallback, useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { getTextInputPlatformStyle } from '../utils/text-input-platform-props';
import { EtOtpInputProps } from './api/types';
import { OtpProvider } from './context';
import { getOtpSize, useOtpConfig } from './hooks/use-otp-config';
import { useOtpState } from './hooks/use-otp-state';
import { OtpCell } from './subcomponents/otp-cell';
import { OtpErrorMessage } from './subcomponents/otp-error-message';
import { OtpPaste } from './subcomponents/otp-paste';
import { OtpToggle } from './subcomponents/otp-toggle';

/**
 * OTP / PIN code input with configurable length (2–9),
 * auto-resolved cell sizes, optional show/hide toggle, and full state support.
 */
function EtOtpInputBase({
  length,
  value,
  defaultValue,
  onChangeText,
  onComplete,
  onFocus,
  onBlur,
  error = false,
  disabled = false,
  secureEntry = false,
  autoFocus = false,
  haptics = true,
  keyboardType = 'number-pad',
  showVirtualKeyboard = true,
  style,
  testID,
  accessibilityLabel,
  children,
  size: sizeProp,
}: EtOtpInputProps) {
  // Normalize length to a safe integer, then clamp to 2–9
  const safeLength = Number.isFinite(length) ? Math.floor(length) : 4;
  const clampedLength = Math.max(2, Math.min(9, safeLength));

  const size = sizeProp ?? getOtpSize(clampedLength);

  const { inputRef, currentValue, isFocused, isSecure, handleChangeText, handleFocus, handleBlur, focusInput, toggleSecure } = useOtpState({
    length: clampedLength,
    value,
    defaultValue,
    onChangeText,
    onComplete,
    onFocus,
    onBlur,
    secureEntry,
    haptics,
    disabled,
  });

  const config = useOtpConfig({ size, error });
  const clipboardService = useEtInject(ClipboardService);

  const pasteFromClipboard = useCallback(async () => {
    if (disabled) return;
    try {
      const clipboardText = await clipboardService.read();
      // `read()` resolves `null` when the clipboard is empty or unreadable
      // (e.g. Firefox has no `navigator.clipboard.readText`, or the user
      // denied the browser clipboard permission) - the type guard makes the
      // paste button a graceful no-op for any non-string resolution.
      if (typeof clipboardText === 'string' && clipboardText) {
        const digits = clipboardText.replace(/\D/g, '').slice(0, clampedLength);
        if (digits) {
          handleChangeText(digits);
        }
      }
    } catch {
      // Silently fail - clipboard might not be available or permission denied
    }
  }, [disabled, clampedLength, handleChangeText, clipboardService]);

  // Build an array of indices for cell rendering
  const cellIndices = useMemo(() => Array.from({ length: clampedLength }, (_, i) => i), [clampedLength]);

  // autoFocus on TextInput alone is unreliable when the input mounts disabled
  // (e.g. OTP send in flight) and becomes enabled shortly after.
  useEffect(() => {
    if (!autoFocus || disabled) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      focusInput();
    });

    return () => cancelAnimationFrame(frame);
  }, [autoFocus, disabled, focusInput]);

  /** Next empty slot (or last cell when full) — always sequential; no per-cell activation. */
  const focusedCellIndex = Math.min(currentValue.length, clampedLength - 1);

  // Separate ErrorMessage children from cell-row children (Toggle, etc.)
  const childArray = useMemo(() => Children.toArray(children), [children]);
  const errorChildren = useMemo(() => childArray.filter((child) => isValidElement(child) && child.type === OtpErrorMessage), [childArray]);
  const cellRowChildren = useMemo(() => childArray.filter((child) => !isValidElement(child) || child.type !== OtpErrorMessage), [childArray]);

  return (
    <OtpProvider
      value={currentValue}
      isFocused={isFocused}
      isSecure={isSecure}
      error={error}
      disabled={disabled}
      size={size}
      length={clampedLength}
      toggleSecure={toggleSecure}
      iconColor={config.colors.iconColor}
      pasteFromClipboard={pasteFromClipboard}
    >
      <View style={[styles.container, style]} testID={testID}>
        <View style={[styles.cellRow, { gap: config.dimensions.gap }]} accessible={false} testID={testID ? `${testID}-cell-row` : undefined}>
          {/* Cell container with overlay input for native paste support */}
          <Pressable style={styles.cellsContainer} onPress={focusInput} disabled={disabled}>
            {/* Visual cells layer */}
            <View style={[styles.cells, { gap: config.dimensions.gap }]} pointerEvents="none">
              {cellIndices.map((index) => (
                <OtpCell
                  key={index}
                  char={currentValue[index] ?? ''}
                  isCellFocused={index === focusedCellIndex}
                  isInputFocused={isFocused}
                  isSecure={isSecure}
                  error={error}
                  dimensions={config.dimensions}
                  colors={config.colors}
                  textVariant={config.textVariant}
                  dotSize={config.dotSize}
                  testID={testID ? `${testID}-cell-${index}` : undefined}
                />
              ))}
            </View>

            {/* Interactive TextInput overlay - enables native paste (long-press) */}
            <TextInput
              ref={inputRef}
              style={[styles.overlayInput, getTextInputPlatformStyle()]}
              value={currentValue}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={clampedLength}
              keyboardType={keyboardType}
              showSoftInputOnFocus={showVirtualKeyboard}
              secureTextEntry={isSecure}
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              editable={!disabled}
              caretHidden
              autoFocus={autoFocus}
              contextMenuHidden={disabled}
              pointerEvents={disabled ? 'none' : 'auto'}
              accessibilityLabel={accessibilityLabel ?? `Enter ${clampedLength}-digit code`}
              testID={testID ? `${testID}-hidden-input` : 'otp-hidden-input'}
            />
          </Pressable>

          {/* Compound children (e.g. Toggle, Paste icon) - remain interactive */}
          {cellRowChildren}
        </View>

        {/* Error message(s) rendered below cells */}
        {errorChildren}
      </View>
    </OtpProvider>
  );
}

EtOtpInputBase.displayName = 'EtOtpInput';

export const EtOtpInput = Object.assign(React.memo(EtOtpInputBase), {
  Toggle: OtpToggle,
  ErrorMessage: OtpErrorMessage,
  Paste: OtpPaste,
});

EtOtpInput.displayName = 'EtOtpInput';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  cellRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellsContainer: {
    position: 'relative',
  },
  cells: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayInput: {
    ...StyleSheet.absoluteFillObject,
    color: 'transparent',
    backgroundColor: 'transparent',
    opacity: 0,
  },
});
