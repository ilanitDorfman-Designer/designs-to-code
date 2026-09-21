import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { createMockTableConfig, mockColumns } from '../__mocks__/test-data';
import { EtTableHead } from '../et-table-head';
import { TableConfigProvider } from '../table-config-provider';

jest.mock('../../../../../core/hooks/use-etoro-theme');

describe('EtTableHead', () => {
  let mockTableConfig: ReturnType<typeof createMockTableConfig>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTableConfig = createMockTableConfig();
  });

  it('should render with default column headers', () => {
    const { getByText } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableHead />
      </TableConfigProvider>,
    );

    expect(getByText('Name')).toBeTruthy();
    expect(getByText('Price')).toBeTruthy();
    expect(getByText('Change')).toBeTruthy();
  });

  it('should render with custom column renderer', () => {
    const mockRenderColumn = jest.fn((column) => <Text testID={`header-${column.name}`}>Custom: {column.title}</Text>);

    const { getByTestId } = render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableHead renderColumn={mockRenderColumn} />
      </TableConfigProvider>,
    );

    expect(getByTestId('header-name')).toBeTruthy();
    expect(getByTestId('header-price')).toBeTruthy();
    expect(getByTestId('header-change')).toBeTruthy();
    expect(mockRenderColumn).toHaveBeenCalledWith(expect.objectContaining({ name: 'name' }));
  });

  it('should render correct number of columns based on visible columns', () => {
    const singleColumnConfig = {
      ...mockTableConfig,
      visibleColumns: [mockColumns[0]], // Only name column
    };

    const { getByText, queryByText } = render(
      <TableConfigProvider {...singleColumnConfig}>
        <EtTableHead />
      </TableConfigProvider>,
    );

    expect(getByText('Name')).toBeTruthy();
    expect(queryByText('Price')).toBeFalsy();
    expect(queryByText('Change')).toBeFalsy();
  });

  it('should handle empty columns gracefully', () => {
    const emptyColumnConfig = {
      ...mockTableConfig,
      visibleColumns: [],
    };

    const component = render(
      <TableConfigProvider {...emptyColumnConfig}>
        <EtTableHead />
      </TableConfigProvider>,
    );

    expect(component).toBeTruthy();
  });

  it('should pass column data correctly to custom renderer', () => {
    const mockRenderColumn = jest.fn((column) => <Text testID={`custom-${column.name}`}>{column.title}</Text>);

    render(
      <TableConfigProvider {...mockTableConfig}>
        <EtTableHead renderColumn={mockRenderColumn} />
      </TableConfigProvider>,
    );

    expect(mockRenderColumn).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'name',
        title: 'Name',
        visible: true,
        width: 40,
      }),
    );
    expect(mockRenderColumn).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'price',
        title: 'Price',
        visible: true,
        width: 30,
      }),
    );
  });
});
