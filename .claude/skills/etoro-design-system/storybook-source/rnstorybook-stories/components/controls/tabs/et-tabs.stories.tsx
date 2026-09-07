import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';

import { EtTabs, EtText } from 'etoro-ui';
import { CodeBlock, Col, Desc, Page, Preview, PropsTable, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtTabs>;

const meta: Meta<typeof EtTabs> = {
  title: 'eToro-UI/Components/Controls/EtTabs',
  component: EtTabs,
};

export default meta;

// ─────────────────────────────────────────────────────────────
// Basic Story
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>
          A full-page swipeable tabbed interface using the compound component pattern. Swipe left/right to navigate between tabs, or tap the tab
          headers.
        </Desc>
        <Preview>
          <View style={{ height: 250 }}>
            <EtTabs defaultValue="overview">
              <EtTabs.List>
                <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
                <EtTabs.Trigger value="analytics">Analytics</EtTabs.Trigger>
                <EtTabs.Trigger value="reports">Reports</EtTabs.Trigger>
              </EtTabs.List>
              <EtTabs.Content value="overview">
                <View style={{ flex: 1, padding: 16, gap: 8 }}>
                  <EtText variant="body-base-semibold">Overview</EtText>
                  <EtText variant="body-secondary-regular">View your key metrics and recent project activity. Swipe left to see Analytics.</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="analytics">
                <View style={{ flex: 1, padding: 16, gap: 8 }}>
                  <EtText variant="body-base-semibold">Analytics</EtText>
                  <EtText variant="body-secondary-regular">
                    Detailed analytics and performance metrics. Swipe left for Reports or right for Overview.
                  </EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="reports">
                <View style={{ flex: 1, padding: 16, gap: 8 }}>
                  <EtText variant="body-base-semibold">Reports</EtText>
                  <EtText variant="body-secondary-regular">Generate and download reports. Swipe right to go back.</EtText>
                </View>
              </EtTabs.Content>
            </EtTabs>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtTabs } from 'etoro-ui';

<EtTabs defaultValue="overview">
  <EtTabs.List>
    <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
    <EtTabs.Trigger value="analytics">Analytics</EtTabs.Trigger>
    <EtTabs.Trigger value="reports">Reports</EtTabs.Trigger>
  </EtTabs.List>
  <EtTabs.Content value="overview">
    <OverviewContent />
  </EtTabs.Content>
  <EtTabs.Content value="analytics">
    <AnalyticsContent />
  </EtTabs.Content>
  <EtTabs.Content value="reports">
    <ReportsContent />
  </EtTabs.Content>
</EtTabs>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// Variants
// ─────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Variants</Title>
        <Desc>EtTabs.List supports two visual variants: "line" (default) with a subtle divider, and "plain" without.</Desc>
      </Section>

      <Section>
        <SubTitle>Line Variant (Default)</SubTitle>
        <Desc>Has a subtle divider line at the bottom of the tab list.</Desc>
        <Preview>
          <View style={{ height: 150 }}>
            <EtTabs defaultValue="tab1">
              <EtTabs.List variant="line">
                <EtTabs.Trigger value="tab1">Overview</EtTabs.Trigger>
                <EtTabs.Trigger value="tab2">Analytics</EtTabs.Trigger>
                <EtTabs.Trigger value="tab3">Reports</EtTabs.Trigger>
              </EtTabs.List>
              <EtTabs.Content value="tab1">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Line variant with divider</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab2">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Analytics</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab3">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Reports</EtText>
                </View>
              </EtTabs.Content>
            </EtTabs>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtTabs } from 'etoro-ui';

<EtTabs defaultValue="tab1">
  <EtTabs.List variant="line">
    <EtTabs.Trigger value="tab1">Overview</EtTabs.Trigger>
    <EtTabs.Trigger value="tab2">Analytics</EtTabs.Trigger>
    <EtTabs.Trigger value="tab3">Reports</EtTabs.Trigger>
  </EtTabs.List>
  <EtTabs.Content value="tab1">...</EtTabs.Content>
