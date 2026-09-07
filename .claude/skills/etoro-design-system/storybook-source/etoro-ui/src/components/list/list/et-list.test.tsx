import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { EtList } from './et-list';

jest.mock('@shopify/flash-list', () => {
  const { View } = require('react-native');
  return {
    FlashList: ({ data, renderItem, ListFooterComponent, onEndReached, testID, keyExtractor }: any) => (
      <View testID={testID ?? 'flash-list'} onLayout={() => onEndReached?.()}>
        {data?.map((item: any, index: number) => (
          <View key={keyExtractor?.(item, index) ?? index}>{renderItem?.({ item, index, target: 'Cell' })}</View>
        ))}
        {ListFooterComponent ? <ListFooterComponent /> : null}
      </View>
    ),
  };
});

jest.mock('../../../core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

interface SampleItem {
  id: string;
  label: string;
}

const SAMPLE_DATA: SampleItem[] = [
  { id: '1', label: 'AAPL' },
  { id: '2', label: 'MSFT' },
];

const renderRow = ({ item }: { item: SampleItem }) => (
  <View testID={`row-${item.id}`}>
    <Text>{item.label}</Text>
  </View>
);

const baseProps = {
  data: SAMPLE_DATA,
  keyExtractor: (item: SampleItem) => item.id,
  renderItem: renderRow,
};

describe('EtList', () => {
  describe('Rendering paths', () => {
    it('renders the FlashList with rows when data is non-empty', () => {
      render(
        <EtList<SampleItem> {...baseProps} testID="list">
          <EtList.Header testID="header">
            <EtList.Column id="market">Market</EtList.Column>
          </EtList.Header>
        </EtList>,
      );

      expect(screen.getByTestId('list')).toBeTruthy();
      expect(screen.getByTestId('header')).toBeTruthy();
      expect(screen.getByTestId('flash-list')).toBeTruthy();
      expect(screen.getByTestId('row-1')).toBeTruthy();
      expect(screen.getByTestId('row-2')).toBeTruthy();
      expect(screen.getByText('Market')).toBeTruthy();
    });

    it('renders the Skeleton slot when initially loading and data is empty', () => {
      render(
        <EtList<SampleItem> {...baseProps} data={[]} isLoading testID="list">
          <EtList.Header testID="header">
            <EtList.Column id="market">Market</EtList.Column>
          </EtList.Header>
          <EtList.Skeleton rows={3} testID="skeleton" />
          <EtList.Empty testID="empty">No items</EtList.Empty>
        </EtList>,
      );

      expect(screen.getByTestId('header')).toBeTruthy();
      expect(screen.getByTestId('skeleton')).toBeTruthy();
      expect(screen.queryByTestId('empty')).toBeNull();
      expect(screen.queryByTestId('flash-list')).toBeNull();
    });

    it('clones a custom Skeleton row template `rows` times', () => {
      render(
        <EtList<SampleItem> {...baseProps} data={[]} isLoading>
          <EtList.Skeleton rows={4}>
            <View testID="custom-skeleton-row" />
          </EtList.Skeleton>
        </EtList>,
      );

      expect(screen.getAllByTestId('custom-skeleton-row')).toHaveLength(4);
    });

    it('renders the Error slot when error is present and data is empty', () => {
      render(
        <EtList<SampleItem> {...baseProps} data={[]} error={new Error('boom')} testID="list">
          <EtList.Header testID="header">
            <EtList.Column id="market">Market</EtList.Column>
          </EtList.Header>
          <EtList.Skeleton rows={3} testID="skeleton" />
          <EtList.Empty testID="empty">No items</EtList.Empty>
          <EtList.Error testID="error">Something went wrong</EtList.Error>
        </EtList>,
      );

      expect(screen.getByTestId('error')).toBeTruthy();
      expect(screen.queryByTestId('skeleton')).toBeNull();
      expect(screen.queryByTestId('empty')).toBeNull();
      expect(screen.queryByTestId('flash-list')).toBeNull();
    });

    it('prefers Skeleton over Error when both isLoading and error are set with empty data', () => {
      render(
        <EtList<SampleItem> {...baseProps} data={[]} isLoading error={new Error('stale')}>
          <EtList.Skeleton rows={2} testID="skeleton" />
          <EtList.Error testID="error">err</EtList.Error>
        </EtList>,
      );

      expect(screen.getByTestId('skeleton')).toBeTruthy();
      expect(screen.queryByTestId('error')).toBeNull();
    });

    it('renders the Empty slot when data is empty and there is no error or loading', () => {
      render(
        <EtList<SampleItem> {...baseProps} data={[]} testID="list">
          <EtList.Header testID="header">
            <EtList.Column id="market">Market</EtList.Column>
          </EtList.Header>
          <EtList.Empty testID="empty">No items</EtList.Empty>
        </EtList>,
      );

      expect(screen.getByTestId('empty')).toBeTruthy();
      expect(screen.queryByTestId('flash-list')).toBeNull();
    });

    it('renders the Footer slot inside the FlashList when there is data', () => {
      render(
        <EtList<SampleItem> {...baseProps}>
          <EtList.Footer testID="footer">
            <Text>loading more</Text>
          </EtList.Footer>
        </EtList>,
      );

      expect(screen.getByTestId('footer')).toBeTruthy();
      expect(screen.getByText('loading more')).toBeTruthy();
    });
  });

  describe('Sortable Column', () => {
    it('renders a non-sortable column without a Pressable role', () => {
      render(
        <EtList<SampleItem> {...baseProps}>
          <EtList.Header>
            <EtList.Column id="market" testID="market-col">
              Market
            </EtList.Column>
          </EtList.Header>
        </EtList>,
      );

      const column = screen.getByTestId('market-col');
      expect(column.props.accessibilityRole).toBeUndefined();
    });

    it('toggles from undefined → asc on first tap', () => {
      const onSortChange = jest.fn();
      render(
        <EtList<SampleItem> {...baseProps}>
          <EtList.Header>
            <EtList.Column id="market" sortable onSortChange={onSortChange} testID="market-col">
              Market
            </EtList.Column>
          </EtList.Header>
        </EtList>,
      );

      fireEvent.press(screen.getByTestId('market-col'));
      expect(onSortChange).toHaveBeenCalledWith('asc');
    });

    it('toggles from asc → desc on next tap', () => {
      const onSortChange = jest.fn();
      render(
        <EtList<SampleItem> {...baseProps}>
          <EtList.Header>
            <EtList.Column id="market" sortable sortDirection="asc" onSortChange={onSortChange} testID="market-col">
              Market
            </EtList.Column>
          </EtList.Header>
        </EtList>,
      );

      fireEvent.press(screen.getByTestId('market-col'));
      expect(onSortChange).toHaveBeenCalledWith('desc');
    });

    it('resets desc → null on third tap so the consumer can fall back to the data source default', () => {
      const onSortChange = jest.fn();
      render(
        <EtList<SampleItem> {...baseProps}>
          <EtList.Header>
            <EtList.Column id="market" sortable sortDirection="desc" onSortChange={onSortChange} testID="market-col">
              Market
            </EtList.Column>
          </EtList.Header>
        </EtList>,
      );

      fireEvent.press(screen.getByTestId('market-col'));
      expect(onSortChange).toHaveBeenCalledWith(null);
    });

    it('restarts the cycle from null → asc on the next tap after a reset', () => {
      const onSortChange = jest.fn();
      render(
        <EtList<SampleItem> {...baseProps}>
          <EtList.Header>
            <EtList.Column id="market" sortable sortDirection={null} onSortChange={onSortChange} testID="market-col">
              Market
            </EtList.Column>
          </EtList.Header>
        </EtList>,
      );

      fireEvent.press(screen.getByTestId('market-col'));
      expect(onSortChange).toHaveBeenCalledWith('asc');
    });

    it('does not throw when a sortable column is tapped without an onSortChange handler', () => {
      render(
        <EtList<SampleItem> {...baseProps}>
          <EtList.Header>
            <EtList.Column id="market" sortable testID="market-col">
              Market
            </EtList.Column>
          </EtList.Header>
        </EtList>,
      );

      expect(() => fireEvent.press(screen.getByTestId('market-col'))).not.toThrow();
    });

    it('delegates to getNextSortDirection when provided (override skips the default tri-state cycle)', () => {
      // Two-state cycle: `asc ↔ desc`, never resets to null. Consumers
      // opting into this give up the "remove my sort" affordance in exchange
      // for a simpler always-active sort.
      const twoStateCycle = jest.fn((current) => (current === 'asc' ? 'desc' : 'asc'));
      const onSortChange = jest.fn();
      render(
        <EtList<SampleItem> {...baseProps}>
          <EtList.Header>
            <EtList.Column
              id="market"
              sortable
              sortDirection="desc"
              onSortChange={onSortChange}
              getNextSortDirection={twoStateCycle}
              testID="market-col"
            >
              Market
            </EtList.Column>
          </EtList.Header>
        </EtList>,
      );

      fireEvent.press(screen.getByTestId('market-col'));

      expect(twoStateCycle).toHaveBeenCalledWith('desc');
      expect(onSortChange).toHaveBeenCalledWith('asc');
    });

    it('normalizes undefined sortDirection to null before invoking getNextSortDirection', () => {
      // The override's input is always nullable — never undefined — so a
      // consumer can pattern-match exhaustively on `'asc' | 'desc' | null`.
      const cycle = jest.fn(() => 'asc' as const);
      render(
        <EtList<SampleItem> {...baseProps}>
          <EtList.Header>
            <EtList.Column id="market" sortable onSortChange={jest.fn()} getNextSortDirection={cycle} testID="market-col">
              Market
            </EtList.Column>
          </EtList.Header>
        </EtList>,
      );

      fireEvent.press(screen.getByTestId('market-col'));
      expect(cycle).toHaveBeenCalledWith(null);
    });
  });

  describe('Lazy loading', () => {
    it('forwards onEndReached to the FlashList', () => {
      const onEndReached = jest.fn();
      render(<EtList<SampleItem> {...baseProps} onEndReached={onEndReached} />);

      // Mocked FlashList fires onEndReached on mount via onLayout for test convenience.
      fireEvent(screen.getByTestId('flash-list'), 'layout');
      expect(onEndReached).toHaveBeenCalled();
    });
  });

  describe('Slot multiplicity warnings', () => {
    let originalDev: boolean;
    beforeEach(() => {
      originalDev = (globalThis as { __DEV__?: boolean }).__DEV__ ?? true;
      (globalThis as { __DEV__?: boolean }).__DEV__ = true;
    });
    afterEach(() => {
      (globalThis as { __DEV__?: boolean }).__DEV__ = originalDev;
    });

    it('warns when multiple Header children are passed', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      render(
        <EtList<SampleItem> {...baseProps}>
          <EtList.Header testID="h1">
            <EtList.Column id="a">A</EtList.Column>
          </EtList.Header>
          <EtList.Header testID="h2">
            <EtList.Column id="b">B</EtList.Column>
          </EtList.Header>
        </EtList>,
      );
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Multiple EtList.Header children'));
      warn.mockRestore();
    });
  });
});
