import { memo, useMemo } from 'react';

import { IconName } from '../../../foundations/icon-assets/api/types';
import { EtoroIcon } from '../../../foundations/icon-assets/et-icon';
import { TextCopyButtonIconProps } from '../api';
import { useTextCopyButtonContext } from '../context';

/**
 * EtTextCopyButton.Icon - Icon subcomponent
 * Shows copy icon or filled checkmark based on state
 */
function TextCopyButtonIconComponent({ style }: TextCopyButtonIconProps) {
  const { isCopied, iconColor } = useTextCopyButtonContext();

  const iconName: IconName = isCopied ? 'checked' : 'copy';

  const iconProp = useMemo(() => ({ iconName }), [iconName]);

  const appearanceProp = useMemo(() => ({ size: 24, color: iconColor }), [iconColor]);

  const styleProp = useMemo(
    () => ({
      hasFill: isCopied,
      fill: isCopied ? iconColor : undefined,
      style,
    }),
    [isCopied, iconColor, style],
  );

  return <EtoroIcon icon={iconProp} appearance={appearanceProp} style={styleProp} />;
}

export const TextCopyButtonIcon = memo(TextCopyButtonIconComponent);
TextCopyButtonIcon.displayName = 'EtTextCopyButton.Icon';
