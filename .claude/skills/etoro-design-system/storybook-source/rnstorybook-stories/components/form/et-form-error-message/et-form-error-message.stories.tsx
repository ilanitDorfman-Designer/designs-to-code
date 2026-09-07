import type { Meta, StoryObj } from '@storybook/react-native';
import { EtFormCheckbox, EtFormErrorMessage, FormProvider, useForm } from 'etoro-ui/form';
import { Text, View } from 'react-native';
import { CodeBlock, Desc, Divider, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<{}>;

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Form/EtFormErrorMessage',
};

export default meta;

export const EtFormErrorMessageDocs: Story = {
  name: 'EtFormErrorMessage',
  render: function EtFormErrorMessageDocsStory() {
    const modeFirstMethods = useForm({
      defaultValues: { agree: false, notify: false },
      mode: 'onBlur',
    });
    const modeAllMethods = useForm({
      defaultValues: { agree2: false, notify2: false },
      mode: 'onBlur',
    });
    const customRenderMethods = useForm({
      defaultValues: { agree3: false },
      mode: 'onBlur',
    });

    return (
      <Page>
        <Section>
          <Title>EtFormErrorMessage</Title>
          <Desc>Wraps multiple fields and aggregates their errors into one shared display block. Requires FormProvider as an ancestor.</Desc>
        </Section>

        <Divider />

        <Section>
          <SubTitle>mode="first"</SubTitle>
          <Desc>Wraps multiple fields under one shared error block. Only the first error is shown. Tap Submit without checking anything.</Desc>
          <Preview>
            <FormProvider {...modeFirstMethods}>
              <EtFormErrorMessage names={['agree', 'notify']}>
                <EtFormCheckbox
                  name="agree"
                  control={modeFirstMethods.control}
                  rules={{
                    validate: (v) => Boolean(v) || 'You must agree to terms',
                  }}
                >
                  <EtFormCheckbox.Control>
                    <EtFormCheckbox.Label>I agree to terms</EtFormCheckbox.Label>
                  </EtFormCheckbox.Control>
                </EtFormCheckbox>

                <View style={{ marginBottom: 8 }}></View>

                <EtFormCheckbox
                  name="notify"
                  control={modeFirstMethods.control}
                  rules={{
                    validate: (v) => Boolean(v) || 'Notification consent required',
                  }}
                >
                  <EtFormCheckbox.Control>
                    <EtFormCheckbox.Label>I agree to notifications</EtFormCheckbox.Label>
                  </EtFormCheckbox.Control>
                </EtFormCheckbox>

                <EtFormErrorMessage.Text mode="first" />
              </EtFormErrorMessage>

              <Text onPress={modeFirstMethods.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                Submit
              </Text>
            </FormProvider>
          </Preview>
          <CodeBlock
            code={`import { useForm, FormProvider, EtFormCheckbox, EtFormErrorMessage } from 'etoro-ui/form';

const methods = useForm({ defaultValues: { agree: false, notify: false }, mode: 'onBlur' });
const { control, handleSubmit } = methods;

<FormProvider {...methods}>
  <EtFormErrorMessage names={['agree', 'notify']}>
    <EtFormCheckbox name="agree" control={control} rules={{ validate: v => Boolean(v) || 'Required' }}>
      <EtFormCheckbox.Control>
        <EtFormCheckbox.Label>I agree to terms</EtFormCheckbox.Label>
      </EtFormCheckbox.Control>
    </EtFormCheckbox>

    <EtFormCheckbox name="notify" control={control} rules={{ validate: v => Boolean(v) || 'Required' }}>
      <EtFormCheckbox.Control>
        <EtFormCheckbox.Label>I agree to notifications</EtFormCheckbox.Label>
      </EtFormCheckbox.Control>
    </EtFormCheckbox>

    <EtFormErrorMessage.Text mode="first" />
  </EtFormErrorMessage>
</FormProvider>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>mode="all"</SubTitle>
          <Desc>All errors from all named fields are shown stacked. Tap Submit to trigger both.</Desc>
          <Preview>
            <FormProvider {...modeAllMethods}>
              <EtFormErrorMessage names={['agree2', 'notify2']}>
                <EtFormCheckbox
                  name="agree2"
                  control={modeAllMethods.control}
                  rules={{
                    validate: (v) => Boolean(v) || 'You must agree to terms',
                  }}
                >
                  <EtFormCheckbox.Control>
                    <EtFormCheckbox.Label>I agree to terms</EtFormCheckbox.Label>
                  </EtFormCheckbox.Control>
                </EtFormCheckbox>

                <View style={{ marginBottom: 8 }}></View>

                <EtFormCheckbox
                  name="notify2"
                  control={modeAllMethods.control}
                  rules={{
                    validate: (v) => Boolean(v) || 'Notification consent required',
                  }}
                >
                  <EtFormCheckbox.Control>
                    <EtFormCheckbox.Label>I agree to notifications</EtFormCheckbox.Label>
                  </EtFormCheckbox.Control>
                </EtFormCheckbox>

                <EtFormErrorMessage.Text mode="all" />
              </EtFormErrorMessage>

              <Text onPress={modeAllMethods.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                Submit
              </Text>
            </FormProvider>
          </Preview>
          <CodeBlock
            code={`<EtFormErrorMessage names={['agree', 'notify']}>
  {/* fields */}
  <EtFormErrorMessage.Text mode="all" />
</EtFormErrorMessage>`}
          />
        </Section>

        <Divider />

        <Section>
          <SubTitle>Custom render prop</SubTitle>
          <Desc>Use the render prop to fully control how errors are displayed.</Desc>
          <Preview>
            <FormProvider {...customRenderMethods}>
              <EtFormErrorMessage names={['agree3']}>
                <EtFormCheckbox
                  name="agree3"
                  control={customRenderMethods.control}
                  rules={{
                    validate: (v) => Boolean(v) || 'Terms must be accepted',
                  }}
                >
                  <EtFormCheckbox.Control>
                    <EtFormCheckbox.Label>I agree</EtFormCheckbox.Label>
                  </EtFormCheckbox.Control>
                </EtFormCheckbox>

                <EtFormErrorMessage.Text
                  render={({ errors }) => <Text style={{ color: 'orange', marginTop: 8 }}>Custom: {errors.map((e) => e.message).join(', ')}</Text>}
                />
              </EtFormErrorMessage>

              <Text onPress={customRenderMethods.handleSubmit(() => {})} style={{ marginTop: 16, color: '#00C176' }}>
                Submit
              </Text>
            </FormProvider>
          </Preview>
          <CodeBlock
            code={`<EtFormErrorMessage.Text
  render={({ errors }) => (
    <Text style={{ color: 'orange' }}>
      {errors.map(e => e.message).join(', ')}
    </Text>
  )}
/>`}
          />
        </Section>

        <Divider />

        <Section>
          <Title>API Reference</Title>
        </Section>

        <Section>
          <SubTitle>EtFormErrorMessage</SubTitle>
          <Desc>Wraps multiple fields and aggregates their errors into a shared display. Requires FormProvider as an ancestor.</Desc>
          <PropsTable
            data={[
              {
                prop: 'names',
                type: 'string[]',
                default: '-',
                description: 'Field names (or dot-notation paths) whose errors are aggregated',
              },
              {
                prop: 'children',
                type: 'ReactNode',
                default: '-',
                description: 'Fields and EtFormErrorMessage.Text placed anywhere within',
              },
            ]}
          />
        </Section>

        <Section>
          <SubTitle>EtFormErrorMessage.Text</SubTitle>
          <Desc>Renders the aggregated error text. Returns null when no errors exist.</Desc>
          <PropsTable
            data={[
              {
                prop: 'mode',
                type: '"first" | "all"',
                default: '"first"',
                description: 'Show only first error or all errors stacked',
              },
              {
                prop: 'render',
                type: '(props: { errors: FieldErrorEntry[] }) => ReactNode',
                default: '-',
                description: 'Custom render function — overrides default text rendering',
              },
              {
                prop: 'style',
                type: 'StyleProp<TextStyle>',
                default: '-',
                description: 'Style applied to each error text',
              },
              {
                prop: 'containerStyle',
                type: 'StyleProp<ViewStyle>',
                default: '-',
                description: 'Style applied to the outer container View',
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
