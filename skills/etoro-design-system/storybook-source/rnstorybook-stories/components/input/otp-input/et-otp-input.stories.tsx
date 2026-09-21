import type { Meta, StoryObj } from '@storybook/react-native';
import { EtOtpInput } from 'etoro-ui/components/input/otp-input';
import { useState } from 'react';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtOtpInput>;

const meta: Meta<typeof EtOtpInput> = {
  title: 'eToro-UI/Components/Input/EtOtpInput',
  component: EtOtpInput,
};

export default meta;

// =============================================================================
// 1. BASIC — Simplest usage
// =============================================================================

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>OTP / PIN code input with auto-resolved cell sizes (2–9 digits).</Desc>
        <Preview>
          <EtOtpInput length={6} />
        </Preview>
        <CodeBlock
          code={`import { EtOtpInput } from 'etoro-ui';

<EtOtpInput length={6} onComplete={handleComplete} />`}
        />
      </Section>
    </Page>
  ),
};

// =============================================================================
// 2. SIZES — Auto-resolved from length
// =============================================================================

export const Sizes: Story = {
  name: '2. Sizes',
  render: () => (
    <Page>
      <Section>
        <Title>Auto-Resolved Sizes</Title>
        <Desc>
          Cell size follows Figma phone digits: 2–3 digits → m, 4–6 → s, 7–9 → xs. Pass size=&quot;m&quot; | &quot;s&quot; | &quot;xs&quot; to
          override auto sizing (e.g. 9 digits with s cells).
        </Desc>

        <SubTitle>m — length 3 (60×68)</SubTitle>
        <Preview>
          <EtOtpInput length={3} defaultValue="123" secureEntry>
            <EtOtpInput.Toggle />
          </EtOtpInput>
        </Preview>
        <Label>60 x 68px cells</Label>

        <SubTitle>s — length 6 (48×52)</SubTitle>
        <Preview>
          <EtOtpInput length={6} defaultValue="123456" secureEntry>
            <EtOtpInput.Toggle />
          </EtOtpInput>
        </Preview>
        <Label>48 x 52px cells</Label>

        <SubTitle>xs — length 9 (32×52)</SubTitle>
        <Preview>
          <EtOtpInput length={9} defaultValue="123456789" secureEntry>
            <EtOtpInput.Toggle />
          </EtOtpInput>
        </Preview>
        <Label>32 x 52px cells</Label>
      </Section>
    </Page>
  ),
};

// =============================================================================
// 3. STATES — Default, Filled, Error, Error + Message, Disabled
// =============================================================================

export const States: Story = {
  name: '3. States',
  render: () => (
    <Page>
      <Section>
        <Title>States</Title>
        <Desc>All visual states using 6-digit (medium) cells.</Desc>

        <SubTitle>Empty (default)</SubTitle>
        <Preview>
          <EtOtpInput length={6} />
        </Preview>

        <SubTitle>Filled</SubTitle>
        <Preview>
          <EtOtpInput length={6} defaultValue="987654" />
        </Preview>

        <SubTitle>Error</SubTitle>
        <Preview>
          <EtOtpInput length={6} defaultValue="1234" error />
        </Preview>

        <SubTitle>Error + Error Message</SubTitle>
        <Preview>
          <EtOtpInput length={6} defaultValue="1234" error>
            <EtOtpInput.ErrorMessage>Invalid verification code</EtOtpInput.ErrorMessage>
          </EtOtpInput>
        </Preview>

        <SubTitle>Disabled</SubTitle>
        <Preview>
          <EtOtpInput length={6} defaultValue="123456" disabled />
        </Preview>
      </Section>
    </Page>
  ),
};

// =============================================================================
// 4. SECURE ENTRY — Toggle
// =============================================================================

export const SecureEntry: Story = {
  name: '4. Secure Entry',
  render: () => (
    <Page>
      <Section>
        <Title>Secure Entry + Toggle</Title>
        <Desc>Tap the eye icon to toggle visibility.</Desc>

        <SubTitle>6-digit + Toggle</SubTitle>
        <Preview>
          <EtOtpInput length={6} defaultValue="987654" secureEntry>
            <EtOtpInput.Toggle />
          </EtOtpInput>
        </Preview>

        <SubTitle>Error + Secure + Toggle + Error Message</SubTitle>
        <Preview>
          <EtOtpInput length={6} defaultValue="987654" secureEntry error>
            <EtOtpInput.Toggle />
            <EtOtpInput.ErrorMessage>The code you entered is incorrect</EtOtpInput.ErrorMessage>
          </EtOtpInput>
        </Preview>

        <CodeBlock
          code={`import { EtOtpInput } from 'etoro-ui';

<EtOtpInput length={6} secureEntry onComplete={handleComplete}>
  <EtOtpInput.Toggle />
</EtOtpInput>`}
        />
      </Section>
    </Page>
  ),
};

