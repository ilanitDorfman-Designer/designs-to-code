import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';

import { EtSelectionTileGroup } from 'etoro-ui';

import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

const FULL_WIDTH = { width: '100%' as const };

type Story = StoryObj<typeof EtSelectionTileGroup>;

const meta: Meta<typeof EtSelectionTileGroup> = {
  title: 'eToro-UI/Components/Controls/EtSelectionTileGroup',
  component: EtSelectionTileGroup,
};

export default meta;

// ---------------------------------------------------------------------------
// 1. Basic
// ---------------------------------------------------------------------------

export const Basic: Story = {
  render: function BasicStory() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <Page>
        <Section>
          <Title>EtSelectionTileGroup</Title>
          <Desc>
            A controlled tile-based selection group with four visual variants. Renders a vertical list of large tappable tiles with configurable
            right-side elements.
          </Desc>
        </Section>

        <Section>
          <SubTitle>Features</SubTitle>
          <Col>
            <Desc>Compound component pattern with EtSelectionTileGroup.Option</Desc>
            <Desc>Four variants: icon (default), radio, toggle, toggleInput</Desc>
            <Desc>Single and multi select modes (multi for toggle/toggleInput)</Desc>
            <Desc>Customizable icon per option in icon variant</Desc>
            <Desc>Optional subtitle text on options</Desc>
            <Desc>Border highlight on selection (icon and radio variants)</Desc>
            <Desc>Haptic feedback on selection</Desc>
          </Col>
        </Section>

        <Section>
          <SubTitle>Basic Usage</SubTitle>
          <Preview>
            <View style={FULL_WIDTH}>
              <EtSelectionTileGroup value={selected} onChange={setSelected}>
                <EtSelectionTileGroup.Option value="female">Female</EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="male">Male</EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="other">I go by something else</EtSelectionTileGroup.Option>
              </EtSelectionTileGroup>
            </View>
          </Preview>
          <Label>Selected: {selected ?? 'none'}</Label>
          <CodeBlock
            code={`import { EtSelectionTileGroup } from 'etoro-ui';

const [selected, setSelected] = useState<string | null>(null);

<EtSelectionTileGroup value={selected} onChange={setSelected}>
  <EtSelectionTileGroup.Option value="female">Female</EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="male">Male</EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="other">I go by something else</EtSelectionTileGroup.Option>
</EtSelectionTileGroup>`}
          />
        </Section>
      </Page>
    );
  },
};

// ---------------------------------------------------------------------------
// 2. Icon Variant
// ---------------------------------------------------------------------------

export const IconVariant: Story = {
  render: function IconVariantStory() {
    const [defaultIcon, setDefaultIcon] = useState<string | null>(null);
    const [customIcon, setCustomIcon] = useState<string | null>(null);

    return (
      <Page>
        <Section>
          <Title>Icon Variant</Title>
          <Desc>
            The default variant. Shows an icon on the right side of each tile. The icon defaults to a chevron (angle-right) but can be customized per
            option via the iconName prop.
          </Desc>
        </Section>

        <Section>
          <SubTitle>Default Chevron</SubTitle>
          <Preview>
            <View style={FULL_WIDTH}>
              <EtSelectionTileGroup value={defaultIcon} onChange={setDefaultIcon}>
                <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="opt2">Option 2</EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="opt3">Option 3</EtSelectionTileGroup.Option>
              </EtSelectionTileGroup>
            </View>
          </Preview>
          <Label>Selected: {defaultIcon ?? 'none'}</Label>
          <CodeBlock
            code={`<EtSelectionTileGroup value={selected} onChange={setSelected}>
  <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="opt2">Option 2</EtSelectionTileGroup.Option>
</EtSelectionTileGroup>`}
          />
        </Section>

        <Section>
          <SubTitle>Custom Icon Per Option</SubTitle>
          <Preview>
            <View style={FULL_WIDTH}>
              <EtSelectionTileGroup variant="icon" value={customIcon} onChange={setCustomIcon}>
                <EtSelectionTileGroup.Option value="check" iconName="check">
                  Completed
                </EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="star" iconName="star">
                  Favorites
                </EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="bell" iconName="bell">
                  Notifications
                </EtSelectionTileGroup.Option>
              </EtSelectionTileGroup>
            </View>
          </Preview>
          <Label>Selected: {customIcon ?? 'none'}</Label>
          <CodeBlock
            code={`<EtSelectionTileGroup variant="icon" value={selected} onChange={setSelected}>
  <EtSelectionTileGroup.Option value="check" iconName="check">Completed</EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="star" iconName="star">Favorites</EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="bell" iconName="bell">Notifications</EtSelectionTileGroup.Option>
</EtSelectionTileGroup>`}
          />
        </Section>
      </Page>
    );
  },
};

// ---------------------------------------------------------------------------
// 3. Radio Variant
// ---------------------------------------------------------------------------

