import { EtText } from '../../../../foundations/text/et-text';
import { BadgeLabelProps, BadgeSize } from '../api';

/**
 * EtBadge.Label - Text label subcomponent for EtBadge
 * Automatically styled based on parent badge color and size (via injected props)
 * - small: caption-medium (10/14)
 * - medium/large: body-tiny-medium (12/16)
 */
export function BadgeLabel({ children, style, textColor, size = 'medium', testID }: BadgeLabelProps & { textColor?: string; size?: BadgeSize }) {
  const variant = size === 'small' ? 'caption-medium' : 'body-tiny-medium';

  return (
    <EtText variant={variant} style={[{ color: textColor }, style]} testID={testID}>
      {children}
    </EtText>
  );
}

BadgeLabel.displayName = 'EtBadge.Label';
