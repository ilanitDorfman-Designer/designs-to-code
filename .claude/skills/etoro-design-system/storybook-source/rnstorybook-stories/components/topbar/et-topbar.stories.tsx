import type { Meta, StoryObj } from '@storybook/react-native';
import { EtText, EtTextToggle, EtTopbar, EtoroIcon } from 'etoro-ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { CodeBlock, Desc, Label, Page, Preview, PropsTable, Section, SubTitle, Title, useTheme } from '../../utils/storybook-template';

type Story = StoryObj<typeof EtTopbar>;

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtTopbar> = {
  title: 'eToro-UI/Components/Topbar/EtTopbar',
  component: EtTopbar,
};

export default meta;

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>A simple topbar with just a centered title.</Desc>
        <Preview>
          <EtTopbar>
            <EtTopbar.Middle>
              <EtTopbar.Title>Page Title</EtTopbar.Title>
            </EtTopbar.Middle>
          </EtTopbar>
        </Preview>
        <CodeBlock
          code={`import { EtTopbar } from 'etoro-ui';

<EtTopbar>
  <EtTopbar.Middle>
    <EtTopbar.Title>Page Title</EtTopbar.Title>
  </EtTopbar.Middle>
</EtTopbar>`}
        />
      </Section>
    </Page>
  ),
};

export const StartSide: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Start Side Variants</Title>
        <Desc>
          The start slot supports navigation actions like back buttons and menu toggles. In LTR it renders on the left; in RTL on the right.
        </Desc>
        <Preview glow={false}>
          <View>
            <EtTopbar>
              <EtTopbar.Middle>
                <EtTopbar.Title>No Left Action</EtTopbar.Title>
              </EtTopbar.Middle>
            </EtTopbar>
            <Label>None</Label>
          </View>
          <View>
            <EtTopbar>
              <EtTopbar.Start>
                <EtTopbar.Action onPress={() => {}} accessibilityLabel="Go back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </EtTopbar.Action>
              </EtTopbar.Start>
              <EtTopbar.Middle>
                <EtTopbar.Title>Back Navigation</EtTopbar.Title>
              </EtTopbar.Middle>
            </EtTopbar>
            <Label>Back</Label>
          </View>
          <View>
            <EtTopbar>
              <EtTopbar.Start>
                <EtTopbar.Action onPress={() => {}} accessibilityLabel="Open menu">
                  <EtoroIcon icon={{ iconName: 'menu' }} appearance={{ size: 24 }} />
                </EtTopbar.Action>
              </EtTopbar.Start>
              <EtTopbar.Middle>
                <EtTopbar.Title>Menu Navigation</EtTopbar.Title>
              </EtTopbar.Middle>
            </EtTopbar>
            <Label>Menu</Label>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtTopbar, EtoroIcon } from 'etoro-ui';

// Back button
<EtTopbar>
  <EtTopbar.Start>
    <EtTopbar.Action accessibilityLabel="Go back" onPress={goBack}>
      <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.Start>
  <EtTopbar.Middle>
    <EtTopbar.Title>Back Navigation</EtTopbar.Title>
  </EtTopbar.Middle>
</EtTopbar>

