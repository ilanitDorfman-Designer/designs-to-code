import { NavigationContainer, NavigationIndependentTree, type Theme } from '@react-navigation/native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EtoroIcon, EtScreen, EtText, ScrollProvider, type IconName } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { eToroDarkColors, eToroLightColors } from 'etoro-ui/core/styles';
import React from 'react';
import { Alert, Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Stub icon button used for TopBar leading/trailing slots. */
function IconButton({ iconName, onPress }: { iconName: IconName; onPress?: () => void }) {
  const { colors } = useEtoroTheme();
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <EtoroIcon icon={{ iconName }} appearance={{ size: 24, color: colors.textPrimaryNeutral }} />
    </Pressable>
  );
}

/** Generates a list of placeholder cards to produce enough scrollable content. */
function ScrollableContent({ count = 20 }: { count?: number }) {
  const { colors } = useEtoroTheme();

  return (
    <View style={contentStyles.container}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[
            contentStyles.card,
            {
              backgroundColor: colors.bgNeutralSecondary,
              borderColor: colors.dividerTertiary,
            },
          ]}
        >
          <EtText variant="label-primary-semibold">Item {i + 1}</EtText>
          <EtText variant="body-secondary-regular">
            Scroll to see the TopBar animation in action. The TopBar will collapse when scrolling down and reappear when scrolling up.
          </EtText>
        </View>
      ))}
    </View>
  );
}

/** A fake search bar used as an extended header demo. */
function SearchBar() {
  const { colors } = useEtoroTheme();
  return (
    <View
      style={[
        contentStyles.searchBar,
        {
          backgroundColor: colors.bgNeutralSecondary,
          borderColor: colors.dividerTertiary,
        },
      ]}
    >
      <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 16, color: colors.textSecondaryNeutral }} />
      <EtText variant="body-secondary-regular" style={{ color: colors.textTertiaryNeutral }}>
        Search instruments...
      </EtText>
    </View>
  );
}

