import React, { isValidElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { EtListItemProps, ListItemSkeletonProps } from './api';
import { ListItemContext } from './context';
import { useListItemChildren, useListItemLayout } from './hooks';
import { ListItemDivider, ListItemEnd, ListItemMiddle, ListItemSkeleton, ListItemStart } from './subcomponents';

// Same dimming factor as EtAssetItem's disabled state.
const DISABLED_OPACITY = 0.5;

/**
 * EtListItemV2 - A slot-based list item with Start/Middle/End layout.
 *
 * Layout rules:
 * - Start only → full width
 * - Start + End → Start flex:1, End content-sized
 * - Start + Middle + End → equal width (flex:1 each)
 *
 * @example With divider
 * ```tsx
 * <EtListItem size="large">
 *   <EtListItem.Start><MyContent /></EtListItem.Start>
 *   <EtListItem.End><MyEndContent /></EtListItem.End>
 *   <EtListItem.Divider />
 * </EtListItem>
 * ```
 *
 * @example Skeleton loading
 * ```tsx
 * <EtListItem size="large">
 *   <EtListItem.Skeleton variant="asset-2-lines" />
 * </EtListItem>
 * ```
 *
 * @example Swipeable with actions (wrap with EtSwipeableRow)
 * ```tsx
 * <EtSwipeableRow onSwipeStart={handleSwipeStart}>
 *   <EtListItem size="large">
 *     <EtListItem.Start><MyContent /></EtListItem.Start>
 *   </EtListItem>
 *   <EtSwipeableRow.Action onPress={handleDelete} style={{ backgroundColor: colors.statusNegative }}>
 *     <EtIconV2 name="trash" size="lg" color={colors.textBright} />
 *   </EtSwipeableRow.Action>
 * </EtSwipeableRow>
 * ```
 */
function EtListItemBase({
  children,
  size = 'large',
  style,
  testID,
  onPress,
  onLongPress,
  disabled = false,
  accessibilityLabel,
  accessibilityState,
}: EtListItemProps) {
  const { startChild, middleChild, endChild, dividerChild, skeletonChild, layoutMode } = useListItemChildren(children);

  const { sizeStyles, slotGap, contextValue } = useListItemLayout(layoutMode);

  // Skeleton mode: render the skeleton with optional divider,
  // inheriting size/style/testID from parent
  if (skeletonChild && isValidElement<ListItemSkeletonProps>(skeletonChild)) {
    const skeletonElement = React.cloneElement(skeletonChild, {
      size: skeletonChild.props.size ?? size,
      style: skeletonChild.props.style ?? style,
      testID: skeletonChild.props.testID ?? testID,
    });

    if (dividerChild) {
      return (
        <View style={styles.container}>
          {skeletonElement}
          <View style={{ paddingHorizontal: sizeStyles.paddingHorizontal }}>{dividerChild}</View>
        </View>
      );
    }

    return skeletonElement;
  }

  const hasDivider = !!dividerChild;

  // Single render path:
  // - Always column layout with a row of slots
  // - When divider is present: paddingTop only + gap + divider at bottom
  // - When no divider: normal paddingVertical
  const containerStyle = hasDivider
    ? {
        paddingTop: sizeStyles.paddingVertical,
        paddingHorizontal: sizeStyles.paddingHorizontal,
      }
    : sizeStyles;

  const sharedWrapperProps = {
    accessibilityState: { ...accessibilityState, disabled },
    style: [styles.container, containerStyle, disabled && styles.disabled, style],
    testID,
  };

  const isPressable = !!onPress || !!onLongPress;
  const ContentWrapper = isPressable ? Pressable : View;
  const contentWrapperProps = isPressable
    ? {
        ...sharedWrapperProps,
        onPress,
        onLongPress,
        disabled,
        accessibilityLabel,
        accessibilityRole: 'button' as const,
      }
    : sharedWrapperProps;

  return (
    <ListItemContext.Provider value={contextValue}>
      <ContentWrapper {...contentWrapperProps}>
        <View style={[styles.slotsRow, { gap: slotGap }]}>
          {startChild}
          {middleChild}
          {endChild}
        </View>
        {hasDivider && (
          <>
            <View style={{ height: sizeStyles.paddingVertical }} />
            {dividerChild}
          </>
        )}
      </ContentWrapper>
    </ListItemContext.Provider>
  );
}

EtListItemBase.displayName = 'EtListItem';

/**
 * Export with compound components attached.
 *
 * Usage:
 * - EtListItem.Start - Left slot (default: left-aligned)
 * - EtListItem.Middle - Center slot (default: centered)
 * - EtListItem.End - Right slot (default: right-aligned)
 * - EtListItem.Divider - Hairline separator below slots
 * - EtListItem.Skeleton - Skeleton loading placeholder
 *
 * For swipe-to-reveal actions, wrap with EtSwipeableRow from etoro-ui.
 */
export const EtListItem = Object.assign(React.memo(EtListItemBase), {
  Start: ListItemStart,
  Middle: ListItemMiddle,
  End: ListItemEnd,
  Divider: ListItemDivider,
  Skeleton: ListItemSkeleton,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    opacity: DISABLED_OPACITY,
  },
});
