import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { X2, X3, X4 } from '../../../core/styles/spacing';
import { EtoroIcon } from '../../../foundations/icon-assets/et-icon';
import { EtText } from '../../../foundations/text/et-text';
import type { EtFabMenuButtonProps } from '../api';
import { useFabMenuContext } from '../context';

const ACTION_HEIGHT = 44;
const ICON_SIZE = 20;

/**
 * EtFabMenu.Button - Individual action button in the FAB menu
 *
 * Renders a pill-shaped button with icon and label. Closes the menu on press.
 */
export function EtFabMenuButton({ iconName, label, onPress, disabled = false, testID, accessibilityLabel }: EtFabMenuButtonProps) {
  const { colors } = useEtoroTheme();
  const { close } = useFabMenuContext();

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
    close();
  }, [onPress, close]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.action,
        {
          backgroundColor: colors.bgPositiveForthiary,
        },
        disabled && styles.disabled,
      ]}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
    >
      <EtoroIcon
        icon={{ iconName }}
        appearance={{
          size: ICON_SIZE,
          color: colors.textPrimaryNeutral,
        }}
      />
      <EtText variant="label-secondary-semibold" style={{ color: colors.textPrimaryNeutral }}>
        {label}
      </EtText>
    </Pressable>
  );
}

EtFabMenuButton.displayName = 'EtFabMenu.Button';

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ACTION_HEIGHT,
    paddingHorizontal: X4,
    paddingVertical: X3,
    borderRadius: ACTION_HEIGHT / 2,
    gap: X2,
  },
  disabled: {
    opacity: 0.5,
  },
});
