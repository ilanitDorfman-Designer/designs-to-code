import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

import { EtStory, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

// Theme-aware card component
function DemoCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { colors } = useEtoroTheme();
  return <View style={[styles.demoCard, { backgroundColor: colors.bgNeutralSecondary }, style]}>{children}</View>;
}
DemoCard.displayName = 'DemoCard';

type Story = StoryObj<typeof EtStory>;

const meta: Meta<typeof EtStory> = {
  title: 'eToro-UI/Components/DataDisplay/EtStory',
  component: EtStory,
  parameters: {
    notes:
      'Circular avatar component with watched state indicator for users and instruments. Displays a 56x56px circular avatar with optional green ring border (64x64px) when unwatched. Use variant="instrument" for gradient overlay on instrument logos.',
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
  render: () => {
    const [watched1, setWatched1] = useState(false);
    const [watched2, setWatched2] = useState(true);
    const [watched3, setWatched3] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingWatched, setLoadingWatched] = useState(false);
    const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    }, []);

    const handleLoadingPress = () => {
      setLoading(true);
      loadingTimeoutRef.current = setTimeout(() => {
        setLoading(false);
        setLoadingWatched(true);
      }, 3000);
    };

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Interactive Stories
          </EtText>

          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Toggle Watched State
            </EtText>
            <View style={styles.storyRow}>
              <EtStory
                imageSource="https://etoro-cdn.etorostatic.com/market-avatars/aapl/150x150.png"
                variant="instrument"
                watched={watched1}
                onPress={() => setWatched1(!watched1)}
              >
                <EtStory.Label>AAPL</EtStory.Label>
              </EtStory>
              <EtStory
                imageSource="https://etoro-cdn.etorostatic.com/market-avatars/goog/150x150.png"
                variant="instrument"
                watched={watched2}
                onPress={() => setWatched2(!watched2)}
              >
                <EtStory.Label>GOOG</EtStory.Label>
              </EtStory>
              <EtStory
                imageSource="https://etoro-cdn.etorostatic.com/market-avatars/msft/150x150.png"
                variant="instrument"
                watched={watched3}
                onPress={() => setWatched3(!watched3)}
              >
                <EtStory.Label>MSFT</EtStory.Label>
              </EtStory>
            </View>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Tap stories to toggle watched state
            </EtText>
          </DemoCard>

          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Loading State
            </EtText>
            <View style={styles.storyRow}>
              <EtStory
                imageSource="https://etoro-cdn.etorostatic.com/market-avatars/tsla/150x150.png"
                variant="instrument"
                loading={loading}
                watched={loadingWatched}
                onPress={handleLoadingPress}
              >
                <EtStory.Label>TSLA</EtStory.Label>
              </EtStory>
            </View>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Tap story to trigger 3s loading, then mark as watched
            </EtText>
          </DemoCard>
        </View>
      </ScrollView>
    );
  },
};

export const States: Story = {
  render: () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.variantSection}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          States Comparison
        </EtText>

        <DemoCard>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Unwatched vs Watched
          </EtText>
          <View style={styles.storyRow}>
            <View style={styles.storyColumn}>
              <EtStory imageSource="https://etoro-cdn.etorostatic.com/market-avatars/aapl/150x150.png" variant="instrument" watched={false}>
                <EtStory.Label>AAPL</EtStory.Label>
              </EtStory>
              <EtText variant="body-secondary-regular" style={styles.stateLabel}>
                Unwatched
              </EtText>
            </View>
            <View style={styles.storyColumn}>
              <EtStory imageSource="https://etoro-cdn.etorostatic.com/market-avatars/aapl/150x150.png" variant="instrument" watched={true}>
                <EtStory.Label>AAPL</EtStory.Label>
              </EtStory>
              <EtText variant="body-secondary-regular" style={styles.stateLabel}>
                Watched
              </EtText>
            </View>
          </View>
        </DemoCard>

        <DemoCard>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Variant: Default vs Instrument
          </EtText>
          <View style={styles.storyRow}>
            <View style={styles.storyColumn}>
              <EtStory imageSource="https://randomuser.me/api/portraits/women/44.jpg" variant="default">
                <EtStory.Label>Sarah</EtStory.Label>
              </EtStory>
              <EtText variant="body-secondary-regular" style={styles.stateLabel}>
                Default (User)
              </EtText>
            </View>
            <View style={styles.storyColumn}>
              <EtStory imageSource="https://etoro-cdn.etorostatic.com/market-avatars/aapl/150x150.png" variant="instrument">
                <EtStory.Label>AAPL</EtStory.Label>
              </EtStory>
              <EtText variant="body-secondary-regular" style={styles.stateLabel}>
                Instrument
              </EtText>
            </View>
          </View>
          <EtText variant="body-secondary-regular" style={styles.valueLabel}>
            Default has no overlay, Instrument has gradient overlay
          </EtText>
        </DemoCard>
      </View>
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    width: '100%',
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  variantSection: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  demoCard: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demoTitle: {
    marginBottom: 4,
  },
  storyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 24,
    paddingVertical: 16,
  },
  storyColumn: {
    alignItems: 'center',
    gap: 8,
  },
  stateLabel: {
    textAlign: 'center',
    fontSize: 12,
  },
  valueLabel: {
    marginTop: 4,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});
