import type { Meta, StoryObj } from '@storybook/react-native';
import { EtButton, EtText, TimeFrameSelector } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TimeFrame } from '@etoro/common/types';

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
  title: 'eToro-UI/Components/Controls/TimeFrameSelector/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the TimeFrameSelector component with live examples.',
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
    const [basicTimeFrame, setBasicTimeFrame] = useState<TimeFrame>('3M');
    const [animatedTimeFrame, setAnimatedTimeFrame] = useState<TimeFrame>('1M');
    const [sizeTimeFrame, setSizeTimeFrame] = useState<TimeFrame>('6M');

    const handleRandomSelection = () => {
      const timeFrames: TimeFrame[] = ['1W', '1M', '3M', '6M', '1Y'];
      const randomFrame = timeFrames[Math.floor(Math.random() * timeFrames.length)];
      setAnimatedTimeFrame(randomFrame);
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            📅 TimeFrameSelector
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Smooth animated selector for switching between time periods with spring animations and no layout shifts
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Smooth spring animations with React Native Reanimated
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • No layout shifts - consistent border width
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Press feedback with scale animation
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Performance optimized RGB color parsing
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Customizable font size
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Theme-aware styling
          </EtText>
        </View>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Basic Usage
          </EtText>
          <TimeFrameSelector timeFrames={['1W', '1M', '3M', '6M', '1Y']} selectedTimeFrame={basicTimeFrame} onTimeFrameChange={setBasicTimeFrame} />
          <EtText variant="body-secondary-regular" style={styles.selectionText}>
            Selected: {basicTimeFrame}
          </EtText>
        </View>
        <CodeBlock
          title="Basic Implementation"
          code={`import { TimeFrameSelector } from './components/time-frame-selector';
import { TimeFrame } from './types';

const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('1M');

<TimeFrameSelector
  selectedTimeFrame={selectedTimeFrame}
  onTimeFrameChange={setSelectedTimeFrame}
/>`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Animation Demo
          </EtText>
          <EtText variant="body-base-regular" style={styles.subtitle}>
            Click the button to see smooth transitions
          </EtText>
          <TimeFrameSelector
            timeFrames={['1W', '1M', '3M', '6M', '1Y']}
            selectedTimeFrame={animatedTimeFrame}
            onTimeFrameChange={setAnimatedTimeFrame}
            fontSize={16}
          />
          <EtButton variant="info-subtle" size="small" onPress={handleRandomSelection} style={styles.centeredButton}>
            <EtButton.Label>Random Selection</EtButton.Label>
          </EtButton>
          <EtText variant="body-secondary-regular" style={styles.selectionText}>
            Current: {animatedTimeFrame}
          </EtText>
        </View>
        <CodeBlock
          title="Animation Configuration"
          code={`// Smooth spring animation with damping and stiffness
selectedProgress.value = withSpring(isSelected ? 1 : 0, {
  damping: 15,    // Controls bounce/oscillation
  stiffness: 150, // Controls speed of animation
});

// Press animation
scale.value = withSpring(0.95, { 
  damping: 15, 
  stiffness: 300 
});`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Font Sizes
          </EtText>
          <View style={styles.fontSizeDemo}>
            <View style={styles.fontExample}>
              <EtText variant="body-base-medium" style={styles.fontLabel}>
                Small (12px)
              </EtText>
              <TimeFrameSelector
                timeFrames={['1W', '1M', '3M', '6M', '1Y']}
                selectedTimeFrame={sizeTimeFrame}
                onTimeFrameChange={setSizeTimeFrame}
                fontSize={12}
              />
            </View>
            <View style={styles.fontExample}>
              <EtText variant="body-base-medium" style={styles.fontLabel}>
                Default (14px)
              </EtText>
              <TimeFrameSelector
                timeFrames={['1W', '1M', '3M', '6M', '1Y']}
                selectedTimeFrame={sizeTimeFrame}
                onTimeFrameChange={setSizeTimeFrame}
                fontSize={14}
              />
            </View>
            <View style={styles.fontExample}>
              <EtText variant="body-base-medium" style={styles.fontLabel}>
                Large (18px)
              </EtText>
              <TimeFrameSelector
                timeFrames={['1W', '1M', '3M', '6M', '1Y']}
                selectedTimeFrame={sizeTimeFrame}
                onTimeFrameChange={setSizeTimeFrame}
                fontSize={18}
              />
            </View>
          </View>
        </View>
        <CodeBlock
          title="Font Size Configuration"
          code={`// Small size for compact interfaces
<TimeFrameSelector fontSize={12} {...props} />

// Default size for standard views  
<TimeFrameSelector fontSize={14} {...props} />

// Large size for prominent placements
<TimeFrameSelector fontSize={18} {...props} />`}
        />

        <View style={styles.realWorldExample}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Real-World Examples
          </EtText>
          <View style={styles.tradingInterface}>
            <View style={styles.chartSection}>
              <EtText variant="heading-compact">Portfolio Dashboard</EtText>
              <EtText variant="body-base-regular" style={styles.chartDescription}>
                Main chart timeframe selector
              </EtText>
              <TimeFrameSelector
                timeFrames={['1W', '1M', '3M', '6M', '1Y']}
                selectedTimeFrame={basicTimeFrame}
                onTimeFrameChange={setBasicTimeFrame}
                fontSize={16}
              />
            </View>
            <View style={styles.chartSection}>
              <EtText variant="heading-compact">Stock Detail View</EtText>
              <EtText variant="body-base-regular" style={styles.chartDescription}>
                Individual stock analysis
              </EtText>
              <TimeFrameSelector
                timeFrames={['1W', '1M', '3M', '6M', '1Y']}
                selectedTimeFrame={animatedTimeFrame}
                onTimeFrameChange={setAnimatedTimeFrame}
                fontSize={14}
              />
            </View>
            <View style={styles.chartSection}>
              <EtText variant="heading-compact">Mini Chart Widget</EtText>
              <EtText variant="body-base-regular" style={styles.chartDescription}>
                Compact view for watchlists
              </EtText>
              <TimeFrameSelector
                timeFrames={['1W', '1M', '3M', '6M', '1Y']}
                selectedTimeFrame={sizeTimeFrame}
                onTimeFrameChange={setSizeTimeFrame}
                fontSize={12}
              />
            </View>
          </View>
        </View>
        <CodeBlock
          title="Trading Interface Usage"
          code={`// Main chart - prominent placement
<TimeFrameSelector
  timeFrames={["1W", "1M", "3M", "6M", "1Y"]}
  selectedTimeFrame={chartTimeFrame}
  onTimeFrameChange={setChartTimeFrame}
  fontSize={16}
/>

// Stock detail - standard size
<TimeFrameSelector
  timeFrames={["1W", "1M", "3M", "6M", "1Y"]}
  selectedTimeFrame={stockTimeFrame}
  onTimeFrameChange={setStockTimeFrame}
  fontSize={14}
/>

// Widget/watchlist - compact
<TimeFrameSelector
  timeFrames={["1W", "1M", "3M", "6M", "1Y"]}
  selectedTimeFrame={widgetTimeFrame}
  onTimeFrameChange={setWidgetTimeFrame}
  fontSize={12}
/>`}
        />

        <View style={styles.performanceSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Performance Optimizations
          </EtText>
          <View style={styles.performanceList}>
            <EtText variant="body-base-regular" style={styles.performanceItem}>
              🚀 Pre-computed RGB values with useMemo
            </EtText>
            <EtText variant="body-base-regular" style={styles.performanceItem}>
              ⚡ Consistent border width prevents layout shifts
            </EtText>
            <EtText variant="body-base-regular" style={styles.performanceItem}>
              🎯 Minimal operations in useAnimatedStyle
            </EtText>
            <EtText variant="body-base-regular" style={styles.performanceItem}>
              💾 Reused color calculations
            </EtText>
            <EtText variant="body-base-regular" style={styles.performanceItem}>
              🔋 Battery-efficient animations
            </EtText>
          </View>
        </View>
        <CodeBlock
          title="Performance Pattern"
          code={`// ✅ GOOD: Pre-compute expensive operations
const rgbValues = React.useMemo(() => {
  // Expensive parsing happens only when colors.text changes
  const textColor = colors.text;
  return parseRGBFromHex(textColor);
}, [colors.text]);

const animatedStyle = useAnimatedStyle(() => {
  // Fast: Simple array destructuring on UI thread
  const [r, g, b] = rgbValues;
  return {
    backgroundColor: \`rgba(\${r}, \${g}, \${b}, \${opacity})\`,
  };
});

// ❌ BAD: Expensive operations in animation
const animatedStyle = useAnimatedStyle(() => {
  // Slow: String parsing 60+ times per second
  const rgb = colors.text.slice(1).match(/.{2}/g);
  // This runs on the UI thread during animations!
});`}
        />

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="TimeFrameSelectorProps"
            code={`interface TimeFrameSelectorProps {
  selectedTimeFrame: TimeFrame;           // Currently selected time frame
  onTimeFrameChange: (value: TimeFrame) => void;  // Selection change handler
  fontSize?: number;                      // Font size (default: 14)
}

type TimeFrame = '1W' | '1M' | '3M' | '6M' | '1Y';

// Available time frames:
// '1W'  - 1 Week
// '1M'  - 1 Month  
// '3M'  - 3 Months
// '6M'  - 6 Months
// '1Y'  - 1 Year`}
          />

          <CodeBlock
            title="Animation Details"
            code={`// Spring Animation Configuration
{
  damping: 15,      // Controls bounce (higher = less bounce)
  stiffness: 150,   // Controls speed (higher = faster)
}

// Animation Sequence:
1. Selection changes → selectedProgress animates 0→1 or 1→0
2. Border opacity animates from selectedProgress value
3. Background opacity = selectedProgress * 0.1 (10% max)
4. Text opacity = selectedProgress * 0.4 + 0.6 (60% to 100%)
5. Press animation: scale 1.0 → 0.95 → 1.0

// Performance:
- Runs at 60 FPS on UI thread
- Zero layout calculations during animation
- Minimal string operations per frame`}
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
  selectionText: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: '500',
  },
  centeredButton: {
    alignSelf: 'center',
  },
  fontSizeDemo: {
    gap: 16,
    width: '100%',
  },
  fontExample: {
    alignItems: 'center',
    gap: 8,
  },
  fontLabel: {
    opacity: 0.7,
    fontSize: 12,
  },
  realWorldExample: {
    marginBottom: 32,
  },
  tradingInterface: {
    gap: 24,
  },
  chartSection: {
    alignItems: 'center',
    gap: 8,
  },
  chartDescription: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 4,
  },
  performanceSection: {
    marginBottom: 32,
  },
  performanceList: {
    marginTop: 12,
    gap: 6,
  },
  performanceItem: {
    fontSize: 14,
    opacity: 0.8,
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
