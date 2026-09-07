import React, { useMemo } from 'react';

import { EtText } from '../../../foundations/text';
import type { TextVariant } from '../../../foundations/text/utils/variant-config';
import type { EtLinkLabelProps, LinkSize } from '../api/types';
import { useLinkContext } from '../utils/context';

const LABEL_VARIANTS: Record<LinkSize, TextVariant> = {
  small: 'label-tertiary-semibold',
  medium: 'label-secondary-semibold',
  large: 'label-primary-semibold',
};

/**
 * EtLink.Label - Text label subcomponent for EtLink
 * Automatically styled based on parent link context
 */
function LinkLabelInner({ children, style, numberOfLines = 1, variant, ...props }: EtLinkLabelProps) {
  const { size, textColor } = useLinkContext();

  const resolvedVariant = useMemo(() => variant ?? LABEL_VARIANTS[size], [variant, size]);

  return (
    <EtText variant={resolvedVariant} style={[{ color: textColor }, style]} numberOfLines={numberOfLines} {...props}>
      {children}
    </EtText>
  );
}

export const LinkLabel = React.memo(LinkLabelInner);
LinkLabel.displayName = 'EtLink.Label';
