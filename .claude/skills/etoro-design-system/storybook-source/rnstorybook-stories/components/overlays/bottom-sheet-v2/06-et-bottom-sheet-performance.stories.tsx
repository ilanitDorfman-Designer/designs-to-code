import { BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EtBottomSheetV2 as EtBottomSheet, EtButton, EtText, EtoroIcon } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// ============================================================================
// Meta Configuration
// ============================================================================

const meta = {
  title: 'eToro-UI/Components/Overlays/EtBottomSheet-v2/6. Performance',
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<object>;

export default meta;

type Story = StoryObj<typeof meta>;

// ============================================================================
// SECTION INTRO
// ============================================================================

/**
 * Performance Introduction
 *
 * Key performance considerations for bottom sheets.
 */
export const Introduction: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <EtText variant="heading-compact" style={{ marginBottom: 8 }}>
          Performance Guide
        </EtText>
        <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 24 }}>
          Optimize your bottom sheets for smooth 60fps interactions.
        </EtText>

        {/* Key Metrics */}
        <View
          style={{
            padding: 16,
            backgroundColor: colors.bgNeutralQuaternary,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <EtText variant="body-base-semibold" style={{ marginBottom: 12 }}>
            Key Performance Metrics
          </EtText>
          <View style={{ gap: 8 }}>
            {[
              {
                metric: 'Frame Rate',
                target: '60 fps',
                desc: 'Smooth gestures',
              },
              {
                metric: 'Time to Interactive',
                target: '<100ms',
                desc: 'Sheet opens',
              },
              {
                metric: 'Layout Shifts',
                target: '0',
                desc: 'No content jumping',
              },
            ].map((item) => (
              <View key={item.metric} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 60,
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    backgroundColor: colors.bgPositiveSubtle,
                    borderRadius: 4,
                    alignItems: 'center',
                  }}
                >
                  <EtText variant="body-secondary-semibold" style={{ color: colors.textActionPositive, fontSize: 11 }}>
                    {item.target}
                  </EtText>
                </View>
                <View style={{ flex: 1 }}>
                  <EtText variant="body-base-regular">{item.metric}</EtText>
                  <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                    {item.desc}
                  </EtText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Common Issues */}
        <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textSecondaryNeutral }}>
          COMMON PERFORMANCE ISSUES
        </EtText>
        <View style={{ gap: 8, marginBottom: 16 }}>
          {[
            {
              issue: 'Layout thrashing',
              cause: 'Dynamic sizing with changing content',
              fix: 'Use snapPoints for fixed height',
            },
            {
              issue: 'Slow scrolling',
              cause: 'Non-virtualized lists with 50+ items',
              fix: 'Use List/FlashList components',
            },
            {
              issue: 'Keyboard issues',
              cause: 'Using regular TextInput',
              fix: 'Use BottomSheetTextInput',
            },
            {
              issue: 'Gesture conflicts',
              cause: 'Nested scrollable content',
              fix: 'Use Content scrollable or List',
            },
          ].map((item) => (
            <View
              key={item.issue}
              style={{
                padding: 12,
                backgroundColor: colors.bgNeutralQuaternary,
                borderRadius: 8,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <EtText variant="body-base-semibold" style={{ color: colors.textActionNegative }}>
                  {item.issue}
                </EtText>
              </View>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                Cause: {item.cause}
              </EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textActionPositive, marginTop: 2 }}>
                Fix: {item.fix}
              </EtText>
            </View>
          ))}
        </View>

        {/* Stories in this section */}
        <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textSecondaryNeutral }}>
          DEMONSTRATIONS IN THIS SECTION
        </EtText>
        <View style={{ gap: 8 }}>
          {[
            { name: 'Dynamic vs Fixed Sizing', desc: 'Prevent layout shifts' },
            { name: 'List Virtualization', desc: 'Handle large datasets' },
            { name: 'Keyboard Handling', desc: 'Proper input components' },
            { name: 'Reduced Motion', desc: 'Accessibility optimization' },
          ].map((item) => (
            <View
              key={item.name}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.dividerPrimary,
              }}
            >
              <EtText variant="body-base-regular">{item.name}</EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                {item.desc}
              </EtText>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  },
};

// ============================================================================
// DYNAMIC VS FIXED SIZING
// ============================================================================

