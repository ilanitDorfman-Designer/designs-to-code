import type { Meta, StoryObj } from '@storybook/react-native';
import { EtButton, EtKeyboard, EtText } from 'etoro-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtKeyboard>;

const meta: Meta<typeof EtKeyboard> = {
  title: 'eToro-UI/Components/Input/EtKeyboard',
  component: EtKeyboard,
};

export default meta;

// =============================================================================
// 1. BASIC — Keys only
// =============================================================================

export const Basic: Story = {
  name: '1. Basic',
  render: function BasicStory() {
    const [value, setValue] = useState('');

    const handleKeyPress = (key: string) => {
      setValue((prev) => {
        if (key === '.' && prev.includes('.')) return prev;
        return prev + key;
      });
    };

    return (
      <Page>
        <Section>
          <Title>Basic</Title>
          <Desc>Numeric keypad with digits 0–9, decimal dot, and backspace (C). Parent controls value state.</Desc>
          <Preview>
            <Col gap={8}>
              <Label>Value: {value || '(empty)'}</Label>
              <EtKeyboard.Keys onKeyPress={handleKeyPress} onClear={() => setValue((p) => p.slice(0, -1))} testID="basic-keyboard" />
            </Col>
          </Preview>
          <CodeBlock
            code={`import { EtKeyboard } from 'etoro-ui';

const [value, setValue] = useState('');

<EtKeyboard.Keys
  onKeyPress={(key) => setValue((p) => p + key)}
  onClear={() => setValue((p) => p.slice(0, -1))}
/>`}
          />
        </Section>
      </Page>
    );
  },
};

// =============================================================================
// 2. WITH HEADER — Input display above keys
// =============================================================================

export const WithHeader: Story = {
  name: '2. With Header',
  render: function WithHeaderStory() {
    const [value, setValue] = useState('');
    const { c } = useTheme();

    const handleKeyPress = (key: string) => {
      setValue((prev) => {
        if (key === '.' && prev.includes('.')) return prev;
        return prev + key;
      });
    };

    return (
      <Page>
        <Section>
          <Title>With Header</Title>
          <Desc>Use EtKeyboard.Header to place any content above the keys with automatic spacing.</Desc>
          <Preview>
            <EtKeyboard>
              <EtKeyboard.Header>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 16,
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: c.border,
                  }}
                >
                  <EtText variant="num-xl">{value || '0'}</EtText>
                </View>
              </EtKeyboard.Header>
              <EtKeyboard.Keys onKeyPress={handleKeyPress} onClear={() => setValue((p) => p.slice(0, -1))} />
            </EtKeyboard>
          </Preview>
          <CodeBlock
            code={`import { EtKeyboard, EtText } from 'etoro-ui';

<EtKeyboard>
  <EtKeyboard.Header>
    <View style={styles.display}>
      <EtText variant="num-xl">{value || '0'}</EtText>
    </View>
  </EtKeyboard.Header>
  <EtKeyboard.Keys
    onKeyPress={handleKeyPress}
    onClear={handleClear}
  />
</EtKeyboard>`}
          />
        </Section>
      </Page>
    );
  },
};

// =============================================================================
// 3. WITH ACTIONS — CTA below keys
// =============================================================================

