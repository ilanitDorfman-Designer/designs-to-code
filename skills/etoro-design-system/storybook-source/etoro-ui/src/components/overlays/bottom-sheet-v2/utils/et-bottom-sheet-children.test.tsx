import React from 'react';
import { Text, View } from 'react-native';

import {
  EtBottomSheetContent,
  EtBottomSheetFlashList,
  EtBottomSheetFooter,
  EtBottomSheetHeader,
  EtBottomSheetList,
  EtBottomSheetSectionList,
} from '../subcomponents';
import { isVirtualizedListElement, parseBottomSheetChildren } from './et-bottom-sheet-children';

describe('parseBottomSheetChildren', () => {
  describe('child extraction', () => {
    it('returns undefined for all children when no children provided', () => {
      const result = parseBottomSheetChildren(null);

      expect(result.headerChild).toBeUndefined();
      expect(result.contentChild).toBeUndefined();
      expect(result.footerChild).toBeUndefined();
      expect(result.isScrollable).toBe(false);
      expect(result.isVirtualizedList).toBe(false);
      expect(result.headerTitle).toBeUndefined();
    });

    it('extracts Header child correctly', () => {
      const header = (
        <EtBottomSheetHeader>
          <Text>Header Content</Text>
        </EtBottomSheetHeader>
      );

      const result = parseBottomSheetChildren(header);

      expect(result.headerChild).toBeTruthy();
      expect((result.headerChild as React.ReactElement).type).toBe(EtBottomSheetHeader);
      expect(result.contentChild).toBeUndefined();
      expect(result.footerChild).toBeUndefined();
    });

    it('extracts Content child correctly', () => {
      const content = (
        <EtBottomSheetContent>
          <Text>Content</Text>
        </EtBottomSheetContent>
      );

      const result = parseBottomSheetChildren(content);

      expect(result.headerChild).toBeUndefined();
      expect(result.contentChild).toBeTruthy();
      expect((result.contentChild as React.ReactElement).type).toBe(EtBottomSheetContent);
      expect(result.footerChild).toBeUndefined();
    });

    it('extracts Footer child correctly', () => {
      const footer = (
        <EtBottomSheetFooter>
          <Text>Footer</Text>
        </EtBottomSheetFooter>
      );

      const result = parseBottomSheetChildren(footer);

      expect(result.headerChild).toBeUndefined();
      expect(result.contentChild).toBeUndefined();
      expect(result.footerChild).toBeTruthy();
      expect((result.footerChild as React.ReactElement).type).toBe(EtBottomSheetFooter);
    });

    it('extracts all children when provided together', () => {
      const children = [
        <EtBottomSheetHeader key="header">
          <EtBottomSheetHeader.Title>Title</EtBottomSheetHeader.Title>
        </EtBottomSheetHeader>,
        <EtBottomSheetContent key="content">
          <Text>Content</Text>
        </EtBottomSheetContent>,
        <EtBottomSheetFooter key="footer">
          <Text>Footer</Text>
        </EtBottomSheetFooter>,
      ];

      const result = parseBottomSheetChildren(children);

      expect(result.headerChild).toBeTruthy();
      expect(result.contentChild).toBeTruthy();
      expect(result.footerChild).toBeTruthy();
    });

    it('ignores non-subcomponent children', () => {
      const children = [
        <Text key="text">Random Text</Text>,
        <EtBottomSheetContent key="content">
          <Text>Content</Text>
        </EtBottomSheetContent>,
      ];

      const result = parseBottomSheetChildren(children);

      expect(result.headerChild).toBeUndefined();
      expect(result.contentChild).toBeTruthy();
      expect(result.footerChild).toBeUndefined();
    });
  });

  describe('validation', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('logs error when multiple Header components are provided', () => {
      const children = [
        <EtBottomSheetHeader key="header1">
          <Text>Header 1</Text>
        </EtBottomSheetHeader>,
        <EtBottomSheetHeader key="header2">
          <Text>Header 2</Text>
        </EtBottomSheetHeader>,
      ];

      const result = parseBottomSheetChildren(children);

      expect(consoleErrorSpy).toHaveBeenCalledWith('EtBottomSheet: Only one Header component is allowed. Using first, ignoring duplicates.');
      expect(result.headerChild).toBeTruthy();
    });

    it('logs error when multiple Content components are provided', () => {
      const children = [
        <EtBottomSheetContent key="content1">
          <Text>Content 1</Text>
        </EtBottomSheetContent>,
        <EtBottomSheetContent key="content2">
          <Text>Content 2</Text>
        </EtBottomSheetContent>,
      ];

      const result = parseBottomSheetChildren(children);

      expect(consoleErrorSpy).toHaveBeenCalledWith('EtBottomSheet: Only one Content component is allowed. Using first, ignoring duplicates.');
      expect(result.contentChild).toBeTruthy();
    });

    it('logs error when multiple Footer components are provided', () => {
      const children = [
        <EtBottomSheetFooter key="footer1">
          <Text>Footer 1</Text>
        </EtBottomSheetFooter>,
        <EtBottomSheetFooter key="footer2">
          <Text>Footer 2</Text>
        </EtBottomSheetFooter>,
      ];

      const result = parseBottomSheetChildren(children);

      expect(consoleErrorSpy).toHaveBeenCalledWith('EtBottomSheet: Only one Footer component is allowed. Using first, ignoring duplicates.');
      expect(result.footerChild).toBeTruthy();
    });
  });

  describe('scrollable extraction', () => {
    it('returns isScrollable as false when Content has no scrollable prop', () => {
      const content = (
        <EtBottomSheetContent>
          <Text>Content</Text>
        </EtBottomSheetContent>
      );

      const result = parseBottomSheetChildren(content);

      expect(result.isScrollable).toBe(false);
    });

    it('returns isScrollable as false when scrollable is explicitly false', () => {
      const content = (
        <EtBottomSheetContent scrollable={false}>
          <Text>Content</Text>
        </EtBottomSheetContent>
      );

      const result = parseBottomSheetChildren(content);

      expect(result.isScrollable).toBe(false);
    });

    it('returns isScrollable as true when scrollable is true', () => {
      const content = (
        <EtBottomSheetContent scrollable>
          <Text>Content</Text>
        </EtBottomSheetContent>
      );

      const result = parseBottomSheetChildren(content);

      expect(result.isScrollable).toBe(true);
    });

    it('returns isScrollable as false when no Content is provided', () => {
      const header = (
        <EtBottomSheetHeader>
          <EtBottomSheetHeader.Title>Title</EtBottomSheetHeader.Title>
        </EtBottomSheetHeader>
      );

      const result = parseBottomSheetChildren(header);

      expect(result.isScrollable).toBe(false);
    });
  });

  describe('headerTitle extraction', () => {
    it('extracts title from Header with Title subcomponent', () => {
      const header = (
        <EtBottomSheetHeader>
          <EtBottomSheetHeader.Title>My Sheet Title</EtBottomSheetHeader.Title>
        </EtBottomSheetHeader>
      );

      const result = parseBottomSheetChildren(header);

      expect(result.headerTitle).toBe('My Sheet Title');
    });

    it('returns undefined headerTitle when Header has no Title', () => {
      const header = (
        <EtBottomSheetHeader>
          <EtBottomSheetHeader.Action onPress={() => undefined} accessibilityLabel="Close">
            <Text>X</Text>
          </EtBottomSheetHeader.Action>
        </EtBottomSheetHeader>
      );

      const result = parseBottomSheetChildren(header);

      expect(result.headerTitle).toBeUndefined();
    });

    it('returns undefined headerTitle for Header with custom content', () => {
      const header = (
        <EtBottomSheetHeader>
          <Text>Custom Header</Text>
        </EtBottomSheetHeader>
      );

      const result = parseBottomSheetChildren(header);

      expect(result.headerTitle).toBeUndefined();
    });

    it('returns undefined headerTitle when no header is provided', () => {
      const content = (
        <EtBottomSheetContent>
          <Text>Content</Text>
        </EtBottomSheetContent>
      );

      const result = parseBottomSheetChildren(content);

      expect(result.headerTitle).toBeUndefined();
    });

    it('returns undefined headerTitle when Title has non-string children', () => {
      const header = (
        <EtBottomSheetHeader>
          <EtBottomSheetHeader.Title>
            <Text>Complex Title</Text>
          </EtBottomSheetHeader.Title>
        </EtBottomSheetHeader>
      );

      const result = parseBottomSheetChildren(header);

      expect(result.headerTitle).toBeUndefined();
    });
  });

  describe('virtualized list detection', () => {
    it('detects EtBottomSheet.List as virtualized list', () => {
      const list = (
        <EtBottomSheetList data={[{ id: '1' }, { id: '2' }]} renderItem={() => <View />} keyExtractor={(item: { id: string }) => item.id} />
      );

      const result = parseBottomSheetChildren(list);

      expect(result.contentChild).toBeTruthy();
      expect((result.contentChild as React.ReactElement).type).toBe(EtBottomSheetList);
      expect(result.isVirtualizedList).toBe(true);
      expect(result.isScrollable).toBe(false);
    });

    it('detects EtBottomSheet.SectionList as virtualized list', () => {
      const sectionList = (
        <EtBottomSheetSectionList
          sections={[{ title: 'A', data: [{ id: '1' }] }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
        />
      );

      const result = parseBottomSheetChildren(sectionList);

      expect(result.contentChild).toBeTruthy();
      expect((result.contentChild as React.ReactElement).type).toBe(EtBottomSheetSectionList);
      expect(result.isVirtualizedList).toBe(true);
      expect(result.isScrollable).toBe(false);
    });

    it('returns isVirtualizedList as false for Content', () => {
      const content = (
        <EtBottomSheetContent>
          <Text>Content</Text>
        </EtBottomSheetContent>
      );

      const result = parseBottomSheetChildren(content);

      expect(result.isVirtualizedList).toBe(false);
    });

    it('returns isVirtualizedList as false for scrollable Content', () => {
      const content = (
        <EtBottomSheetContent scrollable>
          <Text>Content</Text>
        </EtBottomSheetContent>
      );

      const result = parseBottomSheetChildren(content);

      expect(result.isVirtualizedList).toBe(false);
      expect(result.isScrollable).toBe(true);
    });

    it('logs error when multiple content components provided (Content + List)', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const children = [
        <EtBottomSheetContent key="content">
          <Text>Content</Text>
        </EtBottomSheetContent>,
        <EtBottomSheetList key="list" data={[]} renderItem={() => <View />} keyExtractor={(item: { id: string }) => item.id} />,
      ];

      const result = parseBottomSheetChildren(children);

      expect(consoleErrorSpy).toHaveBeenCalledWith('EtBottomSheet: Only one Content component is allowed. Using first, ignoring duplicates.');
      expect(result.contentChild).toBeTruthy();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('isVirtualizedListElement type guard', () => {
    it('returns true for EtBottomSheetList', () => {
      const list = <EtBottomSheetList data={[{ id: '1' }]} renderItem={() => <View />} keyExtractor={(item: { id: string }) => item.id} />;

      expect(isVirtualizedListElement(list)).toBe(true);
    });

    it('returns true for EtBottomSheetSectionList', () => {
      const sectionList = (
        <EtBottomSheetSectionList
          sections={[{ title: 'A', data: [{ id: '1' }] }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
        />
      );

      expect(isVirtualizedListElement(sectionList)).toBe(true);
    });

    it('returns true for EtBottomSheetFlashList', () => {
      const flashList = <EtBottomSheetFlashList data={[{ id: '1' }]} renderItem={() => <View />} keyExtractor={(item: { id: string }) => item.id} />;

      expect(isVirtualizedListElement(flashList)).toBe(true);
    });

    it('returns false for EtBottomSheetContent', () => {
      const content = (
        <EtBottomSheetContent>
          <Text>Content</Text>
        </EtBottomSheetContent>
      );

      expect(isVirtualizedListElement(content)).toBe(false);
    });

    it('returns false for non-element values', () => {
      expect(isVirtualizedListElement(null)).toBe(false);
      expect(isVirtualizedListElement(undefined)).toBe(false);
      expect(isVirtualizedListElement('string')).toBe(false);
      expect(isVirtualizedListElement(123)).toBe(false);
    });

    it('returns false for regular React elements', () => {
      const regularElement = <View />;
      expect(isVirtualizedListElement(regularElement)).toBe(false);
    });

    it('provides type narrowing for contentContainerStyle access', () => {
      const testStyle = { padding: 10 };
      const list = (
        <EtBottomSheetList
          data={[{ id: '1' }]}
          renderItem={() => <View />}
          keyExtractor={(item: { id: string }) => item.id}
          contentContainerStyle={testStyle}
        />
      );

      if (isVirtualizedListElement(list)) {
        expect(list.props.contentContainerStyle).toEqual(testStyle);
      }
    });
  });
});