/** A row of fake tab chips used as extended header content. */
function TabChips() {
  const { colors } = useEtoroTheme();
  const tabs = ['All', 'Stocks', 'Crypto', 'ETFs', 'Indices'];

  return (
    <View style={contentStyles.tabRow}>
      {tabs.map((tab, i) => (
        <View
          key={tab}
          style={[
            contentStyles.chip,
            {
              backgroundColor: i === 0 ? colors.bgActionBrand : colors.bgNeutralSecondary,
              borderColor: i === 0 ? colors.actionBrandText : colors.dividerTertiary,
            },
          ]}
        >
          <EtText
            variant="caption-medium"
            style={{
              color: i === 0 ? colors.actionBrandText : colors.textSecondaryNeutral,
            }}
          >
            {tab}
          </EtText>
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Story decorator – provides EtScreen-specific context
// ─────────────────────────────────────────────────────────────

/**
 * Wraps each story with the providers that EtScreen requires:
 * - NavigationIndependentTree / NavigationContainer → navigation context
 * - ScrollProvider → global scroll / halo context
 */
function ScreenDecorator({ children }: { children: React.ReactNode }) {
  const resolvedTheme = useColorScheme() ?? 'light';
  const { colors } = useEtoroTheme();
  return (
    <NavigationIndependentTree>
      <NavigationContainer theme={resolvedTheme === 'dark' ? (eToroDarkColors as Theme) : (eToroLightColors as Theme)}>
        <ScrollProvider hideHalo>
          <View style={[storyStyles.storyRoot, { backgroundColor: colors.bgNeutralPrimary }]}>{children}</View>
        </ScrollProvider>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtScreen> = {
  title: 'eToro-UI/Components/Layout/EtScreen',
  component: EtScreen,
  parameters: {
    notes:
      'Full-screen container with compound component pattern. Provides TopBar with scroll-driven animations, gradient background, and safe area handling.',
  },
  decorators: [
    (Story) => (
      <ScreenDecorator>
        <Story />
      </ScreenDecorator>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof EtScreen>;

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: function BasicStory() {
    return (
      <Page>
        <Section>
          <Title>Basic</Title>
          <Desc>
            The simplest EtScreen setup: a home-style TopBar with a menu button and scrollable content. Scroll down to see the TopBar collapse and
            scroll up to see it reappear.
          </Desc>
        </Section>

        <Section noPadding>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar>
                <EtScreen.TopBar.Start>
                  <IconButton iconName="menu" onPress={() => Alert.alert('Menu pressed')} />
                </EtScreen.TopBar.Start>
              </EtScreen.TopBar>
              <EtScreen.ScrollView>
                <ScrollableContent />
              </EtScreen.ScrollView>
            </EtScreen>
          </View>
        </Section>

        <Section>
          <CodeBlock
            code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar>
    <EtScreen.TopBar.Start>
      <MenuButton />
    </EtScreen.TopBar.Start>
  </EtScreen.TopBar>
  <EtScreen.ScrollView>
    <Content />
  </EtScreen.ScrollView>
</EtScreen>`}
          />
        </Section>
      </Page>
    );
  },
};

export const InnerScreen: Story = {
  render: function InnerScreenStory() {
    return (
      <Page>
        <Section>
          <Title>Inner Screen</Title>
          <Desc>
            An inner/detail screen with a back button on the leading edge and action buttons on the trailing edge. The TopBar collapses on scroll.
          </Desc>
        </Section>

        <Section noPadding>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen>
                <EtScreen.TopBar.Start>
                  <IconButton iconName="chevronLeft" onPress={() => Alert.alert('Back pressed')} />
                </EtScreen.TopBar.Start>
                <EtScreen.TopBar.End>
                  <IconButton iconName="search" onPress={() => Alert.alert('Search pressed')} />
                  <IconButton iconName="more" onPress={() => Alert.alert('More pressed')} />
                </EtScreen.TopBar.End>
              </EtScreen.TopBar>
              <EtScreen.ScrollView>
                <ScrollableContent />
              </EtScreen.ScrollView>
            </EtScreen>
          </View>
        </Section>

        <Section>
          <CodeBlock
            code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen>
    <EtScreen.TopBar.Start>
      <IconButton iconName="chevronLeft" onPress={router.back} />
    </EtScreen.TopBar.Start>
    <EtScreen.TopBar.End>
      <SearchButton />
      <MoreButton />
    </EtScreen.TopBar.End>
  </EtScreen.TopBar>
  <EtScreen.ScrollView>
    <Content />
  </EtScreen.ScrollView>
</EtScreen>`}
          />
        </Section>
      </Page>
    );
  },
};

export const WithCenteredTitle: Story = {
  render: function CenteredTitleStory() {
    return (
      <Page>
        <Section>
          <Title>Centered Title</Title>
          <Desc>
            Use EtScreen.TopBar.Middle and EtScreen.TopBar.Title for a centered title between the Start and End slots. Use EtScreen.TopBar.Action for
            pressable icon buttons. These subcomponents mirror the EtTopbar API.
          </Desc>
        </Section>

        <Section noPadding>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen>
                <EtScreen.TopBar.Start>
                  <EtScreen.TopBar.Action accessibilityLabel="Go back" onPress={() => Alert.alert('Back pressed')}>
                    <IconButton iconName="chevronLeft" />
                  </EtScreen.TopBar.Action>
                </EtScreen.TopBar.Start>
                <EtScreen.TopBar.Middle>
                  <EtScreen.TopBar.Title>Portfolio</EtScreen.TopBar.Title>
                </EtScreen.TopBar.Middle>
                <EtScreen.TopBar.End>
                  <EtScreen.TopBar.Action accessibilityLabel="Search" onPress={() => Alert.alert('Search pressed')}>
                    <IconButton iconName="search" />
                  </EtScreen.TopBar.Action>
                </EtScreen.TopBar.End>
              </EtScreen.TopBar>
              <EtScreen.ScrollView>
                <ScrollableContent />
              </EtScreen.ScrollView>
            </EtScreen>
          </View>
        </Section>

        <Section>
          <CodeBlock
            code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen>
    <EtScreen.TopBar.Start>
      <EtScreen.TopBar.Action accessibilityLabel="Go back" onPress={goBack}>
        <EtoroIcon name="chevronLeft" size={24} />
      </EtScreen.TopBar.Action>
    </EtScreen.TopBar.Start>
    <EtScreen.TopBar.Middle>
      <EtScreen.TopBar.Title>Portfolio</EtScreen.TopBar.Title>
    </EtScreen.TopBar.Middle>
    <EtScreen.TopBar.End>
      <EtScreen.TopBar.Action accessibilityLabel="Search" onPress={openSearch}>
        <EtoroIcon name="search" size={24} />
      </EtScreen.TopBar.Action>
    </EtScreen.TopBar.End>
  </EtScreen.TopBar>
  <EtScreen.ScrollView>
    <Content />
  </EtScreen.ScrollView>
</EtScreen>`}
          />
        </Section>
      </Page>
    );
  },
};

export const WithExtendedHeader: Story = {
  render: function ExtendedHeaderStory() {
    return (
      <Page>
        <Section>
          <Title>Extended Header</Title>
          <Desc>
            Use EtScreen.Header as a sibling of EtScreen.TopBar for extended header content like search bars, tab navigation, or filter chips. When
            the TopBar collapses on scroll, the header slides up to take its place and stays visible.
          </Desc>
        </Section>

        <Section noPadding>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar>
                <EtScreen.TopBar.Start>
                  <IconButton iconName="menu" onPress={() => Alert.alert('Menu pressed')} />
                </EtScreen.TopBar.Start>
                <EtScreen.TopBar.End>
                  <IconButton iconName="notification" onPress={() => Alert.alert('Notifications')} />
                </EtScreen.TopBar.End>
              </EtScreen.TopBar>
              <EtScreen.Header>
                <View style={contentStyles.headerContent}>
                  <SearchBar />
                  <TabChips />
                </View>
              </EtScreen.Header>
              <EtScreen.ScrollView>
                <ScrollableContent count={25} />
              </EtScreen.ScrollView>
            </EtScreen>
          </View>
        </Section>

        <Section>
          <CodeBlock
            code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar>
    <EtScreen.TopBar.Start>
      <MenuButton />
    </EtScreen.TopBar.Start>
    <EtScreen.TopBar.End>
      <NotificationButton />
    </EtScreen.TopBar.End>
  </EtScreen.TopBar>
  <EtScreen.Header>
    <SearchBar />
    <TabNavigation />
  </EtScreen.Header>
  <EtScreen.ScrollView>
    <Content />
  </EtScreen.ScrollView>
</EtScreen>`}
          />
        </Section>
      </Page>
    );
  },
};

export const CollapseWithTopBar: Story = {
  render: function CollapseWithTopBarStory() {
    return (
      <Page>
        <Section>
          <Title>Collapse With TopBar</Title>
          <Desc>
            When collapseWithTopBar is set on EtScreen.Header, both the TopBar and the extended header collapse together as a single unit. Use this
            for content that should disappear completely on scroll (e.g., a promotional banner).
          </Desc>
        </Section>

        <Section noPadding>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar>
                <EtScreen.TopBar.Start>
                  <IconButton iconName="menu" onPress={() => Alert.alert('Menu pressed')} />
                </EtScreen.TopBar.Start>
                <EtScreen.TopBar.End>
                  <IconButton iconName="notification" onPress={() => Alert.alert('Notifications')} />
                </EtScreen.TopBar.End>
              </EtScreen.TopBar>
              <EtScreen.Header collapseWithTopBar>
                <View style={contentStyles.headerContent}>
                  <SearchBar />
                  <TabChips />
                </View>
              </EtScreen.Header>
              <EtScreen.ScrollView>
                <ScrollableContent count={25} />
              </EtScreen.ScrollView>
            </EtScreen>
          </View>
        </Section>

        <Section>
          <CodeBlock
            code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar>
    <EtScreen.TopBar.Start>
      <MenuButton />
    </EtScreen.TopBar.Start>
  </EtScreen.TopBar>
  <EtScreen.Header collapseWithTopBar>
    <PromoBanner />
  </EtScreen.Header>
  <EtScreen.ScrollView>
    <Content />
  </EtScreen.ScrollView>
</EtScreen>`}
          />
        </Section>
      </Page>
    );
  },
};

export const FadeAnimation: Story = {
  render: function FadeAnimationStory() {
    return (
      <Page>
        <Section>
          <Title>Fade Animation</Title>
          <Desc>
            When animation is set to "fade", the TopBar fades out when scrolling down and fades back in when scrolling up, instead of collapsing.
          </Desc>
        </Section>

        <Section noPadding>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen animation="fade">
                <EtScreen.TopBar.Start>
                  <IconButton iconName="chevronLeft" onPress={() => Alert.alert('Back pressed')} />
                </EtScreen.TopBar.Start>
              </EtScreen.TopBar>
              <EtScreen.ScrollView>
                <ScrollableContent />
              </EtScreen.ScrollView>
            </EtScreen>
          </View>
        </Section>

        <Section>
          <CodeBlock
            code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen animation="fade">
    <EtScreen.TopBar.Start>
      <BackButton />
    </EtScreen.TopBar.Start>
  </EtScreen.TopBar>
  <EtScreen.ScrollView>
    <Content />
  </EtScreen.ScrollView>
</EtScreen>`}
          />
        </Section>
      </Page>
    );
  },
};

export const NoAnimation: Story = {
  render: function NoAnimationStory() {
    return (
      <Page>
        <Section>
          <Title>No Animation</Title>
          <Desc>
            Set animation to "none" for a static TopBar that stays visible regardless of scroll position. Useful for screens that don't need
            scroll-driven TopBar behavior.
          </Desc>
        </Section>

        <Section noPadding>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen animation="none">
                <EtScreen.TopBar.Start>
                  <IconButton iconName="chevronLeft" onPress={() => Alert.alert('Back pressed')} />
                </EtScreen.TopBar.Start>
                <EtScreen.TopBar.End>
                  <IconButton iconName="share" onPress={() => Alert.alert('Share pressed')} />
                </EtScreen.TopBar.End>
              </EtScreen.TopBar>
              <EtScreen.ScrollView>
                <ScrollableContent />
              </EtScreen.ScrollView>
            </EtScreen>
          </View>
        </Section>

        <Section>
          <CodeBlock
            code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen animation="none">
    <EtScreen.TopBar.Start>
      <BackButton />
    </EtScreen.TopBar.Start>
    <EtScreen.TopBar.End>
      <ShareButton />
    </EtScreen.TopBar.End>
  </EtScreen.TopBar>
  <EtScreen.ScrollView>
    <Content />
  </EtScreen.ScrollView>
</EtScreen>`}
          />
        </Section>
      </Page>
    );
  },
};

export const WithGradient: Story = {
  render: function GradientStory() {
    return (
      <Page>
        <Section>
          <Title>Gradient Background</Title>
          <Desc>
            Enable the gradient prop for a smooth background transition from bgNeutralSecondary to bgNeutralPrimary. Commonly used on home and
            portfolio screens.
          </Desc>
        </Section>

        <Section noPadding>
          <View style={storyStyles.screenContainer}>
            <EtScreen gradient>
              <EtScreen.TopBar>
                <EtScreen.TopBar.Start>
                  <IconButton iconName="menu" onPress={() => Alert.alert('Menu pressed')} />
                </EtScreen.TopBar.Start>
              </EtScreen.TopBar>
              <EtScreen.ScrollView>
                <ScrollableContent count={15} />
              </EtScreen.ScrollView>
            </EtScreen>
          </View>
        </Section>

        <Section>
          <CodeBlock
            code={`import { EtScreen } from 'etoro-ui';

<EtScreen gradient>
  <EtScreen.TopBar>
    <EtScreen.TopBar.Start>
      <MenuButton />
    </EtScreen.TopBar.Start>
  </EtScreen.TopBar>
  <EtScreen.ScrollView>
    <Content />
  </EtScreen.ScrollView>
</EtScreen>`}
          />
        </Section>
      </Page>
    );
  },
};

export const StaticView: Story = {
  render: function StaticViewStory() {
    return (
      <Page>
        <Section>
          <Title>Static View (EtScreen.View)</Title>
          <Desc>
            Use EtScreen.View for screens with custom scroll implementations or static layouts. For FlashList, prefer EtScreen.FlashList which handles
            scroll tracking automatically.
          </Desc>
        </Section>

        <Section noPadding>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen animation="none">
                <EtScreen.TopBar.Start>
                  <IconButton iconName="chevronLeft" onPress={() => Alert.alert('Back pressed')} />
                </EtScreen.TopBar.Start>
              </EtScreen.TopBar>
              <EtScreen.View style={contentStyles.staticContent}>
                <EtText variant="heading-compact">Static Content</EtText>
                <EtText variant="body-base-regular">
                  This screen uses EtScreen.View for content that doesn't need the built-in ScrollView — for example, a screen with a custom feed
                  component or a static layout.
                </EtText>
              </EtScreen.View>
            </EtScreen>
          </View>
        </Section>

        <Section>
          <CodeBlock
            code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen animation="none">
    <EtScreen.TopBar.Start>
      <BackButton />
    </EtScreen.TopBar.Start>
  </EtScreen.TopBar>
  <EtScreen.View style={{ flex: 1 }}>
    <CustomFeed onScroll={handleScroll} />
  </EtScreen.View>
</EtScreen>`}
          />
        </Section>
      </Page>
    );
  },
};

export const WithFlashList: Story = {
  render: function FlashListStory() {
    const { colors } = useEtoroTheme();

    const DATA = React.useMemo(
      () =>
        Array.from({ length: 50 }, (_, i) => ({
          id: String(i),
          name: `Instrument ${i + 1}`,
          price: (Math.random() * 1000).toFixed(2),
          change: (Math.random() * 10 - 5).toFixed(2),
        })),
      [],
    );

    const renderItem = React.useCallback(
      ({ item }: { item: (typeof DATA)[0] }) => {
        const isPositive = parseFloat(item.change) >= 0;
        return (
          <Pressable
            style={[
              flashListStyles.row,
              {
                borderBottomColor: colors.dividerTertiary,
              },
            ]}
            onPress={() => Alert.alert(item.name)}
          >
            <View style={flashListStyles.rowLeft}>
              <EtText variant="label-primary-semibold">{item.name}</EtText>
              <EtText variant="caption-regular" style={{ color: colors.textSecondaryNeutral }}>
                ID: {item.id}
              </EtText>
            </View>
            <View style={flashListStyles.rowRight}>
              <EtText variant="label-primary-semibold">${item.price}</EtText>
              <EtText
                variant="caption-medium"
                style={{
                  color: isPositive ? colors.actionBrandText : colors.actionBrandVarText,
                }}
              >
                {isPositive ? '+' : ''}
                {item.change}%
              </EtText>
            </View>
          </Pressable>
        );
      },
      [colors],
    );

    return (
      <Page>
        <Section>
          <Title>FlashList</Title>
          <Desc>
            Use EtScreen.FlashList for virtualized lists that need automatic TopBar animation support. It wraps @shopify/flash-list and automatically
            tracks scroll position for TopBar collapse/fade animations and applies the correct header padding. Scroll down to see the TopBar collapse.
          </Desc>
        </Section>

        <Section noPadding>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen>
                <EtScreen.TopBar.Start>
                  <EtScreen.TopBar.Action accessibilityLabel="Go back" onPress={() => Alert.alert('Back pressed')}>
                    <IconButton iconName="chevronLeft" />
                  </EtScreen.TopBar.Action>
                </EtScreen.TopBar.Start>
                <EtScreen.TopBar.Middle>
                  <EtScreen.TopBar.Title>Instruments</EtScreen.TopBar.Title>
                </EtScreen.TopBar.Middle>
                <EtScreen.TopBar.End>
                  <EtScreen.TopBar.Action accessibilityLabel="Search" onPress={() => Alert.alert('Search pressed')}>
                    <IconButton iconName="search" />
                  </EtScreen.TopBar.Action>
                </EtScreen.TopBar.End>
              </EtScreen.TopBar>
              <EtScreen.FlashList data={DATA} renderItem={renderItem} keyExtractor={(item) => item.id} />
            </EtScreen>
          </View>
        </Section>

        <Section>
          <CodeBlock
            code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen>
    <EtScreen.TopBar.Start>
      <BackButton />
    </EtScreen.TopBar.Start>
    <EtScreen.TopBar.Middle>
      <EtScreen.TopBar.Title>Instruments</EtScreen.TopBar.Title>
    </EtScreen.TopBar.Middle>
    <EtScreen.TopBar.End>
      <SearchButton />
    </EtScreen.TopBar.End>
  </EtScreen.TopBar>
  <EtScreen.FlashList
    data={instruments}
    renderItem={({ item }) => <InstrumentRow item={item} />}
    keyExtractor={(item) => item.id}
  />
</EtScreen>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// EtScreen.Content Stories (Title, Subtitle, Disclaimer, Body, Footer)
// ─────────────────────────────────────────────────────────────

function Placeholder({ height = 120 }: { height?: number }) {
  return (
    <View
      style={{
        height,
        borderRadius: 8,
        backgroundColor: 'rgba(128,128,128,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
}

export const ContentBasic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Screen Content — Basic</Title>
        <Desc>
          EtScreen.Content provides Title, Subtitle, optional Disclaimer, and Body sub-components for building step-by-step flows like onboarding,
          KYC, or settings wizards. Must be placed inside EtScreen.ScrollView or EtScreen.View.
        </Desc>
        <Preview>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen />
              <EtScreen.ScrollView>
                <EtScreen.Content>
                  <EtScreen.Content.Title>Personal Details</EtScreen.Content.Title>
                  <EtScreen.Content.Subtitle>Tell us a bit about yourself so we can set up your account.</EtScreen.Content.Subtitle>
                  <EtScreen.Content.Body>
                    <Placeholder height={200} />
                  </EtScreen.Content.Body>
                </EtScreen.Content>
              </EtScreen.ScrollView>
              <EtScreen.Footer>
                <EtScreen.Footer.Primary onPress={() => undefined}>Next</EtScreen.Footer.Primary>
              </EtScreen.Footer>
            </EtScreen>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen />
  <EtScreen.ScrollView>
    <EtScreen.Content>
      <EtScreen.Content.Title>Personal Details</EtScreen.Content.Title>
      <EtScreen.Content.Subtitle>
        Tell us a bit about yourself so we can set up your account.
      </EtScreen.Content.Subtitle>
      <EtScreen.Content.Body>
        <YourFormContent />
      </EtScreen.Content.Body>
    </EtScreen.Content>
  </EtScreen.ScrollView>
  <EtScreen.Footer>
    <EtScreen.Footer.Primary onPress={handleNext}>
      Next
    </EtScreen.Footer.Primary>
  </EtScreen.Footer>
</EtScreen>`}
        />
      </Section>
    </Page>
  ),
};

export const ContentWithDisclaimer: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Content — With Disclaimer</Title>
        <Desc>Add a small disclaimer text between the subtitle and body area.</Desc>
        <Preview>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen />
              <EtScreen.ScrollView>
                <EtScreen.Content>
                  <EtScreen.Content.Title>Verify Your Identity</EtScreen.Content.Title>
                  <EtScreen.Content.Subtitle>We need to verify your identity to comply with regulations.</EtScreen.Content.Subtitle>
                  <EtScreen.Content.Disclaimer>Your data is encrypted and securely stored.</EtScreen.Content.Disclaimer>
                  <EtScreen.Content.Body>
                    <Placeholder height={180} />
                  </EtScreen.Content.Body>
                </EtScreen.Content>
              </EtScreen.ScrollView>
              <EtScreen.Footer>
                <EtScreen.Footer.Primary onPress={() => undefined}>Continue</EtScreen.Footer.Primary>
              </EtScreen.Footer>
            </EtScreen>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen />
  <EtScreen.ScrollView>
    <EtScreen.Content>
      <EtScreen.Content.Title>Verify Your Identity</EtScreen.Content.Title>
      <EtScreen.Content.Subtitle>
        We need to verify your identity to comply with regulations.
      </EtScreen.Content.Subtitle>
      <EtScreen.Content.Disclaimer>
        Your data is encrypted and securely stored.
      </EtScreen.Content.Disclaimer>
      <EtScreen.Content.Body>
        <VerificationForm />
      </EtScreen.Content.Body>
    </EtScreen.Content>
  </EtScreen.ScrollView>
  <EtScreen.Footer>
    <EtScreen.Footer.Primary onPress={handleContinue}>
      Continue
    </EtScreen.Footer.Primary>
  </EtScreen.Footer>
</EtScreen>`}
        />
      </Section>
    </Page>
  ),
};

export const ContentMultipleButtons: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Content — Multiple Footer Buttons</Title>
        <Desc>Footer supports Primary, Secondary, and Ghost button variants stacked vertically.</Desc>
        <Preview>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen />
              <EtScreen.ScrollView>
                <EtScreen.Content>
                  <EtScreen.Content.Title>Fund Your Account</EtScreen.Content.Title>
                  <EtScreen.Content.Subtitle>Choose how you'd like to deposit funds.</EtScreen.Content.Subtitle>
                  <EtScreen.Content.Body>
                    <Placeholder height={120} />
                  </EtScreen.Content.Body>
                </EtScreen.Content>
              </EtScreen.ScrollView>
              <EtScreen.Footer>
                <EtScreen.Footer.Primary onPress={() => undefined}>Deposit Funds</EtScreen.Footer.Primary>
                <EtScreen.Footer.Secondary onPress={() => undefined}>Maybe Later</EtScreen.Footer.Secondary>
                <EtScreen.Footer.Ghost onPress={() => undefined}>Skip</EtScreen.Footer.Ghost>
              </EtScreen.Footer>
            </EtScreen>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen />
  <EtScreen.ScrollView>
    <EtScreen.Content>
      <EtScreen.Content.Title>Fund Your Account</EtScreen.Content.Title>
      <EtScreen.Content.Subtitle>
        Choose how you'd like to deposit funds.
      </EtScreen.Content.Subtitle>
      <EtScreen.Content.Body>
        <DepositOptions />
      </EtScreen.Content.Body>
    </EtScreen.Content>
  </EtScreen.ScrollView>
  <EtScreen.Footer>
    <EtScreen.Footer.Primary onPress={handleDeposit}>
      Deposit Funds
    </EtScreen.Footer.Primary>
    <EtScreen.Footer.Secondary onPress={handleLater}>
      Maybe Later
    </EtScreen.Footer.Secondary>
    <EtScreen.Footer.Ghost onPress={handleSkip}>
      Skip
    </EtScreen.Footer.Ghost>
  </EtScreen.Footer>
</EtScreen>`}
        />
      </Section>
    </Page>
  ),
};

export const ContentCentered: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Content — Centered Alignment</Title>
        <Desc>All text slots accept an alignment prop. Use "center" for success screens or confirmations.</Desc>
        <Preview>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen />
              <EtScreen.View>
                <EtScreen.Content>
                  <EtScreen.Content.Title alignment="center">All Done!</EtScreen.Content.Title>
                  <EtScreen.Content.Subtitle alignment="center">Your account has been successfully verified.</EtScreen.Content.Subtitle>
                  <EtScreen.Content.Body alignment="center">
                    <Placeholder height={100} />
                  </EtScreen.Content.Body>
                </EtScreen.Content>
              </EtScreen.View>
            </EtScreen>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen />
  <EtScreen.View>
    <EtScreen.Content>
      <EtScreen.Content.Title alignment="center">All Done!</EtScreen.Content.Title>
      <EtScreen.Content.Subtitle alignment="center">
        Your account has been successfully verified.
      </EtScreen.Content.Subtitle>
      <EtScreen.Content.Body alignment="center">
        <SuccessIcon />
      </EtScreen.Content.Body>
    </EtScreen.Content>
  </EtScreen.View>
</EtScreen>`}
        />
      </Section>
    </Page>
  ),
};

export const ContentWithTopBar: Story = {
  render: function ContentWithTopBarStory() {
    return (
      <Page>
        <Section>
          <Title>Content — With TopBar</Title>
          <Desc>Combine content slots with a TopBar for a complete inner screen with navigation.</Desc>
          <Preview>
            <View style={storyStyles.screenContainer}>
              <NavigationIndependentTree>
                <NavigationContainer>
                  <ScrollProvider>
                    <EtScreen>
                      <EtScreen.TopBar isInnerScreen>
                        <EtScreen.TopBar.Middle>
                          <EtScreen.TopBar.Title>Step 2 of 4</EtScreen.TopBar.Title>
                        </EtScreen.TopBar.Middle>
                      </EtScreen.TopBar>
                      <EtScreen.ScrollView>
                        <EtScreen.Content>
                          <EtScreen.Content.Title>Address Details</EtScreen.Content.Title>
                          <EtScreen.Content.Subtitle>Enter your current residential address.</EtScreen.Content.Subtitle>
                          <EtScreen.Content.Body>
                            <Placeholder height={200} />
                          </EtScreen.Content.Body>
                        </EtScreen.Content>
                      </EtScreen.ScrollView>
                      <EtScreen.Footer>
                        <EtScreen.Footer.Primary onPress={() => undefined}>Next</EtScreen.Footer.Primary>
                      </EtScreen.Footer>
                    </EtScreen>
                  </ScrollProvider>
                </NavigationContainer>
              </NavigationIndependentTree>
            </View>
          </Preview>
          <CodeBlock
            code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen>
    <EtScreen.TopBar.Middle>
      <EtScreen.TopBar.Title>Step 2 of 4</EtScreen.TopBar.Title>
    </EtScreen.TopBar.Middle>
  </EtScreen.TopBar>
  <EtScreen.ScrollView>
    <EtScreen.Content>
      <EtScreen.Content.Title>Address Details</EtScreen.Content.Title>
      <EtScreen.Content.Subtitle>
        Enter your current residential address.
      </EtScreen.Content.Subtitle>
      <EtScreen.Content.Body>
        <AddressForm />
      </EtScreen.Content.Body>
    </EtScreen.Content>
  </EtScreen.ScrollView>
  <EtScreen.Footer>
    <EtScreen.Footer.Primary onPress={handleNext}>
      Next
    </EtScreen.Footer.Primary>
  </EtScreen.Footer>
</EtScreen>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// EtScreen.Footer Stories
// ─────────────────────────────────────────────────────────────

export const FooterSingleButton: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Footer — Inline (Default)</Title>
        <Desc>
          By default, EtScreen.Footer renders inline without SafeAreaView. Place it inside EtScreen.ScrollView so the footer scrolls with content.
        </Desc>
        <Preview>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen />
              <EtScreen.ScrollView>
                <EtScreen.Content>
                  <EtScreen.Content.Title>Confirm Action</EtScreen.Content.Title>
                  <EtScreen.Content.Subtitle>Review the details above before proceeding.</EtScreen.Content.Subtitle>
                  <EtScreen.Content.Body>
                    <Placeholder height={200} />
                  </EtScreen.Content.Body>
                </EtScreen.Content>
                <EtScreen.Footer>
                  <EtScreen.Footer.Primary onPress={() => undefined}>Continue</EtScreen.Footer.Primary>
                </EtScreen.Footer>
              </EtScreen.ScrollView>
            </EtScreen>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen />
  <EtScreen.ScrollView>
    <EtScreen.Content>
      <EtScreen.Content.Title>Confirm Action</EtScreen.Content.Title>
      <EtScreen.Content.Subtitle>
        Review the details above before proceeding.
      </EtScreen.Content.Subtitle>
      <EtScreen.Content.Body>
        <YourContent />
      </EtScreen.Content.Body>
    </EtScreen.Content>
    <EtScreen.Footer>
      <EtScreen.Footer.Primary onPress={handleContinue}>
        Continue
      </EtScreen.Footer.Primary>
    </EtScreen.Footer>
  </EtScreen.ScrollView>
</EtScreen>`}
        />
      </Section>
    </Page>
  ),
};

export const FooterMultipleButtons: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Footer — Sticky</Title>
        <Desc>
          With the sticky prop, EtScreen.Footer wraps in SafeAreaView and stays pinned at the bottom. Place it as a sibling of EtScreen.ScrollView.
          Supports Primary, Secondary, and Ghost button variants stacked vertically.
        </Desc>
        <Preview>
          <View style={storyStyles.screenContainer}>
            <EtScreen>
              <EtScreen.TopBar isInnerScreen />
              <EtScreen.ScrollView>
                <EtScreen.Content>
                  <EtScreen.Content.Title>Fund Your Account</EtScreen.Content.Title>
                  <EtScreen.Content.Subtitle>Choose how you'd like to deposit funds.</EtScreen.Content.Subtitle>
                  <EtScreen.Content.Body>
                    <Placeholder height={120} />
                  </EtScreen.Content.Body>
                </EtScreen.Content>
              </EtScreen.ScrollView>
              <EtScreen.Footer sticky>
                <EtScreen.Footer.Primary onPress={() => undefined}>Deposit Funds</EtScreen.Footer.Primary>
                <EtScreen.Footer.Secondary onPress={() => undefined}>Maybe Later</EtScreen.Footer.Secondary>
                <EtScreen.Footer.Ghost onPress={() => undefined}>Skip</EtScreen.Footer.Ghost>
              </EtScreen.Footer>
            </EtScreen>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtScreen } from 'etoro-ui';

<EtScreen>
  <EtScreen.TopBar isInnerScreen />
  <EtScreen.ScrollView>
    <EtScreen.Content>
      <EtScreen.Content.Title>Fund Your Account</EtScreen.Content.Title>
      <EtScreen.Content.Subtitle>
        Choose how you'd like to deposit funds.
      </EtScreen.Content.Subtitle>
      <EtScreen.Content.Body>
        <DepositOptions />
      </EtScreen.Content.Body>
    </EtScreen.Content>
  </EtScreen.ScrollView>
  <EtScreen.Footer sticky>
    <EtScreen.Footer.Primary onPress={handleDeposit}>
      Deposit Funds
    </EtScreen.Footer.Primary>
    <EtScreen.Footer.Secondary onPress={handleLater}>
      Maybe Later
    </EtScreen.Footer.Secondary>
    <EtScreen.Footer.Ghost onPress={handleSkip}>
      Skip
    </EtScreen.Footer.Ghost>
  </EtScreen.Footer>
</EtScreen>`}
        />
      </Section>
    </Page>
  ),
};

export const APIReference: Story = {
  render: function APIReferenceStory() {
    return (
      <Page>
        <Section>
          <Title>API Reference</Title>
        </Section>

        <Section>
          <SubTitle>EtScreen</SubTitle>
          <Desc>Root screen container. Extends SafeAreaViewProps.</Desc>
          <PropsTable
            data={[
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Screen content — typically EtScreen.TopBar + EtScreen.ScrollView or EtScreen.View',
              },
              {
                prop: 'gradient',
                type: 'boolean',
                default: 'false',
                description: 'Apply a vertical gradient background',
              },
              {
                prop: 'entering',
                type: 'EntryExitAnimationFunction',
                default: '-',
                description: 'Reanimated entering animation',
              },
              {
                prop: 'exiting',
                type: 'EntryExitAnimationFunction',
                default: '-',
                description: 'Reanimated exiting animation',
              },
              {
                prop: 'animateHalo',
                type: 'boolean',
                default: 'false',
                description: 'Animate the halo background based on scroll position',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.TopBar</SubTitle>
          <Desc>
            Configures the screen TopBar. Use subcomponents to declaratively set leading button, trailing actions, and extended header content.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'isInnerScreen',
                type: 'boolean',
                default: 'false',
                description: 'Controls the default Start content: true → back button; false → menu button',
              },
              {
                prop: 'animation',
                type: '"collapse" | "fade" | "none"',
                default: '"collapse"',
                description: 'Scroll-driven animation type for the TopBar',
              },
              {
                prop: 'animationOptions',
                type: 'TopBarAnimationOptions',
                default: '-',
                description: 'Fine-tune threshold, duration, and min scroll position',
              },
              {
                prop: 'blurEffect',
                type: 'boolean',
                default: 'true',
                description: 'Apply blur effect to the TopBar background',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.TopBar.Start</SubTitle>
          <Desc>
            Registers custom content for the leading (start) side of the TopBar. When not provided, a default button is shown based on isInnerScreen.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Leading content (back button, menu button, etc.)',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.TopBar.Middle</SubTitle>
          <Desc>Registers centered content between Start and End slots. Absolutely positioned so it stays centered regardless of slot widths.</Desc>
          <PropsTable
            data={[
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Centered content (typically a Title)',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.TopBar.End</SubTitle>
          <Desc>Registers content for the trailing (end) side of the TopBar.</Desc>
          <PropsTable
            data={[
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'One or more action button components',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.TopBar.Action</SubTitle>
          <Desc>A pressable action button with built-in hit slop and accessibility. Re-exported from EtTopbar.Action for convenience.</Desc>
          <PropsTable
            data={[
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Icon or content inside the action button',
              },
              {
                prop: 'onPress',
                type: '() => void',
                default: '-',
                description: 'Press handler',
              },
              {
                prop: 'accessibilityLabel',
                type: 'string',
                default: '-',
                description: 'Accessibility label for screen readers',
              },
              {
                prop: '...PressableProps',
                type: 'PressableProps',
                default: '-',
                description: 'All React Native Pressable props are supported',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.TopBar.Title</SubTitle>
          <Desc>A centered text component for header titles. Re-exported from EtTopbar.Title for convenience.</Desc>
          <PropsTable
            data={[
              {
                prop: 'children',
                type: 'string',
                default: '-',
                description: 'Title text',
              },
              {
                prop: 'variant',
                type: 'EtTextVariant',
                default: '"heading-compact"',
                description: 'Text style variant',
              },
              {
                prop: 'numberOfLines',
                type: 'number',
                default: '1',
                description: 'Maximum number of lines before truncating',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.Header</SubTitle>
          <Desc>
            Extended header content rendered below the TopBar. Use as a sibling of EtScreen.TopBar for search bars, tabs, or filters. By default, the
            header stays visible when the TopBar collapses (sliding up to take its place). Set collapseWithTopBar to collapse both together.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Header content to render below the TopBar',
              },
              {
                prop: 'collapseWithTopBar',
                type: 'boolean',
                default: 'false',
                description: 'When true, the header collapses together with the TopBar instead of staying visible',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.ScrollView</SubTitle>
          <Desc>
            Scrollable content container. Extends ScrollViewProps. Automatically tracks scroll position for TopBar animations and adds TopBar padding.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Scrollable content',
              },
              {
                prop: '...ScrollViewProps',
                type: 'ScrollViewProps',
                default: '-',
                description: 'All React Native ScrollView props are supported',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.FlashList</SubTitle>
          <Desc>
            Virtualized list container using @shopify/flash-list. Extends FlashListProps. Automatically tracks scroll position for TopBar animations
            and adds TopBar padding.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'data',
                type: 'T[]',
                default: '-',
                description: 'Array of items to render',
              },
              {
                prop: 'renderItem',
                type: '({ item }) => ReactElement',
                default: '-',
                description: 'Function to render each item',
              },
              {
                prop: 'keyExtractor',
                type: '(item, index) => string',
                default: '-',
                description: 'Returns a unique key for each item (required for stable recycling)',
              },
              {
                prop: '...FlashListProps',
                type: 'FlashListProps<T>',
                default: '-',
                description: 'All @shopify/flash-list props except renderScrollComponent (managed internally)',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.View</SubTitle>
          <Desc>
            Static content container. Extends ViewProps. Use for screens with custom scroll implementations. For virtualized lists, prefer
            EtScreen.FlashList. Adds TopBar padding automatically.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Static or custom-scrolled content',
              },
              {
                prop: '...ViewProps',
                type: 'ViewProps',
                default: '-',
                description: 'All React Native View props are supported',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>TopBarAnimationOptions</SubTitle>
          <Desc>Fine-grained control over scroll-driven TopBar animations.</Desc>
          <PropsTable
            data={[
              {
                prop: 'threshold',
                type: 'number',
                default: '5',
                description: 'Minimum scroll distance (px) to trigger direction change',
              },
              {
                prop: 'animationDuration',
                type: 'number',
                default: '300',
                description: 'Duration of direction-based animations (ms)',
              },
              {
                prop: 'minScrollPosition',
                type: 'number',
                default: '10',
                description: 'Minimum scroll position before animations start',
              },
              {
                prop: 'enableDirectionTracking',
                type: 'boolean',
                default: 'true',
                description: 'Enable direction tracking for custom child animations',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.Content</SubTitle>
          <Desc>
            Structured content layout with compound sub-components. Extends ViewProps. Must be placed inside EtScreen.ScrollView or EtScreen.View. Use
            for step-by-step flows, onboarding, or any screen needing Title + Body structure.
          </Desc>
          <PropsTable
            data={[
              { prop: 'children', type: 'ReactNode', default: '-', description: 'Content sub-components (Title, Subtitle, Disclaimer, Body)' },
              { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style overrides' },
              { prop: '...rest', type: 'ViewProps', default: '-', description: 'All React Native View props are supported' },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.Content.Title</SubTitle>
          <Desc>Primary heading. Renders display-main text.</Desc>
          <PropsTable
            data={[
              { prop: 'children', type: 'string', default: '-', description: 'Title text' },
              { prop: 'alignment', type: '"left" | "center" | "right"', default: '"left"', description: 'Text and container alignment' },
              { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style overrides' },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.Content.Subtitle</SubTitle>
          <Desc>Subtitle text rendered below the title in a secondary colour.</Desc>
          <PropsTable
            data={[
              { prop: 'children', type: 'string', default: '-', description: 'Subtitle text' },
              { prop: 'alignment', type: '"left" | "center" | "right"', default: '"left"', description: 'Text and container alignment' },
              { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style overrides' },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.Content.Disclaimer</SubTitle>
          <Desc>Small disclaimer text in body-tiny-regular variant with secondary colour.</Desc>
          <PropsTable
            data={[
              { prop: 'children', type: 'string', default: '-', description: 'Disclaimer text' },
              { prop: 'alignment', type: '"left" | "center" | "right"', default: '"left"', description: 'Text and container alignment' },
              { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style overrides' },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.Content.Body</SubTitle>
          <Desc>Main body area for forms, lists, or any custom content.</Desc>
          <PropsTable
            data={[
              { prop: 'children', type: 'ReactNode', default: '-', description: 'Body content elements' },
              { prop: 'alignment', type: '"left" | "center" | "right"', default: '"left"', description: 'Container alignment' },
              { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style overrides' },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.Footer</SubTitle>
          <Desc>
            Footer area with a vertical button stack. By default renders inline (no SafeAreaView) for placement inside ScrollView. Set sticky to wrap
            in SafeAreaView and pin to the bottom as a sibling of ScrollView.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Footer content (typically Footer.Primary / Secondary / Ghost buttons)',
              },
              { prop: 'sticky', type: 'boolean', default: 'false', description: 'Wraps in SafeAreaView for sticky bottom placement' },
              { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style overrides' },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtScreen.Footer.Primary / Secondary / Ghost</SubTitle>
          <Desc>Pre-configured EtButton variants (primary-filled, primary-subtle, primary-ghost). All stretch full width at large size.</Desc>
          <PropsTable
            data={[
              { prop: 'children', type: 'ReactNode', default: '-', description: 'Button label' },
              { prop: 'onPress', type: '() => void', default: '-', description: 'Press handler' },
              { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button' },
              { prop: '...rest', type: 'EtButtonProps', default: '-', description: 'All EtButton props are supported' },
            ]}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const storyStyles = StyleSheet.create({
  storyRoot: {
    flex: 1,
  },
  screenContainer: {
    height: 600,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
});

const contentStyles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 4,
  },
  staticContent: {
    padding: 24,
    gap: 12,
  },
});

const flashListStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowLeft: {
    gap: 2,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
});
