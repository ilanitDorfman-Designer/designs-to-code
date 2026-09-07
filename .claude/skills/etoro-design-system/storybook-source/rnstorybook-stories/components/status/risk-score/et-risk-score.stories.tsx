import type { Meta, StoryObj } from '@storybook/react-native';
import type { RiskScoreSize, RiskScoreValue, RiskScoreVariant } from 'etoro-ui';
import { EtRiskScore } from 'etoro-ui';
import { ScrollView } from 'react-native';
import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtRiskScore>;

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const DISPLAY_VALUES: RiskScoreValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const ALL_SIZES: RiskScoreSize[] = ['lg', 'md', 'sm', 'xs'];
const ALL_VARIANTS: RiskScoreVariant[] = ['multi', 'single'];

const SIZE_LABELS: Record<RiskScoreSize, string> = {
  lg: 'Large (35px)',
  md: 'Medium (30px)',
  sm: 'Small (24px)',
  xs: 'X-Small (20px)',
};

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtRiskScore> = {
  title: 'eToro-UI/Components/Status/EtRiskScore',
  component: EtRiskScore,
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
        <Desc>
          A circular risk score indicator displaying a value from 1–10 with colored arc segments. Colors range from green (low risk) through yellow
          (medium) to red (high risk).
        </Desc>
        <Preview>
          <Row>
            <EtRiskScore value={3} size="lg" />
            <EtRiskScore value={5} size="lg" />
            <EtRiskScore value={7} size="lg" />
            <EtRiskScore value={8} size="lg" />
            <EtRiskScore value={10} size="lg" />
          </Row>
        </Preview>
        <CodeBlock
          code={`import { EtRiskScore } from 'etoro-ui';

<EtRiskScore value={3} size="lg" />
<EtRiskScore value={5} size="lg" />
<EtRiskScore value={7} size="lg" />
<EtRiskScore value={8} size="lg" />
<EtRiskScore value={10} size="lg" />`}
        />
      </Section>
    </Page>
  ),
};

export const AllValues: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>All Values</Title>
        <Desc>Risk scores 1–10 in both variants at large size.</Desc>

        <SubTitle>Multi Variant (progressive fill)</SubTitle>
        <Preview>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Row>
              {DISPLAY_VALUES.map((value) => (
                <Col key={value}>
                  <EtRiskScore value={value} size="lg" variant="multi" />
                  <Label>{String(value)}</Label>
                </Col>
              ))}
            </Row>
          </ScrollView>
        </Preview>

        <SubTitle>Single Variant (only active segment)</SubTitle>
        <Preview>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Row>
              {DISPLAY_VALUES.map((value) => (
                <Col key={value}>
                  <EtRiskScore value={value} size="lg" variant="single" />
                  <Label>{String(value)}</Label>
                </Col>
              ))}
            </Row>
          </ScrollView>
        </Preview>
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
          Available in 4 sizes: xs (20px), sm (24px), md (30px), and lg (35px). Each size adjusts the stroke width and font size proportionally.
        </Desc>

        {ALL_SIZES.map((size) => (
          <Col key={size}>
            <SubTitle>{SIZE_LABELS[size]}</SubTitle>
            <Preview>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Row>
                  {DISPLAY_VALUES.map((value) => (
                    <EtRiskScore key={value} value={value} size={size} />
                  ))}
                </Row>
              </ScrollView>
            </Preview>
          </Col>
        ))}
      </Section>
    </Page>
  ),
};