/**
 * Dynamic vs Fixed Sizing
 *
 * Demonstrates why snapPoints should be used when content changes.
 */
export const DynamicVsFixedSizing: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const dynamicSheetRef = useRef<BottomSheetModal>(null);
    const fixedSheetRef = useRef<BottomSheetModal>(null);
    const [itemCount, setItemCount] = useState(3);

    const items = Array.from({ length: itemCount }, (_, i) => ({
      id: `item-${i}`,
      title: `Item ${i + 1}`,
      subtitle: `Description for item ${i + 1}`,
    }));

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Explanation */}
            <View
              style={{
                padding: 16,
                backgroundColor: colors.bgWarningSubtle,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textWarning }}>
                The Problem
              </EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                When content changes (filtering, loading more), dynamic sizing causes the sheet to resize. This creates layout shifts that feel janky
                and can cause gesture conflicts.
              </EtText>
            </View>

            {/* Buttons */}
            <View style={{ gap: 16 }}>
              <View style={{ alignItems: 'center' }}>
                <EtButton variant="negative-subtle" onPress={() => dynamicSheetRef.current?.present()}>
                  Open Dynamic Sheet (Bad)
                </EtButton>
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    marginTop: 8,
                    color: colors.textSecondaryNeutral,
                    textAlign: 'center',
                  }}
                >
                  Resizes when items change - causes layout shifts
                </EtText>
              </View>

              <View style={{ alignItems: 'center' }}>
                <EtButton variant="primary-subtle" onPress={() => fixedSheetRef.current?.present()}>
                  Open Fixed Sheet (Good)
                </EtButton>
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    marginTop: 8,
                    color: colors.textSecondaryNeutral,
                    textAlign: 'center',
                  }}
                >
                  Uses snapPoints - stable height
                </EtText>
              </View>
            </View>

            {/* Code comparison */}
            <View style={{ marginTop: 24 }}>
              <EtText variant="body-base-semibold" style={{ marginBottom: 8 }}>
                Code Comparison
              </EtText>
              <View
                style={{
                  padding: 12,
                  backgroundColor: colors.bgNeutralQuaternary,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    fontFamily: 'Courier',
                    color: colors.textActionNegative,
                  }}
                >
                  {`// Bad: Dynamic sizing with changing content
<EtBottomSheet bottomSheetRef={ref}>
  <EtBottomSheet.Content scrollable>
    {filteredItems.map(...)}
  </EtBottomSheet.Content>
</EtBottomSheet>`}
                </EtText>
              </View>
              <View
                style={{
                  padding: 12,
                  backgroundColor: colors.bgNeutralQuaternary,
                  borderRadius: 8,
                }}
              >
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    fontFamily: 'Courier',
                    color: colors.textActionPositive,
                  }}
                >
                  {`// Good: Fixed snapPoints
<EtBottomSheet
  bottomSheetRef={ref}
  snapPoints={['50%']}
>
  <EtBottomSheet.Content scrollable>
    {filteredItems.map(...)}
  </EtBottomSheet.Content>
</EtBottomSheet>`}
                </EtText>
              </View>
            </View>
          </ScrollView>

          {/* Dynamic Sheet (Bad) */}
          <EtBottomSheet bottomSheetRef={dynamicSheetRef} onClose={() => dynamicSheetRef.current?.dismiss()}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>Dynamic Sizing</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  Watch the sheet resize
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={() => dynamicSheetRef.current?.dismiss()} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ padding: 16, gap: 12 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 12,
                  }}
                >
                  <Pressable
                    onPress={() => setItemCount(Math.max(1, itemCount - 1))}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: colors.bgNeutralTertiary,
                      borderRadius: 8,
                    }}
                  >
                    <EtText variant="body-base-semibold">- Remove</EtText>
                  </Pressable>
                  <Pressable
                    onPress={() => setItemCount(itemCount + 1)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: colors.bgNeutralTertiary,
                      borderRadius: 8,
                    }}
                  >
                    <EtText variant="body-base-semibold">+ Add</EtText>
                  </Pressable>
                </View>
                {items.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      padding: 16,
                      backgroundColor: colors.bgNeutralQuaternary,
                      borderRadius: 8,
                    }}
                  >
                    <EtText variant="body-base-semibold">{item.title}</EtText>
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      {item.subtitle}
                    </EtText>
                  </View>
                ))}
              </View>
            </EtBottomSheet.Content>
          </EtBottomSheet>

          {/* Fixed Sheet (Good) */}
          <EtBottomSheet bottomSheetRef={fixedSheetRef} snapPoints={['50%']} onClose={() => fixedSheetRef.current?.dismiss()}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>Fixed Sizing</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  Height stays constant
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={() => fixedSheetRef.current?.dismiss()} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content scrollable>
              <View style={{ padding: 16, gap: 12 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 12,
                  }}
                >
                  <Pressable
                    onPress={() => setItemCount(Math.max(1, itemCount - 1))}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: colors.bgNeutralTertiary,
                      borderRadius: 8,
                    }}
                  >
                    <EtText variant="body-base-semibold">- Remove</EtText>
                  </Pressable>
                  <Pressable
                    onPress={() => setItemCount(itemCount + 1)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: colors.bgNeutralTertiary,
                      borderRadius: 8,
                    }}
                  >
                    <EtText variant="body-base-semibold">+ Add</EtText>
                  </Pressable>
                </View>
                {items.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      padding: 16,
                      backgroundColor: colors.bgNeutralQuaternary,
                      borderRadius: 8,
                    }}
                  >
                    <EtText variant="body-base-semibold">{item.title}</EtText>
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      {item.subtitle}
                    </EtText>
                  </View>
                ))}
              </View>
            </EtBottomSheet.Content>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// LIST VIRTUALIZATION
