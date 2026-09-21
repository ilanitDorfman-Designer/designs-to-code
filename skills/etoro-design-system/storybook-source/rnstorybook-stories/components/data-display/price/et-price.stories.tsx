import type { Meta, StoryObj } from '@storybook/react-native';
import { EtPrice } from 'etoro-ui';
import { View } from 'react-native';
import { CodeBlock, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title } from '../../../utils/storybook-template';

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtPrice> = {
  title: 'eToro-UI/Components/DataDisplay/EtPrice',
  component: EtPrice,
};

export default meta;

type Story = StoryObj<typeof EtPrice>;

// ─────────────────────────────────────────────────────────────
// 1. Basic
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>EtPrice</Title>
        <Desc>
          A compound component for displaying an asset price alongside its absolute change and percentage. Container is right-aligned (alignItems:
          flex-end). Composed of two subcomponents: EtPrice.Value and EtPrice.Change.
        </Desc>
        <Preview>
          <EtPrice price={113.24} change={0.96} changePercentage={0.86}>
            <EtPrice.Value />
            <EtPrice.Change />
          </EtPrice>
        </Preview>
        <CodeBlock
          code={`import { EtPrice } from 'etoro-ui';

<EtPrice price={113.24} change={0.96} changePercentage={0.86}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>`}
        />
      </Section>

      <Section>
        <SubTitle>Positive change (green)</SubTitle>
        <Preview>
          <EtPrice price={687.79} change={2.41} changePercentage={0.35}>
            <EtPrice.Value />
            <EtPrice.Change />
          </EtPrice>
        </Preview>

        <SubTitle>Negative change (red)</SubTitle>
        <Preview>
          <EtPrice price={112.28} change={-1.06} changePercentage={-0.94}>
            <EtPrice.Value />
            <EtPrice.Change />
          </EtPrice>
        </Preview>
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 2. ChangeDirections
// ─────────────────────────────────────────────────────────────

