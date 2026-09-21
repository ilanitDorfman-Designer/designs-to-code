import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { X2, X3, X6 } from '../../../../core/styles';
import { PostFooterProps } from '../api/types';
import { FooterSave } from './footer';

// ============================================================================
// Component
// ============================================================================

/**
 * EtPost.Footer - Compound container for engagement actions
 *
 * Renders footer action subcomponents in a left/right layout:
 * - Left section: Likes, Comments, Shares (grouped with gap)
 * - Right section: Save (pushed to the right)
 *
 * The Save subcomponent is automatically detected and placed in the
 * right section; all other children go in the left section.
 *
 * @example
 * ```tsx
 * <EtPost.Footer>
 *   <EtPost.Likes onPress={toggleLike} isActive={isLiked}>{10}</EtPost.Likes>
 *   <EtPost.Comments onPress={openComments}>{5}</EtPost.Comments>
 *   <EtPost.Shares onPress={share}>{2}</EtPost.Shares>
 *   <EtPost.Save onPress={toggleSave} isActive={isSaved} />
 * </EtPost.Footer>
 * ```
 */
function PostFooterBase({ children, style, testID }: PostFooterProps) {
  const leftChildren: React.ReactNode[] = [];
  let saveChild: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === FooterSave) {
      saveChild = child;
    } else if (child != null && child !== false) {
      leftChildren.push(child);
    }
  });

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.leftSection}>{leftChildren}</View>
      {saveChild}
    </View>
  );
}

PostFooterBase.displayName = 'EtPost.Footer';

export const PostFooter: FC<PostFooterProps> = React.memo(PostFooterBase);
PostFooter.displayName = 'EtPost.Footer';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: X6,
    paddingVertical: X3,
    gap: X2,
  },
});