// ============================================================================

/**
 * List Virtualization Comparison
 *
 * Demonstrates the performance difference between virtualized and non-virtualized lists.
 */
export const ListVirtualization: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const nonVirtualizedRef = useRef<BottomSheetModal>(null);
    const virtualizedRef = useRef<BottomSheetModal>(null);
    const flashListRef = useRef<BottomSheetModal>(null);

    // Generate 500 items - React 19 auto-memoizes this
    const items = Array.from({ length: 500 }, (_, i) => ({
      id: `stock-${i}`,
      ticker: ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'META', 'NVDA', 'MSFT'][i % 7],
      name: ['Apple Inc.', 'Tesla Inc.', 'Alphabet Inc.', 'Amazon.com', 'Meta Platforms', 'NVIDIA Corp.', 'Microsoft Corp.'][i % 7],
      price: (100 + Math.random() * 900).toFixed(2),
      change: (Math.random() * 10 - 5).toFixed(2),
    }));

    // React 19 auto-memoizes renderItem - no useCallback needed
    const renderItem = ({ item }: { item: (typeof items)[0] }) => (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.dividerPrimary,
        }}
      >
        <View>
          <EtText variant="body-base-semibold">{item.ticker}</EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
            {item.name}
          </EtText>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <EtText variant="body-base-semibold">${item.price}</EtText>
          <EtText
            variant="body-secondary-regular"
            style={{
              color: parseFloat(item.change) >= 0 ? colors.textActionPositive : colors.textActionNegative,
            }}
          >
            {parseFloat(item.change) >= 0 ? '+' : ''}
            {item.change}%
          </EtText>
        </View>
      </View>
    );

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Explanation */}
            <View
              style={{
                padding: 16,
                backgroundColor: colors.bgInfoSubtle,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textActionBrand }}>
                Why Virtualization Matters
              </EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                Non-virtualized lists render ALL items at once. With 500 items, this means 500 View components in memory. Virtualized lists only
                render visible items (~10-15), recycling them as you scroll.
              </EtText>
            </View>

            {/* Comparison table */}
            <View
              style={{
                padding: 16,
                backgroundColor: colors.bgNeutralQuaternary,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <EtText variant="body-base-semibold" style={{ marginBottom: 12 }}>
                500 Items Comparison
              </EtText>
              <View style={{ gap: 8 }}>
                {[
                  {
                    type: 'ScrollView',
                    rendered: '500',
                    memory: 'High',
                    fps: '15-30',
                    rating: 'bad',
                  },
                  {
                    type: 'FlatList',
                    rendered: '~15',
                    memory: 'Low',
                    fps: '55-60',
                    rating: 'good',
                  },
                  {
                    type: 'FlashList',
                    rendered: '~15',
                    memory: 'Lowest',
                    fps: '60',
                    rating: 'best',
                  },
                ].map((row) => (
                  <View
                    key={row.type}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.dividerPrimary,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <EtText variant="body-base-semibold">{row.type}</EtText>
                    </View>
                    <View style={{ width: 50, alignItems: 'center' }}>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        {row.rendered}
                      </EtText>
                    </View>
                    <View style={{ width: 60, alignItems: 'center' }}>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        {row.memory}
                      </EtText>
                    </View>
                    <View style={{ width: 50, alignItems: 'center' }}>
                      <EtText
                        variant="body-secondary-regular"
                        style={{
                          color:
                            row.rating === 'best'
                              ? colors.textActionPositive
                              : row.rating === 'good'
                                ? colors.textActionBrand
                                : colors.textActionNegative,
                        }}
                      >
                        {row.fps}
                      </EtText>
                    </View>
                  </View>
                ))}
                <View
                  style={{
                    flexDirection: 'row',
                    paddingTop: 4,
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <EtText
                    variant="body-secondary-regular"
                    style={{
                      width: 50,
                      textAlign: 'center',
                      color: colors.textSecondaryNeutral,
                      fontSize: 10,
                    }}
                  >
                    Items
                  </EtText>
                  <EtText
                    variant="body-secondary-regular"
                    style={{
                      width: 60,
                      textAlign: 'center',
                      color: colors.textSecondaryNeutral,
                      fontSize: 10,
                    }}
                  >
                    Memory
                  </EtText>
                  <EtText
                    variant="body-secondary-regular"
                    style={{
                      width: 50,
                      textAlign: 'center',
                      color: colors.textSecondaryNeutral,
                      fontSize: 10,
                    }}
                  >
                    FPS
                  </EtText>
                </View>
              </View>
            </View>

            {/* Buttons */}
            <View style={{ gap: 16 }}>
              <View style={{ alignItems: 'center' }}>
                <EtButton variant="negative-subtle" onPress={() => nonVirtualizedRef.current?.present()}>
                  ScrollView (500 items)
                </EtButton>
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    marginTop: 8,
                    color: colors.textSecondaryNeutral,
                    textAlign: 'center',
                  }}
                >
                  Warning: May be slow to open
                </EtText>
              </View>

              <View style={{ alignItems: 'center' }}>
                <EtButton variant="primary-subtle" onPress={() => virtualizedRef.current?.present()}>
                  FlatList (500 items)
                </EtButton>
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    marginTop: 8,
                    color: colors.textSecondaryNeutral,
                    textAlign: 'center',
                  }}
                >
                  Good performance
                </EtText>
              </View>

              <View style={{ alignItems: 'center' }}>
                <EtButton variant="primary-subtle" onPress={() => flashListRef.current?.present()}>
                  FlashList (500 items)
                </EtButton>
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    marginTop: 8,
                    color: colors.textSecondaryNeutral,
                    textAlign: 'center',
                  }}
                >
                  Best performance - cell recycling
                </EtText>
              </View>
            </View>
          </ScrollView>

          {/* Non-virtualized (ScrollView) */}
          <EtBottomSheet bottomSheetRef={nonVirtualizedRef} snapPoints={['70%']} onClose={() => nonVirtualizedRef.current?.dismiss()}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>ScrollView (Bad)</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  500 items rendered at once
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={() => nonVirtualizedRef.current?.dismiss()} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content scrollable>
              {items.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.dividerPrimary,
                  }}
                >
                  <View>
                    <EtText variant="body-base-semibold">{item.ticker}</EtText>
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      {item.name}
                    </EtText>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <EtText variant="body-base-semibold">${item.price}</EtText>
                    <EtText
                      variant="body-secondary-regular"
                      style={{
                        color: parseFloat(item.change) >= 0 ? colors.textActionPositive : colors.textActionNegative,
                      }}
                    >
                      {parseFloat(item.change) >= 0 ? '+' : ''}
                      {item.change}%
                    </EtText>
                  </View>
                </View>
              ))}
            </EtBottomSheet.Content>
          </EtBottomSheet>

          {/* Virtualized (FlatList) */}
          <EtBottomSheet bottomSheetRef={virtualizedRef} snapPoints={['70%']} onClose={() => virtualizedRef.current?.dismiss()}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>FlatList (Good)</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  Only visible items rendered
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={() => virtualizedRef.current?.dismiss()} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.List data={items} renderItem={renderItem} keyExtractor={(item) => item.id} />
          </EtBottomSheet>

          {/* FlashList */}
          <EtBottomSheet bottomSheetRef={flashListRef} snapPoints={['70%']} onClose={() => flashListRef.current?.dismiss()}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>FlashList (Best)</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  Cell recycling for max performance
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={() => flashListRef.current?.dismiss()} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.FlashList
              data={items}
              renderItem={renderItem}
              // keyExtractor is REQUIRED in FlashList v2 to prevent glitches
              keyExtractor={(item) => item.id}
            />
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// KEYBOARD HANDLING
// ============================================================================