export const Variants: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Variants</Title>
        <Desc>Two display variants control how arc segments are colored.</Desc>

        <SubTitle>Multi (default)</SubTitle>
        <Desc>All segments from 1 up to the score value are filled with the same active color, derived from the score&apos;s risk level.</Desc>
        <Preview>
          <Row>
            <EtRiskScore value={3} size="lg" variant="multi" />
            <EtRiskScore value={5} size="lg" variant="multi" />
            <EtRiskScore value={7} size="lg" variant="multi" />
          </Row>
        </Preview>

        <SubTitle>Single</SubTitle>
        <Desc>Only the segment matching the score value is colored. All other segments use the inactive color.</Desc>
        <Preview>
          <Row>
            <EtRiskScore value={3} size="lg" variant="single" />
            <EtRiskScore value={5} size="lg" variant="single" />
            <EtRiskScore value={7} size="lg" variant="single" />
          </Row>
        </Preview>
      </Section>
    </Page>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Size Comparison</Title>
        <Desc>Side-by-side comparison of all sizes for the same score value.</Desc>

        {ALL_VARIANTS.map((variant) => (
          <Col key={variant}>
            <SubTitle>{`Variant: ${variant}`}</SubTitle>
            {ALL_SIZES.map((size) => (
              <Preview key={size}>
                <Row>
                  <Label>{SIZE_LABELS[size]}:</Label>
                  {DISPLAY_VALUES.map((value) => (
                    <EtRiskScore key={value} value={value} size={size} variant={variant} />
                  ))}
                </Row>
              </Preview>
            ))}
          </Col>
        ))}
      </Section>
    </Page>
  ),
};

export const UsageExamples: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Usage Examples</Title>

        <SubTitle>Low Risk</SubTitle>
        <Preview>
          <Row>
            <EtRiskScore value={1} size="lg" />
            <EtRiskScore value={2} size="lg" />
            <EtRiskScore value={3} size="lg" />
          </Row>
        </Preview>

        <SubTitle>Medium Risk</SubTitle>
        <Preview>
          <Row>
            <EtRiskScore value={4} size="lg" />
            <EtRiskScore value={5} size="lg" />
            <EtRiskScore value={6} size="lg" />
          </Row>
        </Preview>

        <SubTitle>High Risk</SubTitle>
        <Preview>
          <Row>
            <EtRiskScore value={7} size="lg" />
            <EtRiskScore value={8} size="lg" />
            <EtRiskScore value={9} size="lg" />
          </Row>
        </Preview>

        <SubTitle>Inline with different sizes</SubTitle>
        <Preview>
          <Row>
            <EtRiskScore value={7} size="xs" />
            <EtRiskScore value={7} size="sm" />
            <EtRiskScore value={7} size="md" />
            <EtRiskScore value={7} size="lg" />
          </Row>
        </Preview>
      </Section>
    </Page>
  ),
};

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>

        <SubTitle>EtRiskScore Props</SubTitle>
        <PropsTable
          data={[
            {
              prop: 'value',
              type: 'RiskScoreValue (1–10)',
              default: '—',
              description: 'The risk score value to display (required)',
            },
            {
              prop: 'size',
              type: "'xs' | 'sm' | 'md' | 'lg'",
              default: "'md'",
              description: 'Size of the component: xs (20px), sm (24px), md (30px), lg (35px)',
            },
            {
              prop: 'variant',
              type: "'multi' | 'single'",
              default: "'multi'",
              description: 'Display variant: multi fills segments 1–N, single fills only segment N',
            },
            {
              prop: 'style',
              type: 'StyleProp<ViewStyle>',
              default: '—',
              description: 'Additional container styles',
            },
            {
              prop: 'testID',
              type: 'string',
              default: '—',
              description: 'Test ID for testing',
            },
            {
              prop: 'accessibilityLabel',
              type: 'string',
              default: "'Risk score {value} out of 10'",
              description: 'Custom accessibility label',
            },
          ]}
        />

        <SubTitle>Usage</SubTitle>
        <CodeBlock
          code={`import { EtRiskScore } from 'etoro-ui';

// Basic
<EtRiskScore value={7} />

// With size and variant
<EtRiskScore value={5} size="lg" variant="single" />

// All props
<EtRiskScore
  value={8}
  size="sm"
  variant="multi"
  testID="risk-score"
  accessibilityLabel="High risk"
/>`}
        />
      </Section>
    </Page>
  ),
};
