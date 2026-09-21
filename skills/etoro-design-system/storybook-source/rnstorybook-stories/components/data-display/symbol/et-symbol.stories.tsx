import type { Meta, StoryObj } from '@storybook/react-native';

import { EtSymbol } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtSymbol>;

const meta: Meta<typeof EtSymbol> = {
  title: 'eToro-UI/Components/Data Display/EtSymbol',
  component: EtSymbol,
};

export default meta;

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: function BasicStory() {
    const { colors } = useEtoroTheme();
    return (
      <Page>
        <Section>
          <Title>Basic</Title>
          <Desc>
            EtSymbol is a styled box used to display currency symbols, icons, or dates. It supports configurable background colors, sizes, and corner
            shapes with a built-in gradient overlay. Use theme colors for currency backgrounds.
          </Desc>
          <Preview>
            <Row gap={16}>
              <EtSymbol backgroundColor={colors.eur}>
                <EtSymbol.Currency>€</EtSymbol.Currency>
              </EtSymbol>
              <EtSymbol backgroundColor={colors.gbp}>
                <EtSymbol.Currency>£</EtSymbol.Currency>
              </EtSymbol>
              <EtSymbol backgroundColor={colors.usd}>
                <EtSymbol.Currency>$</EtSymbol.Currency>
              </EtSymbol>
            </Row>
          </Preview>
          <CodeBlock
            code={`import { EtSymbol } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

function CurrencyExample() {
  const { colors } = useEtoroTheme();
  
  return (
    <EtSymbol backgroundColor={colors.eur}>
      <EtSymbol.Currency>€</EtSymbol.Currency>
    </EtSymbol>
  );
}`}
          />
        </Section>
      </Page>
    );
  },
};

export const Sizes: Story = {
  render: function SizesStory() {
    const { colors } = useEtoroTheme();
    return (
      <Page>
        <Section>
          <Title>Sizes</Title>
          <Desc>EtSymbol supports three sizes: small (24px), medium (36px), and large (48px).</Desc>

          <SubTitle>EUR</SubTitle>
          <Preview>
            <Row gap={16}>
              <Col>
                <EtSymbol size="small" backgroundColor={colors.eur}>
                  <EtSymbol.Currency>€</EtSymbol.Currency>
                </EtSymbol>
                <Label>Small</Label>
              </Col>
              <Col>
                <EtSymbol size="medium" backgroundColor={colors.eur}>
                  <EtSymbol.Currency>€</EtSymbol.Currency>
                </EtSymbol>
                <Label>Medium</Label>
              </Col>
              <Col>
                <EtSymbol size="large" backgroundColor={colors.eur}>
                  <EtSymbol.Currency>€</EtSymbol.Currency>
                </EtSymbol>
                <Label>Large</Label>
              </Col>
            </Row>
          </Preview>

          <SubTitle>USD</SubTitle>
          <Preview>
            <Row gap={16}>
              <Col>
                <EtSymbol size="small" backgroundColor={colors.usd}>
                  <EtSymbol.Currency>$</EtSymbol.Currency>
                </EtSymbol>
                <Label>Small</Label>
              </Col>
              <Col>
                <EtSymbol size="medium" backgroundColor={colors.usd}>
                  <EtSymbol.Currency>$</EtSymbol.Currency>
                </EtSymbol>
                <Label>Medium</Label>
              </Col>
              <Col>
                <EtSymbol size="large" backgroundColor={colors.usd}>
                  <EtSymbol.Currency>$</EtSymbol.Currency>
                </EtSymbol>
                <Label>Large</Label>
              </Col>
            </Row>
          </Preview>

          <SubTitle>AUD</SubTitle>
          <Preview>
            <Row gap={16}>
              <Col>
                <EtSymbol size="medium" backgroundColor={colors.aud}>
                  <EtSymbol.Currency>A$</EtSymbol.Currency>
                </EtSymbol>
                <Label>Medium</Label>
              </Col>
              <Col>
                <EtSymbol size="large" backgroundColor={colors.aud}>
                  <EtSymbol.Currency>A$</EtSymbol.Currency>
                </EtSymbol>
                <Label>Large</Label>
              </Col>
            </Row>
          </Preview>

          <CodeBlock
            code={`import { EtSymbol } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

function SizesExample() {
  const { colors } = useEtoroTheme();
  
  return (
    <>
      {/* Small (24px) */}
      <EtSymbol size="small" backgroundColor={colors.eur}>
        <EtSymbol.Currency>€</EtSymbol.Currency>
      </EtSymbol>
      
      {/* Medium (36px) */}
      <EtSymbol size="medium" backgroundColor={colors.usd}>
        <EtSymbol.Currency>$</EtSymbol.Currency>
      </EtSymbol>
      
      {/* Large (48px) */}
      <EtSymbol size="large" backgroundColor={colors.aud}>
        <EtSymbol.Currency>A$</EtSymbol.Currency>
      </EtSymbol>
    </>
  );
}`}
          />
        </Section>
      </Page>
    );
  },
};

