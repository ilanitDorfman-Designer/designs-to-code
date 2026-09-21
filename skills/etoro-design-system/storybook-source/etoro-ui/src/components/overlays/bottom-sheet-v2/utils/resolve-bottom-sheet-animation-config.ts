import type { WithSpringConfig } from 'react-native-reanimated';

import type { EtBottomSheetAnimationPreset } from '../api';
import {
  ACCESSIBILITY_ANNOUNCEMENT_DELAYS,
  BOUNCY_SPRING_CONFIG,
  FAST_SPRING_CONFIG,
  REDUCED_MOTION_SPRING_CONFIG,
  SMOOTH_SPRING_CONFIG,
} from './et-bottom-sheet.const';

const PRESET_SPRING_CONFIGS: Record<EtBottomSheetAnimationPreset, WithSpringConfig> = {
  bouncy: BOUNCY_SPRING_CONFIG,
  smooth: SMOOTH_SPRING_CONFIG,
  fast: FAST_SPRING_CONFIG,
};

export function resolveBottomSheetAnimationConfig(preset: EtBottomSheetAnimationPreset, isReducedMotion: boolean): WithSpringConfig {
  if (isReducedMotion) {
    return REDUCED_MOTION_SPRING_CONFIG;
  }

  return PRESET_SPRING_CONFIGS[preset];
}

export function resolveAccessibilityAnnouncementDelay(preset: EtBottomSheetAnimationPreset, isReducedMotion: boolean): number {
  if (isReducedMotion) {
    return 0;
  }

  return ACCESSIBILITY_ANNOUNCEMENT_DELAYS[preset];
}
