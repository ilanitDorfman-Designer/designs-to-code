import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { EtBottomSheetContent } from './et-bottom-sheet-content';

// Mock useBottomSheetState context
const mockUseBottomSheetState = jest.fn();
jest.mock('../../context', () => ({
  useBottomSheetState: () => mockUseBottomSheetState(),
}));

describe('EtBottomSheetContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBottomSheetState.mockReturnValue({ isLoading: false });
  });

  describe('rendering', () => {
    it('renders children when not loading', () => {
      render(
        <EtBottomSheetContent>
          <Text testID="content">Hello World</Text>
        </EtBottomSheetContent>,
      );

      expect(screen.getByTestId('content')).toBeTruthy();
      expect(screen.getByText('Hello World')).toBeTruthy();
    });

    it('has correct displayName', () => {
      expect(EtBottomSheetContent.displayName).toBe('EtBottomSheet.Content');
    });

    it('renders multiple children', () => {
      render(
        <EtBottomSheetContent>
          <Text testID="child-1">First</Text>
          <Text testID="child-2">Second</Text>
          <View testID="child-3">
            <Text>Third</Text>
          </View>
        </EtBottomSheetContent>,
      );

      expect(screen.getByTestId('child-1')).toBeTruthy();
      expect(screen.getByTestId('child-2')).toBeTruthy();
      expect(screen.getByTestId('child-3')).toBeTruthy();
    });
  });

  describe('loading state', () => {
    it('renders default ActivityIndicator when loading', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      const { UNSAFE_getByType } = render(
        <EtBottomSheetContent>
          <Text>Content</Text>
        </EtBottomSheetContent>,
      );

      const { ActivityIndicator } = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('renders custom loadingPlaceholder when provided', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      render(
        <EtBottomSheetContent loadingPlaceholder={<Text testID="custom-loader">Loading...</Text>}>
          <Text>Content</Text>
        </EtBottomSheetContent>,
      );

      expect(screen.getByTestId('custom-loader')).toBeTruthy();
      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('does not render children when loading', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      render(
        <EtBottomSheetContent>
          <Text testID="content">Should not appear</Text>
        </EtBottomSheetContent>,
      );

      expect(screen.queryByTestId('content')).toBeNull();
      expect(screen.queryByText('Should not appear')).toBeNull();
    });
  });

  describe('style props', () => {
    it('accepts custom style prop', () => {
      const customStyle = { backgroundColor: 'red', padding: 20 };

      const { toJSON } = render(
        <EtBottomSheetContent style={customStyle}>
          <Text>Styled Content</Text>
        </EtBottomSheetContent>,
      );

      expect(toJSON()).toBeTruthy();
    });

    it('applies custom style when loading', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });
      const customStyle = { backgroundColor: 'blue' };

      const { toJSON } = render(
        <EtBottomSheetContent style={customStyle}>
          <Text>Content</Text>
        </EtBottomSheetContent>,
      );

      expect(toJSON()).toBeTruthy();
    });
  });

  describe('scrollable prop', () => {
    // Note: The scrollable prop is read by the parent EtBottomSheet component,
    // not used internally by EtBottomSheetContent. This test documents that behavior.
    it('accepts scrollable prop (used by parent component)', () => {
      // This should not throw - scrollable is a valid prop even though
      // it's used by the parent for determining scroll container type
      const { toJSON } = render(
        <EtBottomSheetContent scrollable>
          <Text>Scrollable content</Text>
        </EtBottomSheetContent>,
      );

      expect(toJSON()).toBeTruthy();
    });
  });
});
