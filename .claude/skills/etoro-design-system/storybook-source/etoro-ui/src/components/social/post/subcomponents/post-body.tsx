import React, { FC, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { X3, X6 } from '../../../../core/styles';
import { EtReadMoreText } from '../../../et-read-more-text';
import { PostBodyProps } from '../api/types';
import { usePostContext } from '../context';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MAX_LINES = 4;

// ============================================================================
// Component
// ============================================================================

/**
 * EtPost.Body - Post text content with inline "Show More"/"Show Less" toggle
 *
 * Delegates all expand/collapse logic to `EtReadMoreText`.
 *
 * @example
 * ```tsx
 * <EtPost {...props}>
 *   <EtPost.Header />
 *   <EtPost.Body />
 *   <EtPost.Footer />
 * </EtPost>
 * ```
 */
function PostBodyBase({ children, text: textProp, style, testID, accessibilityLabel, onExpandedChange, onTruncationChange }: PostBodyProps) {
  const { text: contextText = '', maxLines = DEFAULT_MAX_LINES } = usePostContext();
  const text = textProp ?? contextText;

  const containerStyle = useMemo(() => [styles.container, style], [style]);

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

PostBodyBase.displayName = 'EtPost.Body';

export const PostBody: FC<PostBodyProps> = React.memo(PostBodyBase);
PostBody.displayName = 'EtPost.Body';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: X6,
    paddingTop: X3,
    marginBottom: X3,
  },
});
