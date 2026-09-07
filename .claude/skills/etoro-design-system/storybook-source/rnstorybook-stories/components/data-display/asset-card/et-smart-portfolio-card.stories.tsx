import type { Meta, StoryObj } from '@storybook/react-native';
import { EtIconButton, EtSmartPortfolioCard } from 'etoro-ui';

import { CodeBlock, Col, Desc, Label, Page, Preview, Section, Title } from '../../../utils/storybook-template';

const HERO = {
  uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=654&h=754&fit=crop',
};

const chartData = [
  { timestamp: '2024-01-01T00:00:00Z', equity: 1 },
  { timestamp: '2024-01-02T00:00:00Z', equity: 1.04 },
  { timestamp: '2024-01-03T00:00:00Z', equity: 1.02 },
  { timestamp: '2024-01-04T00:00:00Z', equity: 1.09 },
  { timestamp: '2024-01-05T00:00:00Z', equity: 1.1551 },
];

const meta: Meta<typeof EtSmartPortfolioCard> = {
  title: 'eToro-UI/Components/DataDisplay/EtSmartPortfolioCard',
  component: EtSmartPortfolioCard,
};

export default meta;

type Story = StoryObj<typeof EtSmartPortfolioCard>;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Smart Portfolio</Title>
        <Desc>Smart large media card — header badge + action, custom gain / period / sparkline content (Figma 63763:418679).</Desc>
        <Preview>
          <Col gap={8}>
            <EtSmartPortfolioCard
              backgroundImage={HERO}
              label="Smart Portfolio"
              headerEnd={<EtIconButton iconName="star" size={24} onPress={() => undefined} />}
              title="Chip-Tech"
              changePercent={0.1551}
              periodLabel="Last 24 hours"
              description="Chip-Tech is experiencing a surge in investor interest, largely driven by strong semiconductor demand."
              chartData={chartData}
            />
            <Label>large · image · badge + star · gain + sparkline</Label>
          </Col>
        </Preview>
        <CodeBlock
          code={`import { EtIconButton, EtSmartPortfolioCard } from 'etoro-ui';

<EtSmartPortfolioCard
  backgroundImage={{ uri: heroUrl }}
  label="Smart Portfolio"
  headerEnd={<EtIconButton iconName="star" size={24} onPress={toggleWatchlist} />}
  title="Chip-Tech"
  changePercent={0.1551}
  periodLabel="Last 24 hours"
  description="Chip-Tech is experiencing a surge in investor interest, largely driven by strong semiconductor demand."
  chartData={chartData}
/>`}
        />
      </Section>
    </Page>
  ),
};
