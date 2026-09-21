import { memo } from 'react';
import { Pressable, PressableStateCallbackType, StyleSheet } from 'react-native';

import { ACTION_HIT_SLOP, ACTION_PADDING } from './et-bottom-sheet-header.const';
import type { EtBottomSheetHeaderActionProps } from './et-bottom-sheet-header.types';

/**
 * EtBottomSheet.Header.Action - Pressable action button positioned at the trailing edge.
 */
function EtBottomSheetHeaderActionComponent({ children, hitSlop, style, ...rest }: EtBottomSheetHeaderActionProps) {
  const composedStyle = typeof style === 'function' ? (state: PressableStateCallbackType) => [styles.action, style(state)] : [styles.action, style];

  return (
    <Pressable accessibilityRole="button" hitSlop={hitSlop ?? ACTION_HIT_SLOP} style={composedStyle} {...rest}>
      {children}
    </Pressable>
  );
}

export const EtBottomSheetHeaderAction = memo(EtBottomSheetHeaderActionComponent);
EtBottomSheetHeaderAction.displayName = 'EtBottomSheet.Header.Action';

const styles = StyleSheet.create({
  action: {
    padding: ACTION_PADDING,
  },
});
