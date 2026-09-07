import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { LoaderSize } from 'etoro-ui';
import { EtButton, EtLoader, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = () => {
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
          <Pressable onPress={handleCopy} style={styles.copyButton}>
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

type Story = StoryObj<typeof EtLoader>;

const meta: Meta<typeof EtLoader> = {
  title: 'eToro-UI/Components/Status/EtLoader',
  component: EtLoader,
  parameters: {
    notes: 'Circular loading indicator with indeterminate and determinate states.',
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

export const Interactive: Story = {
  render: (args) => {
    return <EtLoader {...args} />;
  },
  args: {
    size: 'medium',
    state: 'indeterminate',
    progress: 0.5,
    duration: 1000,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['tiny', 'xs', 'small', 'medium', 'large', 'xl'],
    },
    state: {
      control: 'select',
      options: ['indeterminate', 'determinate'],
    },
    progress: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    duration: {
      control: { type: 'range', min: 500, max: 3000, step: 100 },
    },
  },
};

export const AllSizes: Story = {
  render: () => {
    const sizes: LoaderSize[] = ['tiny', 'xs', 'small', 'medium', 'large', 'xl'];
    const sizeLabels: Record<LoaderSize, string> = {
      tiny: 'Tiny (12px)',
      xs: 'XS (16px)',
      small: 'Small (20px)',
      medium: 'Medium (24px)',
      large: 'Large (30px)',
      xl: 'XL (36px)',
    };

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          All Loader Sizes
        </EtText>

        <View style={styles.sizesContainer}>
          {sizes.map((size) => (
            <View key={size} style={styles.sizeRow}>
              <EtText variant="body-base-medium" style={styles.sizeLabel}>
                {sizeLabels[size]}
              </EtText>
              <EtLoader size={size} />
            </View>
          ))}
        </View>

        <CodeBlock
          title="Usage"
          code={`<EtLoader size="tiny" />   // 12px
<EtLoader size="xs" />     // 16px
<EtLoader size="small" />  // 20px
<EtLoader size="medium" /> // 24px (default)
<EtLoader size="large" />  // 30px
<EtLoader size="xl" />     // 36px`}
        />
      </View>
    );
  },
};

export const IndeterminateState: Story = {
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Indeterminate Loaders
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Spinning animation for unknown progress
        </EtText>

        <View style={styles.loaderRow}>
          <EtLoader size="small" />
          <EtLoader size="medium" />
          <EtLoader size="large" />
          <EtLoader size="xl" />
        </View>

        <CodeBlock
          title="Usage"
          code={`// Default state is indeterminate
<EtLoader />

// Explicitly set indeterminate state
<EtLoader state="indeterminate" />`}
        />
      </View>
    );
  },
};

export const DeterminateState: Story = {
  render: () => {
    const progressValues = [0, 0.25, 0.5, 0.75, 1];

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Determinate Loaders
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Shows specific progress value
        </EtText>

        <View style={styles.progressGrid}>
          {progressValues.map((progress) => (
            <View key={progress} style={styles.progressItem}>
              <EtLoader size="large" state="determinate" progress={progress} />
              <EtText variant="body-secondary-medium" style={styles.progressLabel}>
                {Math.round(progress * 100)}%
              </EtText>
            </View>
          ))}
        </View>

        <CodeBlock
          title="Usage"
          code={`// Determinate state with progress value (0 to 1)
<EtLoader state="determinate" progress={0} />    // 0%
<EtLoader state="determinate" progress={0.25} /> // 25%
<EtLoader state="determinate" progress={0.5} />  // 50%
<EtLoader state="determinate" progress={0.75} /> // 75%
<EtLoader state="determinate" progress={1} />    // 100%`}
        />
      </View>
    );
  },
};

export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) return 0;
          return prev + 0.01;
        });
      }, 50);

      return () => clearInterval(interval);
    }, []);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Animated Progress
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          Smooth progress animation
        </EtText>

        <View style={styles.animatedContainer}>
          <EtLoader size="xl" state="determinate" progress={progress} />
          <EtText variant="heading-base" style={styles.progressText}>
            {Math.round(progress * 100)}%
          </EtText>
        </View>

        <CodeBlock
          title="Usage"
          code={`const [progress, setProgress] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 1) return 0;
      return prev + 0.01;
    });
  }, 50);
  return () => clearInterval(interval);
}, []);

<EtLoader size="xl" state="determinate" progress={progress} />`}
        />
      </View>
    );
  },
};