// Menu button
<EtTopbar>
  <EtTopbar.Start>
    <EtTopbar.Action accessibilityLabel="Open menu" onPress={openDrawer}>
      <EtoroIcon icon={{ iconName: 'menu' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.Start>
  <EtTopbar.Middle>
    <EtTopbar.Title>Menu Navigation</EtTopbar.Title>
  </EtTopbar.Middle>
</EtTopbar>`}
        />
      </Section>
    </Page>
  ),
};

export const Middle: Story = {
  render: function MiddleStory() {
    const { c } = useTheme();
    return (
      <Page>
        <Section>
          <Title>Middle Variants</Title>
          <Desc>The middle slot is absolutely positioned for true centering. It supports titles, subtitles, numbers, and custom content.</Desc>
        </Section>

        <Section>
          <SubTitle>Title</SubTitle>
          <Preview>
            <EtTopbar>
              <EtTopbar.Start>
                <EtTopbar.Action onPress={() => {}} accessibilityLabel="Go back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </EtTopbar.Action>
              </EtTopbar.Start>
              <EtTopbar.Middle>
                <EtTopbar.Title>Page Title</EtTopbar.Title>
              </EtTopbar.Middle>
            </EtTopbar>
          </Preview>
          <CodeBlock
            code={`<EtTopbar>
  <EtTopbar.Middle>
    <EtTopbar.Title>Page Title</EtTopbar.Title>
  </EtTopbar.Middle>
</EtTopbar>`}
          />
        </Section>

        <Section>
          <SubTitle>Title + Subtitle</SubTitle>
          <Preview>
            <EtTopbar>
              <EtTopbar.Start>
                <EtTopbar.Action onPress={() => {}} accessibilityLabel="Go back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </EtTopbar.Action>
              </EtTopbar.Start>
              <EtTopbar.Middle>
                <View style={styles.titleSubtitle}>
                  <EtText variant="label-primary-semibold">AAPL</EtText>
                  <EtText variant="body-tiny-regular">Apple Inc.</EtText>
                </View>
              </EtTopbar.Middle>
            </EtTopbar>
          </Preview>
          <CodeBlock
            code={`<EtTopbar>
  <EtTopbar.Middle>
    <View style={styles.titleSubtitle}>
      <EtText variant="label-primary-semibold">AAPL</EtText>
      <EtText variant="body-tiny-regular">Apple Inc.</EtText>
    </View>
  </EtTopbar.Middle>
</EtTopbar>`}
          />
        </Section>

        <Section>
          <SubTitle>Number Display</SubTitle>
          <Preview>
            <EtTopbar>
              <EtTopbar.Start>
                <EtTopbar.Action onPress={() => {}} accessibilityLabel="Open menu">
                  <EtoroIcon icon={{ iconName: 'menu' }} appearance={{ size: 24 }} />
                </EtTopbar.Action>
              </EtTopbar.Start>
              <EtTopbar.Middle>
                <View style={styles.titleSubtitle}>
                  <EtText variant="heading-compact">$24,582.50</EtText>
                  <EtText variant="body-tiny-regular">Portfolio Value</EtText>
                </View>
              </EtTopbar.Middle>
            </EtTopbar>
          </Preview>
          <CodeBlock
            code={`<EtTopbar>
  <EtTopbar.Middle>
    <View style={styles.titleSubtitle}>
      <EtText variant="heading-compact">{formatCurrency(value)}</EtText>
      <EtText variant="body-tiny-regular">Portfolio Value</EtText>
    </View>
  </EtTopbar.Middle>
</EtTopbar>`}
          />
        </Section>

        <Section>
          <SubTitle>Custom Content</SubTitle>
          <Preview>
            <EtTopbar>
              <EtTopbar.Start>
                <EtTopbar.Action onPress={() => {}} accessibilityLabel="Go back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </EtTopbar.Action>
              </EtTopbar.Start>
              <EtTopbar.Middle>
                <View style={styles.segmentedControl}>
                  <View style={[styles.segmentActive, { backgroundColor: c.bgMuted }]}>
                    <EtText variant="label-secondary-semibold">Day</EtText>
                  </View>
                  <View style={styles.segment}>
                    <EtText variant="label-secondary-regular">Week</EtText>
                  </View>
                  <View style={styles.segment}>
                    <EtText variant="label-secondary-regular">Month</EtText>
                  </View>
                </View>
              </EtTopbar.Middle>
            </EtTopbar>
          </Preview>
          <CodeBlock
            code={`<EtTopbar>
  <EtTopbar.Middle>
    <SegmentedControl
      segments={['Day', 'Week', 'Month']}
      selectedIndex={0}
      onChange={setSelectedIndex}
    />
  </EtTopbar.Middle>
</EtTopbar>`}
          />
        </Section>
      </Page>
    );
  },
};

export const EndSide: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>End Side Variants</Title>
        <Desc>
          The end slot supports close buttons, icon actions, text links, and multiple actions. In LTR it renders on the right; in RTL on the left.
        </Desc>
      </Section>

      <Section>
        <SubTitle>Close Button</SubTitle>
        <Preview>
          <EtTopbar>
            <EtTopbar.Middle>
              <EtTopbar.Title>Modal Title</EtTopbar.Title>
            </EtTopbar.Middle>
            <EtTopbar.End>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtTopbar.Action>
            </EtTopbar.End>
          </EtTopbar>
        </Preview>
        <CodeBlock
          code={`<EtTopbar>
  <EtTopbar.Middle>
    <EtTopbar.Title>Modal Title</EtTopbar.Title>
  </EtTopbar.Middle>
  <EtTopbar.End>
    <EtTopbar.Action accessibilityLabel="Close" onPress={closeModal}>
      <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.End>
</EtTopbar>`}
        />
      </Section>

      <Section>
        <SubTitle>Icon Button</SubTitle>
        <Preview>
          <EtTopbar>
            <EtTopbar.Start>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Go back">
                <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
              </EtTopbar.Action>
            </EtTopbar.Start>
            <EtTopbar.Middle>
              <EtTopbar.Title>Settings</EtTopbar.Title>
            </EtTopbar.Middle>
            <EtTopbar.End>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Settings">
                <EtoroIcon icon={{ iconName: 'settings' }} appearance={{ size: 24 }} />
              </EtTopbar.Action>
            </EtTopbar.End>
          </EtTopbar>
        </Preview>
        <CodeBlock
          code={`<EtTopbar>
  <EtTopbar.End>
    <EtTopbar.Action accessibilityLabel="Settings" onPress={openSettings}>
      <EtoroIcon icon={{ iconName: 'settings' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.End>
</EtTopbar>`}
        />
      </Section>

      <Section>
        <SubTitle>Link Button</SubTitle>
        <Preview>
          <EtTopbar>
            <EtTopbar.Start>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Go back">
                <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
              </EtTopbar.Action>
            </EtTopbar.Start>
            <EtTopbar.Middle>
              <EtTopbar.Title>Edit Profile</EtTopbar.Title>
            </EtTopbar.Middle>
            <EtTopbar.End>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Save">
                <EtText variant="label-primary-bold">Save</EtText>
              </EtTopbar.Action>
            </EtTopbar.End>
          </EtTopbar>
        </Preview>
        <CodeBlock
          code={`<EtTopbar>
  <EtTopbar.End>
    <EtTopbar.Action accessibilityLabel="Save" onPress={handleSave}>
      <EtText variant="label-primary-bold">Save</EtText>
    </EtTopbar.Action>
  </EtTopbar.End>
</EtTopbar>`}
        />
      </Section>

      <Section>
        <SubTitle>Multiple Actions</SubTitle>
        <Preview>
          <EtTopbar>
            <EtTopbar.Start>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Open menu">
                <EtoroIcon icon={{ iconName: 'menu' }} appearance={{ size: 24 }} />
              </EtTopbar.Action>
            </EtTopbar.Start>
            <EtTopbar.Middle>
              <EtTopbar.Title>Discover</EtTopbar.Title>
            </EtTopbar.Middle>
            <EtTopbar.End>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Search">
                <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 20 }} />
              </EtTopbar.Action>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Notifications">
                <EtoroIcon icon={{ iconName: 'notification' }} appearance={{ size: 20 }} />
              </EtTopbar.Action>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Profile">
                <EtoroIcon icon={{ iconName: 'user' }} appearance={{ size: 20 }} />
              </EtTopbar.Action>
            </EtTopbar.End>
          </EtTopbar>
        </Preview>
        <CodeBlock
          code={`<EtTopbar>
  <EtTopbar.End>
    <EtTopbar.Action accessibilityLabel="Search" onPress={openSearch}>
      <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 20 }} />
    </EtTopbar.Action>
    <EtTopbar.Action accessibilityLabel="Notifications" onPress={openNotifications}>
      <EtoroIcon icon={{ iconName: 'notification' }} appearance={{ size: 20 }} />
    </EtTopbar.Action>
    <EtTopbar.Action accessibilityLabel="Profile" onPress={openProfile}>
      <EtoroIcon icon={{ iconName: 'user' }} appearance={{ size: 20 }} />
    </EtTopbar.Action>
  </EtTopbar.End>
</EtTopbar>`}
        />
      </Section>
    </Page>
  ),
};

export const Combinations: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Common Combinations</Title>
        <Desc>Real-world usage patterns combining start, middle, and end slots.</Desc>
      </Section>

      <Section>
        <SubTitle>Standard Navigation</SubTitle>
        <Desc>Back button with title and close action.</Desc>
        <Preview>
          <EtTopbar>
            <EtTopbar.Start>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Go back">
                <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
              </EtTopbar.Action>
            </EtTopbar.Start>
            <EtTopbar.Middle>
              <EtTopbar.Title>Details</EtTopbar.Title>
            </EtTopbar.Middle>
            <EtTopbar.End>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Close">
                <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
              </EtTopbar.Action>
            </EtTopbar.End>
          </EtTopbar>
        </Preview>
        <CodeBlock
          code={`import { EtTopbar, EtoroIcon } from 'etoro-ui';

<EtTopbar>
  <EtTopbar.Start>
    <EtTopbar.Action accessibilityLabel="Go back" onPress={goBack}>
      <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.Start>
  <EtTopbar.Middle>
    <EtTopbar.Title>Details</EtTopbar.Title>
  </EtTopbar.Middle>
  <EtTopbar.End>
    <EtTopbar.Action accessibilityLabel="Close" onPress={closeScreen}>
      <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.End>
</EtTopbar>`}
        />
      </Section>

      <Section>
        <SubTitle>Modal Form</SubTitle>
        <Desc>Cancel and confirm text actions for forms.</Desc>
        <Preview>
          <EtTopbar>
            <EtTopbar.Start>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Cancel">
                <EtText variant="caption-regular">Cancel</EtText>
              </EtTopbar.Action>
            </EtTopbar.Start>
            <EtTopbar.Middle>
              <EtTopbar.Title>Add Funds</EtTopbar.Title>
            </EtTopbar.Middle>
            <EtTopbar.End>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Confirm">
                <EtText variant="caption-medium">Confirm</EtText>
              </EtTopbar.Action>
            </EtTopbar.End>
          </EtTopbar>
        </Preview>
        <CodeBlock
          code={`<EtTopbar>
  <EtTopbar.Start>
    <EtTopbar.Action accessibilityLabel="Cancel" onPress={handleCancel}>
      <EtText variant="caption-regular">Cancel</EtText>
    </EtTopbar.Action>
  </EtTopbar.Start>
  <EtTopbar.Middle>
    <EtTopbar.Title>Add Funds</EtTopbar.Title>
  </EtTopbar.Middle>
  <EtTopbar.End>
    <EtTopbar.Action accessibilityLabel="Confirm" onPress={handleConfirm}>
      <EtText variant="caption-medium">Confirm</EtText>
    </EtTopbar.Action>
  </EtTopbar.End>
</EtTopbar>`}
        />
      </Section>

      <Section>
        <SubTitle>Dashboard</SubTitle>
        <Desc>Menu, portfolio value, and notification icons.</Desc>
        <Preview>
          <EtTopbar>
            <EtTopbar.Start>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Open menu">
                <EtoroIcon icon={{ iconName: 'menu' }} appearance={{ size: 24 }} />
              </EtTopbar.Action>
            </EtTopbar.Start>
            <EtTopbar.Middle>
              <View style={styles.titleSubtitle}>
                <EtText variant="heading-compact">$45,230.00</EtText>
                <EtText variant="body-tiny-regular">Portfolio Value</EtText>
              </View>
            </EtTopbar.Middle>
            <EtTopbar.End>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Notifications">
                <EtoroIcon icon={{ iconName: 'notification' }} appearance={{ size: 20 }} />
              </EtTopbar.Action>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Search">
                <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 20 }} />
              </EtTopbar.Action>
            </EtTopbar.End>
          </EtTopbar>
        </Preview>
        <CodeBlock
          code={`<EtTopbar>
  <EtTopbar.Start>
    <EtTopbar.Action accessibilityLabel="Open menu" onPress={openDrawer}>
      <EtoroIcon icon={{ iconName: 'menu' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.Start>
  <EtTopbar.Middle>
    <View style={styles.titleSubtitle}>
      <EtText variant="heading-compact">{formatCurrency(portfolioValue)}</EtText>
      <EtText variant="body-tiny-regular">Portfolio Value</EtText>
    </View>
  </EtTopbar.Middle>
  <EtTopbar.End>
    <EtTopbar.Action accessibilityLabel="Notifications" onPress={openNotifications}>
      <EtoroIcon icon={{ iconName: 'notification' }} appearance={{ size: 20 }} />
    </EtTopbar.Action>
    <EtTopbar.Action accessibilityLabel="Search" onPress={openSearch}>
      <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 20 }} />
    </EtTopbar.Action>
  </EtTopbar.End>
</EtTopbar>`}
        />
      </Section>

      <Section>
        <SubTitle>Trading</SubTitle>
        <Desc>Asset detail with symbol, name, and actions.</Desc>
        <Preview>
          <EtTopbar>
            <EtTopbar.Start>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Go back">
                <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
              </EtTopbar.Action>
            </EtTopbar.Start>
            <EtTopbar.Middle>
              <View style={styles.titleSubtitle}>
                <EtText variant="label-primary-semibold">AAPL</EtText>
                <EtText variant="body-tiny-regular">Apple Inc.</EtText>
              </View>
            </EtTopbar.Middle>
            <EtTopbar.End>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Add to favorites">
                <EtoroIcon icon={{ iconName: 'heart' }} appearance={{ size: 24 }} />
              </EtTopbar.Action>
              <EtTopbar.Action onPress={() => {}} accessibilityLabel="Share">
                <EtoroIcon icon={{ iconName: 'share' }} appearance={{ size: 24 }} />
              </EtTopbar.Action>
            </EtTopbar.End>
          </EtTopbar>
        </Preview>
        <CodeBlock
          code={`<EtTopbar>
  <EtTopbar.Start>
    <EtTopbar.Action accessibilityLabel="Go back" onPress={goBack}>
      <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.Start>
  <EtTopbar.Middle>
    <View style={styles.titleSubtitle}>
      <EtText variant="label-primary-semibold">{asset.symbol}</EtText>
      <EtText variant="body-tiny-regular">{asset.name}</EtText>
    </View>
  </EtTopbar.Middle>
  <EtTopbar.End>
    <EtTopbar.Action accessibilityLabel="Add to favorites" onPress={toggleFavorite}>
      <EtoroIcon icon={{ iconName: 'heart' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
    <EtTopbar.Action accessibilityLabel="Share" onPress={shareAsset}>
      <EtoroIcon icon={{ iconName: 'share' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.End>
</EtTopbar>`}
        />
      </Section>
    </Page>
  ),
};

export const Animated: Story = {
  render: function AnimatedStory() {
    const scrollY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(scrollY.value, [0, 100], [1, 0.8]),
    }));

    return (
      <Page>
        <Section>
          <Title>Animated Variant</Title>
          <Desc>Use EtTopbar.Animated for scroll-driven animations with Reanimated styles.</Desc>
          <Preview>
            <EtTopbar.Animated style={animatedStyle}>
              <EtTopbar.Start>
                <EtTopbar.Action onPress={() => {}} accessibilityLabel="Go back">
                  <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
                </EtTopbar.Action>
              </EtTopbar.Start>
              <EtTopbar.Middle>
                <EtTopbar.Title>Animated Title</EtTopbar.Title>
              </EtTopbar.Middle>
              <EtTopbar.End>
                <EtTopbar.Action onPress={() => {}} accessibilityLabel="Close">
                  <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
                </EtTopbar.Action>
              </EtTopbar.End>
            </EtTopbar.Animated>
          </Preview>
          <CodeBlock
            code={`import { EtTopbar, EtoroIcon } from 'etoro-ui';
import { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const scrollY = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: interpolate(scrollY.value, [0, 100], [1, 0.8]),
  transform: [{ translateY: interpolate(scrollY.value, [0, 100], [0, -64]) }],
}));

<EtTopbar.Animated style={animatedStyle}>
  <EtTopbar.Start>
    <EtTopbar.Action accessibilityLabel="Go back" onPress={goBack}>
      <EtoroIcon icon={{ iconName: 'chevronLeft' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.Start>
  <EtTopbar.Middle>
    <EtTopbar.Title>Animated Title</EtTopbar.Title>
  </EtTopbar.Middle>
  <EtTopbar.End>
    <EtTopbar.Action accessibilityLabel="Close" onPress={closeScreen}>
      <EtoroIcon icon={{ iconName: 'close' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.End>
</EtTopbar.Animated>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// Liquid Glass Stories
// ─────────────────────────────────────────────────────────────

function GlassTextToggle() {
  const [selectedId, setSelectedId] = useState('investing');
  return (
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} size="small">
      <EtTextToggle.Option id="investing" label="Investing" />
      <EtTextToggle.Option id="crypto" label="Crypto" />
    </EtTextToggle>
  );
}

export const LiquidGlass: Story = {
  render: function LiquidGlassStory() {
    const { c } = useTheme();

    return (
      <Page>
        <Section>
          <Title>Liquid Glass (iOS 26+)</Title>
          <Desc>
            On iOS 26+, the TopBar automatically detects Liquid Glass support and adapts. The background becomes transparent, and Start/End slot
            actions are wrapped in glass capsules — circular for a single action, pill-shaped for multiple.
          </Desc>
          <Desc>
            The storybook registers a mock glass module at startup, so EtTopbar enters glass mode automatically on iOS simulators. On a real device
            with iOS 26+ and the real expo-glass-effect module, the native translucent effect renders.
          </Desc>
        </Section>

        <Section>
          <SubTitle>Single Action + Text Toggle</SubTitle>
          <Desc>One circular glass action on the start side, with a glass-enabled EtTextToggle in the middle.</Desc>
          <Preview>
            <View style={[glassPreviewStyles.container, { backgroundColor: c.bgMuted }]}>
              <EtTopbar>
                <EtTopbar.Start>
                  <EtTopbar.Action onPress={() => {}} accessibilityLabel="Open menu">
                    <EtoroIcon icon={{ iconName: 'menu' }} appearance={{ size: 24 }} />
                  </EtTopbar.Action>
                </EtTopbar.Start>
                <EtTopbar.Middle>
                  <GlassTextToggle />
                </EtTopbar.Middle>
              </EtTopbar>
            </View>
          </Preview>
          <CodeBlock
            code={`import { EtTopbar, EtTextToggle, EtoroIcon } from 'etoro-ui';

// No extra setup needed — EtTopbar detects Liquid Glass automatically.
// The glass wrapping of actions is handled internally.

<EtTopbar>
  <EtTopbar.Start>
    <EtTopbar.Action accessibilityLabel="Open menu" onPress={openMenu}>
      <EtoroIcon icon={{ iconName: 'menu' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.Start>
  <EtTopbar.Middle>
    <EtTextToggle selectedId={selectedId} onSelectionChange={setSelectedId} size="small">
      <EtTextToggle.Option id="investing" label="Investing" />
      <EtTextToggle.Option id="crypto" label="Crypto" />
    </EtTextToggle>
  </EtTopbar.Middle>
</EtTopbar>`}
          />
        </Section>

        <Section>
          <SubTitle>Single Action + Pill Actions</SubTitle>
          <Desc>One circular glass action on the start side, and two actions grouped in a pill-shaped glass capsule on the end side.</Desc>
          <Preview>
            <View style={[glassPreviewStyles.container, { backgroundColor: c.bgMuted }]}>
              <EtTopbar>
                <EtTopbar.Start>
                  <EtTopbar.Action onPress={() => {}} accessibilityLabel="Open menu">
                    <EtoroIcon icon={{ iconName: 'menu' }} appearance={{ size: 24 }} />
                  </EtTopbar.Action>
                </EtTopbar.Start>
                <EtTopbar.Middle>
                  <View />
                </EtTopbar.Middle>
                <EtTopbar.End>
                  <EtTopbar.Action onPress={() => {}} accessibilityLabel="Search">
                    <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 20 }} />
                  </EtTopbar.Action>
                  <EtTopbar.Action onPress={() => {}} accessibilityLabel="Notifications">
                    <EtoroIcon icon={{ iconName: 'notification' }} appearance={{ size: 20 }} />
                  </EtTopbar.Action>
                </EtTopbar.End>
              </EtTopbar>
            </View>
          </Preview>
          <CodeBlock
            code={`import { EtTopbar, EtoroIcon } from 'etoro-ui';

<EtTopbar>
  <EtTopbar.Start>
    <EtTopbar.Action accessibilityLabel="Open menu" onPress={openMenu}>
      <EtoroIcon icon={{ iconName: 'menu' }} appearance={{ size: 24 }} />
    </EtTopbar.Action>
  </EtTopbar.Start>
  <EtTopbar.Middle>
    <View />
  </EtTopbar.Middle>
  <EtTopbar.End>
    <EtTopbar.Action accessibilityLabel="Search" onPress={openSearch}>
      <EtoroIcon icon={{ iconName: 'search' }} appearance={{ size: 20 }} />
    </EtTopbar.Action>
    <EtTopbar.Action accessibilityLabel="Notifications" onPress={openNotifications}>
      <EtoroIcon icon={{ iconName: 'notification' }} appearance={{ size: 20 }} />
    </EtTopbar.Action>
  </EtTopbar.End>
</EtTopbar>`}
          />
        </Section>

        <Section>
          <SubTitle>Developer Guide</SubTitle>
          <Desc>
            Liquid Glass is detected automatically by EtTopbar via the useLiquidGlass() hook. When available, the TopBar wraps Start/End slot children
            in glass capsules. The middle slot is not wrapped — components like EtTextToggle auto-detect Liquid Glass independently.
          </Desc>
          <Desc>App setup requires a one-time registration call:</Desc>
          <CodeBlock
            code={`// In your app's setup file (e.g. setup.ts):
import * as ExpoGlassEffect from 'expo-glass-effect';
import { registerGlassEffect } from 'etoro-ui/core';

registerGlassEffect(ExpoGlassEffect);`}
          />
        </Section>
      </Page>
    );
  },
};

const glassPreviewStyles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtTopbar</SubTitle>
        <Desc>Root container component. Extends ViewProps.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'style', type: 'ViewStyle', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTopbar.Animated</SubTitle>
        <Desc>Animated variant using Animated.View for scroll-driven animations. Supports Reanimated animated styles.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'style', type: 'AnimatedStyle', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTopbar.Start / Middle / End</SubTitle>
        <Desc>Slot containers for positioning content. Start and End have z-index 2, Middle is absolutely positioned with z-index 1.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'style', type: 'ViewStyle', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTopbar.Action</SubTitle>
        <Desc>Pressable wrapper for interactive elements. Extends PressableProps with built-in hit slop for easier touch targets.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'onPress', type: '() => void', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
            { prop: 'hitSlop', type: 'number', default: '10' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTopbar.Title</SubTitle>
        <Desc>Styled title text component. Extends EtTextProps with centered alignment.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            {
              prop: 'variant',
              type: 'TextVariant',
              default: '"heading-compact"',
            },
            { prop: 'numberOfLines', type: 'number', default: '1' },
            { prop: 'style', type: 'TextStyle', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  titleSubtitle: {
    alignItems: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  segmentActive: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
});
