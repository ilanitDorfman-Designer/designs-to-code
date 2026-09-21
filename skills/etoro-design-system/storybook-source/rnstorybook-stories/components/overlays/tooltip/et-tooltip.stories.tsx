import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EtButton, EtText, EtTooltip } from 'etoro-ui';
import type { EtTooltipRef } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core/hooks';
import { useRef } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtTooltip>;

const meta: Meta<typeof EtTooltip> = {
  title: 'eToro-UI/Components/Overlays/EtTooltip',
  component: EtTooltip,
  decorators: [
    (Story) => (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Story />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    ),
  ],
};

export default meta;

// ─────────────────────────────────────────────────────────────
// Example components (need hooks for ref management)
// ─────────────────────────────────────────────────────────────

function BasicExample() {
  const ref = useRef<EtTooltipRef>(null);
  return (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <EtButton onPress={() => ref.current?.present()}>Show Tooltip</EtButton>
      <EtTooltip ref={ref} title="Recently Traded">
        Recently traded shows the latest instruments traded by this user. This data is updated periodically and may not reflect real-time activity.
      </EtTooltip>
    </View>
  );
}

function CompoundExample() {
  const ref = useRef<EtTooltipRef>(null);
  return (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <EtButton variant="info-filled" onPress={() => ref.current?.present()}>
        Show Compound Tooltip
      </EtButton>
      <EtTooltip ref={ref}>
        <EtTooltip.Title>Market Hours</EtTooltip.Title>
        <EtTooltip.Body>
          Trading hours vary by instrument. Stocks follow their respective exchange hours, while crypto markets operate 24/7.
        </EtTooltip.Body>
      </EtTooltip>
    </View>
  );
}

function CustomBodyExample() {
  const ref = useRef<EtTooltipRef>(null);
  const { colors } = useEtoroTheme();
  return (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <EtButton variant="info-subtle" onPress={() => ref.current?.present()}>
        Show Rich Tooltip
      </EtButton>
      <EtTooltip ref={ref} title="Risk Score">
        <EtTooltip.Body>
          <View style={{ gap: 12 }}>
            <EtText variant="body-base-regular" style={{ color: colors.textSecondaryNeutral }}>
              The risk score indicates the volatility level of this instrument on a scale of 1-10.
            </EtText>
            <View
              style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: colors.bgNeutralSecondary,
              }}
            >
              <EtText variant="body-secondary-semibold" style={{ color: colors.textPrimaryNeutral }}>
                1-3: Low risk | 4-6: Medium risk | 7-10: High risk
              </EtText>
            </View>
          </View>
        </EtTooltip.Body>
      </EtTooltip>
    </View>
  );
}

function WithCloseCallbackExample() {
  const ref = useRef<EtTooltipRef>(null);
  return (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <EtButton variant="primary-subtle" onPress={() => ref.current?.present()}>
        Show With Callback
      </EtButton>
      <EtTooltip ref={ref} title="Notification Settings" onClose={() => console.log('Tooltip dismissed')}>
        Configure which notifications you receive. Changes take effect immediately.
      </EtTooltip>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>
          An informational tooltip displayed as a bottom sheet with a title, close button, and body text. Press the button to see it in action.
        </Desc>
        <Preview>
          <BasicExample />
        </Preview>
        <CodeBlock
          code={`import { EtTooltip } from 'etoro-ui';
import type { EtTooltipRef } from 'etoro-ui';
import { useRef } from 'react';

const tooltipRef = useRef<EtTooltipRef>(null);

// Present with: tooltipRef.current?.present()

<EtTooltip ref={tooltipRef} title="Recently Traded">
  Recently traded shows the latest instruments traded by this user.
</EtTooltip>`}
        />
      </Section>
    </Page>
  ),
};

