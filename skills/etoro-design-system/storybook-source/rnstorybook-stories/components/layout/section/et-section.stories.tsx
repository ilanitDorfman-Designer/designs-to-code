import type { Meta, StoryObj } from '@storybook/react-native';
import { EtListItem, EtSection, EtText, EtToggle, usePagination } from 'etoro-ui';
import { ChipsGroupItem } from 'etoro-ui/components/controls/chips-group-v2/api';
import { useEtoroTheme } from 'etoro-ui/core';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

// Sample chip data
const filterChips: ChipsGroupItem[] = [
  { id: 'all', label: 'All' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'etfs', label: 'ETFs' },
  { id: 'indices', label: 'Indices' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'currencies', label: 'Currencies' },
];

const periodOptions = ['1D', '1W', '1M', '3M', '1Y', 'All'];

const meta: Meta<typeof EtSection> = {
  title: 'eToro-UI/Components/Layout/EtSection/Component',
  component: EtSection,
  parameters: {
    notes: 'Flexible section container with static title, select title, and content areas.',
  },
  decorators: [
    (Story) => {
      const { colors } = useEtoroTheme();
      return (
        <View style={[styles.decorator, { backgroundColor: colors.bgNeutralPrimary }]}>
          <Story />
        </View>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof EtSection>;

// Normal title with chips — both layout variants
export const NormalTitleWithChips: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const [selectedEdge, setSelectedEdge] = useState<string | null>('all');
    const [selectedPadded, setSelectedPadded] = useState<string | null>('all');

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Edge-to-Edge
          </EtText>
          <EtSection>
            <EtSection.Title>My Watchlist</EtSection.Title>
            <EtSection.Chips
              items={filterChips}
              selectionMode="single"
              value={selectedEdge}
              onChange={setSelectedEdge}
              style={styles.fullWidthBreakout}
            />
          </EtSection>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.dividerPrimary }]} />

        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Padded (aligned with title)
          </EtText>
          <EtSection>
            <EtSection.Title>My Watchlist</EtSection.Title>
            <EtSection.Chips
              items={filterChips}
              selectionMode="single"
              value={selectedPadded}
              onChange={setSelectedPadded}
              style={styles.fullWidthBreakout}
              contentContainerStyle={{ paddingHorizontal: PAGE_PADDING }}
            />
          </EtSection>
        </View>
      </ScrollView>
    );
  },
};

// Select title with chips — both layout variants
export const SelectTitleWithChips: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const [selectedPeriod, setSelectedPeriod] = useState('1M');
    const [filterEdge, setFilterEdge] = useState<string | null>('all');
    const [filterPadded, setFilterPadded] = useState<string | null>('all');

    const handlePeriodPress = () => {
      const currentIndex = periodOptions.indexOf(selectedPeriod);
      const nextIndex = (currentIndex + 1) % periodOptions.length;
      setSelectedPeriod(periodOptions[nextIndex]);
    };

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Edge-to-Edge
          </EtText>
          <EtSection>
            <EtSection.SelectTitle text={selectedPeriod} onPress={handlePeriodPress} accessibilityHint="Opens period selector" />
            <EtSection.Chips
              items={filterChips}
              selectionMode="single"
              value={filterEdge}
              onChange={setFilterEdge}
              style={styles.fullWidthBreakout}
            />
          </EtSection>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.dividerPrimary }]} />

        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Padded (aligned with title)
          </EtText>
          <EtSection>
            <EtSection.SelectTitle text={selectedPeriod} onPress={handlePeriodPress} accessibilityHint="Opens period selector" />
            <EtSection.Chips
              items={filterChips}
              selectionMode="single"
              value={filterPadded}
              onChange={setFilterPadded}
              style={styles.fullWidthBreakout}
              contentContainerStyle={{ paddingHorizontal: PAGE_PADDING }}
            />
          </EtSection>
        </View>
      </ScrollView>
    );
  },
};

