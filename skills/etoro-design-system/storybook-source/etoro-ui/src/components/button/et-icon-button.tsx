import { Pressable, StyleSheet } from 'react-native';

import { X3 } from '../../core/styles';
import { IconName } from '../../foundations/icon-assets/api/types';
import { EtoroIcon } from '../../foundations/icon-assets/et-icon';

interface EtIconButtonProps {
  iconName: IconName;
  size: number;
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
}

export function EtIconButton({ iconName, size, onPress, accessibilityLabel, testID }: EtIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={X3}
      style={[styles.container, { width: size, height: size }]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <EtoroIcon icon={{ iconName }} appearance={{ size: size }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