/**
 * Keyboard Handling
 *
 * Proper input handling inside bottom sheets.
 */
export const KeyboardHandling: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const sheetRef = useRef<BottomSheetModal>(null);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 40 }}>
            <EtText variant="heading-compact" style={{ marginBottom: 8 }}>
              Keyboard Handling
            </EtText>
            <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 24 }}>
              Proper text input handling inside bottom sheets requires special components from @gorhom/bottom-sheet.
            </EtText>

            {/* Critical rule */}
            <View
              style={{
                padding: 16,
                backgroundColor: colors.bgNegativeSubtle,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textActionNegative }}>
                Never use regular TextInput!
              </EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                Regular React Native TextInput will not work correctly inside bottom sheets. The keyboard will dismiss immediately or cause gesture
                conflicts.
              </EtText>
            </View>

            {/* Solution */}
            <View
              style={{
                padding: 16,
                backgroundColor: colors.bgPositiveSubtle,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textActionPositive }}>
                Use BottomSheetTextInput
              </EtText>
              <View
                style={{
                  padding: 12,
                  backgroundColor: colors.bgNeutralQuaternary,
                  borderRadius: 8,
                }}
              >
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    fontFamily: 'Courier',
                    color: colors.textPrimaryNeutral,
                  }}
                >
                  {`import { BottomSheetTextInput }
  from '@gorhom/bottom-sheet';

<BottomSheetTextInput
  placeholder="Enter email..."
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>`}
                </EtText>
              </View>
            </View>

            {/* Footer behavior */}
            <View
              style={{
                padding: 16,
                backgroundColor: colors.bgInfoSubtle,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textActionBrand }}>
                Footer stays above keyboard
              </EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                EtBottomSheet.Footer automatically adjusts its position when the keyboard appears, keeping action buttons accessible. This is handled
                by the useEtBottomSheetFooter hook internally.
              </EtText>
            </View>

            <View style={{ alignItems: 'center' }}>
              <EtButton variant="primary-filled" onPress={() => sheetRef.current?.present()}>
                Open Form Sheet
              </EtButton>
              <EtText
                variant="body-secondary-regular"
                style={{
                  marginTop: 8,
                  color: colors.textSecondaryNeutral,
                  textAlign: 'center',
                }}
              >
                Tap inputs to see keyboard handling
              </EtText>
            </View>
          </ScrollView>

          <EtBottomSheet bottomSheetRef={sheetRef} onClose={() => sheetRef.current?.dismiss()}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>Contact Form</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  Keyboard-aware inputs
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={() => sheetRef.current?.dismiss()} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ padding: 16, gap: 16 }}>
                <View>
                  <EtText
                    variant="body-secondary-semibold"
                    style={{
                      marginBottom: 8,
                      color: colors.textSecondaryNeutral,
                    }}
                  >
                    EMAIL
                  </EtText>
                  <View
                    style={{
                      backgroundColor: colors.bgNeutralQuaternary,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                    }}
                  >
                    <BottomSheetTextInput
                      placeholder="your@email.com"
                      placeholderTextColor={colors.textSecondaryNeutral}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={{
                        fontSize: 16,
                        color: colors.textPrimaryNeutral,
                      }}
                    />
                  </View>
                </View>

                <View>
                  <EtText
                    variant="body-secondary-semibold"
                    style={{
                      marginBottom: 8,
                      color: colors.textSecondaryNeutral,
                    }}
                  >
                    MESSAGE
                  </EtText>
                  <View
                    style={{
                      backgroundColor: colors.bgNeutralQuaternary,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                    }}
                  >
                    <BottomSheetTextInput
                      placeholder="Type your message..."
                      placeholderTextColor={colors.textSecondaryNeutral}
                      value={message}
                      onChangeText={setMessage}
                      multiline
                      numberOfLines={4}
                      style={{
                        fontSize: 16,
                        color: colors.textPrimaryNeutral,
                        minHeight: 100,
                        textAlignVertical: 'top',
                      }}
                    />
                  </View>
                </View>
              </View>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <EtButton variant="primary-filled" onPress={() => sheetRef.current?.dismiss()} style={{ width: '100%' }}>
                Send Message
              </EtButton>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// REDUCED MOTION
