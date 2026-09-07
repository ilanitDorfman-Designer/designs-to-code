import React, { isValidElement, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { X2, X3, X4 } from '../../../core/styles/spacing';
import type { AssetItemSize, AssetItemSkeletonProps, EtAssetItemProps } from './api';
import { AssetItemContext } from './context';
import { useAssetItemChildren } from './hooks';
import {
  AssetItemChange,
  AssetItemContent,
  AssetItemDivider,
  AssetItemLabel,
  AssetItemLogo,
  AssetItemName,
  AssetItemPrice,
  AssetItemRateChip,
  AssetItemSkeleton,
  AssetItemSymbol,
  AssetItemTrailing,
} from './subcomponents';

const DISABLED_OPACITY = 0.5;

const SIZE_PADDING_VERTICAL: Record<AssetItemSize, number> = {
  large: X4,
  small: X3,
};

const ROW_GAP = X3;

/**
 * `EtAssetItem` - Tailored, asset-focused list item.
 *
 * Compound API mirroring `EtPositionCard` and `EtListItemV2`. Use the dedicated
 * subcomponents (`Logo`, `Content`, `Symbol`, `Name`, `Label`, `Price`,
 * `Change`, `Trailing`, `RateChip`, `Divider`, `Skeleton`) to compose a row.
 *
 * For swipe-to-reveal actions, wrap with `EtSwipeableRow`.
 *
 * @example Basic
 * ```tsx
 * <EtAssetItem size="large" onPress={openAsset}>
 *   <EtAssetItem.Logo source={asset.logoUri} fallback="AP" marketStatus="open" />
 *   <EtAssetItem.Content>
 *     <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
 *     <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
 *   </EtAssetItem.Content>
 *   <EtAssetItem.Price value="$186.79" />
 *   <EtAssetItem.Change value="1.95 (-1.03%)" sentiment="negative" />
 * </EtAssetItem>
 * ```
 *
 * @example Trading-view layout (Buy/Sell quote chips)
 * ```tsx
 * <EtAssetItem layout="trading-view">
 *   <EtAssetItem.Logo source={asset.logoUri} fallback="AU" marketStatus="open" />
 *   <EtAssetItem.Content>
 *     <EtAssetItem.Symbol>AUS200</EtAssetItem.Symbol>
 *   </EtAssetItem.Content>
 *   <EtAssetItem.Change value="▲ 4.35% (-1.03%)" sentiment="positive" />
 *   <EtAssetItem.RateChip value="11756.62" sentiment="positive" label="Buy" />
 *   <EtAssetItem.RateChip value="11756.62" sentiment="neutral" label="Sell" />
 * </EtAssetItem>
 * ```
 *
 * @example Loading
 * ```tsx
 * <EtAssetItem size="large">
 *   <EtAssetItem.Skeleton variant="2-lines" />
 *   <EtAssetItem.Divider />
 * </EtAssetItem>
 * ```
 */
function EtAssetItemBase({
  children,
  size = 'large',
  layout = 'default',
  disabled = false,
  onPress,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: EtAssetItemProps) {
  const { logoChild, contentChild, labelChild, priceChild, changeChild, trailingChild, dividerChild, skeletonChild, rateChipChildren } =
    useAssetItemChildren(children);

  const contextValue = useMemo(() => ({ size, layout, disabled }), [size, layout, disabled]);

  const containerPadding = {
    paddingHorizontal: X4,
    paddingVertical: SIZE_PADDING_VERTICAL[size],
  };

  const isTradingView = layout === 'trading-view';

  if (__DEV__) {
    if (isTradingView) {
      if (priceChild) {
        console.warn('EtAssetItem: layout="trading-view" ignores EtAssetItem.Price. Remove it or switch to layout="default".');
      }
      if (trailingChild) {
        console.warn('EtAssetItem: layout="trading-view" ignores EtAssetItem.Trailing. Use EtAssetItem.RateChip siblings instead.');
      }
      if (labelChild) {
        console.warn('EtAssetItem: layout="trading-view" ignores EtAssetItem.Label. Remove it or switch to layout="default".');
      }
    } else if (rateChipChildren.length > 0) {
      console.warn('EtAssetItem: EtAssetItem.RateChip is only rendered with layout="trading-view". Set the layout prop or remove the chips.');
    }
  }

  // ── Skeleton render path ───────────────────────────────────────────
  if (skeletonChild && isValidElement<AssetItemSkeletonProps>(skeletonChild)) {
    const skeletonElement = React.cloneElement(skeletonChild, {
      size: skeletonChild.props.size ?? size,
      style: skeletonChild.props.style ?? style,
      testID: skeletonChild.props.testID ?? testID,
    });

    if (dividerChild) {
      return (
        <AssetItemContext.Provider value={contextValue}>
          <View style={styles.column}>
            {skeletonElement}
            <View style={{ paddingHorizontal: containerPadding.paddingHorizontal }}>{dividerChild}</View>
          </View>
        </AssetItemContext.Provider>
      );
    }

    return <AssetItemContext.Provider value={contextValue}>{skeletonElement}</AssetItemContext.Provider>;
  }

  // ── Standard render path ───────────────────────────────────────────
  const hasDivider = !!dividerChild;
  const isPressable = !!onPress;

  // When divider is present we drop bottom padding so the divider sits at the
  // edge of the row (mirrors EtListItemV2's behavior).
  const wrapperPadding = hasDivider
    ? { paddingHorizontal: containerPadding.paddingHorizontal, paddingTop: containerPadding.paddingVertical }
    : containerPadding;

  const sharedWrapperProps = {
    accessibilityLabel,
    accessibilityHint,
    accessibilityState: { disabled },
    style: [styles.column, wrapperPadding, disabled && styles.disabled, style],
    testID,
  };

  // Render Pressable whenever onPress is provided so screen readers always
  // announce a button role; `disabled` suppresses the press handler and
  // surfaces the disabled state via accessibilityState.
  const Wrapper = isPressable ? Pressable : View;
  const wrapperProps = isPressable
    ? {
        ...sharedWrapperProps,
        onPress,
        disabled,
        accessibilityRole: 'button' as const,
      }
    : sharedWrapperProps;

  const rowContent = isTradingView ? (
    <View style={styles.row}>
      {logoChild}
      {(contentChild || changeChild) && (
        <View style={styles.contentColumn}>
          {contentChild}
          {changeChild}
        </View>
      )}
      {rateChipChildren.length > 0 && <View style={styles.rateChipRow}>{rateChipChildren}</View>}
    </View>
  ) : (
    <View style={styles.row}>
      {logoChild}
      {contentChild}
      {labelChild}
      {(priceChild || changeChild) && (
        <View style={styles.priceColumn}>
          {priceChild}
          {changeChild}
        </View>
      )}
      {trailingChild}
    </View>
  );

  return (
    <AssetItemContext.Provider value={contextValue}>
      <Wrapper {...wrapperProps}>
        {rowContent}
        {hasDivider && (
          <>
            <View style={{ height: containerPadding.paddingVertical }} />
            {dividerChild}
          </>
        )}
      </Wrapper>
    </AssetItemContext.Provider>
  );
}

EtAssetItemBase.displayName = 'EtAssetItem';

/**
 * `EtAssetItem` compound component.
 *
 * **Subcomponents:**
 * - `EtAssetItem.Logo` - Square instrument avatar with optional fallback and market-status dot
 * - `EtAssetItem.Content` - Vertical container for Symbol/Name
 * - `EtAssetItem.Symbol` - Primary line (semibold)
 * - `EtAssetItem.Name` - Secondary line (tertiary text)
 * - `EtAssetItem.Label` - Optional middle-slot pill (wraps `EtBadge`)
 * - `EtAssetItem.Price` - Right-aligned price string
 * - `EtAssetItem.Change` - Right-aligned change string with sentiment color
 * - `EtAssetItem.Trailing` - Arbitrary right-side slot (replaces `rightElement`)
 * - `EtAssetItem.Divider` - Hairline separator below the row
 * - `EtAssetItem.Skeleton` - Loading placeholder (size inherited from parent)
 *
 * For swipe-to-reveal actions, wrap with `EtSwipeableRow` from `etoro-ui`.
 */
export const EtAssetItem = Object.assign(React.memo(EtAssetItemBase), {
  Logo: AssetItemLogo,
  Content: AssetItemContent,
  Symbol: AssetItemSymbol,
  Name: AssetItemName,
  Label: AssetItemLabel,
  Price: AssetItemPrice,
  Change: AssetItemChange,
  Trailing: AssetItemTrailing,
  RateChip: AssetItemRateChip,
  Divider: AssetItemDivider,
  Skeleton: AssetItemSkeleton,
});

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ROW_GAP,
  },
  priceColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  contentColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // Symbol + change stack with no gap to match the compact Figma trading row
    // (PE-920) — line heights alone provide the vertical rhythm.
    gap: 0,
  },
  rateChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
  },
  disabled: {
    opacity: DISABLED_OPACITY,
  },
});
