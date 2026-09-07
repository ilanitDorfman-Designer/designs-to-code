import type { Meta, StoryObj } from '@storybook/react-native';
import { EtDivider } from 'etoro-ui';
import { View } from 'react-native';

import { CodeBlock, Desc, Label, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtDivider>;

const meta: Meta<typeof EtDivider> = {
  title: 'eToro-UI/Components/Layout/EtDivider',
  component: EtDivider,
};

export default meta;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>EtDivider</Title>
        <Desc>
          Horizontal separator. With a `label` it renders the "── Or ──" pattern between actions; without one it renders a single full-width line.
          Translation-free — pass a pre-translated string.
        </Desc>
        <Preview>
          <View style={{ width: 280, gap: 24 }}>
            <EtDivider label="Or" />
            <EtDivider />
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtDivider } from 'etoro-ui';

// Labelled separator between two CTAs
<EtDivider label="Or" />

// Plain full-width line
<EtDivider />`}
        />
      </Section>

      <Section>
        <SubTitle>Custom color</SubTitle>
        <Desc>Override the line color with the `color` prop. Defaults to `colors.dividerTertiary`.</Desc>
        <Preview>
          <View style={{ width: 280 }}>
            <EtDivider label="Or" color="#00C200" />
            <Label>color="#00C200"</Label>
          </View>
        </Preview>
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
        <SubTitle>EtDivider</SubTitle>
        <Desc>Horizontal separator with an optional centered label.</Desc>
        <PropsTable
          data={[
            { prop: 'label', type: 'string', default: '-' },
            { prop: 'labelVariant', type: 'TextVariant', default: "'body-secondary-regular'" },
            { prop: 'color', type: 'string', default: 'colors.dividerTertiary' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: 'label | hidden' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};
