import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { EtText } from 'etoro-ui';
import { EtIconV2, getOrFetchIconMetadata, IconMetadataRegistry, IconVariant } from 'etoro-ui/components/et-icon-v2';
import { useEtoroTheme } from 'etoro-ui/core';
import { X1, X2, X3, X4, X5, X6, X8 } from 'etoro-ui/core/styles/spacing';

type Story = StoryObj<typeof EtIconV2>;

const meta: Meta<typeof EtIconV2> = {
  title: 'eToro-UI/Components/Icon V2',
  component: EtIconV2,
  parameters: {
    notes: 'EtIconV2 - Next generation icon system with 4600+ Zappicon icons from CDN.',
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

// Custom hook to fetch icon metadata
function useIconMetadata() {
  const [metadata, setMetadata] = useState<IconMetadataRegistry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrFetchIconMetadata()
      .then((data) => {
        setMetadata(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const allIcons = useMemo(() => {
    if (!metadata) return [];
    return Object.keys(metadata);
  }, [metadata]);

  const categories = useMemo(() => {
    if (!metadata) return [];
    const cats = new Set(Object.values(metadata).map((m) => m.category));
    return Array.from(cats).sort();
  }, [metadata]);

  const getIconsByCategory = useCallback(
    (category: string) => {
      if (!metadata) return [];
      return Object.values(metadata)
        .filter((m) => m.category === category)
        .map((m) => m.name);
    },
    [metadata],
  );

  return {
    metadata,
    allIcons,
    categories,
    getIconsByCategory,
    loading,
    error,
  };
}

// Size variants showcase
export const SizeVariants: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Icon Sizes
      </EtText>
      <View style={styles.sizeGrid}>
        {(['sm', 'md', 'lg', 48, 64] as const).map((size) => (
          <View key={String(size)} style={styles.sizeItem}>
            <EtIconV2 name="gear" size={size} />
            <EtText variant="body-tiny-regular" style={styles.sizeLabel}>
              {typeof size === 'string' ? size : `${size}px`}
            </EtText>
          </View>
        ))}
      </View>
    </View>
  ),
};

// Variant showcase
export const VariantShowcase: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Icon Variants
      </EtText>
      <View style={styles.variantGrid}>
        {Object.values(IconVariant).map((variant) => (
          <View key={variant} style={styles.variantItem}>
            <EtIconV2 name="heart" size="lg" variant={variant} />
            <EtText variant="body-tiny-regular" style={styles.variantLabel}>
              {variant}
            </EtText>
          </View>
        ))}
      </View>
    </View>
  ),
};

// Color variants
export const ColorVariants: Story = {
  render: () => {
    const colorOptions = [
      { name: 'Default', color: '#374151' },
      { name: 'Primary', color: '#3B82F6' },
      { name: 'Success', color: '#10B981' },
      { name: 'Warning', color: '#F59E0B' },
      { name: 'Error', color: '#EF4444' },
      { name: 'Purple', color: '#8B5CF6' },
    ];

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Color Variants
        </EtText>
        <View style={styles.colorGrid}>
          {colorOptions.map(({ name, color }) => (
            <View key={name} style={styles.colorItem}>
              <EtIconV2 name="heart" size="lg" color={color} variant={IconVariant.Filled} />
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
    );
  },
};

// Toast component for copy feedback
function CopyToast({ visible, message }: { visible: boolean; message: string }) {
  const opacity = useState(() => new Animated.Value(0))[0];
  const translateY = useState(() => new Animated.Value(20))[0];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <EtText variant="body-secondary-medium" style={styles.toastText}>
        {message}
      </EtText>
    </Animated.View>
  );
}

// Icons that only have filled variant (no regular)
const FILLED_ONLY_ICONS = ['dot-large', 'ellipsis-vertical', 'google', 'meta', 'star'];

// Full icon gallery with search - fetches from CDN
export const IconsGallery: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const { colors } = useEtoroTheme();

    const { allIcons, categories, getIconsByCategory, loading, error } = useIconMetadata();

    const filteredIcons = useMemo(() => {
      let icons = selectedCategory ? getIconsByCategory(selectedCategory) : allIcons;

      if (searchQuery) {
        icons = icons.filter((icon) => icon.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      return icons;
    }, [searchQuery, selectedCategory, allIcons, getIconsByCategory]);

    const handleIconPress = useCallback((iconName: string) => {
      Clipboard.setStringAsync(`<EtIconV2 name="${iconName}" />`);
      setCopiedIcon(iconName);
      setToastMessage(`Copied: ${iconName}`);
      setTimeout(() => {
        setCopiedIcon(null);
        setToastMessage('');
      }, 2000);
    }, []);

    const renderIcon = useCallback(
      ({ item }: { item: string }) => {
        const useFilled = FILLED_ONLY_ICONS.includes(item);
        return (
          <Pressable
            style={[styles.iconItem, { borderColor: colors.dividerPrimary }, copiedIcon === item && styles.copiedIconItem]}
            onPress={() => handleIconPress(item)}
          >
            <EtIconV2 name={item} size="md" variant={useFilled ? IconVariant.Filled : undefined} />
            <EtText variant="body-tiny-regular" style={styles.iconLabel} numberOfLines={2}>
              {item}
              {useFilled ? ' (filled)' : ''}
            </EtText>
          </Pressable>
        );
      },
      [colors.dividerPrimary, copiedIcon, handleIconPress],
    );

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.actionBrandText} />
          <EtText variant="body-secondary-regular" style={styles.loadingText}>
            Loading icon metadata from CDN...
          </EtText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <EtText variant="body-base-semibold" style={styles.errorTitle}>
            Failed to load icons
          </EtText>
          <EtText variant="body-secondary-regular" style={styles.errorText}>
            {error}
          </EtText>
        </View>
      );
    }

    return (
      <View style={styles.galleryContainer}>
        <View style={styles.galleryHeader}>
          <EtText variant="heading-compact">
            Icons Gallery ({filteredIcons.length} of {allIcons.length} icons)
          </EtText>
          <EtText variant="body-tiny-regular" style={styles.categoryCountText}>
            {categories.length} categories
          </EtText>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.bgNeutralQuaternary,
                color: colors.textPrimaryNeutral,
                borderColor: colors.dividerPrimary,
              },
            ]}
            placeholder="Search icons..."
            placeholderTextColor={colors.textSecondaryNeutral}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.categoryWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollContent}>
            <Pressable
              style={({ pressed }) => [
                styles.categoryChip,
                {
                  backgroundColor: !selectedCategory ? colors.actionBrandText : colors.bgNeutralSecondary,
                  borderColor: !selectedCategory ? colors.actionBrandText : colors.dividerPrimary,
                },
                pressed && styles.categoryChipPressed,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <EtText
                variant="body-secondary-medium"
                style={{
                  color: !selectedCategory ? '#FFFFFF' : colors.textPrimaryNeutral,
                }}
              >
                All
              </EtText>
            </Pressable>
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <Pressable
                  key={category}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    {
                      backgroundColor: isActive ? colors.actionBrandText : colors.bgNeutralSecondary,
                      borderColor: isActive ? colors.actionBrandText : colors.dividerPrimary,
                    },
                    pressed && styles.categoryChipPressed,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <EtText
                    variant="body-secondary-medium"
                    style={{
                      color: isActive ? '#FFFFFF' : colors.textPrimaryNeutral,
                    }}
                  >
                    {category}
                  </EtText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <FlatList
          data={filteredIcons}
          renderItem={renderIcon}
          keyExtractor={(item) => item}
          numColumns={4}
          contentContainerStyle={styles.iconGridContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={5}
        />

        <CopyToast visible={!!toastMessage} message={toastMessage} />
      </View>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: X4,
  },
  showcase: {
    alignItems: 'center',
    paddingVertical: X4,
  },
  title: {
    marginBottom: X4,
    textAlign: 'center',
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: X6,
    marginTop: X4,
  },
  sizeItem: {
    alignItems: 'center',
    padding: X3,
  },
  sizeLabel: {
    marginTop: X2,
    opacity: 0.7,
  },
  variantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: X4,
    marginTop: X4,
  },
  variantItem: {
    alignItems: 'center',
    padding: X3,
    minWidth: 80,
  },
  variantLabel: {
    marginTop: X2,
    opacity: 0.7,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: X4,
    marginTop: X4,
  },
  colorItem: {
    alignItems: 'center',
    padding: X3,
    minWidth: 80,
  },
  colorLabel: {
    marginTop: X1,
    fontWeight: '600',
  },
  colorValue: {
    marginTop: 2,
    opacity: 0.7,
    fontFamily: 'Courier',
  },
  // Loading & Error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: X8,
  },
  loadingText: {
    marginTop: X4,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: X8,
  },
  errorTitle: {
    color: '#EF4444',
    marginBottom: X2,
  },
  errorText: {
    opacity: 0.7,
    textAlign: 'center',
  },
  // Gallery styles
  galleryContainer: {
    flex: 1,
  },
  galleryHeader: {
    marginBottom: X4,
  },
  categoryCountText: {
    opacity: 0.6,
    marginTop: X1,
  },
  searchInput: {
    marginTop: X3,
    paddingHorizontal: X4,
    paddingVertical: X3,
    borderRadius: X2,
    borderWidth: 1,
    fontSize: 16,
  },
  categoryWrapper: {
    marginBottom: X5,
  },
  categoryScrollContent: {
    paddingHorizontal: X1,
    gap: X2,
  },
  categoryChip: {
    paddingHorizontal: X4,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
  },
  categoryChipPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  iconGridContent: {
    gap: X2,
  },
  iconItem: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: X2,
    margin: X1,
    borderRadius: X2,
    borderWidth: 1,
    maxWidth: '23%',
  },
  copiedIconItem: {
    borderColor: '#10B981',
    backgroundColor: '#10B98110',
  },
  iconLabel: {
    marginTop: X1,
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 10,
  },
  // Toast styles
  toast: {
    position: 'absolute',
    bottom: X6,
    left: X4,
    right: X4,
    backgroundColor: '#1F2937',
    paddingHorizontal: X5,
    paddingVertical: 14,
    borderRadius: X3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: X1 },
    shadowOpacity: 0.15,
    shadowRadius: X3,
    elevation: 8,
  },
  toastText: {
    color: '#FFFFFF',
  },
});
