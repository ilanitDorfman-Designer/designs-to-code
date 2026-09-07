import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X4 } from '../../../../../../core/styles/spacing';
import { PollOptionsListProps } from '../api';

/**
 * EtPoll.OptionsList - Container for poll options with proper spacing
 */
function PollOptionsListComponent({ children }: PollOptionsListProps) {
  return <View style={styles.container}>{children}</View>;
}

export const PollOptionsList = memo(PollOptionsListComponent);
PollOptionsList.displayName = 'EtPoll.OptionsList';

const styles = StyleSheet.create({
  container: {
    gap: X4,
    width: '100%',
  },
});