// ============================================================================

/**
 * Reduced Motion Support
 *
 * Demonstrates accessibility-aware animation handling.
 */
export const ReducedMotion: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const sheetRef = useRef<BottomSheetModal>(null);

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 40 }}>
            <EtText variant="heading-compact" style={{ marginBottom: 8 }}>
              Reduced Motion
            </EtText>
            <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 24 }}>
              EtBottomSheet automatically respects the system's reduced motion preference for accessibility.
            </EtText>

            {/* How it works */}
            <View
              style={{
                padding: 16,
                backgroundColor: colors.bgInfoSubtle,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textActionBrand }}>
                How It Works
              </EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                {`1. useReducedMotion() hook detects system preference
2. When enabled, REDUCED_MOTION_SPRING_CONFIG replaces the animationPreset spring
3. Sheet animates faster with no bounce
4. Gesture-based dragging still works`}
              </EtText>
            </View>

            {/* Implementation */}
            <View
              style={{
                padding: 16,
                backgroundColor: colors.bgNeutralQuaternary,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <EtText variant="body-base-semibold" style={{ marginBottom: 8 }}>
                Implementation
              </EtText>
              <View
                style={{
                  padding: 12,
                  backgroundColor: colors.bgNeutralTertiary,
                  borderRadius: 8,
                }}
              >
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    fontFamily: 'Courier',
                    color: colors.textPrimaryNeutral,
                  }}
                >
                  {`// Inside EtBottomSheet
const isReducedMotion = useReducedMotion();

const animationConfigs = resolveBottomSheetAnimationConfig(
  animationPreset, // 'bouncy' | 'smooth' | 'fast'
  isReducedMotion,
);

<BottomSheetModal
  animationConfigs={animationConfigs}
  ...
/>`}
                </EtText>
              </View>
            </View>

            {/* Testing */}
            <View
              style={{
                padding: 16,
                backgroundColor: colors.bgWarningSubtle,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textWarning }}>
                Testing Reduced Motion
              </EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                {`iOS: Settings > Accessibility > Motion > Reduce Motion
Android: Settings > Accessibility > Remove animations

Or in Simulator/Emulator accessibility settings.`}
              </EtText>
            </View>

            <View style={{ alignItems: 'center' }}>
              <EtButton variant="primary-filled" onPress={() => sheetRef.current?.present()}>
                Open Sheet
              </EtButton>
              <EtText
                variant="body-secondary-regular"
                style={{
                  marginTop: 8,
                  color: colors.textSecondaryNeutral,
                  textAlign: 'center',
                }}
              >
                Enable Reduce Motion in system settings to see faster open/close with no bounce
              </EtText>
            </View>
          </ScrollView>

          <EtBottomSheet bottomSheetRef={sheetRef} onClose={() => sheetRef.current?.dismiss()}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>Reduced Motion Demo</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  Animation respects system preference
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={() => sheetRef.current?.dismiss()} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content>
              <View style={{ padding: 20, alignItems: 'center' }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: colors.bgPositiveSubtle,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <EtoroIcon icon={{ iconName: 'checkmark' }} size={40} color={colors.textActionPositive} />
                </View>
                <EtText variant="body-base-semibold" style={{ marginBottom: 8 }}>
                  Accessibility First
                </EtText>
                <EtText
                  variant="body-secondary-regular"
                  style={{
                    color: colors.textSecondaryNeutral,
                    textAlign: 'center',
                  }}
                >
                  This sheet respects your system's motion preferences automatically.
                </EtText>
              </View>
            </EtBottomSheet.Content>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
