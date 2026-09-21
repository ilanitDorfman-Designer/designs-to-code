import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { EtoroIcon, EtText, IconName } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<typeof EtoroIcon>;

// All available icons from the component
const availableIcons = [
  'map',
  'plus',
  'user',
  'settings',
  'logout',
  'chevronRight',
  'chevronLeft',
  'creditCard',
  'heart',
  'chat',
  'apple',
  'mail',
  'close',
  'closeSmall',
  'wallet',
  'portfolio',
  'discover',
  'watchlist',
  'home',
  'search',
  'faceId',
  'fingerPrint',
  'etorianClub',
  'inviteFriends',
  'support',
  'menu',
  'display',
  'trading',
  'notification',
  'privacy',
  'coins',
  'minus',
  'deposit',
  'more',
  'calendar',
  'academy',
  'eyeOff',
  'eye',
  'appleDark',
  'metaDark',
  'googleDark',
  'gainers',
  'losers',
  'moreVertical',
  'news',
  'upcomingEvent',
  'yeild',
  'btc',
  'ai',
  'watched',
  'like',
  'comment',
  'share',
  'switchUnits',
  'torii',
  'checked',
];

const meta: Meta<typeof EtoroIcon> = {
  title: 'eToro-UI/Foundations/Icon & Assets',
  component: EtoroIcon,
  parameters: {
    notes: 'Central icon system for the eToro design system. Provides consistent icons across the app.',
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

// Interactive story with controls
export const Interactive: Story = {
  render: (args) => (
    <View style={styles.showcase}>
      <EtoroIcon {...args} />
      <EtText variant="body-secondary-regular" style={styles.iconName}>
        {args.icon.iconName}
      </EtText>
    </View>
  ),
  args: {
    icon: { iconName: 'apple' },
    appearance: { size: 32, color: '#1F2937' },
    advanced: { cache: false, svgProps: { fill: '#3B82F6' } },
  },
  argTypes: {
    icon: {
      control: 'select',
      options: availableIcons,
    },
    appearance: {
      control: { type: 'range', min: 12, max: 64, step: 2 },
    },
    advanced: {
      control: 'color',
    },
  },
};

// Icon gallery - shows all available icons
export const IconGallery: Story = {
  render: () => {
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
    const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
    const { colors } = useEtoroTheme();
    const handleIconPress = (iconName: string) => {
      setSelectedIcon(iconName);
      setCopiedIcon(iconName);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedIcon(null), 2000);
    };

    return (
      <ScrollView style={styles.galleryContainer}>
        <View style={styles.header}>
          <EtText variant="heading-compact" style={styles.title}>
            eToro Icon Gallery
          </EtText>
          <EtText variant="body-secondary-regular" style={styles.subtitle}>
            Tap any icon to copy its name
          </EtText>
        </View>

        <View style={styles.iconGrid}>
          {availableIcons.map((iconName) => (
            <Pressable
              key={iconName}
              style={[styles.iconItem, selectedIcon === iconName && styles.selectedIconItem, copiedIcon === iconName && styles.copiedIconItem]}
              onPress={() => handleIconPress(iconName)}
            >
              <EtoroIcon icon={{ iconName: iconName as IconName }} appearance={{ size: 24, color: colors.textPrimaryNeutral }} />
              <EtText variant="body-tiny-regular" style={styles.iconLabel} numberOfLines={2}>
                {iconName}
              </EtText>
              {copiedIcon === iconName && (
                <View style={styles.copiedIndicator}>
                  <EtText variant="body-tiny-regular" style={styles.copiedText}>
                    Copied!
                  </EtText>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {selectedIcon && (
          <View style={styles.selectedIconInfo}>
            <EtText variant="body-base-semibold" style={styles.selectedTitle}>
              Selected: {selectedIcon}
            </EtText>
            <View style={styles.codeBlock}>
              <EtText variant="body-secondary-regular" style={styles.codeText}>
                {`<EtoroIcon iconName="${selectedIcon}" size={24} />`}
              </EtText>
            </View>
          </View>
        )}
      </ScrollView>
    );
  },
  args: {},
};

// Size variants
export const SizeVariants: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Icon Sizes
      </EtText>

      <View style={styles.sizeGrid}>
        {[12, 16, 20, 24, 32, 40, 48, 56].map((size) => (
          <View key={size} style={styles.sizeItem}>
            <EtoroIcon icon={{ iconName: 'apple' }} appearance={{ size: size }} />
            <EtText variant="body-tiny-regular" style={styles.sizeLabel}>
              {size}px
            </EtText>
          </View>
        ))}
      </View>
    </View>
  ),
  args: {},
};

// Color variants
export const ColorVariants: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Color Variants
      </EtText>

      <View style={styles.colorGrid}>
        {[
          { name: 'Default', color: '#374151' },
          { name: 'Primary', color: '#3B82F6' },
          { name: 'Success', color: '#10B981' },
          { name: 'Warning', color: '#F59E0B' },
          { name: 'Error', color: '#EF4444' },
          { name: 'Purple', color: '#8B5CF6' },
        ].map(({ name, color }) => (
          <View key={name} style={styles.colorItem}>
            <EtoroIcon icon={{ iconName: 'heart' }} appearance={{ size: 32, color: color }} />
            <EtText variant="body-tiny-regular" style={styles.colorLabel}>
              {name}
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.colorValue}>
              {color}
            </EtText>
          </View>
        ))}
      </View>
    </View>
  ),
  args: {},
};

// Category showcase
export const Categories: Story = {
  render: () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Icon Categories
      </EtText>

      {/* Navigation Icons */}
      <View style={styles.categorySection}>
        <EtText variant="body-base-semibold" style={styles.categoryTitle}>
          Navigation
        </EtText>
        <View style={styles.categoryGrid}>
          {['home', 'search', 'portfolio', 'watchlist', 'discover', 'menu', 'chevronRight', 'chevronLeft'].map((iconName) => (
            <View key={iconName} style={styles.categoryItem}>
              <EtoroIcon icon={{ iconName: iconName as IconName }} appearance={{ size: 24 }} />
              <EtText variant="body-tiny-regular" style={styles.categoryLabel}>
                {iconName}
              </EtText>
            </View>
          ))}
        </View>
      </View>

      {/* Trading Icons */}
      <View style={styles.categorySection}>
        <EtText variant="body-base-semibold" style={styles.categoryTitle}>
          Trading & Finance
        </EtText>
        <View style={styles.categoryGrid}>
          {['trading', 'wallet', 'coins', 'btc', 'deposit', 'gainers', 'losers', 'yeild'].map((iconName) => (
            <View key={iconName} style={styles.categoryItem}>
              <EtoroIcon icon={{ iconName: iconName as IconName }} appearance={{ size: 24 }} />
              <EtText variant="body-tiny-regular" style={styles.categoryLabel}>
                {iconName}
              </EtText>
            </View>
          ))}
        </View>
      </View>

      {/* User & Account Icons */}
      <View style={styles.categorySection}>
        <EtText variant="body-base-semibold" style={styles.categoryTitle}>
          User & Account
        </EtText>
        <View style={styles.categoryGrid}>
          {['user', 'settings', 'logout', 'faceId', 'fingerPrint', 'privacy', 'support'].map((iconName) => (
            <View key={iconName} style={styles.categoryItem}>
              <EtoroIcon icon={{ iconName: iconName as IconName }} appearance={{ size: 24 }} />
              <EtText variant="body-tiny-regular" style={styles.categoryLabel}>
                {iconName}
              </EtText>
            </View>
          ))}
        </View>
      </View>

      {/* Actions Icons */}
      <View style={styles.categorySection}>
        <EtText variant="body-base-semibold" style={styles.categoryTitle}>
          Actions
        </EtText>
        <View style={styles.categoryGrid}>
          {['plus', 'minus', 'close', 'like', 'heart', 'share', 'comment', 'more', 'checked'].map((iconName) => (
            <View key={iconName} style={styles.categoryItem}>
              <EtoroIcon icon={{ iconName: iconName as IconName }} appearance={{ size: 24, color: '#374151' }} />
              <EtText variant="body-tiny-regular" style={styles.categoryLabel}>
                {iconName}
              </EtText>
            </View>
          ))}
        </View>
      </View>

      {/* Brand Icons */}
      <View style={styles.categorySection}>
        <EtText variant="body-base-semibold" style={styles.categoryTitle}>
          Brand & Social
        </EtText>
        <View style={styles.categoryGrid}>
          {['apple', 'appleDark', 'metaDark', 'googleDark', 'etorianClub', 'torii'].map((iconName) => (
            <View key={iconName} style={styles.categoryItem}>
              <EtoroIcon icon={{ iconName: iconName as IconName }} appearance={{ size: 24 }} />
              <EtText variant="body-tiny-regular" style={styles.categoryLabel}>
                {iconName}
              </EtText>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  ),
  args: {},
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  scrollView: {
    width: '100%',
    maxWidth: 400,
  },
  showcase: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  galleryContainer: {
    flex: 1,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  iconName: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  iconItem: {
    width: '23%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,

    marginBottom: 8,
  },
  selectedIconItem: {
    borderColor: '#3B82F6',
  },
  copiedIconItem: {
    // borderColor: '#10B981',
  },
  iconLabel: {
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.7,
  },
  copiedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  copiedText: {
    fontSize: 8,
  },
  selectedIconInfo: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  selectedTitle: {
    marginBottom: 8,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  codeText: {
    fontFamily: 'Courier',
    // color: '#374151',
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  sizeItem: {
    alignItems: 'center',
    padding: 12,
  },
  sizeLabel: {
    marginTop: 4,
    opacity: 0.7,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
    marginTop: 16,
  },
  colorItem: {
    alignItems: 'center',
    padding: 12,
    minWidth: 80,
  },
  colorLabel: {
    marginTop: 4,
    fontWeight: '600',
  },
  colorValue: {
    marginTop: 2,
    opacity: 0.7,
    fontFamily: 'Courier',
  },
  categorySection: {
    marginBottom: 32,
    width: '100%',
  },
  categoryTitle: {
    marginBottom: 12,
    fontSize: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 8,
    minWidth: 60,
  },
  categoryLabel: {
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.7,
  },
});
