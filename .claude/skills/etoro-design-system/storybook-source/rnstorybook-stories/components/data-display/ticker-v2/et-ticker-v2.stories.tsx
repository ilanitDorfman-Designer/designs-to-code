import type { Meta, StoryObj } from '@storybook/react-native';
import { Pressable, View } from 'react-native';
import { EtTicker } from '../../../../../libs/etoro-ui/src/components/data-display/ticker-v2';
import type { TickerItem } from '../../../../../libs/etoro-ui/src/components/data-display/ticker-v2/api/types';
import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtTicker>;

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const stockTickerData: TickerItem[] = [
  { instrumentId: 1, name: 'AAPL', currentPrice: 186.79, dailyChange: 2.1, navigationUrl: '/instruments/1' },
  { instrumentId: 2, name: 'TSLA', currentPrice: 245.67, dailyChange: -1.2, navigationUrl: '/instruments/2' },
  { instrumentId: 3, name: 'GOOGL', currentPrice: 2820.45, dailyChange: 0.8, navigationUrl: '/instruments/3' },
  { instrumentId: 4, name: 'MSFT', currentPrice: 415.26, dailyChange: 1.1, navigationUrl: '/instruments/4' },
  { instrumentId: 5, name: 'AMZN', currentPrice: 3456.78, dailyChange: -0.5, navigationUrl: '/instruments/5' },
];

const cryptoTickerData: TickerItem[] = [
  { instrumentId: 10, name: 'BTC', currentPrice: 45230.67, dailyChange: 4.2, navigationUrl: '/instruments/10', currencySymbol: '$' },
  { instrumentId: 11, name: 'ETH', currentPrice: 3125.45, dailyChange: -2.8, navigationUrl: '/instruments/11', currencySymbol: '$' },
  { instrumentId: 12, name: 'BNB', currentPrice: 485.23, dailyChange: 12.6, navigationUrl: '/instruments/12', currencySymbol: '$' },
  { instrumentId: 13, name: 'SOL', currentPrice: 98.76, dailyChange: 8.1, navigationUrl: '/instruments/13', currencySymbol: '$' },
  {
    instrumentId: 14,
    name: 'ADA',
    currentPrice: 0.845,
    dailyChange: -15.3,
    navigationUrl: '/instruments/14',
    currencySymbol: '$',
    minPrecision: 3,
    maxPrecision: 3,
  },
];

const multiCurrencyData: TickerItem[] = [
  {
    instrumentId: 30,
    name: 'EUR/USD',
    currentPrice: 1.0876,
    dailyChange: 0.3,
    navigationUrl: '/forex/eurusd',
    currencySymbol: '',
    minPrecision: 4,
    maxPrecision: 4,
  },
  {
    instrumentId: 31,
    name: 'GBP/USD',
    currentPrice: 1.2654,
    dailyChange: -0.5,
    navigationUrl: '/forex/gbpusd',
    currencySymbol: '',
    minPrecision: 4,
    maxPrecision: 4,
  },
  {
    instrumentId: 32,
    name: 'GOLD',
    currentPrice: 2015.5,
    dailyChange: 1.8,
    navigationUrl: '/commodities/gold',
    currencySymbol: '$',
    minPrecision: 2,
    maxPrecision: 2,
  },
  {
    instrumentId: 33,
    name: 'SILVER',
    currentPrice: 23.45,
    dailyChange: -0.7,
    navigationUrl: '/commodities/silver',
    currencySymbol: '$',
    minPrecision: 2,
    maxPrecision: 2,
  },
  { instrumentId: 34, name: 'CAC 40', currentPrice: 7456.32, dailyChange: 0.9, navigationUrl: '/indices/cac40', currencySymbol: '€' },
  { instrumentId: 35, name: 'FTSE 100', currentPrice: 7789.45, dailyChange: 1.2, navigationUrl: '/indices/ftse', currencySymbol: '£' },
];

