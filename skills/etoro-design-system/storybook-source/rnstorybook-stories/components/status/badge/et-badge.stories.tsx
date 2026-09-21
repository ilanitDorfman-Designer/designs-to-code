import type { Meta, StoryObj } from '@storybook/react-native';
import { EtBadge } from 'etoro-ui';
import type { BadgeColor, BadgeSize } from '../../../../../libs/etoro-ui/src/components/status/badge/api/types';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtBadge>;

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const ALL_COLORS: BadgeColor[] = ['neutral', 'red', 'orange', 'yellow', 'green', 'mint', 'blue', 'purple', 'violet'];

const ALL_SIZES: BadgeSize[] = ['medium', 'small'];

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtBadge> = {
  title: 'eToro-UI/Components/Status/EtBadge',
  component: EtBadge,
};

export default meta;

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>A pill-shaped badge with a text label.</Desc>
        <Preview>
          <EtBadge color="green">
            <EtBadge.Label>New</EtBadge.Label>
          </EtBadge>
        </Preview>
        <CodeBlock
          code={`import { EtBadge } from 'etoro-ui';

<EtBadge color="green">
  <EtBadge.Label>New</EtBadge.Label>
</EtBadge>`}
        />
      </Section>
    </Page>
  ),
};

export const Colors: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Colors</Title>
        <Desc>EtBadge supports 9 color variants for different semantic meanings.</Desc>
        <Preview>
          <Row gap={12} wrap>
            {ALL_COLORS.map((color) => (
              <Col key={color}>
                <EtBadge color={color}>
                  <EtBadge.Label>{color.charAt(0).toUpperCase() + color.slice(1)}</EtBadge.Label>
                </EtBadge>
                <Label>{color}</Label>
              </Col>
            ))}
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtBadge } from 'etoro-ui';

// Neutral (default)
<EtBadge color="neutral">
  <EtBadge.Label>Neutral</EtBadge.Label>
</EtBadge>

// Semantic colors
<EtBadge color="green">
  <EtBadge.Label>Success</EtBadge.Label>
</EtBadge>

<EtBadge color="red">
  <EtBadge.Label>Error</EtBadge.Label>
</EtBadge>

<EtBadge color="orange">
  <EtBadge.Label>Warning</EtBadge.Label>
</EtBadge>

<EtBadge color="blue">
  <EtBadge.Label>Info</EtBadge.Label>
</EtBadge>`}
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
        <Desc>Two sizes available: medium (28px) and small (20px).</Desc>
        <Preview>
          <Row gap={24}>
            {ALL_SIZES.map((size) => (
              <Col key={size}>
                <EtBadge color="blue" size={size}>
                  <EtBadge.Label>Label</EtBadge.Label>
                </EtBadge>
                <Label>{size === 'medium' ? 'medium (28px)' : 'small (20px)'}</Label>
              </Col>
            ))}
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtBadge } from 'etoro-ui';

// Medium - 28px height (default)
<EtBadge size="medium" color="blue">
  <EtBadge.Label>Medium</EtBadge.Label>
</EtBadge>

// Small - 20px height
<EtBadge size="small" color="blue">
  <EtBadge.Label>Small</EtBadge.Label>
</EtBadge>`}
        />
      </Section>
    </Page>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>With Icons</Title>
        <Desc>Add icons before or after the label using EtBadge.Icon.</Desc>
        <Preview>
          <Row gap={16} wrap>
            <Col>
              <EtBadge color="green">
                <EtBadge.Icon name="heart" />
                <EtBadge.Label>Favorites</EtBadge.Label>
              </EtBadge>
              <Label>prefix</Label>
            </Col>
            <Col>
              <EtBadge color="neutral">
                <EtBadge.Label>More</EtBadge.Label>
                <EtBadge.Icon name="chevronRight" />
              </EtBadge>
              <Label>suffix</Label>
            </Col>
            <Col>
              <EtBadge color="purple">
                <EtBadge.Icon name="heart" />
                <EtBadge.Label>Featured</EtBadge.Label>
                <EtBadge.Icon name="chevronRight" />
              </EtBadge>
              <Label>both</Label>
            </Col>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtBadge } from 'etoro-ui';

// Prefix icon (before label)
<EtBadge color="green">
  <EtBadge.Icon name="heart" />
  <EtBadge.Label>Favorites</EtBadge.Label>
</EtBadge>

// Suffix icon (after label)
<EtBadge color="neutral">
  <EtBadge.Label>More</EtBadge.Label>
  <EtBadge.Icon name="chevronRight" />
</EtBadge>

// Both icons
<EtBadge color="purple">
  <EtBadge.Icon name="heart" />
  <EtBadge.Label>Featured</EtBadge.Label>
  <EtBadge.Icon name="chevronRight" />
