import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAssetItem, EtButton, EtSwipeableRow, EtoroIcon } from 'etoro-ui';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

import { CodeBlock, Desc, Page, PropsTable, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

import { mockAssets } from './mock-assets';

type Story = StoryObj<typeof EtAssetItem>;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Bordered wrapper so list demos are clearly visible against the page. */
function ListDemo({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: c.borderSubtle,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 12,
      }}
    >
      {children}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const APPLE_LOGO = 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg';

const MOCK_PRICES = [
  { symbol: 'BTC', name: 'Bitcoin', logo: APPLE_LOGO, price: '$45,230.00', change: '+2,150.30 (+4.98%)', sentiment: 'positive' as const },
  { symbol: 'GOOG', name: 'Alphabet', logo: APPLE_LOGO, price: '$186.79', change: '1.95 (-1.03%)', sentiment: 'negative' as const },
  { symbol: 'META', name: 'Meta Platform Inc', logo: APPLE_LOGO, price: '$502.10', change: '0.00 (0.00%)', sentiment: 'neutral' as const },
  { symbol: 'TSLA', name: 'Tesla Motors, Inc', logo: APPLE_LOGO, price: '$245.67', change: '12.34 (+5.29%)', sentiment: 'positive' as const },
];

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EtAssetItem> = {
  title: 'eToro-UI/Components/List/EtAssetItem',
  component: EtAssetItem,
};

export default meta;

// ─────────────────────────────────────────────────────────────
// 1. Basic
// ─────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Basic</Title>
        <Desc>
          A tailored, asset-focused list item built with a compound API. Compose a row using EtAssetItem.Logo, EtAssetItem.Content,
          EtAssetItem.Symbol, EtAssetItem.Name, EtAssetItem.Price, and EtAssetItem.Change.
        </Desc>
        <ListDemo>
          <EtAssetItem onPress={() => undefined}>
            <EtAssetItem.Logo source={APPLE_LOGO} />
            <EtAssetItem.Content>
              <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
              <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
            </EtAssetItem.Content>
            <EtAssetItem.Price value="$186.79" />
            <EtAssetItem.Change value="1.95 (-1.03%)" sentiment="negative" />
          </EtAssetItem>
        </ListDemo>
        <CodeBlock
          code={`import { EtAssetItem } from 'etoro-ui';

<EtAssetItem onPress={openAsset}>
  <EtAssetItem.Logo source={asset.logoUri} />
  <EtAssetItem.Content>
    <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
    <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
  </EtAssetItem.Content>
  <EtAssetItem.Price value="$186.79" />
  <EtAssetItem.Change value="1.95 (-1.03%)" sentiment="negative" />
</EtAssetItem>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 2. Sizes
// ─────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Sizes</Title>
        <Desc>
          Two sizes are supported. large (default) uses X4 vertical padding and a 36px logo. small uses X3 vertical padding and a 24px logo.
        </Desc>
      </Section>

      <Section>
        <SubTitle>Large (default)</SubTitle>
        <ListDemo>
          <EtAssetItem size="large">
            <EtAssetItem.Logo source={APPLE_LOGO} />
            <EtAssetItem.Content>
              <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
              <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
            </EtAssetItem.Content>
            <EtAssetItem.Price value="$186.79" />
            <EtAssetItem.Change value="1.95 (-1.03%)" sentiment="negative" />
          </EtAssetItem>
        </ListDemo>
      </Section>

      <Section>
        <SubTitle>Small</SubTitle>
        <ListDemo>
          <EtAssetItem size="small">
            <EtAssetItem.Logo source={APPLE_LOGO} />
            <EtAssetItem.Content>
              <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
              <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
            </EtAssetItem.Content>
            <EtAssetItem.Price value="$186.79" />
            <EtAssetItem.Change value="1.95 (-1.03%)" sentiment="negative" />
          </EtAssetItem>
        </ListDemo>
        <CodeBlock
          code={`<EtAssetItem size="small">
  <EtAssetItem.Logo source={asset.logoUri} />
  <EtAssetItem.Content>
    <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
    <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
  </EtAssetItem.Content>
  <EtAssetItem.Price value="$186.79" />
  <EtAssetItem.Change value="1.95 (-1.03%)" sentiment="negative" />
</EtAssetItem>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 3. Variants
// ─────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Variants</Title>
        <Desc>
          The compound API lets you opt into the parts you need. Below are common compositions: minimal (logo + symbol), with a name, with
          price/change, and with a trailing CTA.
        </Desc>
      </Section>

      <Section>
        <SubTitle>Minimal — Logo + Symbol</SubTitle>
        <ListDemo>
          <EtAssetItem>
            <EtAssetItem.Logo source={APPLE_LOGO} />
            <EtAssetItem.Content>
              <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
            </EtAssetItem.Content>
          </EtAssetItem>
        </ListDemo>
      </Section>

      <Section>
        <SubTitle>With Name</SubTitle>
        <ListDemo>
          <EtAssetItem>
            <EtAssetItem.Logo source={APPLE_LOGO} />
            <EtAssetItem.Content>
              <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
              <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
            </EtAssetItem.Content>
          </EtAssetItem>
        </ListDemo>
      </Section>

      <Section>
        <SubTitle>With Price &amp; Change</SubTitle>
        <ListDemo>
          {MOCK_PRICES.slice(0, 3).map((asset, idx) => (
            <React.Fragment key={asset.symbol}>
              <EtAssetItem>
                <EtAssetItem.Logo source={asset.logo} />
                <EtAssetItem.Content>
                  <EtAssetItem.Symbol>{asset.symbol}</EtAssetItem.Symbol>
                  <EtAssetItem.Name>{asset.name}</EtAssetItem.Name>
                </EtAssetItem.Content>
                <EtAssetItem.Price value={asset.price} />
                <EtAssetItem.Change value={asset.change} sentiment={asset.sentiment} />
                {idx < 2 && <EtAssetItem.Divider />}
              </EtAssetItem>
            </React.Fragment>
          ))}
        </ListDemo>
      </Section>

      <Section>
        <SubTitle>With Trailing CTA</SubTitle>
        <Desc>Use EtAssetItem.Trailing for any right-side content (button, icon, etc.). It replaces the legacy rightElement prop.</Desc>
        <ListDemo>
          <EtAssetItem>
            <EtAssetItem.Logo source={APPLE_LOGO} />
            <EtAssetItem.Content>
              <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
              <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
            </EtAssetItem.Content>
            <EtAssetItem.Trailing>
              <EtButton variant="primary-subtle" size="small" onPress={() => Alert.alert('Trade AAPL')}>
                <EtButton.Label>Trade</EtButton.Label>
              </EtButton>
            </EtAssetItem.Trailing>
          </EtAssetItem>
        </ListDemo>
        <CodeBlock
          code={`<EtAssetItem>
  <EtAssetItem.Logo source={asset.logoUri} />
  <EtAssetItem.Content>
    <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
    <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
  </EtAssetItem.Content>
  <EtAssetItem.Trailing>
    <EtButton variant="primary-subtle" size="small" onPress={trade}>
      <EtButton.Label>Trade</EtButton.Label>
    </EtButton>
  </EtAssetItem.Trailing>
</EtAssetItem>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 4. Label
// ─────────────────────────────────────────────────────────────

export const Label: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Label</Title>
        <Desc>
          Use EtAssetItem.Label for an opinionated middle-slot pill. Internally renders EtBadge with size="small". Choose a color from the design
          system to keep labels consistent.
        </Desc>
        <ListDemo>
          <EtAssetItem>
            <EtAssetItem.Logo source={APPLE_LOGO} />
            <EtAssetItem.Content>
              <EtAssetItem.Symbol>META</EtAssetItem.Symbol>
              <EtAssetItem.Name>Meta Platform Inc</EtAssetItem.Name>
            </EtAssetItem.Content>
            <EtAssetItem.Label color="neutral">Edited</EtAssetItem.Label>
            <EtAssetItem.Divider />
          </EtAssetItem>
          <EtAssetItem>
            <EtAssetItem.Logo source={APPLE_LOGO} />
            <EtAssetItem.Content>
              <EtAssetItem.Symbol>BTC</EtAssetItem.Symbol>
              <EtAssetItem.Name>Bitcoin</EtAssetItem.Name>
            </EtAssetItem.Content>
            <EtAssetItem.Label color="green">Hot</EtAssetItem.Label>
            <EtAssetItem.Price value="$45,230.00" />
          </EtAssetItem>
        </ListDemo>
        <CodeBlock
          code={`<EtAssetItem>
  <EtAssetItem.Logo source={asset.logoUri} />
  <EtAssetItem.Content>
    <EtAssetItem.Symbol>META</EtAssetItem.Symbol>
    <EtAssetItem.Name>Meta Platform Inc</EtAssetItem.Name>
  </EtAssetItem.Content>
  <EtAssetItem.Label color="neutral">Edited</EtAssetItem.Label>
</EtAssetItem>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 5. States
// ─────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>States</Title>
        <Desc>Disabled rows lower opacity and skip press handling. Loading rows render the skeleton placeholder.</Desc>
      </Section>

      <Section>
        <SubTitle>Disabled</SubTitle>
        <ListDemo>
          <EtAssetItem disabled onPress={() => undefined}>
            <EtAssetItem.Logo source={APPLE_LOGO} />
            <EtAssetItem.Content>
              <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
              <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
            </EtAssetItem.Content>
            <EtAssetItem.Price value="$186.79" />
            <EtAssetItem.Change value="1.95 (-1.03%)" sentiment="negative" />
          </EtAssetItem>
        </ListDemo>
      </Section>

      <Section>
        <SubTitle>Loading — 2-lines</SubTitle>
        <ListDemo>
          <EtAssetItem>
            <EtAssetItem.Skeleton variant="2-lines" />
            <EtAssetItem.Divider />
          </EtAssetItem>
          <EtAssetItem>
            <EtAssetItem.Skeleton variant="2-lines" />
          </EtAssetItem>
        </ListDemo>
      </Section>

      <Section>
        <SubTitle>Loading — symbol-only</SubTitle>
        <ListDemo>
          <EtAssetItem size="small">
            <EtAssetItem.Skeleton variant="symbol-only" />
          </EtAssetItem>
        </ListDemo>
        <CodeBlock
          code={`<EtAssetItem size="small">
  <EtAssetItem.Skeleton variant="symbol-only" />
</EtAssetItem>`}
        />
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 6. Divider
// ─────────────────────────────────────────────────────────────

export const Divider: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Divider</Title>
        <Desc>
          Add EtAssetItem.Divider as a child to render a hairline below the row. The wrapper drops its bottom padding so the divider sits at the row
          edge.
        </Desc>
        <ListDemo>
          {MOCK_PRICES.map((asset, idx) => (
            <EtAssetItem key={asset.symbol}>
              <EtAssetItem.Logo source={asset.logo} />
              <EtAssetItem.Content>
                <EtAssetItem.Symbol>{asset.symbol}</EtAssetItem.Symbol>
                <EtAssetItem.Name>{asset.name}</EtAssetItem.Name>
              </EtAssetItem.Content>
              <EtAssetItem.Price value={asset.price} />
              <EtAssetItem.Change value={asset.change} sentiment={asset.sentiment} />
              {idx < MOCK_PRICES.length - 1 && <EtAssetItem.Divider />}
            </EtAssetItem>
          ))}
        </ListDemo>
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 7. Swipe Actions (composed with EtSwipeableRow)
// ─────────────────────────────────────────────────────────────

export const SwipeActions: Story = {
  render: function SwipeActionsStory() {
    const [items, setItems] = useState(mockAssets.slice(0, 4));

    return (
      <Page>
        <Section>
          <Title>Swipe Actions</Title>
          <Desc>EtAssetItem intentionally has no swipe API. Compose with EtSwipeableRow when you need swipe-to-reveal actions.</Desc>
          <Desc>All action icons fade in together as the row is dragged open. Swiping all the way to the end auto-triggers the LAST action.</Desc>
          <Desc>
            Set collapseOnLastAction (used in this demo) for destructive rows like delete or archive: the LAST action expands across the row, a haptic
            fires, the row collapses its height to 0, and only then the action callback runs. Without it (the default), full-swipe and last-action
            press just fire onPress immediately and the row springs back to closed.
          </Desc>
          <Desc>Pass enableFullSwipe=false to opt out of the full-swipe shortcut on a row.</Desc>
          <ListDemo>
            {items.map((asset, idx) => {
              const isPositive = asset.PriceChange > 0;
              const pct = ((asset.PriceChange / asset.Price) * 100).toFixed(2);

              return (
                <EtSwipeableRow key={asset.InstrumentID} collapseOnLastAction>
                  <EtAssetItem onPress={() => Alert.alert(asset.SymbolFull)}>
                    <EtAssetItem.Logo source={asset.Images?.[0]?.Uri} />
                    <EtAssetItem.Content>
                      <EtAssetItem.Symbol>{asset.SymbolFull}</EtAssetItem.Symbol>
                      <EtAssetItem.Name>{asset.InstrumentDisplayName}</EtAssetItem.Name>
                    </EtAssetItem.Content>
                    <EtAssetItem.Price value={`$${asset.Price.toFixed(2)}`} />
                    <EtAssetItem.Change
                      value={`${asset.PriceChange.toFixed(2)} (${isPositive ? '+' : ''}${pct}%)`}
                      sentiment={isPositive ? 'positive' : 'negative'}
                    />
                    {idx < items.length - 1 && <EtAssetItem.Divider />}
                  </EtAssetItem>

                  <EtSwipeableRow.Action
                    onPress={() => Alert.alert('Favorite', asset.SymbolFull)}
                    style={{ backgroundColor: '#3B82F6' }}
                    accessibilityLabel="Favorite"
                  >
                    <EtoroIcon icon={{ iconName: 'star' }} appearance={{ size: 24, color: 'white' }} />
                  </EtSwipeableRow.Action>
                  <EtSwipeableRow.Action
                    onPress={() => Alert.alert('Price Alert', asset.SymbolFull)}
                    style={{ backgroundColor: '#F59E0B' }}
                    accessibilityLabel="Price alert"
                  >
                    <EtoroIcon icon={{ iconName: 'priceAlert' }} appearance={{ size: 24, color: 'white' }} />
                  </EtSwipeableRow.Action>
                  <EtSwipeableRow.Action
                    onPress={() => setItems((prev) => prev.filter((a) => a.InstrumentID !== asset.InstrumentID))}
                    style={{ backgroundColor: '#EF4444' }}
                    accessibilityLabel="Delete"
                  >
                    <EtoroIcon icon={{ iconName: 'trash' }} appearance={{ size: 24, color: 'white' }} />
                  </EtSwipeableRow.Action>
                </EtSwipeableRow>
              );
            })}
          </ListDemo>
          <CodeBlock
            code={`import { EtAssetItem, EtSwipeableRow } from 'etoro-ui';

// The LAST action is the one auto-triggered by a full swipe.
// Order your actions so the destructive one is last.
// collapseOnLastAction: animate the row away (height 0) before firing the destructive callback.
<EtSwipeableRow collapseOnLastAction>
  <EtAssetItem onPress={openAsset}>
    <EtAssetItem.Logo source={asset.logoUri} />
    <EtAssetItem.Content>
      <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
      <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
    </EtAssetItem.Content>
    <EtAssetItem.Price value="$186.79" />
    <EtAssetItem.Change value="1.95 (-1.03%)" sentiment="negative" />
  </EtAssetItem>

  <EtSwipeableRow.Action onPress={favorite} style={{ backgroundColor: colors.bgInfo }}>
    <EtIconV2 name="star" size="lg" color={colors.textBright} />
  </EtSwipeableRow.Action>
  <EtSwipeableRow.Action onPress={priceAlert} style={{ backgroundColor: colors.bgWarning }}>
    <EtIconV2 name="priceAlert" size="lg" color={colors.textBright} />
  </EtSwipeableRow.Action>
  <EtSwipeableRow.Action onPress={remove} style={{ backgroundColor: colors.statusNegative }}>
    <EtIconV2 name="trash" size="lg" color={colors.textBright} />
  </EtSwipeableRow.Action>
</EtSwipeableRow>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// 8. Trading-view layout (Buy/Sell rate chips)
// ─────────────────────────────────────────────────────────────

const TRADING_VIEW_ROWS = [
  {
    symbol: 'AUS200',
    logo: 'https://etoro-cdn.etorostatic.com/market-avatars/100024/100024_F4F4F4_F4F4F4.svg',
    change: '▲ 4.35% (-1.03%)',
    changeSentiment: 'positive' as const,
    buy: { value: '11756.62', sentiment: 'positive' as const },
    sell: { value: '11756.62', sentiment: 'neutral' as const },
  },
  {
    symbol: 'DOW30.SPOT',
    logo: 'https://etoro-cdn.etorostatic.com/market-avatars/100074/100074_F4F4F4_F4F4F4.svg',
    change: '▲ 4.35% (-1.03%)',
    changeSentiment: 'positive' as const,
    buy: { value: '11756.62', sentiment: 'neutral' as const },
    sell: { value: '11756.62', sentiment: 'neutral' as const },
  },
  {
    symbol: 'Canada60',
    logo: 'https://etoro-cdn.etorostatic.com/market-avatars/100015/100015_F4F4F4_F4F4F4.svg',
    change: '▼ 2.20% (-1.03%)',
    changeSentiment: 'negative' as const,
    buy: { value: '11756.62', sentiment: 'neutral' as const },
    sell: { value: '11756.62', sentiment: 'negative' as const },
  },
];

function TradingViewHeader() {
  const { c } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: c.borderSubtle,
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ paddingLeft: 48 /* logo width + gap */ }} />
      </View>
      <View style={{ width: 88, alignItems: 'center' }} />
      <View style={{ width: 88, alignItems: 'center' }} />
    </View>
  );
}

export const TradingViewLayout: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Trading-view layout</Title>
        <Desc>
          Opt in via layout=&quot;trading-view&quot;. The Change line moves under the Symbol, and the right column hosts a horizontal row of
          EtAssetItem.RateChip siblings (typically a Buy and a Sell).
        </Desc>
        <Desc>
          RateChip is sentiment-aware: positive renders a green-tinted background, negative renders a red-tinted background, neutral keeps the row's
          surface color. Wrap in your own Pressable for an order flow — the chip is display-only.
        </Desc>
        <Desc>EtAssetItem.Price and EtAssetItem.Trailing are ignored in this layout (a dev-only warning is logged if used).</Desc>
        <ListDemo>
          <TradingViewHeader />
          {TRADING_VIEW_ROWS.map((row, idx) => (
            <EtAssetItem layout="trading-view" key={row.symbol}>
              <EtAssetItem.Logo source={row.logo} />
              <EtAssetItem.Content>
                <EtAssetItem.Symbol>{row.symbol}</EtAssetItem.Symbol>
              </EtAssetItem.Content>
              <EtAssetItem.Change value={row.change} sentiment={row.changeSentiment} />
              <EtAssetItem.RateChip value={row.buy.value} sentiment={row.buy.sentiment} />
              <EtAssetItem.RateChip value={row.sell.value} sentiment={row.sell.sentiment} />
              {idx < TRADING_VIEW_ROWS.length - 1 && <EtAssetItem.Divider />}
            </EtAssetItem>
          ))}
        </ListDemo>
        <CodeBlock
          code={`import { EtAssetItem } from 'etoro-ui';

<EtAssetItem layout="trading-view">
  <EtAssetItem.Logo source={asset.logoUri} />
  <EtAssetItem.Content>
    <EtAssetItem.Symbol>AUS200</EtAssetItem.Symbol>
  </EtAssetItem.Content>
  <EtAssetItem.Change value="▲ 4.35% (-1.03%)" sentiment="positive" />
  <EtAssetItem.RateChip value="11756.62" sentiment="positive" />
  <EtAssetItem.RateChip value="11756.62" sentiment="neutral" />
</EtAssetItem>`}
        />
      </Section>

      <Section>
        <SubTitle>Skeleton — rate-chips variant</SubTitle>
        <Desc>Loading placeholder shaped like a trading-view row (logo + 2 left bars + 2 chip-shaped placeholders).</Desc>
        <ListDemo>
          <EtAssetItem layout="trading-view">
            <EtAssetItem.Skeleton variant="rate-chips" />
            <EtAssetItem.Divider />
          </EtAssetItem>
          <EtAssetItem layout="trading-view">
            <EtAssetItem.Skeleton variant="rate-chips" />
          </EtAssetItem>
        </ListDemo>
      </Section>
    </Page>
  ),
};

// ─────────────────────────────────────────────────────────────
// 9. API Reference (always last)
// ─────────────────────────────────────────────────────────────

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>EtAssetItem (root)</SubTitle>
        <Desc>Compound root. Renders subcomponents in a deterministic order regardless of JSX order.</Desc>
        <PropsTable
          data={[
            {
              prop: 'children',
              type: 'ReactNode',
              default: '-',
              description: 'Compound subcomponents (Logo, Content, Symbol, Name, Label, Price, Change, Trailing, RateChip, Divider, Skeleton).',
            },
            { prop: 'size', type: '"large" | "small"', default: '"large"', description: 'Vertical padding + logo size.' },
            {
              prop: 'layout',
              type: '"default" | "trading-view"',
              default: '"default"',
              description: 'Row layout. "trading-view" moves Change under Symbol and renders RateChip siblings on the right.',
            },
            { prop: 'disabled', type: 'boolean', default: 'false', description: 'Lowers opacity and disables press handling.' },
            { prop: 'onPress', type: '() => void', default: '-', description: 'Press handler. When set, the row is rendered as a Pressable button.' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style override.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
            { prop: 'accessibilityLabel', type: 'string', default: '-', description: 'Accessibility label for the row.' },
            { prop: 'accessibilityHint', type: 'string', default: '-', description: 'Accessibility hint for the row.' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAssetItem.Logo</SubTitle>
        <Desc>
          Square instrument avatar. Wraps EtAvatar with variant="instrument" and shape="square". Size derived from the parent (large → 36px, small →
          24px).
        </Desc>
        <PropsTable
          data={[
            { prop: 'source', type: 'string', default: '-', description: 'Image URI. Pass undefined to render a placeholder background.' },
            { prop: 'onError', type: "ImageProps['onError']", default: '-', description: 'Forwarded onError handler.' },
            { prop: 'accessibilityLabel', type: 'string', default: '-', description: 'Optional accessibility label for the image.' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style override.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAssetItem.Content</SubTitle>
        <Desc>Vertical container for Symbol/Name. Takes the remaining horizontal space (flex: 1).</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-', description: 'Content (typically Symbol + Name).' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style override.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAssetItem.Symbol</SubTitle>
        <Desc>Primary line. Single-line, ellipsized, label-primary-semibold variant.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-', description: 'Symbol text.' },
            { prop: 'style', type: 'StyleProp<TextStyle>', default: '-', description: 'Text style override.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAssetItem.Name</SubTitle>
        <Desc>Secondary line. Single-line, ellipsized, label-tertiary-regular variant.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-', description: 'Display name.' },
            { prop: 'style', type: 'StyleProp<TextStyle>', default: '-', description: 'Text style override.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAssetItem.Label</SubTitle>
        <Desc>Optional middle-slot pill. Wraps EtBadge with size="small". The API is intentionally narrow so labels stay on-system.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'string', default: '-', description: 'Pill label text.' },
            { prop: 'color', type: 'BadgeColor', default: '"neutral"', description: 'Color variant from the design system.' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style override.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAssetItem.Price</SubTitle>
        <Desc>Right-aligned, pre-formatted price string. The component does not format numbers — pass an already-formatted value.</Desc>
        <PropsTable
          data={[
            { prop: 'value', type: 'string', default: '-', description: 'Pre-formatted price (e.g. "$186.79").' },
            { prop: 'style', type: 'StyleProp<TextStyle>', default: '-', description: 'Text style override.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAssetItem.Change</SubTitle>
        <Desc>Right-aligned change string with sentiment-driven color. Pass a pre-formatted value.</Desc>
        <PropsTable
          data={[
            { prop: 'value', type: 'string', default: '-', description: 'Pre-formatted change (e.g. "1.95 (-1.03%)").' },
            { prop: 'sentiment', type: '"positive" | "negative" | "neutral"', default: '"neutral"', description: 'Drives the text color.' },
            {
              prop: 'shrinkToFit',
              type: 'boolean',
              default: 'true in "trading-view", false in "default"',
              description:
                'Auto-shrink to fit via iOS adjustsFontSizeToFit (0.75 min scale). Pass false when the value is already sized to fit statically.',
            },
            { prop: 'style', type: 'StyleProp<TextStyle>', default: '-', description: 'Text style override.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAssetItem.Trailing</SubTitle>
        <Desc>Arbitrary right-side slot (replaces the legacy rightElement prop). Sized to its content and vertically centered.</Desc>
        <PropsTable
          data={[
            { prop: 'children', type: 'ReactNode', default: '-', description: 'Trailing content (e.g. EtButton, icon).' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style override.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAssetItem.RateChip</SubTitle>
        <Desc>
          Display-only sentiment-colored pill rendered in the right-hand slot of the trading-view layout. Compose two of them (typically Buy and Sell)
          — they render as a horizontal pair. Wrap in your own Pressable if you need an order flow.
        </Desc>
        <PropsTable
          data={[
            { prop: 'value', type: 'string', default: '-', description: 'Pre-formatted value (e.g. "11756.62").' },
            {
              prop: 'sentiment',
              type: '"positive" | "negative" | "neutral"',
              default: '"neutral"',
              description: 'Drives the chip background and text color.',
            },
            { prop: 'label', type: 'string', default: '-', description: 'Optional caption rendered above the value (e.g. "Buy", "Sell").' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style override.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAssetItem.Divider</SubTitle>
        <Desc>Hairline separator rendered below the row.</Desc>
        <PropsTable
          data={[
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Override divider style.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtAssetItem.Skeleton</SubTitle>
        <Desc>Loading placeholder shaped like a real asset row. Inherits the parent size unless overridden.</Desc>
        <PropsTable
          data={[
            {
              prop: 'variant',
              type: '"symbol-only" | "2-lines" | "rate-chips"',
              default: '"2-lines"',
              description: 'Skeleton layout. Use "rate-chips" together with the trading-view layout.',
            },
            { prop: 'size', type: '"large" | "small"', default: 'inherited', description: 'Vertical padding size.' },
            { prop: 'style', type: 'StyleProp<ViewStyle>', default: '-', description: 'Container style override.' },
            { prop: 'testID', type: 'string', default: '-', description: 'Test ID for testing.' },
          ]}
        />
      </Section>
    </Page>
  ),
};
