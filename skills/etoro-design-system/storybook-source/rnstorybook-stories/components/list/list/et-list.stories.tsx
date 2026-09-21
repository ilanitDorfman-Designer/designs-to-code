import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAssetItem, EtList, EtSkeleton, type ListSortDirection } from 'etoro-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';

import { CodeBlock, Desc, Page, PropsTable, Section, SubTitle, Title, useTheme } from '../../../utils/storybook-template';

type Story = StoryObj<typeof EtList>;

const APPLE_LOGO = 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg';

interface IndexItem {
  id: string;
  symbol: string;
  buy: string;
  sell: string;
  change: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const SAMPLE_DATA: IndexItem[] = [
  { id: '1', symbol: 'DOW30.SPOT', buy: '11756.62', sell: '11756.62', change: '▲ 4.35% (-1.03%)', sentiment: 'positive' },
  { id: '2', symbol: 'AI.Leaders', buy: '11756.62', sell: '11756.62', change: '▼ 2.20% (-1.03%)', sentiment: 'negative' },
  { id: '3', symbol: 'AUS200', buy: '11756.62', sell: '11756.62', change: '▲ 4.35% (-1.03%)', sentiment: 'positive' },
  { id: '4', symbol: '10Y.MAR26', buy: '11756.62', sell: '11756.62', change: '▲ 4.35% (-1.03%)', sentiment: 'positive' },
  { id: '5', symbol: 'DJ30', buy: '11756.62', sell: '11756.62', change: '▼ 2.20% (-1.03%)', sentiment: 'negative' },
  { id: '6', symbol: 'Crypto10', buy: '11756.62', sell: '11756.62', change: '▲ 4.35% (-1.03%)', sentiment: 'positive' },
];

function IndexRow({ item }: { item: IndexItem }) {
  return (
    <EtAssetItem layout="trading-view">
      <EtAssetItem.Logo source={APPLE_LOGO} />
      <EtAssetItem.Content>
        <EtAssetItem.Symbol>{item.symbol}</EtAssetItem.Symbol>
      </EtAssetItem.Content>
      <EtAssetItem.Change value={item.change} sentiment={item.sentiment} />
      <EtAssetItem.RateChip value={item.buy} sentiment="neutral" />
      <EtAssetItem.RateChip value={item.sell} sentiment="neutral" />
    </EtAssetItem>
  );
}

/** Bordered, fixed-height container so the virtualized list has a layout box on the page. */
function ListDemo({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View
      style={{
        height: 480,
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

const meta: Meta<typeof EtList> = {
  title: 'eToro-UI/Components/List/EtList',
  component: EtList,
};

export default meta;

export const Basic: Story = {
  render: function BasicStory() {
    const [sort, setSort] = useState<ListSortDirection | null>(null);
    const sorted = useMemo(() => {
      if (sort == null) return SAMPLE_DATA;
      const copy = [...SAMPLE_DATA];
      copy.sort((a, b) => (sort === 'asc' ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol)));
      return copy;
    }, [sort]);

    return (
      <Page>
        <Section>
          <Title>Basic</Title>
          <Desc>
            EtList is a generic, virtualized list with a pinned column-header row, sortable columns, and built-in skeleton/empty/error states. Compose
            any per-row component inside `renderItem` — here we use `EtAssetItem` with the trading-view layout.
          </Desc>
          <ListDemo>
            <EtList<IndexItem> data={sorted} keyExtractor={(item) => item.id} renderItem={({ item }) => <IndexRow item={item} />}>
              <EtList.Header>
                <EtList.Column id="market" sortable sortDirection={sort} onSortChange={setSort}>
                  Market
                </EtList.Column>
                <EtList.Column id="buy" align="end">
                  Buy
                </EtList.Column>
                <EtList.Column id="sell" align="end">
                  Sell
                </EtList.Column>
              </EtList.Header>
            </EtList>
          </ListDemo>
          <CodeBlock
            code={`import { EtList } from 'etoro-ui';

<EtList<Asset>
  data={items}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <AssetRow item={item} />}
>
  <EtList.Header>
    <EtList.Column id="market" sortable sortDirection={sort} onSortChange={setSort}>
      Market
    </EtList.Column>
    <EtList.Column id="buy" align="end">Buy</EtList.Column>
    <EtList.Column id="sell" align="end">Sell</EtList.Column>
  </EtList.Header>
</EtList>`}
          />
        </Section>
      </Page>
    );
  },
};

export const Loading: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Loading</Title>
        <Desc>When `isLoading` is true and `data` is empty, the Skeleton slot is rendered below the (always-visible) Header.</Desc>
        <ListDemo>
          <EtList<IndexItem> data={[]} keyExtractor={(item) => item.id} renderItem={({ item }) => <IndexRow item={item} />} isLoading>
            <EtList.Header>
              <EtList.Column id="market">Market</EtList.Column>
              <EtList.Column id="buy" align="end">
                Buy
              </EtList.Column>
              <EtList.Column id="sell" align="end">
                Sell
              </EtList.Column>
            </EtList.Header>
            <EtList.Skeleton rows={6} />
          </EtList>
        </ListDemo>
      </Section>
    </Page>
  ),
};

export const Empty: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Empty</Title>
        <Desc>When `data` is empty and there is no error or loading flag, the Empty slot is rendered.</Desc>
        <ListDemo>
          <EtList<IndexItem> data={[]} keyExtractor={(item) => item.id} renderItem={({ item }) => <IndexRow item={item} />}>
            <EtList.Header>
              <EtList.Column id="market">Market</EtList.Column>
            </EtList.Header>
            <EtList.Empty>No instruments available</EtList.Empty>
          </EtList>
        </ListDemo>
      </Section>
    </Page>
  ),
};

