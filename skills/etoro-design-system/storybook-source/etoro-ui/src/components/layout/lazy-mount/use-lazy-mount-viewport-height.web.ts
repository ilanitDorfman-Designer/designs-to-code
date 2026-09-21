import { useWindowDimensions } from 'react-native';

export function useLazyMountViewportHeight(): number {
  return useWindowDimensions().height;
}
