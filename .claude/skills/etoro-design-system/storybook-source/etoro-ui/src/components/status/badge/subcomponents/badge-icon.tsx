import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { BadgeIconProps, BadgeSize } from '../api';

/**
 * EtBadge.Icon - Icon subcomponent for EtBadge
 * Automatically colored and sized based on parent badge color and size (via injected props)
 * - small: 12px icon
 * - medium/large: 16px icon
 *
 * @param name - Icon name from icon library
 * @param hasFill - Whether to render as filled (solid) instead of stroked (outlined)
 * @param textColor - Injected by parent EtBadge via useComponentChildren
 * @param size - Injected by parent EtBadge via useComponentChildren
 */
export function BadgeIcon({ name, hasFill = false, textColor, size = 'medium' }: BadgeIconProps & { textColor?: string; size?: BadgeSize }) {
  const iconSize = size === 'small' ? 12 : 16;

  return (
    <EtoroIcon
      icon={{ iconName: name }}
      appearance={{
        size: iconSize,
        color: textColor,
      }}
      style={{
        hasFill,
        fill: textColor,
      }}
    />
  );
}

BadgeIcon.displayName = 'EtBadge.Icon';
