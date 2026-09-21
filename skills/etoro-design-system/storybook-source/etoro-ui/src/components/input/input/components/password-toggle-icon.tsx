/* eslint-disable react-native/no-inline-styles */
import { Pressable } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';

interface PasswordToggleIconProps {
  isPasswordVisible: boolean;
  onPress: () => void;
}

export function PasswordToggleIcon({ isPasswordVisible, onPress }: PasswordToggleIconProps) {
  const { colors } = useEtoroTheme();

  return (
    <Pressable
      testID="password-toggle-icon"
      style={{
        position: 'absolute',
        end: 8, // Instead of right for RTL support
      }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
      accessibilityHint="Toggles password visibility"
    >
      <EtoroIcon icon={{ iconName: isPasswordVisible ? 'eye' : 'eyeOff' }} appearance={{ size: 20, color: colors.textPrimaryNeutral }} />
    </Pressable>
  );
}
