import type { Meta, StoryObj } from '@storybook/react-native';
import { EtPagination, EtText, PaginationColor, PaginationSize } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { X1, X2, X3, X4, X5, X6, X8 } from 'etoro-ui/core/styles/spacing';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Helper component for static pagination displays in stories
// Now using number directly instead of SharedValue
const StaticPagination = ({
  totalPages,
  page,
  size,
  color,
}: {
  totalPages: number;
  page: number;
  size?: PaginationSize;
  color?: PaginationColor;
}) => {
  return <EtPagination totalPages={totalPages} currentPage={page} size={size} color={color} />;
};

type Story = StoryObj<{}>;

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = async (codeText: string) => {
    try {
      await Clipboard.setStringAsync(codeText);
      Alert.alert('Code Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Copy Failed', 'Could not copy code to clipboard', [{ text: 'OK' }]);
    }
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
            <Text style={[styles.copyButtonText, { color: colors.actionBrandText }]}>Copy</Text>
          </Pressable>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={[styles.codeText, { color: colors.textPrimaryNeutral }]}>{code}</Text>
      </ScrollView>
    </View>
  );
};

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Navigation/EtPagination/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtPagination component with live examples.',
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

    return (
      <ScrollView style={styles.container}>
        <View style={[styles.header, { borderColor: colors.dividerPrimary }]}>
          <EtText variant="display-main" style={styles.title}>
            📄 EtPagination
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            A dot-based pagination indicator for carousels, onboarding, and multi-step flows
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Two sizes: small (4px) and large (6px)
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Two color variants: neutral, primary
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Animated transitions between states
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Accepts number or SharedValue for currentPage
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Unified usePagination hook for navigation and scroll
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Full accessibility support
          </EtText>
        </View>

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Basic Usage
        </EtText>
        <View style={styles.demoRow}>
          <StaticPagination totalPages={5} page={2} />
        </View>
        <CodeBlock
          title="Basic Pagination (with number)"
          code={`// Simple usage with a number
<EtPagination
  totalPages={5}
  currentPage={2}
/>`}
        />

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Size Variants
        </EtText>
        <View style={styles.variationsRow}>
          <View style={styles.variationItem}>
            <EtText variant="body-secondary-regular" style={styles.label}>
              Small
            </EtText>
            <StaticPagination totalPages={5} page={1} size="small" color="neutral" />
          </View>
          <View style={styles.variationItem}>
            <EtText variant="body-secondary-regular" style={styles.label}>
              Large
            </EtText>
            <StaticPagination totalPages={5} page={1} size="large" color="neutral" />
          </View>
        </View>
        <CodeBlock
          title="Size Variants"
          code={`// Small
<EtPagination totalPages={5} currentPage={1} size="small" />

// Large (default)
<EtPagination totalPages={5} currentPage={1} size="large" />`}
        />

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Color Variants
        </EtText>
        <View style={styles.variationsRow}>
          <View style={styles.variationItem}>
            <EtText variant="body-secondary-regular" style={styles.label}>
              Neutral
            </EtText>
            <StaticPagination totalPages={5} page={1} color="neutral" />
          </View>
          <View style={styles.variationItem}>
            <EtText variant="body-secondary-regular" style={styles.label}>
              Primary
            </EtText>
            <StaticPagination totalPages={5} page={1} color="primary" />
          </View>
        </View>
        <CodeBlock
          title="Color Variants"
          code={`// Neutral (default) - dark selected dot
<EtPagination totalPages={5} currentPage={1} color="neutral" />

// Primary - green selected dot
<EtPagination totalPages={5} currentPage={1} color="primary" />`}
        />

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Scroll-Driven Animation
        </EtText>
        <View style={styles.demoRow}>
          <StaticPagination totalPages={5} page={2} color="primary" size="large" />
        </View>
        <EtText variant="body-secondary-regular" style={styles.selectedText}>
          Use the usePagination hook for scroll-driven pagination
        </EtText>
        <CodeBlock
          title="Using usePagination Hook (Carousel)"
          code={`import { EtPagination, usePagination } from 'etoro-ui';

// Pass currentPageAnimated directly to avoid creating a second SharedValue
const { currentPageAnimated, scrollHandler } = usePagination({
  totalPages: 5,
  itemWidth: cardWidth,
});

<Animated.ScrollView onScroll={scrollHandler}>
  {/* Carousel content */}
</Animated.ScrollView>

<EtPagination
  totalPages={5}
  currentPage={currentPageAnimated}
  color="primary"
  size="large"
/>`}
        />

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Onboarding Flow Example
        </EtText>
        <View style={styles.onboardingDemo}>
          <View style={styles.onboardingContent}>
            <EtText variant="heading-base">Step 2 of 4</EtText>
          </View>
          <StaticPagination totalPages={4} page={1} />
        </View>
        <CodeBlock
          title="Using usePagination Hook (Onboarding)"
          code={`import { EtPagination, usePagination } from 'etoro-ui';

// currentPage for display, currentPageAnimated for EtPagination
const {
  currentPage,
  currentPageAnimated,
  goToNext,
  goToPrevious,
  canGoNext,
  canGoPrevious,
} = usePagination({ totalPages: 4 });

<View>
  <OnboardingContent step={currentPage} />
  <EtPagination
    totalPages={4}
    currentPage={currentPageAnimated}
  />
  <Button onPress={goToPrevious} disabled={!canGoPrevious}>Previous</Button>
  <Button onPress={goToNext} disabled={!canGoNext}>Next</Button>
</View>`}
        />

        <View style={[styles.apiReference, { borderColor: colors.dividerPrimary }]}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Quick API Reference
          </EtText>
          <CodeBlock
            title="EtPaginationProps"
            code={`interface EtPaginationProps {
  // Required
  totalPages: number;                        // Total number of pages
  currentPage: number | SharedValue<number>; // Current page

  // Appearance
  size?: 'small' | 'large';        // Dot size variant (default: 'large')
  color?: 'neutral' | 'primary';   // Color variant (default: 'neutral')

  // Style
  style?: StyleProp<ViewStyle>;    // Container style

  // Accessibility
  testID?: string;                 // Test ID
  accessibilityLabel?: string;     // A11y label
}`}
          />
          <CodeBlock
            title="usePagination Hook"
            code={`// Unified hook for both navigation and scroll-driven pagination
const {
  // Current page
  currentPage,           // Current page index (number)
  currentPageAnimated,   // SharedValue for advanced animations

  // Navigation functions
  goToNext,              // Navigate to next page
  goToPrevious,          // Navigate to previous page
  goToPage,              // Navigate to specific page

  // Computed state
  isFirstPage,           // Whether on first page
  isLastPage,            // Whether on last page
  canGoNext,             // Can navigate forward
  canGoPrevious,         // Can navigate backward

  // Scroll features (when itemWidth provided)
  scrollHandler,         // Animated scroll handler
  getScrollOffsetForPage,// Get offset for programmatic scroll
} = usePagination({
  totalPages: 5,
  initialPage: 0,        // Optional
  itemWidth: 300,        // Optional, enables scroll tracking
});`}
          />
        </View>
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
    padding: X4,
  },
  header: {
    alignItems: 'center',
    marginBottom: X6,
    paddingBottom: X4,
    borderBottomWidth: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: X2,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  features: {
    marginBottom: X8,
  },
  featuresTitle: {
    marginBottom: X3,
  },
  featureText: {
    marginBottom: X1,
    opacity: 0.8,
  },
  sectionTitle: {
    marginTop: X6,
    marginBottom: X3,
  },
  demoRow: {
    alignItems: 'center',
    marginBottom: X4,
  },
  variationsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: X4,
  },
  variationItem: {
    alignItems: 'center',
  },
  label: {
    marginBottom: X2,
    opacity: 0.7,
  },
  selectedText: {
    textAlign: 'center',
    marginBottom: X4,
    opacity: 0.7,
  },
  onboardingDemo: {
    alignItems: 'center',
    padding: X5,
    marginBottom: X4,
  },
  onboardingContent: {
    marginBottom: X5,
  },
  apiReference: {
    marginTop: X6,
    paddingTop: X6,
    borderTopWidth: 1,
  },
  apiTitle: {
    marginBottom: X4,
  },
  // Code Block Styles
  codeContainer: {
    marginVertical: X3,
    borderRadius: X2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: X3,
    paddingVertical: X2,
    borderBottomWidth: 1,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: X2,
    paddingVertical: X1,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
    padding: X3,
  },
});
