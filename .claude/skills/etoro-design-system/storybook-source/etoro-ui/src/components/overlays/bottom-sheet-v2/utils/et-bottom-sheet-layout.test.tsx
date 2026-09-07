import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { EtBottomSheetFlashList, EtBottomSheetList, EtBottomSheetSectionList } from '../subcomponents';
import { BottomSheetLayoutParams, renderBottomSheetLayout } from './et-bottom-sheet-layout';

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    BottomSheetScrollView: ({ children, testID }: { children: React.ReactNode; testID?: string }) => (
      <View testID={testID ?? 'bottom-sheet-scroll-view'}>{children}</View>
    ),
    BottomSheetView: ({ children, testID }: { children: React.ReactNode; testID?: string }) => (
      <View testID={testID ?? 'bottom-sheet-view'}>{children}</View>
    ),
    BottomSheetFlatList: View,
    BottomSheetSectionList: View,
  };
});

// Mock @shopify/flash-list
jest.mock('@shopify/flash-list', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    FlashList: View,
  };
});

// Mock list subcomponents to avoid context dependency
// These are simple mocks that just render a View with the testID
jest.mock('../subcomponents', () => {
  const { View, FlatList, SectionList } = require('react-native');

  // Create mock components with displayName for isVirtualizedListElement

  function MockList(props: { testID?: string }) {
    return <FlatList {...props} testID={props.testID ?? 'mock-list'} />;
  }
  MockList.displayName = 'EtBottomSheetList';

  function MockSectionList(props: { testID?: string }) {
    return <SectionList {...props} testID={props.testID ?? 'mock-section-list'} />;
  }
  MockSectionList.displayName = 'EtBottomSheetSectionList';

  function MockFlashList(props: { testID?: string }) {
    return <View {...props} testID={props.testID ?? 'mock-flash-list'} />;
  }
  MockFlashList.displayName = 'EtBottomSheetFlashList';

  return {
    __esModule: true,
    EtBottomSheetList: MockList,
    EtBottomSheetSectionList: MockSectionList,
    EtBottomSheetFlashList: MockFlashList,
  };
});

interface ViewInstance {
  props: { style?: { height?: number } };
  findAllByType: (type: unknown) => ViewInstance[];
}