export const SpeedVariations: Story = {
  render: () => {
    const speeds = [
      { duration: 500, label: 'Fast (500ms)' },
      { duration: 1000, label: 'Normal (1000ms)' },
      { duration: 2000, label: 'Slow (2000ms)' },
    ];

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Animation Speeds
        </EtText>

        <View style={styles.speedContainer}>
          {speeds.map((speed) => (
            <View key={speed.duration} style={styles.speedRow}>
              <EtText variant="body-base-medium" style={styles.speedLabel}>
                {speed.label}
              </EtText>
              <EtLoader size="large" duration={speed.duration} />
            </View>
          ))}
        </View>

        <CodeBlock
          title="Usage"
          code={`// Fast animation (500ms per rotation)
<EtLoader duration={500} />

// Normal speed (1000ms, default)
<EtLoader duration={1000} />

// Slow animation (2000ms per rotation)
<EtLoader duration={2000} />`}
        />
      </View>
    );
  },
};

export const CustomColors: Story = {
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Custom Colors
        </EtText>

        <View style={styles.colorGrid}>
          <View style={styles.colorItem}>
            <EtLoader size="large" trackColor="#E3F2FD" progressColor="#1976D2" />
            <EtText variant="body-secondary-medium">Blue</EtText>
          </View>

          <View style={styles.colorItem}>
            <EtLoader size="large" trackColor="#E8F5E9" progressColor="#388E3C" />
            <EtText variant="body-secondary-medium">Green</EtText>
          </View>

          <View style={styles.colorItem}>
            <EtLoader size="large" trackColor="#FFF3E0" progressColor="#F57C00" />
            <EtText variant="body-secondary-medium">Orange</EtText>
          </View>

          <View style={styles.colorItem}>
            <EtLoader size="large" trackColor="#FCE4EC" progressColor="#C2185B" />
            <EtText variant="body-secondary-medium">Pink</EtText>
          </View>
        </View>

        <CodeBlock
          title="Usage"
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
/>`}
        />
      </View>
    );
  },
};

export const LoadingStateExample: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleToggle = () => {
      if (!isLoading) {
        setIsLoading(true);
        // Simulate loading
        timeoutRef.current = setTimeout(() => setIsLoading(false), 3000);
      }
    };

    useEffect(() => {
      timeoutRef.current = setTimeout(() => setIsLoading(false), 3000);
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Loading State Example
        </EtText>

        <View style={styles.loadingExample}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <EtLoader size="xl" />
              <EtText variant="body-base-medium" style={styles.loadingText}>
                Loading data...
              </EtText>
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <EtText variant="heading-base">Content Loaded!</EtText>
              <EtText variant="body-secondary-regular">Your data is ready to display</EtText>
            </View>
          )}

          <EtButton onPress={handleToggle} variant="primary-filled" disabled={isLoading} style={styles.centeredButton}>
            {isLoading ? 'Loading...' : 'Reload'}
          </EtButton>
        </View>

        <CodeBlock
          title="Usage"
          code={`const [isLoading, setIsLoading] = useState(true);

{isLoading ? (
  <View style={styles.loadingContainer}>
    <EtLoader size="xl" />
    <Text>Loading data...</Text>
  </View>
) : (
  <View style={styles.contentContainer}>
    <Text>Content Loaded!</Text>
  </View>
)}`}
        />
      </View>
    );
  },
};

export const InlineUsage: Story = {
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Inline Usage
        </EtText>

        <View style={styles.inlineContainer}>
          <View style={styles.inlineRow}>
            <EtLoader size="tiny" />
            <EtText variant="body-base-regular">Tiny inline loader</EtText>
          </View>

          <View style={styles.inlineRow}>
            <EtLoader size="xs" />
            <EtText variant="body-base-regular">XS inline loader</EtText>
          </View>

          <View style={styles.inlineRow}>
            <EtLoader size="small" />
            <EtText variant="body-base-regular">Small inline loader</EtText>
          </View>
        </View>

        <CodeBlock
          title="Usage"
          code={`<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <EtLoader size="tiny" />
  <Text>Loading...</Text>
</View>

<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <EtLoader size="small" />
  <Text>Fetching data...</Text>
</View>`}
        />
      </View>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  showcase: {
    gap: 16,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 8,
  },
  sizesContainer: {
    gap: 16,
  },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sizeLabel: {
    width: 120,
    opacity: 0.8,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  progressItem: {
    alignItems: 'center',
    gap: 8,
  },
  progressLabel: {
    opacity: 0.7,
  },
  animatedContainer: {
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  progressText: {
    minWidth: 50,
    textAlign: 'center',
  },
  speedContainer: {
    gap: 20,
    marginTop: 16,
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  speedLabel: {
    width: 140,
    opacity: 0.8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  colorItem: {
    alignItems: 'center',
    gap: 8,
    minWidth: 70,
  },
  loadingExample: {
    alignItems: 'center',
    gap: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    opacity: 0.7,
  },
  contentContainer: {
    alignItems: 'center',
    gap: 4,
  },
  inlineContainer: {
    gap: 16,
    marginTop: 8,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  centeredButton: {
    alignSelf: 'center',
  },
  // CodeBlock styles
  codeContainer: {
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
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
