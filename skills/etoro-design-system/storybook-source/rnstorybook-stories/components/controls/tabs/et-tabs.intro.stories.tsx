import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { EtTabs, EtText } from 'etoro-ui';
import { CodeBlock, Col, Desc, Page, Preview, Row, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtTabs>;

const meta: Meta<typeof EtTabs> = {
  title: 'eToro-UI/Components/Controls/EtTabs/Introduction',
  component: EtTabs,
};

export default meta;

export const Overview: Story = {
  render: function OverviewStory() {
    const { c } = useTheme();

    return (
      <Page>
        <Section>
          <Title>EtTabs</Title>
          <Desc>
            A compound component for full-page swipeable tabbed interfaces. Uses react-native-tab-view internally for native swipe gestures. Supports
            both controlled and uncontrolled modes.
          </Desc>
        </Section>

        <Section>
          <SubTitle>Features</SubTitle>
          <Col gap={8}>
            <EtText variant="body-base-regular" style={{ color: c.text }}>
              • Swipeable - Native swipe gestures to navigate between tabs
            </EtText>
            <EtText variant="body-base-regular" style={{ color: c.text }}>
              • Full Page Content - Each tab takes the full available height
            </EtText>
            <EtText variant="body-base-regular" style={{ color: c.text }}>
              • Compound Component Pattern - Compose EtTabs.List, EtTabs.Trigger, and EtTabs.Content
            </EtText>
            <EtText variant="body-base-regular" style={{ color: c.text }}>
              • Controlled/Uncontrolled - Use value/onValueChange or defaultValue
            </EtText>
            <EtText variant="body-base-regular" style={{ color: c.text }}>
              • Animated Indicator - Smooth animated underline on tab change
            </EtText>
            <EtText variant="body-base-regular" style={{ color: c.text }}>
              • Lazy Loading - Content renders only when tab becomes active
            </EtText>
            <EtText variant="body-base-regular" style={{ color: c.text }}>
              • Variants - "line" (with divider) or "plain" (no divider)
            </EtText>
            <EtText variant="body-base-regular" style={{ color: c.text }}>
              • Scrollable Headers - Support for many tabs with horizontal scrolling
            </EtText>
          </Col>
        </Section>

        <Section>
          <SubTitle>Quick Example</SubTitle>
          <Desc>Swipe left/right to navigate between tabs.</Desc>
          <Preview>
            <View style={{ height: 220 }}>
              <EtTabs defaultValue="overview">
                <EtTabs.List>
                  <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
                  <EtTabs.Trigger value="analytics">Analytics</EtTabs.Trigger>
                  <EtTabs.Trigger value="reports">Reports</EtTabs.Trigger>
                </EtTabs.List>
                <EtTabs.Content value="overview">
                  <View style={{ flex: 1, padding: 16 }}>
                    <EtText variant="body-base-semibold">Overview</EtText>
                    <EtText variant="body-secondary-regular">View your key metrics and recent activity.</EtText>
                  </View>
                </EtTabs.Content>
                <EtTabs.Content value="analytics">
                  <View style={{ flex: 1, padding: 16 }}>
                    <EtText variant="body-base-semibold">Analytics</EtText>
                    <EtText variant="body-secondary-regular">Detailed analytics and performance metrics.</EtText>
                  </View>
                </EtTabs.Content>
                <EtTabs.Content value="reports">
                  <View style={{ flex: 1, padding: 16 }}>
                    <EtText variant="body-base-semibold">Reports</EtText>
                    <EtText variant="body-secondary-regular">Generate and download reports.</EtText>
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

        <Section>
          <SubTitle>Compound Components</SubTitle>
          <Col gap={16}>
            <Row gap={16}>
              <Col gap={4}>
                <EtText variant="body-base-semibold" style={{ color: c.text }}>
                  EtTabs
                </EtText>
                <EtText variant="body-secondary-regular" style={{ color: c.textMuted }}>
                  Root component. Accepts defaultValue or value/onValueChange.
                </EtText>
              </Col>
            </Row>
            <Row gap={16}>
              <Col gap={4}>
                <EtText variant="body-base-semibold" style={{ color: c.text }}>
                  EtTabs.List
                </EtText>
                <EtText variant="body-secondary-regular" style={{ color: c.textMuted }}>
                  Container for triggers. Always scrollable with gradient fade overlays. Supports variant prop.
                </EtText>
              </Col>
            </Row>
            <Row gap={16}>
              <Col gap={4}>
                <EtText variant="body-base-semibold" style={{ color: c.text }}>
                  EtTabs.Trigger
                </EtText>
                <EtText variant="body-secondary-regular" style={{ color: c.textMuted }}>
                  Tab button. Requires value prop matching content.
                </EtText>
              </Col>
            </Row>
            <Row gap={16}>
              <Col gap={4}>
                <EtText variant="body-base-semibold" style={{ color: c.text }}>
                  EtTabs.Content
                </EtText>
                <EtText variant="body-secondary-regular" style={{ color: c.textMuted }}>
                  Content panel. Only renders when active (lazy by default).
                </EtText>
              </Col>
            </Row>
          </Col>
        </Section>

        <Section>
          <SubTitle>Controlled Mode</SubTitle>
          <Desc>For full control over the active tab, use value and onValueChange props.</Desc>
          <CodeBlock
            code={`import { EtTabs } from 'etoro-ui';
import { useState } from 'react';

const [activeTab, setActiveTab] = useState('overview');

<EtTabs value={activeTab} onValueChange={setActiveTab}>
  <EtTabs.List>
    <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
    <EtTabs.Trigger value="analytics">Analytics</EtTabs.Trigger>
  </EtTabs.List>
  <EtTabs.Content value="overview">
    Overview content
  </EtTabs.Content>
  <EtTabs.Content value="analytics">
    Analytics content
  </EtTabs.Content>
</EtTabs>`}
          />
        </Section>
      </Page>
    );
  },
};