export const Shapes: Story = {
  render: function ShapesStory() {
    const { colors } = useEtoroTheme();
    return (
      <Page>
        <Section>
          <Title>Shapes</Title>
          <Desc>Use &quot;rounded&quot; for rounded corners or &quot;sharp&quot; for square corners.</Desc>
          <Preview>
            <Row gap={16}>
              <Col>
                <EtSymbol shape="rounded" backgroundColor={colors.eur}>
                  <EtSymbol.Currency>€</EtSymbol.Currency>
                </EtSymbol>
                <Label>EUR Rounded</Label>
              </Col>
              <Col>
                <EtSymbol shape="sharp" backgroundColor={colors.gbp}>
                  <EtSymbol.Currency>£</EtSymbol.Currency>
                </EtSymbol>
                <Label>GBP Sharp</Label>
              </Col>
              <Col>
                <EtSymbol shape="rounded" backgroundColor={colors.usd}>
                  <EtSymbol.Currency>$</EtSymbol.Currency>
                </EtSymbol>
                <Label>USD Rounded</Label>
              </Col>
              <Col>
                <EtSymbol shape="sharp" backgroundColor={colors.aud}>
                  <EtSymbol.Currency>A$</EtSymbol.Currency>
                </EtSymbol>
                <Label>AUD Sharp</Label>
              </Col>
            </Row>
          </Preview>
          <CodeBlock
            code={`import { EtSymbol } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

function ShapesExample() {
  const { colors } = useEtoroTheme();
  
  return (
    <>
      {/* Rounded (default) */}
      <EtSymbol shape="rounded" backgroundColor={colors.eur}>
        <EtSymbol.Currency>€</EtSymbol.Currency>
      </EtSymbol>
      
      {/* Sharp */}
      <EtSymbol shape="sharp" backgroundColor={colors.gbp}>
        <EtSymbol.Currency>£</EtSymbol.Currency>
      </EtSymbol>
    </>
  );
}`}
          />
        </Section>
      </Page>
    );
  },
};

export const WithIcon: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Icon</Title>
        <Desc>Use EtSymbol.Icon to display an EtIconV2 icon inside the symbol box.</Desc>
        <Preview>
          <Row gap={16}>
            <Col>
              <EtSymbol size="small">
                <EtSymbol.Icon name="chat" />
              </EtSymbol>
              <Label>Small</Label>
            </Col>
            <Col>
              <EtSymbol size="medium">
                <EtSymbol.Icon name="chat" />
              </EtSymbol>
              <Label>Medium</Label>
            </Col>
            <Col>
              <EtSymbol size="large">
                <EtSymbol.Icon name="chat" />
              </EtSymbol>
              <Label>Large</Label>
            </Col>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtSymbol } from 'etoro-ui';

<EtSymbol>
  <EtSymbol.Icon name="chat" />
</EtSymbol>`}
        />
      </Section>
    </Page>
  ),
};

export const WithDate: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Date</Title>
        <Desc>Use EtSymbol.Date to display a two-line day + month layout.</Desc>
        <Preview>
          <Row gap={16}>
            <Col>
              <EtSymbol size="medium" shape="sharp">
                <EtSymbol.Date day="29" month="Apr" />
              </EtSymbol>
              <Label>Medium</Label>
            </Col>
            <Col>
              <EtSymbol size="large" shape="sharp">
                <EtSymbol.Date day="15" month="Dec" />
              </EtSymbol>
              <Label>Large</Label>
            </Col>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtSymbol } from 'etoro-ui';

<EtSymbol shape="sharp">
  <EtSymbol.Date day="29" month="Apr" />
</EtSymbol>`}
        />
      </Section>
    </Page>
  ),
};

export const WithText: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Text</Title>
        <Desc>Use EtSymbol.Text to display short text labels like file types or codes.</Desc>
        <Preview>
          <Row gap={16}>
            <Col>
              <EtSymbol size="medium">
                <EtSymbol.Text>PNG</EtSymbol.Text>
              </EtSymbol>
              <Label>Medium</Label>
            </Col>
            <Col>
              <EtSymbol size="large">
                <EtSymbol.Text>JPG</EtSymbol.Text>
              </EtSymbol>
              <Label>Large</Label>
            </Col>
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtSymbol } from 'etoro-ui';

<EtSymbol>
  <EtSymbol.Text>PNG</EtSymbol.Text>
</EtSymbol>`}
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
        <SubTitle>EtSymbol</SubTitle>
        <Desc>Root container component. Renders a styled box with background color and gradient overlay.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-' },
            { prop: 'size', type: '"small" | "medium" | "large"', default: '"medium"' },
            { prop: 'shape', type: '"rounded" | "sharp"', default: '"rounded"' },
            { prop: 'backgroundColor', type: 'string', default: '"#232733"' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSymbol.Currency</SubTitle>
        <Desc>Displays a currency symbol as text. Text size scales automatically with the symbol size.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'string', default: '-' },
            { prop: 'color', type: 'string', default: '"#FFFFFF"' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSymbol.Icon</SubTitle>
        <Desc>Displays a centered icon using EtIconV2.</Desc>
        <PropsTable
          data={[
            { prop: 'name', type: 'string (IconName)', default: '-' },
            { prop: 'color', type: 'string', default: '"#FFFFFF"' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSymbol.Date</SubTitle>
        <Desc>Displays a two-line date with day number and month abbreviation.</Desc>
        <PropsTable
          data={[
            { prop: 'day', type: 'string', default: '-' },
            { prop: 'month', type: 'string', default: '-' },
            { prop: 'color', type: 'string', default: '"#FFFFFF"' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtSymbol.Text</SubTitle>
        <Desc>Displays short text labels (e.g., file types, codes).</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'string', default: '-' },
            { prop: 'color', type: 'string', default: '"#FFFFFF"' },
          ]}
        />
      </Section>
    </Page>
  ),
};