</EtTabs>`}
        />
      </Section>

      <Section>
        <SubTitle>Plain Variant</SubTitle>
        <Desc>No divider line - useful for embedded or minimal layouts.</Desc>
        <Preview>
          <View style={{ height: 150 }}>
            <EtTabs defaultValue="tab1">
              <EtTabs.List variant="plain">
                <EtTabs.Trigger value="tab1">Overview</EtTabs.Trigger>
                <EtTabs.Trigger value="tab2">Analytics</EtTabs.Trigger>
                <EtTabs.Trigger value="tab3">Reports</EtTabs.Trigger>
              </EtTabs.List>
              <EtTabs.Content value="tab1">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Plain variant without divider</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab2">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Analytics</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab3">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Reports</EtText>
                </View>
              </EtTabs.Content>
            </EtTabs>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtTabs } from 'etoro-ui';

<EtTabs defaultValue="tab1">
  <EtTabs.List variant="plain">
    <EtTabs.Trigger value="tab1">Overview</EtTabs.Trigger>
    <EtTabs.Trigger value="tab2">Analytics</EtTabs.Trigger>
    <EtTabs.Trigger value="tab3">Reports</EtTabs.Trigger>
  </EtTabs.List>
  <EtTabs.Content value="tab1">...</EtTabs.Content>
</EtTabs>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// Scrollable
// ─────────────────────────────────────────────────────────────

export const Scrollable: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Scrollable</Title>
        <Desc>
          The tab list is always horizontally scrollable. When tabs overflow, gradient fade overlays appear at the edges to indicate more content.
        </Desc>
        <Preview>
          <View style={{ height: 150 }}>
            <EtTabs defaultValue="tab1">
              <EtTabs.List>
                <EtTabs.Trigger value="tab1">Overview</EtTabs.Trigger>
                <EtTabs.Trigger value="tab2">Analytics</EtTabs.Trigger>
                <EtTabs.Trigger value="tab3">Reports</EtTabs.Trigger>
                <EtTabs.Trigger value="tab4">Settings</EtTabs.Trigger>
                <EtTabs.Trigger value="tab5">Users</EtTabs.Trigger>
                <EtTabs.Trigger value="tab6">Permissions</EtTabs.Trigger>
                <EtTabs.Trigger value="tab7">Integrations</EtTabs.Trigger>
              </EtTabs.List>
              <EtTabs.Content value="tab1">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Scroll the tab bar to see more tabs</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab2">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Analytics</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab3">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Reports</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab4">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Settings</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab5">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Users</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab6">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Permissions</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab7">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Integrations</EtText>
                </View>
              </EtTabs.Content>
            </EtTabs>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtTabs } from 'etoro-ui';

<EtTabs defaultValue="tab1">
  <EtTabs.List>
    <EtTabs.Trigger value="tab1">Overview</EtTabs.Trigger>
    <EtTabs.Trigger value="tab2">Analytics</EtTabs.Trigger>
    ...
  </EtTabs.List>
  <EtTabs.Content value="tab1">...</EtTabs.Content>
  ...
</EtTabs>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// Disabled State
// ─────────────────────────────────────────────────────────────

export const DisabledState: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Disabled State</Title>
        <Desc>Individual tabs can be disabled using the disabled prop on EtTabs.Trigger.</Desc>
        <Preview>
          <View style={{ height: 180 }}>
            <EtTabs defaultValue="overview">
              <EtTabs.List>
                <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
                <EtTabs.Trigger value="analytics" disabled>
                  Analytics
                </EtTabs.Trigger>
                <EtTabs.Trigger value="reports">Reports</EtTabs.Trigger>
              </EtTabs.List>
              <EtTabs.Content value="overview">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">The Analytics tab is disabled and cannot be selected.</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="reports">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Reports content</EtText>
                </View>
              </EtTabs.Content>
            </EtTabs>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtTabs } from 'etoro-ui';

<EtTabs defaultValue="overview">
  <EtTabs.List>
    <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
    <EtTabs.Trigger value="analytics" disabled>
      Analytics
    </EtTabs.Trigger>
    <EtTabs.Trigger value="reports">Reports</EtTabs.Trigger>
  </EtTabs.List>
  <EtTabs.Content value="overview">
    <Text>The Analytics tab is disabled</Text>
  </EtTabs.Content>
</EtTabs>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// Controlled Mode
// ─────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: function ControlledStory() {
    const [activeTab, setActiveTab] = useState('overview');
    const { c } = useTheme();

    return (
      <Page>
        <Section>
          <Title>Controlled Mode</Title>
          <Desc>Use value and onValueChange props for full control over the active tab state.</Desc>
          <Preview>
            <Col gap={16}>
              <View style={{ height: 200 }}>
                <EtTabs value={activeTab} onValueChange={setActiveTab}>
                  <EtTabs.List>
                    <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
                    <EtTabs.Trigger value="analytics">Analytics</EtTabs.Trigger>
                    <EtTabs.Trigger value="reports">Reports</EtTabs.Trigger>
                  </EtTabs.List>
                  <EtTabs.Content value="overview">
                    <View style={{ flex: 1, padding: 16, gap: 8 }}>
                      <EtText variant="body-base-semibold">Overview Content</EtText>
                      <EtText variant="body-secondary-regular">Track progress across all your active projects.</EtText>
                    </View>
                  </EtTabs.Content>
                  <EtTabs.Content value="analytics">
                    <View style={{ flex: 1, padding: 16, gap: 8 }}>
                      <EtText variant="body-base-semibold">Analytics Content</EtText>
                      <EtText variant="body-secondary-regular">Understand your data trends.</EtText>
                    </View>
                  </EtTabs.Content>
                  <EtTabs.Content value="reports">
                    <View style={{ flex: 1, padding: 16, gap: 8 }}>
                      <EtText variant="body-base-semibold">Reports Content</EtText>
                      <EtText variant="body-secondary-regular">Export data in various formats.</EtText>
                    </View>
                  </EtTabs.Content>
                </EtTabs>
              </View>
              <EtText variant="body-secondary-regular" style={{ fontFamily: 'Courier', color: c.textMuted }}>
                Active tab: {activeTab}
              </EtText>
            </Col>
          </Preview>
          <CodeBlock
            code={`import { EtTabs } from 'etoro-ui';
