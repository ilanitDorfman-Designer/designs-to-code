import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<object>;

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = (codeText: string) => {
    Clipboard.setStringAsync(codeText);
    Alert.alert('Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
  };

  return (
    <View
      style={[
        styles.codeContainer,
        {
          backgroundColor: colors.bgNeutralQuaternary,
          borderColor: colors.dividerPrimary,
        },
      ]}
    >
      {title && (
        <View style={[styles.codeHeader, { borderBottomColor: colors.dividerPrimary }]}>
          <Text style={[styles.codeTitle, { color: colors.textPrimaryNeutral }]}>{title}</Text>
          <Pressable onPress={() => handleCopy(code)} style={styles.copyButton}>
            <Text style={[styles.copyButtonText, { color: colors.textActionBrand }]}>Copy</Text>
          </Pressable>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={[styles.codeText, { color: colors.textPrimaryNeutral }]}>{code}</Text>
      </ScrollView>
    </View>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <EtText variant="heading-compact" style={styles.sectionTitle}>
      {title}
    </EtText>
    {children}
  </View>
);

const Badge: React.FC<{
  text: string;
  variant: 'recommended' | 'flexible' | 'advanced';
}> = ({ text, variant }) => {
  const { colors } = useEtoroTheme();
  const bgColors = {
    recommended: colors.bgPositiveSubtle,
    flexible: colors.bgInfoSubtle,
    advanced: colors.bgNeutralQuaternary,
  };
  const textColors = {
    recommended: colors.textActionPositive,
    flexible: colors.textActionBrand,
    advanced: colors.textSecondaryNeutral,
  };

  return (
    <View style={[styles.badge, { backgroundColor: bgColors[variant] }]}>
      <Text style={[styles.badgeText, { color: textColors[variant] }]}>{text}</Text>
    </View>
  );
};

const meta: Meta<object> = {
  title: 'eToro-UI/Components/Overlays/EtBottomSheet-v2/1. Introduction',
  parameters: {
    notes: 'Complete guide for the EtBottomSheet v2 component.',
  },
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

export const Introduction: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    const sections = [
      {
        num: '2',
        title: 'Examples',
        desc: 'Core patterns and basic usage',
        color: colors.bgPositiveSubtle,
        textColor: colors.textActionPositive,
      },
      {
        num: '3',
        title: 'Lists',
        desc: 'Virtualized list components',
        color: colors.bgInfoSubtle,
        textColor: colors.textActionBrand,
      },
      {
        num: '4',
        title: 'Headers',
        desc: 'Header configuration patterns',
        color: colors.bgWarningSubtle,
        textColor: colors.textWarning,
      },
      {
        num: '5',
        title: 'Real-World',
        desc: 'Production-ready examples',
        color: colors.bgNeutralQuaternary,
        textColor: colors.textSecondaryNeutral,
      },
      {
        num: '6',
        title: 'Performance',
        desc: 'Optimization techniques',
        color: colors.bgNegativeSubtle,
        textColor: colors.textActionNegative,
      },
    ];

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            EtBottomSheet v2
          </EtText>
          <EtText variant="body-base-regular" style={[styles.subtitle, { color: colors.textSecondaryNeutral }]}>
            Modal bottom sheet with compound component API built on @gorhom/bottom-sheet v5
          </EtText>
        </View>

        {/* Section Navigation */}
        <View style={{ marginBottom: 24 }}>
          <EtText variant="body-base-semibold" style={{ marginBottom: 12, color: colors.textSecondaryNeutral }}>
            EXPLORE SECTIONS
          </EtText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {sections.map((section) => (
              <View
                key={section.num}
                style={{
                  width: '48%',
                  padding: 12,
                  backgroundColor: section.color,
                  borderRadius: 8,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: colors.bgNeutralPrimary,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: section.textColor,
                      }}
                    >
                      {section.num}
                    </Text>
                  </View>
                  <EtText variant="body-base-semibold">{section.title}</EtText>
                </View>
                <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginTop: 4 }}>
                  {section.desc}
                </EtText>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Decision Guide */}
        <View
          style={[
            styles.featuresCard,
            {
              backgroundColor: colors.bgNeutralSecondary,
              borderColor: colors.dividerPrimary,
              marginBottom: 24,
            },
          ]}
        >
          <EtText variant="heading-compact" style={{ marginBottom: 12 }}>
            I want to...
          </EtText>
          <View style={{ gap: 12 }}>
            {[
              {
                want: 'Show a simple dialog',
                use: 'Header + Content',
                section: '2',
              },
              {
                want: 'Display a form with inputs',
                use: 'Content + Footer + BottomSheetTextInput',
                section: '2',
              },
              {
                want: 'Show a scrollable list (20-50 items)',
                use: 'Content with scrollable',
                section: '2',
              },
              {
                want: 'Show a large list (50+ items)',
                use: 'List or FlashList',
                section: '3',
              },
              {
                want: 'Add a search header',
                use: 'Header with custom middle content',
                section: '4',
              },
              {
                want: 'Use a frosted glass sheet',
                use: 'variant="glass" + snapPoints',
                section: '2',
              },
              {
                want: 'Build a trading interface',
                use: 'See Real-World examples',
                section: '5',
              },
              {
                want: 'Optimize for performance',
                use: 'See Performance guide',
                section: '6',
              },
            ].map((item) => (
              <View
                key={item.want}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    backgroundColor: colors.bgNeutralQuaternary,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '600',
                      color: colors.textSecondaryNeutral,
                    }}
                  >
                    {item.section}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <EtText variant="body-base-regular">{item.want}</EtText>
                  <EtText variant="body-secondary-regular" style={{ color: colors.textActionBrand }}>
                    {item.use}
                  </EtText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Key Features */}
        <View
          style={[
            styles.featuresCard,
            {
              backgroundColor: colors.bgNeutralSecondary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.bgPositiveSubtle }]}>
              <Text style={{ fontSize: 16 }}>📐</Text>
            </View>
            <View style={{ flex: 1 }}>
              <EtText variant="body-base-semibold">Auto-sizing</EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                Sheet height adjusts to content automatically
              </EtText>
            </View>
          </View>
          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.bgInfoSubtle }]}>
              <Text style={{ fontSize: 16 }}>🎯</Text>
            </View>
            <View style={{ flex: 1 }}>
              <EtText variant="body-base-semibold">Compound Components</EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                Header, Content, Footer - compose as needed
              </EtText>
            </View>
          </View>
          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.bgWarningSubtle }]}>
              <Text style={{ fontSize: 16 }}>⌨️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <EtText variant="body-base-semibold">Keyboard Aware</EtText>
              <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
                Sticky footer moves with keyboard
              </EtText>
            </View>
          </View>
        </View>

        {/* Architecture Diagram */}
        <View
          style={[
            styles.diagramCard,
            {
              backgroundColor: colors.bgNeutralSecondary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-compact" style={{ marginBottom: 12 }}>
            Component Structure
          </EtText>
          <View style={[styles.diagramBox, { backgroundColor: colors.bgNeutralQuaternary }]}>
            <Text style={[styles.diagramText, { color: colors.textPrimaryNeutral }]}>
              {`EtBottomSheet
├── Header (compound API — Title, Action, custom children)
├── Content (scrollable or static)
├── List (virtualized FlatList)
├── SectionList (virtualized SectionList)
├── FlashList (high-performance, cell recycling)
└── Footer (sticky, keyboard-aware)`}
            </Text>
          </View>
        </View>

        {/* Content Decision Flowchart */}
        <View
          style={[
            styles.diagramCard,
            {
              backgroundColor: colors.bgNeutralSecondary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-compact" style={{ marginBottom: 12 }}>
            Content Component Decision
          </EtText>
          <View style={[styles.diagramBox, { backgroundColor: colors.bgNeutralQuaternary }]}>
            <Text style={[styles.diagramText, { color: colors.textPrimaryNeutral }]}>
              {`How many items?
│
├─ < 20 items ──────────► Content
│                         (static, no scroll)
│
├─ 20-50 items ─────────► Content scrollable={true}
│                         (simple scroll)
│
├─ 50-100 items ────────► List or SectionList
│                         (virtualized)
│
└─ 100+ items ──────────► FlashList
                          (cell recycling, best perf)

Note: Always provide snapPoints with virtualized lists!
(Dynamic sizing is auto-disabled for lists)`}
            </Text>
          </View>
        </View>

        {/* Quick Start */}
        <Section title="Quick Start">
          <EtText variant="body-secondary-regular" style={[styles.description, { color: colors.textSecondaryNeutral }]}>
            The simplest way to create a bottom sheet:
          </EtText>
          <CodeBlock
            title="Basic Sheet"
            code={`const sheetRef = useRef<BottomSheetModal>(null);

<EtBottomSheet bottomSheetRef={sheetRef} onClose={handleClose}>
  <EtBottomSheet.Header>
    <EtBottomSheet.Header.Title>Settings</EtBottomSheet.Header.Title>
    <EtBottomSheet.Header.Action onPress={() => sheetRef.current?.dismiss()} accessibilityLabel="Close">
      <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
    </EtBottomSheet.Header.Action>
  </EtBottomSheet.Header>
  <EtBottomSheet.Content>
    <YourContent />
  </EtBottomSheet.Content>
  <EtBottomSheet.Footer>
    <EtButton variant="primary-filled" onPress={handleSave}>
      Save
    </EtButton>
  </EtBottomSheet.Footer>
</EtBottomSheet>`}
          />
        </Section>

        {/* Header Patterns */}
        <Section title="Header Patterns">
          <EtText variant="body-secondary-regular" style={[styles.description, { color: colors.textSecondaryNeutral }]}>
            Choose the right pattern based on complexity:
          </EtText>

          {/* Pattern 1: Header */}
          <View style={[styles.patternCard, { borderColor: colors.dividerPrimary }]}>
            <View style={styles.patternHeader}>
              <EtText variant="body-base-semibold">1. Header (Title + Action)</EtText>
              <Badge text="RECOMMENDED" variant="recommended" />
            </View>
            <EtText variant="body-secondary-regular" style={[styles.patternDesc, { color: colors.textSecondaryNeutral }]}>
              For 80% of cases. Compose title, subtitle, back, and close with compound subcomponents.
            </EtText>
            <CodeBlock
              code={`<EtBottomSheet.Header>
  <View style={{ alignItems: 'center' }}>
    <EtBottomSheet.Header.Title>Settings</EtBottomSheet.Header.Title>
    <EtText variant="body-secondary-regular">Step 1 of 3</EtText>
  </View>
  <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
    <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
  </EtBottomSheet.Header.Action>
</EtBottomSheet.Header>`}
            />
          </View>

          {/* Pattern 2: Custom middle / slots */}
          <View style={[styles.patternCard, { borderColor: colors.dividerPrimary }]}>
            <View style={styles.patternHeader}>
              <EtText variant="body-base-semibold">2. Header + custom content</EtText>
              <Badge text="FLEXIBLE" variant="flexible" />
            </View>
            <EtText variant="body-secondary-regular" style={[styles.patternDesc, { color: colors.textSecondaryNeutral }]}>
              For 15% of cases. Place search fields or icons as plain children in the header content area.
            </EtText>
            <CodeBlock
              code={`// Search header — icon + input as plain header children; close uses Action
<EtBottomSheet.Header>
  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
    <EtoroIcon icon={{ iconName: 'search' }} />
    <BottomSheetTextInput
      placeholder="Search..."
      value={searchText}
      onChangeText={setSearchText}
    />
  </View>
  <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
    <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
  </EtBottomSheet.Header.Action>
</EtBottomSheet.Header>`}
            />
          </View>

          {/* Pattern 3: Full compound layout */}
          <View style={[styles.patternCard, { borderColor: colors.dividerPrimary }]}>
            <View style={styles.patternHeader}>
              <EtText variant="body-base-semibold">3. Compound Header (custom layout)</EtText>
              <Badge text="ADVANCED" variant="advanced" />
            </View>
            <EtText variant="body-secondary-regular" style={[styles.patternDesc, { color: colors.textSecondaryNeutral }]}>
              For 5% of cases. Complete control with rows, multiple actions, and custom children.
            </EtText>
            <CodeBlock
              code={`<EtBottomSheet.Header>
  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
    <Pressable onPress={goBack} accessibilityLabel="Back">
      <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
    </Pressable>
    <EtBottomSheet.Header.Title>Edit Profile</EtBottomSheet.Header.Title>
  </View>
  <EtBottomSheet.Header.Action onPress={handleSave} accessibilityLabel="Save">
    <EtText>Save</EtText>
  </EtBottomSheet.Header.Action>
</EtBottomSheet.Header>`}
            />
          </View>
        </Section>

        {/* Common Patterns */}
        <Section title="Common Patterns">
          <CodeBlock
            title="Confirmation Dialog"
            code={`<EtBottomSheet
  bottomSheetRef={sheetRef}
  closeOnBackdrop={false}
  enablePanDownToClose={false}
>
  <EtBottomSheet.Header>
    <EtBottomSheet.Header.Title>Delete Account?</EtBottomSheet.Header.Title>
  </EtBottomSheet.Header>
  <EtBottomSheet.Content>
    <EtText>This action cannot be undone.</EtText>
  </EtBottomSheet.Content>
  <EtBottomSheet.Footer>
    <EtButton variant="negative-filled" onPress={handleDelete}>
      Delete
    </EtButton>
    <EtButton variant="primary-subtle" onPress={handleCancel}>
      Cancel
    </EtButton>
  </EtBottomSheet.Footer>
</EtBottomSheet>`}
          />

          <CodeBlock
            title="Scrollable List (small lists)"
            code={`<EtBottomSheet bottomSheetRef={sheetRef}>
  <EtBottomSheet.Header>
    <EtBottomSheet.Header.Title>Select Option</EtBottomSheet.Header.Title>
    <EtBottomSheet.Header.Action onPress={() => sheetRef.current?.dismiss()} accessibilityLabel="Close">
      <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
    </EtBottomSheet.Header.Action>
  </EtBottomSheet.Header>
  <EtBottomSheet.Content scrollable>
    {items.map(item => (
      <ListItem key={item.id} {...item} />
    ))}
  </EtBottomSheet.Content>
</EtBottomSheet>`}
          />

          <CodeBlock
            title="Virtualized List (50+ items)"
            code={`<EtBottomSheet bottomSheetRef={sheetRef} snapPoints={['50%', '90%']}>
  <EtBottomSheet.Header>
    <EtBottomSheet.Header.Title>Select Item</EtBottomSheet.Header.Title>
    <EtBottomSheet.Header.Action onPress={() => sheetRef.current?.dismiss()} accessibilityLabel="Close">
      <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
    </EtBottomSheet.Header.Action>
  </EtBottomSheet.Header>
  <EtBottomSheet.List
    data={items}
    renderItem={({ item }) => <ItemRow item={item} />}
    keyExtractor={(item) => item.id}
  />
</EtBottomSheet>`}
          />

          <CodeBlock
            title="FlashList (100+ items, best performance)"
            code={`<EtBottomSheet bottomSheetRef={sheetRef} snapPoints={['50%', '90%']}>
  <EtBottomSheet.Header>
    <EtBottomSheet.Header.Title>Select Asset</EtBottomSheet.Header.Title>
    <EtBottomSheet.Header.Action onPress={() => sheetRef.current?.dismiss()} accessibilityLabel="Close">
      <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
    </EtBottomSheet.Header.Action>
  </EtBottomSheet.Header>
  <EtBottomSheet.FlashList
    data={items}
    renderItem={({ item }) => <ItemRow item={item} />}
    // keyExtractor is REQUIRED in FlashList v2 to prevent glitches
    keyExtractor={(item) => item.id}
  />
</EtBottomSheet>`}
          />

          <CodeBlock
            title="Glass Variant (Frosted blur)"
            code={`// Frosted glass effect — best over rich visual content
<EtBottomSheet
  bottomSheetRef={sheetRef}
  variant="glass"
  snapPoints={['50%']}
>
  <EtBottomSheet.SimpleHeader title="Portfolio" showCloseButton />
  <EtBottomSheet.Content>
    <YourContent />
  </EtBottomSheet.Content>
</EtBottomSheet>`}
          />

          <CodeBlock
            title="Fixed Height (Search/Filter)"
            code={`// Use snapPoints to prevent resize during filtering
<EtBottomSheet
  bottomSheetRef={sheetRef}
  snapPoints={['60%']}
>
  <EtBottomSheet.Header>
    <BottomSheetTextInput placeholder="Search..." />
    <EtBottomSheet.Header.Action onPress={() => sheetRef.current?.dismiss()} accessibilityLabel="Close">
      <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
    </EtBottomSheet.Header.Action>
  </EtBottomSheet.Header>
  <EtBottomSheet.Content scrollable>
    <FilteredResults items={filteredItems} />
  </EtBottomSheet.Content>
</EtBottomSheet>`}
          />
        </Section>

        {/* Important Notes */}
        <View style={styles.notesSection}>
          <EtText variant="heading-compact" style={{ marginBottom: 12 }}>
            Important Notes
          </EtText>

          <View style={[styles.noteBox, { backgroundColor: colors.bgWarningSubtle }]}>
            <EtText variant="body-base-semibold">Use BottomSheetTextInput</EtText>
            <EtText variant="body-secondary-regular" style={{ marginTop: 4, color: colors.textSecondaryNeutral }}>
              Regular TextInput won't work inside the sheet. Import BottomSheetTextInput from @gorhom/bottom-sheet.
            </EtText>
          </View>

          <View style={[styles.noteBox, { backgroundColor: colors.bgInfoSubtle }]}>
            <EtText variant="body-base-semibold">Provider Required</EtText>
            <EtText variant="body-secondary-regular" style={{ marginTop: 4, color: colors.textSecondaryNeutral }}>
              Wrap your app with GestureHandlerRootView and BottomSheetModalProvider at the root level.
            </EtText>
          </View>

          <View style={[styles.noteBox, { backgroundColor: colors.bgInfoSubtle }]}>
            <EtText variant="body-base-semibold">Use snapPoints for Fixed Height</EtText>
            <EtText variant="body-secondary-regular" style={{ marginTop: 4, color: colors.textSecondaryNeutral }}>
              For search/filter UIs, use snapPoints to prevent height changes when content updates.
            </EtText>
          </View>

          <View style={[styles.noteBox, { backgroundColor: colors.bgPositiveSubtle }]}>
            <EtText variant="body-base-semibold">Use Virtualized Lists for Large Data</EtText>
            <EtText variant="body-secondary-regular" style={{ marginTop: 4, color: colors.textSecondaryNeutral }}>
              For 50+ items, use EtBottomSheet.List or EtBottomSheet.SectionList. For 100+ items or complex components, use EtBottomSheet.FlashList
              for best performance. Always provide snapPoints when using these (dynamic sizing is automatically disabled for virtualized lists).
            </EtText>
          </View>
        </View>

        {/* API Reference */}
        <Section title="API Reference">
          <CodeBlock
            title="EtBottomSheetProps"
            code={`interface EtBottomSheetProps {
  bottomSheetRef: RefObject<BottomSheetModal>;  // Required

  // Sizing
  snapPoints?: (number | string)[];      // Disables dynamic sizing
  enableDynamicSizing?: boolean;         // Default: true

  // Behavior
  onOpen?: () => void;                   // Called when sheet opens
  onClose?: () => void;                  // Called when sheet closes
  onChange?: (index: number) => void;    // Called on snap point change
  closeOnBackdrop?: boolean;             // Default: true
  enablePanDownToClose?: boolean;        // Default: true

  // Appearance
  variant?: 'default' | 'glass';       // Default: 'default'
  showHandle?: boolean;                  // Default: true
  loading?: boolean;                     // Show loading state
}`}
          />

          <CodeBlock
            title="EtBottomSheet.Header (compound)"
            code={`// EtBottomSheet.Header — container; Title and Action are subcomponents.
// Action children render on the trailing edge. Other children (Views, inputs, Pressable)
// render in the main content area — use for subtitles, search rows, or leading back buttons.

<EtBottomSheet.Header>
  <EtBottomSheet.Header.Title>Title</EtBottomSheet.Header.Title>
  <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
    <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
  </EtBottomSheet.Header.Action>
</EtBottomSheet.Header>`}
          />

          <CodeBlock
            title="ContentProps"
            code={`interface ContentProps {
  scrollable?: boolean;           // Enable scrolling
  loadingPlaceholder?: ReactNode; // Custom loading UI
}`}
          />

          <CodeBlock
            title="ListProps (virtualized)"
            code={`// EtBottomSheet.List - for large flat lists (50+ items)
interface ListProps<T> extends FlatListProps<T> {
  loadingPlaceholder?: ReactNode; // Custom loading UI
}

// EtBottomSheet.SectionList - for grouped data
interface SectionListProps<T, S> extends SectionListProps<T, S> {
  loadingPlaceholder?: ReactNode; // Custom loading UI
}

// EtBottomSheet.FlashList - for best performance (100+ items)
interface FlashListProps<T> extends FlashListProps<T> {
  loadingPlaceholder?: ReactNode; // Custom loading UI
  drawDistance?: number; // Default: 1700px (Android) / 1200px (iOS)
}`}
          />

          <View style={[styles.noteBox, { backgroundColor: colors.bgNeutralQuaternary }]}>
            <EtText variant="body-base-semibold">When to use each list type</EtText>
            <EtText variant="body-secondary-regular" style={{ marginTop: 8, color: colors.textSecondaryNeutral }}>
              • Content: Static content, forms ({'<'}20 items){'\n'}• Content scrollable: Simple scrollable (20-50 items){'\n'}• List: Standard
              virtualized lists (50-100 items){'\n'}• SectionList: Grouped/sectioned data (50-100 items){'\n'}• FlashList: Maximum performance (100+
              items)
            </EtText>
          </View>
        </Section>

        {/* Handle Customization */}
        <Section title="Handle Customization">
          <EtText variant="body-secondary-regular" style={[styles.description, { color: colors.textSecondaryNeutral }]}>
            The drag handle uses a fixed color from the theme (dividerSecondary) and can be hidden if not needed:
          </EtText>

          <CodeBlock
            title="Hide Handle"
            code={`// Hide the handle completely
<EtBottomSheet
  bottomSheetRef={sheetRef}
  showHandle={false}
>
  ...
</EtBottomSheet>`}
          />

          <View style={[styles.noteBox, { backgroundColor: colors.bgSuccessSubtle }]}>
            <EtText variant="body-base-semibold">Feature: Floating Handle</EtText>
            <EtText variant="body-secondary-regular" style={{ marginTop: 4, color: colors.textSecondaryNeutral }}>
              The handle floats above the sheet background, creating visual separation. This is achieved through a custom handle component that
              renders both the floating indicator and the rounded top edge.
            </EtText>
          </View>

          <View style={[styles.noteBox, { backgroundColor: colors.bgInfoSubtle }]}>
            <EtText variant="body-base-semibold">Glass Variant Handle</EtText>
            <EtText variant="body-secondary-regular" style={{ marginTop: 4, color: colors.textSecondaryNeutral }}>
              When variant="glass" is set, the handle's rounded-top section becomes transparent so the frosted glass BlurView background shows
              through, while the indicator keeps its standard themed color.
            </EtText>
          </View>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  },
  args: {},
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
  },
  featuresCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagramCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  diagramBox: {
    padding: 12,
    borderRadius: 8,
  },
  diagramText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  patternCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  patternDesc: {
    marginBottom: 12,
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  codeContainer: {
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  codeTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
    padding: 12,
  },
  notesSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  noteBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
});
