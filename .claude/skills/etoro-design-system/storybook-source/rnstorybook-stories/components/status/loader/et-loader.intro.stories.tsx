import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { LoaderSize } from 'etoro-ui';
import { EtLoader, EtText } from 'etoro-ui';
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
  title: 'eToro-UI/Components/Status/EtLoader/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtLoader component with live examples.',
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
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 1 ? 0 : prev + 0.02));
      }, 50);
      return () => clearInterval(interval);
    }, []);

    const sizes: LoaderSize[] = ['tiny', 'xs', 'small', 'medium', 'large', 'xl'];

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            EtLoader
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Circular loading indicator component with indeterminate and determinate states for React Native
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText style={styles.featureText}>• 6 sizes: tiny (12px), xs (16px), small (20px), medium (24px), large (30px), xl (36px)</EtText>
          <EtText style={styles.featureText}>• Indeterminate state with smooth spinning animation</EtText>
          <EtText style={styles.featureText}>• Determinate state showing specific progress (0-100%)</EtText>
          <EtText style={styles.featureText}>• Customizable track and progress colors</EtText>
          <EtText style={styles.featureText}>• Configurable animation speed</EtText>
          <EtText style={styles.featureText}>• Theme-aware with dark/light mode support</EtText>
          <EtText style={styles.featureText}>• Built with React Native Reanimated for 60fps animations</EtText>
          <EtText style={styles.featureText}>• Accessible with proper ARIA attributes</EtText>
        </View>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            All Sizes
          </EtText>
          <View style={styles.sizesRow}>
            {sizes.map((size) => (
              <View key={size} style={styles.sizeItem}>
                <EtLoader size={size} />
                <EtText variant="body-secondary-medium" style={styles.sizeLabel}>
                  {size}
                </EtText>
              </View>
            ))}
          </View>
        </View>
        <CodeBlock
          title="Basic Usage"
          code={`import { EtLoader } from 'etoro-ui';

// Default medium indeterminate loader
<EtLoader />

// Different sizes
<EtLoader size="tiny" />   // 12px
<EtLoader size="xs" />     // 16px
<EtLoader size="small" />  // 20px
<EtLoader size="medium" /> // 24px (default)
<EtLoader size="large" />  // 30px
<EtLoader size="xl" />     // 36px`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Indeterminate vs Determinate
          </EtText>
          <View style={styles.statesRow}>
            <View style={styles.stateItem}>
              <EtLoader size="xl" state="indeterminate" />
              <EtText variant="body-base-medium" style={styles.stateLabel}>
                Indeterminate
              </EtText>
              <EtText variant="body-secondary-regular" style={styles.stateDesc}>
                Unknown progress
              </EtText>
            </View>
            <View style={styles.stateItem}>
              <EtLoader size="xl" state="determinate" progress={progress} />
              <EtText variant="body-base-medium" style={styles.stateLabel}>
                Determinate
              </EtText>
              <EtText variant="body-secondary-regular" style={styles.stateDesc}>
                {Math.round(progress * 100)}% complete
              </EtText>
            </View>
          </View>
        </View>
        <CodeBlock
          title="State Types"
          code={`// Indeterminate (spinning, default)
<EtLoader state="indeterminate" />

// Determinate (shows progress)
<EtLoader state="determinate" progress={0.75} />

// Animated progress example
const [progress, setProgress] = useState(0);
<EtLoader state="determinate" progress={progress} />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Custom Colors
          </EtText>
          <View style={styles.colorsRow}>
            <EtLoader size="large" trackColor="#E3F2FD" progressColor="#1976D2" />
            <EtLoader size="large" trackColor="#E8F5E9" progressColor="#388E3C" />
            <EtLoader size="large" trackColor="#FFF3E0" progressColor="#F57C00" />
            <EtLoader size="large" trackColor="#FCE4EC" progressColor="#C2185B" />
          </View>
        </View>
        <CodeBlock
          title="Custom Colors"
          code={`// Blue theme
<EtLoader
  size="large"
  trackColor="#E3F2FD"
  progressColor="#1976D2"
/>

// Green theme
<EtLoader
  size="large"
  trackColor="#E8F5E9"
  progressColor="#388E3C"
/>

// Uses theme colors by default
<EtLoader />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Animation Speed
          </EtText>
          <View style={styles.speedRow}>
            <View style={styles.speedItem}>
              <EtLoader size="medium" duration={500} />
              <EtText variant="body-secondary-medium">Fast</EtText>
            </View>
            <View style={styles.speedItem}>
              <EtLoader size="medium" duration={1000} />
              <EtText variant="body-secondary-medium">Normal</EtText>
            </View>
            <View style={styles.speedItem}>
              <EtLoader size="medium" duration={2000} />
              <EtText variant="body-secondary-medium">Slow</EtText>
            </View>
          </View>
        </View>
        <CodeBlock
          title="Animation Speed"
          code={`// Fast animation (500ms per rotation)
<EtLoader duration={500} />

// Normal speed (1000ms, default)
<EtLoader duration={1000} />

// Slow animation (2000ms per rotation)
<EtLoader duration={2000} />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Real-World Usage
          </EtText>
          <View style={styles.realWorldExample}>
            <View style={styles.inlineExample}>
              <EtLoader size="small" />
              <EtText variant="body-base-regular">Loading your portfolio...</EtText>
            </View>
            <View style={styles.buttonExample}>
              <View style={styles.loadingButton}>
                <EtLoader size="tiny" progressColor="#FFFFFF" trackColor="rgba(255,255,255,0.3)" />
                <Text style={styles.loadingButtonText}>Processing</Text>
              </View>
            </View>
          </View>
        </View>
        <CodeBlock
          title="Real-World Examples"
          code={`// Inline loading message
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <EtLoader size="small" />
  <Text>Loading your portfolio...</Text>
</View>

// Button loading state
<Pressable style={styles.button} disabled={isLoading}>
  {isLoading ? (
    <>
      <EtLoader size="tiny" progressColor="#FFF" />
      <Text style={styles.buttonText}>Processing</Text>
    </>
  ) : (
    <Text style={styles.buttonText}>Submit</Text>
  )}
</Pressable>

// Full page loader
<View style={styles.fullPageLoader}>
  <EtLoader size="xl" />
  <Text>Loading data...</Text>
</View>`}
        />

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="EtLoaderProps"
            code={`interface EtLoaderProps {
  // Size of the loader
  // Default: 'medium'
  size?: 'tiny' | 'xs' | 'small' | 'medium' | 'large' | 'xl';

  // Loader state
  // Default: 'indeterminate'
  state?: 'indeterminate' | 'determinate';

  // Progress value (0 to 1) for determinate state
  // Default: 0
  progress?: number;

  // Custom track color
  trackColor?: string;

  // Custom progress color
  progressColor?: string;

  // Animation duration in ms for indeterminate state
  // Default: 1000
  duration?: number;

  // Custom style for the container
  style?: ViewStyle;

  // Test ID for testing
  testID?: string;

  // Accessibility label
  accessibilityLabel?: string;
}`}
          />

          <CodeBlock
            title="Size Dimensions"
            code={`// Size mappings
const sizes = {
  tiny:   { size: 12, strokeWidth: 1.5 },
  xs:     { size: 16, strokeWidth: 1.6 },
  small:  { size: 20, strokeWidth: 2 },
  medium: { size: 24, strokeWidth: 2.8 },
  large:  { size: 30, strokeWidth: 3.5 },
  xl:     { size: 36, strokeWidth: 4.2 },
};`}
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
    borderBottomColor: '#e0e0e0',
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
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  sizeItem: {
    alignItems: 'center',
    gap: 6,
    minWidth: 50,
  },
  sizeLabel: {
    opacity: 0.7,
    fontSize: 11,
  },
  statesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 48,
  },
  stateItem: {
    alignItems: 'center',
    gap: 8,
  },
  stateLabel: {
    marginTop: 4,
  },
  stateDesc: {
    opacity: 0.6,
    fontSize: 12,
  },
  colorsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  speedItem: {
    alignItems: 'center',
    gap: 8,
  },
  realWorldExample: {
    gap: 16,
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  inlineExample: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonExample: {
    alignItems: 'flex-start',
  },
  loadingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loadingButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  apiReference: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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
