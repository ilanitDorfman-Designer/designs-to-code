import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { Page, Section, Title, Desc, Preview, CodeBlock, PropsTable, SubTitle, Divider } from '../../../utils/storybook-template';
import { useForm, EtFormCheckbox } from 'etoro-ui/form';

type Story = StoryObj<{}>;

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Form/EtFormCheckbox',
};

export default meta;

export const EtFormCheckboxDocs: Story = {
  name: 'EtFormCheckbox',
  render: function EtFormCheckboxDocsStory() {
    const basicForm = useForm({
      defaultValues: { terms: false },
      mode: 'onSubmit',
    });
    const elsewhereForm = useForm({
      defaultValues: { newsletter: false },
      mode: 'onSubmit',
    });
    const customRenderForm = useForm({
      defaultValues: { marketing: false },
      mode: 'onSubmit',
    });
    const noErrorTextForm = useForm({
      defaultValues: { silent: false },
      mode: 'onSubmit',
    });
    const customHandlerForm = useForm({
      defaultValues: { notify: false },
      mode: 'onSubmit',
    });
    const [lastEvent, setLastEvent] = useState<string>('—');

    return (
      <Page>
        <Section>
          <Title>EtFormCheckbox</Title>
          <Desc>
            React Hook Form wrapper for EtCheckbox. Connects form state, validation, and error display through a composable sub-component API.
          </Desc>
        </Section>

        <Divider />

        <Section>
          <SubTitle>Basic</SubTitle>
          <Desc>Checkbox with inline validation error rendered via .ErrorMessage. Tap Submit without checking to trigger validation.</Desc>
          <Preview>
            <EtFormCheckbox
              name="terms"
              control={basicForm.control}
              rules={{
                validate: (v) => v === true || 'You must accept the terms',
              }}
            >
              <EtFormCheckbox.Control>
                <EtFormCheckbox.Label>I agree to the Terms & Conditions</EtFormCheckbox.Label>
              </EtFormCheckbox.Control>
              <EtFormCheckbox.ErrorMessage />
            </EtFormCheckbox>

            <Text onPress={basicForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
              Submit
            </Text>
          </Preview>
          <CodeBlock
            code={`import { useForm, EtFormCheckbox } from 'etoro-ui/form';

const { control, handleSubmit } = useForm({
  defaultValues: { terms: false },
  mode: 'onSubmit',
});

<EtFormCheckbox
  name="terms"
  control={control}
  rules={{ validate: (v) => v === true || 'You must accept the terms' }}
>
  <EtFormCheckbox.Control>
    <EtFormCheckbox.Label>I agree to the Terms & Conditions</EtFormCheckbox.Label>
  </EtFormCheckbox.Control>
  <EtFormCheckbox.ErrorMessage />
</EtFormCheckbox>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>Error Placed Elsewhere</SubTitle>
          <Desc>
            The .ErrorMessage sub-component can be placed anywhere within the EtFormCheckbox provider boundary — not just directly below .Control.
            Here the error renders at the bottom of the card, far from the checkbox.
          </Desc>
          <Preview>
            <EtFormCheckbox
              name="newsletter"
              control={elsewhereForm.control}
              rules={{
                validate: (v) => v === true || 'Subscription is required to continue',
              }}
            >
              <View
                style={{
                  backgroundColor: '#1a1a1a',
                  padding: 16,
                  borderRadius: 8,
                  gap: 24,
                }}
              >
                <View style={{ gap: 4 }}>
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Newsletter</Text>
                  <Text style={{ color: '#999', fontSize: 13 }}>Stay updated with the latest news</Text>
                </View>

                <EtFormCheckbox.Control>
                  <EtFormCheckbox.Label>Subscribe to newsletter</EtFormCheckbox.Label>
                </EtFormCheckbox.Control>

                <EtFormCheckbox.ErrorMessage />
              </View>
            </EtFormCheckbox>

            <Text onPress={elsewhereForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
              Submit
            </Text>
          </Preview>
          <CodeBlock
            code={`<EtFormCheckbox name="newsletter" control={control} rules={{ validate: (v) => v === true || 'Required' }}>
  <View style={styles.card}>
    {/* content */}
    <EtFormCheckbox.Control>
      <EtFormCheckbox.Label>Subscribe to newsletter</EtFormCheckbox.Label>
    </EtFormCheckbox.Control>

    {/* error at bottom of card — different location, same provider */}
    <EtFormCheckbox.ErrorMessage />
  </View>
</EtFormCheckbox>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>Custom Error Render</SubTitle>
          <Desc>Pass a render prop to .ErrorMessage to completely control how the error is displayed — banner, icon, custom style, etc.</Desc>
          <Preview>
            <EtFormCheckbox
              name="marketing"
              control={customRenderForm.control}
              rules={{
                validate: (v) => v === true || 'Marketing consent is required',
              }}
            >
              <EtFormCheckbox.Control>
                <EtFormCheckbox.Label>I consent to marketing emails</EtFormCheckbox.Label>
              </EtFormCheckbox.Control>
              <EtFormCheckbox.ErrorMessage
                render={({ message }) => (
                  <View
                    style={{
                      marginTop: 8,
                      padding: 10,
                      backgroundColor: '#2a1515',
                      borderRadius: 6,
                      borderLeftWidth: 3,
                      borderLeftColor: '#ff4444',
                    }}
                  >
                    <Text style={{ color: '#ff8888', fontSize: 13 }}>⚠ {message}</Text>
                  </View>
                )}
              />
            </EtFormCheckbox>

            <Text onPress={customRenderForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
              Submit
            </Text>
          </Preview>
          <CodeBlock
            code={`<EtFormCheckbox name="marketing" control={control} rules={{ validate: (v) => v === true || 'Consent required' }}>
  <EtFormCheckbox.Control>
    <EtFormCheckbox.Label>I consent to marketing emails</EtFormCheckbox.Label>
  </EtFormCheckbox.Control>
  <EtFormCheckbox.ErrorMessage
    render={({ message }) => (
      <View style={styles.errorBanner}>
        <Text style={styles.errorText}>⚠ {message}</Text>
      </View>
    )}
  />
</EtFormCheckbox>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>No Error Text</SubTitle>
          <Desc>
            Omit .ErrorMessage entirely. The checkbox still enters the visual error state (red border), but no text is rendered. Use when errors are
            shown via EtFormErrorMessage for multiple fields.
          </Desc>
          <Preview>
            <EtFormCheckbox name="silent" control={noErrorTextForm.control} rules={{ validate: (v) => v === true || 'Required' }}>
              <EtFormCheckbox.Control>
                <EtFormCheckbox.Label>Accept (no inline error text)</EtFormCheckbox.Label>
              </EtFormCheckbox.Control>
              {/* No <EtFormCheckbox.ErrorMessage /> — visual state only */}
            </EtFormCheckbox>

            <Text onPress={noErrorTextForm.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
              Submit
            </Text>
          </Preview>
          <CodeBlock
            code={`<EtFormCheckbox name="silent" control={control} rules={{ validate: (v) => v === true || 'Required' }}>
  <EtFormCheckbox.Control>
    <EtFormCheckbox.Label>Accept</EtFormCheckbox.Label>
  </EtFormCheckbox.Control>
  {/* No ErrorMessage — only visual error state shown */}
</EtFormCheckbox>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>With Custom onChange Handler</SubTitle>
          <Desc>
            Pass an optional onChange to EtFormCheckbox.Control — it is composed with the RHF handler so both the form state update and your
            side-effect run. Toggle the checkbox to see the last event logged below.
          </Desc>
          <Preview>
            <View style={{ width: '100%', gap: 12 }}>
              <EtFormCheckbox name="notify" control={customHandlerForm.control}>
                <EtFormCheckbox.Control onChange={(checked) => setLastEvent(`onChange: ${checked}`)}>
                  <EtFormCheckbox.Label>Enable notifications</EtFormCheckbox.Label>
                </EtFormCheckbox.Control>
              </EtFormCheckbox>
              <Text style={{ color: '#888', fontSize: 12 }}>Last event: {lastEvent}</Text>
            </View>
          </Preview>
          <CodeBlock
            code={`const [lastEvent, setLastEvent] = useState('—');

<EtFormCheckbox name="notify" control={control}>
  <EtFormCheckbox.Control onChange={(checked) => setLastEvent(\`onChange: \${checked}\`)}>
    <EtFormCheckbox.Label>Enable notifications</EtFormCheckbox.Label>
  </EtFormCheckbox.Control>
</EtFormCheckbox>`}
          />
        </Section>

        <Divider />

        <Section>
          <Title>API Reference</Title>
        </Section>

        <Section>
          <SubTitle>EtFormCheckbox (Root)</SubTitle>
          <Desc>Provider — calls useController, shares onChange, value, and error via context. Renders no UI itself.</Desc>
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
          <SubTitle>EtFormCheckbox.Control</SubTitle>
          <Desc>
            Renders EtCheckbox with value and onChange auto-bound from context. When there is an error and the checkbox is unchecked, value is set to
            "error" triggering the visual error state.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables the checkbox',
              },
              {
                prop: 'haptics',
                type: 'boolean',
                default: 'true',
                description: 'Enable haptic feedback on press',
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
                prop: 'accessibilityLabel',
                type: 'string',
                default: '-',
                description: 'Accessibility label',
              },
              {
                prop: 'onChange',
                type: '(checked: boolean) => void',
                default: '-',
                description: 'Custom handler composed with RHF onChange — both run on each toggle',
              },
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'EtFormCheckbox.Label or custom content',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtFormCheckbox.ErrorMessage</SubTitle>
          <Desc>Renders validation error text. Returns null when no error. Can be placed anywhere within the EtFormCheckbox provider boundary.</Desc>
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
          <SubTitle>EtFormCheckbox.Label</SubTitle>
          <Desc>Re-exported EtCheckbox.Label. Wraps label text next to the checkbox.</Desc>
        </Section>
      </Page>
    );
  },
};
