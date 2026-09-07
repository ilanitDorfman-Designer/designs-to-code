import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { X6 } from '../../../../../core/styles/spacing';
import { EtModalHeaderActionProps } from '../../api';

function EtModalHeaderActionBase({ children, onPress, accessibilityLabel, testID }: EtModalHeaderActionProps): React.JSX.Element {
  return (
    <Pressable onPress={onPress} accessibilityLabel={accessibilityLabel} accessibilityRole="button" style={styles.action} testID={testID}>
      {children}
    </Pressable>
  );
}

export const EtModalHeaderAction = memo(EtModalHeaderActionBase);
EtModalHeaderAction.displayName = 'EtModal.Header.Action';

const styles = StyleSheet.create({
  action: {
    minWidth: X6, // 24px touch target
    minHeight: X6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
