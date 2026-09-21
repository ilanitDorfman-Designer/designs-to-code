import { render, screen, within } from '@testing-library/react-native';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { BOTTOM_OVERLAY_HEIGHT } from '../et-bottom-sheet-list.const';
import { EtBottomSheetList } from './et-bottom-sheet-list';

type TestListItem = { id: string; name: string };

// Mock useBottomSheetState context
const mockUseBottomSheetState = jest.fn();
jest.mock('../../../context', () => ({
  useBottomSheetState: () => mockUseBottomSheetState(),
}));

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const { FlatList } = require('react-native');
  return {
    BottomSheetFlatList: FlatList,
  };
});

describe('EtBottomSheetList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBottomSheetState.mockReturnValue({ isLoading: false });
  });

  describe('rendering', () => {
    it('renders list with data when not loading', () => {
      const data: TestListItem[] = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];

      render(
        <EtBottomSheetList<TestListItem>
          data={data}
          renderItem={({ item }) => <Text testID={`item-${item.id}`}>{item.name}</Text>}
          keyExtractor={(item) => item.id}
        />,
      );

      expect(screen.getByTestId('item-1')).toBeTruthy();
      expect(screen.getByTestId('item-2')).toBeTruthy();
      expect(screen.getByText('Item 1')).toBeTruthy();
      expect(screen.getByText('Item 2')).toBeTruthy();
    });

    it('has correct displayName', () => {
      expect(EtBottomSheetList.displayName).toBe('EtBottomSheet.List');
    });

    it('renders empty list without error', () => {
      const { toJSON } = render(<EtBottomSheetList data={[]} renderItem={() => <View />} keyExtractor={() => ''} />);

      expect(toJSON()).toBeTruthy();
    });
  });

  describe('loading state', () => {
    it('renders default ActivityIndicator when loading', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      const { UNSAFE_getByType } = render(<EtBottomSheetList data={[]} renderItem={() => <View />} keyExtractor={() => ''} />);

      const { ActivityIndicator } = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('renders custom loadingPlaceholder when provided', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      render(
        <EtBottomSheetList
          data={[]}
          renderItem={() => <View />}
          keyExtractor={() => ''}
          loadingPlaceholder={<Text testID="custom-loader">Loading...</Text>}
        />,
      );

      expect(screen.getByTestId('custom-loader')).toBeTruthy();
      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('does not render list items when loading', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      render(
        <EtBottomSheetList<TestListItem>
          data={[{ id: '1', name: 'Item' }]}
          renderItem={({ item }) => <Text>{item.name}</Text>}
          keyExtractor={(item) => item.id}
        />,
      );

      expect(screen.queryByText('Item')).toBeNull();
    });
  });

  describe('style props', () => {
    it('accepts custom style prop', () => {
      const customStyle = { backgroundColor: 'red' };

      const { toJSON } = render(
        <EtBottomSheetList data={[{ id: '1' }]} renderItem={() => <View />} keyExtractor={(item: { id: string }) => item.id} style={customStyle} />,
      );

      expect(toJSON()).toBeTruthy();
    });

    it('accepts custom contentContainerStyle prop', () => {
      const customStyle = { paddingTop: 20 };

      const { toJSON } = render(
        <EtBottomSheetList
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
          contentContainerStyle={customStyle}
        />,
      );

      expect(toJSON()).toBeTruthy();
    });
  });

  describe('bottomOverlay', () => {
    it('renders bottomOverlay as a pinned sibling outside FlatList', () => {
      const { UNSAFE_getByType } = render(
        <EtBottomSheetList
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
          bottomOverlay={<View testID="bottom-overlay" />}
        />,
      );

      const host = screen.getByTestId('et-bottom-sheet-list-bottom-overlay-host');
      const list = UNSAFE_getByType(FlatList);

      expect(within(host).getByTestId('bottom-overlay')).toBeTruthy();
      expect(within(list).queryByTestId('bottom-overlay')).toBeNull();
      expect(StyleSheet.flatten(host.props.style)).toMatchObject({
        position: 'absolute',
        bottom: 0,
        height: BOTTOM_OVERLAY_HEIGHT,
      });
      expect(host.props.pointerEvents).toBe('none');
    });
  });

  describe('FlatList props passthrough', () => {
    it('passes ListEmptyComponent', () => {
      render(
        <EtBottomSheetList
          data={[]}
          renderItem={() => <View />}
          keyExtractor={() => ''}
          ListEmptyComponent={<Text testID="empty-state">No items</Text>}
        />,
      );

      expect(screen.getByTestId('empty-state')).toBeTruthy();
      expect(screen.getByText('No items')).toBeTruthy();
    });

    it('passes ItemSeparatorComponent', () => {
      const data: TestListItem[] = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];

      render(
        <EtBottomSheetList<TestListItem>
          data={data}
          renderItem={({ item }) => <Text>{item.name}</Text>}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View testID="separator" style={testStyles.separator} />}
        />,
      );

      // Separator should be rendered between items
      expect(screen.getAllByTestId('separator').length).toBeGreaterThan(0);
    });
  });
});

const testStyles = StyleSheet.create({
  separator: {
    height: 1,
  },
});
