import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { EtTableBodyFlashListProps } from '../../api';
import { EtTableBody } from '..';
import { createMockTableConfig, mockData, testStyles } from '../__mocks__/test-data';
import { EtTableRow } from '../et-table-row';
import { TableConfigProvider } from '../table-config-provider';

jest.mock('etoro-ui/core/hooks/use-etoro-theme');
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

describe('EtTableBody', () => {
  let mockTableConfig: ReturnType<typeof createMockTableConfig>;

  const renderColumnMock = jest.fn((item, column) => <Text>{String((item as any)[column.name] ?? 'n/a')}</Text>);

  beforeEach(() => {
    jest.clearAllMocks();
    mockTableConfig = createMockTableConfig();
  });

  it('should render FlashList with items', () => {
    const mockRenderItem = jest.fn(({ item }) => <EtTableRow item={item} style={testStyles.rowStyle} renderColumn={renderColumnMock} />);

    const { getByTestId } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableBody items={mockData} renderItem={mockRenderItem} flashListProps={{ testID: 'et-table-body' }} />
      </TableConfigProvider>,
    );

    const flashList = getByTestId('et-table-body');
    expect(flashList).toBeTruthy();
    expect(mockRenderItem).toHaveBeenCalledTimes(mockData.length);
    expect(mockRenderItem).toHaveBeenCalledWith({
      item: mockData[0],
      index: 0,
    });
  });

  it('should handle empty items array gracefully', () => {
    const mockRenderItem = jest.fn(({ item }) => <EtTableRow item={item} style={testStyles.rowStyle} renderColumn={renderColumnMock} />);

    const { getByTestId } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableBody items={[]} renderItem={mockRenderItem} flashListProps={{ testID: 'et-table-body' }} />
      </TableConfigProvider>,
    );

    const flatList = getByTestId('et-table-body');
    expect(flatList).toBeTruthy();
    // With empty items array, renderItem should not be called
    expect(mockRenderItem).not.toHaveBeenCalled();
  });

  it('should accept FlashList props without errors', () => {
    const mockRenderItem = jest.fn(({ item }) => <EtTableRow item={item} style={testStyles.rowStyle} renderColumn={renderColumnMock} />);

    const { getByTestId } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableBody
          items={mockData}
          flashListProps={{
            testID: 'et-table-body',
            showsVerticalScrollIndicator: false,
            scrollEnabled: true,
          }}
          renderItem={mockRenderItem}
        />
      </TableConfigProvider>,
    );

    const flashList = getByTestId('et-table-body');
    expect(flashList).toBeTruthy();
    expect(mockRenderItem).toHaveBeenCalledTimes(mockData.length);
  });

  // FlashList v2 ignores `removeClippedSubviews`, so RecyclerView spreads it onto the
  // native Android ScrollView and enables legacy subview clipping. That path yields null
  // children, which crash in `ViewGroup.dispatchDraw` (ETORO-MOBILE-7J).
  it('should not enable subview clipping on the underlying ScrollView', () => {
    const mockRenderItem = jest.fn(({ item }) => <EtTableRow item={item} style={testStyles.rowStyle} renderColumn={renderColumnMock} />);

    const { getByTestId } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableBody items={mockData} renderItem={mockRenderItem} flashListProps={{ testID: 'et-table-body' }} />
      </TableConfigProvider>,
    );

    expect(getByTestId('et-table-body').props.removeClippedSubviews).toBeUndefined();
  });

  // The prop bag is spread into FlashList, so it is a route back onto the crashing path. The type
  // omits the field, but a caller spreading an untyped object loses that check.
  it('should strip removeClippedSubviews from flashListProps', () => {
    const mockRenderItem = jest.fn(({ item }) => <EtTableRow item={item} style={testStyles.rowStyle} renderColumn={renderColumnMock} />);

    const { getByTestId } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableBody
          items={mockData}
          renderItem={mockRenderItem}
          flashListProps={{ testID: 'et-table-body', removeClippedSubviews: true } as EtTableBodyFlashListProps<(typeof mockData)[number]>}
        />
      </TableConfigProvider>,
    );

    expect(getByTestId('et-table-body').props.removeClippedSubviews).toBeUndefined();
  });
});
