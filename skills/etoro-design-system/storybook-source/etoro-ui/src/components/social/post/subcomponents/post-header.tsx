import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X1, X2, X3, X4, X6 } from '../../../../core/styles';
import { EtText } from '../../../../foundations/text';
import { EtIconV2, IconVariant } from '../../../et-icon-v2';
import { EtAvatar } from '../../../social/avatar';
import { EtBadge } from '../../../status/badge';
import { PostHeaderProps } from '../api/types';
import { usePostContext } from '../context';
import { triggerHaptic } from '../utils';

// ============================================================================
// Constants
// ============================================================================

const MENU_ICON_SIZE = 'md';

// ============================================================================
// Component
// ============================================================================

/**
 * EtPost.Header - Post header with user info, timestamp, and actions
 *
 * Renders user avatar, display name, location, timestamp, "Edited" badge, and menu icon.
 * Uses context to access shared post state.
 *
 * @example
 * ```tsx
 * <EtPost {...props}>
 *   <EtPost.Header />
 * </EtPost>
 * ```
 */
function PostHeaderBase({ style, testID }: PostHeaderProps) {
  const { displayName, avatar, location, timestamp, isEdited, onUserPress, onMenuPress, onHeaderPress, haptics } = usePostContext();

  const { colors } = useEtoroTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation('feed');

  // Avatar source is now always a string URL
  const avatarSrc = avatar;

  // Memoize fallback initial
  const fallbackInitial = useMemo(() => displayName.charAt(0).toUpperCase(), [displayName]);

  const handleUserSectionPress = useCallback(() => {
    triggerHaptic(haptics);
    onUserPress?.();
  }, [onUserPress, haptics]);

  const handleMenuPress = useCallback(() => {
    triggerHaptic(haptics);
    onMenuPress?.();
  }, [onMenuPress, haptics]);

  const handleHeaderPress = useCallback(() => {
    triggerHaptic(haptics);
    onHeaderPress?.();
  }, [onHeaderPress, haptics]);

  const ContainerComponent = onHeaderPress ? Pressable : View;

  const userContent = (
    <>
      <View style={styles.avatarContainer} testID={testID ? `${testID}-avatar` : undefined}>
        <EtAvatar size="medium" shape="square" testID={testID ? `${testID}-avatar-component` : undefined}>
          <EtAvatar.Image src={avatarSrc} testID={testID ? `${testID}-avatar-image` : undefined} />
          <EtAvatar.Fallback testID={testID ? `${testID}-avatar-fallback` : undefined}>{fallbackInitial}</EtAvatar.Fallback>
        </EtAvatar>
      </View>

      <View style={styles.userInfo}>
        <View style={styles.nameRow} testID={testID ? `${testID}-user-info` : undefined}>
          <EtText variant="body-secondary-semibold" style={styles.textPrimary}>
            {displayName}
          </EtText>
        </View>

        <View style={styles.metaRow}>
          {!!location && (
            <>
              <EtText variant="caption-regular" style={styles.textSecondary}>
                {location}
              </EtText>
              <View style={styles.dotContainer}>
                <View style={styles.dot} />
              </View>
            </>
          )}
          <EtText variant="caption-regular" style={styles.textSecondary}>
            {timestamp}
          </EtText>
        </View>
      </View>
    </>
  );

  return (
    <ContainerComponent style={[styles.container, style]} testID={testID} {...(onHeaderPress ? { onPress: handleHeaderPress } : {})}>
      {/* User Section — avatar + name + meta navigates to user page; empty space falls through to container */}
      <View style={styles.userSection}>
        {onUserPress ? (
          <Pressable style={styles.userContent} onPress={handleUserSectionPress} testID={testID ? `${testID}-user-section` : undefined}>
            {userContent}
          </Pressable>
        ) : (
          <View style={styles.userContent} testID={testID ? `${testID}-user-section` : undefined}>
            {userContent}
          </View>
        )}
      </View>

      {/* Right Section: Edited Badge + Menu */}
      <View style={styles.rightSection}>
        {isEdited && (
          <View>
            <EtBadge color="neutral" size="small">
              <EtBadge.Label>{t('post.edited')}</EtBadge.Label>
            </EtBadge>
          </View>
        )}
        {onMenuPress && (
          <Pressable onPress={handleMenuPress} style={styles.menuButton} hitSlop={X2} testID={testID ? `${testID}-menu` : undefined}>
            <EtIconV2 name="ellipsis-vertical" variant={IconVariant.Filled} size={MENU_ICON_SIZE} color={colors.carbon900} />
          </Pressable>
        )}
      </View>
    </ContainerComponent>
  );
}

PostHeaderBase.displayName = 'EtPost.Header';

export const PostHeader: FC<PostHeaderProps> = React.memo(PostHeaderBase);
PostHeader.displayName = 'EtPost.Header';

// ============================================================================
// Styles
// ============================================================================

/* eslint-disable react-native/no-unused-styles -- createStyles returns dynamic styles; rule cannot trace usage */
const createStyles = (colors: ReturnType<typeof useEtoroTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingTop: X6, // 24px
      paddingStart: X6, // 24px - aligned with content padding
      paddingEnd: X4,
    },
    userSection: {
      flexDirection: 'row',
      flex: 1,
    },
    userContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexShrink: 1,
    },
    avatarContainer: {
      marginRight: X3, // 12px gap from Figma
    },
    userInfo: {
      flexShrink: 1,
      justifyContent: 'center',
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dotContainer: {
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: colors.carbon500,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      gap: X2, // 4px gap between badge and menu
    },
    menuButton: {
      padding: X1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textPrimary: {
      color: colors.carbon900,
    },
    textSecondary: {
      color: colors.carbon500,
    },
  });
