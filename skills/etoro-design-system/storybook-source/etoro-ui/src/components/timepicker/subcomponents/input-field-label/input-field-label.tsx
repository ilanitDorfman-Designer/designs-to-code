import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { useTimepickerInteraction } from '../../context';

export interface InputFieldLabelProps {
  children: string;
  required?: boolean;
}

function InputFieldLabelComponent({ children, required = false }: InputFieldLabelProps) {
  const { colors } = useEtoroTheme();
  const { animatedLabelContainerStyle, animatedLabelTextStyle, hasValue } = useTimepickerInteraction();

  const labelColor = hasValue ? colors.textSecondaryNeutral : colors.textTertiaryNeutral;

  return (
    <Animated.View style={[styles.label, animatedLabelContainerStyle]}>
      <Animated.Text style={[{ color: labelColor }, animatedLabelTextStyle]}>
        {children}
        {required && ' *'}
      </Animated.Text>
    </Animated.View>
  );
}

export const InputFieldLabel = React.memo(InputFieldLabelComponent);
InputFieldLabel.displayName = 'EtTimepicker.Label';

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    top: 0,
    start: 0,
  },
});
