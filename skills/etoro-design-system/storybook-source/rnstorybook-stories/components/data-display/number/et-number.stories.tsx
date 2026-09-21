import type { Meta, StoryObj } from '@storybook/react-native';
import { EtNumber } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { View } from 'react-native';
import { CodeBlock, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title } from '../../../utils/storybook-template';

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtNumber> = {
  title: 'eToro-UI/Components/DataDisplay/EtNumber',
  component: EtNumber,
};

export default meta;

type Story = StoryObj<typeof EtNumber>;

// ─────────────────────────────────────────────────────────────
// 1. Basic
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>EtNumber</Title>
        <Desc>
          A compound component for displaying a formatted numeric value with an optional directional arrow. Children (EtNumber.Arrow, EtNumber.Value)
          are rendered in a row in the order they appear in JSX. Color defaults to neutral; set isColored for sign-based green/red, or pass a custom
          color prop to override both.
        </Desc>
        <Preview>
          <EtNumber value={0.2043} format="percentage">
            <EtNumber.Arrow />
            <EtNumber.Value />
          </EtNumber>
        </Preview>
        <CodeBlock
          code={`import { EtNumber } from 'etoro-ui';

<EtNumber value={0.2043} format="percentage">
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 2. Formats
// ─────────────────────────────────────────────────────────────

export const Formats: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Formats</Title>
        <Desc>
          Three format types are supported via the format prop: percentage, currency, and number. Each type routes through the appropriate formatter
          from @etoro/common/utils. Shown with isColored to make direction visible.
        </Desc>
      </Section>

      <Section>
        <SubTitle>Percentage</SubTitle>
        <Desc>format="percentage" — value is multiplied by 100 internally. Pass the raw decimal (e.g. 0.2043 to display 20.43%).</Desc>
        <Row gap={32}>
          <View>
            <Label>Positive</Label>
            <EtNumber value={0.2043} format="percentage" isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>Negative</Label>
            <EtNumber value={-0.1523} format="percentage" isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>Zero</Label>
            <EtNumber value={0} format="percentage" isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
        </Row>
        <CodeBlock
          code={`import { EtNumber } from 'etoro-ui';

<EtNumber value={0.2043} format="percentage" isColored>
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>`}
        />
      </Section>

      <Section>
        <SubTitle>Currency</SubTitle>
        <Desc>format="currency" — pass symbol to prepend a currency character. Uses locale-aware thousand separators.</Desc>
        <Row gap={32}>
          <View>
            <Label>Positive ($)</Label>
            <EtNumber value={1234.56} format="currency" symbol="$" isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>Negative ($)</Label>
            <EtNumber value={-2.95} format="currency" symbol="$" isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>Negative (€)</Label>
            <EtNumber value={-99.99} format="currency" symbol="€" isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
        </Row>
        <CodeBlock
          code={`import { EtNumber } from 'etoro-ui';

<EtNumber value={1234.56} format="currency" symbol="$" isColored>
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>`}
        />
      </Section>

      <Section>
        <SubTitle>Number</SubTitle>
        <Desc>
          format="number" — plain numeric display without a symbol. Useful for counts, prices, or any raw value. Arrow and Value still respond to
          sign.
        </Desc>
        <Row gap={32}>
          <View>
            <Label>Positive</Label>
            <EtNumber value={42} format="number" isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>Negative</Label>
            <EtNumber value={-1234.5} format="number" isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
        </Row>
        <CodeBlock
          code={`import { EtNumber } from 'etoro-ui';

<EtNumber value={42} format="number" isColored>
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 3. ColorModes
// ─────────────────────────────────────────────────────────────

export const ColorModes: Story = {
  render: function ColorModesStory() {
    const { colors } = useEtoroTheme();

    return (
      <Page>
        <Section>
          <Title>Color Modes</Title>
          <Desc>Three color resolution modes apply to both the arrow and value text. The same value (-2.95) is shown in each mode.</Desc>
        </Section>

        <Section>
          <SubTitle>Neutral (default)</SubTitle>
          <Desc>
            When isColored is false and no color prop is set, both arrow and value use textPrimaryNeutral — the regular text color regardless of sign.
          </Desc>
          <Preview>
            <View style={{ gap: 12 }}>
              <EtNumber value={0.2043} format="percentage">
                <EtNumber.Arrow />
                <EtNumber.Value />
              </EtNumber>
              <EtNumber value={-2.95} format="currency" symbol="$">
                <EtNumber.Arrow />
                <EtNumber.Value />
              </EtNumber>
            </View>
          </Preview>
          <CodeBlock
            code={`// Default — neutral color (no isColored, no color prop)
<EtNumber value={-2.95} format="currency" symbol="$">
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>`}
          />
        </Section>

        <Section>
          <SubTitle>Sign-based (isColored)</SubTitle>
          <Desc>
            isColored=true enables sign-based coloring: positive and zero → statusPositive (green), negative → statusNegative (red). Arrow and value
            always match.
          </Desc>
          <Preview>
            <View style={{ gap: 12 }}>
              <EtNumber value={0.2043} format="percentage" isColored>
                <EtNumber.Arrow />
                <EtNumber.Value />
              </EtNumber>
              <EtNumber value={-2.95} format="currency" symbol="$" isColored>
                <EtNumber.Arrow />
                <EtNumber.Value />
              </EtNumber>
            </View>
          </Preview>
          <CodeBlock
            code={`// isColored — green for positive, red for negative
<EtNumber value={0.2043} format="percentage" isColored>
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>

<EtNumber value={-2.95} format="currency" symbol="$" isColored>
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>`}
          />
        </Section>

        <Section>
          <SubTitle>Custom color</SubTitle>
          <Desc>
            The color prop overrides both arrow and value, ignoring sign and isColored. Useful for secondary text styling or brand-specific colors.
          </Desc>
          <Preview>
            <EtNumber value={-2.95} format="currency" symbol="$" color={colors.textSecondaryNeutral}>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </Preview>
          <CodeBlock
            code={`import { useEtoroTheme } from 'etoro-ui/core';

const { colors } = useEtoroTheme();

<EtNumber
  value={-2.95}
  format="currency"
  symbol="$"
  color={colors.textSecondaryNeutral}
>
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// 4. AdvancedFeatures
// ─────────────────────────────────────────────────────────────

export const AdvancedFeatures: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Advanced Features</Title>
        <Desc>Additional props for fine-grained control over formatting, display, layout, and typography scale.</Desc>
      </Section>

      <Section>
        <SubTitle>showAbsoluteValue</SubTitle>
        <Desc>
          When showAbsoluteValue=true, EtNumber.Value displays the magnitude (|value|) while arrow direction and color still follow the original sign.
          A negative value like -2.95 renders as $2.95 in red with a down arrow.
        </Desc>
        <Preview>
          <View style={{ gap: 12 }}>
            <EtNumber value={-2.95} format="currency" symbol="$" showAbsoluteValue isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
            <EtNumber value={-99.99} format="currency" symbol="€" showAbsoluteValue isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
        </Preview>
        <CodeBlock
          code={`import { EtNumber } from 'etoro-ui';

// Displays "$2.95" in red with down arrow (value is -2.95)
<EtNumber
  value={-2.95}
  format="currency"
  symbol="$"
  showAbsoluteValue
  isColored
>
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>`}
        />
      </Section>

      <Section>
        <SubTitle>showSign</SubTitle>
        <Desc>
          When showSign=true, EtNumber.Value prepends '+' for non-negative values (including zero). Negative values already carry their '-' from the
          formatter and are unchanged. Useful for displaying explicit direction on change values.
        </Desc>
        <Row gap={32}>
          <View>
            <Label>Positive</Label>
            <EtNumber value={0.2043} format="percentage" showSign isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>Negative</Label>
            <EtNumber value={-0.1523} format="percentage" showSign isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>Zero</Label>
            <EtNumber value={0} format="percentage" showSign isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
        </Row>
        <CodeBlock
          code={`import { EtNumber } from 'etoro-ui';

// Displays "+20.43%" in green
<EtNumber value={0.2043} format="percentage" showSign isColored>
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>

// Combined with hasParentheses — e.g. (+0.86%)
<EtNumber value={0.0086} format="percentage" showSign hasParentheses isColored>
  <EtNumber.Value />
</EtNumber>`}
        />
      </Section>

      <Section>
        <SubTitle>Decimal precision and locale</SubTitle>
        <Desc>
          minDecimals, maxDecimals, and locale are passed directly to the @etoro/common/utils formatters. Use them together to control decimal places
          and locale-specific formatting.
        </Desc>
        <Row gap={32}>
          <View>
            <Label>2 fixed decimals</Label>
            <EtNumber value={0.5} format="percentage" minDecimals={2} maxDecimals={2}>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>en-GB locale</Label>
            <EtNumber value={0.5} format="percentage" minDecimals={2} maxDecimals={2} locale="en-GB">
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>5 decimals</Label>
            <EtNumber value={1234.5} format="number" minDecimals={5} maxDecimals={5}>
              <EtNumber.Value />
            </EtNumber>
          </View>
        </Row>
        <CodeBlock
          code={`import { EtNumber } from 'etoro-ui';

<EtNumber
  value={0.5}
  format="percentage"
  minDecimals={2}
  maxDecimals={2}
  locale="en-GB"
>
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>`}
        />
      </Section>

      <Section>
        <SubTitle>hasParentheses</SubTitle>
        <Desc>
          When hasParentheses=true, the formatted value is wrapped in parentheses. Works with all format types and combines with other props such as
          isColored and showSign.
        </Desc>
        <Row gap={32}>
          <View>
            <Label>Percentage</Label>
            <EtNumber value={0.2043} format="percentage" hasParentheses>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>Negative + isColored</Label>
            <EtNumber value={-0.1523} format="percentage" hasParentheses isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>Currency + isColored</Label>
            <EtNumber value={-2.95} format="currency" symbol="$" hasParentheses isColored>
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
        </Row>
        <CodeBlock
          code={`import { EtNumber } from 'etoro-ui';

<EtNumber value={-0.1523} format="percentage" hasParentheses isColored>
  <EtNumber.Arrow />
  <EtNumber.Value />
</EtNumber>`}
        />
      </Section>

      <Section>
        <SubTitle>Child order</SubTitle>
        <Desc>
          The order of EtNumber.Arrow and EtNumber.Value in JSX determines their layout order in the row container. Value before Arrow is valid.
        </Desc>
        <Row gap={32}>
          <View>
            <Label>Arrow then Value</Label>
            <EtNumber value={-0.05} format="percentage">
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>Value then Arrow</Label>
            <EtNumber value={-0.05} format="percentage">
              <EtNumber.Value />
              <EtNumber.Arrow />
            </EtNumber>
          </View>
        </Row>
        <CodeBlock
          code={`import { EtNumber } from 'etoro-ui';

// Value before Arrow — order in JSX determines layout
<EtNumber value={-0.05} format="percentage">
  <EtNumber.Value />
  <EtNumber.Arrow />
</EtNumber>`}
        />
      </Section>

      <Section>
        <SubTitle>Value only (no arrow)</SubTitle>
        <Desc>Omit EtNumber.Arrow when a directional indicator is not needed.</Desc>
        <Preview>
          <EtNumber value={1234.56} format="currency" symbol="$">
            <EtNumber.Value />
          </EtNumber>
        </Preview>
        <CodeBlock
          code={`import { EtNumber } from 'etoro-ui';

<EtNumber value={1234.56} format="currency" symbol="$">
  <EtNumber.Value />
</EtNumber>`}
        />
      </Section>

      <Section>
        <SubTitle>Custom typography variant on EtNumber.Value</SubTitle>
        <Desc>
          EtNumber.Value accepts an optional variant prop to override the default label-primary-semibold typography. Use num-* variants when embedding
          inside composite components like EtPrice.
        </Desc>
        <Row gap={32}>
          <View>
            <Label>Default (label-primary-semibold)</Label>
            <EtNumber value={0.2043} format="percentage">
              <EtNumber.Arrow />
              <EtNumber.Value />
            </EtNumber>
          </View>
          <View>
            <Label>num-ml</Label>
            <EtNumber value={0.2043} format="percentage">
              <EtNumber.Arrow />
              <EtNumber.Value variant="num-ml" />
            </EtNumber>
          </View>
          <View>
            <Label>num-s</Label>
            <EtNumber value={0.2043} format="percentage">
              <EtNumber.Arrow />
              <EtNumber.Value variant="num-s" />
            </EtNumber>
          </View>
        </Row>
        <CodeBlock
          code={`import { EtNumber } from 'etoro-ui';

// Custom typography variant
<EtNumber value={0.2043} format="percentage">
  <EtNumber.Arrow />
  <EtNumber.Value variant="num-ml" />
</EtNumber>`}
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
        <SubTitle>EtNumber</SubTitle>
        <Desc>
          Root context provider. Renders a row container (flexDirection: row, alignItems: center). Pass EtNumber.Arrow and/or EtNumber.Value as
          children in any order.
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'value',
              type: 'number',
              default: '-',
              description: 'Required. Primary numeric value. Sign drives arrow direction and (when isColored) text/arrow color.',
            },
            {
              prop: 'format',
              type: '"currency" | "percentage" | "number"',
              default: '"number"',
              description: 'Which formatter to apply. percentage multiplies by 100; currency prepends symbol.',
            },
            {
              prop: 'symbol',
              type: 'string',
              default: '-',
              description: 'Currency symbol (e.g. "$", "€"). Only used when format="currency".',
            },
            {
              prop: 'currencyCode',
              type: 'string',
              default: '-',
              description: 'Optional ISO currency code (e.g. "USD"). Passed through context for display.',
            },
            {
              prop: 'minDecimals',
              type: 'number',
              default: '-',
              description: 'Minimum decimal places passed to the formatter.',
            },
            {
              prop: 'maxDecimals',
              type: 'number',
              default: '-',
              description: 'Maximum decimal places passed to the formatter.',
            },
            {
              prop: 'locale',
              type: 'string',
              default: '"en-US"',
              description: 'Locale for number formatting (e.g. "en-GB"). Affects decimal separator and grouping.',
            },
            {
              prop: 'showAbsoluteValue',
              type: 'boolean',
              default: 'false',
              description: 'When true, EtNumber.Value displays |value|. Arrow direction and color still follow original sign.',
            },
            {
              prop: 'showSign',
              type: 'boolean',
              default: 'false',
              description: "When true, prepends '+' for non-negative values. Negative values keep their '-' prefix unchanged.",
            },
            {
              prop: 'hasParentheses',
              type: 'boolean',
              default: 'false',
              description:
                'When true, wraps the formatted value in parentheses, e.g. (20.43%). Applied after all other formatting; does not affect color or arrow direction.',
            },
            {
              prop: 'isColored',
              type: 'boolean',
              default: 'false',
              description:
                'When true, arrow and value use sign-based colors: positive/zero → statusPositive (green), negative → statusNegative (red).',
            },
            {
              prop: 'color',
              type: 'string',
              default: '-',
              description: 'When set, both arrow and value use this color, overriding isColored and neutral.',
            },
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'EtNumber.Arrow and/or EtNumber.Value in any order.',
            },
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Style override for the root row container.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtNumber.Arrow</SubTitle>
        <Desc>
          Directional icon subcomponent. No props — reads value, isColored, and color from context. Renders nothing when value is NaN or non-finite.
        </Desc>
        <PropsTable
          data={[
            {
              prop: '(none)',
              type: '-',
              default: '-',
              description:
                'All configuration is inherited from the EtNumber context. Renders triangleUp when value >= 0, triangleDown when value < 0.',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtNumber.Value</SubTitle>
        <Desc>
          Formatted value text subcomponent. Reads all formatting and color options from context. Renders nothing when value is NaN or non-finite.
        </Desc>
        <PropsTable
          data={[
            {
              prop: 'variant',
              type: 'TextVariant',
              default: '"label-primary-semibold"',
              description:
                'Typography variant for the value text. Override with num-* variants when embedding inside composite components (e.g. EtPrice).',
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
        <SubTitle>Color Resolution Order</SubTitle>
        <PropsTable
          data={[
            {
              prop: '1. color prop',
              type: 'string',
              default: '-',
              description: 'Highest priority. When set, both arrow and value use this exact color.',
            },
            {
              prop: '2. isColored',
              type: 'boolean',
              default: '-',
              description: 'Sign-based: statusPositive (green) for value >= 0, statusNegative (red) for value < 0.',
            },
            {
              prop: '3. neutral',
              type: '-',
              default: '-',
              description: 'Default fallback. Uses textPrimaryNeutral from the theme.',
            },
          ]}
        />
      </Section>
    </Page>
  ),
};
