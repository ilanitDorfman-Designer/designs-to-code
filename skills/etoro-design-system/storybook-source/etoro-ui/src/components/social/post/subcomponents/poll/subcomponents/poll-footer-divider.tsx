import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../../../core/hooks/use-etoro-theme';

/**
 * EtPoll.FooterDivider - Divider line above footer content
 */
function PollFooterDividerComponent() {
  const { colors } = useEtoroTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderTopColor: colors.carbonSecondaryDivider,
        },
      ]}
    />
  );
}

export const PollFooterDivider = memo(PollFooterDividerComponent);
PollFooterDivider.displayName = 'EtPoll.FooterDivider';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 1,
  },
});
