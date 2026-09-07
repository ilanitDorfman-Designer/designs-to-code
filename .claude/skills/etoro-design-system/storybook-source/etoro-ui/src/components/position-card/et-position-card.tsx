import { Fragment, memo, ReactNode } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../core/hooks';
import { X4 } from '../../core/styles/spacing';
import { PositionCardProvider, usePositionCardContext } from './api/context';
import { EtPositionCardProps } from './api/types';
import {
  CardAction,
  CardChange,
  CardCollapsedContent,
  CardDivider,
  CardExpandedContent,
  CardFooter,
  CardHalo,
  CardHandle,
  CardHeader,
  CardLabel,
  CardName,
  CardPrice,
  CardSecondaryInfo,
  CardStatRow,
  CardSymbol,
  CardValue,
} from './subcomponents';
import { useSlotHeight } from './use-slot-height';
import { flattenChildren, isExpandedContent } from './utils';

// ============================================================================
// Card Layout Component (Consumes Context)
// ============================================================================

interface CardLayoutProps {
  children: ReactNode;
}

function CardLayout({ children }: CardLayoutProps) {
  const { isExpanded, variant, disableExpandAnimation, hideHandle } = usePositionCardContext();
  const { colors } = useEtoroTheme();

  const { heightValue, onContentLayout } = useSlotHeight(isExpanded);

  // Flatten children (handles Fragments)
  const childArray = flattenChildren(children);

  // Check if ExpandedContent exists (for handle conditional)
  const hasExpandedContent = childArray.some(isExpandedContent);

  // Transform children - wrap ExpandedContent in animation, pass others through
  const transformedChildren = childArray.map((child, index) => {
    if (isExpandedContent(child)) {
      // Static path: render in flow with no animation. See `disableExpandAnimation`.
      if (disableExpandAnimation) {
        return isExpanded ? <Fragment key={`expanded-${index}`}>{child}</Fragment> : null;
      }

      // Animated path — see `useSlotHeight`. Core RN Animated.View height tween
      // (chart-safe), absolutely-positioned inner View for measurement, child
      // mounted exactly once.
      return (
        <Animated.View key={`expanded-${index}`} style={[styles.expandedContainer, { height: heightValue }]}>
          <View style={styles.expandedMeasure} onLayout={onContentLayout}>
            {child}
          </View>
        </Animated.View>
      );
    }

    // All other children pass through unchanged
    return child;
  });

  // Determine background color based on sentiment
  const getBackgroundColor = () => {
    switch (variant) {
      case 'positive':
        return colors.cardPositive;
      case 'negative':
        return colors.cardNegative;
      default:
        return colors.cardDefault; // neutral
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: getBackgroundColor() }, hideHandle && styles.cardNoHandle]}>
      <CardHalo />
      {transformedChildren}
      {hasExpandedContent && !hideHandle && <CardHandle />}
    </View>
  );
}

// ============================================================================
// Root Component
// ============================================================================

/**
 * EtPositionCard - A card component for displaying trading positions with
 * expand/collapse animation.
 *
 * Uses children transformation pattern - children render in natural order,
 * with ExpandedContent receiving special animation treatment.
 *
 * @example Basic usage
 * ```tsx
 * <EtPositionCard isLoading={isLoading}>
 *   <EtPositionCard.Header>
 *     <EtPositionCard.Symbol>AAPL</EtPositionCard.Symbol>
 *     <EtPositionCard.Name>Apple inc</EtPositionCard.Name>
 *     <EtPositionCard.Price>197.93</EtPositionCard.Price>
 *     <EtPositionCard.Change value={1.95} percentage={-1.03} />
 *   </EtPositionCard.Header>
 *
 *   <EtPositionCard.Divider />
 *
 *   <EtPositionCard.ExpandedContent>
 *     <EtLineChart {...chartProps} />
 *   </EtPositionCard.ExpandedContent>
 *
 *   <EtPositionCard.Footer>
 *     <EtPositionCard.Label>Net Value</EtPositionCard.Label>
 *     <EtPositionCard.Value>$1,699.19</EtPositionCard.Value>
 *   </EtPositionCard.Footer>
 * </EtPositionCard>
 * ```
 */
function PositionCardComponent({
  isExpanded,
  defaultExpanded,
  onExpandedChange,
  isLoading = false,
  expandDirection = 'down',
  handleBackgroundColor,
  variant = 'positive',
  disableExpandAnimation = false,
  hideHandle = false,
  style,
  testID,
  children,
}: EtPositionCardProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <PositionCardProvider
        isExpanded={isExpanded}
        defaultExpanded={defaultExpanded}
        onExpandedChange={onExpandedChange}
        isLoading={isLoading}
        expandDirection={expandDirection}
        handleBackgroundColor={handleBackgroundColor}
        variant={variant}
        disableExpandAnimation={disableExpandAnimation}
        hideHandle={hideHandle}
      >
        <CardLayout>{children}</CardLayout>
      </PositionCardProvider>
    </View>
  );
}

// ============================================================================
// Compound Component Assembly
// ============================================================================

const PositionCardBase = memo(PositionCardComponent);
PositionCardBase.displayName = 'EtPositionCard';

/**
 * EtPositionCard compound component with subcomponents.
 *
 * **Subcomponents:**
 * - `EtPositionCard.Header` - Container for top section
 * - `EtPositionCard.Symbol` - Asset symbol (e.g., "AAPL")
 * - `EtPositionCard.Name` - Asset name (e.g., "Apple inc")
 * - `EtPositionCard.Price` - Current price
 * - `EtPositionCard.Change` - Price change indicator
 * - `EtPositionCard.Divider` - Horizontal divider
 * - `EtPositionCard.ExpandedContent` - Animated expanded section
 * - `EtPositionCard.StatRow` - Label + value stat row
 * - `EtPositionCard.Footer` - Container for bottom section
 * - `EtPositionCard.Label` - Label text
 * - `EtPositionCard.Value` - Large value text
 * - `EtPositionCard.SecondaryInfo` - Secondary info row
 * - `EtPositionCard.Action` - Action button
 */
export const EtPositionCard = Object.assign(PositionCardBase, {
  Header: CardHeader,
  Symbol: CardSymbol,
  Name: CardName,
  Price: CardPrice,
  Change: CardChange,
  CollapsedContent: CardCollapsedContent,
  Divider: CardDivider,
  ExpandedContent: CardExpandedContent,
  StatRow: CardStatRow,
  Footer: CardFooter,
  Label: CardLabel,
  Value: CardValue,
  SecondaryInfo: CardSecondaryInfo,
  Action: CardAction,
});

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: X4,
    overflow: 'hidden',
  },
  card: {
    borderRadius: X4,
    overflow: 'hidden',
  },
  expandedContainer: {
    // Height is animated (RN Animated.Value); clip the content as it reveals.
    overflow: 'hidden',
  },
  expandedMeasure: {
    // Absolute so the natural content height is measured independently of the
    // animated outer height.
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  cardNoHandle: {
    paddingBottom: X4,
  },
});
