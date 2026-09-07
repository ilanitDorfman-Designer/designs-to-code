import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
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
  title: 'eToro-UI/Components/Overlays/EtBottomSheet-v2/3. Lists',
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
 * List Components Introduction
 *
 * Virtualized list patterns for scrollable bottom sheet content.
 */
export const Introduction: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <EtText variant="heading-compact" style={{ marginBottom: 8 }}>
          List Components
        </EtText>
        <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 24 }}>
          Virtualized lists for performant scrolling with large datasets inside bottom sheets.
        </EtText>

        {/* When to use */}
        <View
          style={{
            padding: 16,
            backgroundColor: colors.bgWarningSubtle,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textWarning }}>
            When should I use List vs Content?
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
            {`Use EtBottomSheet.Content with scrollable={true} for:
• Small lists (under 20-30 items)
• Mixed content (text + buttons + lists)
• Simple scrollable forms

Use EtBottomSheet.List/FlashList/SectionList for:
• Large datasets (50+ items)
• Homogeneous item lists
• Performance-critical screens`}
          </EtText>
        </View>

        {/* Important note */}
        <View
          style={{
            padding: 16,
            backgroundColor: colors.bgNegativeSubtle,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <EtText variant="body-base-semibold" style={{ marginBottom: 4, color: colors.textActionNegative }}>
            Always provide snapPoints!
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
            Virtualized lists require fixed snap points. Dynamic sizing is automatically disabled when using List, SectionList, or FlashList (a
            warning is logged in development mode). Always provide explicit snapPoints for best results.
          </EtText>
        </View>

        {/* List types */}
        <EtText variant="body-base-semibold" style={{ marginBottom: 8, color: colors.textSecondaryNeutral }}>
          AVAILABLE LIST TYPES
        </EtText>
        <View style={{ gap: 12 }}>
          {[
            {
              name: 'EtBottomSheet.List',
              desc: 'Standard FlatList wrapper',
              when: 'Default choice for most lists',
              perf: 'Good',
            },
            {
              name: 'EtBottomSheet.FlashList',
              desc: 'Shopify FlashList wrapper',
              when: 'Very large lists (500+ items)',
              perf: 'Best',
            },
            {
              name: 'EtBottomSheet.SectionList',
              desc: 'Grouped list with headers',
              when: 'Categorized data (A-Z, by date)',
              perf: 'Good',
            },
          ].map((item) => (
            <View
              key={item.name}
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
                  alignItems: 'center',
                }}
              >
                <EtText variant="body-base-semibold">{item.name}</EtText>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    backgroundColor: item.perf === 'Best' ? colors.bgPositiveSubtle : colors.bgNeutralTertiary,
                    borderRadius: 4,
                  }}
                >
                  <EtText
                    variant="body-secondary-regular"
                    style={{
                      color: item.perf === 'Best' ? colors.textActionPositive : colors.textSecondaryNeutral,
                      fontSize: 11,
                    }}
                  >
                    {item.perf}
                  </EtText>
                </View>
              </View>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginTop: 4 }}>
                {item.desc}
              </EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginTop: 2 }}>
                Use when: {item.when}
              </EtText>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  },
};

// ============================================================================
// FLAT LIST - Basic virtualized list using BottomSheetFlatList
// ============================================================================

/**
 * EtBottomSheet.List - Virtualized FlatList for large datasets.
 *
 * Use this instead of `EtBottomSheet.Content` with `scrollable` when you have:
 * - 50+ items that benefit from virtualization
 * - Complex item components that are expensive to render
 * - Performance-critical screens
 *
 * **Important:** Always provide `snapPoints` when using virtualized lists.
 */