import { useState } from 'react';

const [activeTab, setActiveTab] = useState('overview');

<EtTabs value={activeTab} onValueChange={setActiveTab}>
  <EtTabs.List>
    <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
    <EtTabs.Trigger value="analytics">Analytics</EtTabs.Trigger>
    <EtTabs.Trigger value="reports">Reports</EtTabs.Trigger>
  </EtTabs.List>
  <EtTabs.Content value="overview">
    <OverviewContent />
  </EtTabs.Content>
  <EtTabs.Content value="analytics">
    <AnalyticsContent />
  </EtTabs.Content>
  <EtTabs.Content value="reports">
    <ReportsContent />
  </EtTabs.Content>
</EtTabs>

// Active tab: {activeTab}`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// Swipe Configuration
// ─────────────────────────────────────────────────────────────

export const SwipeConfiguration: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Swipe Configuration</Title>
        <Desc>Control swipe behavior with swipeEnabled prop. When disabled, users can only switch tabs by tapping the tab headers.</Desc>
      </Section>

      <Section>
        <SubTitle>Swipe Enabled (Default)</SubTitle>
        <Desc>Users can swipe left/right to navigate between tabs.</Desc>
        <Preview>
          <View style={{ height: 180 }}>
            <EtTabs defaultValue="tab1" swipeEnabled>
              <EtTabs.List>
                <EtTabs.Trigger value="tab1">Tab 1</EtTabs.Trigger>
                <EtTabs.Trigger value="tab2">Tab 2</EtTabs.Trigger>
                <EtTabs.Trigger value="tab3">Tab 3</EtTabs.Trigger>
              </EtTabs.List>
              <EtTabs.Content value="tab1">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Swipe left to navigate to Tab 2</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab2">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Swipe in either direction</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab3">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Swipe right to go back</EtText>
                </View>
              </EtTabs.Content>
            </EtTabs>
          </View>
        </Preview>
      </Section>

      <Section>
        <SubTitle>Swipe Disabled</SubTitle>
        <Desc>Users can only switch tabs by tapping. Useful for forms.</Desc>
        <Preview>
          <View style={{ height: 180 }}>
            <EtTabs defaultValue="tab1" swipeEnabled={false}>
              <EtTabs.List>
                <EtTabs.Trigger value="tab1">Step 1</EtTabs.Trigger>
                <EtTabs.Trigger value="tab2">Step 2</EtTabs.Trigger>
                <EtTabs.Trigger value="tab3">Step 3</EtTabs.Trigger>
              </EtTabs.List>
              <EtTabs.Content value="tab1">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Swipe is disabled. Tap "Step 2" to continue.</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab2">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Navigate by tapping tab headers only.</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab3">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">Final step content.</EtText>
                </View>
              </EtTabs.Content>
            </EtTabs>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtTabs } from 'etoro-ui';

// Disable swipe gestures
<EtTabs defaultValue="step1" swipeEnabled={false}>
  <EtTabs.List>
    <EtTabs.Trigger value="step1">Step 1</EtTabs.Trigger>
    <EtTabs.Trigger value="step2">Step 2</EtTabs.Trigger>
  </EtTabs.List>
  <EtTabs.Content value="step1">
    <StepOneContent />
  </EtTabs.Content>
  <EtTabs.Content value="step2">
    <StepTwoContent />
  </EtTabs.Content>
</EtTabs>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// Lazy Loading
// ─────────────────────────────────────────────────────────────

