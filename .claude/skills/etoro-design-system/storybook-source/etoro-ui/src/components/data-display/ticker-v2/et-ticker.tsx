import { StyleSheet, useWindowDimensions, View } from 'react-native';

import type { EtTickerProps } from './api';
import { TickerContext } from './context';
import { useTickerConfig } from './hooks';
import { Marquee, TickerContent, TickerEnd, TickerFilterIcon, TickerGradient, TickerItem, TickerStart } from './subcomponents';
import { getEtTickerHeight } from './utils';

function renderSimpleContent(config: ReturnType<typeof useTickerConfig>, items: EtTickerProps['items'] & {}) {
  const marquee = (
    <Marquee withGesture={true} style={styles.marqueeContainer}>
      <View style={styles.contentWrapper}>
        <TickerContent items={items} />
      </View>
    </Marquee>
  );

  if (!config.gradient) return marquee;

  return <TickerGradient>{marquee}</TickerGradient>;
}

/**
 * EtTicker - Infinite scrolling ticker for financial market data.
 *
 * Supports two usage patterns:
 *
 * @example Simple (data-driven)
 * ```tsx
 * <EtTicker items={data} speed={0.5} />
 * ```
 *
 * @example Compound (composable)
 * ```tsx
 * <EtTicker speed={0.5}>
 *   <EtTicker.Start>
 *     <Pressable onPress={openSort}><EtTicker.FilterIcon /></Pressable>
 *   </EtTicker.Start>
 *   <EtTicker.Gradient>
 *     <EtTicker.Marquee withGesture>
 *       <EtTicker.Content items={data} />
 *     </EtTicker.Marquee>
 *   </EtTicker.Gradient>
 * </EtTicker>
 * ```
 */
function EtTickerRoot({ items, children, style, testID, accessibilityLabel, accessibilityHint, speed, gradient, onItemPress }: EtTickerProps) {
  const config = useTickerConfig({ items, speed, gradient, onItemPress });
  const { fontScale } = useWindowDimensions();
  const tickerHeight = getEtTickerHeight(fontScale);

  if (!children && (!items || items.length === 0)) {
    return null;
  }

  // Simple mode renders passive text rows and reads correctly as a single "text" region. Compound
  // mode is opt-in composition — consumers typically pack Pressable cards (`accessibilityRole="button"`)
  // as children, and on Android a `text`-role parent flattens those children into one announced blob
  // and can suppress their individual activation, so we omit the role on the strip and let each
  // card advertise itself.
  const rootAccessibilityRole = children ? undefined : ('text' as const);

  return (
    <TickerContext.Provider value={config.contextValue}>
      <View
        style={[styles.container, { height: tickerHeight }, style]}
        accessibilityLabel={accessibilityLabel ?? config.defaultAccessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={rootAccessibilityRole}
        testID={testID}
      >
        {children ?? renderSimpleContent(config, items as EtTickerProps['items'] & {})}
      </View>
    </TickerContext.Provider>
  );
}

EtTickerRoot.displayName = 'EtTicker';

/**
 * EtTicker with compound subcomponents attached.
 */
export const EtTicker = Object.assign(EtTickerRoot, {
  Item: TickerItem,
  Content: TickerContent,
  FilterIcon: TickerFilterIcon,
  Gradient: TickerGradient,
  Marquee,
  Start: TickerStart,
  End: TickerEnd,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  marqueeContainer: {
    flex: 1,
    height: '100%',
    minWidth: 0,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