export const WithActions: Story = {
  name: '3. With Actions',
  render: function WithActionsStory() {
    const [value, setValue] = useState('');
    const [confirmed, setConfirmed] = useState('');
    const { c } = useTheme();

    const handleKeyPress = (key: string) => {
      setValue((prev) => {
        if (key === '.' && prev.includes('.')) return prev;
        return prev + key;
      });
    };

    const handleConfirm = () => {
      setConfirmed(value);
      setValue('');
    };

    return (
      <Page>
        <Section>
          <Title>With Actions</Title>
          <Desc>Use EtKeyboard.Actions to place any content below the keys — typically a CTA button.</Desc>
          <Preview>
            <EtKeyboard>
              <EtKeyboard.Header>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 16,
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: c.border,
                  }}
                >
                  <EtText variant="num-xl">{value || '0'}</EtText>
                </View>
              </EtKeyboard.Header>
              <EtKeyboard.Keys onKeyPress={handleKeyPress} onClear={() => setValue((p) => p.slice(0, -1))} />
              <EtKeyboard.Actions>
                <EtButton onPress={handleConfirm} style={{ width: '100%' }}>
                  Confirm {value ? `$${value}` : ''}
                </EtButton>
              </EtKeyboard.Actions>
            </EtKeyboard>
          </Preview>
          {confirmed ? <Label>Last confirmed: {confirmed}</Label> : null}
          <CodeBlock
            code={`import { EtKeyboard, EtButton } from 'etoro-ui';

<EtKeyboard>
  <EtKeyboard.Header>...</EtKeyboard.Header>
  <EtKeyboard.Keys
    onKeyPress={handleKeyPress}
    onClear={handleClear}
  />
  <EtKeyboard.Actions>
    <EtButton onPress={handleConfirm} style={{ width: '100%' }}>
      Confirm
    </EtButton>
  </EtKeyboard.Actions>
</EtKeyboard>`}
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
  render: () => (
    <Page>
      <Section>
        <Title>Disabled</Title>
        <Desc>Pass disabled to EtKeyboard.Keys to block all interaction.</Desc>

        <SubTitle>Enabled (default)</SubTitle>
        <Preview>
          <EtKeyboard.Keys onKeyPress={() => undefined} onClear={() => undefined} />
        </Preview>

        <SubTitle>Disabled</SubTitle>
        <Preview>
          <EtKeyboard.Keys disabled onKeyPress={() => undefined} onClear={() => undefined} />
        </Preview>
        <CodeBlock
          code={`<EtKeyboard.Keys
  disabled
  onKeyPress={handleKeyPress}
  onClear={handleClear}
/>`}
        />
      </Section>
    </Page>
  ),
};

// =============================================================================
// 5. COMPOUND — Full real-world composition
// =============================================================================

export const Compound: Story = {
  name: '5. Full Composition',
  render: function CompoundStory() {
    const [value, setValue] = useState('');
    const { c } = useTheme();

    const handleKeyPress = (key: string) => {
      setValue((prev) => {
        if (key === '.' && prev.includes('.')) return prev;
        if (prev === '0' && key !== '.') return key;
        return prev + key;
      });
    };

    const handleClear = () => setValue((p) => p.slice(0, -1));

    return (
      <Page>
        <Section>
          <Title>Full Composition</Title>
          <Desc>Header + Keys + Actions wired together — production-ready trade amount entry flow.</Desc>
          <Preview>
            <EtKeyboard style={{ paddingHorizontal: 8 }}>
              <EtKeyboard.Header>
                <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                  <EtText variant="caption-regular" style={{ color: c.textMuted }}>
                    Amount
                  </EtText>
                  <EtText variant="num-xl">${value || '0'}</EtText>
                </View>
              </EtKeyboard.Header>
              <EtKeyboard.Keys onKeyPress={handleKeyPress} onClear={handleClear} />
              <EtKeyboard.Actions>
                <EtButton onPress={() => setValue('')} disabled={!value} style={{ width: '100%' }}>
                  {value ? `Buy $${value}` : 'Enter an amount'}
                </EtButton>
              </EtKeyboard.Actions>
            </EtKeyboard>
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
      </Section>

      <Section>
        <SubTitle>EtKeyboard</SubTitle>
        <Desc>Root wrapper. Accepts any children and provides vertical layout.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtKeyboard.Header</SubTitle>
        <Desc>Slot rendered above the keys. Applies bottom spacing automatically. Accepts any React content.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtKeyboard.Keys</SubTitle>
        <Desc>4-row numeric keypad: 1–9, dot, 0, and the C (clear/backspace) badge.</Desc>
        <PropsTable
          data={[
            {
              prop: 'onKeyPress',
              type: '(key: KeyboardKeyValue) => void',
              default: '-',
            },
            { prop: 'onClear', type: '() => void', default: '-' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'haptics', type: 'boolean', default: 'true' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            {
              prop: 'accessibilityLabel',
              type: 'string',
              default: '"Numeric keyboard"',
            },
            { prop: 'deleteLabel', type: 'string', default: '"Delete"' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtKeyboard.Actions</SubTitle>
        <Desc>Slot rendered below the keys. Applies top spacing automatically. Accepts any React content — typically an EtButton CTA.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>KeyboardKeyValue</SubTitle>
        <Desc>Union type for values emitted by onKeyPress.</Desc>
        <CodeBlock
          title="ts"
          code={`type KeyboardKeyValue =
  | '1' | '2' | '3'
  | '4' | '5' | '6'
  | '7' | '8' | '9'
  | '0' | '.';`}
        />
      </Section>
    </Page>
  ),
};
