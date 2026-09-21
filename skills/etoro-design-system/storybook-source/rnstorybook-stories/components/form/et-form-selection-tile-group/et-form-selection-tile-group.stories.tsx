import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { Page, Section, Title, Desc, Preview, CodeBlock, PropsTable, SubTitle, Divider } from '../../../utils/storybook-template';
import { useForm, EtFormSelectionTileGroup } from 'etoro-ui/form';

type Story = StoryObj<{}>;

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Form/EtFormSelectionTileGroup',
};

export default meta;

export const EtFormSelectionTileGroupDocs: Story = {
  name: 'EtFormSelectionTileGroup',
  render: function EtFormSelectionTileGroupDocsStory() {
    const basicForm = useForm({
      defaultValues: { country: '' as string },
      mode: 'onSubmit',
    });
    const radioForm = useForm({
      defaultValues: { risk: '' as string },
      mode: 'onSubmit',
    });
    const multiForm = useForm({
      defaultValues: { interests: [] as string[] },
      mode: 'onSubmit',
    });
    const toggleInputForm = useForm({
      defaultValues: { disclosures: [] as string[] },
      mode: 'onSubmit',
    });
    const customHandlerForm = useForm({
      defaultValues: { plan: '' as string },
      mode: 'onSubmit',
    });
    const [lastEvent, setLastEvent] = useState<string>('—');

    return (
      <Page>
        <Section>
          <Title>EtFormSelectionTileGroup</Title>
          <Desc>
            React Hook Form wrapper for EtSelectionTileGroup. Connects form state, validation, and error display through a composable sub-component
            API. Supports single-select (string) and multi-select (string[]) field values.
          </Desc>
        </Section>

        <Divider />

        <Section>
          <SubTitle>Basic (Icon Variant)</SubTitle>
          <Desc>Default icon variant with inline validation error. Tap Submit without selecting to trigger validation.</Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormSelectionTileGroup name="country" control={basicForm.control} rules={{ required: 'Please select a country' }}>
                <EtFormSelectionTileGroup.Control>
                  <EtFormSelectionTileGroup.Option value="us">United States</EtFormSelectionTileGroup.Option>
                  <EtFormSelectionTileGroup.Option value="uk">United Kingdom</EtFormSelectionTileGroup.Option>
                  <EtFormSelectionTileGroup.Option value="de">Germany</EtFormSelectionTileGroup.Option>
                </EtFormSelectionTileGroup.Control>
                <EtFormSelectionTileGroup.ErrorMessage />
              </EtFormSelectionTileGroup>

              <Text onPress={basicForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                Submit
              </Text>
            </View>
          </Preview>
          <CodeBlock
            code={`import { useForm, EtFormSelectionTileGroup } from 'etoro-ui/form';

const { control, handleSubmit } = useForm({
  defaultValues: { country: '' },
  mode: 'onSubmit',
});

<EtFormSelectionTileGroup
  name="country"
  control={control}
  rules={{ required: 'Please select a country' }}
>
  <EtFormSelectionTileGroup.Control>
    <EtFormSelectionTileGroup.Option value="us">United States</EtFormSelectionTileGroup.Option>
    <EtFormSelectionTileGroup.Option value="uk">United Kingdom</EtFormSelectionTileGroup.Option>
    <EtFormSelectionTileGroup.Option value="de">Germany</EtFormSelectionTileGroup.Option>
  </EtFormSelectionTileGroup.Control>
  <EtFormSelectionTileGroup.ErrorMessage />
</EtFormSelectionTileGroup>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>Radio Variant</SubTitle>
          <Desc>Radio-style tiles with subtitle support. Good for selection where each option needs a brief explanation.</Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormSelectionTileGroup name="risk" control={radioForm.control} rules={{ required: 'Select a risk level' }}>
                <EtFormSelectionTileGroup.Control variant="radio">
                  <EtFormSelectionTileGroup.Option value="conservative" subtitle="Lower risk, stable returns">
                    Conservative
                  </EtFormSelectionTileGroup.Option>
                  <EtFormSelectionTileGroup.Option value="moderate" subtitle="Balance risk & growth">
                    Moderate
                  </EtFormSelectionTileGroup.Option>
                  <EtFormSelectionTileGroup.Option value="aggressive" subtitle="Higher risk, higher potential">
                    Aggressive
                  </EtFormSelectionTileGroup.Option>
                </EtFormSelectionTileGroup.Control>
                <EtFormSelectionTileGroup.ErrorMessage />
              </EtFormSelectionTileGroup>

              <Text onPress={radioForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                Submit
              </Text>
            </View>
          </Preview>
          <CodeBlock
            code={`<EtFormSelectionTileGroup name="risk" control={control} rules={{ required: 'Select a risk level' }}>
  <EtFormSelectionTileGroup.Control variant="radio">
    <EtFormSelectionTileGroup.Option value="conservative" subtitle="Lower risk, stable returns">
      Conservative
    </EtFormSelectionTileGroup.Option>
    <EtFormSelectionTileGroup.Option value="moderate" subtitle="Balance risk & growth">
      Moderate
    </EtFormSelectionTileGroup.Option>
  </EtFormSelectionTileGroup.Control>
  <EtFormSelectionTileGroup.ErrorMessage />
</EtFormSelectionTileGroup>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>Toggle Multi-Select</SubTitle>
          <Desc>
            Toggle variant with multi-select. Field value is a string array. Use with variant="toggle" and selectionMode="multi" on Control.
          </Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormSelectionTileGroup name="interests" control={multiForm.control}>
                <EtFormSelectionTileGroup.Control variant="toggle" selectionMode="multi">
                  <EtFormSelectionTileGroup.Option value="stocks">Stocks</EtFormSelectionTileGroup.Option>
                  <EtFormSelectionTileGroup.Option value="crypto">Crypto</EtFormSelectionTileGroup.Option>
                  <EtFormSelectionTileGroup.Option value="etfs">ETFs</EtFormSelectionTileGroup.Option>
                  <EtFormSelectionTileGroup.Option value="commodities">Commodities</EtFormSelectionTileGroup.Option>
                </EtFormSelectionTileGroup.Control>
              </EtFormSelectionTileGroup>

              <Text onPress={multiForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                Submit
              </Text>
            </View>
          </Preview>
          <CodeBlock
            code={`const { control } = useForm({
  defaultValues: { interests: [] as string[] },
});

<EtFormSelectionTileGroup name="interests" control={control}>
  <EtFormSelectionTileGroup.Control variant="toggle" selectionMode="multi">
    <EtFormSelectionTileGroup.Option value="stocks">Stocks</EtFormSelectionTileGroup.Option>
    <EtFormSelectionTileGroup.Option value="crypto">Crypto</EtFormSelectionTileGroup.Option>
    <EtFormSelectionTileGroup.Option value="etfs">ETFs</EtFormSelectionTileGroup.Option>
  </EtFormSelectionTileGroup.Control>
</EtFormSelectionTileGroup>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>Toggle Input Variant</SubTitle>
          <Desc>
            Multi-select with inline input fields that appear only for selected options. Useful for follow-up details tied to each active disclosure.
          </Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormSelectionTileGroup name="disclosures" control={toggleInputForm.control}>
                <EtFormSelectionTileGroup.Control variant="toggleInput" selectionMode="multi">
                  <EtFormSelectionTileGroup.Option
                    value="director"
                    input={{
                      label: 'Please enter stock ticker',
                      fieldProps: { placeholder: 'AAPL' },
                    }}
                  >
                    A director or a 10% shareholder of a publicly traded corporation.
                  </EtFormSelectionTileGroup.Option>
                  <EtFormSelectionTileGroup.Option
                    value="brokerage"
                    input={{
                      label: 'Please enter brokerage firm name',
                      fieldProps: { placeholder: 'Please enter brokerage firm name' },
                    }}
                  >
                    Employed by a brokerage firm or securities exchange.
                  </EtFormSelectionTileGroup.Option>
                  <EtFormSelectionTileGroup.Option
                    value="official"
                    input={{
                      label: 'Please enter public role',
                      fieldProps: { placeholder: 'Please enter public role' },
                    }}
                  >
                    A current or former high-level elected or appointed public official.
                  </EtFormSelectionTileGroup.Option>
                </EtFormSelectionTileGroup.Control>
              </EtFormSelectionTileGroup>

              <Text onPress={toggleInputForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                Submit
              </Text>
            </View>
          </Preview>
          <CodeBlock
            code={`<EtFormSelectionTileGroup name="disclosures" control={control}>
  <EtFormSelectionTileGroup.Control variant="toggleInput" selectionMode="multi">
    <EtFormSelectionTileGroup.Option
      value="director"
      input={{
        label: 'Please enter stock ticker',
        fieldProps: { placeholder: 'AAPL' },
      }}
    >
      A director or a 10% shareholder of a publicly traded corporation.
    </EtFormSelectionTileGroup.Option>
    <EtFormSelectionTileGroup.Option
      value="brokerage"
      input={{
        label: 'Please enter brokerage firm name',
        fieldProps: { placeholder: 'Please enter brokerage firm name' },
      }}
    >
      Employed by a brokerage firm or securities exchange.
    </EtFormSelectionTileGroup.Option>
    <EtFormSelectionTileGroup.Option
      value="official"
      input={{
        label: 'Please enter public role',
        fieldProps: { placeholder: 'Please enter public role' },
      }}
    >
      A current or former high-level elected or appointed public official.
    </EtFormSelectionTileGroup.Option>
  </EtFormSelectionTileGroup.Control>
</EtFormSelectionTileGroup>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>With Custom onChange Handler</SubTitle>
          <Desc>
            Pass an optional onChange to Control — it is composed with the RHF handler so both the form state update and your side-effect run.
          </Desc>
          <Preview>
            <View style={{ width: '100%', gap: 12 }}>
              <EtFormSelectionTileGroup name="plan" control={customHandlerForm.control}>
                <EtFormSelectionTileGroup.Control onChange={(value) => setLastEvent(`onChange: "${value}"`)}>
                  <EtFormSelectionTileGroup.Option value="basic">Basic — Free</EtFormSelectionTileGroup.Option>
                  <EtFormSelectionTileGroup.Option value="pro">Pro — $9.99/mo</EtFormSelectionTileGroup.Option>
                  <EtFormSelectionTileGroup.Option value="enterprise">Enterprise</EtFormSelectionTileGroup.Option>
                </EtFormSelectionTileGroup.Control>
              </EtFormSelectionTileGroup>
              <Text style={{ color: '#888', fontSize: 12 }}>Last event: {lastEvent}</Text>
            </View>
          </Preview>
          <CodeBlock
            code={`const [lastEvent, setLastEvent] = useState('—');

<EtFormSelectionTileGroup name="plan" control={control}>
  <EtFormSelectionTileGroup.Control onChange={(value) => setLastEvent(\`onChange: "\${value}"\`)}>
    <EtFormSelectionTileGroup.Option value="basic">Basic — Free</EtFormSelectionTileGroup.Option>
    <EtFormSelectionTileGroup.Option value="pro">Pro — $9.99/mo</EtFormSelectionTileGroup.Option>
  </EtFormSelectionTileGroup.Control>
</EtFormSelectionTileGroup>`}
          />
        </Section>

        <Divider />

        <Section>
          <Title>API Reference</Title>
        </Section>

        <Section>
          <SubTitle>EtFormSelectionTileGroup (Root)</SubTitle>
          <Desc>Provider — calls useController, shares value, onChange, and error via context. Renders no UI itself.</Desc>
          <PropsTable
            data={[
              {
                prop: 'name',
                type: 'FieldPath<TFieldValues>',
                default: '-',
                description: 'Field name in the form data',
              },
              {
                prop: 'control',
                type: 'Control<TFieldValues>',
                default: '-',
                description: 'Control object from useForm()',
              },
              {
                prop: 'rules',
                type: 'RegisterOptions',
                default: '-',
                description: 'RHF validation rules (e.g. required, validate)',
              },
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Control and ErrorMessage sub-components',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtFormSelectionTileGroup.Control</SubTitle>
          <Desc>
            Renders EtSelectionTileGroup with value and onChange auto-bound from context. Accepts all EtSelectionTileGroup props except value and
            onChange.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'variant',
                type: '"icon" | "radio" | "toggle" | "toggleInput"',
                default: '"icon"',
                description: 'Visual variant for the tile options',
              },
              {
                prop: 'selectionMode',
                type: '"single" | "multi"',
                default: '"single"',
                description: 'Selection mode — multi requires variant="toggle" or "toggleInput" and string[] field value',
              },
              {
                prop: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables all options',
              },
              {
                prop: 'haptics',
                type: 'boolean',
                default: 'true',
                description: 'Enable haptic feedback on selection',
              },
              {
                prop: 'style',
                type: 'StyleProp<ViewStyle>',
                default: '-',
                description: 'Container style override',
              },
              {
                prop: 'testID',
                type: 'string',
                default: '-',
                description: 'Test identifier',
              },
              {
                prop: 'onChange',
                type: '(value: string | string[]) => void',
                default: '-',
                description: 'Custom handler composed with RHF onChange — both run on each selection',
              },
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'EtFormSelectionTileGroup.Option elements',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtFormSelectionTileGroup.ErrorMessage</SubTitle>
          <Desc>Renders validation error text. Returns null when no error. Can be placed anywhere within the provider boundary.</Desc>
          <PropsTable
            data={[
              {
                prop: 'render',
                type: '(props: { message: string | undefined; error: FieldError }) => ReactNode',
                default: '-',
                description: 'Custom render function — overrides default error text',
              },
              {
                prop: 'style',
                type: 'StyleProp<TextStyle>',
                default: '-',
                description: 'Style applied to the error text',
              },
              {
                prop: 'testID',
                type: 'string',
                default: '-',
                description: 'Test identifier',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtFormSelectionTileGroup.Option</SubTitle>
          <Desc>Re-exported EtSelectionTileGroup.Option. Renders a single selectable tile option.</Desc>
          <PropsTable
            data={[
              {
                prop: 'value',
                type: 'string',
                default: '-',
                description: 'Value submitted to RHF when this option is selected (required)',
              },
              {
                prop: 'children',
                type: 'string',
                default: '-',
                description: 'Label text for this option (required)',
              },
              {
                prop: 'subtitle',
                type: 'string',
                default: '-',
                description: 'Secondary text line (works with any variant, primarily used with radio)',
              },
              {
                prop: 'iconName',
                type: 'string',
                default: '"angle-right"',
                description: 'Icon name for icon variant',
              },
              {
                prop: 'input',
                type: 'SelectionTileOptionInputProps',
                default: 'optional customizations for toggleInput inline EtInput',
                description: 'Shown only when this option is selected in toggleInput variant',
              },
              {
                prop: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables this specific option',
              },
              {
                prop: 'testID',
                type: 'string',
                default: '-',
                description: 'Test identifier',
              },
              {
                prop: 'accessibilityLabel',
                type: 'string',
                default: 'children text',
                description: 'Accessibility label (defaults to children text)',
              },
            ]}
          />
        </Section>
      </Page>
    );
  },
};
