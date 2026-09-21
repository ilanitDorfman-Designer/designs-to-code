import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { EtAccordion } from './et-accordion';
import { AccordionContent } from './subcomponents/accordion-content';
import { AccordionHeader } from './subcomponents/accordion-header';
import { AccordionItem } from './subcomponents/accordion-item';

// Mock EtText component with proper displayName
function MockEtText({ children }: { children: React.ReactNode }) {
  return <Text>{children}</Text>;
}
MockEtText.displayName = 'EtText';

// Mock etoro-core/hooks
jest.mock('etoro-core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

// Note: react-native-reanimated is mocked globally in jest.setup.ts

describe('EtAccordion', () => {
  describe('Component Structure', () => {
    it('has Item as static property', () => {
      expect(EtAccordion.Item).toBeDefined();
    });

    it('has Header as static property', () => {
      expect(EtAccordion.Header).toBeDefined();
    });

    it('has Content as static property', () => {
      expect(EtAccordion.Content).toBeDefined();
    });

    it('EtAccordion.Item is the AccordionItem component', () => {
      expect(EtAccordion.Item).toBe(AccordionItem);
    });

    it('EtAccordion.Header is the AccordionHeader component', () => {
      expect(EtAccordion.Header).toBe(AccordionHeader);
    });

    it('EtAccordion.Content is the AccordionContent component', () => {
      expect(EtAccordion.Content).toBe(AccordionContent);
    });

    it('is a valid React component (memo wrapped)', () => {
      expect(EtAccordion).toBeDefined();
      expect(EtAccordion.$$typeof).toBeDefined();
    });
  });

  describe('Subcomponents', () => {
    describe('AccordionItem', () => {
      it('should have displayName set', () => {
        expect(AccordionItem.displayName).toBe('EtAccordion.Item');
      });
    });

    describe('AccordionHeader', () => {
      it('should have displayName set', () => {
        expect(AccordionHeader.displayName).toBe('EtAccordion.Header');
      });
    });

    describe('AccordionContent', () => {
      it('should have displayName set', () => {
        expect(AccordionContent.displayName).toBe('EtAccordion.Content');
      });
    });
  });
});

describe('EtAccordion Component Rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { getByText } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      expect(getByText('Question 1')).toBeTruthy();
    });

    it('renders with testID prop', () => {
      const { getByTestId } = render(
        <EtAccordion testID="test-accordion">
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      expect(getByTestId('test-accordion')).toBeTruthy();
    });

    it('renders multiple items', () => {
      const { getByText } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="2">
            <EtAccordion.Header>
              <MockEtText>Question 2</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 2</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      expect(getByText('Question 1')).toBeTruthy();
      expect(getByText('Question 2')).toBeTruthy();
    });

    it('renders header with testID', () => {
      const { getByTestId } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header testID="header-1">
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      expect(getByTestId('header-1')).toBeTruthy();
    });

    it('renders content with testID', () => {
      const { getByTestId } = render(
        <EtAccordion defaultExpandedIds={['1']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content testID="content-1">
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      expect(getByTestId('content-1')).toBeTruthy();
    });

    it('renders item with testID', () => {
      const { getByTestId } = render(
        <EtAccordion>
          <EtAccordion.Item id="1" testID="item-1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      expect(getByTestId('item-1')).toBeTruthy();
    });
  });

  describe('Default Expanded State', () => {
    it('renders with no items expanded by default', () => {
      const { getByRole } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const header = getByRole('button');
      expect(header.props.accessibilityState.expanded).toBe(false);
    });

    it('renders with specified items expanded', () => {
      const { getAllByRole } = render(
        <EtAccordion defaultExpandedIds={['1']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="2">
            <EtAccordion.Header>
              <MockEtText>Question 2</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 2</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const headers = getAllByRole('button');
      expect(headers[0].props.accessibilityState.expanded).toBe(true);
      expect(headers[1].props.accessibilityState.expanded).toBe(false);
    });

    it('renders with multiple items expanded when allowMultiple is true', () => {
      const { getAllByRole } = render(
        <EtAccordion allowMultiple defaultExpandedIds={['1', '2']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="2">
            <EtAccordion.Header>
              <MockEtText>Question 2</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 2</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const headers = getAllByRole('button');
      expect(headers[0].props.accessibilityState.expanded).toBe(true);
      expect(headers[1].props.accessibilityState.expanded).toBe(true);
    });
  });

  describe('Toggle Behavior', () => {
    it('expands item when header is pressed', () => {
      const { getByTestId, getByRole } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header testID="header-1">
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const header = getByTestId('header-1');
      expect(getByRole('button').props.accessibilityState.expanded).toBe(false);

      fireEvent.press(header);
      expect(getByRole('button').props.accessibilityState.expanded).toBe(true);
    });

    it('collapses expanded item when header is pressed', () => {
      const { getByTestId, getByRole } = render(
        <EtAccordion defaultExpandedIds={['1']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header testID="header-1">
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const header = getByTestId('header-1');
      expect(getByRole('button').props.accessibilityState.expanded).toBe(true);

      fireEvent.press(header);
      expect(getByRole('button').props.accessibilityState.expanded).toBe(false);
    });

    it('collapses other items when expanding new item (single mode)', () => {
      const { getByTestId, getAllByRole } = render(
        <EtAccordion defaultExpandedIds={['1']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header testID="header-1">
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="2">
            <EtAccordion.Header testID="header-2">
              <MockEtText>Question 2</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 2</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const headers = getAllByRole('button');
      expect(headers[0].props.accessibilityState.expanded).toBe(true);
      expect(headers[1].props.accessibilityState.expanded).toBe(false);

      fireEvent.press(getByTestId('header-2'));

      expect(headers[0].props.accessibilityState.expanded).toBe(false);
      expect(headers[1].props.accessibilityState.expanded).toBe(true);
    });

    it('keeps other items expanded when expanding new item (multiple mode)', () => {
      const { getByTestId, getAllByRole } = render(
        <EtAccordion allowMultiple defaultExpandedIds={['1']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header testID="header-1">
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="2">
            <EtAccordion.Header testID="header-2">
              <MockEtText>Question 2</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 2</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const headers = getAllByRole('button');
      expect(headers[0].props.accessibilityState.expanded).toBe(true);
      expect(headers[1].props.accessibilityState.expanded).toBe(false);

      fireEvent.press(getByTestId('header-2'));

      expect(headers[0].props.accessibilityState.expanded).toBe(true);
      expect(headers[1].props.accessibilityState.expanded).toBe(true);
    });
  });

  describe('Controlled Mode', () => {
    it('uses controlled expandedIds', () => {
      const { getAllByRole } = render(
        <EtAccordion expandedIds={['2']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="2">
            <EtAccordion.Header>
              <MockEtText>Question 2</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 2</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const headers = getAllByRole('button');
      expect(headers[0].props.accessibilityState.expanded).toBe(false);
      expect(headers[1].props.accessibilityState.expanded).toBe(true);
    });

    it('calls onExpandedChange when item is toggled', () => {
      const handleExpandedChange = jest.fn();
      const { getByTestId } = render(
        <EtAccordion onExpandedChange={handleExpandedChange}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header testID="header-1">
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      fireEvent.press(getByTestId('header-1'));
      expect(handleExpandedChange).toHaveBeenCalledWith(['1']);
    });

    it('calls onExpandedChange with correct ids when collapsing', () => {
      const handleExpandedChange = jest.fn();
      const { getByTestId } = render(
        <EtAccordion defaultExpandedIds={['1']} onExpandedChange={handleExpandedChange}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header testID="header-1">
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      fireEvent.press(getByTestId('header-1'));
      expect(handleExpandedChange).toHaveBeenCalledWith([]);
    });

    it('respects controlled state changes', () => {
      const { rerender, getAllByRole } = render(
        <EtAccordion expandedIds={['1']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="2">
            <EtAccordion.Header>
              <MockEtText>Question 2</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 2</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      let headers = getAllByRole('button');
      expect(headers[0].props.accessibilityState.expanded).toBe(true);
      expect(headers[1].props.accessibilityState.expanded).toBe(false);

      rerender(
        <EtAccordion expandedIds={['2']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="2">
            <EtAccordion.Header>
              <MockEtText>Question 2</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 2</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      headers = getAllByRole('button');
      expect(headers[0].props.accessibilityState.expanded).toBe(false);
      expect(headers[1].props.accessibilityState.expanded).toBe(true);
    });
  });

  describe('Disabled State', () => {
    it('does not toggle when item is disabled', () => {
      const { getByTestId, getByRole } = render(
        <EtAccordion>
          <EtAccordion.Item id="1" disabled>
            <EtAccordion.Header testID="header-1">
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const header = getByTestId('header-1');
      expect(getByRole('button').props.accessibilityState.expanded).toBe(false);

      fireEvent.press(header);
      expect(getByRole('button').props.accessibilityState.expanded).toBe(false);
    });

    it('has correct accessibility state when disabled', () => {
      const { getByRole } = render(
        <EtAccordion>
          <EtAccordion.Item id="1" disabled>
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const header = getByRole('button');
      expect(header.props.accessibilityState.disabled).toBe(true);
    });

    it('allows other items to toggle when one is disabled', () => {
      const { getByTestId, getAllByRole } = render(
        <EtAccordion>
          <EtAccordion.Item id="1" disabled>
            <EtAccordion.Header testID="header-1">
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="2">
            <EtAccordion.Header testID="header-2">
              <MockEtText>Question 2</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 2</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const headers = getAllByRole('button');
      expect(headers[1].props.accessibilityState.expanded).toBe(false);

      fireEvent.press(getByTestId('header-2'));
      expect(headers[1].props.accessibilityState.expanded).toBe(true);
    });
  });

  describe('Chevron Visibility', () => {
    it('header renders and is interactive by default', () => {
      const { getByRole } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      // Header should render (chevron is internal implementation)
      expect(getByRole('button')).toBeTruthy();
    });

    it('header remains interactive when showChevron is false', () => {
      const { getByRole } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header showChevron={false}>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      // Header should still render and be interactive
      expect(getByRole('button')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has button accessibility role on header', () => {
      const { getByRole } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('has correct expanded accessibility state when collapsed', () => {
      const { getByRole } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const header = getByRole('button');
      expect(header.props.accessibilityState.expanded).toBe(false);
    });

    it('has correct expanded accessibility state when expanded', () => {
      const { getByRole } = render(
        <EtAccordion defaultExpandedIds={['1']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const header = getByRole('button');
      expect(header.props.accessibilityState.expanded).toBe(true);
    });
  });

  describe('Style Customization', () => {
    it('applies custom style to accordion', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <EtAccordion testID="styled-accordion" style={customStyle}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const styledAccordion = getByTestId('styled-accordion');
      expect(styledAccordion).toBeTruthy();
      expect(styledAccordion).toHaveStyle(customStyle);
    });

    it('applies custom style to item', () => {
      const customStyle = { padding: 10 };
      const { getByTestId } = render(
        <EtAccordion>
          <EtAccordion.Item id="1" testID="styled-item" style={customStyle}>
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const styledItem = getByTestId('styled-item');
      expect(styledItem).toBeTruthy();
      expect(styledItem).toHaveStyle(customStyle);
    });

    it('applies custom style to header', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header testID="styled-header" style={customStyle}>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const styledHeader = getByTestId('styled-header');
      expect(styledHeader).toBeTruthy();
      expect(styledHeader).toHaveStyle(customStyle);
    });

    it('applies custom style to content', () => {
      const customStyle = { padding: 20 };
      const { getByTestId } = render(
        <EtAccordion defaultExpandedIds={['1']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content testID="styled-content" style={customStyle}>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const styledContent = getByTestId('styled-content');
      expect(styledContent).toBeTruthy();
      expect(styledContent).toHaveStyle(customStyle);
    });

    it('content has default paddingBottom and paddingRight', () => {
      const { getByTestId } = render(
        <EtAccordion defaultExpandedIds={['1']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content testID="content-1">
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const content = getByTestId('content-1');
      expect(content).toHaveStyle({ paddingBottom: 24, paddingRight: 16 });
    });
  });

  describe('Context Error Handling', () => {
    it('throws error when AccordionItem used outside EtAccordion', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <AccordionItem id="1">
            <MockEtText>Content</MockEtText>
          </AccordionItem>,
        );
      }).toThrow('EtAccordion compound components must be used within an EtAccordion component');

      consoleError.mockRestore();
    });

    it('throws error when AccordionHeader used outside EtAccordion.Item', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtAccordion>
            <AccordionHeader>
              <MockEtText>Header</MockEtText>
            </AccordionHeader>
          </EtAccordion>,
        );
      }).toThrow('EtAccordion.Header and EtAccordion.Content must be used within an EtAccordion.Item component');

      consoleError.mockRestore();
    });

    it('throws error when AccordionContent used outside EtAccordion.Item', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtAccordion>
            <AccordionContent>
              <MockEtText>Content</MockEtText>
            </AccordionContent>
          </EtAccordion>,
        );
      }).toThrow('EtAccordion.Header and EtAccordion.Content must be used within an EtAccordion.Item component');

      consoleError.mockRestore();
    });
  });

  describe('Children Validation', () => {
    it('throws error when AccordionHeader receives raw text', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtAccordion>
            <EtAccordion.Item id="1">
              {/* @ts-expect-error - testing invalid children type */}
              <EtAccordion.Header>Raw text</EtAccordion.Header>
              <EtAccordion.Content>
                <MockEtText>Answer</MockEtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
          </EtAccordion>,
        );
      }).toThrow('EtAccordion.Header only accepts EtText components as children');

      consoleError.mockRestore();
    });

    it('throws error when AccordionHeader receives React Native Text', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtAccordion>
            <EtAccordion.Item id="1">
              <EtAccordion.Header>
                <Text>Question</Text>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <MockEtText>Answer</MockEtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
          </EtAccordion>,
        );
      }).toThrow('EtAccordion.Header only accepts EtText components as children');

      consoleError.mockRestore();
    });

    it('throws error when AccordionHeader receives View component', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtAccordion>
            <EtAccordion.Item id="1">
              <EtAccordion.Header>
                <View>
                  <Text>Question</Text>
                </View>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <MockEtText>Answer</MockEtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
          </EtAccordion>,
        );
      }).toThrow('EtAccordion.Header only accepts EtText components as children');

      consoleError.mockRestore();
    });

    it('throws error when AccordionContent receives raw text', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtAccordion>
            <EtAccordion.Item id="1">
              <EtAccordion.Header>
                <MockEtText>Question</MockEtText>
              </EtAccordion.Header>
              {/* @ts-expect-error - testing invalid children type */}
              <EtAccordion.Content>Raw text</EtAccordion.Content>
            </EtAccordion.Item>
          </EtAccordion>,
        );
      }).toThrow('EtAccordion.Content only accepts EtText components as children');

      consoleError.mockRestore();
    });

    it('throws error when AccordionContent receives React Native Text', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtAccordion>
            <EtAccordion.Item id="1">
              <EtAccordion.Header>
                <MockEtText>Question</MockEtText>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <Text>Answer</Text>
              </EtAccordion.Content>
            </EtAccordion.Item>
          </EtAccordion>,
        );
      }).toThrow('EtAccordion.Content only accepts EtText components as children');

      consoleError.mockRestore();
    });

    it('accepts EtText components in Header', () => {
      expect(() => {
        render(
          <EtAccordion>
            <EtAccordion.Item id="1">
              <EtAccordion.Header>
                <MockEtText>Question</MockEtText>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <MockEtText>Answer</MockEtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
          </EtAccordion>,
        );
      }).not.toThrow();
    });

    it('accepts multiple EtText components in Header', () => {
      expect(() => {
        render(
          <EtAccordion>
            <EtAccordion.Item id="1">
              <EtAccordion.Header>
                <MockEtText>Question Part 1</MockEtText>
                <MockEtText>Question Part 2</MockEtText>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <MockEtText>Answer</MockEtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
          </EtAccordion>,
        );
      }).not.toThrow();
    });

    it('accepts multiple EtText components in Content', () => {
      expect(() => {
        render(
          <EtAccordion>
            <EtAccordion.Item id="1">
              <EtAccordion.Header>
                <MockEtText>Question</MockEtText>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <MockEtText>Answer Part 1</MockEtText>
                <MockEtText>Answer Part 2</MockEtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
          </EtAccordion>,
        );
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty defaultExpandedIds', () => {
      const { getByRole } = render(
        <EtAccordion defaultExpandedIds={[]}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const header = getByRole('button');
      expect(header.props.accessibilityState.expanded).toBe(false);
    });

    it('handles non-existent id in defaultExpandedIds', () => {
      const { getByRole } = render(
        <EtAccordion defaultExpandedIds={['non-existent']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const header = getByRole('button');
      expect(header.props.accessibilityState.expanded).toBe(false);
    });

    it('handles rapid successive toggles', () => {
      const { getByTestId, getByRole } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header testID="header-1">
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      const header = getByTestId('header-1');

      // Toggle rapidly
      fireEvent.press(header);
      fireEvent.press(header);
      fireEvent.press(header);

      // Should end up expanded (odd number of toggles)
      expect(getByRole('button').props.accessibilityState.expanded).toBe(true);
    });

    it('handles component unmounting gracefully', () => {
      const { unmount } = render(
        <EtAccordion>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('handles rendering many items', () => {
      const items = Array.from({ length: 20 }, (_, i) => ({
        id: String(i),
        question: `Question ${i}`,
        answer: `Answer ${i}`,
      }));

      const { getAllByRole } = render(
        <EtAccordion>
          {items.map((item) => (
            <EtAccordion.Item key={item.id} id={item.id}>
              <EtAccordion.Header>
                <MockEtText>{item.question}</MockEtText>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <MockEtText>{item.answer}</MockEtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
          ))}
        </EtAccordion>,
      );

      expect(getAllByRole('button')).toHaveLength(20);
    });

    it('keeps controlled expandedIds stable across rerenders', () => {
      const { rerender, getAllByRole } = render(
        <EtAccordion expandedIds={['1']}>
          <EtAccordion.Item id="1">
            <EtAccordion.Header>
              <MockEtText>Question 1</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 1</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="2">
            <EtAccordion.Header>
              <MockEtText>Question 2</MockEtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <MockEtText>Answer 2</MockEtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>,
      );

      for (let i = 0; i < 10; i++) {
        rerender(
          <EtAccordion allowMultiple={i % 2 === 0} expandedIds={i % 3 === 0 ? ['1'] : ['2']}>
            <EtAccordion.Item id="1">
              <EtAccordion.Header>
                <MockEtText>Question 1</MockEtText>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <MockEtText>Answer 1</MockEtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
            <EtAccordion.Item id="2">
              <EtAccordion.Header>
                <MockEtText>Question 2</MockEtText>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <MockEtText>Answer 2</MockEtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
          </EtAccordion>,
        );
        const expectedId = i % 3 === 0 ? '1' : '2';
        const buttons = getAllByRole('button');
        expect(buttons).toHaveLength(2);
        expect(buttons[0].props.accessibilityState.expanded).toBe(expectedId === '1');
        expect(buttons[1].props.accessibilityState.expanded).toBe(expectedId === '2');
      }

      expect(getAllByRole('button')).toHaveLength(2);
    });
  });
});