// Multi-currency showcase with diverse symbols
const internationalMarketsData: TickerItem[] = [
  { instrumentId: 201, name: 'S&P 500', currentPrice: 4567.89, dailyChange: 0.8, navigationUrl: '/indices/sp500', currencySymbol: '$' },
  { instrumentId: 202, name: 'DAX', currentPrice: 15876.32, dailyChange: 1.2, navigationUrl: '/indices/dax', currencySymbol: '€' },
  { instrumentId: 203, name: 'Nikkei 225', currentPrice: 32456, dailyChange: -0.5, navigationUrl: '/indices/nikkei', currencySymbol: '¥' },
  { instrumentId: 204, name: 'FTSE 100', currentPrice: 7789.45, dailyChange: 0.6, navigationUrl: '/indices/ftse', currencySymbol: '£' },
  { instrumentId: 205, name: 'SMI', currentPrice: 11234.56, dailyChange: 0.3, navigationUrl: '/indices/smi', currencySymbol: 'CHF' },
  { instrumentId: 206, name: 'Sensex', currentPrice: 65432.78, dailyChange: 2.1, navigationUrl: '/indices/sensex', currencySymbol: '₹' },
  { instrumentId: 207, name: 'TSX', currentPrice: 20123.45, dailyChange: -0.4, navigationUrl: '/indices/tsx', currencySymbol: 'C$' },
  { instrumentId: 208, name: 'ASX 200', currentPrice: 7234.56, dailyChange: 0.9, navigationUrl: '/indices/asx', currencySymbol: 'A$' },
];

const singleItemData: TickerItem[] = [{ instrumentId: 20, name: 'NVIDIA', currentPrice: 875.23, dailyChange: 7.3, navigationUrl: '/instruments/20' }];

const manyItemsData: TickerItem[] = [
  { instrumentId: 1, name: 'AAPL', currentPrice: 186.79, dailyChange: 2.1, navigationUrl: '/instruments/1' },
  { instrumentId: 4, name: 'MSFT', currentPrice: 415.26, dailyChange: 1.1, navigationUrl: '/instruments/4' },
  { instrumentId: 3, name: 'GOOGL', currentPrice: 2820.45, dailyChange: 0.8, navigationUrl: '/instruments/3' },
  { instrumentId: 5, name: 'AMZN', currentPrice: 3456.78, dailyChange: -0.5, navigationUrl: '/instruments/5' },
  { instrumentId: 2, name: 'TSLA', currentPrice: 245.67, dailyChange: -1.2, navigationUrl: '/instruments/2' },
  { instrumentId: 30, name: 'META', currentPrice: 345.67, dailyChange: -5.7, navigationUrl: '/instruments/30' },
  { instrumentId: 31, name: 'NVDA', currentPrice: 875.23, dailyChange: 7.3, navigationUrl: '/instruments/31' },
  { instrumentId: 32, name: 'NFLX', currentPrice: 456.78, dailyChange: 3.2, navigationUrl: '/instruments/32' },
  { instrumentId: 33, name: 'AMD', currentPrice: 123.45, dailyChange: -2.1, navigationUrl: '/instruments/33' },
  { instrumentId: 34, name: 'CRM', currentPrice: 234.56, dailyChange: 1.8, navigationUrl: '/instruments/34' },
];

const bullishData: TickerItem[] = [
  { instrumentId: 100, name: 'TECH', currentPrice: 156.79, dailyChange: 8.2, navigationUrl: '/instruments/100' },
  { instrumentId: 101, name: 'GROWTH', currentPrice: 245.67, dailyChange: 12.1, navigationUrl: '/instruments/101' },
  { instrumentId: 102, name: 'MOMENTUM', currentPrice: 820.45, dailyChange: 15.8, navigationUrl: '/instruments/102' },
  { instrumentId: 103, name: 'INNOVATION', currentPrice: 415.26, dailyChange: 6.5, navigationUrl: '/instruments/103' },
];

const bearishData: TickerItem[] = [
  { instrumentId: 200, name: 'VALUE', currentPrice: 86.79, dailyChange: -8.2, navigationUrl: '/instruments/200' },
  { instrumentId: 201, name: 'UTILITIES', currentPrice: 45.67, dailyChange: -12.1, navigationUrl: '/instruments/201' },
  { instrumentId: 202, name: 'ENERGY', currentPrice: 120.45, dailyChange: -15.8, navigationUrl: '/instruments/202' },
  { instrumentId: 203, name: 'MATERIALS', currentPrice: 215.26, dailyChange: -6.5, navigationUrl: '/instruments/203' },
];

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtTicker> = {
  title: 'eToro-UI/Components/DataDisplay/EtTicker V2',
  component: EtTicker,
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
          Pass an array of TickerItem objects and the component handles everything: infinite scrolling, formatting, gradient edges, and gesture
          support.
        </Desc>
        <Preview>
          <EtTicker items={stockTickerData} />
        </Preview>
        <CodeBlock
          code={`import { EtTicker } from 'etoro-ui';

<EtTicker items={tickerData} />`}
        />
      </Section>
    </Page>
  ),
};

