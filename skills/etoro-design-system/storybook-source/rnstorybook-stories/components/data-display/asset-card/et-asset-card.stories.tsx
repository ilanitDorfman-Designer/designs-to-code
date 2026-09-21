import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAssetCard, type EtAssetCardAsset } from 'etoro-ui';

import { CodeBlock, Col, Desc, Label, Page, Preview, PropsTable, Row, Section, SubTitle, Title } from '../../../utils/storybook-template';

const tsla: EtAssetCardAsset = {
  symbol: 'TSLA',
  name: 'Tesla Inc',
  logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_CC2914_FFFFFF.svg',
  price: 186.79,
  changePercent: 0.0435,
  currency: 'USD',
};

const msft: EtAssetCardAsset = {
  symbol: 'MSFT',
  name: 'Microsoft',
  logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1002/1002_00A4EF_FFFFFF.svg',
  price: 420.12,
  changePercent: -0.012,
  currency: 'USD',
};

const meta: Meta<typeof EtAssetCard> = {
  title: 'eToro-UI/Components/DataDisplay/EtAssetCard',
  component: EtAssetCard,
};

export default meta;

type Story = StoryObj<typeof EtAssetCard>;

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>Small asset card — logo, price, and % change from an `asset` input.</Desc>
        <Preview>
          <EtAssetCard asset={tsla} />
        </Preview>
        <CodeBlock
          code={`import { EtAssetCard } from 'etoro-ui';

<EtAssetCard
  asset={{
    symbol: 'TSLA',
    logoUrl: 'https://…/1001_CC2914_FFFFFF.svg',
    price: 186.79,
    changePercent: 0.0435,
  }}
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
        <Desc>Small ticker, medium / large with optional label + description.</Desc>
        <Preview>
          <Col gap={16}>
            <Row gap={16} wrap>
              <Col gap={8}>
                <EtAssetCard asset={tsla} />
                <Label>small</Label>
              </Col>
              <Col gap={8}>
                <EtAssetCard asset={msft} variant="bright" />
                <Label>small bright</Label>
              </Col>
            </Row>
            <Col gap={8}>
              <EtAssetCard
                size="medium"
                asset={tsla}
                label="Trending Stock"
                description="Tesla experienced a significant sales slump in early 2026."
              />
              <Label>medium</Label>
            </Col>
            <Col gap={8}>
              <EtAssetCard
                size="large"
                variant="dark"
                asset={tsla}
                label="Trending Stock"
                description="Tesla experienced a significant sales slump in early 2026, amid softer global demand."
              />
              <Label>large dark</Label>
            </Col>
          </Col>
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
      </Section>
      <Section>
        <SubTitle>EtAssetCard</SubTitle>
        <Desc>Asset card built on EtMediaCard. Requires an `asset` object.</Desc>
        <PropsTable
          data={[
            { prop: 'asset', type: 'EtAssetCardAsset', default: '—' },
            { prop: 'size', type: '"small" | "medium" | "large"', default: '"small"' },
            { prop: 'variant', type: '"standard" | "bright" | "dark"', default: '"standard"' },
            { prop: 'label', type: 'string', default: '-' },
            { prop: 'headerEnd', type: 'ReactNode', default: '-' },
            { prop: 'eyebrow', type: 'string', default: '-' },
            { prop: 'title', type: 'string', default: '-' },
            { prop: 'description', type: 'string', default: '-' },
            { prop: 'backgroundImage', type: 'ImageSourcePropType', default: '-' },
            { prop: 'backgroundVideo', type: 'string', default: '-' },
            { prop: 'backgroundVideoPaused', type: 'boolean', default: 'false' },
            { prop: 'logoInFooter', type: 'boolean', default: 'auto (true with media)' },
            { prop: 'footerOverlay', type: '"media" | "muted"', default: 'by variant' },
            { prop: 'footerOverlayColor', type: 'string', default: '-' },
            { prop: 'footerOverlayOpacity', type: '0.1 | 0.15', default: '-' },
            { prop: 'footerStyle', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'contentBlur', type: 'boolean', default: 'auto' },
            { prop: 'onFooterPress', type: '() => void', default: '-' },
            { prop: 'onContentPress', type: '() => void', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: 'auto' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>
      <Section>
        <SubTitle>EtAssetCardAsset</SubTitle>
        <PropsTable
          data={[
            { prop: 'symbol', type: 'string', default: '—' },
            { prop: 'name', type: 'string', default: '-' },
            { prop: 'logoUrl', type: 'string', default: '—' },
            { prop: 'backgroundColor', type: 'string', default: 'from logoUrl' },
            { prop: 'price', type: 'number', default: '—' },
            { prop: 'currency', type: 'string', default: '-' },
            { prop: 'change', type: 'number', default: '-' },
            { prop: 'changePercent', type: 'number (ratio)', default: '—' },
          ]}
        />
      </Section>
    </Page>
  ),
};
