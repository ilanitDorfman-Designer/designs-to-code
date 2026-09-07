import type { Meta, StoryObj } from '@storybook/react-native';
import { EtInstrumentIsland, type IslandInstrument } from 'etoro-ui';
import { useState } from 'react';
import { CodeBlock, Desc, Page, Preview, PropsTable, Section, SubTitle, Title } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtInstrumentIsland>;

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const TRADER_AVATAR = 'https://etoro-cdn.etorostatic.com/avatars/150X150/918269/10.jpg';
const INSTRUMENT_AVATAR = 'https://etoro-cdn.etorostatic.com/market-avatars/7999/150x150.png';

const INSTRUMENTS: IslandInstrument[] = [
  { id: 'btc', symbol: 'BTC', label: 'Bitcoin', imageUrl: INSTRUMENT_AVATAR, fallback: '₿', backgroundColor: '#F7931A', accentColor: '#F7931A' },
  { id: 'aapl', symbol: 'AAPL', label: 'Apple Inc', fallback: '', backgroundColor: '#1D1D1F', accentColor: '#FFFFFF' },
  { id: 'googl', symbol: 'GOOGL', label: 'Alphabet', fallback: 'G', backgroundColor: '#4285F4', accentColor: '#4285F4' },
  { id: 'nvda', symbol: 'NVDA', label: 'NVIDIA', fallback: 'N', backgroundColor: '#76B900', accentColor: '#76B900' },
  { id: 'ivz', symbol: 'IVZ', label: 'Invesco', fallback: 'IV', backgroundColor: '#1B3D6D', accentColor: '#2E6BD6' },
  { id: 'tsla', symbol: 'TSLA', label: 'Tesla', fallback: 'T', backgroundColor: '#E31937', accentColor: '#E31937' },
];

const MIXED: IslandInstrument[] = [
  { id: 'sp500', symbol: 'SPX', label: 'S&P 500', fallback: 'S', backgroundColor: '#1B3D6D', accentColor: '#2E6BD6' },
  { id: 'jaynemesis', symbol: 'Jaynemesis', label: 'Jay Edward', imageUrl: TRADER_AVATAR, shape: 'circle', accentColor: '#9BEB1E' },
  { id: 'btc', symbol: 'BTC', label: 'Bitcoin', imageUrl: INSTRUMENT_AVATAR, fallback: '₿', backgroundColor: '#F7931A', accentColor: '#F7931A' },
  { id: 'aapl', symbol: 'AAPL', label: 'Apple Inc', fallback: '', backgroundColor: '#1D1D1F', accentColor: '#FFFFFF' },
  { id: 'nvda', symbol: 'NVDA', label: 'NVIDIA', fallback: 'N', backgroundColor: '#76B900', accentColor: '#76B900' },
];

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtInstrumentIsland> = {
  title: 'eToro-UI/Components/DataDisplay/EtInstrumentIsland',
  component: EtInstrumentIsland,
};

export default meta;

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: function BasicStory() {
    const [focusedId, setFocusedId] = useState('btc');

    return (
      <Page>
        <Section>
          <Title>Basic</Title>
          <Desc>
            A Dynamic-Island-style instrument switcher. Long-press the pill to expand it into the Liquid Glass island, swipe the rail to change focus,
            tap the centered item to activate it, and tap anywhere outside to collapse.
          </Desc>
          <Preview>
            <EtInstrumentIsland
              items={INSTRUMENTS}
              focusedId={focusedId}
              onFocusChange={setFocusedId}
              onItemPress={() => {}}
              accessibilityLabel="Instrument switcher"
            />
          </Preview>
          <CodeBlock
            code={`import { EtInstrumentIsland } from 'etoro-ui';

const [focusedId, setFocusedId] = useState('btc');

<EtInstrumentIsland
  items={[
    { id: 'btc', symbol: 'BTC', label: 'Bitcoin', imageUrl: btcLogo, accentColor: '#F7931A' },
    { id: 'aapl', symbol: 'AAPL', label: 'Apple Inc', accentColor: '#FFFFFF' },
    { id: 'nvda', symbol: 'NVDA', label: 'NVIDIA', accentColor: '#76B900' },
  ]}
  focusedId={focusedId}
  onFocusChange={setFocusedId}
  onItemPress={openInstrument}
/>`}
          />
        </Section>
      </Page>
    );
  },
};