describe('renderBottomSheetLayout', () => {
  const defaultParams: BottomSheetLayoutParams = {
    headerChild: <Text testID="header">Header</Text>,
    contentChild: <Text testID="content">Content</Text>,
    footerChild: <Text testID="footer">Footer</Text>,
    isScrollable: false,
    isVirtualizedList: false,
    showsVerticalScrollIndicator: false,
    footerHeight: 100,
    bottomInset: 0,
    testID: 'test-bottom-sheet',
  };

  describe('static content layout (default)', () => {
    it('renders BottomSheetView with header, content, and footer spacer', () => {
      const result = renderBottomSheetLayout(defaultParams);
      render(result);

      expect(screen.getByTestId('test-bottom-sheet')).toBeTruthy();
      expect(screen.getByTestId('header')).toBeTruthy();
      expect(screen.getByTestId('content')).toBeTruthy();
    });

    it('renders footer spacer with correct height', () => {
      const result = renderBottomSheetLayout({
        ...defaultParams,
        footerHeight: 150,
      });
      const { root } = render(result);

      // Find the spacer View (last child with height style)
      const views = root.findAllByType(View) as ViewInstance[];
      const spacer = views.find((v: ViewInstance) => v.props.style?.height === 150);
      expect(spacer).toBeTruthy();
    });

    it('does not render footer spacer when footerChild is undefined', () => {
      const result = renderBottomSheetLayout({
        ...defaultParams,
        footerChild: undefined,
      });
      const { root } = render(result);

      // Should not have a spacer View with footerHeight
      const views = root.findAllByType(View) as ViewInstance[];
      const spacer = views.find((v: ViewInstance) => v.props.style?.height === defaultParams.footerHeight);
      expect(spacer).toBeFalsy();
    });

    it('renders bottom padding spacer when no footer', () => {
      const result = renderBottomSheetLayout({
        ...defaultParams,
        footerChild: undefined,
      });
      const { root } = render(result);

      // Should have a spacer View with bottom padding (20px)
      const views = root.findAllByType(View) as ViewInstance[];
      const bottomPadding = views.find((v: ViewInstance) => v.props.style?.height === 20);
      expect(bottomPadding).toBeTruthy();
    });

    it('uses safe area inset when larger than default padding and no footer', () => {
      const result = renderBottomSheetLayout({
        ...defaultParams,
        footerChild: undefined,
        bottomInset: 34, // iPhone home indicator
      });
      const { root } = render(result);

      // Should use safe area inset (34px) instead of default (20px)
      const views = root.findAllByType(View) as ViewInstance[];
      const bottomPadding = views.find((v: ViewInstance) => v.props.style?.height === 34);
      expect(bottomPadding).toBeTruthy();
    });

    it('renders without header when headerChild is undefined', () => {
      const result = renderBottomSheetLayout({
        ...defaultParams,
        headerChild: undefined,
      });
      render(result);

      expect(screen.queryByTestId('header')).toBeNull();
      expect(screen.getByTestId('content')).toBeTruthy();
    });

    it('renders without content when contentChild is undefined', () => {
      const result = renderBottomSheetLayout({
        ...defaultParams,
        contentChild: undefined,
      });
      render(result);

      expect(screen.getByTestId('header')).toBeTruthy();
      expect(screen.queryByTestId('content')).toBeNull();
    });
  });

  describe('scrollable content layout', () => {
    const scrollableParams: BottomSheetLayoutParams = {
      ...defaultParams,
      isScrollable: true,
    };

    it('renders BottomSheetScrollView for scrollable content', () => {
      const result = renderBottomSheetLayout(scrollableParams);
      render(result);

      expect(screen.getByTestId('test-bottom-sheet')).toBeTruthy();
    });

    it('renders header outside of scroll view', () => {
      const result = renderBottomSheetLayout(scrollableParams);
      render(result);

      expect(screen.getByTestId('header')).toBeTruthy();
      expect(screen.getByTestId('content')).toBeTruthy();
    });

    it('renders footer spacer inside scroll view', () => {
      const result = renderBottomSheetLayout({
        ...scrollableParams,
        footerHeight: 200,
      });
      const { toJSON } = render(result);

      // Check that the rendered output contains a View with height 200
      const json = JSON.stringify(toJSON());
      expect(json).toContain('"height":200');
    });

    it('does not render footer spacer when footerChild is undefined', () => {
      const result = renderBottomSheetLayout({
        ...scrollableParams,
        footerChild: undefined,
      });
      const { root } = render(result);

      const views = root.findAllByType(View) as ViewInstance[];
      const spacer = views.find((v: ViewInstance) => v.props.style?.height === defaultParams.footerHeight);
      expect(spacer).toBeFalsy();
    });

    it('renders bottom padding spacer when no footer in scrollable', () => {
      const result = renderBottomSheetLayout({
        ...scrollableParams,
        footerChild: undefined,
      });
      const { toJSON } = render(result);

      // Check that the rendered output contains a View with height 20
      const json = JSON.stringify(toJSON());
      expect(json).toContain('"height":20');
    });
  });

  describe('virtualized list layout', () => {
    it('renders header and list for virtualized list content', () => {
      const listContent = (
        <EtBottomSheetList
          testID="virtualized-list"
          data={[{ id: '1' }, { id: '2' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
        />
      );

      const result = renderBottomSheetLayout({
        ...defaultParams,
        contentChild: listContent,
        isVirtualizedList: true,
      });
      render(result);

      expect(screen.getByTestId('header')).toBeTruthy();
    });

    it('injects paddingBottom into list contentContainerStyle', () => {
      const existingStyle = { padding: 10 };
      const listContent = (
        <EtBottomSheetList
          testID="virtualized-list"
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
          contentContainerStyle={existingStyle}
        />
      );

      const result = renderBottomSheetLayout({
        ...defaultParams,
        contentChild: listContent,
        isVirtualizedList: true,
        footerHeight: 120,
      });

      // The cloned element should have merged contentContainerStyle
      const children = React.Children.toArray(result.props.children);
      const clonedList = children.find(
        (child): child is React.ReactElement => React.isValidElement(child) && 'contentContainerStyle' in (child.props as object),
      );

      expect(clonedList).toBeTruthy();
      expect((clonedList?.props as { contentContainerStyle?: unknown }).contentContainerStyle).toEqual([existingStyle, { paddingBottom: 120 }]);
    });

    it('injects bottom padding when footerChild is undefined', () => {
      const listContent = (
        <EtBottomSheetList
          testID="virtualized-list"
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
        />
      );

      const result = renderBottomSheetLayout({
        ...defaultParams,
        contentChild: listContent,
        footerChild: undefined,
        isVirtualizedList: true,
      });

      // Without footer, list should get default bottom padding (20px)
      const children = React.Children.toArray(result.props.children);
      const clonedList = children.find(
        (child): child is React.ReactElement => React.isValidElement(child) && 'contentContainerStyle' in (child.props as object),
      );

      expect(clonedList).toBeTruthy();
      expect((clonedList?.props as { contentContainerStyle?: unknown }).contentContainerStyle).toEqual([undefined, { paddingBottom: 20 }]);
    });

    it('uses safe area inset for virtualized list without footer', () => {
      const listContent = (
        <EtBottomSheetList
          testID="virtualized-list"
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
        />
      );

      const result = renderBottomSheetLayout({
        ...defaultParams,
        contentChild: listContent,
        footerChild: undefined,
        isVirtualizedList: true,
        bottomInset: 34, // iPhone home indicator
      });

      // Should use safe area inset (34px) instead of default (20px)
      const children = React.Children.toArray(result.props.children);
      const clonedList = children.find(
        (child): child is React.ReactElement => React.isValidElement(child) && 'contentContainerStyle' in (child.props as object),
      );

      expect(clonedList).toBeTruthy();
      expect((clonedList?.props as { contentContainerStyle?: unknown }).contentContainerStyle).toEqual([undefined, { paddingBottom: 34 }]);
    });

    it('works with EtBottomSheetSectionList', () => {
      const sectionListContent = (
        <EtBottomSheetSectionList
          testID="section-list"
          sections={[{ title: 'A', data: [{ id: '1' }] }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
        />
      );

      const result = renderBottomSheetLayout({
        ...defaultParams,
        contentChild: sectionListContent,
        isVirtualizedList: true,
        footerHeight: 80,
      });
      render(result);

      expect(screen.getByTestId('header')).toBeTruthy();
    });

    it('works with EtBottomSheetFlashList', () => {
      const flashListContent = (
        <EtBottomSheetFlashList
          testID="flash-list"
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
        />
      );

      const result = renderBottomSheetLayout({
        ...defaultParams,
        contentChild: flashListContent,
        isVirtualizedList: true,
      });
      render(result);

      expect(screen.getByTestId('header')).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('handles footerHeight of 0', () => {
      const result = renderBottomSheetLayout({
        ...defaultParams,
        footerHeight: 0,
      });
      const { root } = render(result);

      // Spacer should still render with height 0
      const views = root.findAllByType(View) as ViewInstance[];
      const spacer = views.find((v: ViewInstance) => v.props.style?.height === 0);
      expect(spacer).toBeTruthy();
    });

    it('handles all children undefined', () => {
      const result = renderBottomSheetLayout({
        ...defaultParams,
        headerChild: undefined,
        contentChild: undefined,
        footerChild: undefined,
      });
      render(result);

      // Should render empty BottomSheetView
      expect(screen.getByTestId('test-bottom-sheet')).toBeTruthy();
    });

    it('prioritizes virtualized list over scrollable flag', () => {
      const listContent = (
        <EtBottomSheetList
          testID="virtualized-list"
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
        />
      );

      // Both flags true - should use virtualized list path
      const result = renderBottomSheetLayout({
        ...defaultParams,
        contentChild: listContent,
        isScrollable: true,
        isVirtualizedList: true,
      });
      render(result);

      // Should not render BottomSheetScrollView (testID would be different)
      expect(screen.queryByTestId('test-bottom-sheet')).toBeNull();
      expect(screen.getByTestId('header')).toBeTruthy();
    });
  });
});
