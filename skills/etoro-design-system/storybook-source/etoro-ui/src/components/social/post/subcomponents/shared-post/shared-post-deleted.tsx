import React, { FC, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks';
import { X1, X3, X4, X6 } from '../../../../../core/styles';
import { EtText } from '../../../../../foundations/text';
import { EtIconV2 } from '../../../../et-icon-v2';
import { SharedPostDeletedProps } from '../../api/types';

// ============================================================================
// Component
// ============================================================================

/**
 * EtPost.SharedPost.Deleted — informational placeholder shown in place of the
 * embedded original-post preview when the shared post has been deleted.
 *
 * Non-interactive by design. Uses theme tokens so the surface adapts to light
 * and dark mode automatically. The placeholder owns its own horizontal inset
 * and vertical margins, mirroring `EtPost.SharedPost` so it aligns with the
 * surrounding post chrome.
 *
 * Namespacing note: although exposed as `EtPost.SharedPost.Deleted`, this
 * subcomponent is a **leaf** and is rendered directly under `<EtPost>` — it
 * is NOT a child of `<EtPost.SharedPost>` (which is the active-share frame).
 * The dot is purely API grouping.
 */
function SharedPostDeletedBase({ text, style, testID, accessibilityLabel, accessibilityHint }: SharedPostDeletedProps) {
  const { colors } = useEtoroTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.outer}>
      <View
        style={[styles.card, style]}
        testID={testID}
        accessibilityRole="text"
        accessibilityLabel={accessibilityLabel ?? text}
        accessibilityHint={accessibilityHint}
      >
        <EtIconV2 name="alert-circle" size="sm" color={colors.carbon900} />
        <EtText variant="body-tiny-regular" style={styles.text}>
          {text}
        </EtText>
      </View>
    </View>
  );
}

SharedPostDeletedBase.displayName = 'EtPost.SharedPost.Deleted';

export const SharedPostDeleted: FC<SharedPostDeletedProps> = React.memo(SharedPostDeletedBase);
SharedPostDeleted.displayName = 'EtPost.SharedPost.Deleted';

// ============================================================================
// Styles
// ============================================================================

/* eslint-disable react-native/no-unused-styles -- createStyles returns dynamic styles; rule cannot trace usage */
const createStyles = (colors: ReturnType<typeof useEtoroTheme>['colors']) =>
  StyleSheet.create({
    outer: {
      paddingHorizontal: X6,
      marginTop: X3,
      marginBottom: X3,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: X1,
      backgroundColor: colors.cardDefault,
      borderRadius: X4,
      padding: X6,
    },
    text: {
      color: colors.carbon900,
    },
  });
