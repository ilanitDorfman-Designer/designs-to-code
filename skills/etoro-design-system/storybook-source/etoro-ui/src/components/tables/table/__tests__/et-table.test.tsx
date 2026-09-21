import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { mockColumnsExtended, mockDataExtended } from '../components/__mocks__/test-data';
import EtTableVirtualizedFixedColumnRows from '../components/et-table-virtualized-fixed-column-rows';
import { EtTable, EtTableBody, EtTableHead, EtTableRow } from '../index';

jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      primary: '#6200ee',
      background: '#ffffff',
      surface: '#ffffff',
      error: '#b00020',
      text: {
        primary: '#000000',
        secondary: '#ffffff',
      },
      bgNeutralPrimary: '#000000',
      bgNeutralTertiary: '#333333',
      bgGreyPrimary: '#e5e5e5',
      bgTransparentPrimaryBright: '#ffffff',
      bgGreyTransparentSecondary: '#eeeeee',
    },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useTheme: () => ({
    dark: false,
    colors: {
      primary: '#6200ee',
      background: '#ffffff',
      card: '#ffffff',
      text: '#000000',
      border: '#cccccc',
      notification: '#ff0000',
    },
  }),
}));

jest.mock('@shopify/flash-list', () => ({
  FlashList: ({ data, renderItem, testID, ...props }: any) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(
      View,
      { testID, ...props },
      data.map((item: any, index: number) => React.createElement(View, { key: index }, renderItem({ item, index }))),
    );
  },
}));

describe('EtTable - Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing with basic composition', () => {
    const component = render(
      <EtTable id="test-table" columns={mockColumnsExtended}>
        <EtTableHead />
        <EtTableBody
          items={mockDataExtended}
          renderItem={({ item }) => <EtTableRow item={item} renderColumn={(column) => <Text>{column.name}</Text>} />}
        />
      </EtTable>,
    );

    expect(component).toBeTruthy();
  });

  it('should render with custom header renderer', () => {
    const mockRenderColumn = jest.fn((column) => <Text testID={`header-${column.name}`}>{column.title}</Text>);

    const { getByTestId } = render(
      <EtTable id="test-table" columns={mockColumnsExtended}>
        <EtTableHead renderColumn={mockRenderColumn} />
        <EtTableBody
          items={mockDataExtended}
          renderItem={({ item }) => <EtTableRow item={item} renderColumn={(column) => <Text>{column.name}</Text>} />}
        />
      </EtTable>,
    );

    expect(getByTestId('header-name')).toBeTruthy();
    expect(getByTestId('header-price')).toBeTruthy();
    expect(mockRenderColumn).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'name',
        title: 'Name',
      }),
    );
  });

  it('should render with custom row renderer', () => {
    const mockRenderColumn = jest.fn((item, column) => <Text testID={`cell-${item.id}-${column.name}`}>{item[column.name]}</Text>);

    const { getByTestId } = render(
      <EtTable id="test-table" columns={mockColumnsExtended}>
        <EtTableHead />
        <EtTableBody items={mockDataExtended} renderItem={({ item }) => <EtTableRow item={item} renderColumn={mockRenderColumn} />} />
      </EtTable>,
    );

    expect(getByTestId('cell-1-name')).toBeTruthy();
    expect(getByTestId('cell-1-price')).toBeTruthy();
    expect(mockRenderColumn).toHaveBeenCalledWith(mockDataExtended[0], expect.objectContaining({ name: 'name' }));
  });

  it('should render with fixed first column layout', () => {
    const { getByTestId, getByText } = render(
      <EtTable id="test-table" columns={mockColumnsExtended} fixFirstColumn>
        <EtTableBody
          items={mockDataExtended}
          renderItem={({ item }) => <EtTableRow item={item} renderColumn={(column) => <Text>{column.name}</Text>} />}
          renderHeaderColumn={(column) => <Text testID={`header-${column.name}`}>{column.title}</Text>}
        />
      </EtTable>,
    );

    expect(getByTestId('test-table')).toBeTruthy();
    // Verify table headers are rendered
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('Price')).toBeTruthy();
  });

  it('should throw error if EtTableBody is missing "renderHeaderColumn" in fixed column mode', () => {
    try {
      render(
        <EtTable id="test-table" columns={mockColumnsExtended} fixFirstColumn>
          <EtTableBody
            items={mockDataExtended}
            renderItem={({ item }) => <EtTableRow item={item} renderColumn={(column) => <Text>{column.name}</Text>} />}
          />
        </EtTable>,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('renderHeaderColumn must be defined on EtTableBody when "fixFirstColumn" is true');
    }
  });

  it('should handle empty data gracefully', () => {
    const component = render(
      <EtTable id="test-table" columns={mockColumnsExtended}>
        <EtTableHead />
        <EtTableBody items={[]} renderItem={({ item }) => <EtTableRow item={item} renderColumn={() => <></>} />} />
      </EtTable>,
    );

    expect(component).toBeTruthy();
  });

  it('should render with fullHeight prop', () => {
    const component = render(
      <EtTable id="test-table" columns={mockColumnsExtended} fullHeight={true}>
        <EtTableHead />
        <EtTableBody
          items={mockDataExtended}
          renderItem={({ item }) => <EtTableRow item={item} renderColumn={(column) => <Text>{column.name}</Text>} />}
        />
      </EtTable>,
    );

    expect(component).toBeTruthy();
  });
});

