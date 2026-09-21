import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { X1, X3, X4 } from '../../../core/styles/spacing';
import { EtIconV2 } from '../../et-icon-v2';
import type { EtBannerProps } from './api/types';
import { useBannerChildren } from './hooks';
import { BannerActions, BannerDescription, BannerIllustration, BannerTitle } from './subcomponents';

const CLOSE_ICON_SIZE = 20;
/** Close inset (X3) + icon size — reserved so title/body never sit under the X. */
const CLOSE_SLOT_WIDTH = X3 + CLOSE_ICON_SIZE;

/**
 * EtBanner — inline promo / info banner matching DS React Banner variants.
 *
 * Compose with Title, Description, optional Actions (EtButton / EtLink),
 * and optional Illustration. Pass `onClose` to show the dismiss control.
 *
 * @example Basic
 * ```tsx
 * <EtBanner onClose={handleClose}>
 *   <EtBanner.Title>Title</EtBanner.Title>
 *   <EtBanner.Description>
 *     Apple Inc. is a technology company that engages in the design,
 *     manufacturing, and marketing of.
 *   </EtBanner.Description>
 * </EtBanner>
 * ```
 *
 * @example With button + illustration
 * ```tsx
 * <EtBanner onClose={handleClose}>
 *   <EtBanner.Title>Title</EtBanner.Title>
 *   <EtBanner.Description>Supporting copy.</EtBanner.Description>
 *   <EtBanner.Actions>
 *     <EtButton size="tiny" variant="primary-filled" onPress={onCta}>
 *       Label
 *     </EtButton>
 *   </EtBanner.Actions>
 *   <EtBanner.Illustration size="large">
 *     <Image source={art} style={{ width: 112, height: 144 }} />
 *   </EtBanner.Illustration>
 * </EtBanner>
 * ```
 */
function EtBannerBase({ children, onClose, closeAccessibilityLabel = 'Close', style, testID, accessibilityLabel }: EtBannerProps) {
  const { colors } = useEtoroTheme();
  const { title, description, actions, illustration } = useBannerChildren(children);
  const showClose = onClose != null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.cardDefault }, style]}
      testID={testID}
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={[styles.content, showClose && styles.contentWithClose]}>
        {title}
        {(description || actions) && (
          <View style={styles.body}>
            {description}
            {actions}
          </View>
        )}
      </View>
      {illustration}
      {showClose && (
        <Pressable
          onPress={onClose}
          hitSlop={X3}
          style={styles.close}
          accessibilityRole="button"
          accessibilityLabel={closeAccessibilityLabel}
          testID={testID ? `${testID}-close` : undefined}
        >
          <EtIconV2 name="xmark" size={CLOSE_ICON_SIZE} color={colors.textPrimaryNeutral} />
        </Pressable>
      )}
    </View>
  );
}

const EtBannerRoot = memo(EtBannerBase);
EtBannerRoot.displayName = 'EtBanner';

/**
 * EtBanner compound component.
 *
 * Subcomponents:
 * - `EtBanner.Title` — banner heading
 * - `EtBanner.Description` — supporting body copy
 * - `EtBanner.Actions` — CTA row (EtButton / EtLink)
 * - `EtBanner.Illustration` — trailing side art
 */
export const EtBanner = Object.assign(EtBannerRoot, {
  Title: BannerTitle,
  Description: BannerDescription,
  Actions: BannerActions,
  Illustration: BannerIllustration,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: X4,
    overflow: 'hidden',
    gap: X3,
    position: 'relative',
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: X1,
    padding: X4,
  },
  contentWithClose: {
    paddingEnd: CLOSE_SLOT_WIDTH,
  },
  body: {
    gap: X3,
    width: '100%',
  },
  close: {
    position: 'absolute',
    top: X3,
    end: X3,
    width: CLOSE_ICON_SIZE,
    height: CLOSE_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
