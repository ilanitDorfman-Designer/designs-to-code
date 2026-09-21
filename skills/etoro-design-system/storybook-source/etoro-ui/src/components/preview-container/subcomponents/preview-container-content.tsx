import { memo } from 'react';
import { View } from 'react-native';

import type { PreviewContainerContentProps } from '../api';
import { styles } from '../styles';

/**
 * EtPreviewContainer.Content — left-side text stack slot (label + value).
 */
function PreviewContainerContentComponent({ children, style, testID }: PreviewContainerContentProps) {
  return (
    <View style={[styles.previewTextStack, style]} testID={testID}>
      {children}
    </View>
  );
}

export const PreviewContainerContent = memo(PreviewContainerContentComponent);
PreviewContainerContent.displayName = 'EtPreviewContainer.Content';