export const LazyLoading: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Lazy Loading</Title>
        <Desc>Control when tab content is rendered with the lazy and lazyPreloadDistance props.</Desc>
      </Section>

      <Section>
        <SubTitle>Lazy (Default)</SubTitle>
        <Desc>Content is only rendered when the tab becomes active. This is the default behavior — no extra prop needed.</Desc>
        <Preview>
          <View style={{ height: 180 }}>
            <EtTabs defaultValue="tab1">
              <EtTabs.List>
                <EtTabs.Trigger value="tab1">Loaded</EtTabs.Trigger>
                <EtTabs.Trigger value="tab2">Not Yet</EtTabs.Trigger>
                <EtTabs.Trigger value="tab3">Not Yet</EtTabs.Trigger>
              </EtTabs.List>
              <EtTabs.Content value="tab1">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">This content loaded immediately.</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab2">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">This content loaded when you swiped here.</EtText>
                </View>
              </EtTabs.Content>
              <EtTabs.Content value="tab3">
                <View style={{ flex: 1, padding: 16 }}>
                  <EtText variant="body-secondary-regular">This content loaded when you swiped here.</EtText>
                </View>
              </EtTabs.Content>
            </EtTabs>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtTabs } from 'etoro-ui';

// Lazy loading is on by default — no extra prop needed
<EtTabs defaultValue="tab1">
  ...
</EtTabs>

// Preload adjacent tabs
<EtTabs defaultValue="tab1" lazyPreloadDistance={1}>
  ...
</EtTabs>

// Disable lazy loading - render all tabs immediately
<EtTabs defaultValue="tab1" lazy={false}>
  ...
</EtTabs>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// Usage Examples
// ─────────────────────────────────────────────────────────────

