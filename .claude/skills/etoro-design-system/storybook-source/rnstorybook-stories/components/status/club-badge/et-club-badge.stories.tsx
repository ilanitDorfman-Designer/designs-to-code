import type { Meta, StoryObj } from '@storybook/react-native';
import { EtClubBadge } from 'etoro-ui';

import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtClubBadge>;

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtClubBadge> = {
  title: 'eToro-UI/Components/Status/EtClubBadge',
  component: EtClubBadge,
};

export default meta;

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>EtClubBadge</Title>
        <Desc>
          Small primary-bordered pill marking eToro Club gating or membership. Brand-fixed: the "Club" label, lock icon, and primary border color are
          not configurable — for arbitrary labels or colors, use EtBadge instead.
        </Desc>
        <Preview>
          <Row gap={24}>
            <Col>
              <EtClubBadge />
              <Label>without lock (default)</Label>
            </Col>
            <Col>
              <EtClubBadge showLock />
              <Label>with lock</Label>
            </Col>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtClubBadge } from 'etoro-ui';

// Without lock (default) — marking a Club member
<EtClubBadge />

// With lock — gating a Club-only feature
<EtClubBadge showLock />`}
        />
      </Section>

      <Section>
        <SubTitle>When to use which</SubTitle>
        <Desc>
          The lock variant signals "this content requires Club to access". The plain variant identifies an entity (user, item, account) as Club.
          Picking the right variant is a content-design call — both look the same except for the lock.
        </Desc>
      </Section>

      <Section>
        <SubTitle>Pinned color scheme</SubTitle>
        <Desc>
          By default the badge adapts to the active theme. Pass `colorScheme="light"` or `colorScheme="dark"` to pin it to one variant — useful when
          the surface behind the badge doesn't follow the app theme (always-dark hero cards, fixed-color banners, screenshot previews). The primary
          border is unchanged either way.
        </Desc>
        <Preview>
          <Row gap={24}>
            <Col>
              <EtClubBadge colorScheme="light" />
              <Label>colorScheme="light"</Label>
            </Col>
            <Col>
              <EtClubBadge showLock colorScheme="light" />
              <Label>colorScheme="light" + lock</Label>
            </Col>
            <Col>
              <EtClubBadge colorScheme="dark" />
              <Label>colorScheme="dark"</Label>
            </Col>
            <Col>
              <EtClubBadge showLock colorScheme="dark" />
              <Label>colorScheme="dark" + lock</Label>
            </Col>
          </Row>
        </Preview>
        <CodeBlock
          code={`// Always-dark hero card
<EtClubBadge showLock colorScheme="dark" />

// Always-light marketing banner
<EtClubBadge colorScheme="light" />`}
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
        <SubTitle>EtClubBadge</SubTitle>
        <Desc>Brand-fixed Club badge. Renders the literal "Club" label with an optional lock-fill icon prefix.</Desc>
        <PropsTable
          data={[
            {
              prop: 'showLock',
              type: 'boolean',
              default: 'false',
            },
            {
              prop: 'colorScheme',
              type: "'light' | 'dark'",
              default: '-',
            },
            {
              prop: 'accessibilityLabel',
              type: 'string',
              default: '"eToro Club member" | "eToro Club"',
            },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Tokens</SubTitle>
        <Desc>
          Border uses `colors.primary600`. When `colorScheme` is omitted (default), lock icon + label use `colors.carbon900` on a
          `colors.carbon900Inverted` fill — both adapt to the active theme. When `colorScheme` is set, the badge pins to the *static* carbon tokens
          (`carbonStatic900` / `carbonStatic050`) instead, so the variant stays the same regardless of theme.
        </Desc>
      </Section>
    </Page>
  ),
};