export const WithStartSlot: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>With Start Slot</Title>
        <Desc>
          Use EtTicker.Start to place fixed content (e.g. filter icon) before the scrolling area. Includes a vertical dot divider by default (opt out
          with divider=false).
        </Desc>
        <Preview>
          <EtTicker speed={0.25}>
            <EtTicker.Start>
              <Pressable onPress={() => console.log('Sort/filter pressed')} hitSlop={8}>
                <EtTicker.FilterIcon />
              </Pressable>
            </EtTicker.Start>
            <EtTicker.Gradient>
              <EtTicker.Marquee withGesture>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <EtTicker.Content items={stockTickerData} />
                </View>
              </EtTicker.Marquee>
            </EtTicker.Gradient>
          </EtTicker>
        </Preview>
        <CodeBlock
          code={`// Compound mode — EtTicker.Start
<EtTicker speed={0.25}>
  <EtTicker.Start>
    <Pressable onPress={openSortMenu} hitSlop={8}>
      <EtTicker.FilterIcon />
    </Pressable>
  </EtTicker.Start>
  <EtTicker.Gradient>
    <EtTicker.Marquee withGesture>
      <EtTicker.Content items={tickerData} />
    </EtTicker.Marquee>
  </EtTicker.Gradient>
</EtTicker>`}
        />
      </Section>
    </Page>
  ),
};

export const AnimationSpeeds: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Animation Speeds</Title>
        <Desc>Control scroll speed with the speed prop. Higher values scroll faster.</Desc>
      </Section>

      <Section>
        <SubTitle>Fast (1.2) - Breaking News</SubTitle>
        <Preview>
          <EtTicker items={stockTickerData} speed={1.2} />
        </Preview>
      </Section>

      <Section>
        <SubTitle>Standard (0.5)</SubTitle>
        <Preview>
          <EtTicker items={stockTickerData} speed={0.5} />
        </Preview>
      </Section>

      <Section>
        <SubTitle>Default (0.25) - Easy Reading</SubTitle>
        <Preview>
          <EtTicker items={stockTickerData} speed={0.25} />
        </Preview>
        <CodeBlock
          code={`import { EtTicker } from 'etoro-ui';

// Fast - breaking news
<EtTicker items={data} speed={1.2} />

// Standard
<EtTicker items={data} speed={0.5} />

// Default - easy reading
<EtTicker items={data} speed={0.25} />`}
        />
      </Section>
    </Page>
  ),
};

export const AssetTypes: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Asset Types</Title>
        <Desc>Works with any financial instrument. Use currencySymbol, minPrecision, and maxPrecision on each TickerItem for full control.</Desc>
      </Section>

      <Section>
        <SubTitle>Stocks</SubTitle>
        <Preview>
          <EtTicker items={stockTickerData} speed={0.5} />
        </Preview>
      </Section>

      <Section>
        <SubTitle>Crypto</SubTitle>
        <Preview>
          <EtTicker items={cryptoTickerData} speed={0.5} />
        </Preview>
      </Section>

      <Section>
        <SubTitle>Multi-Currency (Forex, Commodities, Indices)</SubTitle>
        <Preview>
          <EtTicker items={multiCurrencyData} speed={0.4} />
        </Preview>
        <CodeBlock
          code={`import { EtTicker, TickerItem } from 'etoro-ui';

const forexData: TickerItem[] = [
  {
    instrumentId: 30,
    name: 'EUR/USD',
    currentPrice: 1.0876,
    dailyChange: 0.3,
    navigationUrl: '/forex/eurusd',
    currencySymbol: '',
    minPrecision: 4,
    maxPrecision: 4,
  },
];

<EtTicker items={forexData} />`}
        />
      </Section>
    </Page>
  ),
};

