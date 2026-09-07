import type { Meta, StoryObj } from '@storybook/react-native';
import { EtTrendingStockCard, type EtAssetCardAsset } from 'etoro-ui';

import { CodeBlock, Col, Desc, Label, Page, Preview, Section, Title } from '../../../utils/storybook-template';

const tsla: EtAssetCardAsset = {
  symbol: 'TSLA',
  name: 'Tesla Inc',
  logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_CC2914_FFFFFF.svg',
  backgroundColor: '#CC2914',
  price: 186.79,
  changePercent: 0.0435,
  currency: 'USD',
};

const HERO = {
  uri: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=654&h=754&fit=crop',
};

const meta: Meta<typeof EtTrendingStockCard> = {
  title: 'eToro-UI/Components/DataDisplay/EtTrendingStockCard',
  component: EtTrendingStockCard,
};

export default meta;

type Story = StoryObj<typeof EtTrendingStockCard>;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Trending Stock</Title>
        <Desc>Smart large-image card — in-content eyebrow + headline, logo in footer, dark glass (Figma 63763:418667).</Desc>
        <Preview>
          <Col gap={8}>
            <EtTrendingStockCard asset={tsla} backgroundImage={HERO} title="Tesla experienced a significant sales slump in early 2026" />
            <Label>large · image · eyebrow + title · media footer</Label>
          </Col>
        </Preview>
        <CodeBlock
          code={`import { EtTrendingStockCard } from 'etoro-ui';

<EtTrendingStockCard
  asset={asset}
  backgroundImage={{ uri: heroUrl }}
  title="Tesla experienced a significant sales slump in early 2026"
/>`}
        />
      </Section>
    </Page>
  ),
};