export const StartExpanded: Story = {
  render: function StartExpandedStory() {
    const [focusedId, setFocusedId] = useState('aapl');

    return (
      <Page>
        <Section>
          <Title>Start Expanded</Title>
          <Desc>
            Use defaultExpanded to render the island already open — handy for inspecting the rail, the focused-item scale-up, the label, and the alive
            chromatic edge glow without long-pressing.
          </Desc>
          <Preview>
            <EtInstrumentIsland items={INSTRUMENTS} focusedId={focusedId} onFocusChange={setFocusedId} defaultExpanded />
          </Preview>
          <CodeBlock
            code={`import { EtInstrumentIsland } from 'etoro-ui';

<EtInstrumentIsland
  items={instruments}
  focusedId={focusedId}
  onFocusChange={setFocusedId}
  defaultExpanded
/>`}
          />
        </Section>
      </Page>
    );
  },
};

export const TradersAndInstruments: Story = {
  render: function MixedStory() {
    const [focusedId, setFocusedId] = useState('jaynemesis');

    return (
      <Page>
        <Section>
          <Title>Traders & Instruments</Title>
          <Desc>
            Items can mix instruments and people. Set shape: &apos;circle&apos; for traders (round avatar) and the default &apos;square&apos; for
            instruments. Each item&apos;s accentColor tints the edge glow when it is focused.
          </Desc>
          <Preview>
            <EtInstrumentIsland items={MIXED} focusedId={focusedId} onFocusChange={setFocusedId} defaultExpanded />
          </Preview>
          <CodeBlock
            code={`import { EtInstrumentIsland } from 'etoro-ui';

<EtInstrumentIsland
  items={[
    { id: 'jay', symbol: 'Jaynemesis', label: 'Jay Edward', imageUrl: photo, shape: 'circle', accentColor: '#9BEB1E' },
    { id: 'btc', symbol: 'BTC', label: 'Bitcoin', imageUrl: btcLogo, shape: 'square', accentColor: '#F7931A' },
  ]}
  focusedId={focusedId}
  onFocusChange={setFocusedId}
/>`}
          />
        </Section>
      </Page>
    );
  },
};

export const WithoutGlow: Story = {
  render: function NoGlowStory() {
    const [focusedId, setFocusedId] = useState('nvda');

    return (
      <Page>
        <Section>
          <Title>Without Glow</Title>
          <Desc>
            Set glow to false to disable the Skia chromatic edge glow — useful on lower-end devices or when the surrounding UI already provides
            emphasis. The Liquid Glass surface and morph animation are unaffected.
          </Desc>
          <Preview>
            <EtInstrumentIsland items={INSTRUMENTS} focusedId={focusedId} onFocusChange={setFocusedId} glow={false} defaultExpanded />
          </Preview>
          <CodeBlock
            code={`import { EtInstrumentIsland } from 'etoro-ui';

<EtInstrumentIsland
  items={instruments}
  focusedId={focusedId}
  onFocusChange={setFocusedId}
  glow={false}
/>`}
          />
        </Section>
      </Page>
    );
  },
};

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtInstrumentIsland</SubTitle>
        <Desc>
          Data-driven Dynamic-Island-style switcher. It renders the items it is handed and reports focus / activation / expansion via callbacks.
        </Desc>
        <PropsTable
          data={[
            { prop: 'items', type: 'IslandInstrument[]', default: 'required' },
            { prop: 'focusedId', type: 'string', default: '-' },
            { prop: 'defaultFocusedId', type: 'string', default: 'first item' },
            { prop: 'onFocusChange', type: '(id: string) => void', default: '-' },
            { prop: 'onItemPress', type: '(id: string) => void', default: '-' },
            { prop: 'isExpanded', type: 'boolean', default: '-' },
            { prop: 'defaultExpanded', type: 'boolean', default: 'false' },
            { prop: 'onExpandedChange', type: '(expanded: boolean) => void', default: '-' },
            { prop: 'expandedWidth', type: 'number', default: 'screen-based' },
            { prop: 'glow', type: 'boolean', default: 'true' },
            { prop: 'haptics', type: 'boolean', default: 'true' },
            { prop: 'dismissOnOutsidePress', type: 'boolean', default: 'true' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-' },
            { prop: 'accessibilityLabel', type: 'string', default: '-' },
            { prop: 'testID', type: 'string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>IslandInstrument</SubTitle>
        <Desc>A single instrument or trader entry. Keep entries primitive and pre-resolved — the island never fetches or derives data.</Desc>
        <PropsTable
          data={[
            { prop: 'id', type: 'string', default: 'required' },
            { prop: 'symbol', type: 'string', default: 'required' },
            { prop: 'label', type: 'string', default: 'symbol' },
            { prop: 'imageUrl', type: 'string', default: '-' },
            { prop: 'fallback', type: 'string', default: '-' },
            { prop: 'backgroundColor', type: 'string', default: '-' },
            { prop: 'shape', type: '"square" | "circle"', default: '"square"' },
            { prop: 'accentColor', type: 'string', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};
