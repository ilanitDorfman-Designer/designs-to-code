import type { Meta, StoryObj } from '@storybook/react-native';
import { EtButton, EtNumericKeypad, EtText } from 'etoro-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtNumericKeypad>;

const meta: Meta<typeof EtNumericKeypad> = {
  title: 'eToro-UI/Components/Input/EtNumericKeypad',
  component: EtNumericKeypad,
};

export default meta;

// =============================================================================
// 1. BASIC
// =============================================================================

export const Basic: Story = {
  name: '1. Basic',
  render: function BasicStory() {
    const [value, setValue] = useState('');

    return (
      <Page>
        <Section>
          <Title>Basic</Title>
          <Desc>
            The premium numeric keypad with built-in value management — growing-circle press feedback, inverted C pressed state, and a staggered
            spring entrance. Pass `value` + `onValueChange` (controlled) or `defaultValue` (uncontrolled).
          </Desc>
          <Preview>
            <Col gap={8}>
              <Label>Value: {value || '(empty)'}</Label>
              <EtNumericKeypad value={value} onValueChange={setValue} enableLongPressClear testID="basic-numeric-keypad" />
            </Col>
          </Preview>
          <CodeBlock
            code={`import { EtNumericKeypad } from 'etoro-ui';

const [value, setValue] = useState('');

<EtNumericKeypad value={value} onValueChange={setValue} enableLongPressClear />`}
          />
        </Section>
      </Page>
    );
  },
};

// =============================================================================
// 2. VALIDATION (min / max / decimals)
// =============================================================================

export const Validation: Story = {
  name: '2. Validation',
  render: function ValidationStory() {
    const [amount, setAmount] = useState('');
    const [quantity, setQuantity] = useState('');

    return (
      <Page>
        <Section>
          <Title>Validation</Title>
          <Desc>
            The keypad owns min/max clamping and decimal-precision rules. Presses that would exceed `max` or `maxDecimalPlaces` are rejected; a clear
            that drops below `min` clamps to `String(min)`.
          </Desc>

          <SubTitle>Currency — 2 decimals, capped at 999,999</SubTitle>
          <Preview>
            <Col gap={8}>
              <Label>Value: {amount || '(empty)'}</Label>
              <EtNumericKeypad value={amount} onValueChange={setAmount} allowDecimal maxDecimalPlaces={2} min={0} max={999999} enableLongPressClear />
            </Col>
          </Preview>

          <SubTitle>Integer only (dot disabled)</SubTitle>
          <Preview>
            <Col gap={8}>
              <Label>Value: {quantity || '(empty)'}</Label>
              <EtNumericKeypad value={quantity} onValueChange={setQuantity} allowDecimal={false} />
            </Col>
          </Preview>
          <CodeBlock
            code={`<EtNumericKeypad
  value={amount}
  onValueChange={setAmount}
  allowDecimal
  maxDecimalPlaces={2}
  min={0}
  max={999999}
  enableLongPressClear
/>`}
          />
        </Section>
      </Page>
    );
  },
};

// =============================================================================
// 3. PREMIUM TOP BAND
// =============================================================================

export const PremiumTopBand: Story = {
  name: '3. Premium Top Band',
  render: function PremiumTopBandStory() {
    const [value, setValue] = useState('');
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) {
      return (
        <Page>
          <Section>
            <Title>Premium Top Band</Title>
            <Desc>Swipe down on the grabber band to dismiss the keyboard.</Desc>
            <Preview>
              <Col gap={12}>
                <Label>Keyboard dismissed — swipe-to-dismiss fired.</Label>
                <EtButton onPress={() => setDismissed(false)}>Show keyboard again</EtButton>
              </Col>
            </Preview>
          </Section>
        </Page>
      );
    }

    return (
      <Page>
        <Section>
          <Title>Premium Top Band</Title>
          <Desc>
            Execution-style keypad with the Figma &quot;Keyboard Top&quot; band: hairline divider, centered grabber pill, and optional swipe-down to
            dismiss. Pair with `fillHeight` inside a bounded parent.
          </Desc>
          <Preview>
            <View style={{ height: 360 }}>
              <EtNumericKeypad
                fillHeight
                topBand
                onTopBandSwipeDown={() => setDismissed(true)}
                value={value}
                onValueChange={setValue}
                enableLongPressClear
                testID="premium-top-band-keypad"
              />
            </View>
          </Preview>
          <Label>Value: {value || '(empty)'}</Label>
          <CodeBlock
            code={`<EtNumericKeypad
  fillHeight
  topBand
  onTopBandSwipeDown={handleDismiss}
  value={value}
  onValueChange={setValue}
/>`}
          />
        </Section>
      </Page>
    );
  },
};