export const ContentVolume: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Content Volume</Title>
        <Desc>Handles any number of items gracefully. The marquee clones content to fill the available width.</Desc>
      </Section>

      <Section>
        <SubTitle>Single Item</SubTitle>
        <Preview>
          <EtTicker items={singleItemData} speed={0.7} />
        </Preview>
      </Section>

      <Section>
        <SubTitle>Many Items (10 stocks)</SubTitle>
        <Preview>
          <EtTicker items={manyItemsData} speed={0.5} />
        </Preview>
      </Section>
    </Page>
  ),
};

export const MarketSentiment: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Market Sentiment</Title>
        <Desc>Change colors are driven by the theme: green for positive, red for negative.</Desc>
      </Section>

      <Section>
        <SubTitle>Bullish - All Green</SubTitle>
        <Preview>
          <EtTicker items={bullishData} speed={0.6} />
        </Preview>
      </Section>

      <Section>
        <SubTitle>Bearish - All Red</SubTitle>
        <Preview>
          <EtTicker items={bearishData} speed={0.6} />
        </Preview>
      </Section>
    </Page>
  ),
};

export const MultiCurrency: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Multi-Currency Support</Title>
        <Desc>
          Each ticker item can display a different currency symbol. Use currencySymbol to specify $, €, £, ¥, or any other symbol. Perfect for
          international markets, forex pairs, and global indices.
        </Desc>
      </Section>

      <Section>
        <SubTitle>International Market Indices</SubTitle>
        <Desc>Global indices with their native currencies: USD, EUR, JPY, GBP, CHF, INR, CAD, AUD</Desc>
        <Preview>
          <EtTicker items={internationalMarketsData} speed={0.5} />
        </Preview>
        <CodeBlock
          code={`import { EtTicker, TickerItem } from 'etoro-ui';

const internationalMarkets: TickerItem[] = [
  { 
    instrumentId: 201, 
    name: 'S&P 500', 
    currentPrice: 4567.89, 
    dailyChange: 0.8, 
    navigationUrl: '/indices/sp500', 
    currencySymbol: '$'    // USD
  },
  { 
    instrumentId: 202, 
    name: 'DAX', 
    currentPrice: 15876.32, 
    dailyChange: 1.2, 
    navigationUrl: '/indices/dax', 
    currencySymbol: '€'    // EUR
  },
  { 
    instrumentId: 203, 
    name: 'Nikkei 225', 
    currentPrice: 32456, 
    dailyChange: -0.5, 
    navigationUrl: '/indices/nikkei', 
    currencySymbol: '¥'    // JPY
  },
  { 
    instrumentId: 204, 
    name: 'FTSE 100', 
    currentPrice: 7789.45, 
    dailyChange: 0.6, 
    navigationUrl: '/indices/ftse', 
    currencySymbol: '£'    // GBP
  },
];

<EtTicker items={internationalMarkets} speed={0.5} />`}
        />
      </Section>

      <Section>
        <SubTitle>Mixed Asset Classes</SubTitle>
        <Desc>Combine different currencies in one ticker: forex pairs (no symbol), commodities ($), and European indices (€, £)</Desc>
        <Preview>
          <EtTicker items={multiCurrencyData} speed={0.4} />
        </Preview>
        <CodeBlock
          code={`import { EtTicker, TickerItem } from 'etoro-ui';

const mixedAssets: TickerItem[] = [
  {
    // Forex pair - no currency symbol
    instrumentId: 30,
    name: 'EUR/USD',
    currentPrice: 1.0876,
    dailyChange: 0.3,
    navigationUrl: '/forex/eurusd',
    currencySymbol: '',      // Empty for forex pairs
    minPrecision: 4,
    maxPrecision: 4,
  },
  {
    // Commodity - USD
    instrumentId: 32,
    name: 'GOLD',
    currentPrice: 2015.5,
    dailyChange: 1.8,
    navigationUrl: '/commodities/gold',
    currencySymbol: '$',     // USD
  },
  {
    // European index - EUR
    instrumentId: 34,
    name: 'CAC 40',
    currentPrice: 7456.32,
    dailyChange: 0.9,
    navigationUrl: '/indices/cac40',
    currencySymbol: '€',     // EUR
  },
];

<EtTicker items={mixedAssets} />`}
        />
      </Section>

      <Section>
        <SubTitle>Crypto with Custom Symbols</SubTitle>
        <Desc>Use any Unicode symbol, including cryptocurrency symbols</Desc>
        <Preview>
          <EtTicker
            items={[
              { instrumentId: 301, name: 'BTC/USD', currentPrice: 45230.67, dailyChange: 4.2, navigationUrl: '/crypto/btc', currencySymbol: '₿' },
              { instrumentId: 302, name: 'ETH/USD', currentPrice: 3125.45, dailyChange: -2.8, navigationUrl: '/crypto/eth', currencySymbol: 'Ξ' },
              { instrumentId: 303, name: 'USDT', currentPrice: 1.0001, dailyChange: 0.01, navigationUrl: '/crypto/usdt', currencySymbol: '₮' },
              { instrumentId: 304, name: 'BNB/USD', currentPrice: 485.23, dailyChange: 12.6, navigationUrl: '/crypto/bnb', currencySymbol: 'Ⓑ' },
            ]}
            speed={0.6}
          />
        </Preview>
        <CodeBlock
          code={`import { EtTicker } from 'etoro-ui';

<EtTicker
  items={[
    { 
      name: 'BTC/USD', 
      currentPrice: 45230.67, 
      currencySymbol: '₿'    // Bitcoin symbol
    },
    { 
      name: 'ETH/USD', 
      currentPrice: 3125.45, 
      currencySymbol: 'Ξ'    // Ethereum symbol
    },
  ]}
/>`}
        />
      </Section>
    </Page>
  ),
};

