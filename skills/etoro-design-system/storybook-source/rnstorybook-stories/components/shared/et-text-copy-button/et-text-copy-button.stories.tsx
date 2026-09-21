import type { Meta, StoryObj } from '@storybook/react-native';
import { action } from 'storybook/actions';
import { EtTextCopyButton } from 'etoro-ui';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtTextCopyButton>;

const meta: Meta<typeof EtTextCopyButton> = {
  title: 'eToro-UI/Components/Shared/EtTextCopyButton',
  component: EtTextCopyButton,
};

export default meta;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>A button that copies text to the clipboard, shows a checkmark icon for 2 seconds after copying, and provides haptic feedback.</Desc>
        <Preview>
          <EtTextCopyButton textToCopy="123456789">
            <EtTextCopyButton.Icon />
            <EtTextCopyButton.Text>123456789</EtTextCopyButton.Text>
          </EtTextCopyButton>
        </Preview>
        <CodeBlock
          code={`import { EtTextCopyButton } from 'etoro-ui';

<EtTextCopyButton textToCopy="123456789">
  <EtTextCopyButton.Icon />
  <EtTextCopyButton.Text>123456789</EtTextCopyButton.Text>
</EtTextCopyButton>`}
        />
      </Section>
    </Page>
  ),
};

export const StringShorthand: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>String Shorthand</Title>
        <Desc>You can pass a string as children and it will automatically wrap with Icon and Text components.</Desc>
        <Preview>
          <Col gap={16}>
            <EtTextCopyButton textToCopy="Tal Ben Simon">Tal Ben Simon</EtTextCopyButton>
            <EtTextCopyButton textToCopy="john.doe@example.com">john.doe@example.com</EtTextCopyButton>
            <EtTextCopyButton textToCopy="12-45-78">12-45-78</EtTextCopyButton>
          </Col>
        </Preview>
        <CodeBlock
          code={`import { EtTextCopyButton } from 'etoro-ui';

<EtTextCopyButton textToCopy="Tal Ben Simon">
  Tal Ben Simon
</EtTextCopyButton>

<EtTextCopyButton textToCopy="john.doe@example.com">
  john.doe@example.com
</EtTextCopyButton>

<EtTextCopyButton textToCopy="12-45-78">
  12-45-78
</EtTextCopyButton>`}
        />
      </Section>
    </Page>
  ),
};

export const WithCallbacks: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>With analytics</Title>
        <Desc>The component handles copying internally. Use afterCopy for success analytics and onError for failure analytics.</Desc>
        <Preview>
          <EtTextCopyButton textToCopy="Tracking example" afterCopy={action('afterCopy')} onError={action('onError')}>
            <EtTextCopyButton.Icon />
            <EtTextCopyButton.Text>Copy with analytics</EtTextCopyButton.Text>
          </EtTextCopyButton>
        </Preview>
        <CodeBlock
          code={`import { EtTextCopyButton } from 'etoro-ui';

<EtTextCopyButton
  textToCopy="Tracking example"
  afterCopy={() => trackSuccess('copy_account_field')}
  onError={(err) => trackFailure('copy_account_field', err)}
>
  <EtTextCopyButton.Icon />
  <EtTextCopyButton.Text>Copy with analytics</EtTextCopyButton.Text>
</EtTextCopyButton>`}
        />
      </Section>
    </Page>
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Custom Success Duration</Title>
        <Desc>Control how long the checkmark is shown after copying. Default is 2000ms (2 seconds).</Desc>
        <Preview>
          <Col gap={16}>
            <Row gap={16}>
              <Col gap={4}>
                <EtTextCopyButton textToCopy="Quick feedback" successDuration={500}>
                  Quick (500ms)
                </EtTextCopyButton>
                <Label>Checkmark shows for 0.5s</Label>
              </Col>
              <Col gap={4}>
                <EtTextCopyButton textToCopy="Default feedback" successDuration={2000}>
                  Default (2s)
                </EtTextCopyButton>
                <Label>Checkmark shows for 2s</Label>
              </Col>
              <Col gap={4}>
                <EtTextCopyButton textToCopy="Long feedback" successDuration={5000}>
                  Long (5s)
                </EtTextCopyButton>
                <Label>Checkmark shows for 5s</Label>
              </Col>
            </Row>
          </Col>
        </Preview>
        <CodeBlock
          code={`import { EtTextCopyButton } from 'etoro-ui';

<EtTextCopyButton textToCopy="Quick feedback" successDuration={500}>
  Quick (500ms)
</EtTextCopyButton>

<EtTextCopyButton textToCopy="Long feedback" successDuration={5000}>
  Long (5s)
</EtTextCopyButton>`}
        />
      </Section>
    </Page>
  ),
};

