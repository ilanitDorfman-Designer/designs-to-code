import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../../../core/hooks/use-etoro-theme';
import { X4, X5, X6 } from '../../../../../../core/styles/spacing';
import { PollFrameProps } from '../api';

/**
 * EtPoll.Frame - Container for poll components
 *
 * Per Figma (Feed 2026 / node 12026:20344) the poll is a flat translucent
 * overlay (`cardDefault` token = rgba(27,30,33,0.04) in light, white-10% in
 * dark) with no shadow or elevation. Earlier iterations rendered a floating
 * card with `shadowOpacity 0.03 + elevation 4`, which made the poll stand
 * out from the post body in a way the design does not call for.
 */
function PollFrameComponent({ children, style, testID, accessibilityLabel, accessibilityHint }: PollFrameProps) {
  const { colors } = useEtoroTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.cardDefault }, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      {children}
    </View>
  );
}

export const PollFrame = memo(PollFrameComponent);
PollFrame.displayName = 'EtPoll.Frame';

const styles = StyleSheet.create({
  container: {
    padding: X5,
    marginHorizontal: X6,
    borderRadius: X4,
    gap: X5,
    overflow: 'hidden',
  },
});
