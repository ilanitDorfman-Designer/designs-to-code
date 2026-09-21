import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { Page, Section, Title, Desc, Preview, CodeBlock, PropsTable, SubTitle, Divider } from '../../../utils/storybook-template';
import { useForm, FormProvider, EtFormInput, EtFormErrorMessage } from 'etoro-ui/form';

type Story = StoryObj<{}>;

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Form/EtFormInput',
};

export default meta;

export const EtFormInputDocs: Story = {
  name: 'EtFormInput',
  render: function EtFormInputDocsStory() {
    const basicForm = useForm({
      defaultValues: { email: '' },
      mode: 'onBlur',
    });
    const externalErrorForm = useForm({
      defaultValues: { emailExternal: '' },
      mode: 'onBlur',
    });
    const passwordForm = useForm({
      defaultValues: { password: '' },
      mode: 'onBlur',
    });
    const amountForm = useForm({
      defaultValues: { amount: '' },
      mode: 'onBlur',
    });
    const sharedErrorMethods = useForm({
      defaultValues: { emailShared: '', username: '' },
      mode: 'onBlur',
    });
    const customHandlerForm = useForm({
      defaultValues: { search: '' },
      mode: 'onBlur',
    });
    const [lastEvent, setLastEvent] = useState<string>('—');

    return (
      <Page>
        <Section>
          <Title>EtFormInput</Title>
          <Desc>React Hook Form wrapper for EtInput. Connects form state, validation, and error display through a composable sub-component API.</Desc>
        </Section>

        <Divider />

        <Section>
          <SubTitle>Basic (built-in error)</SubTitle>
          <Desc>Error is rendered by EtInput itself — no extra component needed. Blur the field without entering a value to trigger.</Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormInput
                name="email"
                control={basicForm.control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^@]+@[^@]+\.[^@]+$/,
                    message: 'Enter a valid email address',
                  },
                }}
              >
                <EtFormInput.Control>
                  <EtFormInput.Label required>Email</EtFormInput.Label>
                  <EtFormInput.Field placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" />
                </EtFormInput.Control>
              </EtFormInput>
            </View>
          </Preview>
          <CodeBlock
            code={`import { useForm, EtFormInput } from 'etoro-ui/form';

const { control } = useForm({
  defaultValues: { email: '' },
  mode: 'onBlur',
});

<EtFormInput
  name="email"
  control={control}
  rules={{
    required: 'Email is required',
    pattern: { value: /^[^@]+@[^@]+\\.[^@]+$/, message: 'Enter a valid email address' },
  }}
>
  <EtFormInput.Control>
    <EtFormInput.Label required>Email</EtFormInput.Label>
    <EtFormInput.Field placeholder="name@example.com" keyboardType="email-address" />
  </EtFormInput.Control>
</EtFormInput>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>With External Error Message</SubTitle>
          <Desc>
            Use hideError to suppress the built-in EtInput error, then place EtFormInput.ErrorMessage wherever you need it — e.g. below the control.
            Blur the field without entering a value to trigger.
          </Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormInput
                name="emailExternal"
                control={externalErrorForm.control}
                hideError
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^@]+@[^@]+\.[^@]+$/,
                    message: 'Enter a valid email address',
                  },
                }}
              >
                <EtFormInput.Control>
                  <EtFormInput.Label required>Email</EtFormInput.Label>
                  <EtFormInput.Field placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" />
                </EtFormInput.Control>
                <EtFormInput.ErrorMessage />
              </EtFormInput>
            </View>
          </Preview>
          <CodeBlock
            code={`<EtFormInput
  name="email"
  control={control}
  hideError
  rules={{
    required: 'Email is required',
    pattern: { value: /^[^@]+@[^@]+\\.[^@]+$/, message: 'Enter a valid email address' },
  }}
>
  <EtFormInput.Control>
    <EtFormInput.Label required>Email</EtFormInput.Label>
    <EtFormInput.Field placeholder="name@example.com" keyboardType="email-address" />
  </EtFormInput.Control>
  <EtFormInput.ErrorMessage />
</EtFormInput>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>Password</SubTitle>
          <Desc>Set type="password" on Control for automatic visibility toggle. The toggle button is rendered by EtInput automatically.</Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormInput
                name="password"
                control={passwordForm.control}
                rules={{
                  required: 'Password is required',
                  minLength: { value: 8, message: 'At least 8 characters' },
                }}
              >
                <EtFormInput.Control type="password">
                  <EtFormInput.Label required>Password</EtFormInput.Label>
                  <EtFormInput.Field />
                </EtFormInput.Control>
                <EtFormInput.ErrorMessage />
              </EtFormInput>
            </View>
          </Preview>
          <CodeBlock
            code={`<EtFormInput
  name="password"
  control={control}
  rules={{
    required: 'Password is required',
    minLength: { value: 8, message: 'At least 8 characters' },
  }}
>
  <EtFormInput.Control type="password">
    <EtFormInput.Label required>Password</EtFormInput.Label>
    <EtFormInput.Field placeholder="••••••••" />
  </EtFormInput.Control>
  <EtFormInput.ErrorMessage />
</EtFormInput>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>With Adornment</SubTitle>
          <Desc>Use re-exported EtFormInput.TextAdornment or EtFormInput.IconAdornment directly — they are the same as EtInput sub-components.</Desc>
          <Preview>
            <View style={{ width: '100%' }}>
              <EtFormInput name="amount" control={amountForm.control} rules={{ required: 'Amount is required' }}>
                <EtFormInput.Control type="number">
                  <EtFormInput.Label required>Amount</EtFormInput.Label>
                  <EtFormInput.Field placeholder="0.00" keyboardType="decimal-pad" />
                  <EtFormInput.TextAdornment>USD</EtFormInput.TextAdornment>
                </EtFormInput.Control>
                <EtFormInput.ErrorMessage />
              </EtFormInput>
            </View>
          </Preview>
          <CodeBlock
            code={`<EtFormInput name="amount" control={control} rules={{ required: 'Required' }}>
  <EtFormInput.Control type="number">
    <EtFormInput.Label required>Amount</EtFormInput.Label>
    <EtFormInput.Field placeholder="0.00" keyboardType="decimal-pad" />
    <EtFormInput.TextAdornment>USD</EtFormInput.TextAdornment>
  </EtFormInput.Control>
  <EtFormInput.ErrorMessage />
</EtFormInput>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>With Shared Error (hideError)</SubTitle>
          <Desc>
            Set hideError on EtFormInput.Root to suppress the inline error visual. Wrap both fields in EtFormErrorMessage to show one shared error
            block. Tap Submit to trigger both errors.
          </Desc>
          <Preview>
            <FormProvider {...sharedErrorMethods}>
              <View style={{ width: '100%' }}>
                <EtFormErrorMessage names={['emailShared', 'username']}>
                  <View style={{ gap: 16 }}>
                    <EtFormInput name="emailShared" control={sharedErrorMethods.control} rules={{ required: 'Email is required' }} hideError>
                      <EtFormInput.Control>
                        <EtFormInput.Label required>Email</EtFormInput.Label>
                        <EtFormInput.Field placeholder="name@example.com" />
                      </EtFormInput.Control>
                    </EtFormInput>

                    <EtFormInput name="username" control={sharedErrorMethods.control} rules={{ required: 'Username is required' }} hideError>
                      <EtFormInput.Control>
                        <EtFormInput.Label required>Username</EtFormInput.Label>
                        <EtFormInput.Field placeholder="Enter username" />
                      </EtFormInput.Control>
                    </EtFormInput>
                  </View>

                  <EtFormErrorMessage.Text mode="first" />
                </EtFormErrorMessage>

                <Text onPress={sharedErrorMethods.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                  Submit
                </Text>
              </View>
            </FormProvider>
          </Preview>
          <CodeBlock
            code={`import { useForm, FormProvider, EtFormInput, EtFormErrorMessage } from 'etoro-ui/form';

const methods = useForm({ defaultValues: { email: '', username: '' }, mode: 'onBlur' });

<FormProvider {...methods}>
  <EtFormErrorMessage names={['email', 'username']}>
    <EtFormInput name="email" control={control} rules={{ required: 'Email is required' }} hideError>
      <EtFormInput.Control>
        <EtFormInput.Label required>Email</EtFormInput.Label>
        <EtFormInput.Field placeholder="name@example.com" />
      </EtFormInput.Control>
    </EtFormInput>

    <EtFormInput name="username" control={control} rules={{ required: 'Username is required' }} hideError>
      <EtFormInput.Control>
        <EtFormInput.Label required>Username</EtFormInput.Label>
        <EtFormInput.Field placeholder="Enter username" />
      </EtFormInput.Control>
    </EtFormInput>

    <EtFormErrorMessage.Text mode="first" />
  </EtFormErrorMessage>
</FormProvider>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>With Custom Event Handlers</SubTitle>
          <Desc>
            Pass optional onChangeText or onBlur to EtFormInput.Field — they are composed with the RHF handlers so both the form state update and your
            side-effect run. Type in the field or blur it to see the last event logged below.
          </Desc>
          <Preview>
            <View style={{ width: '100%', gap: 12 }}>
              <EtFormInput name="search" control={customHandlerForm.control}>
                <EtFormInput.Control>
                  <EtFormInput.Label>Search</EtFormInput.Label>
                  <EtFormInput.Field
                    placeholder="Type something…"
                    onChangeText={(text) => setLastEvent(`onChange: "${text}"`)}
                    onBlur={() => setLastEvent('onBlur fired')}
                  />
                </EtFormInput.Control>
              </EtFormInput>
              <Text style={{ color: '#888', fontSize: 12 }}>Last event: {lastEvent}</Text>
            </View>
          </Preview>
          <CodeBlock
            code={`const [lastEvent, setLastEvent] = useState('—');

<EtFormInput name="search" control={control}>
  <EtFormInput.Control>
    <EtFormInput.Label>Search</EtFormInput.Label>
    <EtFormInput.Field
      placeholder="Type something…"
      onChangeText={(text) => setLastEvent(\`onChange: "\${text}"\`)}
      onBlur={() => setLastEvent('onBlur fired')}
    />
  </EtFormInput.Control>
</EtFormInput>`}
          />
        </Section>

        <Divider />

        <Section>
          <Title>API Reference</Title>
        </Section>

        <Section>
          <SubTitle>EtFormInput (Root)</SubTitle>
          <Desc>Provider — calls useController, shares field state via context. Renders nothing itself; requires Control + Field children.</Desc>
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
                prop: 'hideError',
                type: 'boolean',
                default: 'false',
                description: 'Suppress error forwarding to EtInput (use with EtFormErrorMessage)',
              },
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Control, Field, ErrorMessage sub-components',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtFormInput.Control</SubTitle>
          <Desc>
            Renders EtInput container with defaultValue and error injected from context. Props value, defaultValue, and error are managed — do not
            pass them manually.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'type',
                type: '"text" | "password" | "email" | "number" | "phone"',
                default: '"text"',
                description: 'Input type — controls keyboard and password toggle',
              },
              {
                prop: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disables the input',
              },
              {
                prop: 'readonly',
                type: 'boolean',
                default: 'false',
                description: 'Makes the input read-only',
              },
              {
                prop: 'maxLength',
                type: 'number',
                default: '-',
                description: 'Maximum character length',
              },
              {
                prop: 'showCharCounter',
                type: 'boolean',
                default: 'false',
                description: 'Show character counter (requires maxLength)',
              },
              {
                prop: 'style',
                type: 'StyleProp<ViewStyle>',
                default: '-',
                description: 'Container style override',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtFormInput.Field</SubTitle>
          <Desc>
            The native TextInput auto-bound to RHF. Connects onChangeText, onBlur, and ref from the form field context. Place inside
            EtFormInput.Control.
          </Desc>
          <PropsTable
            data={[
              {
                prop: 'placeholder',
                type: 'string',
                default: '-',
                description: 'Placeholder text',
              },
              {
                prop: 'keyboardType',
                type: 'KeyboardTypeOptions',
                default: '"default"',
                description: 'Native keyboard type',
              },
              {
                prop: 'autoCapitalize',
                type: '"none" | "sentences" | "words" | "characters"',
                default: '"sentences"',
                description: 'Auto-capitalisation behaviour',
              },
              {
                prop: 'onChangeText',
                type: '(text: string) => void',
                default: '-',
                description: 'Custom handler composed with RHF onChange — both run on each keystroke',
              },
              {
                prop: 'onBlur',
                type: '() => void',
                default: '-',
                description: 'Custom handler composed with RHF onBlur — both run when the field loses focus',
              },
              {
                prop: 'ref',
                type: 'Ref<TextInput>',
                default: '-',
                description: 'Optional external ref — merged with RHF ref',
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
          <SubTitle>EtFormInput.ErrorMessage</SubTitle>
          <Desc>Renders validation error text. Returns null when no error. Can be placed anywhere within the EtFormInput provider boundary.</Desc>
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
          <SubTitle>EtFormInput.Label / TextAdornment / IconAdornment</SubTitle>
          <Desc>Re-exported directly from EtInput — identical API, no changes needed. See EtInput stories for full documentation.</Desc>
        </Section>
      </Page>
    );
  },
};
