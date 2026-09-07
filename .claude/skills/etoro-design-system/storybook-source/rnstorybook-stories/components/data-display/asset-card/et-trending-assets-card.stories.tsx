import type { Meta, StoryObj } from '@storybook/react-native';
import { EtTrendingAssetsCard } from 'etoro-ui';

import { CodeBlock, Col, Desc, Label, Page, Preview, Section, Title } from '../../../utils/storybook-template';

const HERO = {
  uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=654&h=754&fit=crop',
};

const assets = [
  {
    symbol: 'ADBE',
    logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_E4231D_FFFFFF.svg',
    backgroundColor: '#E4231D',
  },
  {
    symbol: 'AAPL',
    logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1002/1002_3183FF_F7F7F7.svg',
    backgroundColor: '#434351',
  },
  {
    symbol: 'TSLA',
    logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_CC2914_FFFFFF.svg',
    backgroundColor: '#ED2520',
  },
  {
    symbol: 'AMZN',
    logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg',
    backgroundColor: '#494D5A',
  },
  {
    symbol: 'SPOT',
    logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1006/1006_EE7128_F7F7F7.svg',
    backgroundColor: '#1ED761',
  },
  {
    symbol: 'NVDA',
    logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1005/1005_494D5A_F7F7F7.svg',
    backgroundColor: '#76B900',
  },
  {
    symbol: 'MSFT',
    logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1003/1003_F7F7F7_2C2C2C.svg',
    backgroundColor: '#00A4EF',
  },
];

const meta: Meta<typeof EtTrendingAssetsCard> = {
  title: 'eToro-UI/Components/DataDisplay/EtTrendingAssetsCard',
  component: EtTrendingAssetsCard,
};

export default meta;

type Story = StoryObj<typeof EtTrendingAssetsCard>;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Trending Assets</Title>
        <Desc>Smart large media card — shared content stack + instrument logo row with overflow pill (Figma 63763:418675).</Desc>
        <Preview>
          <Col gap={8}>
            <EtTrendingAssetsCard
              assets={assets}
              backgroundImage={HERO}
              title="Trump – Musk feud reignites as megabill hits snags in Senate"
              description="TSLA is seeing increased investor activity amid political uncertainty"
            />
            <Label>large · image · asset logos + overflow (inline expand)</Label>
          </Col>
        </Preview>
        <CodeBlock
          code={`import { EtTrendingAssetsCard } from 'etoro-ui';

<EtTrendingAssetsCard
  assets={assets}
  backgroundImage={{ uri: heroUrl }}
  title="Trump – Musk feud reignites as megabill hits snags in Senate"
  description="TSLA is seeing increased investor activity amid political uncertainty"
/>`}
        />
      </Section>
    </Page>
  ),
};

export const OverflowCallback: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Overflow callback</Title>
        <Desc>
          When `onOverflowPress` is provided, the `+N` control invokes it instead of expanding the footer into a carousel. `maxVisible` caps how many
          logos show before the overflow pill.
        </Desc>
        <Preview>
          <Col gap={8}>
            <EtTrendingAssetsCard
              assets={assets}
              maxVisible={4}
              backgroundImage={HERO}
              title="Trump – Musk feud reignites as megabill hits snags in Senate"
              description="TSLA is seeing increased investor activity amid political uncertainty"
              onOverflowPress={() => console.log('Show remaining assets')}
            />
            <Label>large · maxVisible=4 · onOverflowPress</Label>
          </Col>
        </Preview>
        <CodeBlock
          code={`<EtTrendingAssetsCard
  assets={assets}
  maxVisible={4}
  backgroundImage={{ uri: heroUrl }}
  title="…"
  description="…"
  onOverflowPress={() => openAssetsSheet()}
/>`}
        />
      </Section>
    </Page>
  ),
};
