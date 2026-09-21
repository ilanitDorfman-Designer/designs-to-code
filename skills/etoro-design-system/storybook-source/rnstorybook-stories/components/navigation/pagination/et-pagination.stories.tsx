import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useRef } from 'react';
import { Alert, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtButton, EtPagination, EtText, PaginationColor, PaginationSize, usePagination } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { X1, X2, X3, X4, X5, X6, X8, X9 } from 'etoro-ui/core/styles/spacing';
import Animated, { useSharedValue } from 'react-native-reanimated';

// Wrapper for interactive stories - uses shared value internally
const EtPaginationWrapper = (props: any) => {
  const currentPage = useSharedValue(props.currentPage || 0);

  // Sync with storybook controls
  useEffect(() => {
    currentPage.value = props.currentPage || 0;
  }, [props.currentPage, currentPage]);

  return (
    <EtPagination
      totalPages={props.totalPages}
      currentPage={currentPage}
      size={props.size}
      color={props.color}
      style={props.style}
      testID={props.testID}
      accessibilityLabel={props.accessibilityLabel}
    />
  );
};

// Helper component for static pagination displays
const StaticPagination = ({
  totalPages,
  page,
  size,
  color,
}: {
  totalPages: number;
  page: number;
  size?: PaginationSize;
  color?: PaginationColor;
}) => {
  return <EtPagination totalPages={totalPages} currentPage={page} size={size} color={color} />;
};

