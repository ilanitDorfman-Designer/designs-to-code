import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text/et-text';

interface ToggleButtonProps {
  expandProgress: SharedValue<number>;
  showMoreText: string;
  showLessText: string;
  onToggle: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function ToggleButton({ expandProgress, showMoreText, showLessText, onToggle, testID, style }: ToggleButtonProps) {
  const { colors } = useEtoroTheme();

  const showMoreStyle = useAnimatedStyle(() => ({
    opacity: 1 - expandProgress.value,
  }));

  const showLessStyle = useAnimatedStyle(() => ({
    opacity: expandProgress.value,
  }));

  return (
    <Pressable onPress={onToggle} style={[styles.container, style]} testID={testID}>
      <View style={styles.textContainer}>
        <Animated.View style={showMoreStyle}>
          <EtText variant="label-secondary-semibold" style={{ color: colors.actionBrandText }}>
            {showMoreText}
          </EtText>
        </Animated.View>
        <Animated.View style={[styles.overlayText, showLessStyle]}>
          <EtText variant="label-secondary-semibold" style={{ color: colors.actionBrandText }}>
            {showLessText}
          </EtText>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textContainer: {
    position: 'relative',
  },
  overlayText: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
