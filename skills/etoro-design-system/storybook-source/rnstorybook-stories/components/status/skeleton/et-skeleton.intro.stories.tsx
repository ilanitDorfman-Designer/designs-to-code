import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtButton, EtSkeleton, EtSkeletonCard, EtSkeletonGroup, EtSkeletonList, EtSkeletonProfile, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<{}>;

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = (code: string) => {
    Clipboard.setStringAsync(code);
    Alert.alert('Code Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
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
        <View style={styles.codeHeader}>
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
  title: 'eToro-UI/Components/Status/EtSkeleton/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtSkeleton component with live examples.',
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
    const [basicLoading, setBasicLoading] = useState(true);
    const [cardLoading, setCardLoading] = useState(true);
    const [currentAnimation, setCurrentAnimation] = useState<'shimmer' | 'pulse' | 'wave'>('shimmer');

    const handleAnimationChange = () => {
      const animations: ('shimmer' | 'pulse' | 'wave')[] = ['shimmer', 'pulse', 'wave'];
      const currentIndex = animations.indexOf(currentAnimation);
      const nextIndex = (currentIndex + 1) % animations.length;
      setCurrentAnimation(animations[nextIndex]);
    };

    return (
      <ScrollView style={styles.container} removeClippedSubviews={true} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            ⚡ EtSkeleton
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Beautiful animated skeleton components for loading states with smooth React Native Reanimated animations
          </EtText>
          <View style={styles.performanceNote}>
            <EtText variant="body-secondary-regular" style={styles.performanceNoteText}>
              📱 Note: Some animations are disabled in this scrollable overview for optimal performance. See individual stories for full animation
              demos.
            </EtText>
          </View>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText style={styles.featureText}>• Multiple animation types (shimmer, pulse, wave)</EtText>
          <EtText style={styles.featureText}>• Shape variants (text, circular, rectangular, rounded)</EtText>
          <EtText style={styles.featureText}>• Pre-built composite components for common use cases</EtText>
          <EtText style={styles.featureText}>• Smooth React Native Reanimated animations</EtText>
          <EtText style={styles.featureText}>• Theme-aware with dark/light mode support</EtText>
          <EtText style={styles.featureText}>• Performance optimized with minimal re-renders</EtText>
          <EtText style={styles.featureText}>• Configurable dimensions and animation timing</EtText>
          <EtText style={styles.featureText}>• Seamless loading state transitions</EtText>
        </View>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Basic Usage
          </EtText>
          <View style={styles.basicDemo}>
            <EtSkeleton width={250} height={20} animation={currentAnimation} />
            <EtButton variant="info-subtle" size="small" onPress={handleAnimationChange} style={styles.centeredButton}>
              <EtButton.Label>{`Animation: ${currentAnimation}`}</EtButton.Label>
            </EtButton>
          </View>
        </View>
        <CodeBlock
          title="Basic Implementation"
          code={`import { EtSkeleton } from 'etoro-ui';

// Basic skeleton
<EtSkeleton width={200} height={20} animation="shimmer" />

// Circular avatar placeholder
<EtSkeleton width={50} height={50} variant="circular" />

// Rounded image placeholder
<EtSkeleton width={300} height={200} variant="rounded" />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Animation Types
          </EtText>
          <View style={styles.animationDemo}>
            <View style={styles.animationRow}>
              <EtText variant="body-base-medium" style={styles.animationLabel}>
                Shimmer
              </EtText>
              <EtSkeleton width={200} height={16} animation={currentAnimation === 'shimmer' ? 'shimmer' : 'none'} />
            </View>
            <View style={styles.animationRow}>
              <EtText variant="body-base-medium" style={styles.animationLabel}>
                Pulse
              </EtText>
              <EtSkeleton width={200} height={16} animation={currentAnimation === 'pulse' ? 'pulse' : 'none'} />
            </View>
            <View style={styles.animationRow}>
              <EtText variant="body-base-medium" style={styles.animationLabel}>
                Wave
              </EtText>
              <EtSkeleton width={200} height={16} animation={currentAnimation === 'wave' ? 'wave' : 'none'} />
            </View>
          </View>
          <EtText variant="body-secondary-regular" style={styles.animationNote}>
            👆 Only one animation plays at a time for better performance
          </EtText>
        </View>
        <CodeBlock
          title="Animation Types"
          code={`// Shimmer effect (default)
<EtSkeleton animation="shimmer" />

// Pulsing opacity
<EtSkeleton animation="pulse" />

// Wave scaling effect
<EtSkeleton animation="wave" />

// Static (no animation)
<EtSkeleton animation="none" />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Shape Variants
          </EtText>
          <View style={styles.shapeDemo}>
            <View style={styles.shapeRow}>
              <EtText variant="body-base-medium" style={styles.shapeLabel}>
                Text
              </EtText>
              <EtSkeleton width={150} height={16} variant="text" />
            </View>
            <View style={styles.shapeRow}>
              <EtText variant="body-base-medium" style={styles.shapeLabel}>
                Circular
              </EtText>
              <EtSkeleton width={40} height={40} variant="circular" />
            </View>
            <View style={styles.shapeRow}>
              <EtText variant="body-base-medium" style={styles.shapeLabel}>
                Rounded
              </EtText>
              <EtSkeleton width={100} height={60} variant="rounded" />
            </View>
            <View style={styles.shapeRow}>
              <EtText variant="body-base-medium" style={styles.shapeLabel}>
                Rectangular
              </EtText>
              <EtSkeleton width={120} height={40} variant="rectangular" />
            </View>
          </View>
        </View>
        <CodeBlock
          title="Shape Variants"
          code={`// Text with small border radius
<EtSkeleton variant="text" />

// Perfect circle
<EtSkeleton variant="circular" width={50} height={50} />

// Rounded corners (8px radius)
<EtSkeleton variant="rounded" />

// Sharp corners (no radius)
<EtSkeleton variant="rectangular" />

// Custom border radius
<EtSkeleton borderRadius={12} />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Composite Components
          </EtText>
          <View style={styles.compositeDemo}>
            <View style={styles.compositeItem}>
              <EtText variant="body-base-medium" style={styles.compositeLabel}>
                Skeleton Group
              </EtText>
              <EtSkeletonGroup animation="shimmer" />
            </View>
            <View style={styles.compositeItem}>
              <EtText variant="body-base-medium" style={styles.compositeLabel}>
                Skeleton Card
              </EtText>
              <EtSkeletonCard avatar={true} lines={2} actions={false} animation="shimmer" />
            </View>
          </View>
        </View>
        <CodeBlock
          title="Composite Components"
          code={`import { EtSkeletonGroup, EtSkeletonCard, EtSkeletonList, EtSkeletonProfile } from 'etoro-ui';

// Multiple text lines with varying widths
<EtSkeletonGroup lines={4} spacing={10} />

// Complete card layout
<EtSkeletonCard 
  avatar={true} 
  lines={3} 
  actions={true} 
  animation="shimmer" 
/>

// List of items
<EtSkeletonList items={5} animation="pulse" />

// User profile layout
<EtSkeletonProfile animation="wave" />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Loading State Control
          </EtText>
          <View style={styles.loadingDemo}>
            <EtButton variant="info-subtle" onPress={() => setBasicLoading(!basicLoading)} style={styles.centeredButton}>
              <EtButton.Label>{basicLoading ? 'Show Content' : 'Show Loading'}</EtButton.Label>
            </EtButton>
            <EtSkeleton visible={basicLoading} width="100%" height={100} variant="rounded">
              <View style={styles.contentPlaceholder}>
                <EtText variant="heading-compact">🎉 Actual Content Loaded!</EtText>
                <EtText>This content appears when loading is false</EtText>
              </View>
            </EtSkeleton>
          </View>
        </View>
        <CodeBlock
          title="Loading State Pattern"
          code={`const [isLoading, setIsLoading] = useState(true);

// Wrap your content with skeleton
<EtSkeleton 
  visible={isLoading}
  width="100%"
  height={200}
  variant="rounded"
>
  <YourActualContent />
</EtSkeleton>

// Or use conditional rendering
{isLoading ? (
  <EtSkeletonCard />
) : (
  <ActualCard />
)}`}
        />

        <View style={styles.realWorldExample}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Real-World Trading Examples
          </EtText>
          <View style={styles.tradingInterface}>
            <View style={styles.tradingCard}>
              <EtText variant="heading-compact">Portfolio Dashboard</EtText>
              <EtButton variant="info-subtle" size="small" onPress={() => setCardLoading(!cardLoading)}>
                <EtButton.Label>{cardLoading ? 'Load Content' : 'Show Loading'}</EtButton.Label>
              </EtButton>
              <EtSkeleton visible={cardLoading}>
                <EtSkeletonCard avatar={false} lines={2} actions={true} />
              </EtSkeleton>
            </View>

            <View style={styles.tradingCard}>
              <EtText variant="heading-compact">Stock Watchlist</EtText>
              <EtSkeletonList items={4} animation="shimmer" />
            </View>

            <View style={styles.tradingCard}>
              <EtText variant="heading-compact">User Profile</EtText>
              <EtSkeletonProfile animation="shimmer" />
            </View>
          </View>
        </View>
        <CodeBlock
          title="Trading Interface Usage"
          code={`// Portfolio loading state
<EtSkeleton visible={isLoadingPortfolio}>
  <EtSkeletonCard avatar={false} lines={3} actions={true} />
</EtSkeleton>

// Watchlist loading
<EtSkeleton visible={isLoadingWatchlist}>
  <EtSkeletonList items={10} animation="shimmer" />
</EtSkeleton>

// Chart placeholder
<EtSkeleton 
  visible={isLoadingChart}
  width="100%"
  height={300}
  variant="rounded"
>
  <LineChart data={chartData} />
</EtSkeleton>

// Asset card grid
{isLoadingAssets ? (
  Array.from({ length: 6 }, (_, i) => (
    <EtSkeletonCard key={i} avatar={true} lines={2} />
  ))
) : (
  assets.map(asset => <AssetCard key={asset.id} asset={asset} />)
)}`}
        />

        <View style={styles.performanceSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Performance & Implementation
          </EtText>
          <View style={styles.performanceList}>
            <EtText style={styles.performanceItem}>🚀 Built with React Native Reanimated for 60fps animations</EtText>
            <EtText style={styles.performanceItem}>⚡ Minimal re-renders using shared values</EtText>
            <EtText style={styles.performanceItem}>🎨 Theme-aware colors with automatic dark/light mode</EtText>
            <EtText style={styles.performanceItem}>📱 Responsive design with percentage and fixed widths</EtText>
            <EtText style={styles.performanceItem}>🔧 Configurable animation duration and timing</EtText>
            <EtText style={styles.performanceItem}>♿ Accessibility-friendly with proper contrast ratios</EtText>
          </View>
        </View>
        <CodeBlock
          title="Performance Tips"
          code={`// Use percentage widths for responsive design
<EtSkeleton width="80%" height={20} />

// Adjust animation speed for better UX
<EtSkeleton duration={1200} animation="shimmer" />

// Use appropriate variants for content type
<EtSkeleton variant="circular" />  // For avatars
<EtSkeleton variant="text" />      // For text content
<EtSkeleton variant="rounded" />   // For images/cards

// Optimize for lists with consistent sizing
<EtSkeletonList items={10} />  // Better than 10 individual skeletons`}
        />

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="EtSkeletonProps"
            code={`interface EtSkeletonProps {
  width?: number | string;           // Width (default: '100%')
  height?: number;                   // Height (default: 20)
  animation?: 'shimmer' | 'pulse' | 'wave' | 'none';  // Animation type
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';  // Shape
  borderRadius?: number;             // Custom border radius
  duration?: number;                 // Animation duration (default: 1500ms)
  style?: ViewStyle;                 // Custom styles
  visible?: boolean;                 // Show skeleton (default: true)
  children?: React.ReactNode;        // Content to show when visible=false
}`}
          />

          <CodeBlock
            title="Composite Components"
            code={`// EtSkeletonGroup - Multiple text lines
interface SkeletonGroupProps {
  lines?: number;                    // Number of lines (default: 3)
  spacing?: number;                  // Line spacing (default: 8)
  animation?: SkeletonAnimation;     // Animation type
  style?: ViewStyle;                 // Custom styles
}

// EtSkeletonCard - Complete card layout
interface SkeletonCardProps {
  avatar?: boolean;                  // Show avatar (default: true)
  lines?: number;                    // Content lines (default: 3)
  actions?: boolean;                 // Show action buttons (default: false)
  animation?: SkeletonAnimation;     // Animation type
  style?: ViewStyle;                 // Custom styles
}

// EtSkeletonList - List of items
interface SkeletonListProps {
  items?: number;                    // Number of items (default: 5)
  animation?: SkeletonAnimation;     // Animation type
}

// EtSkeletonProfile - User profile layout
interface SkeletonProfileProps {
  animation?: SkeletonAnimation;     // Animation type
  style?: ViewStyle;                 // Custom styles
}`}
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
    padding: 16,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginHorizontal: 20,
  },
  performanceNote: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  performanceNoteText: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
  },
  features: {
    marginBottom: 32,
  },
  featuresTitle: {
    marginBottom: 12,
  },
  featureText: {
    marginBottom: 4,
    opacity: 0.8,
  },
  demoSection: {
    marginBottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  basicDemo: {
    alignItems: 'center',
    gap: 12,
  },
  centeredButton: {
    alignSelf: 'center',
  },
  animationDemo: {
    gap: 16,
    width: '100%',
  },
  animationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  animationLabel: {
    width: 60,
    opacity: 0.7,
    fontSize: 12,
  },
  animationNote: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 8,
    fontStyle: 'italic',
  },
  shapeDemo: {
    gap: 16,
    width: '100%',
  },
  shapeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  shapeLabel: {
    width: 80,
    opacity: 0.7,
    fontSize: 12,
  },
  compositeDemo: {
    gap: 20,
    width: '100%',
  },
  compositeItem: {
    gap: 8,
  },
  compositeLabel: {
    opacity: 0.7,
    fontSize: 12,
  },
  loadingDemo: {
    gap: 12,
    width: '100%',
    alignItems: 'center',
  },
  contentPlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    gap: 4,
  },
  realWorldExample: {
    marginBottom: 32,
  },
  tradingInterface: {
    gap: 20,
  },
  tradingCard: {
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  performanceSection: {
    marginBottom: 32,
  },
  performanceList: {
    marginTop: 12,
    gap: 8,
  },
  performanceItem: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  apiReference: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  apiTitle: {
    marginBottom: 16,
  },
  // Code Block Styles
  codeContainer: {
    marginVertical: 12,
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
    borderBottomColor: '#e1e5e9',
  },
  codeTitle: {
    fontSize: 14,
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
});
