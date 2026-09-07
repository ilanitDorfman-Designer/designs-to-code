import React, { memo, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X1, X2, X4, X6, X9 } from '../../../../core/styles/spacing';
import { EtFlatList } from '../../../list/flat-list';
import { EtFooterScrollableProps } from '../api';
import { useFooterScrollable } from '../hooks';

/**
 * Scrollable container for footer content.
 *
 * Supports two modes:
 * - `direction="vertical"` (default): Simple vertical ScrollView for tall content
 * - `direction="horizontal"`: Paginated horizontal scroll with pagination dots
 *
 * @example Vertical scrolling (tall content)
 * ```tsx
 * <EtFooter>
 *   <EtFooter.Scrollable>
 *     <EtFooter.Section>
 *       <EtText>Long scrollable content...</EtText>
 *     </EtFooter.Section>
 *   </EtFooter.Scrollable>
 * </EtFooter>
 * ```
 *
 * @example Horizontal paginated scrolling
 * ```tsx
 * <EtFooter contentStyle={{ padding: 0 }}>
 *   <EtFooter.Scrollable direction="horizontal">
 *     <EtFooter.Section><EtText>Page 1</EtText></EtFooter.Section>
 *     <EtFooter.Section><EtText>Page 2</EtText></EtFooter.Section>
 *   </EtFooter.Scrollable>
 * </EtFooter>
 * ```
 */
export const FooterScrollable = memo<EtFooterScrollableProps>(({ children, style, contentStyle, direction = 'vertical', ...rest }) => {
  const { colors } = useEtoroTheme();

  // Vertical mode: simple ScrollView
  if (direction === 'vertical') {
    return (
      <View {...rest} style={[styles.verticalContainer, style]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.verticalContent, contentStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    );
  }

  // Horizontal mode: paginated EtFlatList with dots
  return (
    <HorizontalScrollable style={style} colors={colors} {...rest}>
      {children}
    </HorizontalScrollable>
  );
});

FooterScrollable.displayName = 'EtFooter.Scrollable';

/**
 * Internal component for horizontal paginated scrolling
 */
const HorizontalScrollable = memo<{
  children: React.ReactNode;
  style?: EtFooterScrollableProps['style'];
  colors: ReturnType<typeof useEtoroTheme>['colors'];
  testID?: string;
}>(({ children, style, colors, ...rest }) => {
  const { activeIndex, containerWidth, contentItems, handleScroll, handleLayout, getItemLayout, hasMultipleItems, isReady } =
    useFooterScrollable(children);

  const renderItem = useCallback(
    ({ item }: { item: React.ReactElement }) => <View style={[styles.pageWrapper, { width: containerWidth }]}>{item}</View>,
    [containerWidth],
  );

  // Render empty container first to measure width
  if (!isReady) {
    return <View {...rest} style={[styles.container, style]} onLayout={handleLayout} />;
  }

  return (
    <View {...rest} style={[styles.container, style]} onLayout={handleLayout}>
      <EtFlatList
        data={contentItems}
        renderItem={renderItem}
        keyExtractor={(_, index) => `page-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        decelerationRate="fast"
        snapToInterval={containerWidth}
        snapToAlignment="start"
      />

      {hasMultipleItems && (
        <View style={styles.pagination} accessibilityRole="tablist" accessibilityLabel="Page indicators">
          {contentItems.map((_, index) => (
            <View
              key={index}
              accessibilityRole="tab"
              accessibilityState={{ selected: index === activeIndex }}
              accessibilityLabel={`Page ${index + 1} of ${contentItems.length}`}
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
                {
                  backgroundColor: index === activeIndex ? colors.verdictPositive600 : colors.carbon400,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
});

HorizontalScrollable.displayName = 'EtFooter.Scrollable.Horizontal';

const styles = StyleSheet.create({
  // Vertical mode styles
  verticalContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  verticalContent: {
    paddingHorizontal: X9,
    paddingVertical: X6,
    gap: X4,
  },
  // Horizontal mode styles
  container: {
    width: '100%',
  },
  pageWrapper: {
    paddingHorizontal: X9,
    paddingVertical: X6,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: X2,
    paddingVertical: X4,
  },
  dot: {
    width: X2,
    height: X2,
    borderRadius: X1,
  },
  dotActive: {
    width: X4,
    borderRadius: X1,
  },
});