// =============================================================================
// 4. DISABLED
// =============================================================================

export const Disabled: Story = {
  name: '4. Disabled',
  render: function DisabledStory() {
    return (
      <Page>
        <Section>
          <Title>Disabled</Title>
          <Desc>Block all interaction with `disabled` — e.g. while an execution request is in flight.</Desc>
          <Preview>
            <EtNumericKeypad disabled defaultValue="123" onValueChange={() => undefined} />
          </Preview>
          <CodeBlock code={`<EtNumericKeypad disabled defaultValue="123" onValueChange={setAmount} />`} />
        </Section>
      </Page>
    );
  },
};

// =============================================================================
// 5. PREMIUM IN CONTEXT
// =============================================================================

export const InContext: Story = {
  name: '5. Premium in Context',
  render: function InContextStory() {
    const [value, setValue] = useState('');
    const { c } = useTheme();

    return (
      <Page>
        <Section>
          <Title>Premium in Context</Title>
          <Desc>A trade-execution-style amount entry: large amount display above, premium keypad below, CTA at the bottom.</Desc>
          <Desc>
            With fillHeight, the keypad stretches to fill the available height — here a fixed-height frame. The entrance ripples from the center keys
            outward.
          </Desc>
          <Preview>
            <View style={{ height: 460 }}>
              <Col gap={24} style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                  <EtText variant="caption-regular" style={{ color: c.textMuted }}>
                    Amount
                  </EtText>
                  <EtText variant="num-xxl">${value || '0'}</EtText>
                </View>
                <EtNumericKeypad fillHeight value={value} onValueChange={setValue} enableLongPressClear />
                <EtButton onPress={() => setValue('')} disabled={!value} style={{ width: '100%' }}>
                  {value ? `Buy $${value}` : 'Enter an amount'}
                </EtButton>
              </Col>
            </View>
          </Preview>
        </Section>
      </Page>
    );
  },
};

// =============================================================================
// 6. API REFERENCE
// =============================================================================

export const APIReference: Story = {
  name: '6. API Reference',
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
        <Desc>Smart, premium numeric keypad. Owns value state, min/max clamping, decimal-precision, and disabled-key logic.</Desc>
      </Section>

      <Section>
        <SubTitle>EtNumericKeypad</SubTitle>
        <PropsTable
          data={[
            { prop: 'value', type: 'string', default: '- (controlled)' },
            { prop: 'defaultValue', type: 'string', default: '- (uncontrolled)' },
            { prop: 'onValueChange', type: '(value: string) => void', default: '-' },
            { prop: 'onInputRejected', type: '(reason: EtNumericKeypadRejectionReason) => void', default: '-' },
            { prop: 'min', type: 'number', default: '-' },
            { prop: 'max', type: 'number', default: '-' },
            { prop: 'allowDecimal', type: 'boolean', default: 'true' },
            { prop: 'maxDecimalPlaces', type: 'number', default: '-' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'enableLongPressClear', type: 'boolean', default: 'false' },
            { prop: 'fillHeight', type: 'boolean', default: 'false' },
            { prop: 'animateEntrance', type: 'boolean', default: 'true' },
            { prop: 'topBand', type: 'boolean', default: 'false' },
            { prop: 'onTopBandSwipeDown', type: '() => void', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
            { prop: 'deleteLabel', type: 'string', default: '-' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtNumericKeypadRejectionReason</SubTitle>
        <Desc>Union type reported via onInputRejected when a press does not change the value.</Desc>
        <CodeBlock
          title="ts"
          code={`type EtNumericKeypadRejectionReason =
  | 'leading-zero'
  | 'decimal-exists'
  | 'decimal-disabled'
  | 'max-decimals'
  | 'max'
  | 'delete-at-zero';`}
        />
      </Section>
    </Page>
  ),
};
