import type { Meta, StoryObj } from '@storybook/react-native';
import { EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof View>;

const meta: Meta<typeof View> = {
  title: 'eToro-UI/Components/DataDisplay/EtTicker/Intro',
  component: View,
  parameters: {
    notes: `
# EtTicker Component

A scrolling ticker component designed for displaying financial market data in an infinite loop. Perfect for showing real-time stock prices, cryptocurrency values, or breaking news. Now powered by @animatereactnative/marquee with advanced gesture support!

## Features

- **Infinite Loop**: Seamless continuous scrolling with no visible breaks
- **Gesture Interaction**: Drag to manually control scrolling direction and speed
- **Customizable Speed**: Control animation duration to match your app's pace
- **Flexible Content**: Support for both text and component-based content
- **Performance Optimized**: 60-120fps performance powered by Reanimated 3
- **Financial Focus**: Designed specifically for financial data display with icons for price changes

## Use Cases

- **Stock Market Tickers**: Display real-time stock prices and changes
- **Cryptocurrency Updates**: Show crypto prices and market movements  
- **Breaking News**: Scroll important financial news and alerts
- **Economic Indicators**: Display market indices and economic data
- **Trading Alerts**: Show trading signals and market notifications

## Key Props

- \`tickersData\`: Array of ticker items with symbol, currentPrice, and dailyChange (required)
- \`speed\`: Animation speed, higher values = faster scrolling (default: 0.5, range: 0.1-2.0)
- \`style\`: Additional styles for the ticker container

## Technical Details

- Built with \`@animatereactnative/marquee\` library for optimal performance
- Powered by Reanimated 3 for hardware-accelerated animations
- Gesture support allows users to drag and control scrolling
- Cross-platform compatibility (iOS, Android, Web)
- Automatically handles content duplication for infinite effect

## Best Practices

1. **Content Length**: Keep ticker content concise for better readability
2. **Animation Speed**: Balance between readability and engagement (default 45s for full cycle)
3. **Color Contrast**: Ensure good contrast for financial data visibility
4. **Performance**: Leverages hardware acceleration for maximum smoothness
5. **Accessibility**: Gesture controls help users interact with content naturally
    `,
  },
};

export default meta;

export const Introduction: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.bgNeutralSecondary }]} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.header, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-base" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
            EtTicker Component
          </EtText>
          <EtText variant="heading-compact" style={[styles.subtitle, { color: colors.textSecondaryNeutral }]}>
            Infinite scrolling ticker for financial data
          </EtText>
        </View>

        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
            <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
              📊 Perfect for Financial Apps
            </EtText>
            <EtText variant="heading-compact" style={[styles.description, { color: colors.textSecondaryNeutral }]}>
              Designed specifically for displaying stock prices, crypto values, and market data in a continuous, eye-catching format that keeps users
              engaged with real-time information.
            </EtText>
          </View>

          <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
            <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
              🔄 Seamless Infinite Loop
            </EtText>
            <EtText variant="heading-compact" style={[styles.description, { color: colors.textSecondaryNeutral }]}>
              Advanced animation system ensures smooth, uninterrupted scrolling with no visible breaks or jumps, creating a professional ticker
              experience.
            </EtText>
          </View>

          <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
            <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
              ⚡ High Performance
            </EtText>
            <EtText variant="heading-compact" style={[styles.description, { color: colors.textSecondaryNeutral }]}>
              Powered by Reanimated 3 and @animatereactnative/marquee for 60-120fps performance, ensuring smooth animations even with large amounts of
              data or on lower-end devices.
            </EtText>
          </View>

          <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
            <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
              🎨 Highly Customizable
            </EtText>
            <EtText variant="heading-compact" style={[styles.description, { color: colors.textSecondaryNeutral }]}>
              Control every aspect of the ticker including animation speed, spacing, font size, and content type. Support for both text-based and
              component-based content.
            </EtText>
          </View>

          <View style={[styles.useCases, { backgroundColor: colors.bgNeutralPrimary }]}>
            <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
              Common Use Cases
            </EtText>

            <View style={[styles.useCase, { borderBottomColor: colors.dividerPrimary }]}>
              <EtText variant="heading-compact" style={[styles.useCaseTitle, { color: colors.textPrimaryNeutral }]}>
                📈 Stock Market Dashboard
              </EtText>
              <EtText variant="body-secondary-regular" style={[styles.useCaseDescription, { color: colors.textSecondaryNeutral }]}>
                Display live stock prices, daily changes, and market indicators
              </EtText>
            </View>

            <View style={[styles.useCase, { borderBottomColor: colors.dividerPrimary }]}>
              <EtText variant="heading-compact" style={[styles.useCaseTitle, { color: colors.textPrimaryNeutral }]}>
                ₿ Cryptocurrency Exchange
              </EtText>
              <EtText variant="body-secondary-regular" style={[styles.useCaseDescription, { color: colors.textSecondaryNeutral }]}>
                Show crypto prices, 24h changes, and trading volumes
              </EtText>
            </View>

            <View style={[styles.useCase, { borderBottomColor: colors.dividerPrimary }]}>
              <EtText variant="heading-compact" style={[styles.useCaseTitle, { color: colors.textPrimaryNeutral }]}>
                📰 Financial News Feed
              </EtText>
              <EtText variant="body-secondary-regular" style={[styles.useCaseDescription, { color: colors.textSecondaryNeutral }]}>
                Stream breaking news, market alerts, and economic updates
              </EtText>
            </View>

            <View style={[styles.useCase, { borderBottomColor: colors.dividerPrimary }]}>
              <EtText variant="heading-compact" style={[styles.useCaseTitle, { color: colors.textPrimaryNeutral }]}>
                📊 Trading Platform
              </EtText>
              <EtText variant="body-secondary-regular" style={[styles.useCaseDescription, { color: colors.textSecondaryNeutral }]}>
                Display trading signals, portfolio updates, and market indices
              </EtText>
            </View>
          </View>

          <View style={[styles.footer, { backgroundColor: colors.bgActionBrand }]}>
            <EtText variant="heading-compact" style={[styles.footerText, { color: colors.actionBrandText }]}>
              Explore the stories to see EtTicker in action with different configurations and use cases.
            </EtText>
          </View>
        </View>
      </ScrollView>
    );
  },
  args: {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  description: {
    lineHeight: 22,
  },
  useCases: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  useCase: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  useCaseTitle: {
    marginBottom: 4,
  },
  useCaseDescription: {
    lineHeight: 18,
  },
  footer: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    lineHeight: 22,
  },
});
