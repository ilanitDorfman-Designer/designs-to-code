import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { EtBottomSheetSectionList } from './et-bottom-sheet-section-list';

// Mock useBottomSheetState context
const mockUseBottomSheetState = jest.fn();
jest.mock('../../../context', () => ({
  useBottomSheetState: () => mockUseBottomSheetState(),
}));

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const { SectionList } = require('react-native');
  return {
    BottomSheetSectionList: SectionList,
  };
});

describe('EtBottomSheetSectionList', () => {
  const mockSections = [
    {
      title: 'Section A',
      data: [
        { id: '1', name: 'Item A1' },
        { id: '2', name: 'Item A2' },
      ],
    },
    {
      title: 'Section B',
      data: [{ id: '3', name: 'Item B1' }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBottomSheetState.mockReturnValue({ isLoading: false });
  });

  describe('rendering', () => {
    it('renders sections with data when not loading', () => {
      render(
        <EtBottomSheetSectionList
          sections={mockSections}
          renderItem={({ item }: { item: { id: string; name: string } }) => <Text testID={`item-${item.id}`}>{item.name}</Text>}
          keyExtractor={(item: { id: string }) => item.id}
        />,
      );

      expect(screen.getByTestId('item-1')).toBeTruthy();
      expect(screen.getByTestId('item-2')).toBeTruthy();
      expect(screen.getByTestId('item-3')).toBeTruthy();
      expect(screen.getByText('Item A1')).toBeTruthy();
      expect(screen.getByText('Item B1')).toBeTruthy();
    });

    it('has correct displayName', () => {
      expect(EtBottomSheetSectionList.displayName).toBe('EtBottomSheet.SectionList');
    });

    it('renders empty sections without error', () => {
      const { toJSON } = render(<EtBottomSheetSectionList sections={[]} renderItem={() => <View />} keyExtractor={() => ''} />);

      expect(toJSON()).toBeTruthy();
    });
  });

  describe('loading state', () => {
    it('renders default ActivityIndicator when loading', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      const { UNSAFE_getByType } = render(<EtBottomSheetSectionList sections={[]} renderItem={() => <View />} keyExtractor={() => ''} />);

      const { ActivityIndicator } = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('renders custom loadingPlaceholder when provided', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      render(
        <EtBottomSheetSectionList
          sections={[]}
          renderItem={() => <View />}
          keyExtractor={() => ''}
          loadingPlaceholder={<Text testID="custom-loader">Loading...</Text>}
        />,
      );

      expect(screen.getByTestId('custom-loader')).toBeTruthy();
      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('does not render section items when loading', () => {
      mockUseBottomSheetState.mockReturnValue({ isLoading: true });

      render(
        <EtBottomSheetSectionList
          sections={mockSections}
          renderItem={({ item }: { item: { name: string } }) => <Text>{item.name}</Text>}
          keyExtractor={(item: { id: string }) => item.id}
        />,
      );

      expect(screen.queryByText('Item A1')).toBeNull();
    });
  });

  describe('section headers', () => {
    it('renders section headers when renderSectionHeader is provided', () => {
      render(
        <EtBottomSheetSectionList
          sections={mockSections}
          renderItem={({ item }: { item: { name: string } }) => <Text>{item.name}</Text>}
          renderSectionHeader={({ section }: { section: { title: string } }) => <Text testID={`header-${section.title}`}>{section.title}</Text>}
          keyExtractor={(item: { id: string }) => item.id}
        />,
      );

      expect(screen.getByTestId('header-Section A')).toBeTruthy();
      expect(screen.getByTestId('header-Section B')).toBeTruthy();
      expect(screen.getByText('Section A')).toBeTruthy();
      expect(screen.getByText('Section B')).toBeTruthy();
    });
  });

  describe('style props', () => {
    it('accepts custom style prop', () => {
      const customStyle = { backgroundColor: 'red' };

      const { toJSON } = render(
        <EtBottomSheetSectionList
          sections={mockSections}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
          style={customStyle}
        />,
      );

      expect(toJSON()).toBeTruthy();
    });

    it('accepts custom contentContainerStyle prop', () => {
      const customStyle = { paddingTop: 20 };

      const { toJSON } = render(
        <EtBottomSheetSectionList
          sections={mockSections}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
          contentContainerStyle={customStyle}
        />,
      );

      expect(toJSON()).toBeTruthy();
    });
  });
});