export const FlatList: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // Generate 500 realistic stock items
    const stockNames = ['Apple', 'Tesla', 'Amazon', 'Google', 'Microsoft', 'Meta', 'Netflix', 'Nvidia', 'AMD', 'Intel'];
    const items = Array.from({ length: 500 }, (_, i) => {
      const basePrice = Math.random() * 800 + 20;
      const changePercent = (Math.random() - 0.5) * 10;
      return {
        id: String(i + 1),
        name: `${stockNames[i % stockNames.length]} ${Math.floor(i / 10) + 1}`,
        ticker: `${stockNames[i % stockNames.length].substring(0, 3).toUpperCase()}${Math.floor(i / 10) + 1}`,
        price: basePrice.toFixed(2),
        change: changePercent.toFixed(2),
        volume: `${(Math.random() * 50 + 1).toFixed(1)}M`,
      };
    });

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Open Stock Picker (500 items)
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Virtualized FlatList - only visible items render
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['60%', '90%']} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>Select Stock</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  500 stocks available
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.List
              data={items}
              keyExtractor={(item) => item.id}
              initialNumToRender={15}
              maxToRenderPerBatch={10}
              windowSize={5}
              renderItem={({ item }) => (
                <Pressable
                  onPress={handleClose}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: colors.bgNeutralQuaternary,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: colors.bgBrandPrimary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <EtText variant="body-base-semibold" style={{ color: colors.textInverse }}>
                      {item.ticker.substring(0, 2)}
                    </EtText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <EtText variant="body-base-semibold">{item.name}</EtText>
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      {item.ticker} · Vol: {item.volume}
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
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// SECTION LIST - Grouped data with sticky headers
// ============================================================================

/**
 * EtBottomSheet.SectionList - Virtualized SectionList for grouped data.
 *
 * Use this for sectioned/grouped data with headers, such as:
 * - Alphabetically sorted contacts
 * - Categorized settings
 * - Grouped search results
 *
 * Features:
 * - Full virtualization via BottomSheetSectionList
 * - Section header support with sticky headers
 * - Consistent padding matching other subcomponents
 */
export const SectionList: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // Generate alphabetically grouped contacts
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah', 'Ivan', 'Julia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    const sections = alphabet.slice(0, 10).map((letter, sectionIndex) => ({
      title: letter,
      data: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => ({
        id: `${letter}-${i}`,
        name: `${firstNames[(sectionIndex + i) % firstNames.length]} ${lastNames[(sectionIndex * 2 + i) % lastNames.length]}`,
        email: `${firstNames[(sectionIndex + i) % firstNames.length].toLowerCase()}@email.com`,
        avatar: firstNames[(sectionIndex + i) % firstNames.length].substring(0, 2),
      })),
    }));

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Open Contacts
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Grouped with sticky section headers
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['70%', '95%']} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>Contacts</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  {`${sections.reduce((acc, s) => acc + s.data.length, 0)} people`}
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              stickySectionHeadersEnabled
              renderSectionHeader={({ section }) => (
                <View
                  style={{
                    backgroundColor: colors.bgNeutralTertiary,
                    paddingVertical: 8,
                    paddingHorizontal: 20,
                    marginHorizontal: -20,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.dividerPrimary,
                  }}
                >
                  <EtText variant="body-base-semibold" style={{ color: colors.textBrandPrimary }}>
                    {section.title}
                  </EtText>
                </View>
              )}
              renderItem={({ item }) => (
                <Pressable
                  onPress={handleClose}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: colors.bgNeutralQuaternary,
                    marginTop: 8,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.bgBrandSecondary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <EtText variant="body-base-semibold" style={{ color: colors.textBrandPrimary }}>
                      {item.avatar}
                    </EtText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <EtText variant="body-base-semibold">{item.name}</EtText>
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      {item.email}
                    </EtText>
                  </View>
                  <EtoroIcon
                    icon={{ iconName: 'chevronRight' }}
                    appearance={{
                      size: 20,
                      color: colors.textSecondaryNeutral,
                    }}
                  />
                </Pressable>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// FLASH LIST - High-performance list with cell recycling
// ============================================================================

/**
 * EtBottomSheet.FlashList - High-performance virtualized list using @shopify/flash-list.
 *
 * Use this for the best performance with large lists (100+ items) or complex item components.
 * FlashList uses cell recycling for better memory efficiency and smoother scrolling.
 *
 * **Important (FlashList v2):**
 * - `keyExtractor` is **required** - prevents visual glitches during upward scrolling
 * - Do NOT use `key` prop inside renderItem components - breaks cell recycling
 * - Use `getItemType` for lists with different item types (headers, items, etc.)
 *
 * Features:
 * - Cell recycling for optimal performance
 * - Bottom sheet gesture integration (handled internally)
 * - Consistent padding matching other subcomponents
 * - Automatic size estimation (no need for `estimatedItemSize`)
 */
export const FlashList: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // Generate 1000 items to demonstrate FlashList performance
    const items = Array.from({ length: 1000 }, (_, i) => {
      const categories = ['Stocks', 'ETFs', 'Crypto', 'Commodities', 'Forex'];
      const basePrice = Math.random() * 1000 + 10;
      const changePercent = (Math.random() - 0.5) * 15;
      return {
        id: String(i + 1),
        name: `Asset ${i + 1}`,
        category: categories[i % categories.length],
        price: basePrice.toFixed(2),
        change: changePercent.toFixed(2),
      };
    });

    const handleOpen = () => bottomSheetRef.current?.present();
    const handleClose = () => bottomSheetRef.current?.dismiss();

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Open Asset Picker (1000 items)
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              FlashList with cell recycling - maximum performance
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['60%', '90%']} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>Select Asset</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  1000 assets available
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.FlashList
              data={items}
              // keyExtractor is REQUIRED in FlashList v2 to prevent glitches
              keyExtractor={(item) => item.id}
              // Platform-specific draw distance defaults: 1700px (Android) / 1200px (iOS)
              renderItem={({ item }) => (
                <Pressable
                  onPress={handleClose}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: colors.bgNeutralQuaternary,
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.bgBrandPrimary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <EtText variant="body-secondary-semibold" style={{ color: colors.textInverse }}>
                      {item.category.substring(0, 2)}
                    </EtText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <EtText variant="body-base-semibold">{item.name}</EtText>
                    <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      {item.category}
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
                </Pressable>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

// ============================================================================
// PATTERNS - Common list patterns
// ============================================================================

/**
 * List with selection and sticky footer.
 * Common pattern for selection sheets with confirm action.
 */
export const ListWithSelection: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const currencies = [
      { id: '1', code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
      { id: '2', code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
      { id: '3', code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
      { id: '4', code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
      {
        id: '5',
        code: 'AUD',
        name: 'Australian Dollar',
        symbol: 'A$',
        flag: '🇦🇺',
      },
      {
        id: '6',
        code: 'CAD',
        name: 'Canadian Dollar',
        symbol: 'C$',
        flag: '🇨🇦',
      },
      { id: '7', code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
      { id: '8', code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
      { id: '9', code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
      {
        id: '10',
        code: 'KRW',
        name: 'South Korean Won',
        symbol: '₩',
        flag: '🇰🇷',
      },
      {
        id: '11',
        code: 'SGD',
        name: 'Singapore Dollar',
        symbol: 'S$',
        flag: '🇸🇬',
      },
      {
        id: '12',
        code: 'HKD',
        name: 'Hong Kong Dollar',
        symbol: 'HK$',
        flag: '🇭🇰',
      },
      {
        id: '13',
        code: 'NZD',
        name: 'New Zealand Dollar',
        symbol: 'NZ$',
        flag: '🇳🇿',
      },
      {
        id: '14',
        code: 'SEK',
        name: 'Swedish Krona',
        symbol: 'kr',
        flag: '🇸🇪',
      },
      { id: '15', code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
    ];

    const handleOpen = () => {
      setSelectedId(null);
      bottomSheetRef.current?.present();
    };
    const handleClose = () => bottomSheetRef.current?.dismiss();
    const handleConfirm = () => {
      handleClose();
    };

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Select Currency
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              List with selection + sticky footer
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['65%']} onClose={handleClose}>
            <EtBottomSheet.Header>
              <View style={{ alignItems: 'center' }}>
                <EtBottomSheet.Header.Title>Select Currency</EtBottomSheet.Header.Title>
                <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginTop: 2, color: colors.textSecondaryNeutral }}>
                  Choose your preferred currency
                </EtText>
              </View>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.List
              data={currencies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedId === item.id;
                return (
                  <Pressable
                    onPress={() => setSelectedId(item.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor: isSelected ? colors.bgBrandSecondary : colors.bgNeutralQuaternary,
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: colors.borderBrandPrimary,
                    }}
                  >
                    <EtText variant="heading-large" style={{ marginRight: 12, fontSize: 28 }}>
                      {item.flag}
                    </EtText>
                    <View style={{ flex: 1 }}>
                      <EtText variant="body-base-semibold">{item.name}</EtText>
                      <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                        {item.code} ({item.symbol})
                      </EtText>
                    </View>
                    {isSelected && (
                      <EtoroIcon
                        icon={{ iconName: 'checkLine' }}
                        appearance={{
                          size: 24,
                          color: colors.textBrandPrimary,
                        }}
                      />
                    )}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
            <EtBottomSheet.Footer>
              <EtButton variant="primary-filled" onPress={handleConfirm} disabled={!selectedId} style={{ width: '100%' }}>
                {selectedId ? `Confirm ${currencies.find((c) => c.id === selectedId)?.code}` : 'Select a currency'}
              </EtButton>
            </EtBottomSheet.Footer>
          </EtBottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  },
};

/**
 * List with loading state integration.
 * Shows how loading state affects virtualized lists.
 */
export const ListWithLoading: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    }, []);

    const items = Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      name: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
    }));

    const handleOpen = () => {
      setIsLoading(true);
      bottomSheetRef.current?.present();
      // Simulate loading
      loadingTimeoutRef.current = setTimeout(() => setIsLoading(false), 2000);
    };

    const handleClose = () => bottomSheetRef.current?.dismiss();

    const LoadingPlaceholder = () => (
      <View style={{ alignItems: 'center', paddingVertical: 40, gap: 16 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.bgActionBrand,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <EtoroIcon icon={{ iconName: 'loader' }} appearance={{ size: 32, color: colors.textInvertedPrimaryNeutral }} />
        </View>
        <EtText variant="body-base-semibold">Loading items...</EtText>
        <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, textAlign: 'center' }}>
          Please wait while we fetch your data
        </EtText>
      </View>
    );

    return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <View style={styles.content}>
            <View style={{ alignSelf: 'center' }}>
              <EtButton variant="primary-filled" onPress={handleOpen}>
                Open List with Loading
              </EtButton>
            </View>
            <EtText
              variant="body-secondary-regular"
              style={{
                marginTop: 8,
                color: colors.textSecondaryNeutral,
                textAlign: 'center',
              }}
            >
              Shows loading state for 2 seconds
            </EtText>
          </View>

          <EtBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['60%']} loading={isLoading} onClose={handleClose}>
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Select Item</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.List
              data={items}
              keyExtractor={(item) => item.id}
              loadingPlaceholder={<LoadingPlaceholder />}
              renderItem={({ item }) => (
                <Pressable
                  onPress={handleClose}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: colors.bgNeutralQuaternary,
                  }}
                >
                  <EtText variant="body-base-semibold">{item.name}</EtText>
                  <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                    {item.description}
                  </EtText>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