export const RadioVariant: Story = {
  render: function RadioVariantStory() {
    const [riskLevel, setRiskLevel] = useState<string | null>(null);
    const [simple, setSimple] = useState<string | null>(null);

    return (
      <Page>
        <Section>
          <Title>Radio Variant</Title>
          <Desc>
            Shows a radio circle indicator on the right side. Supports an optional subtitle for each option. Selection is indicated by both a border
            highlight and a filled green radio dot.
          </Desc>
        </Section>

        <Section>
          <SubTitle>With Subtitle</SubTitle>
          <Preview>
            <View style={FULL_WIDTH}>
              <EtSelectionTileGroup variant="radio" value={riskLevel} onChange={setRiskLevel}>
                <EtSelectionTileGroup.Option value="conservative" subtitle="Low tolerance for risk">
                  Very conservative
                </EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="limited" subtitle="Limited risk exposure">
                  Conservative
                </EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="moderate" subtitle="Balance risk & growth">
                  Moderate
                </EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="aggressive" subtitle="Maximum risk exposure">
                  Aggressive
                </EtSelectionTileGroup.Option>
              </EtSelectionTileGroup>
            </View>
          </Preview>
          <Label>Selected: {riskLevel ?? 'none'}</Label>
          <CodeBlock
            code={`<EtSelectionTileGroup variant="radio" value={selected} onChange={setSelected}>
  <EtSelectionTileGroup.Option value="conservative" subtitle="Low tolerance for risk">
    Very conservative
  </EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="moderate" subtitle="Balance risk & growth">
    Moderate
  </EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="aggressive" subtitle="Maximum risk exposure">
    Aggressive
  </EtSelectionTileGroup.Option>
</EtSelectionTileGroup>`}
          />
        </Section>

        <Section>
          <SubTitle>Without Subtitle</SubTitle>
          <Preview>
            <View style={FULL_WIDTH}>
              <EtSelectionTileGroup variant="radio" value={simple} onChange={setSimple}>
                <EtSelectionTileGroup.Option value="personal">Personal Account</EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="business">Business Account</EtSelectionTileGroup.Option>
              </EtSelectionTileGroup>
            </View>
          </Preview>
          <Label>Selected: {simple ?? 'none'}</Label>
          <CodeBlock
            code={`<EtSelectionTileGroup variant="radio" value={selected} onChange={setSelected}>
  <EtSelectionTileGroup.Option value="personal">Personal Account</EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="business">Business Account</EtSelectionTileGroup.Option>
</EtSelectionTileGroup>`}
          />
        </Section>
      </Page>
    );
  },
};

// ---------------------------------------------------------------------------
// 4. Toggle Variant — Single Select
// ---------------------------------------------------------------------------

export const ToggleSingle: Story = {
  render: function ToggleSingleStory() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <Page>
        <Section>
          <Title>Toggle Variant — Single Select</Title>
          <Desc>
            Shows a toggle switch on the right side. In single-select mode, only one option can be active at a time. There is no border highlight —
            the switch state itself indicates selection.
          </Desc>
        </Section>

        <Section>
          <SubTitle>Single Select</SubTitle>
          <Preview>
            <View style={FULL_WIDTH}>
              <EtSelectionTileGroup variant="toggle" value={selected} onChange={setSelected}>
                <EtSelectionTileGroup.Option value="push">Push notifications</EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="email">Email updates</EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="sms">SMS alerts</EtSelectionTileGroup.Option>
              </EtSelectionTileGroup>
            </View>
          </Preview>
          <Label>Selected: {selected ?? 'none'}</Label>
          <CodeBlock
            code={`<EtSelectionTileGroup variant="toggle" value={selected} onChange={setSelected}>
  <EtSelectionTileGroup.Option value="push">Push notifications</EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="email">Email updates</EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="sms">SMS alerts</EtSelectionTileGroup.Option>
</EtSelectionTileGroup>`}
          />
        </Section>
      </Page>
    );
  },
};

// ---------------------------------------------------------------------------
// 5. Toggle Variant — Multi Select
// ---------------------------------------------------------------------------

export const ToggleMulti: Story = {
  render: function ToggleMultiStory() {
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <Page>
        <Section>
          <Title>Toggle Variant — Multi Select</Title>
          <Desc>
            With selectionMode="multi", multiple options can be toggled on independently. The value prop accepts a string array and onChange returns
            the updated array.
          </Desc>
        </Section>

        <Section>
          <SubTitle>Multi Select</SubTitle>
          <Preview>
            <View style={FULL_WIDTH}>
              <EtSelectionTileGroup variant="toggle" selectionMode="multi" value={selected} onChange={setSelected}>
                <EtSelectionTileGroup.Option value="director">
                  A director or a 10% shareholder of a publicly traded corporation.
                </EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="brokerage">Employed by a brokerage firm or securities exchange.</EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option value="official">
                  A current or former high-level elected or appointed public official.
                </EtSelectionTileGroup.Option>
              </EtSelectionTileGroup>
            </View>
          </Preview>
          <Label>Selected: {selected.length > 0 ? selected.join(', ') : 'none'}</Label>
          <CodeBlock
            code={`const [selected, setSelected] = useState<string[]>([]);

<EtSelectionTileGroup variant="toggle" selectionMode="multi" value={selected} onChange={setSelected}>
  <EtSelectionTileGroup.Option value="director">
    A director or a 10% shareholder of a publicly traded corporation.
  </EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="brokerage">
    Employed by a brokerage firm or securities exchange.
  </EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option value="official">
    A current or former high-level elected or appointed public official.
  </EtSelectionTileGroup.Option>
</EtSelectionTileGroup>`}
          />
        </Section>
      </Page>
    );
  },
};

