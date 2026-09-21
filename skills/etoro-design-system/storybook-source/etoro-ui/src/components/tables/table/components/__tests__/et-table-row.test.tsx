import { fireEvent, render } from '@testing-library/react-native';
import { ReactNode } from 'react';
import { Text } from 'react-native';

import { createMockTableConfig, mockColumns, mockItem } from '../__mocks__/test-data';
import { EtTableRow } from '../et-table-row';
import { TableConfigProvider } from '../table-config-provider';

jest.mock('../../../../../core/hooks/use-etoro-theme');

const renderWithProvider = (component: ReactNode) => {
  const mockTableConfig = createMockTableConfig();
  return render(<TableConfigProvider {...mockTableConfig}>{component}</TableConfigProvider>);
};

const defaultRenderColumn = (item: Record<string, unknown>, column: (typeof mockColumns)[number]) => (
  <Text>{String(item[column.name] ?? 'n/a')}</Text>
);

describe('EtTableRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with basic item data', () => {
    const { getByText } = renderWithProvider(<EtTableRow item={mockItem} renderColumn={defaultRenderColumn} />);

    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('150.00')).toBeTruthy();
    expect(getByText('2.5')).toBeTruthy();
  });

  it('should render with custom column renderer', () => {
    const mockRenderColumn = jest.fn((item, column) => <Text testID={`custom-${column.name}`}>Custom: {item[column.name]}</Text>);

    const { getByTestId } = renderWithProvider(<EtTableRow item={mockItem} renderColumn={mockRenderColumn} />);

    expect(getByTestId('custom-name')).toBeTruthy();
    expect(getByTestId('custom-price')).toBeTruthy();
    expect(mockRenderColumn).toHaveBeenCalledWith(mockItem, expect.objectContaining({ name: 'name' }));
  });

  it('should handle missing data gracefully', () => {
    const incompleteItem = { id: '2', name: 'Test Item' };

    const { getByText, getAllByText } = renderWithProvider(<EtTableRow item={incompleteItem} renderColumn={defaultRenderColumn} />);

    expect(getByText('Test Item')).toBeTruthy();
    expect(getAllByText('n/a')).toHaveLength(2); // Two missing fields (price and change)
  });

  it('should call onRowClick when row is pressed', () => {
    const mockOnRowClick = jest.fn();

    const { getByA11yHint } = renderWithProvider(<EtTableRow item={mockItem} onRowClick={mockOnRowClick} renderColumn={defaultRenderColumn} />);

    const touchable = getByA11yHint('TableRow');
    fireEvent.press(touchable);

    expect(mockOnRowClick).toHaveBeenCalledWith(mockItem);
  });

  it('should render correct number of cells based on visible columns', () => {
    const mockTableConfig = createMockTableConfig();
    const singleColumnConfig = {
      ...mockTableConfig,
      visibleColumns: [mockColumns[0]], // Only name column
    };

    const { getByText, queryByText } = render(
      <TableConfigProvider {...singleColumnConfig}>
        <EtTableRow item={mockItem} renderColumn={defaultRenderColumn} />
      </TableConfigProvider>,
    );

    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(queryByText('$150.00')).toBeFalsy();
    expect(queryByText('+2.5%')).toBeFalsy();
  });
});
