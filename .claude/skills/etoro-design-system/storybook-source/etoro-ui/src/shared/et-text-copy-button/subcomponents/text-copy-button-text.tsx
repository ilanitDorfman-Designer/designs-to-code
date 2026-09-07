import { memo } from 'react';

import { EtText } from '../../../foundations/text/et-text';
import { TextCopyButtonTextProps } from '../api';
import { useTextCopyButtonContext } from '../context';

/**
 * EtTextCopyButton.Text - Text label subcomponent
 * Automatically styled based on parent component context
 */
function TextCopyButtonTextComponent({ children, style }: TextCopyButtonTextProps) {
  const { textColor } = useTextCopyButtonContext();

  return (
    <EtText variant="body-secondary-medium" style={[{ color: textColor }, style]}>
      {children}
    </EtText>
  );
}

export const TextCopyButtonText = memo(TextCopyButtonTextComponent);
TextCopyButtonText.displayName = 'EtTextCopyButton.Text';