export const CompoundChildren: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Compound Children</Title>
        <Desc>Use EtTooltip.Title and EtTooltip.Body subcomponents for more control over the content structure.</Desc>
        <Preview>
          <CompoundExample />
        </Preview>
        <CodeBlock
          code={`import { EtTooltip } from 'etoro-ui';

<EtTooltip ref={tooltipRef}>
  <EtTooltip.Title>Market Hours</EtTooltip.Title>
  <EtTooltip.Body>
    Trading hours vary by instrument. Stocks follow their
    respective exchange hours, while crypto markets operate 24/7.
  </EtTooltip.Body>
</EtTooltip>`}
        />
      </Section>
    </Page>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Custom Body Content</Title>
        <Desc>EtTooltip.Body accepts ReactNode children for rich content beyond plain text, such as styled sections or additional components.</Desc>
        <Preview>
          <CustomBodyExample />
        </Preview>
        <CodeBlock
          code={`import { EtTooltip, EtText } from 'etoro-ui';

<EtTooltip ref={tooltipRef} title="Risk Score">
  <EtTooltip.Body>
    <View style={{ gap: 12 }}>
      <EtText variant="body-base-regular">
        The risk score indicates the volatility level...
      </EtText>
      <View style={styles.infoBox}>
        <EtText variant="body-secondary-semibold">
          1-3: Low risk | 4-6: Medium risk | 7-10: High risk
        </EtText>
      </View>
    </View>
  </EtTooltip.Body>
</EtTooltip>`}
        />
      </Section>
    </Page>
  ),
};

export const UsageExamples: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Usage Examples</Title>
        <Desc>Common tooltip patterns in eToro applications.</Desc>
      </Section>

      <Section>
        <SubTitle>Info Icon Tooltip</SubTitle>
        <Desc>The most common pattern: an info icon that opens a tooltip explaining a section or metric.</Desc>
        <CodeBlock
          code={`import { EtTooltip, EtIconV2 } from 'etoro-ui';
import type { EtTooltipRef } from 'etoro-ui';
import { useRef, useCallback } from 'react';

function StatsSection() {
  const tooltipRef = useRef<EtTooltipRef>(null);

  const handleInfoPress = useCallback(() => {
    tooltipRef.current?.present();
  }, []);

  return (
    <>
      <View style={styles.header}>
        <EtText variant="heading-base">Statistics</EtText>
        <EtIconV2
          name="info-circle"
          size="sm"
          onPress={handleInfoPress}
        />
      </View>

      <EtTooltip ref={tooltipRef} title="Statistics">
        Statistics are calculated based on the user's trading
        activity over the selected time period.
      </EtTooltip>
    </>
  );
}`}
        />
      </Section>

      <Section>
        <SubTitle>With Close Callback</SubTitle>
        <Desc>Handle custom logic when the tooltip is dismissed.</Desc>
        <Preview>
          <WithCloseCallbackExample />
        </Preview>
        <CodeBlock
          code={`import { EtTooltip } from 'etoro-ui';

<EtTooltip
  ref={tooltipRef}
  title="Settings"
  onClose={() => {
    // Custom close logic
    analytics.track('tooltip_dismissed');
  }}
>
  Configure your preferences here.
</EtTooltip>`}
        />
      </Section>
    </Page>
  ),
};

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtTooltip</SubTitle>
        <Desc>Root component that wraps EtBottomSheetV2 with a standardized tooltip layout.</Desc>
        <PropsTable
          data={[
            {
              prop: 'ref',
              type: 'Ref<EtTooltipRef>',
              default: '-',
              description: 'Imperative handle with present() / dismiss()',
            },
            {
              prop: 'title',
              type: 'string',
              default: '-',
              description: 'Header title (shorthand for EtTooltip.Title)',
            },
            {
              prop: 'children',
              type: 'EtTooltipChildren',
              default: '-',
              description: 'Body text or compound children',
            },
            {
              prop: 'onClose',
              type: '() => void',
              default: '-',
              description: 'Called when tooltip is dismissed (button, gesture, backdrop)',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '"et-tooltip"',
            },
            {
              prop: 'accessibilityLabel',
              type: 'string',
              default: 'resolved title',
              description: 'Falls back to the resolved title text',
            },
            {
              prop: 'closeButtonAccessibilityLabel',
              type: 'string',
              default: '"Close"',
              description: 'Accessibility label for the close button',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTooltip.Title</SubTitle>
        <Desc>Declarative title slot. Content is extracted by the parent and rendered in the bottom sheet header.</Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'string',
              default: '-',
              description: 'Title text',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTooltip.Body</SubTitle>
        <Desc>Body content subcomponent. String children are auto-wrapped in styled EtText. ReactNode children render as-is for custom layouts.</Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Body content (string or custom)',
            },
            { prop: 'style', type: 'ViewStyle', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};