// ---------------------------------------------------------------------------
// 6. Toggle Input Variant
// ---------------------------------------------------------------------------

export const ToggleInputVariant: Story = {
  render: function ToggleInputVariantStory() {
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <Page>
        <Section>
          <Title>Toggle Input Variant</Title>
          <Desc>
            Works like toggle multi-select, but each selected tile reveals an inline input. The input is hidden again when that tile is untoggled.
          </Desc>
        </Section>

        <Section>
          <SubTitle>Inline Input per Selected Option</SubTitle>
          <Preview>
            <View style={FULL_WIDTH}>
              <EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={selected} onChange={setSelected}>
                <EtSelectionTileGroup.Option
                  value="director"
                  input={{
                    label: 'Please enter stock ticker',
                    fieldProps: {
                      placeholder: 'AAPL',
                    },
                  }}
                >
                  A director or a 10% shareholder of a publicly traded corporation.
                </EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option
                  value="brokerage"
                  input={{
                    label: 'Please enter brokerage firm name',
                    fieldProps: {
                      placeholder: 'Please enter brokerage firm name',
                    },
                  }}
                >
                  Employed by a brokerage firm or securities exchange.
                </EtSelectionTileGroup.Option>
                <EtSelectionTileGroup.Option
                  value="official"
                  input={{
                    label: 'Please enter public role',
                    fieldProps: {
                      placeholder: 'Please enter public role',
                    },
                  }}
                >
                  A current or former high-level elected or appointed public official.
                </EtSelectionTileGroup.Option>
              </EtSelectionTileGroup>
            </View>
          </Preview>
          <Label>Selected: {selected.length > 0 ? selected.join(', ') : 'none'}</Label>
          <CodeBlock
            code={`const [selected, setSelected] = useState<string[]>([]);

<EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={selected} onChange={setSelected}>
  <EtSelectionTileGroup.Option
    value="director"
    input={{
      label: 'Please enter stock ticker',
      fieldProps: { placeholder: 'AAPL' },
    }}
  >
    A director or a 10% shareholder of a publicly traded corporation.
  </EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option
    value="brokerage"
    input={{
      label: 'Please enter brokerage firm name',
      fieldProps: { placeholder: 'Please enter brokerage firm name' },
    }}
  >
    Employed by a brokerage firm or securities exchange.
  </EtSelectionTileGroup.Option>
  <EtSelectionTileGroup.Option
    value="official"
    input={{
      label: 'Please enter public role',
      fieldProps: { placeholder: 'Please enter public role' },
    }}
  >
    A current or former high-level elected or appointed public official.
  </EtSelectionTileGroup.Option>
</EtSelectionTileGroup>`}
          />
        </Section>
      </Page>
    );
  },
};

// ---------------------------------------------------------------------------
// 7. API Reference (always last)
// ---------------------------------------------------------------------------

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtSelectionTileGroup</SubTitle>
        <Desc>Root group component. Controls variant, selection mode, value, and shared state.</Desc>
        <PropsTable
          data={[
            { prop: 'variant', type: "'icon' | 'radio' | 'toggle' | 'toggleInput'", default: "'icon'" },
            { prop: 'selectionMode', type: "'single' | 'multi'", default: "'single'" },
            { prop: 'value', type: 'string | null (single) or string[] (multi)', default: '-' },
            { prop: 'onChange', type: '(value) => void', default: '-' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'haptics', type: 'boolean', default: 'true' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSelectionTileGroup.Option</SubTitle>
        <Desc>Individual tile option. Reads variant and selection state from group context.</Desc>
        <PropsTable
          data={[
            { prop: 'value', type: 'string', default: '-' },
            { prop: 'children', type: 'string', default: '-' },
            { prop: 'subtitle', type: 'string', default: '-' },
            { prop: 'iconName', type: 'string', default: "'angle-right'" },
            { prop: 'input', type: 'SelectionTileOptionInputProps', default: 'optional customizations for toggleInput inline EtInput' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Variant Behavior</SubTitle>
        <Desc>icon: Right-side icon (customizable), border highlight on selection. Default variant.</Desc>
        <Desc>radio: Radio circle indicator, supports subtitle, border highlight + green dot.</Desc>
        <Desc>toggle: Toggle switch, no border highlight. Supports single and multi select.</Desc>
        <Desc>toggleInput: Toggle switch + inline EtInput visible only while selected.</Desc>
      </Section>

      <Section>
        <SubTitle>Selection Modes</SubTitle>
        <Desc>single (default): One option selected at a time. value is string | null.</Desc>
        <Desc>multi (toggle/toggleInput only): Multiple options can be active. value is string[].</Desc>
      </Section>
    </Page>
  ),
};
