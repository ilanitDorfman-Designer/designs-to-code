import { Dimensions } from 'react-native';

const initialViewportHeight = Dimensions.get('window').height;

export function useLazyMountViewportHeight(): number {
  return initialViewportHeight;
}
