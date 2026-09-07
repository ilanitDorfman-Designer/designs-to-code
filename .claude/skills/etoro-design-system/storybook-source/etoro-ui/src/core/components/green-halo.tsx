import { useColorScheme, ViewProps } from 'react-native';
import { type AnimatedProps } from 'react-native-reanimated';

import { Halo } from './halo';

interface GreenHaloProps {
  animatedHaloOpacity: NonNullable<AnimatedProps<ViewProps>['style']>;
}

const GREEN_GLOW_COLOR = '#15C27B';

// The saturated green reads much harsher than the neutral glow at the same
// gradient opacity, so the green halo is dialed down by default.
const GREEN_GLOW_INTENSITY = 0.45;

export function GreenHalo({ animatedHaloOpacity }: GreenHaloProps) {
  const theme = useColorScheme();
  return theme === 'dark' ? <Halo glowColor={GREEN_GLOW_COLOR} animatedHaloOpacity={animatedHaloOpacity} intensity={GREEN_GLOW_INTENSITY} /> : null;
}
