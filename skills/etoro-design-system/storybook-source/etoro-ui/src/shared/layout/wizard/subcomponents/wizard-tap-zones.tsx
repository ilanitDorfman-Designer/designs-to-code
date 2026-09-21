import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const HOLD_THRESHOLD_MS = 200;

interface WizardTapZonesProps {
  onTapLeft: () => void;
  onTapRight: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  accessibilityLabelLeft?: string;
  accessibilityLabelRight?: string;
}

/**
 * Invisible left/right pressable areas for step navigation.
 * Left half goes to previous step, right half to next step.
 * A quick tap navigates; a long press (>200ms) pauses without navigating on release.
 */
export function WizardTapZones({
  onTapLeft,
  onTapRight,
  onPressIn,
  onPressOut,
  accessibilityLabelLeft,
  accessibilityLabelRight,
}: WizardTapZonesProps) {
  const leftPressTimestamp = useRef(0);
  const rightPressTimestamp = useRef(0);

  const handleLeftPressIn = useCallback(() => {
    leftPressTimestamp.current = Date.now();
    onPressIn?.();
  }, [onPressIn]);

  const handleRightPressIn = useCallback(() => {
    rightPressTimestamp.current = Date.now();
    onPressIn?.();
  }, [onPressIn]);

  const handleLeftPressOut = useCallback(() => {
    onPressOut?.();
  }, [onPressOut]);

  const handleRightPressOut = useCallback(() => {
    onPressOut?.();
  }, [onPressOut]);

  const handleLeftPress = useCallback(() => {
    if (leftPressTimestamp.current > 0 && Date.now() - leftPressTimestamp.current >= HOLD_THRESHOLD_MS) return;
    leftPressTimestamp.current = 0;
    onTapLeft();
  }, [onTapLeft]);

  const handleRightPress = useCallback(() => {
    if (rightPressTimestamp.current > 0 && Date.now() - rightPressTimestamp.current >= HOLD_THRESHOLD_MS) return;
    rightPressTimestamp.current = 0;
    onTapRight();
  }, [onTapRight]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Pressable
        style={styles.zone}
        onPress={handleLeftPress}
        onPressIn={handleLeftPressIn}
        onPressOut={handleLeftPressOut}
        accessibilityLabel={accessibilityLabelLeft}
        accessibilityRole="button"
      />
      <Pressable
        style={styles.zone}
        onPress={handleRightPress}
        onPressIn={handleRightPressIn}
        onPressOut={handleRightPressOut}
        accessibilityLabel={accessibilityLabelRight}
        accessibilityRole="button"
      />
    </View>
  );
}

WizardTapZones.displayName = 'WizardTapZones';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  zone: {
    flex: 1,
    height: '100%',
  },
});
