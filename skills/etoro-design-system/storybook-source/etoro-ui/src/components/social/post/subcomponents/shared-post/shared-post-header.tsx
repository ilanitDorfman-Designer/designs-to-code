import React, { FC, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks';
import { X3, X4 } from '../../../../../core/styles';
import { EtText } from '../../../../../foundations/text';
import { EtAvatar } from '../../../../social/avatar';
import { SharedPostHeaderProps } from '../../api/types';
import { SHARED_POST_BORDER_WIDTH } from './shared-post-frame';

// ============================================================================
// Constants
// ============================================================================

const DOT_SIZE = 3;
const DOT_CONTAINER_SIZE = 16;

// ============================================================================
// Component
// ============================================================================

/**
 * EtPost.SharedPost.Header — compact header row
 *
 * Renders: small avatar + display name + dot separator + timestamp.
 */
function SharedPostHeaderBase({
  displayName,
  avatar,
  timestamp,
  onUserPress,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: SharedPostHeaderProps) {
  const { colors } = useEtoroTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const fallbackInitial = useMemo(() => (displayName && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : '?'), [displayName]);

  const handleUserPress = useCallback(() => {
    onUserPress?.();
  }, [onUserPress]);

  return (
    <View style={[styles.container, style]} testID={testID} accessibilityLabel={accessibilityLabel} accessibilityHint={accessibilityHint}>
      {/* Avatar */}
      <Pressable
        onPress={onUserPress ? handleUserPress : undefined}
        disabled={!onUserPress}
        testID={testID ? `${testID}-avatar` : undefined}
        accessibilityRole={onUserPress ? 'button' : undefined}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <EtAvatar size="small" shape="square" testID={testID ? `${testID}-avatar-component` : undefined}>
          <EtAvatar.Image src={avatar} testID={testID ? `${testID}-avatar-image` : undefined} />
          <EtAvatar.Fallback testID={testID ? `${testID}-avatar-fallback` : undefined}>{fallbackInitial}</EtAvatar.Fallback>
        </EtAvatar>
      </Pressable>

      {/* Name + dot + timestamp */}
      <View style={styles.nameTimestampRow}>
        <Pressable
          onPress={onUserPress ? handleUserPress : undefined}
          disabled={!onUserPress}
          testID={testID ? `${testID}-display-name` : undefined}
          accessibilityRole={onUserPress ? 'button' : undefined}
        >
          <EtText variant="body-secondary-semibold" style={styles.textPrimary} numberOfLines={1}>
            {displayName}
          </EtText>
        </Pressable>

        <View style={styles.dotContainer}>
          <View style={styles.dot} />
        </View>

        <EtText variant="caption-regular" style={styles.textSecondary} numberOfLines={1}>
          {timestamp}
        </EtText>
      </View>
    </View>
  );
}

SharedPostHeaderBase.displayName = 'EtPost.SharedPost.Header';

export const SharedPostHeader: FC<SharedPostHeaderProps> = React.memo(SharedPostHeaderBase);
SharedPostHeader.displayName = 'EtPost.SharedPost.Header';

// ============================================================================
// Styles
// ============================================================================

/* eslint-disable react-native/no-unused-styles */
const createStyles = (colors: ReturnType<typeof useEtoroTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: X4,
      paddingBottom: X3,
      gap: X3,
      borderLeftWidth: SHARED_POST_BORDER_WIDTH,
      borderLeftColor: colors.carbonSecondaryDivider,
    },
    nameTimestampRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    dotContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: DOT_CONTAINER_SIZE,
      height: DOT_CONTAINER_SIZE,
    },
    dot: {
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: DOT_SIZE / 2,
      backgroundColor: colors.carbon500,
    },
    textPrimary: {
      color: colors.carbon900,
    },
    textSecondary: {
      color: colors.carbon500,
    },
  });