describe('EtTable - sortable and snapToColumns (fixed-column mode)', () => {
  const sortItems = [
    { id: 1, name: 'Zeta', price: 3 },
    { id: 2, name: 'Alpha', price: 1 },
    { id: 3, name: 'Mid', price: 2 },
  ];
  const sortColumns = [
    { name: 'name', title: 'Name', visible: true, width: 40 },
    { name: 'price', title: 'Price', visible: true, width: 60 },
  ];

  const renderFixedTable = (bodyProps: object = {}) =>
    render(
      <EtTable id="sort-table" columns={sortColumns} fixFirstColumn>
        <EtTableBody
          items={sortItems}
          renderItem={({ item }) => <EtTableRow item={item} renderColumn={(rowItem) => <Text>{`row-${(rowItem as { name: string }).name}`}</Text>} />}
          {...bodyProps}
        />
      </EtTable>,
    );

  const visibleRowOrder = (queryAllByText: (m: RegExp) => { props: { children: string } }[]) =>
    queryAllByText(/^row-/).map((node) => node.props.children);

  it('GIVEN no onSortChange (uncontrolled default) WHEN a header is pressed THEN rows sort locally', () => {
    const { getByTestId, queryAllByText } = renderFixedTable();

    fireEvent.press(getByTestId('table-header-name'));

    // First press cycles null -> desc.
    expect(visibleRowOrder(queryAllByText)).toEqual(['row-Zeta', 'row-Mid', 'row-Alpha', 'row-Zeta', 'row-Mid', 'row-Alpha']);
  });

  it('GIVEN sortable={false} THEN header cells render inert (no pressable) and keep the given order', () => {
    const { queryByTestId, queryAllByText } = renderFixedTable({ sortable: false });

    // Inert header: the pressable wrapper only exists when sorting is enabled, so its absence
    // is the behavior — the uncontrolled local-sort fallback must not resurrect sorting.
    expect(queryByTestId('table-header-name')).toBeNull();
    expect(visibleRowOrder(queryAllByText)).toEqual(['row-Zeta', 'row-Alpha', 'row-Mid', 'row-Zeta', 'row-Alpha', 'row-Mid']);
  });

  it('GIVEN sortable={false} WHEN items change THEN the new array renders directly (controlled passthrough, no lagging state copy)', () => {
    const { getByTestId, queryAllByText, update } = renderFixedTable({ sortable: false });
    void getByTestId;

    const next = [{ id: 4, name: 'Fresh', price: 9 }];
    update(
      <EtTable id="sort-table" columns={sortColumns} fixFirstColumn>
        <EtTableBody
          items={next}
          renderItem={({ item }) => <EtTableRow item={item} renderColumn={(rowItem) => <Text>{`row-${(rowItem as { name: string }).name}`}</Text>} />}
          sortable={false}
        />
      </EtTable>,
    );

    expect(visibleRowOrder(queryAllByText)).toEqual(['row-Fresh', 'row-Fresh']);
  });

  it('GIVEN default snapToColumns WHEN rendered inline THEN the horizontal scroller snaps to column offsets', () => {
    const { UNSAFE_queryAllByType } = renderFixedTable();
    const { ScrollView } = require('react-native');

    const horizontal = UNSAFE_queryAllByType(ScrollView).filter((node: { props: { horizontal?: boolean } }) => node.props.horizontal);
    expect(horizontal.length).toBeGreaterThan(0);
    expect(horizontal[0]!.props.snapToOffsets).toBeDefined();
  });

  it('GIVEN snapToColumns={false} WHEN rendered inline THEN the horizontal scroller free-scrolls', () => {
    const { UNSAFE_queryAllByType } = renderFixedTable({ snapToColumns: false });
    const { ScrollView } = require('react-native');

    const horizontal = UNSAFE_queryAllByType(ScrollView).filter((node: { props: { horizontal?: boolean } }) => node.props.horizontal);
    expect(horizontal.length).toBeGreaterThan(0);
    expect(horizontal[0]!.props.snapToOffsets).toBeUndefined();
  });
});

describe('EtTable - snapToColumns on the virtualized path', () => {
  const columns = [
    { name: 'name', title: 'Name', visible: true, width: 40 },
    { name: 'price', title: 'Price', visible: true, width: 60 },
  ];
  const items = [{ id: 1, name: 'A', price: 1 }];

  const renderVirtualized = (bodyProps: object = {}) =>
    render(
      <EtTable id="virt-table" columns={columns} fixFirstColumn>
        <EtTableBody
          items={items}
          virtualizeRows
          renderItem={({ item }) => <EtTableRow item={item} renderColumn={(rowItem) => <Text>{`row-${(rowItem as { name: string }).name}`}</Text>} />}
          {...bodyProps}
        />
      </EtTable>,
    );

  it('GIVEN snapToColumns={false} THEN the virtualized body receives it (free-scroll decay path)', () => {
    // Regression pin: the prop must reach EtTableVirtualizedFixedColumnRows — the decay worklet
    // itself cannot run in jsdom, but a dropped pass-through silently restores column snapping.
    const { UNSAFE_getByType } = renderVirtualized({ snapToColumns: false });

    expect(UNSAFE_getByType(EtTableVirtualizedFixedColumnRows).props.snapToColumns).toBe(false);
  });

  it('GIVEN no snapToColumns THEN the virtualized body defaults to snapping (portfolio behavior)', () => {
    const { UNSAFE_getByType } = renderVirtualized();

    // The body owns the `true` default and forwards it explicitly.
    expect(UNSAFE_getByType(EtTableVirtualizedFixedColumnRows).props.snapToColumns).toBe(true);
  });
});
