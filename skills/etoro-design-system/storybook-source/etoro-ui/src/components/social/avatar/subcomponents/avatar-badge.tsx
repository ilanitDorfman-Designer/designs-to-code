import { FC, memo, useMemo } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { useAvatarContext } from '../utils/context';
import { BADGE_ICON_SIZES, getBadgePosition, resolveRTLPosition } from '../utils/styles';
import type { AvatarBadgeProps } from '../utils/types';

/**
 * EtAvatar.Badge - Badge indicator positioned at corners
 *
 * Two modes:
 * - Generic (children): bare positioning container. No RTL auto-flipping.
 * - Icon (icon prop): styled circular container with themed background. RTL-aware.
 */
function AvatarBadgeBase({ children, icon, position = 'bottomRight', style, ...rest }: AvatarBadgeProps) {
  const { shape, size } = useAvatarContext();
  const { colors } = useEtoroTheme();

  const resolvedPosition = useMemo(() => (icon ? resolveRTLPosition(position, I18nManager.isRTL) : position), [icon, position]);

  const positionStyle = useMemo(() => getBadgePosition(resolvedPosition, shape), [resolvedPosition, shape]);

  const iconContainerStyle = useMemo(() => {
    if (!icon) return undefined;
    const badgeSize = BADGE_ICON_SIZES[size];
    return {
      width: badgeSize,
      height: badgeSize,
      borderRadius: badgeSize / 2,
      backgroundColor: colors.carbonStatic900,
    };
  }, [icon, size, colors.carbonStatic900]);

  if (icon) {
    return (
      <View style={[styles.badge, positionStyle, styles.iconContainer, iconContainerStyle, style]} {...rest}>
        {icon}
      </View>
    );
  }

  return (
    <View style={[styles.badge, positionStyle, style]} {...rest}>
      {children}
    </View>
  );
}

AvatarBadgeBase.displayName = 'EtAvatar.Badge';

export const AvatarBadge: FC<AvatarBadgeProps> = memo(AvatarBadgeBase);

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    zIndex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
