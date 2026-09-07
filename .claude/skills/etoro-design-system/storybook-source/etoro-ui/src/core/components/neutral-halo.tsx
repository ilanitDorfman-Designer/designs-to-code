import { useColorScheme, ViewProps } from 'react-native';
import { type AnimatedProps } from 'react-native-reanimated';

import { Halo } from './halo';

// On dark backgrounds the neutral halo reads best as pure white; light mode keeps a soft mint tint.
const DARK_NEUTRAL_GLOW_COLOR = '#FFFFFF';
const LIGHT_NEUTRAL_GLOW_COLOR = '#E4F3EC';

interface NeutralHaloProps {
  animatedSubHaloOpacity: NonNullable<AnimatedProps<ViewProps>['style']>;
  glowColor?: string;
}
export function NeutralHalo({ animatedSubHaloOpacity, glowColor }: NeutralHaloProps) {
  const theme = useColorScheme();
  const resolvedGlowColor = glowColor ?? (theme === 'dark' ? DARK_NEUTRAL_GLOW_COLOR : LIGHT_NEUTRAL_GLOW_COLOR);

  return <Halo glowColor={resolvedGlowColor} animatedHaloOpacity={animatedSubHaloOpacity} />;
}
