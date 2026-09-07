import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';

import { EtText } from 'etoro-ui';
import { EtIconV2, IconVariant } from 'etoro-ui/components/et-icon-v2';
import { CodeBlock } from '../../utils/storybook-template';

// Interactive demo component with toast
function ClickableIconDemo() {
  const [showToast, setShowToast] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handlePress = useCallback(() => {
    setShowToast(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowToast(false));
    }, 2000);
  }, [fadeAnim]);

  return (
    <View style={demoStyles.container}>
      <View style={demoStyles.iconWrapper}>
        <EtIconV2 name="bell" size="xl" color="#6366F1" onPress={handlePress} accessibilityLabel="Click to show notification" />
        <EtText variant="body-tiny-regular" style={demoStyles.tapHint}>
          Tap me!
        </EtText>
      </View>
      {showToast && (
        <Animated.View style={[demoStyles.toast, { opacity: fadeAnim }]}>
          <EtText variant="body-base-medium" style={demoStyles.toastText}>
            clicked
          </EtText>
        </Animated.View>
      )}
    </View>
  );
}

const demoStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    minHeight: 120,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  tapHint: {
    marginTop: 8,
    opacity: 0.6,
  },
  toast: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  toastText: {
    color: '#FFFFFF',
  },
});

type Story = StoryObj<{}>;

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Icon V2/📖 Introduction',
  parameters: {
    notes: 'Complete documentation and usage guide for the EtIconV2 component with 4600+ Zappicons from CDN.',
  },
  decorators: [
    (Story) => (
      <View style={[styles.decorator]}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

export const Introduction: Story = {
  render: () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <EtText variant="display-main" style={styles.title}>
          🎨 EtIconV2
        </EtText>
        <EtText variant="heading-compact" style={styles.subtitle}>
          Icon system with 4600+ Zappicons from CDN. Supports multiple variants, disk caching, and theme-aware colors.
        </EtText>
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          ✨ Features
        </EtText>
        <View style={styles.featureList}>
          <EtText style={styles.featureItem}>• 4600+ Zappicons loaded from CDN</EtText>
          <EtText style={styles.featureItem}>• 6 variants: regular, filled, outlined, light, duotone, duotone-line</EtText>
          <EtText style={styles.featureItem}>• CDN-based with disk caching (works offline after first load)</EtText>
          <EtText style={styles.featureItem}>• Theme-aware color support via tintColor</EtText>
          <EtText style={styles.featureItem}>• Preset sizes: xs (12px), sm (16px), md (20px), lg (24px), xl (32px), 2xl (48px) or custom</EtText>
          <EtText style={styles.featureItem}>• Full accessibility support</EtText>
          <EtText style={styles.featureItem}>• TypeScript support with icon name validation</EtText>
          <EtText style={styles.featureItem}>• Optimized rendering with expo-image</EtText>
        </View>
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          🚀 Basic Usage
        </EtText>

        <CodeBlock
          code={`import { EtIconV2 } from 'etoro-ui/components/et-icon-v2';

<EtIconV2 name="settings" />`}
          title="Simple Icon"
        />

        <CodeBlock
          code={`<EtIconV2 
  name="heart" 
  size="lg" 
  color="#EF4444" 
/>`}
          title="Colored Icon with Size"
        />

        <CodeBlock
          code={`import { IconVariant } from 'etoro-ui/components/et-icon-v2';

<EtIconV2 
  name="bell" 
  variant={IconVariant.Filled}
/>`}
          title="Icon with Variant"
        />
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          👆 Interactive Icon
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.sectionDescription}>
          Provide an onPress handler to make the icon clickable. The icon automatically becomes a Pressable button.
        </EtText>

        <ClickableIconDemo />

        <CodeBlock
          code={`<EtIconV2
  name="bell"
  size="xl"
  color="#6366F1"
  onPress={() => showToast('clicked')}
  accessibilityLabel="Click to show notification"
/>`}
          title="Clickable Icon"
        />
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          📐 Size Options
        </EtText>

        <View style={styles.exampleGrid}>
          <View style={styles.exampleItem}>
            <EtIconV2 name="gear" size="xs" />
            <EtText variant="body-tiny-regular" style={styles.exampleLabel}>
              xs (12px)
            </EtText>
          </View>
          <View style={styles.exampleItem}>
            <EtIconV2 name="gear" size="sm" />
            <EtText variant="body-tiny-regular" style={styles.exampleLabel}>
              sm (16px)
            </EtText>
          </View>
          <View style={styles.exampleItem}>
            <EtIconV2 name="gear" size="md" />
            <EtText variant="body-tiny-regular" style={styles.exampleLabel}>
              md (20px)
            </EtText>
          </View>
          <View style={styles.exampleItem}>
            <EtIconV2 name="gear" size="lg" />
            <EtText variant="body-tiny-regular" style={styles.exampleLabel}>
              lg (24px)
            </EtText>
          </View>
          <View style={styles.exampleItem}>
            <EtIconV2 name="gear" size="xl" />
            <EtText variant="body-tiny-regular" style={styles.exampleLabel}>
              xl (32px)
            </EtText>
          </View>
          <View style={styles.exampleItem}>
            <EtIconV2 name="gear" size={48} />
            <EtText variant="body-tiny-regular" style={styles.exampleLabel}>
              custom (48px)
            </EtText>
          </View>
        </View>

        <CodeBlock
          code={`// Preset sizes
<EtIconV2 name="bell" size="xs" />   // 12px
<EtIconV2 name="bell" size="sm" />   // 16px
<EtIconV2 name="bell" size="md" />   // 20px (default)
<EtIconV2 name="bell" size="lg" />   // 24px
<EtIconV2 name="bell" size="xl" />   // 32px
<EtIconV2 name="bell" size="2xl" />  // 48px

// Custom size
<EtIconV2 name="bell" size={48} />   // 48px`}
          title="Size Examples"
        />
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          🎭 Icon Variants
        </EtText>

        <View style={styles.variantGrid}>
          <View style={styles.variantItem}>
            <EtIconV2 name="heart" size="lg" variant={IconVariant.Regular} />
            <EtText variant="body-tiny-regular" style={styles.variantLabel}>
              regular
            </EtText>
          </View>
          <View style={styles.variantItem}>
            <EtIconV2 name="heart" size="lg" variant={IconVariant.Filled} />
            <EtText variant="body-tiny-regular" style={styles.variantLabel}>
              filled
            </EtText>
          </View>
          <View style={styles.variantItem}>
            <EtIconV2 name="heart" size="lg" variant={IconVariant.Light} />
            <EtText variant="body-tiny-regular" style={styles.variantLabel}>
              light
            </EtText>
          </View>
          <View style={styles.variantItem}>
            <EtIconV2 name="heart" size="lg" variant={IconVariant.Duotone} />
            <EtText variant="body-tiny-regular" style={styles.variantLabel}>
              duotone
            </EtText>
          </View>
          <View style={styles.variantItem}>
            <EtIconV2 name="heart" size="lg" variant={IconVariant.DuotoneLine} />
            <EtText variant="body-tiny-regular" style={styles.variantLabel}>
              duotone-line
            </EtText>
          </View>
        </View>

        <CodeBlock
          code={`import { IconVariant } from 'etoro-ui/components/et-icon-v2';

<EtIconV2 name="heart" variant={IconVariant.Regular} />
<EtIconV2 name="heart" variant={IconVariant.Filled} />
<EtIconV2 name="heart" variant={IconVariant.Light} />
<EtIconV2 name="heart" variant={IconVariant.Duotone} />
<EtIconV2 name="heart" variant={IconVariant.DuotoneLine} />`}
          title="Variant Examples"
        />
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          🎨 Color System
        </EtText>

        <View style={styles.colorExamples}>
          <View style={styles.colorExample}>
            <EtIconV2 name="check-circle" size="lg" color="#10B981" />
            <EtText variant="body-secondary-regular" style={styles.colorLabel}>
              Success
            </EtText>
          </View>
          <View style={styles.colorExample}>
            <EtIconV2 name="xmark-circle" size="lg" color="#EF4444" />
            <EtText variant="body-secondary-regular" style={styles.colorLabel}>
              Error
            </EtText>
          </View>
          <View style={styles.colorExample}>
            <EtIconV2 name="exclamation-triangle" size="lg" color="#F59E0B" />
            <EtText variant="body-secondary-regular" style={styles.colorLabel}>
              Warning
            </EtText>
          </View>
          <View style={styles.colorExample}>
            <EtIconV2 name="info-circle" size="lg" color="#3B82F6" />
            <EtText variant="body-secondary-regular" style={styles.colorLabel}>
              Info
            </EtText>
          </View>
        </View>

        <CodeBlock
          code={`import { useEtoroTheme } from 'etoro-ui/core';

const { colors } = useEtoroTheme();

<EtIconV2 name="heart" color={colors.statusPositive} />
<EtIconV2 name="heart" color={colors.statusNegative} />
<EtIconV2 name="heart" color="#FF6B00" />  // Custom hex`}
          title="Theme Integration"
        />
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          📂 Icon Library
        </EtText>

        <View style={styles.libraryCard}>
          <View style={styles.libraryHeader}>
            <View style={[styles.customBadge, styles.zappiconBadge]}>
              <EtText variant="body-tiny-medium" style={styles.customBadgeText}>
                ZAPPICONS
              </EtText>
            </View>
            <EtText variant="body-base-semibold" style={styles.libraryTitle}>
              4600+ Icons
            </EtText>
          </View>
          <EtText variant="body-secondary-regular" style={styles.libraryDescription}>
            Comprehensive icon library with 29 categories covering all common use cases.
          </EtText>
          <EtText variant="body-tiny-regular" style={styles.libraryPath}>
            CDN: web-client/et-plus/zappicons/
          </EtText>
        </View>

        <View style={styles.categoryList}>
          <EtText variant="body-base-semibold" style={styles.categoriesSubtitle}>
            Categories Sample:
          </EtText>
          {[
            {
              name: 'Arrows',
              count: 150,
              icons: ['arrow-up', 'arrow-down', 'chevron-right'],
            },
            {
              name: 'UI Basics',
              count: 192,
              icons: ['gear', 'bell', 'search'],
            },
            {
              name: 'Communication',
              count: 213,
              icons: ['envelope', 'phone', 'comment'],
            },
            {
              name: 'Payment & Money',
              count: 183,
              icons: ['credit-card', 'wallet', 'coins'],
            },
          ].map((category) => (
            <View key={category.name} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <EtText variant="body-base-semibold">{category.name}</EtText>
                <EtText variant="body-tiny-regular" style={styles.categoryCount}>
                  {category.count} icons
                </EtText>
              </View>
              <View style={styles.categoryIcons}>
                {category.icons.map((icon) => (
                  <EtIconV2 key={icon} name={icon} size="md" />
                ))}
              </View>
            </View>
          ))}
        </View>

        <EtText variant="body-secondary-regular" style={styles.moreCategories}>
          + 25 more categories including: Security, Education, E-commerce, Devices, Buildings, Location, Multimedia, Charts, Users, and more...
        </EtText>
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          ♿ Accessibility
        </EtText>

        <CodeBlock
          code={`// Interactive icon (button) - provide onPress to make it interactive
<EtIconV2 
  name="settings" 
  onPress={() => openSettings()}
  accessibilityLabel="Open settings"
/>

// Custom accessibility role
<EtIconV2 
  name="info-circle"
  accessibilityRole="button"
  accessibilityLabel="Show more information"
/>`}
          title="Accessibility Examples"
        />
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          ⚡ Performance
        </EtText>

        <View style={styles.performanceList}>
          <EtText style={styles.performanceItem}>• Icons cached to disk after first load</EtText>
          <EtText style={styles.performanceItem}>• Works offline after initial download</EtText>
          <EtText style={styles.performanceItem}>• Optimized with expo-image for fast rendering</EtText>
          <EtText style={styles.performanceItem}>• Memoized component prevents unnecessary re-renders</EtText>
        </View>
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          📋 API Reference
        </EtText>

        <CodeBlock
          code={`interface EtIconV2Props {
  name: string;                    // Icon name (required)
  variant?: IconVariant;           // regular | filled | outlined | light | duotone | duotone-line
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;  // Size preset or custom pixels
  color?: string;                  // Tint color (hex or theme token)
  style?: ViewStyle;               // Container style
  testID?: string;                 // Test identifier
  accessibilityLabel?: string;     // Screen reader label
  accessibilityRole?: AccessibilityRole;
  onPress?: () => void;            // Press handler - makes icon a button
  accessible?: boolean;            // Enable accessibility
}`}
          title="Props"
        />
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          🔧 Utilities
        </EtText>

        <CodeBlock
          code={`import {
  // Fetch metadata
  getOrFetchIconMetadata,      // () → metadata (4600+ icons)
  getIconMetadata,             // (name) → IconMetadata | undefined
  
  // Query icons
  getAllIconNames,             // () → string[]
  getIconsByCategory,          // (category) → IconMetadata[]
  searchIcons,                 // (query) → IconMetadata[]
} from 'etoro-ui/components/et-icon-v2';`}
          title="Utility Functions"
        />
      </View>
    </ScrollView>
  ),
  args: {},
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionDescription: {
    marginBottom: 16,
    lineHeight: 20,
    opacity: 0.8,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    lineHeight: 20,
  },
  exampleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
    marginBottom: 16,
  },
  exampleItem: {
    alignItems: 'center',
    padding: 12,
    minWidth: 80,
  },
  exampleLabel: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  variantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
    marginBottom: 16,
  },
  variantItem: {
    alignItems: 'center',
    padding: 12,
    minWidth: 80,
  },
  variantLabel: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  colorExamples: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
    marginBottom: 16,
  },
  colorExample: {
    alignItems: 'center',
    padding: 12,
    minWidth: 80,
  },
  colorLabel: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
  categoryList: {
    gap: 16,
    marginBottom: 16,
  },
  categoryItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryCount: {
    opacity: 0.6,
  },
  categoryIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  moreCategories: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
  categoriesSubtitle: {
    marginBottom: 8,
  },
  libraryCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  libraryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  libraryTitle: {
    flex: 1,
  },
  libraryDescription: {
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 8,
  },
  libraryPath: {
    opacity: 0.5,
    fontFamily: 'Courier',
  },
  customBadge: {
    backgroundColor: '#00C896',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  zappiconBadge: {
    backgroundColor: '#6366F1',
  },
  customBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  performanceList: {
    gap: 8,
  },
  performanceItem: {
    lineHeight: 20,
  },
});
