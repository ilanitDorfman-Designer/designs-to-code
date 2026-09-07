import * as Haptics from 'expo-haptics';

/**
 * Trigger haptic feedback if enabled
 *
 * @param enabled - Whether haptic feedback is enabled
 */
export function triggerHaptic(enabled: boolean): void {
  if (enabled) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
}