// Empty title (no content)
export const EmptyTitle: Story = {
  render: () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.section}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Title Only (No Content)
        </EtText>

        <EtSection>
          <EtSection.Title>Recent Activity</EtSection.Title>
        </EtSection>
      </View>
    </ScrollView>
  ),
};

// Normal title with text content
export const NormalTitleWithContent: Story = {
  render: () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.section}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Static Title + Text Content
        </EtText>

        <EtSection>
          <EtSection.Title>About eToro</EtSection.Title>
          <EtSection.Content>
            <View style={styles.textContainer}>
              <EtText variant="body-base-regular">
                eToro is a social trading and multi-asset brokerage company that focuses on providing financial and copy trading services.
              </EtText>
            </View>
          </EtSection.Content>
        </EtSection>
      </View>
    </ScrollView>
  ),
};

// Select title with text content
export const SelectTitleWithContent: Story = {
  render: () => {
    const [selectedSection, setSelectedSection] = useState('About');
    const sections = ['About', 'Terms', 'Privacy', 'Help'];

    const handleSectionPress = () => {
      const currentIndex = sections.indexOf(selectedSection);
      const nextIndex = (currentIndex + 1) % sections.length;
      setSelectedSection(sections[nextIndex]);
    };

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Select Title + Text Content
          </EtText>

          <EtSection>
            <EtSection.SelectTitle text={selectedSection} onPress={handleSectionPress} accessibilityHint="Switch section" />
            <EtSection.Content>
              <View style={styles.textContainer}>
                <EtText variant="body-base-regular">
                  eToro is a social trading and multi-asset brokerage company that focuses on providing financial and copy trading services.
                </EtText>
              </View>
            </EtSection.Content>
          </EtSection>

          <EtText variant="body-secondary-regular" style={styles.hint}>
            Tap the title to switch sections
          </EtText>
        </View>
      </ScrollView>
    );
  },
};

// Title with carousel + pagination
const PAGE_PADDING = 16;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_SPACING = 8;
const CARD_WIDTH = SCREEN_WIDTH - PAGE_PADDING * 2; // Full page width (FlatList breaks out with negative margin)
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;
const TOTAL_CARDS = 5;

const carouselItems = Array.from({ length: TOTAL_CARDS }, (_, i) => ({
  id: i,
  title: `Card ${i + 1}`,
  description: `This is the content of card ${i + 1}. Replace with your own content.`,
}));

// Carousel + pagination — both layout variants
export const TitleWithPagination: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    const edge = usePagination({
      totalPages: TOTAL_CARDS,
      itemWidth: SNAP_INTERVAL,
    });
    const padded = usePagination({
      totalPages: TOTAL_CARDS,
      itemWidth: SNAP_INTERVAL,
    });

    const renderCard = ({ item }: { item: (typeof carouselItems)[number] }) => (
      <View style={[carouselStyles.card, { width: CARD_WIDTH, backgroundColor: colors.bgNeutralGreyPrimary }]}>
        <EtText variant="body-base-semibold">{item.title}</EtText>
        <EtText variant="body-secondary-regular">{item.description}</EtText>
      </View>
    );

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Edge-to-Edge
          </EtText>
          <EtSection>
            <EtSection.Title>Featured</EtSection.Title>
            <Animated.FlatList
              horizontal
              data={carouselItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCard}
              onScroll={edge.scrollHandler}
              scrollEventThrottle={16}
              snapToInterval={SNAP_INTERVAL}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              style={styles.fullWidthBreakout}
              contentContainerStyle={carouselStyles.listContent}
            />
            <EtSection.Pagination
              totalPages={TOTAL_CARDS}
              currentPage={edge.currentPageAnimated}
              style={[styles.fullWidthBreakout, { backgroundColor: colors.bgNeutralPrimary }]}
            />
          </EtSection>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.dividerPrimary }]} />

        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Padded (aligned with title)
          </EtText>
          <EtSection>
            <EtSection.Title>Featured</EtSection.Title>
            <Animated.FlatList
              horizontal
              data={carouselItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCard}
              onScroll={padded.scrollHandler}
              scrollEventThrottle={16}
              snapToInterval={SNAP_INTERVAL}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              style={styles.fullWidthBreakout}
              contentContainerStyle={[carouselStyles.listContent, { paddingHorizontal: PAGE_PADDING }]}
            />
            <EtSection.Pagination
              totalPages={TOTAL_CARDS}
              currentPage={padded.currentPageAnimated}
              style={[styles.fullWidthBreakout, { backgroundColor: colors.bgNeutralPrimary }]}
            />
          </EtSection>
        </View>
      </ScrollView>
    );
  },
};

