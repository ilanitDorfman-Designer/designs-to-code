import React, { FC } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks';
import { X1, X2, X3, X4, X6 } from '../../../../../core/styles/spacing';

// ============================================================================
// Types (internal - not exported from api/types)
// ============================================================================

export interface TagRendererProps {
  /** Pre-translated / pre-styled tag content (e.g. status text with a highlighted cashtag). */
  children: React.ReactNode;
  /** Override default container styles. */
  style?: StyleProp<ViewStyle>;
  /** Test ID for the tag root. */
  testID?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * TagRenderer - Sub-component of EtPost (exposed as `EtPost.Tag`).
 *
 * Renders a translucent, self-hugging status pill wrapping caller-provided
 * children (e.g. a status line with a highlighted `$SYM` cashtag). Dumb and
 * translation-free: the feature layer passes pre-translated / pre-styled content.
 *
 * Interactivity is opt-in via the children: the pill itself renders a plain
 * `View` shell and never intercepts touches, so callers can make individual
 * inner elements (e.g. the cashtag) pressable without the whole pill being a button.
 *
 * Use as `<EtPost.Tag>{content}</EtPost.Tag>`.
 *
 * @param props - {@link TagRendererProps}
 * @returns The rendered status tag pill.
 *
 * @example
 * ```tsx
 * <EtPost.Tag>
 *   <EtText variant="body-tiny-medium">Bought <EtText color="primary">$AAPL</EtText></EtText>
 * </EtPost.Tag>
 * ```
 */
function TagRendererBase({ children, style, testID = 'post-trade-badge' }: TagRendererProps) {
  const { colors } = useEtoroTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={[styles.pill, { backgroundColor: colors.cardDefault }]}>{children}</View>
    </View>
  );
}

TagRendererBase.displayName = 'EtPost.Tag';

export const TagRenderer: FC<TagRendererProps> = React.memo(TagRendererBase);
TagRenderer.displayName = 'EtPost.Tag';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginTop: X3,
    paddingHorizontal: X6,
    alignSelf: 'flex-start',
  },
  // Symmetric vertical padding (not a fixed height) keeps the caption text
  // visually centered: caption line-height (14) + X1 padding on both sides.
  pill: {
    alignSelf: 'flex-start',
    minHeight: X4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: X3,
    paddingVertical: X1,
    paddingHorizontal: X2,
  },
});
