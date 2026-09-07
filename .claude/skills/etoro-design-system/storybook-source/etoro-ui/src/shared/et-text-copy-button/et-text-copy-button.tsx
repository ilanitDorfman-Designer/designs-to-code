import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { X3 } from '../../core/styles/spacing';
import { EtTextCopyButtonProps } from './api';
import { TextCopyButtonContext } from './context';
import { useTextCopyButtonConfig, useTextCopyButtonState } from './hooks';
import { TextCopyButtonIcon, TextCopyButtonText } from './subcomponents';

/**
 * EtTextCopyButton - Copy text to clipboard button
 *
 * Displays text with a copy icon. On press:
 * - Copies text to clipboard
 * - Shows checkmark temporarily
 * - Provides haptic feedback
 *
 * @example
 * ```tsx
 * <EtTextCopyButton textToCopy="123456789">
 *   <EtTextCopyButton.Icon />
 *   <EtTextCopyButton.Text>123456789</EtTextCopyButton.Text>
 * </EtTextCopyButton>
 * ```
 *
 * @example
 * ```tsx
 * // String shorthand
 * <EtTextCopyButton textToCopy="Tal Ben Simon">
 *   Tal Ben Simon
 * </EtTextCopyButton>
 * ```
 */
function EtTextCopyButtonBase(props: EtTextCopyButtonProps) {
  // Get state (handles copy logic and defaults)
  const { isCopied, handleCopy } = useTextCopyButtonState({
    textToCopy: props.textToCopy,
    onCopy: props.onCopy,
    successDuration: props.successDuration,
    haptics: props.haptics,
    onError: props.onError,
    afterCopy: props.afterCopy,
  });

  // Get configuration (computes theme-aware colors)
  const config = useTextCopyButtonConfig({ isCopied });

  // If children is a string, wrap in compound components
  const renderChildren = () => {
    if (typeof props.children === 'string') {
      return (
        <>
          <TextCopyButtonIcon />
          <TextCopyButtonText>{props.children}</TextCopyButtonText>
        </>
      );
    }
    return props.children;
  };

  return (
    <TextCopyButtonContext.Provider value={config.contextValue}>
      <Pressable
        style={[styles.container, props.style]}
        onPress={handleCopy}
        testID={props.testID}
        accessibilityLabel={props.accessibilityLabel ?? `Copy ${props.textToCopy}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isCopied }}
      >
        {renderChildren()}
      </Pressable>
    </TextCopyButtonContext.Provider>
  );
}

EtTextCopyButtonBase.displayName = 'EtTextCopyButton';

/**
 * Export with compound components attached
 */
export const EtTextCopyButton = Object.assign(memo(EtTextCopyButtonBase), {
  Icon: TextCopyButtonIcon,
  Text: TextCopyButtonText,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X3,
  },
});
