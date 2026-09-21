import { Easing as RNEasing } from 'react-native';
import { Easing as ReanimatedEasing } from 'react-native-reanimated';

// Reanimated mock in Jest may not expose Easing at module init; RN Easing matches bezier() shape.
const easing = ReanimatedEasing ?? RNEasing;

// Animation configuration
export const ANIMATION_DURATION = 300;
export const EASING = easing.bezier(0.25, 0.46, 0.45, 0.94); // Smooth easing