export const UsageExamples: Story = {
  render: function UsageExamplesStory() {
    const [settingsTab, setSettingsTab] = useState('account');

    return (
      <Page>
        <Section>
          <Title>Usage Examples</Title>
          <Desc>Common patterns for using EtTabs in eToro applications.</Desc>
        </Section>

        <Section>
          <SubTitle>Settings Form</SubTitle>
          <Preview>
            <View style={{ height: 200 }}>
              <EtTabs value={settingsTab} onValueChange={setSettingsTab}>
                <EtTabs.List>
                  <EtTabs.Trigger value="account">Account</EtTabs.Trigger>
                  <EtTabs.Trigger value="password">Password</EtTabs.Trigger>
                  <EtTabs.Trigger value="notifications">Notifications</EtTabs.Trigger>
                </EtTabs.List>
                <EtTabs.Content value="account">
                  <View style={{ flex: 1, padding: 16, gap: 8 }}>
                    <EtText variant="body-base-semibold">Account Settings</EtText>
                    <EtText variant="body-secondary-regular">Make changes to your account here. Click save when done.</EtText>
                  </View>
                </EtTabs.Content>
                <EtTabs.Content value="password">
                  <View style={{ flex: 1, padding: 16, gap: 8 }}>
                    <EtText variant="body-base-semibold">Change Password</EtText>
                    <EtText variant="body-secondary-regular">After saving, you will be logged out.</EtText>
                  </View>
                </EtTabs.Content>
                <EtTabs.Content value="notifications">
                  <View style={{ flex: 1, padding: 16, gap: 8 }}>
                    <EtText variant="body-base-semibold">Notification Preferences</EtText>
                    <EtText variant="body-secondary-regular">Configure how you receive notifications.</EtText>
                  </View>
                </EtTabs.Content>
              </EtTabs>
            </View>
          </Preview>
          <CodeBlock
            code={`import { EtTabs } from 'etoro-ui';
import { useState } from 'react';

const [tab, setTab] = useState('account');

<EtTabs value={tab} onValueChange={setTab}>
  <EtTabs.List>
    <EtTabs.Trigger value="account">Account</EtTabs.Trigger>
    <EtTabs.Trigger value="password">Password</EtTabs.Trigger>
    <EtTabs.Trigger value="notifications">Notifications</EtTabs.Trigger>
  </EtTabs.List>
  <EtTabs.Content value="account">
    <AccountForm />
  </EtTabs.Content>
  <EtTabs.Content value="password">
    <PasswordForm />
  </EtTabs.Content>
  <EtTabs.Content value="notifications">
    <NotificationSettings />
  </EtTabs.Content>
</EtTabs>`}
          />
        </Section>

        <Section>
          <SubTitle>Dashboard Navigation</SubTitle>
          <Preview>
            <View style={{ height: 180 }}>
              <EtTabs defaultValue="portfolio">
                <EtTabs.List variant="plain">
                  <EtTabs.Trigger value="portfolio">Portfolio</EtTabs.Trigger>
                  <EtTabs.Trigger value="watchlist">Watchlist</EtTabs.Trigger>
                  <EtTabs.Trigger value="history">History</EtTabs.Trigger>
                  <EtTabs.Trigger value="dividends">Dividends</EtTabs.Trigger>
                </EtTabs.List>
                <EtTabs.Content value="portfolio">
                  <View style={{ flex: 1, padding: 16 }}>
                    <EtText variant="body-secondary-regular">Portfolio content</EtText>
                  </View>
                </EtTabs.Content>
                <EtTabs.Content value="watchlist">
                  <View style={{ flex: 1, padding: 16 }}>
                    <EtText variant="body-secondary-regular">Watchlist content</EtText>
                  </View>
                </EtTabs.Content>
                <EtTabs.Content value="history">
                  <View style={{ flex: 1, padding: 16 }}>
                    <EtText variant="body-secondary-regular">History content</EtText>
                  </View>
                </EtTabs.Content>
                <EtTabs.Content value="dividends">
                  <View style={{ flex: 1, padding: 16 }}>
                    <EtText variant="body-secondary-regular">Dividends content</EtText>
                  </View>
                </EtTabs.Content>
              </EtTabs>
            </View>
          </Preview>
          <CodeBlock
            code={`import { EtTabs } from 'etoro-ui';

<EtTabs defaultValue="portfolio">
  <EtTabs.List variant="plain">
    <EtTabs.Trigger value="portfolio">Portfolio</EtTabs.Trigger>
    <EtTabs.Trigger value="watchlist">Watchlist</EtTabs.Trigger>
    <EtTabs.Trigger value="history">History</EtTabs.Trigger>
    <EtTabs.Trigger value="dividends">Dividends</EtTabs.Trigger>
  </EtTabs.List>
</EtTabs>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// API Reference
// ─────────────────────────────────────────────────────────────

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtTabs</SubTitle>
        <Desc>Root component that provides tab context. Uses react-native-tab-view internally for full-page swipeable tabs.</Desc>
        <PropsTable
          data={[
            {
              prop: 'defaultValue',
              type: 'string',
              default: '-',
            },
            {
              prop: 'value',
              type: 'string',
              default: '-',
            },
            {
              prop: 'onValueChange',
              type: '(value: string) => void',
              default: '-',
            },
            {
              prop: 'animationDuration',
              type: 'number',
              default: '200',
            },
            {
              prop: 'swipeEnabled',
              type: 'boolean',
              default: 'true',
            },
            {
              prop: 'lazy',
              type: 'boolean',
              default: 'true',
            },
            {
              prop: 'lazyPreloadDistance',
              type: 'number',
              default: '0',
            },
            {
              prop: 'renderLazyPlaceholder',
              type: '(props: { route: { key: string } }) => ReactNode',
              default: '-',
            },
            {
              prop: 'containerStyle',
              type: 'ViewStyle',
              default: '-',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTabs.List</SubTitle>
        <Desc>Container for tab triggers. Always horizontally scrollable with gradient fade overlays at the edges when content overflows.</Desc>
        <PropsTable
          data={[
            {
              prop: 'variant',
              type: '"line" | "plain"',
              default: '"line"',
            },
            {
              prop: 'scrollViewProps',
              type: 'ScrollViewProps',
              default: '-',
            },
            {
              prop: 'style',
              type: 'ViewStyle',
              default: '-',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
            },
            {
              prop: 'accessibilityLabel',
              type: 'string',
              default: '-',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTabs.Trigger</SubTitle>
        <Desc>Individual tab button. Registers its layout for the animated indicator.</Desc>
        <PropsTable
          data={[
            {
              prop: 'value',
              type: 'string',
              default: '-',
            },
            {
              prop: 'disabled',
              type: 'boolean',
              default: 'false',
            },
            {
              prop: 'children',
              type: 'string',
              default: '-',
            },
            {
              prop: 'style',
              type: 'ViewStyle',
              default: '-',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
            },
            {
              prop: 'accessibilityLabel',
              type: 'string',
              default: '-',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTabs.Content</SubTitle>
        <Desc>Content panel for a tab. Rendered by TabView internally. Use the lazy prop on EtTabs to control when content is rendered.</Desc>
        <PropsTable
          data={[
            {
              prop: 'value',
              type: 'string',
              default: '-',
            },
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
            },
            {
              prop: 'style',
              type: 'ViewStyle',
              default: '-',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '-',
            },
          ]}
        />
      </Section>
    </Page>
  ),
};
