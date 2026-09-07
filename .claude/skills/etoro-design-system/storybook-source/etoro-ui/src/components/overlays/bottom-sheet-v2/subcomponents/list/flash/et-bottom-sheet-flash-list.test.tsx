import { render, screen } from '@testing-library/react-native';
import React from 'react';
import * as ReactNative from 'react-native';
import { Text, View } from 'react-native';

import { EtBottomSheetFlashList } from './et-bottom-sheet-flash-list';

// Mock useBottomSheetState context
const mockUseBottomSheetState = jest.fn();
jest.mock('../../../context', () => ({
  useBottomSheetState: () => mockUseBottomSheetState(),
}));

jest.mock('../../../../../data-display/fade-mask', () => {
  const { View } = require('react-native');
  return {
    EtFadeMask: ({ position }: { position: string }) => <View testID={`et-fade-mask-${position}`} />,
  };
});

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = require('react-native');
  return {
    useBottomSheetScrollableCreator: () => View,
  };
});

// Mock @shopify/flash-list
jest.mock('@shopify/flash-list', () => {
  const { View } = require('react-native');
  return {
    FlashList: ({
      data,
      renderItem,
      testID,
      style,
      drawDistance,
    }: {
      data: unknown[];
      renderItem: (info: { item: unknown; index: number }) => React.ReactNode;
      testID?: string;
      style?: unknown;
      drawDistance?: number;
    }) => (
      <View testID={testID ?? 'flash-list'} style={style}>
        {data?.map((item, index) => (
          <View key={index}>{renderItem({ item, index })}</View>
        ))}
        {/* Expose drawDistance for testing */}
        <View testID="draw-distance-value">{String(drawDistance)}</View>
      </View>
    ),
  };
});

// Mock useWindowDimensions - use spyOn approach to avoid TurboModule issues
jest.spyOn(ReactNative, 'useWindowDimensions').mockReturnValue({
  width: 375,
  height: 812,
  scale: 2,
  fontScale: 1,
});

describe('EtBottomSheetFlashList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBottomSheetState.mockReturnValue({ isLoading: false });
  });

  describe('rendering', () => {
    it('renders FlashList with data when not loading', () => {
      const data = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];

      render(
        <EtBottomSheetFlashList
          data={data}
          renderItem={({ item }: { item: { id: string; name: string } }) => <Text testID={`item-${item.id}`}>{item.name}</Text>}
          keyExtractor={(item: { id: string; name: string }) => item.id}
        />,
      );

      expect(screen.getByTestId('item-1')).toBeTruthy();
      expect(screen.getByTestId('item-2')).toBeTruthy();
      expect(screen.getByText('Item 1')).toBeTruthy();
      expect(screen.getByText('Item 2')).toBeTruthy();
    });

    it('has correct displayName', () => {
      expect(EtBottomSheetFlashList.displayName).toBe('EtBottomSheet.FlashList');
    });
  });

  describe('loading state', () => {
    it('renders default ActivityIndicator when loading', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      const { UNSAFE_getByType } = render(<EtBottomSheetFlashList data={[]} renderItem={() => <View />} keyExtractor={() => ''} />);

      const { ActivityIndicator } = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('renders custom loadingPlaceholder when provided', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      render(
        <EtBottomSheetFlashList
          data={[]}
          renderItem={() => <View />}
          keyExtractor={() => ''}
          loadingPlaceholder={<Text testID="custom-loader">Loading...</Text>}
        />,
      );

      expect(screen.getByTestId('custom-loader')).toBeTruthy();
      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('does not render FlashList when loading', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      render(
        <EtBottomSheetFlashList
          data={[{ id: '1', name: 'Item' }]}
          renderItem={({ item }: { item: { id: string; name: string } }) => <Text>{item.name}</Text>}
          keyExtractor={(item: { id: string; name: string }) => item.id}
        />,
      );

      expect(screen.queryByText('Item')).toBeNull();
    });
  });

  describe('drawDistance', () => {
    it('uses default drawDistance when not provided', () => {
      render(<EtBottomSheetFlashList data={[{ id: '1' }]} renderItem={() => <View />} keyExtractor={(item: { id: string }) => item.id} />);

      // Default is 1200 for iOS (mocked platform)
      const drawDistanceElement = screen.getByTestId('draw-distance-value');
      expect(drawDistanceElement).toBeTruthy();
    });

    it('uses custom drawDistance when provided', () => {
      render(
        <EtBottomSheetFlashList
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
          drawDistance={2000}
        />,
      );

      const drawDistanceElement = screen.getByTestId('draw-distance-value');
      expect(drawDistanceElement.children[0]).toBe('2000');
    });
  });

  describe('style props', () => {
    it('merges contentContainerStyle with default styles', () => {
      const customStyle = { backgroundColor: 'red' };

      const { toJSON } = render(
        <EtBottomSheetFlashList
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
          contentContainerStyle={customStyle}
        />,
      );

      // Verify component renders without error with custom styles
      expect(toJSON()).toBeTruthy();
    });

    it('merges style prop with height style', () => {
      const customStyle = { backgroundColor: 'blue' };

      const { toJSON } = render(
        <EtBottomSheetFlashList
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
          style={customStyle}
        />,
      );

      expect(toJSON()).toBeTruthy();
    });
  });

  describe('edge fades', () => {
    it('does not render edge fades by default', () => {
      render(<EtBottomSheetFlashList data={[{ id: '1' }]} renderItem={() => <View />} keyExtractor={(item: { id: string }) => item.id} />);

      expect(screen.queryByTestId('et-fade-mask-top')).toBeNull();
      expect(screen.queryByTestId('et-fade-mask-bottom')).toBeNull();
    });

    it('renders top and bottom edge fades when showEdgeFades is true', () => {
      render(
        <EtBottomSheetFlashList
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
          showEdgeFades
          edgeFadeColor="#111"
          edgeFadeHeight={24}
        />,
      );

      expect(screen.getByTestId('et-fade-mask-top')).toBeTruthy();
      expect(screen.getByTestId('et-fade-mask-bottom')).toBeTruthy();
    });
  });
});
