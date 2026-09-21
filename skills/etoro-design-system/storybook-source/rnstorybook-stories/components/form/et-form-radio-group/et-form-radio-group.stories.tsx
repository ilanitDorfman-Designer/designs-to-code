import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { Page, Section, Title, Desc, Preview, CodeBlock, PropsTable, SubTitle, Divider, Label } from '../../../utils/storybook-template';
import { useForm, EtFormRadioGroup } from 'etoro-ui/form';

type Story = StoryObj<{}>;

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Form/EtFormRadioGroup',
};

export default meta;

export const EtFormRadioGroupDocs: Story = {
  name: 'EtFormRadioGroup',
  render: function EtFormRadioGroupDocsStory() {
    const basicForm = useForm({
      defaultValues: { gender: '' as string },
      mode: 'onSubmit',
    });
    const elsewhereForm = useForm({
      defaultValues: { plan: '' as string },
      mode: 'onSubmit',
    });
    const customRenderForm = useForm({
      defaultValues: { role: '' as string },
      mode: 'onSubmit',
    });
    const noErrorTextForm = useForm({
      defaultValues: { priority: '' as string },
      mode: 'onSubmit',
    });
    const customHandlerForm = useForm({
      defaultValues: { speed: '' as string },
      mode: 'onSubmit',
    });
    const [lastEvent, setLastEvent] = useState<string>('—');

    return (
      <Page>
        <Section>
          <Title>EtFormRadioGroup</Title>
          <Desc>
            React Hook Form wrapper for EtRadioGroup. Connects form state, validation, and error display through a composable sub-component API.
          </Desc>
        </Section>

        <Divider />

        <Section>
          <SubTitle>Basic</SubTitle>
          <Desc>Radio group with options and inline validation error via .ErrorMessage. Tap Submit without selecting to trigger validation.</Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormRadioGroup name="gender" control={basicForm.control} rules={{ required: 'Please select an option' }}>
                <EtFormRadioGroup.Control>
                  <EtFormRadioGroup.Option value="male">Male</EtFormRadioGroup.Option>
                  <EtFormRadioGroup.Option value="female">Female</EtFormRadioGroup.Option>
                  <EtFormRadioGroup.Option value="other">Prefer not to say</EtFormRadioGroup.Option>
                </EtFormRadioGroup.Control>
                <EtFormRadioGroup.ErrorMessage />
              </EtFormRadioGroup>

              <Text onPress={basicForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                Submit
              </Text>
            </View>
          </Preview>
          <CodeBlock
            code={`import { useForm, EtFormRadioGroup } from 'etoro-ui/form';

const { control, handleSubmit } = useForm({
  defaultValues: { gender: '' },
  mode: 'onSubmit',
});

<EtFormRadioGroup
  name="gender"
  control={control}
  rules={{ required: 'Please select an option' }}
>
  <EtFormRadioGroup.Control>
    <EtFormRadioGroup.Option value="male">Male</EtFormRadioGroup.Option>
    <EtFormRadioGroup.Option value="female">Female</EtFormRadioGroup.Option>
    <EtFormRadioGroup.Option value="other">Prefer not to say</EtFormRadioGroup.Option>
  </EtFormRadioGroup.Control>
  <EtFormRadioGroup.ErrorMessage />
</EtFormRadioGroup>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>Error Placed Elsewhere</SubTitle>
          <Desc>
            .ErrorMessage can appear anywhere within the EtFormRadioGroup provider boundary — not adjacent to .Control. Here the error renders below a
            separator, separate from the options.
          </Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormRadioGroup name="plan" control={elsewhereForm.control} rules={{ required: 'You must select a plan to continue' }}>
                <Label>Select a plan</Label>
                <EtFormRadioGroup.Control>
                  <EtFormRadioGroup.Option value="basic">Basic — Free</EtFormRadioGroup.Option>
                  <EtFormRadioGroup.Option value="pro">Pro — $9.99/mo</EtFormRadioGroup.Option>
                  <EtFormRadioGroup.Option value="enterprise">Enterprise</EtFormRadioGroup.Option>
                </EtFormRadioGroup.Control>

                <View
                  style={{
                    height: 1,
                    backgroundColor: '#333',
                    marginVertical: 12,
                  }}
                />

                <EtFormRadioGroup.ErrorMessage />
              </EtFormRadioGroup>

              <Text onPress={elsewhereForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                Submit
              </Text>
            </View>
          </Preview>
          <CodeBlock
            code={`<EtFormRadioGroup name="plan" control={control} rules={{ required: 'Select a plan' }}>
  <EtFormRadioGroup.Control>
    <EtFormRadioGroup.Option value="basic">Basic — Free</EtFormRadioGroup.Option>
    <EtFormRadioGroup.Option value="pro">Pro — $9.99/mo</EtFormRadioGroup.Option>
    <EtFormRadioGroup.Option value="enterprise">Enterprise</EtFormRadioGroup.Option>
  </EtFormRadioGroup.Control>

  <View style={styles.separator} />

  {/* Error below the separator */}
  <EtFormRadioGroup.ErrorMessage />
</EtFormRadioGroup>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>Custom Error Render</SubTitle>
          <Desc>Use the render prop on .ErrorMessage to fully control how the validation error is displayed.</Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormRadioGroup name="role" control={customRenderForm.control} rules={{ required: 'Role selection is required' }}>
                <EtFormRadioGroup.Control>
                  <EtFormRadioGroup.Option value="viewer">Viewer</EtFormRadioGroup.Option>
                  <EtFormRadioGroup.Option value="editor">Editor</EtFormRadioGroup.Option>
                  <EtFormRadioGroup.Option value="admin">Admin</EtFormRadioGroup.Option>
                </EtFormRadioGroup.Control>
                <EtFormRadioGroup.ErrorMessage
                  render={({ message }) => (
                    <View
                      style={{
                        marginTop: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Text style={{ color: '#ff4444' }}>●</Text>
                      <Text style={{ color: '#ff4444', fontSize: 13 }}>{message}</Text>
                    </View>
                  )}
                />
              </EtFormRadioGroup>

              <Text onPress={customRenderForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                Submit
              </Text>
            </View>
          </Preview>
          <CodeBlock
            code={`<EtFormRadioGroup name="role" control={control} rules={{ required: 'Role selection is required' }}>
  <EtFormRadioGroup.Control>
    <EtFormRadioGroup.Option value="viewer">Viewer</EtFormRadioGroup.Option>
    <EtFormRadioGroup.Option value="editor">Editor</EtFormRadioGroup.Option>
    <EtFormRadioGroup.Option value="admin">Admin</EtFormRadioGroup.Option>
  </EtFormRadioGroup.Control>
  <EtFormRadioGroup.ErrorMessage
    render={({ message }) => (
      <View style={styles.row}>
        <Text style={styles.dot}>●</Text>
        <Text style={styles.errorText}>{message}</Text>
      </View>
    )}
  />
</EtFormRadioGroup>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>No Error Text</SubTitle>
          <Desc>
            Omit .ErrorMessage when errors are handled externally via EtFormErrorMessage (shared error block for multiple fields). The radio group
            still shows its visual error state.
          </Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormRadioGroup name="priority" control={noErrorTextForm.control} rules={{ required: 'Required' }}>
                <EtFormRadioGroup.Control>
                  <EtFormRadioGroup.Option value="low">Low</EtFormRadioGroup.Option>
                  <EtFormRadioGroup.Option value="medium">Medium</EtFormRadioGroup.Option>
                  <EtFormRadioGroup.Option value="high">High</EtFormRadioGroup.Option>
                </EtFormRadioGroup.Control>
                {/* No <EtFormRadioGroup.ErrorMessage /> */}
              </EtFormRadioGroup>

              <Text onPress={noErrorTextForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                Submit
              </Text>
            </View>
          </Preview>
          <CodeBlock
            code={`<EtFormRadioGroup name="priority" control={control} rules={{ required: 'Required' }}>
  <EtFormRadioGroup.Control>
    <EtFormRadioGroup.Option value="low">Low</EtFormRadioGroup.Option>
    <EtFormRadioGroup.Option value="medium">Medium</EtFormRadioGroup.Option>
    <EtFormRadioGroup.Option value="high">High</EtFormRadioGroup.Option>
  </EtFormRadioGroup.Control>
  {/* No ErrorMessage — visual error state only; use EtFormErrorMessage for shared error */}
</EtFormRadioGroup>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>With Custom onChange Handler</SubTitle>
          <Desc>
            Pass an optional onChange to EtFormRadioGroup.Control — it is composed with the RHF handler so both the form state update and your
            side-effect run. Select an option to see the last event logged below.
          </Desc>
          <Preview>
            <View style={{ width: '100%', gap: 12 }}>
              <EtFormRadioGroup name="speed" control={customHandlerForm.control}>
                <EtFormRadioGroup.Control onChange={(value) => setLastEvent(`onChange: "${value}"`)}>
                  <EtFormRadioGroup.Option value="slow">Slow</EtFormRadioGroup.Option>
                  <EtFormRadioGroup.Option value="medium">Medium</EtFormRadioGroup.Option>
                  <EtFormRadioGroup.Option value="fast">Fast</EtFormRadioGroup.Option>
                </EtFormRadioGroup.Control>
              </EtFormRadioGroup>
              <Text style={{ color: '#888', fontSize: 12 }}>Last event: {lastEvent}</Text>
            </View>
          </Preview>
          <CodeBlock
            code={`const [lastEvent, setLastEvent] = useState('—');

<EtFormRadioGroup name="speed" control={control}>
  <EtFormRadioGroup.Control onChange={(value) => setLastEvent(\`onChange: "\${value}"\`)}>
    <EtFormRadioGroup.Option value="slow">Slow</EtFormRadioGroup.Option>
    <EtFormRadioGroup.Option value="medium">Medium</EtFormRadioGroup.Option>
    <EtFormRadioGroup.Option value="fast">Fast</EtFormRadioGroup.Option>
  </EtFormRadioGroup.Control>
</EtFormRadioGroup>`}
          />
        </Section>

        <Divider />

        <Section>
          <Title>API Reference</Title>
        </Section>

        <Section>
          <SubTitle>EtFormRadioGroup (Root)</SubTitle>
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
                description: 'RHF validation rules',
              },
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Control, ErrorMessage sub-components',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtFormRadioGroup.Control</SubTitle>
          <Desc>
            Renders EtRadioGroup with value and onChange auto-bound from context. When there is an error, the error boolean is forwarded to
            EtRadioGroup.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'direction',
                type: '"row" | "column"',
                default: '"column"',
                description: 'Layout direction of the options',
              },
              {
                prop: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables all options',
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
                type: '(value: string) => void',
                default: '-',
                description: 'Custom handler composed with RHF onChange — both run on each selection',
              },
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'EtFormRadioGroup.Option elements',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtFormRadioGroup.ErrorMessage</SubTitle>
          <Desc>
            Renders validation error text. Returns null when no error. Can be placed anywhere within the EtFormRadioGroup provider boundary.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'render',
                type: '(props: { message: string | undefined; error: FieldError }) => ReactNode',
                default: '-',
                description: 'Custom render function — overrides default text',
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
          <SubTitle>EtFormRadioGroup.Option</SubTitle>
          <Desc>Re-exported EtRadioGroup.Option. Renders a single selectable radio option.</Desc>
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
                type: 'ReactNode',
                default: '-',
                description: 'Label content for this option',
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
            ]}
          />
        </Section>
      </Page>
    );
  },
};