export const Error: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>Error</Title>
        <Desc>When `error` is non-null and `data` is empty, the Error slot is rendered. Consumers own the message text.</Desc>
        <ListDemo>
          <EtList<IndexItem>
            data={[]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <IndexRow item={item} />}
            error={new Error('Network')}
          >
            <EtList.Header>
              <EtList.Column id="market">Market</EtList.Column>
            </EtList.Header>
            <EtList.Error>Something went wrong. Pull to refresh.</EtList.Error>
          </EtList>
        </ListDemo>
      </Section>
    </Page>
  ),
};

export const InfiniteScroll: Story = {
  render: function InfiniteScrollStory() {
    const [items, setItems] = useState<IndexItem[]>(SAMPLE_DATA);
    const [batchStatus, setBatchStatus] = useState<'idle' | 'loading'>('idle');

    const handleLoadMore = useCallback(() => {
      if (batchStatus !== 'idle') return;
      setBatchStatus('loading');
      setTimeout(() => {
        setItems((prev) => [...prev, ...SAMPLE_DATA.map((item, i) => ({ ...item, id: `${prev.length + i + 1}-${item.id}` }))]);
        setBatchStatus('idle');
      }, 600);
    }, [batchStatus]);

    return (
      <Page>
        <Section>
          <Title>Infinite scroll</Title>
          <Desc>The Footer slot scrolls into view at the bottom of the data — perfect for inline batch loaders.</Desc>
          <ListDemo>
            <EtList<IndexItem>
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <IndexRow item={item} />}
              onEndReached={handleLoadMore}
            >
              <EtList.Header>
                <EtList.Column id="market">Market</EtList.Column>
                <EtList.Column id="buy" align="end">
                  Buy
                </EtList.Column>
                <EtList.Column id="sell" align="end">
                  Sell
                </EtList.Column>
              </EtList.Header>
              <EtList.Footer>
                {batchStatus === 'loading' ? (
                  <View style={{ padding: 16 }}>
                    <EtSkeleton width="100%" height={56} variant="rounded" borderRadius={8} />
                  </View>
                ) : null}
              </EtList.Footer>
            </EtList>
          </ListDemo>
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
        <SubTitle>EtList</SubTitle>
        <Desc>Root component.</Desc>
        <PropsTable
          data={[
            { prop: 'data', type: 'ReadonlyArray<T>', default: '-' },
            { prop: 'keyExtractor', type: '(item: T, index: number) => string', default: '-' },
            { prop: 'renderItem', type: '(info: { item: T; index: number }) => ReactElement', default: '-' },
            { prop: 'isLoading', type: 'boolean', default: 'false' },
            { prop: 'error', type: 'Error | null', default: 'null' },
            { prop: 'onEndReached', type: '() => void', default: '-' },
            { prop: 'onEndReachedThreshold', type: 'number', default: '0.5' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtList.Column</SubTitle>
        <PropsTable
          data={[
            { prop: 'id', type: 'string', default: '-' },
            { prop: 'flex', type: 'number', default: '1' },
            { prop: 'align', type: '"start" | "end"', default: '"start"' },
            { prop: 'sortable', type: 'boolean', default: 'false' },
            { prop: 'sortDirection', type: '"asc" | "desc" | null', default: 'undefined' },
            { prop: 'onSortChange', type: '(next: "asc" | "desc" | null) => void', default: '-' },
            { prop: 'getNextSortDirection', type: '(current) => "asc" | "desc" | null', default: 'defaultSortCycle (null → asc → desc → null)' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>EtList.Skeleton</SubTitle>
        <Desc>If a single child is provided, it is cloned `rows` times. Otherwise a generic placeholder is rendered.</Desc>
        <PropsTable
          data={[
            { prop: 'rows', type: 'number', default: '6' },
            { prop: 'children', type: 'ReactElement', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};