export const GradientComparison: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Gradient Options</Title>
        <Desc>Edge gradients fade content smoothly. They use MaskedView so they work on any background color.</Desc>
      </Section>

      <Section>
        <SubTitle>With Gradient (default)</SubTitle>
        <Preview>
          <EtTicker items={stockTickerData} />
        </Preview>
      </Section>

      <Section>
        <SubTitle>Without Gradient</SubTitle>
        <Preview>
          <EtTicker items={stockTickerData} gradient={false} />
        </Preview>
        <CodeBlock
          code={`import { EtTicker } from 'etoro-ui';

// Gradient enabled (default)
<EtTicker items={data} />

// Gradient disabled
<EtTicker items={data} gradient={false} />`}
        />
      </Section>
    </Page>
  ),
};

export const Accessibility: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Accessibility</Title>
        <Desc>
          EtTicker auto-generates a descriptive label based on item count. Each item gets its own label, e.g. "NVIDIA at $875.23, up 7.30 percent".
        </Desc>
      </Section>

      <Section>
        <SubTitle>Default (auto-generated label)</SubTitle>
        <Desc>Reads as: "Financial ticker displaying 5 stocks with prices and changes"</Desc>
        <Preview>
          <EtTicker items={stockTickerData} speed={0.5} />
        </Preview>
      </Section>

      <Section>
        <SubTitle>Custom Labels</SubTitle>
        <Desc>Override with accessibilityLabel, accessibilityHint, and testID.</Desc>
        <Preview>
          <EtTicker
            items={cryptoTickerData}
            speed={0.7}
            accessibilityLabel="Live cryptocurrency prices and 24-hour changes"
            accessibilityHint="Swipe left or right to pause scrolling"
            testID="crypto-ticker-demo"
          />
        </Preview>
        <CodeBlock
          code={`import { EtTicker } from 'etoro-ui';

<EtTicker
  items={cryptoData}
  accessibilityLabel="Live cryptocurrency prices"
  accessibilityHint="Swipe left or right to pause scrolling"
  testID="crypto-ticker"
/>`}
        />
      </Section>

      <Section>
        <SubTitle>Item-level Labels</SubTitle>
        <Desc>Each EtTicker.Item reads as: "NVIDIA at $875.23, up 7.30 percent"</Desc>
        <Preview>
          <EtTicker items={singleItemData} speed={0.4} testID="single-stock-ticker" />
        </Preview>
      </Section>
    </Page>
  ),
};