// CodeBlock component for displaying code snippets
const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = async (codeText: string) => {
    try {
      await Clipboard.setStringAsync(codeText);
      Alert.alert('Code Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Copy Failed', 'Could not copy code to clipboard', [{ text: 'OK' }]);
    }
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
        <View style={[styles.codeHeader, { borderBottomColor: colors.dividerPrimary }]}>
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

const meta: Meta<typeof EtPaginationWrapper> = {
  title: 'eToro-UI/Components/Navigation/EtPagination',
  component: EtPaginationWrapper,
  argTypes: {
    // Required
    totalPages: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Total number of pages',
    },
    currentPage: {
      control: { type: 'number', min: 0 },
      description: 'Current active page (0-indexed). Accepts number or SharedValue<number>',
    },
    // Appearance
    size: {
      control: { type: 'select', options: ['small', 'large'] },
      description: 'Size variant of the dots',
    },
    color: {
      control: { type: 'select', options: ['neutral', 'primary'] },
      description: 'Color variant of the dots',
    },
    // Accessibility
    testID: {
      control: { type: 'text' },
      description: 'Test ID for testing',
    },
    accessibilityLabel: {
      control: { type: 'text' },
      description: 'Accessibility label',
    },
  },
  args: {
    totalPages: 5,
    currentPage: 0,
    size: 'small',
    color: 'neutral',
  },
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

const BASIC_PAGINATION_CODE = `import { EtPagination } from 'etoro-ui';

// Basic usage with a number
<EtPagination
  totalPages={5}
  currentPage={0}
  size="small"
  color="neutral"
/>

// With state
const [currentPage, setCurrentPage] = useState(0);

<EtPagination
  totalPages={5}
  currentPage={currentPage}
/>`;

export const BasicPagination: Story = {
  args: {
    totalPages: 5,
    currentPage: 0,
    size: 'small',
    color: 'neutral',
  },
  render: (args) => (
    <ScrollView contentContainerStyle={styles.showcaseScrollView}>
      <EtText variant="heading-base" style={styles.storyTitle}>
        Basic Pagination
      </EtText>
      <View style={styles.demoContainer}>
        <EtPaginationWrapper {...args} />
      </View>
      <CodeBlock title="Basic Usage" code={BASIC_PAGINATION_CODE} />
    </ScrollView>
  ),
};

// All size and color combinations
const ALL_VARIATIONS_CODE = `import { EtPagination } from 'etoro-ui';

// Size variants
<EtPagination totalPages={5} currentPage={1} size="small" />
<EtPagination totalPages={5} currentPage={1} size="large" />

// Color variants
<EtPagination totalPages={5} currentPage={1} color="neutral" />
<EtPagination totalPages={5} currentPage={1} color="primary" />

// Different positions
<EtPagination totalPages={5} currentPage={0} /> // First page
<EtPagination totalPages={5} currentPage={2} /> // Middle page
<EtPagination totalPages={5} currentPage={4} /> // Last page`;

export const AllVariations: Story = {
  render: () => (
    <ScrollView style={styles.showcase} contentContainerStyle={styles.showcaseScrollView}>
      <EtText variant="heading-base" style={styles.storyTitle}>
        All Variations
      </EtText>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Size: Small
      </EtText>
      <View style={styles.variationsRow}>
        <View style={styles.variationItem}>
          <EtText variant="body-secondary-regular" style={styles.label}>
            Neutral
          </EtText>
          <StaticPagination totalPages={5} page={1} size="small" color="neutral" />
        </View>
        <View style={styles.variationItem}>
          <EtText variant="body-secondary-regular" style={styles.label}>
            Primary
          </EtText>
          <StaticPagination totalPages={5} page={1} size="small" color="primary" />
        </View>
      </View>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Size: Large
      </EtText>
      <View style={styles.variationsRow}>
        <View style={styles.variationItem}>
          <EtText variant="body-secondary-regular" style={styles.label}>
            Neutral
          </EtText>
          <StaticPagination totalPages={5} page={1} size="large" color="neutral" />
        </View>
        <View style={styles.variationItem}>
          <EtText variant="body-secondary-regular" style={styles.label}>
            Primary
          </EtText>
          <StaticPagination totalPages={5} page={1} size="large" color="primary" />
        </View>
      </View>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Different Selected Positions
      </EtText>
      <View style={styles.positionSection}>
        <View style={styles.positionItem}>
          <EtText variant="body-secondary-regular" style={styles.label}>
            First Page
          </EtText>
          <StaticPagination totalPages={5} page={0} color="primary" />
        </View>
        <View style={styles.positionItem}>
          <EtText variant="body-secondary-regular" style={styles.label}>
            Second Page
          </EtText>
          <StaticPagination totalPages={5} page={1} color="primary" />
        </View>
        <View style={styles.positionItem}>
          <EtText variant="body-secondary-regular" style={styles.label}>
            Middle Page
          </EtText>
          <StaticPagination totalPages={5} page={2} color="primary" />
        </View>
        <View style={styles.positionItem}>
          <EtText variant="body-secondary-regular" style={styles.label}>
            Last Page
          </EtText>
          <StaticPagination totalPages={5} page={4} color="primary" />
        </View>
      </View>

      <CodeBlock title="Variations Usage" code={ALL_VARIATIONS_CODE} />
    </ScrollView>
  ),
  args: {},
};

// Interactive carousel simulation
const SCREEN_WIDTH = Dimensions.get('window').width;
const CONTAINER_PADDING = X4; // padding around the carousel container
const CARD_SPACING = X4;

const CarouselDemo = () => {
  const { colors } = useEtoroTheme();
  const flatListRef = useRef<FlatList>(null);
  const totalPages = 5;

  // Card width leaves some peek of adjacent cards
  const cardWidth = SCREEN_WIDTH - CONTAINER_PADDING * 2 - CARD_SPACING * 2;

  // Side padding to center the first and last cards
  const sidePadding = (SCREEN_WIDTH - cardWidth) / 2;

  // Snap interval is card width + gap
  const snapInterval = cardWidth + CARD_SPACING;

  const carouselData = Array.from({ length: totalPages }, (_, i) => ({
    id: i,
    title: `Image ${i + 1}`,
  }));

  // Use the unified pagination hook for automatic page tracking
  // Pass currentPageAnimated directly to EtPagination to avoid creating a second SharedValue
  const { currentPageAnimated, scrollHandler } = usePagination({
    totalPages,
    itemWidth: snapInterval,
  });

  const renderCarouselItem = ({ item }: { item: { id: number; title: string } }) => (
    <View style={[styles.carouselItem, { width: cardWidth }]}>
      <View style={[styles.carouselImagePlaceholder, { backgroundColor: colors.bgNeutralSecondary }]}>
        <EtText variant="display-main">{item.title}</EtText>
      </View>
    </View>
  );

  const keyExtractor = (item: { id: number; title: string }) => item.id.toString();

  const contentContainerStyle = {
    paddingHorizontal: sidePadding,
    gap: CARD_SPACING,
  };

  return (
    <View style={styles.carouselContainer}>
      <Animated.FlatList
        horizontal
        ref={flatListRef}
        data={carouselData}
        keyExtractor={keyExtractor}
        renderItem={renderCarouselItem}
        style={styles.carouselList}
        contentContainerStyle={contentContainerStyle}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={snapInterval}
        disableIntervalMomentum
        decelerationRate="fast"
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.paginationContainer}>
        <EtPagination totalPages={totalPages} currentPage={currentPageAnimated} color="primary" size="large" />
      </View>

      <EtText variant="body-secondary-regular" style={styles.carouselHint}>
        Swipe left/right to navigate
      </EtText>
    </View>
  );
};

const CAROUSEL_CODE = `import { EtPagination, usePagination } from 'etoro-ui';
import Animated from 'react-native-reanimated';

const CarouselWithPagination = () => {
  const totalPages = 5;
  const cardWidth = 300;

  // usePagination provides currentPageAnimated (SharedValue) for optimal performance
  // Pass it directly to EtPagination to avoid creating a second SharedValue internally
  const { currentPageAnimated, scrollHandler } = usePagination({
    totalPages,
    itemWidth: cardWidth,
  });

  return (
    <View>
      <Animated.FlatList
        horizontal
        data={carouselData}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={cardWidth}
        decelerationRate="fast"
        renderItem={({ item }) => <CarouselCard item={item} />}
      />
      <EtPagination
        totalPages={totalPages}
        currentPage={currentPageAnimated}
        color="primary"
        size="large"
      />
    </View>
  );
};`;

