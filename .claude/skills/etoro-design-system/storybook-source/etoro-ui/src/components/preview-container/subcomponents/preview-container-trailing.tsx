import { memo } from 'react';
import { View } from 'react-native';

import type { PreviewContainerTrailingProps } from '../api';

/**
 * EtPreviewContainer.Trailing — right-side trailing visual slot (e.g. sparkline).
 */
function PreviewContainerTrailingComponent({ children, style, testID }: PreviewContainerTrailingProps) {
  return (
    <View style={style} testID={testID}>
      {children}
    </View>
  );
}

export const PreviewContainerTrailing = memo(PreviewContainerTrailingComponent);
PreviewContainerTrailing.displayName = 'EtPreviewContainer.Trailing';