export const CompoundAPI: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Compound API</Title>
        <Desc>
          For advanced customization, pass children instead of items. Compose EtTicker.Gradient, EtTicker.Marquee, and EtTicker.Content for full
          control. Speed is inherited from EtTicker via context.
        </Desc>
        <Preview>
          <EtTicker speed={0.5}>
            <EtTicker.Gradient>
              <EtTicker.Marquee withGesture>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <EtTicker.Content items={stockTickerData} />
                </View>
              </EtTicker.Marquee>
            </EtTicker.Gradient>
          </EtTicker>
        </Preview>
        <CodeBlock
          code={`import { EtTicker } from 'etoro-ui';
import { View } from 'react-native';

<EtTicker speed={0.5}>
  <EtTicker.Gradient>
    <EtTicker.Marquee withGesture>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <EtTicker.Content items={data} />
      </View>
    </EtTicker.Marquee>
  </EtTicker.Gradient>
</EtTicker>`}
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
        <SubTitle>EtTicker</SubTitle>
        <Desc>Root component. Provides context and renders either simple or compound mode.</Desc>
        <PropsTable
          data={[
            { prop: 'items', type: 'TickerItem[]', default: '-', description: 'Data for simple mode; ignored when children are provided' },
            { prop: 'speed', type: 'number', default: '0.25', description: 'Animation speed multiplier (higher = faster)' },
            { prop: 'gradient', type: 'boolean', default: 'true', description: 'Edge fade effect (simple mode only)' },
            { prop: 'onItemPress', type: '(item: TickerItem) => void', default: '-', description: 'Callback when a ticker item name is pressed' },
            { prop: 'children', type: 'ReactNode', default: '-', description: 'Compound children (overrides items and gradient)' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: 'auto-generated' },
            { prop: 'accessibilityHint', type: 'string', default: '"Swipe to interact..."' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>TickerItem (data model)</SubTitle>
        <Desc>Shape of each item in the items array.</Desc>
        <PropsTable
          data={[
            { prop: 'instrumentId', type: 'number', default: '-', description: 'Unique identifier' },
            { prop: 'name', type: 'string', default: '-', description: 'Display name (e.g. AAPL)' },
            { prop: 'currentPrice', type: 'number', default: '-', description: 'Current price value' },
            { prop: 'dailyChange', type: 'number', default: '-', description: 'Daily change percentage' },
            { prop: 'navigationUrl', type: 'string', default: '-', description: 'Navigation target URL' },
            { prop: 'currencySymbol', type: 'string', default: '"$"', description: 'Currency symbol to prepend' },
            { prop: 'minPrecision', type: 'number', default: 'auto', description: 'Minimum decimal places' },
            { prop: 'maxPrecision', type: 'number', default: 'auto', description: 'Maximum decimal places' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTicker.Content</SubTitle>
        <Desc>Renders all items with separators. Use inside EtTicker.Marquee for infinite scrolling.</Desc>
        <PropsTable data={[{ prop: 'items', type: 'TickerItem[]', default: '-', description: 'Array of items to render' }]} />
      </Section>

      <Section>
        <SubTitle>EtTicker.Gradient</SubTitle>
        <Desc>Opacity mask wrapper that creates fade-to-transparent edges on both sides. Works on any background color.</Desc>
        <PropsTable
          data={[
            { prop: 'width', type: 'number', default: '30', description: 'Width of each gradient edge in pixels' },
            { prop: 'rightOnly', type: 'boolean', default: 'false', description: 'Only render right fade (for advanced compound mode)' },
            { prop: 'children', type: 'ReactNode', default: '-', description: 'Content to mask' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTicker.Marquee</SubTitle>
        <Desc>Infinite horizontal scrolling animation wrapper with gesture support. Speed is inherited from EtTicker context.</Desc>
        <PropsTable
          data={[
            { prop: 'spacing', type: 'number', default: '0', description: 'Space between cloned content sections' },
            { prop: 'reverse', type: 'boolean', default: 'false', description: 'Reverse scroll direction' },
            { prop: 'withGesture', type: 'boolean', default: 'false', description: 'Enable drag-to-scroll gesture' },
            { prop: 'style', type: 'ViewStyle', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTicker.Start / EtTicker.End</SubTitle>
        <Desc>
          Fixed slots at the start or end of the ticker row. Use in compound mode for full composability. Includes a vertical dot divider by default.
        </Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-', description: 'Content to render in the slot' },
            { prop: 'divider', type: 'boolean', default: 'true', description: 'Show vertical dot divider between slot and content' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Additional styles for the slot wrapper' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtTicker.FilterIcon</SubTitle>
        <Desc>Convenience icon for Start/End slots. Uses the sortDescending icon at size 18.</Desc>
      </Section>
    </Page>
  ),
};
