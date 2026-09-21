import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { EtPreviewContainer, EtSparkChart, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

const SAMPLE_SPARK = [
  { equity: 100, timestamp: '2025-01-10' },
  { equity: 120, timestamp: '2025-01-11' },
  { equity: 110, timestamp: '2025-01-12' },
  { equity: 140, timestamp: '2025-01-13' },
  { equity: 135, timestamp: '2025-01-14' },
];

const meta: Meta<typeof EtPreviewContainer> = {
  title: 'eToro-UI/Components/Layout/EtPreviewContainer',
  component: EtPreviewContainer,
};

export default meta;

type Story = StoryObj<typeof EtPreviewContainer>;

function PreviewCardDemo({ floating = false, showHandle = true }: { floating?: boolean; showHandle?: boolean }) {
  const { colors } = useEtoroTheme();

  return (
    <EtPreviewContainer
      floating={floating}
      showHandle={showHandle}
      onPress={() => undefined}
      accessibilityLabel="My portfolio value"
      style={floating ? undefined : { marginHorizontal: 15 }}
    >
      <EtPreviewContainer.Content>
        <EtText variant="label-tertiary-regular" style={{ color: colors.carbon900 }}>
          My portfolio value
        </EtText>
        <EtText variant="num-md" style={{ color: colors.carbon900 }}>
          $100,723.59
        </EtText>
      </EtPreviewContainer.Content>
      <EtPreviewContainer.Trailing>
        <EtSparkChart data={SAMPLE_SPARK} balance="negative" width={100} height={26} />
      </EtPreviewContainer.Trailing>
    </EtPreviewContainer>
  );
}

export const Basic: Story = {
  render: function BasicStory() {
    return (
      <Page>
        <Section>
          <Title>Basic</Title>
          <Desc>
            Floating glass preview card shell. Compose label/value via Content and a trailing visual (sparkline) via Trailing. Consumer owns domain
            data.
          </Desc>
          <Preview>
            <View style={{ paddingVertical: 24, width: '100%' }}>
              <PreviewCardDemo />
            </View>
          </Preview>
          <CodeBlock
            code={`import { EtPreviewContainer, EtText, EtSparkChart } from 'etoro-ui';

<EtPreviewContainer onPress={open} accessibilityLabel="My portfolio value">
  <EtPreviewContainer.Content>
    <EtText variant="label-tertiary-regular">My portfolio value</EtText>
    <EtText variant="num-md">$100,723.59</EtText>
  </EtPreviewContainer.Content>
  <EtPreviewContainer.Trailing>
    <EtSparkChart data={spark} balance="negative" width={100} height={26} />
  </EtPreviewContainer.Trailing>
</EtPreviewContainer>`}
          />
        </Section>
      </Page>
    );
  },
};

export const WithoutHandle: Story = {
  render: function WithoutHandleStory() {
    return (
      <Page>
        <Section>
          <Title>Without handle</Title>
          <Desc>Hide the grab handle with showHandle={'{false}'}.</Desc>
          <Preview>
            <View style={{ paddingVertical: 24, width: '100%' }}>
              <PreviewCardDemo showHandle={false} />
            </View>
          </Preview>
          <CodeBlock
            code={`<EtPreviewContainer showHandle={false} onPress={open} accessibilityLabel="Preview">
  <EtPreviewContainer.Content>...</EtPreviewContainer.Content>
</EtPreviewContainer>`}
          />
        </Section>
      </Page>
    );
  },
};

export const Floating: Story = {
  render: function FloatingStory() {
    return (
      <Page>
        <Section>
          <Title>Floating</Title>
          <Desc>
            With floating, the card pins absolutely above the tab bar (plus safe-area inset). Pair with syncWithTabBar on real tab screens to hide on
            scroll.
          </Desc>
          <Preview>
            <View style={{ height: 160, width: '100%', position: 'relative' }}>
              <Label>Card floats at the bottom of this preview area</Label>
              <PreviewCardDemo floating />
            </View>
          </Preview>
          <CodeBlock
            code={`<EtPreviewContainer
  floating
  syncWithTabBar
  onPress={open}
  accessibilityLabel="My portfolio value"
>
  <EtPreviewContainer.Content>...</EtPreviewContainer.Content>
  <EtPreviewContainer.Trailing>...</EtPreviewContainer.Trailing>
</EtPreviewContainer>`}
          />
        </Section>
      </Page>
    );
  },
};

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtPreviewContainer</SubTitle>
        <Desc>Root glass shell. Domain content is composed via compound children.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: 'required' },
            { prop: 'onPress', type: '() => void', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
            { prop: 'floating', type: 'boolean', default: 'false' },
            { prop: 'syncWithTabBar', type: 'boolean', default: 'false' },
            { prop: 'showHandle', type: 'boolean', default: 'true' },
            { prop: 'haptics', type: 'boolean', default: 'true' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPreviewContainer.Content</SubTitle>
        <Desc>Left-side text stack (flexShrink).</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: 'required' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPreviewContainer.Trailing</SubTitle>
        <Desc>Right-side trailing visual (sparkline, icon, etc.).</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: 'required' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Exported constants</SubTitle>
        <Col gap={8}>
          <Label>PREVIEW_HEIGHT — approx card height (96)</Label>
          <Label>PREVIEW_CONTAINER_BOTTOM_OFFSET — TAB_BAR_HEIGHT + gap above nav</Label>
        </Col>
      </Section>
    </Page>
  ),
};
