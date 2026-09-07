import React, { FC, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks';
import { X3, X4 } from '../../../../../core/styles';
import { EtReadMoreText } from '../../../../et-read-more-text';
import { SharedPostBodyProps } from '../../api/types';
import { SHARED_POST_BORDER_WIDTH } from './shared-post-frame';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MAX_LINES = 4;

// ============================================================================
// Component
// ============================================================================

/**
 * EtPost.SharedPost.Body — expandable text for the shared post
 *
 * Delegates all expand/collapse logic to `EtReadMoreText`.
 */
function SharedPostBodyBase({
  text,
  children,
  maxLines = DEFAULT_MAX_LINES,
  style,
  testID,
  accessibilityLabel,
  onExpandedChange,
  onTruncationChange,
}: SharedPostBodyProps) {
  const { colors } = useEtoroTheme();
  const borderStyle = useMemo(
    () => ({
      borderLeftWidth: SHARED_POST_BORDER_WIDTH,
      borderLeftColor: colors.carbonSecondaryDivider,
    }),
    [colors.carbonSecondaryDivider],
  );
  const containerStyle = useMemo(() => [styles.container, borderStyle, style], [borderStyle, style]);

  return (
    <EtReadMoreText
      text={text}
      maxLines={maxLines}
      style={containerStyle}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      onExpandedChange={onExpandedChange}
      onTruncationChange={onTruncationChange}
    >
      {children}
    </EtReadMoreText>
  );
}

SharedPostBodyBase.displayName = 'EtPost.SharedPost.Body';

export const SharedPostBody: FC<SharedPostBodyProps> = React.memo(SharedPostBodyBase);
SharedPostBody.displayName = 'EtPost.SharedPost.Body';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: X4,
    marginBottom: X3,
  },
});