export const WithoutHaptics: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Without Haptics</Title>
        <Desc>Disable haptic feedback by setting haptics to false. Useful for accessibility or when haptics might be disruptive.</Desc>
        <Preview>
          <EtTextCopyButton textToCopy="Silent copy" haptics={false}>
            <EtTextCopyButton.Icon />
            <EtTextCopyButton.Text>No haptic feedback</EtTextCopyButton.Text>
          </EtTextCopyButton>
        </Preview>
        <CodeBlock
          code={`import { EtTextCopyButton } from 'etoro-ui';

<EtTextCopyButton textToCopy="Silent copy" haptics={false}>
  <EtTextCopyButton.Icon />
  <EtTextCopyButton.Text>No haptic feedback</EtTextCopyButton.Text>
</EtTextCopyButton>`}
        />
      </Section>
    </Page>
  ),
};

export const RealWorldExamples: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Real World Examples</Title>
        <Desc>Common use cases for the copy button component.</Desc>
        <Preview>
          <Col gap={24}>
            <Col gap={8}>
              <Label>Account Number</Label>
              <EtTextCopyButton textToCopy="123456789">123456789</EtTextCopyButton>
            </Col>

            <Col gap={8}>
              <Label>Full Name</Label>
              <EtTextCopyButton textToCopy="Tal Ben Simon">Tal Ben Simon</EtTextCopyButton>
            </Col>

            <Col gap={8}>
              <Label>Sort Code</Label>
              <EtTextCopyButton textToCopy="12-45-78">12-45-78</EtTextCopyButton>
            </Col>

            <Col gap={8}>
              <Label>Email Address</Label>
              <EtTextCopyButton textToCopy="user@example.com">user@example.com</EtTextCopyButton>
            </Col>

            <Col gap={8}>
              <Label>Wallet Address</Label>
              <EtTextCopyButton textToCopy="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4">0x742d35Cc...95f0bEb4</EtTextCopyButton>
            </Col>
          </Col>
        </Preview>
        <CodeBlock
          code={`import { EtTextCopyButton } from 'etoro-ui';

<EtTextCopyButton textToCopy="123456789">
  123456789
</EtTextCopyButton>

<EtTextCopyButton textToCopy="Tal Ben Simon">
  Tal Ben Simon
</EtTextCopyButton>

<EtTextCopyButton textToCopy="12-45-78">
  12-45-78
</EtTextCopyButton>

<EtTextCopyButton
  textToCopy="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4"
>
  0x742d35Cc...95f0bEb4
</EtTextCopyButton>`}
        />
      </Section>
    </Page>
  ),
};

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtTextCopyButton</SubTitle>
        <Desc>Root component that copies text to the clipboard and provides context to subcomponents.</Desc>
        <PropsTable
          data={[
            {
              prop: 'textToCopy',
              type: 'string',
              default: '-',
              description: 'Text to copy to clipboard (required)',
            },
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Compound components or string (string auto-wraps with Icon + Text)',
            },
            {
              prop: 'onError',
              type: '(error: string) => void',
              default: '-',
              description: 'Callback invoked when copy fails with the error',
            },
            {
              prop: 'afterCopy',
              type: '() => void',
              default: '-',
              description: 'Callback invoked after successful copy',
            },
            {
              prop: 'successDuration',
              type: 'number',
              default: '2000',
              description: 'Duration to show success state in milliseconds',
            },
            {
              prop: 'haptics',
              type: 'boolean',
              default: 'true',
              description: 'Enable haptic feedback on copy',
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
              default: '"Copy {textToCopy}"',
              description: 'Accessibility label for screen readers',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTextCopyButton.Icon</SubTitle>
        <Desc>Icon subcomponent. Shows copy icon normally, filled checkmark when copied.</Desc>
        <PropsTable
          data={[
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '-',
              description: 'Optional style override',
            },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTextCopyButton.Text</SubTitle>
        <Desc>Text label subcomponent with theme-aware styling.</Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Text content',
            },
            {
              prop: 'style',
              type: 'StyleProp<TextStyle>',
              default: '-',
              description: 'Optional style override',
            },
          ]}
        />
      </Section>
    </Page>
  ),
};
