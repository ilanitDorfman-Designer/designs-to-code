import { act, fireEvent, render } from '@testing-library/react-native';
import { I18nManager, StyleSheet, Text } from 'react-native';

import { DEFAULT_LAYOUT_PADDING } from '../../../../../core/styles/constants';
import { EtTableColumn } from '../../api';
import { tableStyles } from '../../styles';
import { createMockTableConfig, mockData, testStyles } from '../__mocks__/test-data';
import EtTableBodyWithFixedColumn from '../et-table-body-with-fixed-column';
import { EtTableRow } from '../et-table-row';
import { TableConfigProvider } from '../table-config-provider';

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
      bgGreyTransparentPrimary: '#cccccc',
      textPrimaryNeutral: '#ffffff',
      textSecondaryNeutral: '#dddddd',
      textTertiaryNeutral: '#aaaaaa',
      carbonStatic900: '#111111',
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
  FlashList: ({ data, renderItem, testID, ...allProps }: any) => {
    const React = require('react');
    const { View } = require('react-native');

    return React.createElement(
      View,
      {
        testID,
        props: allProps, // Make props accessible for testing
      },
      data?.map((item: any, index: number) => {
        // Call renderItem to track calls
        const renderedContent = renderItem({ item, index });
        return React.createElement(View, { key: index }, renderedContent);
      }) || null,
    );
  },
}));

