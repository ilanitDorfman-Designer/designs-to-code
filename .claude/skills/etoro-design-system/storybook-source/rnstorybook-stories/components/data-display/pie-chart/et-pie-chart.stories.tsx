import type { Meta, StoryObj } from '@storybook/react-native';
import { EtPieChart } from 'etoro-ui/components/data-display/pie-chart';
import type { PieChartData } from 'etoro-ui/components/data-display/pie-chart';

import { View } from 'react-native';

import { CodeBlock, Desc, Page, Preview, PropsTable, Row, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtPieChart>;

// Sample data uses the DS Category Accent palette (A→G) so the chart and legend stay in sync.
const allocationData: PieChartData[] = [
  { key: 'Stocks', value: 42, color: '#59AEFF' },
  { key: 'Crypto', value: 23, color: '#FF8300' },
  { key: 'ETFs', value: 15, color: '#D06BFF' },
  { key: 'Commodities', value: 12, color: '#1CCF3F' },
  { key: 'Currencies', value: 8, color: '#FF6BD5' },
];

// Colorless variant of the same shares — lets the Basic story demonstrate the
// theme-aware default accent palette (A→G) instead of explicit overrides.
const defaultPaletteData: PieChartData[] = allocationData.map(({ key, value }) => ({ key, value }));

const manyItems: PieChartData[] = Array.from({ length: 10 }, (_, i) => ({
  key: `Sector ${i + 1}`,
  value: 20 - i,
}));

const meta: Meta<typeof EtPieChart> = {
  title: 'eToro-UI/Components/DataDisplay/PieChart',
  component: EtPieChart,
  parameters: {
    notes:
      'A themeable donut chart. Segments start at 12 o’clock and fill clockwise over a muted track. Values are relative shares (normalized by their sum); overflow beyond `maxSegments` folds into a single "Other" arc. Ships with a compound `SegmentLegend`.',
  },
};

export default meta;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>A donut built from relative shares. Colors default to the DS accent palette when omitted.</Desc>
        <Preview>
          <EtPieChart data={defaultPaletteData} />
        </Preview>
        <CodeBlock
          code={`import { EtPieChart } from 'etoro-ui';

<EtPieChart
  data={[
    { key: 'Stocks', value: 42 },
    { key: 'Crypto', value: 23 },
    { key: 'ETFs', value: 15 },
  ]}
/>`}
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
        <Desc>The DS defines two sizes: small (100px) and large (150px).</Desc>
        <Preview>
          <Row gap={32}>
            <EtPieChart data={allocationData} size="small" />
            <EtPieChart data={allocationData} size="large" />
          </Row>
        </Preview>
        <CodeBlock
          code={`<EtPieChart data={allocationData} size="small" />
<EtPieChart data={allocationData} size="large" />`}
        />
      </Section>
    </Page>
  ),
};

export const WithOuterRing: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Dashed outer ring</Title>
        <Desc>Enable the decorative dashed outer ring (Figma "Dashed line" variant).</Desc>
        <Preview>
          <Row gap={32}>
            <EtPieChart data={allocationData} showOuterRing={false} />
            <EtPieChart data={allocationData} showOuterRing />
          </Row>
        </Preview>
        <CodeBlock code={`<EtPieChart data={allocationData} showOuterRing />`} />
      </Section>
    </Page>
  ),
};

export const MaxSegments: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Overflow to Other</Title>
        <Desc>With 10 inputs and the default max of 7, the smallest segments fold into a single "Other" arc.</Desc>
        <Preview>
          <Row gap={32}>
            <EtPieChart data={manyItems} maxSegments={7} />
            <EtPieChart data={manyItems} maxSegments={4} />
          </Row>
        </Preview>
        <CodeBlock code={`<EtPieChart data={manyItems} maxSegments={7} />`} />
      </Section>
    </Page>
  ),
};

export const WithSegmentLegend: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>With SegmentLegend</Title>
        <Desc>The legend is a sibling compound so it can sit below or beside the donut. Each row is a dumb dot + label + value.</Desc>
        <Preview>
          {/* Figma "Breakdown" block: chart + legend stacked with 24px gap, centered. */}
          <View style={{ alignItems: 'center', gap: 24, width: '100%' }}>
            <EtPieChart data={allocationData} size="large" showOuterRing />
            <EtPieChart.SegmentLegend>
              {allocationData.map((segment) => (
                <EtPieChart.SegmentLegendItem
                  key={segment.key}
                  dotColor={typeof segment.color === 'string' ? segment.color : '#59AEFF'}
                  label={segment.key}
                  value={`${segment.value}%`}
                  showChevron
                />
              ))}
            </EtPieChart.SegmentLegend>
          </View>
        </Preview>
        <CodeBlock
          code={`<EtPieChart data={allocationData} size="large" showOuterRing />
<EtPieChart.SegmentLegend>
  {allocationData.map((segment) => (
    <EtPieChart.SegmentLegendItem
      key={segment.key}
      dotColor={typeof segment.color === 'string' ? segment.color : '#59AEFF'}
      label={segment.key}
      value={\`\${segment.value}%\`}
      showChevron
    />
  ))}
</EtPieChart.SegmentLegend>`}
        />
      </Section>
    </Page>
  ),
};

export const Animation: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Animation</Title>
        <Desc>The entrance sweep draws the ring clockwise. It is disabled automatically when the OS "reduce motion" setting is on.</Desc>
        <Preview>
          <Row gap={32}>
            <EtPieChart data={allocationData} enableAnimation animationDuration={600} />
            <EtPieChart data={allocationData} enableAnimation={false} />
          </Row>
        </Preview>
        <CodeBlock
          code={`<EtPieChart data={allocationData} enableAnimation animationDuration={600} />
<EtPieChart data={allocationData} enableAnimation={false} />`}
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
        <SubTitle>EtPieChart</SubTitle>
        <Desc>The donut chart.</Desc>
        <PropsTable
          data={[
            { prop: 'data', type: 'PieChartData[]', default: '[]' },
            { prop: 'size', type: "'small' | 'large'", default: "'small'" },
            { prop: 'innerRadius', type: 'number', default: 'derived from size' },
            { prop: 'maxSegments', type: 'number', default: '7' },
            { prop: 'showOuterRing', type: 'boolean', default: 'false' },
            { prop: 'enableAnimation', type: 'boolean', default: 'true' },
            { prop: 'animationDuration', type: 'number', default: '900' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: 'Pie chart with N segments' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>PieChartData</SubTitle>
        <PropsTable
          data={[
            { prop: 'key', type: 'string', default: '-' },
            { prop: 'value', type: 'number', default: '-' },
            { prop: 'color', type: 'string | [string, string]', default: 'DS accent palette' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPieChart.SegmentLegend</SubTitle>
        <Desc>Dumb container arranging SegmentLegendItem children.</Desc>
        <PropsTable
          data={[
            { prop: 'layout', type: "'grid' | 'list'", default: "'grid'" },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtPieChart.SegmentLegendItem</SubTitle>
        <Desc>A single legend row. Becomes an accessible button only when onPress is provided.</Desc>
        <PropsTable
          data={[
            { prop: 'dotColor', type: 'string', default: '-' },
            { prop: 'label', type: 'string', default: '-' },
            { prop: 'value', type: 'string', default: '-' },
            { prop: 'showChevron', type: 'boolean', default: 'false' },
            { prop: 'onPress', type: '() => void', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '"{label} {value}"' },
          ]}
        />
      </Section>
    </Page>
  ),
};
