import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { EtIllustration, EtText, ILLUSTRATION_META, ILLUSTRATION_NAMES, type IllustrationName } from 'etoro-ui';

import { CodeBlock, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title, useTheme } from '../../utils/storybook-template';

const FIGMA_URL = 'https://www.figma.com/design/dbI2fqZ3Gngs1PWBawWEXu/Illustrations---Images---2026?node-id=226-36472&m=dev';

type Story = StoryObj<typeof EtIllustration>;

const meta: Meta<typeof EtIllustration> = {
  title: 'eToro-UI/Components/Illustration/EtIllustration',
  component: EtIllustration,
  parameters: {
    notes: `DS illustrations loaded from CDN (light/dark, PNG or SVG per asset). Figma: ${FIGMA_URL}`,
  },
};

export default meta;

/** Gallery cell: default-size illustration plus `name · size` caption. */
function IllustrationCell({ name }: { name: IllustrationName }) {
  const { c } = useTheme();
  const { defaultSize } = ILLUSTRATION_META[name];

  return (
    <View style={{ width: 200, gap: 8, alignItems: 'center' }}>
      <EtIllustration name={name} />
      <EtText variant="body-tiny-regular" style={{ color: c.textMuted, textAlign: 'center' }}>
        {`${name} · ${defaultSize}`}
      </EtText>
    </View>
  );
}

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>
          Name-based API similar to EtIcon. Theme follows the app light/dark by default — use the Storybook theme switcher to preview both. Pass
          `theme` only when you need to force a specific asset.
        </Desc>
        <Preview>
          <EtIllustration name="error" size="m" />
        </Preview>
        <CodeBlock
          code={`import { EtIllustration } from 'etoro-ui';

<EtIllustration name="error" size="m" />
<EtIllustration name="error" size="m" theme="dark" />`}
        />
      </Section>
    </Page>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Sizes</Title>
        <Desc>
          By default `size` scales the base asset to fit the token box (s 124×124, m 152×152, xl 375×158, xxl 375×230); aspect ratio is preserved.
          Same `coupon` illustration below, rendered at each size.
        </Desc>
        <Row wrap gap={24}>
          {(['s', 'm', 'xl', 'xxl'] as const).map((size) => (
            <View key={size} style={{ alignItems: 'center', gap: 8 }}>
              <EtIllustration name="coupon" size={size} />
              <Label>{`coupon · ${size}`}</Label>
            </View>
          ))}
        </Row>
      </Section>
      <Section>
        <Title>Size-specific variants (XL art)</Title>
        <Desc>
          Some illustrations ship a dedicated XL layout — a different drawing, not a scaled base — rendered at its own intrinsic size. The status set
          uses a wide ~375×158 banner. Passing `size="xl"` loads that variant. Compare `m` (top) vs `xl` (bottom).
        </Desc>
        {(['error', 'success', 'connection_error', 'warning', 'pending'] as const).map((name) => (
          <View key={name} style={{ gap: 8 }}>
            <Label>{name}</Label>
            <Row wrap gap={24}>
              <EtIllustration name={name} size="m" />
              <EtIllustration name={name} size="xl" />
            </Row>
          </View>
        ))}
      </Section>
    </Page>
  ),
};

export const LightAndDark: Story = {
  /** Side-by-side light and dark assets using an explicit `theme` override. */
  render: function LightAndDarkStory() {
    return (
      <Page>
        <Section>
          <Title>Light and dark</Title>
          <Desc>Optional `theme` override for side-by-side comparison. Omit it and the illustration follows the app theme.</Desc>
          <Row wrap gap={32}>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <EtIllustration name="magnifying_glass" size="m" theme="light" />
              <Label>light</Label>
            </View>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <EtIllustration name="magnifying_glass" size="m" theme="dark" />
              <Label>dark</Label>
            </View>
          </Row>
          <CodeBlock
            code={`<EtIllustration name="magnifying_glass" size="m" theme="light" />
<EtIllustration name="magnifying_glass" size="m" theme="dark" />`}
          />
        </Section>
      </Page>
    );
  },
};

export const Gallery: Story = {
  /** Every registered illustration at its Figma default size. */
  render: function GalleryStory() {
    return (
      <Page>
        <Section>
          <Title>Gallery</Title>
          <Desc>{`All registered illustrations (${ILLUSTRATION_NAMES.length} names). Figma: ${FIGMA_URL}`}</Desc>
        </Section>
        <Section>
          <Row wrap gap={24}>
            {ILLUSTRATION_NAMES.map((name) => (
              <IllustrationCell key={name} name={name} />
            ))}
          </Row>
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
        <SubTitle>EtIllustration</SubTitle>
        <Desc>Renders a Design System illustration asset (SVG or PNG) for the current (or forced) theme.</Desc>
        <PropsTable
          data={[
            { prop: 'name', type: 'IllustrationName', default: 'required' },
            { prop: 'size', type: '"s" | "m" | "xl" | "xxl"', default: 'Figma native size' },
            { prop: 'theme', type: '"light" | "dark"', default: 'app theme' },
            { prop: 'width', type: 'number', default: '-' },
            { prop: 'height', type: 'number', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: 'name' },
          ]}
        />
      </Section>
    </Page>
  ),
};