// Different content types
export const DifferentContentTypes: Story = {
  render: () => {
    const { colors } = useEtoroTheme();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Section with List Items
          </EtText>
          <EtSection>
            <EtSection.Title>Account Settings</EtSection.Title>
            <EtSection.Content>
              <View style={styles.listContainer}>
                <EtListItem
                  content={{
                    title: 'Profile',
                    subtitle: 'View and edit your profile',
                  }}
                  visual={{ leftIcon: 'user' }}
                  interaction={{ onPress: () => {} }}
                />
                <EtListItem
                  content={{
                    title: 'Security',
                    subtitle: 'Password and authentication',
                  }}
                  visual={{ leftIcon: 'fingerPrint' }}
                  interaction={{ onPress: () => {} }}
                />
                <EtListItem
                  content={{
                    title: 'Privacy',
                    subtitle: 'Control your data',
                  }}
                  visual={{ leftIcon: 'privacy' }}
                  interaction={{ onPress: () => {} }}
                />
              </View>
            </EtSection.Content>
          </EtSection>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.dividerPrimary }]} />

        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Section with Toggle Controls
          </EtText>
          <EtSection>
            <EtSection.Title>Preferences</EtSection.Title>
            <EtSection.Content>
              <View style={styles.controlsContainer}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleText}>
                    <EtText variant="body-base-semibold">Notifications</EtText>
                    <EtText variant="body-secondary-regular">Receive push notifications</EtText>
                  </View>
                  <EtToggle value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
                </View>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleText}>
                    <EtText variant="body-base-semibold">Dark Mode</EtText>
                    <EtText variant="body-secondary-regular">Use dark theme</EtText>
                  </View>
                  <EtToggle value={darkModeEnabled} onValueChange={setDarkModeEnabled} />
                </View>
              </View>
            </EtSection.Content>
          </EtSection>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.dividerPrimary }]} />

        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Section with Text Content
          </EtText>
          <EtSection>
            <EtSection.Title>About</EtSection.Title>
            <EtSection.Content>
              <View style={styles.textContainer}>
                <EtText variant="body-base-regular">
                  eToro is a social trading and multi-asset brokerage company that focuses on providing financial and copy trading services.
                </EtText>
              </View>
            </EtSection.Content>
          </EtSection>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.dividerPrimary }]} />

        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Empty Section (Title Only)
          </EtText>
          <EtSection>
            <EtSection.Title>Coming Soon</EtSection.Title>
          </EtSection>
        </View>
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  valueLabel: {
    fontFamily: 'monospace',
    marginTop: 50,
  },
  hint: {
    marginTop: 50,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  listContainer: {
    gap: 12,
  },
  controlsContainer: {
    gap: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  toggleText: {
    flex: 1,
    gap: 4,
  },
  textContainer: {
    gap: 12,
  },
  textSpacing: {
    marginTop: 4,
  },
  fullWidthBreakout: {
    marginHorizontal: -PAGE_PADDING,
  },
});

const carouselStyles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 16,
    gap: 8,
  },
  listContent: {
    gap: CARD_SPACING,
  },
});
