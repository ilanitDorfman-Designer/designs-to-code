import * as Haptics from 'expo-haptics';
import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';

type StepperButtonProps = {
  iconName: 'plus' | 'minus';
  onPress: () => void;
  enabled: boolean;
  size: number;
  haptics?: boolean;
  testID?: string;
  colors: {
    dividerPrimary: string;
    dividerTertiary: string;
    textPrimaryNeutral: string;
    textTertiaryNeutral: string;
  };
};

function StepperButtonComponent({ iconName, onPress, enabled, size, haptics = true, testID, colors }: StepperButtonProps) {
  return (
    <Pressable
      disabled={!enabled}
      testID={testID}
      onPress={() => {
        if (enabled && haptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPress();
      }}
      style={({ pressed }) => {
        const borderColor = pressed && enabled ? colors.dividerPrimary : colors.dividerTertiary;

        return [
          styles.iconButton,
          {
            borderColor,
            width: size,
            minWidth: size,
            height: size,
            borderRadius: size / 2,
          },
        ];
      }}
      accessibilityRole="button"
      accessibilityState={{ disabled: !enabled }}
    >
      {({ pressed }) => {
        const iconColor = pressed && enabled ? colors.textPrimaryNeutral : colors.textTertiaryNeutral;
        return <EtoroIcon icon={{ iconName }} appearance={{ color: iconColor }} />;
      }}
    </Pressable>
  );
}

export const StepperButton = memo(StepperButtonComponent);
StepperButton.displayName = 'StepperButton';

const styles = StyleSheet.create({
  iconButton: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
