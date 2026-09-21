import { DrawerActions } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useNavigation } from 'expo-router';
import { useCallback } from 'react';

import { EtoroIcon } from '../../../foundations/icon-assets/et-icon';
import { TopbarAction } from '../../topbar/subcomponents';

export function DefaultMenuButton() {
  const navigation = useNavigation();

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  // Matches the End-slot action pattern (e.g. Torii) so the Liquid Glass capsule
  // around the menu button is sized consistently with the other top-bar actions.
  return (
    <TopbarAction onPress={handlePress} accessibilityLabel="Open menu" testID="menu-button">
      <EtoroIcon icon={{ iconName: 'menu' }} appearance={{ size: 20 }} />
    </TopbarAction>
  );
}
