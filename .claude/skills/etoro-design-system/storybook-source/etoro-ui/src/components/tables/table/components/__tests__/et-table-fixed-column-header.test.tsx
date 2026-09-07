import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import type { EtTableColumn, EtTableSortState } from '../../api';
import { EtTableFixedColumnHeader } from '../et-table-fixed-column-header';

jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textSecondaryNeutral: '#999999',
      textPrimaryNeutral: '#ffffff',
      bgGreyTransparentPrimary: '#333333',
      transparent: 'transparent',
      backgroundBase: '#000000',
    },
  }),
}));

jest.mock('../glass-overlay', () => () => null);

const LONG_TITLE = 'Extremely Long Localized Percentage Change Over Selected Period';
const firstColumn: EtTableColumn = {
  name: 'asset',
  title: 'Asset',
  width: 132,
  isFirstColumn: true,
  sortable: false,
};
const movingColumn: EtTableColumn = {
  name: 'change',
  title: LONG_TITLE,
  width: 85,
  align: 'right',
};

function createScrollOffsetX(): SharedValue<number> {
  const shared = {
    value: 0,
    get: () => shared.value,
    set: (next: number) => {
      shared.value = next;
    },
  };
  return shared as unknown as SharedValue<number>;
}

const scrollOffsetX = createScrollOffsetX();
const onSortChange = jest.fn();

function renderHeader(sort: EtTableSortState | null = null, minimalSortHeader = true) {
  return render(
    <EtTableFixedColumnHeader
      firstColumn={firstColumn}
      movingColumns={[movingColumn]}
      scrollOffsetX={scrollOffsetX}
      sort={sort}
      onSortChange={onSortChange}
      minimalSortHeader={minimalSortHeader}
    />,
  );
}

describe('EtTableFixedColumnHeader long titles', () => {
  it('gives an unsorted compact title the full bounded column width', () => {
    const { getByTestId, queryByTestId } = renderHeader();

    const title = getByTestId('table-header-change-title');
    const titleStyle = StyleSheet.flatten(title.props.style);
    const columnStyle = StyleSheet.flatten(getByTestId('table-header-change').props.style);

    expect(title.props.children).toBe(LONG_TITLE);
    expect(title.props.numberOfLines).toBe(1);
    expect(title.props.ellipsizeMode).toBe('tail');
    expect(titleStyle).toEqual(expect.objectContaining({ flexShrink: 1, minWidth: 0 }));
    expect(columnStyle).toEqual(expect.objectContaining({ width: 85, overflow: 'hidden' }));
    expect(queryByTestId('table-header-change-sort-icon')).toBeNull();
  });

  it('shrinks the same long title around the chevron only while sorted', () => {
    const { getByTestId } = renderHeader({ column: 'change', direction: 'desc' });

    expect(getByTestId('table-header-change-sort-icon')).toBeTruthy();
    expect(StyleSheet.flatten(getByTestId('table-header-change-title').props.style)).toEqual(expect.objectContaining({ flexShrink: 1, minWidth: 0 }));
  });

  it('keeps the stable chevron footprint for standard table headers', () => {
    const { getByTestId } = renderHeader(null, false);

    expect(getByTestId('table-header-change-sort-icon')).toBeTruthy();
  });
});
