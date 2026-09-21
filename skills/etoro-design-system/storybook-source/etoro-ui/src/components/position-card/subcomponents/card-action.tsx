import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { X1, X6 } from '../../../core/styles/spacing';
import { EtoroIcon } from '../../../foundations/icon-assets/et-icon';
import { CardActionProps } from '../api/types';

/**
 * EtPositionCard.Action - Action button (e.g., share icon).
 */
function CardActionComponent({ icon, onPress, accessibilityLabel }: CardActionProps) {
  const { colors } = useEtoroTheme();

  return (
    <Pressable onPress={onPress} style={styles.container} accessibilityLabel={accessibilityLabel} accessibilityRole="button">
      <EtoroIcon icon={{ iconName: icon }} appearance={{ size: X6, color: colors.carbon900 }} />
    </Pressable>
  );
}

export const CardAction = memo(CardActionComponent);
CardAction.displayName = 'EtPositionCard.Action';

const styles = StyleSheet.create({
  container: {
    padding: X1,
  },
});
