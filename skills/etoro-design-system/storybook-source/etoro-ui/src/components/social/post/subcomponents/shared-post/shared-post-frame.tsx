import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { X3, X6 } from '../../../../../core/styles';
import { SharedPostFrameProps } from '../../api/types';

// ============================================================================
// Constants
// ============================================================================

/**
 * Left-border spec shared between Header and Body.
 * Exported so both components use a single source of truth.
 */
export const SHARED_POST_BORDER_WIDTH = 1;

// ============================================================================
// Component
// ============================================================================

/**
 * EtPost.SharedPost — outer frame for shared post content
 *
 * Simple container with horizontal padding. The left border is applied
 * by Header and Body individually so the attachment renders without it.
 */
function SharedPostFrameBase({ children, style, testID, accessibilityLabel, accessibilityHint }: SharedPostFrameProps) {
  return (
    <View style={[styles.container, style]} testID={testID} accessibilityLabel={accessibilityLabel} accessibilityHint={accessibilityHint}>
      {children}
    </View>
  );
}

SharedPostFrameBase.displayName = 'EtPost.SharedPost';

// React.memo omitted: this component accepts children, so shallow comparison
// always detects a change and memo would never prevent re-renders.
export const SharedPostFrame: FC<SharedPostFrameProps> = SharedPostFrameBase;
SharedPostFrame.displayName = 'EtPost.SharedPost';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: X6,
    marginTop: X3,
    marginBottom: X3,
  },
});
