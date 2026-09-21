import type { Meta, StoryObj } from '@storybook/react-native';
import { EtBanner, EtButton, EtLink } from 'etoro-ui';
import { View } from 'react-native';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtBanner>;

const meta: Meta<typeof EtBanner> = {
  title: 'eToro-UI/Components/Feedback/EtBanner',
  component: EtBanner,
  parameters: {
    notes: 'Inline promo/info banner with optional button, link, illustration, and dismiss.',
  },
};

export default meta;

const SAMPLE_DESCRIPTION = 'Apple Inc. is a technology company that engages in the design, manufacturing, and marketing of.';

const ILLUSTRATION_SIZE = {
  small: { width: 72, minHeight: 72 },
  medium: { width: 96, minHeight: 104 },
  large: { width: 112, minHeight: 144 },
} as const;

/** Storybook-only dashed preview child — not part of the kit API. */
function IllustrationPlaceholder({ size = 'medium' }: { size?: keyof typeof ILLUSTRATION_SIZE }) {
  const { c } = useTheme();
  return (
    <View
      style={[
        ILLUSTRATION_SIZE[size],
        {
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: c.border,
          backgroundColor: c.bgMuted,
          alignSelf: 'stretch',
          width: '100%',
        },
      ]}
    />
  );
}

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>Title, description, and dismiss — the simplest Banner variant.</Desc>
        <Preview>
          <EtBanner onClose={() => undefined}>
            <EtBanner.Title>Title</EtBanner.Title>
            <EtBanner.Description>{SAMPLE_DESCRIPTION}</EtBanner.Description>
          </EtBanner>
        </Preview>
        <CodeBlock
          code={`import { EtBanner } from 'etoro-ui';

<EtBanner onClose={handleClose}>
  <EtBanner.Title>Title</EtBanner.Title>
  <EtBanner.Description>
    Apple Inc. is a technology company that engages in the design, manufacturing, and marketing of.
  </EtBanner.Description>
</EtBanner>`}
        />
      </Section>
    </Page>
  ),
};

export const Variants: Story = {
  render: function VariantsStory() {
    return (
      <Page>
        <Section>
          <Title>Variants</Title>
          <Desc>Figma Banner matrix: link, button, and illustration combinations.</Desc>

          <Col gap={16}>
            <Col gap={8}>
              <Label>Title + description + close</Label>
              <Preview>
                <EtBanner onClose={() => undefined}>
                  <EtBanner.Title>Title</EtBanner.Title>
                  <EtBanner.Description>{SAMPLE_DESCRIPTION}</EtBanner.Description>
                </EtBanner>
              </Preview>
            </Col>

            <Col gap={8}>
              <Label>With link</Label>
              <Preview>
                <EtBanner onClose={() => undefined}>
                  <EtBanner.Title>Title</EtBanner.Title>
                  <EtBanner.Description>{SAMPLE_DESCRIPTION}</EtBanner.Description>
                  <EtBanner.Actions>
                    <EtLink size="small" onPress={() => undefined}>
                      <EtLink.Label>Label</EtLink.Label>
                      <EtLink.Icon name="chevronRight" />
                    </EtLink>
                  </EtBanner.Actions>
                </EtBanner>
              </Preview>
            </Col>

            <Col gap={8}>
              <Label>With link + illustration</Label>
              <Preview>
                <EtBanner onClose={() => undefined}>
                  <EtBanner.Title>Title</EtBanner.Title>
                  <EtBanner.Description>{SAMPLE_DESCRIPTION}</EtBanner.Description>
                  <EtBanner.Actions>
                    <EtLink size="small" onPress={() => undefined}>
                      <EtLink.Label>Label</EtLink.Label>
                      <EtLink.Icon name="chevronRight" />
                    </EtLink>
                  </EtBanner.Actions>
                  <EtBanner.Illustration size="medium">
                    <IllustrationPlaceholder size="medium" />
                  </EtBanner.Illustration>
                </EtBanner>
              </Preview>
            </Col>

            <Col gap={8}>
              <Label>With button</Label>
              <Preview>
                <EtBanner onClose={() => undefined}>
                  <EtBanner.Title>Title</EtBanner.Title>
                  <EtBanner.Description>{SAMPLE_DESCRIPTION}</EtBanner.Description>
                  <EtBanner.Actions>
                    <EtButton size="tiny" variant="primary-filled" onPress={() => undefined}>
                      Label
                    </EtButton>
                  </EtBanner.Actions>
                </EtBanner>
              </Preview>
            </Col>

            <Col gap={8}>
              <Label>With button + small illustration</Label>
              <Preview>
                <EtBanner onClose={() => undefined}>
                  <EtBanner.Title>Title</EtBanner.Title>
                  <EtBanner.Description>{SAMPLE_DESCRIPTION}</EtBanner.Description>
                  <EtBanner.Actions>
                    <EtButton size="tiny" variant="primary-filled" onPress={() => undefined}>
                      Label
                    </EtButton>
                  </EtBanner.Actions>
                  <EtBanner.Illustration size="small">
                    <IllustrationPlaceholder size="small" />
                  </EtBanner.Illustration>
                </EtBanner>
              </Preview>
            </Col>

            <Col gap={8}>
              <Label>With button + large illustration</Label>
              <Preview>
                <EtBanner onClose={() => undefined}>
                  <EtBanner.Title>Title</EtBanner.Title>
                  <EtBanner.Description>{SAMPLE_DESCRIPTION}</EtBanner.Description>
                  <EtBanner.Actions>
                    <EtButton size="tiny" variant="primary-filled" onPress={() => undefined}>
                      Label
                    </EtButton>
                  </EtBanner.Actions>
                  <EtBanner.Illustration size="large">
                    <IllustrationPlaceholder size="large" />
                  </EtBanner.Illustration>
                </EtBanner>
              </Preview>
            </Col>
          </Col>

          <CodeBlock
            code={`import { EtBanner, EtButton, EtLink } from 'etoro-ui';
import { Image } from 'react-native';

<EtBanner onClose={handleClose}>
  <EtBanner.Title>Title</EtBanner.Title>
  <EtBanner.Description>Supporting copy.</EtBanner.Description>
  <EtBanner.Actions>
    <EtButton size="tiny" variant="primary-filled" onPress={onCta}>
      Label
    </EtButton>
    <EtLink size="small" onPress={onLink}>
      <EtLink.Label>Label</EtLink.Label>
      <EtLink.Icon name="chevronRight" />
    </EtLink>
  </EtBanner.Actions>
  <EtBanner.Illustration size="large">
    <Image source={art} style={{ width: 112, height: 144 }} />
  </EtBanner.Illustration>
</EtBanner>`}
          />
        </Section>
      </Page>
    );
  },
};

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtBanner</SubTitle>
        <Desc>Root banner container. Compose with Title, Description, Actions, and Illustration.</Desc>
        <PropsTable
          data={[
            { prop: 'onClose', type: '() => void', default: '-' },
            { prop: 'closeAccessibilityLabel', type: 'string', default: '"Close"' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
            { prop: 'children', type: 'EtBannerChildren', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtBanner.Illustration</SubTitle>
        <Desc>Trailing side-art slot. Pass art as children; omit children to render nothing.</Desc>
        <PropsTable
          data={[
            { prop: 'size', type: '"small" | "medium" | "large"', default: '"medium"' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'children', type: 'ReactNode', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};
