import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAlertBanner } from 'etoro-ui';
import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtAlertBanner>;

const meta: Meta<typeof EtAlertBanner> = {
  title: 'eToro-UI/Components/Feedback/EtAlertBanner',
  component: EtAlertBanner,
  parameters: {
    notes: 'Inline severity alert banner with icon, title, description, optional CTA and whole-banner press.',
  },
};

export default meta;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>Icon, title, and description — the simplest AlertBanner variant.</Desc>
        <Preview>
          <EtAlertBanner
            severity="warning"
            icon="info-circle"
            title="Account Liquidated"
            description="You can't perform any trading activity until you deposit."
          />
        </Preview>
        <CodeBlock
          code={`import { EtAlertBanner } from 'etoro-ui';

<EtAlertBanner
  severity="warning"
  icon="info-circle"
  title="Account Liquidated"
  description="You can't perform any trading activity until you deposit."
/>`}
        />
      </Section>
    </Page>
  ),
};

export const WithCta: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>With CTA</Title>
        <Desc>A trailing text CTA fires its own `onCtaPress` handler, independent of the banner's own `onPress`.</Desc>
        <Preview>
          <EtAlertBanner
            severity="warning"
            icon="info-circle"
            title="Account Liquidated"
            description="You can't perform any trading activity until you deposit."
            ctaLabel="Learn More"
            onCtaPress={() => undefined}
          />
        </Preview>
        <CodeBlock
          code={`import { EtAlertBanner } from 'etoro-ui';

<EtAlertBanner
  severity="warning"
  icon="info-circle"
  title="Account Liquidated"
  description="You can't perform any trading activity until you deposit."
  ctaLabel="Learn More"
  onCtaPress={handleLearnMore}
/>`}
        />
      </Section>
    </Page>
  ),
};

export const Pressable: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Whole-banner press</Title>
        <Desc>When `onPress` is set (and no `ctaLabel`), the entire banner becomes a single pressable target.</Desc>
        <Preview>
          <EtAlertBanner
            severity="warning"
            icon="info-circle"
            title="Action needed"
            description="Tap this banner to review the details."
            onPress={() => undefined}
          />
        </Preview>
        <CodeBlock
          code={`import { EtAlertBanner } from 'etoro-ui';

<EtAlertBanner
  severity="warning"
  icon="info-circle"
  title="Action needed"
  description="Tap this banner to review the details."
  onPress={openDetails}
/>`}
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
        <SubTitle>EtAlertBanner</SubTitle>
        <Desc>Severity-based inline alert with icon, title, description, optional CTA and press handling.</Desc>
        <PropsTable
          data={[
            { prop: 'severity', type: '"warning"', default: '-' },
            { prop: 'icon', type: 'string', default: '-' },
            { prop: 'title', type: 'string', default: '-' },
            { prop: 'description', type: 'string', default: '-' },
            { prop: 'ctaLabel', type: 'string', default: '-' },
            { prop: 'onCtaPress', type: '() => void', default: '-' },
            { prop: 'onPress', type: '() => void', default: '-' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: 'title + description' },
          ]}
        />
      </Section>
    </Page>
  ),
};
