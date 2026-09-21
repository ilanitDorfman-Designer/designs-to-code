import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X5 } from '../../../../core/styles/spacing';
import type { IconName } from '../../../../foundations/icon-assets/api';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { TOAST_DIMENSIONS } from '../api/types';

interface IconMediaProps {
  /** Icon name from the icon registry */
  name: IconName;
}

/** Icon size within the container */
const ICON_SIZE = X5; // 20px

/**
 * IconMedia - Displays an icon from the icon registry
 */
export function IconMedia({ name }: IconMediaProps) {
  const { colors } = useEtoroTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgDarkSurface }]}>
      <EtoroIcon
        icon={{ iconName: name }}
        appearance={{ size: ICON_SIZE, color: colors.textBright }}
        accessibility={{
          testID: `toast-icon-${name}`,
          accessibilityLabel: `${name} icon`,
          accessibilityRole: 'image',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: TOAST_DIMENSIONS.MEDIA_SIZE,
    height: TOAST_DIMENSIONS.MEDIA_SIZE,
    borderRadius: TOAST_DIMENSIONS.MEDIA_BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
