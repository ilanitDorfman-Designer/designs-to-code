import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtText, EtoroIcon } from 'etoro-ui';
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
  title: 'eToro-UI/Foundations/Icon & Assets/📖 Introduction',
  parameters: {
    notes: 'Complete documentation and usage guide for the EtoroIcon system.',
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
          🎨 EtoroIcon
        </EtText>
        <EtText variant="heading-compact" style={styles.subtitle}>
          Central icon system for the eToro design system. Provides consistent, scalable icons across the entire application.
        </EtText>
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          ✨ Features
        </EtText>
        <View style={styles.featureList}>
          <EtText style={styles.featureItem}>• 50+ carefully crafted icons for finance and trading</EtText>
          <EtText style={styles.featureItem}>• Consistent sizing and visual weight</EtText>
          <EtText style={styles.featureItem}>• Full color customization support</EtText>
          <EtText style={styles.featureItem}>• Fill and stroke variants for supported icons</EtText>
          <EtText style={styles.featureItem}>• Optimized SVG icons for sharp rendering</EtText>
          <EtText style={styles.featureItem}>• TypeScript support with icon name validation</EtText>
          <EtText style={styles.featureItem}>• Theme-aware and accessible</EtText>
          <EtText style={styles.featureItem}>• Performance optimized with lazy loading</EtText>
        </View>
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          🚀 Basic Usage
        </EtText>

        <CodeBlock
          code={`import { EtoroIcon } from 'etoro-ui';

<EtoroIcon iconName="apple" size={24} />`}
          title="Simple Icon"
        />

        <CodeBlock
          code={`<EtoroIcon 
  iconName="heart" 
  size={32} 
  color="#EF4444" 
/>`}
          title="Colored Icon"
        />

        <CodeBlock
          code={`<EtoroIcon 
  iconName="settings" 
  size={24} }
  hasFill
  fill="#3B82F6" 
/>`}
          title="Icon with Fill"
        />
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          📐 Size Guidelines
        </EtText>

        <View style={styles.exampleGrid}>
          <View style={styles.exampleItem}>
            <EtoroIcon icon={{ iconName: 'user' }} appearance={{ size: 16 }} />
            <EtText variant="body-tiny-regular" style={styles.exampleLabel}>
              16px - Small UI elements
            </EtText>
          </View>
          <View style={styles.exampleItem}>
            <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 20 }} />
            <EtText variant="body-tiny-regular" style={styles.exampleLabel}>
              20px - List items, badges
            </EtText>
          </View>
          <View style={styles.exampleItem}>
            <EtoroIcon icon={{ iconName: 'home' }} appearance={{ size: 24 }} />
            <EtText variant="body-tiny-regular" style={styles.exampleLabel}>
              24px - Standard buttons
            </EtText>
          </View>
          <View style={styles.exampleItem}>
            <EtoroIcon icon={{ iconName: 'wallet' }} appearance={{ size: 32 }} />
            <EtText variant="body-tiny-regular" style={styles.exampleLabel}>
              32px - Large buttons, cards
            </EtText>
          </View>
          <View style={styles.exampleItem}>
            <EtoroIcon icon={{ iconName: 'coins' }} appearance={{ size: 48 }} />
            <EtText variant="body-tiny-regular" style={styles.exampleLabel}>
              48px - Headers, features
            </EtText>
          </View>
        </View>

        <CodeBlock
          code={`// Standard component sizes
<EtoroIcon icon={{ iconName: "plus" }} appearance={{ size: 16 }} />      // Small buttons
<EtoroIcon icon={{ iconName: "chevronRight" }} appearance={{ size: 20 }} />  // List items
<EtoroIcon icon={{ iconName: "heart" }} appearance={{ size: 24 }} />     // Default buttons
<EtoroIcon icon={{ iconName: "apple" }} appearance={{ size: 32 }} />     // Asset logos
<EtoroIcon icon={{ iconName: "trading" }} appearance={{ size: 48 }} />   // Feature icons`}
          title="Recommended Sizes"
        />
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          🎨 Color System
        </EtText>

        <View style={styles.colorExamples}>
          <View style={styles.colorExample}>
            <EtoroIcon icon={{ iconName: 'gainers' }} appearance={{ size: 24, color: '#10B981' }} />
            <EtText variant="body-secondary-regular" style={styles.colorLabel}>
              Success (#10B981)
            </EtText>
          </View>
          <View style={styles.colorExample}>
            <EtoroIcon icon={{ iconName: 'losers' }} appearance={{ size: 24, color: '#EF4444' }} />
            <EtText variant="body-secondary-regular" style={styles.colorLabel}>
              Error (#EF4444)
            </EtText>
          </View>
          <View style={styles.colorExample}>
            <EtoroIcon icon={{ iconName: 'notification' }} appearance={{ size: 24, color: '#F59E0B' }} />
            <EtText variant="body-secondary-regular" style={styles.colorLabel}>
              Warning (#F59E0B)
            </EtText>
          </View>
          <View style={styles.colorExample}>
            <EtoroIcon icon={{ iconName: 'settings' }} appearance={{ size: 24 }} />
            <EtText variant="body-secondary-regular" style={styles.colorLabel}>
              Neutral (#374151)
            </EtText>
          </View>
        </View>

        <CodeBlock
          code={`import { useEtoroTheme } from 'etoro-ui/core';

const { colors } = useEtoroTheme();

<EtoroIcon 
  iconName="heart" 
  size={24} 
  color={colors.text}     // Adapts to theme
/>`}
          title="Theme Integration"
        />
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          📂 Icon Categories
        </EtText>

        <View style={styles.categoryShowcase}>
          <View style={styles.categoryItem}>
            <EtText variant="body-base-semibold" style={styles.categoryTitle}>
              Navigation
            </EtText>
            <View style={styles.categoryIcons}>
              <EtoroIcon icon={{ iconName: 'home' }} appearance={{ size: 20 }} />
              <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 20 }} />
              <EtoroIcon icon={{ iconName: 'portfolio' }} appearance={{ size: 20 }} />
              <EtoroIcon icon={{ iconName: 'watchlist' }} appearance={{ size: 20 }} />
            </View>
          </View>

          <View style={styles.categoryItem}>
            <EtText variant="body-base-semibold" style={styles.categoryTitle}>
              Trading
            </EtText>
            <View style={styles.categoryIcons}>
              <EtoroIcon icon={{ iconName: 'trading' }} appearance={{ size: 20 }} />
              <EtoroIcon icon={{ iconName: 'wallet' }} appearance={{ size: 20 }} />
              <EtoroIcon icon={{ iconName: 'coins' }} appearance={{ size: 20 }} />
              <EtoroIcon icon={{ iconName: 'btc' }} appearance={{ size: 20 }} />
            </View>
          </View>

          <View style={styles.categoryItem}>
            <EtText variant="body-base-semibold" style={styles.categoryTitle}>
              Actions
            </EtText>
            <View style={styles.categoryIcons}>
              <EtoroIcon icon={{ iconName: 'plus' }} appearance={{ size: 20 }} />
              <EtoroIcon icon={{ iconName: 'closeSmall' }} appearance={{ size: 20 }} />
              <EtoroIcon icon={{ iconName: 'share' }} appearance={{ size: 20 }} />
              <EtoroIcon icon={{ iconName: 'like' }} appearance={{ size: 20 }} />
            </View>
          </View>

          <View style={styles.categoryItem}>
            <EtText variant="body-base-semibold" style={styles.categoryTitle}>
              Brands
            </EtText>
            <View style={styles.categoryIcons}>
              <EtoroIcon icon={{ iconName: 'apple' }} appearance={{ size: 20 }} />
              <EtoroIcon icon={{ iconName: 'metaDark' }} appearance={{ size: 20 }} />
              <EtoroIcon icon={{ iconName: 'googleDark' }} appearance={{ size: 20 }} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          🔧 Advanced Usage
        </EtText>

        <CodeBlock
          title="Dynamic Icon Selection"
          code={`const getStatusIcon = (status: 'up' | 'down' | 'neutral') => {
  const icons = {
    up: 'gainers',
    down: 'losers', 
    neutral: 'minus'
  };
  
  const colors = {
    up: '#10B981',
    down: '#EF4444',
    neutral: '#6B7280'
  };
  
  return (
    <EtoroIcon 
      icon={{ iconName: icons[status] }}
      appearance={{ size: 24, color: colors[status] }}
    />
  );
};`}
        ></CodeBlock>

        <CodeBlock
          title="Conditional Icon Rendering"
          code={`const AssetItem = ({ symbol, isWatched }) => (
  <View style={styles.assetItem}>
    <EtoroIcon icon={{ iconName: symbol.toLowerCase() }} appearance={{ size: 32 }} />
    <Text>{symbol}</Text>
    {isWatched && (
      <EtoroIcon 
        icon={{ iconName: "watched" }} 
        appearance={{ size: 16, color: "#10B981" }} 
      />
    )}
  </View>
);`}
        ></CodeBlock>

        <CodeBlock
          title="Interactive Icons"
          code={`const LikeButton = ({ isLiked, onToggle }) => (
  <Pressable onPress={onToggle} style={styles.likeButton}>
    <EtoroIcon 
      icon={{ iconName: isLiked ? "heart" : "like" }}
      appearance={{ size: 24, color: isLiked ? "#EF4444" : "#6B7280" }}
      hasFill={isLiked}
      fill="#EF4444"
    />
  </Pressable>
);`}
        ></CodeBlock>
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          📱 Component Integration
        </EtText>

        <CodeBlock
          title="In Buttons"
          code={`<EtButton 
  title="Add to Portfolio"
  leftIcon={<EtoroIcon icon={{ iconName: "plus" }} appearance={{ size: 20, color: "#FFFFFF" }} />}
  variant="primary"
  onPress={handleAdd}
/>`}
        ></CodeBlock>

        <CodeBlock
          title="In List Items"
          code={`<EtListItem
  title="Apple Inc"
  subtitle="AAPL"
  leftIcon={{ iconName: "apple" }}  // EtoroIcon automatically used
  showTradeButton
/>`}
        ></CodeBlock>

        <CodeBlock
          title="In Asset Cards"
          code={`<EtAssetItem
  symbol="BTC"
  name="Bitcoin"
  logo={{ iconName: "btc" }}  // EtoroIcon integration
  price="$45,230"
  showTradeButton
/>`}
        ></CodeBlock>
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          ♿ Accessibility
        </EtText>

        <CodeBlock
          title="Accessibility Best Practices"
          code={`// For decorative icons (no accessibility needed)
<EtoroIcon icon={{ iconName: "apple" }} appearance={{ size: 24 }} />

// For functional icons (add accessibility)
<Pressable 
  onPress={handleSettings}
  accessibilityLabel="Open settings"
  accessibilityRole="button"
>
  <EtoroIcon icon={{ iconName: "settings" }} appearance={{ size: 24 }} />
</Pressable>

// For status indicators
<View accessibilityLabel="Portfolio is up 5.2%">
  <EtoroIcon icon={{ iconName: "gainers" }} appearance={{ size: 20, color: "#10B981" }} />
  <Text>+5.2%</Text>
</View>`}
        ></CodeBlock>
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          ⚡ Performance Tips
        </EtText>

        <View style={styles.tipsList}>
          <EtText style={styles.tipItem}>• Icons are lazy-loaded and cached automatically</EtText>
          <EtText style={styles.tipItem}>• Use consistent sizes to leverage internal optimizations</EtText>
          <EtText style={styles.tipItem}>• Prefer theme colors over hardcoded values</EtText>
          <EtText style={styles.tipItem}>• Group icon imports when using many icons</EtText>
          <EtText style={styles.tipItem}>• Test icon names in TypeScript for validation</EtText>
        </View>

        <CodeBlock
          title="Efficient Icon Usage"
          code={`// Good: Consistent sizing
const ICON_SIZE = 24;
<EtoroIcon icon={{ iconName: "heart" }} appearance={{ size: ICON_SIZE }} />
<EtoroIcon icon={{ iconName: "like" }} appearance={{ size: ICON_SIZE }} />

// Good: Theme-aware colors
const { colors } = useEtoroTheme();
<EtoroIcon icon={{ iconName: "settings" }} appearance={{ color: colors.textSecondary }} />

// Avoid: Random sizes and hardcoded colors
<EtoroIcon icon={{ iconName: "heart" }} appearance={{ size: 23, color: "#FF0000" }} /> // Don't do this`}
        ></CodeBlock>
      </View>

      <View style={styles.section}>
        <EtText variant="heading-base" style={styles.sectionTitle}>
          📋 Available Icons
        </EtText>

        <EtText style={styles.availableIconsText}>
          See the "Icon Gallery" story for a complete visual reference of all 50+ available icons, organized by category with copy-to-clipboard
          functionality.
        </EtText>

        <CodeBlock
          title="Popular Icons"
          code={`// Navigation
"home", "search", "portfolio", "watchlist", "discover"

// Trading & Finance  
"trading", "wallet", "coins", "btc", "deposit", "gainers", "losers"

// User Actions
"plus", "minus", "heart", "like", "share", "comment"

// UI Controls
"chevronRight", "chevronLeft", "close", "settings", "more"

// Brands & Assets
"apple", "metaDark", "googleDark", "btc"`}
        ></CodeBlock>
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
  featureList: {
    gap: 8,
  },
  featureItem: {
    lineHeight: 20,
  },
  codeBlock: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
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
    minWidth: 100,
  },
  colorLabel: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
  categoryShowcase: {
    gap: 20,
    marginBottom: 16,
  },
  categoryItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryTitle: {
    marginBottom: 8,
  },
  categoryIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  tipsList: {
    gap: 8,
    marginBottom: 16,
  },
  tipItem: {
    lineHeight: 20,
    opacity: 0.8,
  },
  availableIconsText: {
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  footerSubtext: {
    textAlign: 'center',
    lineHeight: 20,
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