// =============================================================================
// 5. ERROR MESSAGE — Variations
// =============================================================================

export const ErrorMessages: Story = {
  name: '5. Error Message',
  render: () => (
    <Page>
      <Section>
        <Title>Error Message</Title>
        <Desc>Consumer-controlled error message below cells.</Desc>

        <SubTitle>Error + Message</SubTitle>
        <Preview>
          <EtOtpInput length={6} defaultValue="1234" error>
            <EtOtpInput.ErrorMessage>Invalid verification code</EtOtpInput.ErrorMessage>
          </EtOtpInput>
        </Preview>

        <SubTitle>Long error text (wrapping)</SubTitle>
        <Preview>
          <EtOtpInput length={4} defaultValue="9999" error>
            <EtOtpInput.ErrorMessage>
              The verification code you entered is invalid. Please check your SMS and try again. If you did not receive a code, tap Resend.
            </EtOtpInput.ErrorMessage>
          </EtOtpInput>
        </Preview>
      </Section>
    </Page>
  ),
};

// =============================================================================
// 6. INTERACTIVE — Live validation demo
// =============================================================================

export const Interactive: Story = {
  name: '6. Interactive',
  render: function InteractiveStory() {
    const [value, setValue] = useState('');
    const [hasError, setHasError] = useState(false);

    const handleComplete = (code: string) => {
      if (code !== '123456') {
        setHasError(true);
      } else {
        setHasError(false);
      }
    };

    const handleChange = (text: string) => {
      setValue(text);
      if (hasError) setHasError(false);
    };

    return (
      <Page>
        <Section>
          <Title>Interactive</Title>
          <Desc>Type any 6-digit code. Entering anything except 123456 triggers an error. Editing clears it.</Desc>
          <Preview>
            <Col gap={8}>
              <EtOtpInput length={6} value={value} onChangeText={handleChange} onComplete={handleComplete} error={hasError} autoFocus>
                {hasError && <EtOtpInput.ErrorMessage>Wrong code. Please try again.</EtOtpInput.ErrorMessage>}
              </EtOtpInput>
              <Label>Value: {value || '(empty)'}</Label>
            </Col>
          </Preview>
        </Section>
      </Page>
    );
  },
};

// =============================================================================
// 7. LENGTHS — Different cell counts
// =============================================================================

export const Lengths: Story = {
  name: '7. Lengths',
  render: () => (
    <Page>
      <Section>
        <Title>Lengths</Title>
        <Desc>Configurable from 2 to 9 cells. Size auto-resolves.</Desc>

        <SubTitle>2 digits (large)</SubTitle>
        <Preview>
          <EtOtpInput length={2} />
        </Preview>

        <SubTitle>3 digits (large)</SubTitle>
        <Preview>
          <EtOtpInput length={3} />
        </Preview>

        <SubTitle>4 digits (medium)</SubTitle>
        <Preview>
          <EtOtpInput length={4} />
        </Preview>

        <SubTitle>6 digits (medium)</SubTitle>
        <Preview>
          <EtOtpInput length={6} />
        </Preview>

        <SubTitle>8 digits (small)</SubTitle>
        <Preview>
          <EtOtpInput length={8} />
        </Preview>

        <SubTitle>9 digits (small)</SubTitle>
        <Preview>
          <EtOtpInput length={9} />
        </Preview>
      </Section>
    </Page>
  ),
};

// =============================================================================
// 8. API REFERENCE
// =============================================================================

export const APIReference: Story = {
  name: '8. API Reference',
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtOtpInput</SubTitle>
        <Desc>Root compound component.</Desc>
        <PropsTable
          data={[
            { prop: 'length', type: 'number', default: '-' },
            { prop: 'value', type: 'string', default: '-' },
            { prop: 'defaultValue', type: 'string', default: '-' },
            {
              prop: 'onChangeText',
              type: '(text: string) => void',
              default: '-',
            },
            {
              prop: 'onComplete',
              type: '(code: string) => void',
              default: '-',
            },
            { prop: 'error', type: 'boolean', default: 'false' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'secureEntry', type: 'boolean', default: 'false' },
            { prop: 'autoFocus', type: 'boolean', default: 'false' },
            { prop: 'haptics', type: 'boolean', default: 'true' },
            {
              prop: 'keyboardType',
              type: 'KeyboardTypeOptions',
              default: '"number-pad"',
            },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            {
              prop: 'size',
              type: "'xs' | 's' | 'm' | 'small' | 'medium' | 'large'",
              default: 'auto from length',
            },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtOtpInput.Toggle</SubTitle>
        <Desc>Show/hide toggle for secure entry. Must be inside EtOtpInput.</Desc>
        <PropsTable
          data={[
            {
              prop: 'accessibilityLabel',
              type: 'string',
              default: '"Show code" / "Hide code"',
            },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtOtpInput.ErrorMessage</SubTitle>
        <Desc>Error message below cells. Must be inside EtOtpInput.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};
