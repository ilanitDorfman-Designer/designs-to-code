import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtAnimatedCount, EtButton, EtText } from 'etoro-ui';
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
          backgroundColor: colors.bgNeutralPrimary,
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
  title: 'eToro-UI/Foundations/AnimatedCount/📖 Introduction',
  parameters: {
    notes: 'Animated counter component with smooth digit transitions.',
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
    const [count, setCount] = useState(1234);
    const [isAnimating, setIsAnimating] = useState(false);

    // Generate random number between min and max
    const getRandomNumber = (min: number = 0, max: number = 999999) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Format number with commas and decimals
    const formatNumber = (num: number, includeDecimals: boolean = false) => {
      if (includeDecimals) {
        return (num + Math.random()).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
      return num.toLocaleString('en-US');
    };

    const handleShuffle = () => {
      setCount(getRandomNumber(0, 999999));
    };

    const handleIncrement = () => {
      setCount((prev) => Math.min(prev + 1, 999999));
    };

    const handleDecrement = () => {
      setCount((prev) => Math.max(prev - 1, 0));
    };

    const handleBigJump = () => {
      setCount(getRandomNumber(10000, 999999));
    };

    // Continuous animation demo
    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isAnimating) {
        interval = setInterval(() => {
          setCount(getRandomNumber(0, 9999));
        }, 800);
      }
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isAnimating]);

    const toggleAnimation = () => {
      setIsAnimating((prev) => !prev);
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            🔢 EtAnimatedCount
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Smooth digit transitions with spring physics for counting animations
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText style={styles.featureText}>• Smooth digit-by-digit animations with spring physics</EtText>
          <EtText style={styles.featureText}>• Automatic layout transitions when digit count changes</EtText>
          <EtText style={styles.featureText}>• Customizable text styling (color, size, dimensions)</EtText>
          <EtText style={styles.featureText}>• Optimized performance with React Native Reanimated</EtText>
          <EtText style={styles.featureText}>• Theme-aware default styling</EtText>
          <EtText style={styles.featureText}>• Individual digit independence for complex animations</EtText>
        </View>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Interactive Demo
          </EtText>
          <EtText style={styles.subtitle}>Watch the smooth digit animations in action</EtText>

          <View style={styles.countDisplayContainer}>
            <EtAnimatedCount number={count} />
          </View>

          <View style={styles.controlsGrid}>
            <EtButton onPress={handleShuffle}>
              <EtButton.Label>Shuffle</EtButton.Label>
            </EtButton>
            <EtButton onPress={handleIncrement}>
              <EtButton.Label>+1</EtButton.Label>
            </EtButton>
            <EtButton onPress={handleDecrement}>
              <EtButton.Label>-1</EtButton.Label>
            </EtButton>
            <EtButton onPress={handleBigJump}>
              <EtButton.Label>Big Jump</EtButton.Label>
            </EtButton>
          </View>

          <EtButton variant={isAnimating ? 'info-subtle' : 'primary-filled'} onPress={toggleAnimation} style={{ alignSelf: 'center', marginTop: 16 }}>
            <EtButton.Label>{isAnimating ? 'Stop Animation' : 'Start Continuous Animation'}</EtButton.Label>
          </EtButton>
        </View>

        <CodeBlock
          title="Basic Usage"
          code={`import { EtAnimatedCount } from 'etoro-ui';

<EtAnimatedCount number={1234} />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Customization Options
          </EtText>
          <EtText style={styles.subtitle}>Different sizes and colors for various use cases</EtText>

          <View style={styles.customizationGrid}>
            <View style={styles.customDemo}>
              <EtText style={styles.demoLabel}>Small</EtText>
              <EtAnimatedCount number={123} fontSize={24} textDigitHeight={30} textDigitWidth={20} />
            </View>

            <View style={styles.customDemo}>
              <EtText style={styles.demoLabel}>Large</EtText>
              <EtAnimatedCount number={456} fontSize={72} textDigitHeight={80} textDigitWidth={60} />
            </View>

            <View style={styles.customDemo}>
              <EtText style={styles.demoLabel}>Colored</EtText>
              <EtAnimatedCount number={789} color={colors.actionBrandText} />
            </View>
          </View>
        </View>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Formatted Numbers
          </EtText>
          <EtText style={styles.subtitle}>Support for commas, decimal points, and formatted strings</EtText>

          <View style={styles.customizationGrid}>
            <View style={styles.customDemo}>
              <EtText style={styles.demoLabel}>With Commas</EtText>
              <EtAnimatedCount number={formatNumber(count)} />
            </View>

            <View style={styles.customDemo}>
              <EtText style={styles.demoLabel}>With Decimals</EtText>
              <EtAnimatedCount number={formatNumber(count, true)} />
            </View>

            <View style={styles.customDemo}>
              <EtText style={styles.demoLabel}>Price Format</EtText>
              <EtAnimatedCount number={`$${formatNumber(count / 100, true)}`} />
            </View>
          </View>
        </View>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Character Spacing
          </EtText>
          <EtText style={styles.subtitle}>Control spacing between characters for better visual balance</EtText>

          <View style={styles.customizationGrid}>
            <View style={styles.customDemo}>
              <EtText style={styles.demoLabel}>No Spacing (0px)</EtText>
              <EtAnimatedCount number={formatNumber(count)} characterSpacing={0} />
            </View>

            <View style={styles.customDemo}>
              <EtText style={styles.demoLabel}>Medium Spacing (4px)</EtText>
              <EtAnimatedCount number={formatNumber(count)} characterSpacing={4} />
            </View>

            <View style={styles.customDemo}>
              <EtText style={styles.demoLabel}>Wide Spacing (8px)</EtText>
              <EtAnimatedCount number={formatNumber(count)} characterSpacing={8} />
            </View>
          </View>
        </View>

        <CodeBlock
          title="Character Spacing"
          code={`// No spacing (default)
<EtAnimatedCount number="1,234,567" characterSpacing={0} />

// Medium spacing for better readability
<EtAnimatedCount number="$12,345.67" characterSpacing={4} />

// Wide spacing for emphasis
<EtAnimatedCount number="98.76%" characterSpacing={8} />

// Works with all formats
<EtAnimatedCount 
  number={formatNumber(amount)} 
  characterSpacing={6}
  fontSize={72}
/>`}
        />

        <CodeBlock
          title="Formatted Numbers"
          code={`// Formatted with commas
<EtAnimatedCount number="1,234,567" />

// With decimal points
<EtAnimatedCount number="5,745.42" />

// Currency format
<EtAnimatedCount number="$12,345.67" />

// Dynamic formatting
const formattedValue = count.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
<EtAnimatedCount number={formattedValue} />`}
        />

        <CodeBlock
          title="Customization Examples"
          code={`// Small size
<EtAnimatedCount 
  number={123} 
  fontSize={24}
  textDigitHeight={30}
  textDigitWidth={20}
/>

// Large size
<EtAnimatedCount 
  number={456} 
  fontSize={72}
  textDigitHeight={80}
  textDigitWidth={60}
/>

// Custom color
<EtAnimatedCount 
  number={789} 
  color="#00C896"
/>`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            How It Works
          </EtText>
          <EtText style={styles.subtitle}>
            The component splits numbers into individual digits and animates each digit independently. When the number changes, only the affected
            digits animate, creating smooth transitions. Layout changes are handled automatically with spring physics.
          </EtText>
        </View>

        <CodeBlock
          title="Implementation Details"
          code={`// Internal digit splitting
const digits = React.useMemo(() => {
  return number
    .toString()
    .split('')
    .map((digit) => parseInt(digit, 10));
}, [number]);

// Individual digit animation
{digits.map((digit, index) => {
  return (
    <AnimatedDigits
      key={\`position-\${index}\`}
      digit={digit}
      height={textDigitHeight}
      width={textDigitWidth}
      textStyle={{ color, fontSize }}
    />
  );
})}

// Layout animation for digit count changes
<Animated.View layout={LinearTransition.springify()}>
  {/* digits */}
</Animated.View>`}
        />

        <View style={styles.realWorldExample}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Use Cases
          </EtText>
          <EtText style={styles.subtitle}>Perfect for scenarios requiring smooth number transitions:</EtText>
          <EtText style={styles.featureText}>• Portfolio value changes and P&L displays</EtText>
          <EtText style={styles.featureText}>• Real-time price updates and market data</EtText>
          <EtText style={styles.featureText}>• Counters and scoreboard displays</EtText>
          <EtText style={styles.featureText}>• Statistics and metrics dashboards</EtText>
          <EtText style={styles.featureText}>• Timer and countdown components</EtText>
        </View>

        <CodeBlock
          title="Real-World Examples"
          code={`// Portfolio balance
function PortfolioBalance({ balance }: { balance: number }) {
  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.label}>Portfolio Balance</Text>
      <EtAnimatedCount 
        number={balance} 
        color="#00C896"
        fontSize={32}
      />
    </View>
  );
}

// Live price ticker
function PriceTicker({ price }: { price: number }) {
  return (
    <EtAnimatedCount 
      number={Math.round(price * 100)} // For cents precision
      fontSize={24}
      color={price > 0 ? "#00C896" : "#FF6B6B"}
    />
  );
}`}
        />

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="EtAnimatedCountProps"
            code={`interface EtAnimatedCountProps {
  number: number | string;           // The number to display (required) - supports formatted strings
  textDigitHeight?: number;          // Height of each digit (default: 55)
  textDigitWidth?: number;           // Width of each digit (default: 40)
  fontSize?: number;                 // Font size (default: 50)
  fontWeight?: FontWeight;           // Font weight (default: theme weight)
  color?: string;                    // Text color (default: theme color)
  characterSpacing?: number;         // Spacing between characters in pixels (default: 0)
}

// Usage examples:
<EtAnimatedCount number={1234} />
<EtAnimatedCount number="5,678" characterSpacing={4} />
<EtAnimatedCount number="$12,345.67" fontSize={32} color="#00C896" />
<EtAnimatedCount 
  number="9,999.99" 
  textDigitHeight={60}
  textDigitWidth={45}
  fontSize={54}
  characterSpacing={6}
/>

// Formatting utilities:
const formatted = (1234567).toLocaleString('en-US'); // "1,234,567"
<EtAnimatedCount number={formatted} characterSpacing={2} />`}
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
    marginBottom: 8,
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
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  countDisplayContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    padding: 24,
    marginVertical: 16,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  customizationGrid: {
    gap: 16,
    width: '100%',
  },
  customDemo: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    gap: 8,
  },
  demoLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  realWorldExample: {
    marginBottom: 24,
    gap: 8,
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