export const ChangeDirections: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Change Directions</Title>
        <Desc>
          The sign of the change prop controls the color of EtPrice.Change. Positive and zero values render in green (statusPositive); negative values
          render in red (statusNegative). Zero is treated as positive.
        </Desc>
      </Section>

      <Section>
        <Row gap={32}>
          <View>
            <Label>Positive</Label>
            <EtPrice price={687.79} change={2.41} changePercentage={0.35}>
              <EtPrice.Value />
              <EtPrice.Change />
            </EtPrice>
          </View>
          <View>
            <Label>Zero</Label>
            <EtPrice price={113.24} change={0} changePercentage={0}>
              <EtPrice.Value />
              <EtPrice.Change />
            </EtPrice>
          </View>
          <View>
            <Label>Negative</Label>
            <EtPrice price={672.38} change={-1296.27} changePercentage={-1.92}>
              <EtPrice.Value />
              <EtPrice.Change />
            </EtPrice>
          </View>
        </Row>
      </Section>

      <Section>
        <CodeBlock
          code={`// Positive change — green
<EtPrice price={687.79} change={2.41} changePercentage={0.35}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>

// Zero — treated as positive (green)
<EtPrice price={113.24} change={0} changePercentage={0}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>

// Negative change — red
<EtPrice price={672.38} change={-1296.27} changePercentage={-1.92}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 3. AdaptiveDecimals
// ─────────────────────────────────────────────────────────────

export const AdaptiveDecimals: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Adaptive Decimal Precision</Title>
        <Desc>
          EtPrice.Value automatically adjusts decimal places based on the magnitude of the price. Values between 0 and 1 (exclusive) use up to 5
          decimal places; all other values use up to 2, with trailing zeros always stripped.
        </Desc>
      </Section>

      <Section>
        <SubTitle>Standard price (≥ 1)</SubTitle>
        <Desc>Up to 2 decimal places, trailing zeros stripped.</Desc>
        <Row gap={32}>
          <View>
            <Label>price=687.79</Label>
            <EtPrice price={687.79} change={2.41} changePercentage={0.35}>
              <EtPrice.Value />
              <EtPrice.Change />
            </EtPrice>
          </View>
          <View>
            <Label>price=42 (whole)</Label>
            <EtPrice price={42} change={0.5} changePercentage={1.2}>
              <EtPrice.Value />
              <EtPrice.Change />
            </EtPrice>
          </View>
          <View>
            <Label>price=1.6</Label>
            <EtPrice price={1.6} change={0.004} changePercentage={0.25}>
              <EtPrice.Value />
              <EtPrice.Change />
            </EtPrice>
          </View>
        </Row>
      </Section>

      <Section>
        <SubTitle>Sub-dollar price (0 &lt; price &lt; 1)</SubTitle>
        <Desc>Up to 5 decimal places to preserve precision for crypto assets.</Desc>
        <Row gap={32}>
          <View>
            <Label>price=0.00012</Label>
            <EtPrice price={0.00012} change={0.00001} changePercentage={9.09}>
              <EtPrice.Value />
              <EtPrice.Change />
            </EtPrice>
          </View>
          <View>
            <Label>price=0.96</Label>
            <EtPrice price={0.96} change={0.01} changePercentage={1.05}>
              <EtPrice.Value />
              <EtPrice.Change />
            </EtPrice>
          </View>
        </Row>
      </Section>

      <Section>
        <CodeBlock
          code={`import { EtPrice } from 'etoro-ui';

// Regular price — 2 decimals, trailing zeros stripped
<EtPrice price={687.79} change={2.41} changePercentage={0.35}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>

// Whole number — no decimals rendered
<EtPrice price={42} change={0.5} changePercentage={1.2}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>

// Sub-dollar — up to 5 decimal places
<EtPrice price={0.00012} change={0.00001} changePercentage={9.09}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 4. EdgeCases
// ─────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Edge Cases</Title>
        <Desc>
          Behavior when props are missing, non-finite, or at extreme values. Both subcomponents guard against undefined and non-finite inputs and
          render nothing instead of crashing.
        </Desc>
      </Section>

      <Section>
        <SubTitle>price=undefined</SubTitle>
        <Desc>Both EtPrice.Value and EtPrice.Change render nothing. The root container (alignItems: flex-end) still renders but is invisible.</Desc>
        <Preview>
          <EtPrice>
            <EtPrice.Value />
            <EtPrice.Change />
          </EtPrice>
        </Preview>
        <CodeBlock
          code={`// Neither subcomponent renders — price is undefined
<EtPrice>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>`}
        />
      </Section>

      <Section>
        <SubTitle>price=0</SubTitle>
        <Desc>Zero price falls into the 2-decimal bucket (same as prices &gt;= 1). With trailing zeros stripped, it renders as "0".</Desc>
        <Preview>
          <EtPrice price={0} change={0} changePercentage={0}>
            <EtPrice.Value />
            <EtPrice.Change />
          </EtPrice>
        </Preview>
        <CodeBlock
          code={`// price=0 uses 2 decimal places; trailing zeros stripped → renders "0"
<EtPrice price={0} change={0} changePercentage={0}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>`}
        />
      </Section>

      <Section>
        <SubTitle>change=undefined</SubTitle>
        <Desc>EtPrice.Value renders normally; EtPrice.Change renders nothing.</Desc>
        <Preview>
          <EtPrice price={113.24}>
            <EtPrice.Value />
            <EtPrice.Change />
          </EtPrice>
        </Preview>
        <CodeBlock
          code={`// Only Value renders; Change is absent
<EtPrice price={113.24}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>`}
        />
      </Section>

      <Section>
        <SubTitle>price=NaN</SubTitle>
        <Desc>EtPrice.Value renders nothing for non-finite values.</Desc>
        <Preview>
          <EtPrice price={NaN} change={1} changePercentage={1}>
            <EtPrice.Value />
            <EtPrice.Change />
          </EtPrice>
        </Preview>
        <CodeBlock
          code={`// Value renders nothing for NaN; Change also renders nothing (requires price)
<EtPrice price={NaN} change={1} changePercentage={1}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>`}
        />
      </Section>

      <Section>
        <SubTitle>Very large price</SubTitle>
        <Desc>No special treatment — formatted with up to 2 decimal places.</Desc>
        <Preview>
          <EtPrice price={999999.99} change={1234.56} changePercentage={0.12}>
            <EtPrice.Value />
            <EtPrice.Change />
          </EtPrice>
        </Preview>
        <CodeBlock
          code={`<EtPrice price={999999.99} change={1234.56} changePercentage={0.12}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>`}
        />
      </Section>

      <Section>
        <SubTitle>Very large negative change</SubTitle>
        <Desc>
          The change string can become long (as seen in the screenshot where the change text was truncated). Use numberOfLines or a fixed-width
          container in the parent when truncation is needed.
        </Desc>
        <Preview>
          <EtPrice price={672.38} change={-1296.27} changePercentage={-1.92}>
            <EtPrice.Value />
            <EtPrice.Change />
          </EtPrice>
        </Preview>
        <CodeBlock
          code={`<EtPrice price={672.38} change={-1296.27} changePercentage={-1.92}>
  <EtPrice.Value />
  <EtPrice.Change />
</EtPrice>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 5. APIReference (always last)
// ─────────────────────────────────────────────────────────────

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtPrice</SubTitle>
        <Desc>
          Root context provider. Renders a right-aligned (alignItems: flex-end) column View. Pass EtPrice.Value and/or EtPrice.Change as children.
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'price',
              type: 'number',
              default: '-',
              description: 'Main price value. Drives decimal precision for both Value and Change.',
            },
            {
              prop: 'change',
              type: 'number',
              default: '-',
              description: 'Absolute change amount. Sign determines color: positive/zero → green, negative → red.',
            },
            {
              prop: 'changePercentage',
              type: 'number',
              default: '-',
              description: 'Pre-multiplied percentage change (e.g. 0.86 means 0.86%). Displayed alongside change.',
            },
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'EtPrice.Value and/or EtPrice.Change subcomponents.',
            },
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Style override for the root container.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPrice.Value</SubTitle>
        <Desc>
          Renders the main price. Reads price from context. Uses num-ml typography and neutral (textPrimaryNeutral) color by default. Renders nothing
          when price is undefined or non-finite.
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'variant',
              type: 'TextVariant',
              default: '"num-ml"',
              description: 'Typography variant. Override to scale up (num-l) or down (num-sm, num-s).',
            },
            {
              prop: 'style',
              type: 'StyleProp<TextStyle>',
              default: '-',
              description: 'Style override for the value text.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPrice.Change</SubTitle>
        <Desc>
          Renders the absolute change and percentage as a combined string (e.g. 0.96 (+0.86%)). Color is sign-based: green when change ≥ 0, red when
          change &lt; 0. Renders nothing when price or change is undefined or non-finite.
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'variant',
              type: 'TextVariant',
              default: '"num-s"',
              description: 'Typography variant. Override to scale up (num-sm, num-ml) or down (num-xs).',
            },
            {
              prop: 'style',
              type: 'StyleProp<TextStyle>',
              default: '-',
              description: 'Style override for the change text.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Decimal Precision Rules</SubTitle>
        <PropsTable
          data={[
            {
              prop: '0 < price < 1',
              type: 'up to 5 decimals',
              default: '-',
              description: 'Sub-dollar prices (e.g. crypto). Trailing zeros stripped.',
            },
            {
              prop: 'price ≥ 1 or price = 0',
              type: 'up to 2 decimals',
              default: '-',
              description: 'Standard prices. Trailing zeros stripped.',
            },
          ]}
        />
      </Section>
    </Page>
  ),
};
