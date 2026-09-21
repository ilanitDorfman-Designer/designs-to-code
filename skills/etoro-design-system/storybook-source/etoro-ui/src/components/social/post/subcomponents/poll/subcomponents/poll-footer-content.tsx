import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { PollFooterContentProps } from '../api';

/**
 * EtPoll.FooterContent - Container for footer items with flex layout
 */
function PollFooterContentComponent({ children, testID, accessibilityLabel, accessibilityHint }: PollFooterContentProps) {
  return (
    <View style={styles.container} testID={testID} accessibilityLabel={accessibilityLabel} accessibilityHint={accessibilityHint}>
      {children}
    </View>
  );
}

export const PollFooterContent = memo(PollFooterContentComponent);
PollFooterContent.displayName = 'EtPoll.FooterContent';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});