export const CarouselSimulation: Story = {
  render: () => (
    <ScrollView>
      <EtText variant="heading-base" style={styles.storyTitle}>
        Image carousel
      </EtText>
      <CarouselDemo />
      <View style={styles.showcaseScrollView}>
        <CodeBlock title="Using usePagination Hook" code={CAROUSEL_CODE} />
      </View>
    </ScrollView>
  ),
  args: {},
};

// Onboarding flow simulation
const OnboardingDemo = () => {
  const { colors } = useEtoroTheme();
  const totalSteps = 4;

  const stepTitles = ['Welcome to eToro', 'Discover Markets', 'Build Your Portfolio', 'Start Trading'];

  // Use the unified pagination hook for state management
  // currentPage (number) for display logic, currentPageAnimated (SharedValue) for EtPagination
  const { currentPage, currentPageAnimated, goToNext, goToPrevious, canGoNext, canGoPrevious } = usePagination({ totalPages: totalSteps });

  return (
    <View style={styles.onboardingContainer}>
      <View style={[styles.onboardingContent, { backgroundColor: colors.bgNeutralSecondary }]}>
        <EtText variant="heading-base" style={styles.onboardingTitle}>
          {stepTitles[currentPage]}
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.onboardingBody}>
          Step {currentPage + 1} of {totalSteps}
        </EtText>
      </View>

      <View style={styles.onboardingPagination}>
        <EtPagination totalPages={totalSteps} currentPage={currentPageAnimated} color="primary" size="large" />
      </View>

      <View style={styles.onboardingButtons}>
        <EtButton variant="info-subtle" onPress={goToPrevious} disabled={!canGoPrevious}>
          Previous
        </EtButton>
        <EtButton onPress={goToNext} disabled={!canGoNext}>
          Next
        </EtButton>
      </View>

      <EtText variant="body-secondary-regular" style={styles.onboardingHint}>
        Tap buttons to navigate steps
      </EtText>
    </View>
  );
};

const ONBOARDING_CODE = `import { EtPagination, usePagination } from 'etoro-ui';

// Using usePagination hook for state management and navigation
const OnboardingScreen = () => {
  const totalSteps = 4;

  // currentPage (number) for display logic
  // currentPageAnimated (SharedValue) for optimal EtPagination performance
  const {
    currentPage,
    currentPageAnimated,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
  } = usePagination({ totalPages: totalSteps });

  return (
    <View>
      <OnboardingContent step={currentPage} />
      
      <EtPagination
        totalPages={totalSteps}
        currentPage={currentPageAnimated}
        color="primary"
        size="large"
      />
      
      <View style={styles.buttons}>
        <Button onPress={goToPrevious} disabled={!canGoPrevious} title="Previous" />
        <Button onPress={goToNext} disabled={!canGoNext} title="Next" />
      </View>
    </View>
  );
};`;

export const OnboardingFlow: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.showcaseScrollView}>
      <EtText variant="heading-base" style={styles.storyTitle}>
        Onboarding Flow
      </EtText>
      <OnboardingDemo />
      <CodeBlock title="Using usePagination Hook" code={ONBOARDING_CODE} />
    </ScrollView>
  ),
  args: {},
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: X4,
  },
  showcase: {
    flex: 1,
    width: '100%',
  },
  showcaseScrollView: {
    paddingHorizontal: X4,
  },
  title: {
    marginBottom: X5,
  },
  storyTitle: {
    marginBottom: X6,
    textAlign: 'center',
  },
  demoContainer: {
    alignItems: 'center',
    marginBottom: X4,
  },
  sectionTitle: {
    marginTop: X6,
    marginBottom: X3,
    textAlign: 'center',
  },
  label: {
    marginBottom: X2,
  },
  variationsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: X8,
    marginBottom: X4,
  },
  variationItem: {
    alignItems: 'center',
  },
  positionSection: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: X4,
    marginBottom: X4,
  },
  positionItem: {
    alignItems: 'center',
  },
  carouselContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselTitle: {
    marginBottom: X5,
  },
  carouselList: {
    marginBottom: X5,
    flexGrow: 0,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: X3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselHint: {
    marginTop: X3,
  },
  paginationContainer: {
    paddingVertical: X2,
  },
  onboardingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: X6,
  },
  onboardingContent: {
    width: '100%',
    padding: X8,
    borderRadius: X4,
    alignItems: 'center',
    marginBottom: X6,
  },
  onboardingTitle: {
    marginBottom: X2,
    textAlign: 'center',
  },
  onboardingBody: {
    textAlign: 'center',
  },
  onboardingPagination: {
    marginBottom: X6,
  },
  onboardingButtons: {
    flexDirection: 'row',
    gap: X4,
    marginBottom: X4,
  },
  onboardingHint: {
    opacity: 0.6,
  },
  codeContainer: {
    marginTop: X9,
    marginBottom: X3,
    borderRadius: X2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: X3,
    paddingVertical: X2,
    borderBottomWidth: 1,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: X2,
    paddingVertical: X1,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
    padding: X3,
  },
});
