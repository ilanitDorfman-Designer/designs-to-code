import { createContext, FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { SharedPostAttachmentProps } from '../../api/types';

const SharedAttachmentContext = createContext(false);

/**
 * Returns true when the component is rendered inside SharedPost.Attachment.
 * Used by attachment renderers (Trade, Poll) to remove their own horizontal
 * spacing that would otherwise double-up with SharedPostFrame's padding.
 */
export function useIsSharedAttachment(): boolean {
  return useContext(SharedAttachmentContext);
}

// ============================================================================
// Constants
// ============================================================================

const ATTACHMENT_BORDER_RADIUS = 12;

// ============================================================================
// Component
// ============================================================================

/**
 * EtPost.SharedPost.Attachment — padded + rounded wrapper for children
 *
 * Clips attachment content (images, links, trades) with border radius and padding.
 */
function SharedPostAttachmentBase({ children, style, testID, accessibilityLabel, accessibilityHint }: SharedPostAttachmentProps) {
  return (
    <View style={style} testID={testID} accessibilityLabel={accessibilityLabel} accessibilityHint={accessibilityHint}>
      <View style={styles.inner}>
        <SharedAttachmentContext.Provider value={true}>{children}</SharedAttachmentContext.Provider>
      </View>
    </View>
  );
}

SharedPostAttachmentBase.displayName = 'EtPost.SharedPost.Attachment';

// React.memo omitted: this component accepts children, so shallow comparison
// always detects a change and memo would never prevent re-renders.
export const SharedPostAttachment: FC<SharedPostAttachmentProps> = SharedPostAttachmentBase;
SharedPostAttachment.displayName = 'EtPost.SharedPost.Attachment';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  inner: {
    borderRadius: ATTACHMENT_BORDER_RADIUS,
    overflow: 'hidden',
  },
});
