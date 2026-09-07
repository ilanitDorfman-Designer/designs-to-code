import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { InputAdornmentConfig } from '../api/types';
import { renderAdornmentContent } from './utils';

interface InputAdornmentProps extends InputAdornmentConfig {
  position: 'prefix' | 'suffix';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function InputAdornment({
  iconName,
  size = 20,
  children,
  color,
  position,
  onPress,
  disabled,
  testID,
  style,
  accessibilityLabel,
}: InputAdornmentProps) {
  const { colors } = useEtoroTheme();
  const finalColor = color || colors.textSecondaryNeutral;

  const isInteractive = !!(onPress && !disabled);
  const Container = isInteractive ? Pressable : View;

  return (
    <Container
      testID={testID || `input-adornment-${position}`}
      style={[position === 'prefix' ? styles.prefix : styles.suffix, style]}
      {...(isInteractive && {
        onPress,
        accessibilityRole: 'button' as const,
        accessibilityLabel,
        hitSlop: 8,
      })}
    >
      {renderAdornmentContent({
        iconName,
        size,
        children,
        color: finalColor,
      })}
    </Container>
  );
}

const styles = StyleSheet.create({
  prefix: {
    paddingRight: 6,
  },
  suffix: {
    paddingLeft: 30,
  },
});