</EtBadge>`}
        />
      </Section>

      <Section>
        <SubTitle>Icon Only</SubTitle>
        <Desc>Badges can display just an icon without a label.</Desc>
        <Preview>
          <Row gap={12}>
            <Col>
              <EtBadge color="green">
                <EtBadge.Icon name="checked" />
              </EtBadge>
              <Label>checked</Label>
            </Col>
            <Col>
              <EtBadge color="red">
                <EtBadge.Icon name="close" />
              </EtBadge>
              <Label>close</Label>
            </Col>
            <Col>
              <EtBadge color="yellow">
                <EtBadge.Icon name="notification" />
              </EtBadge>
              <Label>notification</Label>
            </Col>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtBadge } from 'etoro-ui';

// Icon-only badges
<EtBadge color="green">
  <EtBadge.Icon name="checked" />
</EtBadge>

<EtBadge color="red">
  <EtBadge.Icon name="close" />
</EtBadge>`}
        />
      </Section>

      <Section>
        <SubTitle>Stroke vs Filled</SubTitle>
        <Desc>Use hasFill prop to toggle between stroke and filled icons.</Desc>
        <Preview>
          <Row gap={24}>
            <Col>
              <EtBadge color="green">
                <EtBadge.Icon name="heart" />
                <EtBadge.Label>Stroke</EtBadge.Label>
              </EtBadge>
              <Label>default</Label>
            </Col>
            <Col>
              <EtBadge color="green">
                <EtBadge.Icon name="heart" hasFill />
                <EtBadge.Label>Filled</EtBadge.Label>
              </EtBadge>
              <Label>hasFill</Label>
            </Col>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtBadge } from 'etoro-ui';

// Stroke icon (default)
<EtBadge color="green">
  <EtBadge.Icon name="heart" />
  <EtBadge.Label>Stroke</EtBadge.Label>
</EtBadge>

// Filled icon
<EtBadge color="green">
  <EtBadge.Icon name="heart" hasFill />
  <EtBadge.Label>Filled</EtBadge.Label>
</EtBadge>`}
        />
      </Section>
    </Page>
  ),
};

export const UsageExamples: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Usage Examples</Title>
        <Desc>Common badge patterns for eToro applications.</Desc>
      </Section>

      <Section>
        <SubTitle>Status Indicators</SubTitle>
        <Preview>
          <Row gap={12} wrap>
            <EtBadge color="green">
              <EtBadge.Label>Active</EtBadge.Label>
            </EtBadge>
            <EtBadge color="yellow">
              <EtBadge.Label>Pending</EtBadge.Label>
            </EtBadge>
            <EtBadge color="red">
              <EtBadge.Label>Rejected</EtBadge.Label>
            </EtBadge>
            <EtBadge color="neutral">
              <EtBadge.Label>Draft</EtBadge.Label>
            </EtBadge>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtBadge } from 'etoro-ui';

<EtBadge color="green">
  <EtBadge.Label>Active</EtBadge.Label>
</EtBadge>

<EtBadge color="yellow">
  <EtBadge.Label>Pending</EtBadge.Label>
</EtBadge>

<EtBadge color="red">
  <EtBadge.Label>Rejected</EtBadge.Label>
</EtBadge>`}
        />
      </Section>

      <Section>
        <SubTitle>Trading Labels</SubTitle>
        <Preview>
          <Row gap={12} wrap>
            <EtBadge color="green">
              <EtBadge.Label>BUY</EtBadge.Label>
            </EtBadge>
            <EtBadge color="red">
              <EtBadge.Label>SELL</EtBadge.Label>
            </EtBadge>
            <EtBadge color="blue">
              <EtBadge.Icon name="triangleUp" hasFill />
              <EtBadge.Label>+2.5%</EtBadge.Label>
            </EtBadge>
            <EtBadge color="orange">
              <EtBadge.Label>Trending</EtBadge.Label>
            </EtBadge>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtBadge } from 'etoro-ui';

<EtBadge color="green">
  <EtBadge.Label>BUY</EtBadge.Label>
</EtBadge>

<EtBadge color="red">
  <EtBadge.Label>SELL</EtBadge.Label>
</EtBadge>

<EtBadge color="blue">
  <EtBadge.Icon name="triangleUp" hasFill />
  <EtBadge.Label>+2.5%</EtBadge.Label>
</EtBadge>`}
        />
      </Section>

      <Section>
        <SubTitle>Account Badges</SubTitle>
        <Preview>
          <Row gap={12} wrap>
            <EtBadge color="purple" size="small">
              <EtBadge.Label>PRO</EtBadge.Label>
            </EtBadge>
            <EtBadge color="violet" size="small">
              <EtBadge.Label>VIP</EtBadge.Label>
            </EtBadge>
            <EtBadge color="mint" size="small">
              <EtBadge.Icon name="checked" />
              <EtBadge.Label>Verified</EtBadge.Label>
            </EtBadge>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtBadge } from 'etoro-ui';

<EtBadge color="purple" size="small">
  <EtBadge.Label>PRO</EtBadge.Label>
</EtBadge>

<EtBadge color="violet" size="small">
  <EtBadge.Label>VIP</EtBadge.Label>
</EtBadge>

<EtBadge color="mint" size="small">
  <EtBadge.Icon name="checked" />
  <EtBadge.Label>Verified</EtBadge.Label>
</EtBadge>`}
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
        <SubTitle>EtBadge</SubTitle>
        <Desc>Root component that provides color context to children.</Desc>
        <PropsTable
          data={[
            {
              prop: 'color',
              type: '"neutral" | "red" | "orange" | "yellow" | "green" | "mint" | "blue" | "purple" | "violet"',
              default: '"neutral"',
            },
            {
              prop: 'size',
              type: '"medium" | "small"',
              default: '"medium"',
            },
            { prop: 'style', type: 'ViewStyle', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtBadge.Label</SubTitle>
        <Desc>Text content for the badge. Automatically colored based on parent.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'style', type: 'TextStyle', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtBadge.Icon</SubTitle>
        <Desc>Icon displayed in the badge. Automatically colored based on parent.</Desc>
        <PropsTable
          data={[
            { prop: 'name', type: 'IconName', default: '-' },
            { prop: 'hasFill', type: 'boolean', default: 'false' },
          ]}
        />
      </Section>
    </Page>
  ),
};
