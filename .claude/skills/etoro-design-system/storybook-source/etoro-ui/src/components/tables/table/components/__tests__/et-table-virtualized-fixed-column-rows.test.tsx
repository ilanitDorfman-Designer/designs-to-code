import { fireEvent, render } from '@testing-library/react-native';
import { useEffect } from 'react';
import { Text } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { EtTableColumn } from '../../api';
import EtTableVirtualizedFixedColumnRows from '../et-table-virtualized-fixed-column-rows';

jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({ colors: { backgroundBase: '#000000' } }),
}));

// The glass edge is decorative (blur + gradient) and pulls in native-only deps;
// stub it so these tests stay focused on pinned/moving cell composition.
jest.mock('../glass-overlay', () => () => null);

// FlashList is mocked to render every row synchronously (no virtualization), so
// we can assert the pinned + moving cells the consumer's `renderColumn` produces.
jest.mock('@shopify/flash-list', () => {
  const ReactLib = require('react');
  const RN = require('react-native');
  return {
    FlashList: ({
      data,
      renderItem,
      keyExtractor,
      ListFooterComponent,
    }: {
      data?: ReadonlyArray<{ id: string }>;
      renderItem: (args: { item: { id: string }; index: number }) => React.ReactNode;
      keyExtractor?: (item: { id: string }, index: number) => string;
      ListFooterComponent?: React.ComponentType | React.ReactElement;
    }) => {
      // Mirrors FlashList's own `getValidComponent`: a footer may be either a
      // component or an already-built element. Resolving it the same way is what
      // lets these tests observe the real mount/remount behaviour.
      const footer = ListFooterComponent
        ? ReactLib.isValidElement(ListFooterComponent)
          ? ListFooterComponent
          : ReactLib.createElement(ListFooterComponent)
        : null;
      return ReactLib.createElement(
        RN.View,
        { testID: 'flash-list' },
        ...(data ?? []).map((item, index) =>
          ReactLib.createElement(ReactLib.Fragment, { key: keyExtractor ? keyExtractor(item, index) : index }, renderItem({ item, index })),
        ),
        footer,
      );
    },
  };
});

type Row = { id: string; name: string };

const firstColumn: EtTableColumn = { name: 'name', title: 'Name', width: 120, isFirstColumn: true };
const movingColumns: EtTableColumn[] = [
  { name: 'price', title: 'Price', width: 80 },
  { name: 'change', title: 'Change', width: 80 },
];

const data: Row[] = [
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Google' },
];

function createScrollOffsetX(initial = 0): SharedValue<number> {
  const shared = {
    value: initial,
    get() {
      return shared.value;
    },
    set(next: number | ((current: number) => number)) {
      shared.value = typeof next === 'function' ? next(shared.value) : next;
    },
  };
  return shared as unknown as SharedValue<number>;
}

const scrollOffsetX = createScrollOffsetX();

function renderComponent(overrides: Partial<React.ComponentProps<typeof EtTableVirtualizedFixedColumnRows<Row>>> = {}) {
  const renderColumn = (item: Row, column: EtTableColumn) => <Text>{`${item.id}:${column.name}`}</Text>;
  const keyExtractor = (item: Row) => item.id;

  return render(
    <EtTableVirtualizedFixedColumnRows<Row>
      items={data}
      firstColumn={firstColumn}
      movingColumns={movingColumns}
      renderColumn={renderColumn}
      keyExtractor={keyExtractor}
      scrollOffsetX={scrollOffsetX}
      {...overrides}
    />,
  );
}

describe('EtTableVirtualizedFixedColumnRows', () => {
  it('renders the pinned cell and every moving cell for each row', () => {
    const { getByText, getByTestId } = renderComponent();

    expect(getByTestId('flash-list')).toBeTruthy();

    // Row 1: pinned (name) + both moving cells.
    expect(getByText('1:name')).toBeTruthy();
    expect(getByText('1:price')).toBeTruthy();
    expect(getByText('1:change')).toBeTruthy();
    // Row 2: pinned (name) + both moving cells, so every row renders its full
    // pinned + moving cell set, not just the first.
    expect(getByText('2:name')).toBeTruthy();
    expect(getByText('2:price')).toBeTruthy();
    expect(getByText('2:change')).toBeTruthy();
  });

  it('invokes onRowClick with the pressed row', () => {
    const onRowClick = jest.fn();
    const { getAllByTestId } = renderComponent({ onRowClick });

    const rows = getAllByTestId('et-table-virtualized-fixed-column-row');
    expect(rows).toHaveLength(data.length);

    fireEvent.press(rows[1]);
    expect(onRowClick).toHaveBeenCalledWith(data[1]);
  });

  it('does not attach a press handler when onRowClick is absent', () => {
    const { getAllByTestId } = renderComponent();

    const rows = getAllByTestId('et-table-virtualized-fixed-column-row');
    expect(rows).toHaveLength(data.length);
    rows.forEach((row) => expect(row.props.accessibilityState?.disabled).toBe(true));
  });

  it('renders a footer after the rows when provided', () => {
    const { getByText } = renderComponent({ footer: <Text>footer-content</Text> });

    expect(getByText('footer-content')).toBeTruthy();
  });

  it('keeps the footer mounted across re-renders and viewport measurement', () => {
    const onMount = jest.fn();
    function StatefulFooter() {
      useEffect(() => onMount(), []);
      return <Text>footer-content</Text>;
    }

    const { getByTestId, rerender } = renderComponent({ footer: <StatefulFooter /> });
    expect(onMount).toHaveBeenCalledTimes(1);

    // Measuring the viewport changes the footer's width; a remount here would
    // destroy state the footer owns (e.g. an open disclosures sheet).
    fireEvent(getByTestId('et-table-virtualized-fixed-column-body'), 'layout', { nativeEvent: { layout: { width: 320 } } });
    expect(onMount).toHaveBeenCalledTimes(1);

    // Parents rebuild the footer element on every render; that must not remount it either.
    rerender(
      <EtTableVirtualizedFixedColumnRows<Row>
        items={data}
        firstColumn={firstColumn}
        movingColumns={movingColumns}
        renderColumn={(item, column) => <Text>{`${item.id}:${column.name}`}</Text>}
        keyExtractor={(item) => item.id}
        scrollOffsetX={scrollOffsetX}
        footer={<StatefulFooter />}
      />,
    );
    expect(onMount).toHaveBeenCalledTimes(1);
  });
});