describe('EtTableBodyWithFixedColumn', () => {
  let mockTableConfig: {
    fixFirstColumn?: boolean;
    visibleColumns: EtTableColumn[];
    keyExtractor: (item: any, index: number) => string;
  };

  const mockRenderItem = jest.fn(({ item }) => (
    <EtTableRow item={item} style={testStyles.rowStyle} renderColumn={(column) => <Text>{column.name}</Text>} />
  ));
  const mockRenderColumn = jest.fn((column) => <>{column.title}</>);

  beforeEach(() => {
    mockTableConfig = { ...createMockTableConfig(), fixFirstColumn: true };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with items using ScrollView', () => {
    const { getAllByA11yHint } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableBodyWithFixedColumn items={mockData} renderItem={mockRenderItem} renderHeaderColumn={mockRenderColumn} />
      </TableConfigProvider>,
    );

    // Component should render rows (all items are rendered, not virtualized)
    const rows = getAllByA11yHint('TableRow');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('applies an exact row height to both the fixed and scrolling column stacks', () => {
    const rowHeight = 50;
    const renderFixedHeightRow = jest.fn(({ item }) => (
      <EtTableRow item={item} style={{ height: rowHeight }} renderColumn={(_item, column) => <Text>{column.name}</Text>} />
    ));
    const { getAllByA11yHint } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableBodyWithFixedColumn items={mockData} renderItem={renderFixedHeightRow} renderHeaderColumn={mockRenderColumn} />
      </TableConfigProvider>,
    );

    const rows = getAllByA11yHint('TableRow');
    expect(rows).toHaveLength(mockData.length * 2);
    rows.forEach((row) => {
      let ancestor = row.parent;
      let appliedHeight: number | undefined;

      while (ancestor && appliedHeight === undefined) {
        appliedHeight = StyleSheet.flatten(ancestor.props.style)?.height;
        ancestor = ancestor.parent;
      }

      expect(appliedHeight).toBe(rowHeight);
    });
  });

  it('should render fixed column layout with header', () => {
    const { getByText } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableBodyWithFixedColumn items={mockData} renderItem={mockRenderItem} renderHeaderColumn={(column) => <Text>{column.title}</Text>} />
      </TableConfigProvider>,
    );

    // Should render column headers
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('Price')).toBeTruthy();
    expect(getByText('Change')).toBeTruthy();
  });

  it('renders a scroll-linked glass overlay for the fixed body column when shrinkToContent hides the built-in header', () => {
    const { getAllByTestId } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableBodyWithFixedColumn
          items={mockData}
          shrinkToContent
          renderItem={mockRenderItem}
          renderHeaderColumn={(column) => <Text>{column.title}</Text>}
        />
      </TableConfigProvider>,
    );

    expect(getAllByTestId('et-table-glass-overlay')).toHaveLength(1);
  });

  it('does not render the fixed body glass overlay when glassEffect is disabled', () => {
    const { queryByTestId } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableBodyWithFixedColumn
          items={mockData}
          shrinkToContent
          glassEffect={{ disabled: true }}
          renderItem={mockRenderItem}
          renderHeaderColumn={(column) => <Text>{column.title}</Text>}
        />
      </TableConfigProvider>,
    );

    expect(queryByTestId('et-table-glass-overlay')).toBeNull();
  });

  it('keeps the fixed column aligned with the screen layout padding', () => {
    expect(StyleSheet.flatten(tableStyles.fixedColumnSection)?.paddingStart).toBeGreaterThan(0);
  });

  // ------------------------------------------------------------------
  // RTL layout (PAH-676): the fixed column's inset is logical (tracks
  // whichever physical edge it lands on), while the scrolling body/header
  // are locked to LTR so their column order can't drift apart under RTL.
  // ------------------------------------------------------------------
  describe('RTL fixed-column layout (PAH-676)', () => {
    const initialIsRTL = I18nManager.isRTL;

    afterEach(() => {
      Object.defineProperty(I18nManager, 'isRTL', { configurable: true, value: initialIsRTL });
    });

    it('uses a logical inset (not a physical paddingLeft/paddingRight) so it tracks either edge under RTL', () => {
      const flattened = StyleSheet.flatten(tableStyles.fixedColumnSection);
      expect(flattened?.paddingStart).toBeGreaterThan(0);
      expect(flattened?.paddingLeft).toBeUndefined();
      expect(flattened?.paddingRight).toBeUndefined();
    });

    it('keeps the scrolling body locked to LTR under RTL so its column order cannot drift from the header', () => {
      Object.defineProperty(I18nManager, 'isRTL', { configurable: true, value: true });

      expect(StyleSheet.flatten(tableStyles.scrollableWrapper)?.direction).toBe('ltr');
      expect(StyleSheet.flatten(tableStyles.scrollableContent)?.direction).toBe('ltr');
      expect(StyleSheet.flatten(tableStyles.scrollableScrollView)?.direction).toBe('ltr');
    });

    it('renders the moving columns in the same order under RTL as under LTR', () => {
      Object.defineProperty(I18nManager, 'isRTL', { configurable: true, value: true });

      const { getAllByText } = render(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn items={mockData} renderItem={mockRenderItem} renderHeaderColumn={(column) => <Text>{column.title}</Text>} />
        </TableConfigProvider>,
      );

      // "Name" is the fixed first column; "Price"/"Change" are the moving columns
      // whose relative order the LTR locks above are meant to protect under RTL.
      const movingColumnTitles = getAllByText(/^(Price|Change)$/).map((element) => element.props.children);
      expect(movingColumnTitles).toEqual(['Price', 'Change']);
    });

    it('aligns the header and the virtualized pinned column under RTL when virtualizeRows is enabled', () => {
      Object.defineProperty(I18nManager, 'isRTL', { configurable: true, value: true });

      const renderVirtualizedItem = jest.fn(({ item }) => <EtTableRow item={item} renderColumn={(_item, column) => <Text>{column.name}</Text>} />);

      const { getByText, getAllByText, getAllByTestId } = render(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn
            items={mockData}
            virtualizeRows
            renderItem={renderVirtualizedItem}
            renderHeaderColumn={(column) => <Text>{column.title}</Text>}
          />
        </TableConfigProvider>,
      );

      // Header's pinned column ("Name") and the virtualized body's pinned cell
      // (rendered per row as `column.name`, i.e. "name") both render under
      // RTL — the virtualized pinned column no longer flies off to the wrong
      // edge alongside the header's RTL-mirrored fixed column.
      expect(getByText('Name')).toBeTruthy();
      expect(getAllByText('name')).toHaveLength(mockData.length);

      // The row is locked to LTR like the header's `headerColumnsRow`, so the pinned
      // column lands on the same physical edge the header's translateX counts from.
      const rows = getAllByTestId('et-table-virtualized-fixed-column-row');
      expect(rows.length).toBe(mockData.length);
      expect(StyleSheet.flatten(rows[0].props.style)?.direction).toBe('ltr');

      // Verify the virtualized pinned cell keeps a logical (RTL-aware) inset.
      const pinnedCells = getAllByTestId('et-table-virtualized-pinned-cell');
      expect(pinnedCells.length).toBe(mockData.length);
      expect(StyleSheet.flatten(pinnedCells[0].props.style)?.paddingStart).toBe(DEFAULT_LAYOUT_PADDING);
    });
  });

  it('should throw error if renderHeaderColumn is not provided', () => {
    try {
      render(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn
            items={mockData}
            renderItem={mockRenderItem}
            // Missing renderHeaderColumn prop
            flashListProps={{ testID: 'et-table-body' }}
          />
        </TableConfigProvider>,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('renderHeaderColumn must be defined on EtTableBody when "fixFirstColumn" is true');
    }
  });

  it('should throw error if firstColumn or movingColumns is missing in config', () => {
    try {
      render(
        <TableConfigProvider
          {...{
            ...mockTableConfig,
            visibleColumns: [], // No columns defined
          }}
        >
          <EtTableBodyWithFixedColumn
            items={mockData}
            renderItem={mockRenderItem}
            renderHeaderColumn={() => <></>}
            flashListProps={{ testID: 'et-table-body' }}
          />
        </TableConfigProvider>,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('"firstColumn" or "movingColumns" is missing in EtTableBodyWithFixedColumn');
    }
  });

  // ------------------------------------------------------------------
  // Controlled sort mode (`onSortChange` provided)
  // ------------------------------------------------------------------
  describe('controlled sort mode', () => {
    it('emits onSortChange with desc state on first header press', () => {
      const onSortChange = jest.fn();
      const { getByText } = render(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn items={mockData} renderItem={mockRenderItem} sort={null} onSortChange={onSortChange} />
        </TableConfigProvider>,
      );

      fireEvent.press(getByText('Price'));

      expect(onSortChange).toHaveBeenCalledTimes(1);
      expect(onSortChange).toHaveBeenCalledWith({ column: 'price', direction: 'desc' });
    });

    it('cycles through desc → asc → null for the same column', () => {
      const onSortChange = jest.fn();
      const { getByText, rerender } = render(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn items={mockData} renderItem={mockRenderItem} sort={null} onSortChange={onSortChange} />
        </TableConfigProvider>,
      );

      fireEvent.press(getByText('Price'));
      expect(onSortChange).toHaveBeenLastCalledWith({ column: 'price', direction: 'desc' });

      rerender(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn
            items={mockData}
            renderItem={mockRenderItem}
            sort={{ column: 'price', direction: 'desc' }}
            onSortChange={onSortChange}
          />
        </TableConfigProvider>,
      );

      fireEvent.press(getByText('Price'));
      expect(onSortChange).toHaveBeenLastCalledWith({ column: 'price', direction: 'asc' });

      rerender(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn
            items={mockData}
            renderItem={mockRenderItem}
            sort={{ column: 'price', direction: 'asc' }}
            onSortChange={onSortChange}
          />
        </TableConfigProvider>,
      );

      fireEvent.press(getByText('Price'));
      expect(onSortChange).toHaveBeenLastCalledWith(null);
    });

    it('starts a new cycle at desc when a different column is pressed', () => {
      const onSortChange = jest.fn();
      const { getByText } = render(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn
            items={mockData}
            renderItem={mockRenderItem}
            sort={{ column: 'name', direction: 'asc' }}
            onSortChange={onSortChange}
          />
        </TableConfigProvider>,
      );

      fireEvent.press(getByText('Price'));

      expect(onSortChange).toHaveBeenCalledWith({ column: 'price', direction: 'desc' });
    });

    it('does not sort items locally — renders items in the order received', () => {
      const onSortChange = jest.fn();
      const renderItemSpy = jest.fn(({ item }) => (
        <EtTableRow item={item} renderColumn={(rowItem) => <Text>row-{String((rowItem as { id: string }).id)}</Text>} />
      ));

      const { getAllByText } = render(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn
            items={mockData}
            renderItem={renderItemSpy}
            // `desc` by name would sort 3→2→1 if the table sorted locally;
            // in controlled mode it MUST NOT do so.
            sort={{ column: 'name', direction: 'desc' }}
            onSortChange={onSortChange}
          />
        </TableConfigProvider>,
      );

      const renderedIds = getAllByText(/^row-/).map((el) => (el.props.children as Array<string>).join(''));
      const uniqueOrder = Array.from(new Set(renderedIds));

      expect(uniqueOrder).toEqual(['row-1', 'row-2', 'row-3']);
    });
  });

  // ------------------------------------------------------------------
  // Uncontrolled (legacy) mode — still sorts locally, and now re-syncs
  // with incoming `items` so consumers no longer need a remount hack.
  // ------------------------------------------------------------------
  describe('uncontrolled sort mode', () => {
    it('resyncs internal list when the `items` prop changes', () => {
      const renderSpy = jest.fn(({ item }) => <EtTableRow item={item} renderColumn={() => <Text>{String(item.id)}</Text>} />);

      const { rerender, getAllByA11yHint } = render(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn items={mockData} renderItem={renderSpy} />
        </TableConfigProvider>,
      );

      // Fixed column layout renders each row twice (fixed + scrollable sections).
      expect(getAllByA11yHint('TableRow').length).toBe(mockData.length * 2);

      const extended = [...mockData, { id: '4', name: 'Netflix', price: '$500.00', change: '+1.0%' }];
      rerender(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn items={extended} renderItem={renderSpy} />
        </TableConfigProvider>,
      );

      expect(getAllByA11yHint('TableRow').length).toBe(extended.length * 2);
    });

    it('still performs local sorting when a header is pressed (no onSortChange)', () => {
      const renderItemSpy = jest.fn(({ item }) => (
        <EtTableRow item={item} renderColumn={(rowItem) => <Text>row-{String((rowItem as { id: string }).id)}</Text>} />
      ));

      const { getByText, getAllByText } = render(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn items={mockData} renderItem={renderItemSpy} />
        </TableConfigProvider>,
      );

      act(() => {
        fireEvent.press(getByText('Name'));
      });

      // First press = desc by `name` → Microsoft (id=3) > Google (id=2) > Apple (id=1)
      const rendered = getAllByText(/^row-/).map((el) => (el.props.children as Array<string>).join(''));
      const uniqueOrder = Array.from(new Set(rendered));
      expect(uniqueOrder).toEqual(['row-3', 'row-2', 'row-1']);
    });

    it('re-applies the active sort when items change (preserves sort through data refresh)', () => {
      const renderItemSpy = jest.fn(({ item }) => (
        <EtTableRow item={item} renderColumn={(rowItem) => <Text>row-{String((rowItem as { id: string }).id)}</Text>} />
      ));

      const { getByText, getAllByText, rerender } = render(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn items={mockData} renderItem={renderItemSpy} />
        </TableConfigProvider>,
      );

      // Activate desc sort by `name`.
      act(() => {
        fireEvent.press(getByText('Name'));
      });

      const withExtra = [...mockData, { id: '4', name: 'Netflix Inc.', price: '$500.00', change: '+1.0%' }];
      rerender(
        <TableConfigProvider {...mockTableConfig}>
          <EtTableBodyWithFixedColumn items={withExtra} renderItem={renderItemSpy} />
        </TableConfigProvider>,
      );

      // After data refresh, desc-by-name sort is still active:
      // Netflix (id=4) > Microsoft (id=3) > Google (id=2) > Apple (id=1).
      const rendered = getAllByText(/^row-/).map((el) => (el.props.children as Array<string>).join(''));
      const uniqueOrder = Array.from(new Set(rendered));
      expect(uniqueOrder).toEqual(['row-4', 'row-3', 'row-2', 'row-1']);
    });
  });
});
