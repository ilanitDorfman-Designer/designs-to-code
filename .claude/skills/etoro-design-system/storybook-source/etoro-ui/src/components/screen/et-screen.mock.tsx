import type { ReactNode } from 'react';
import { View } from 'react-native';

/**
 * Minimal `EtScreen` test double for specs that only need a scroll-provider-free shell (e.g. no `ScrollProvider`).
 * Matches the compound surface used by some screens: root, `TopBar`, `View`.
 */
export function createEtScreenMinimalMock() {
  function EtScreen({ children, testID }: { children?: ReactNode; testID?: string }) {
    return <View testID={testID}>{children}</View>;
  }
  EtScreen.TopBar = () => <View />;
  EtScreen.View = ({ children /*, style*/ }: { children?: ReactNode; style?: object }) => <View /*style={style}*/>{children}</View>;

  return EtScreen;
}
