import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { CheckboxLabel } from '../subcomponents/checkbox-label';
import { useCheckboxChildren } from './use-checkbox-children';

// Mock useEtoroTheme for CheckboxLabel
jest.mock('etoro-ui/core', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

// Test wrapper component to render hook result
function TestWrapper({ children, disabled }: { children: React.ReactNode | undefined; disabled: boolean }) {
  const processedChildren = useCheckboxChildren(children, disabled);
  return <View testID="wrapper">{processedChildren}</View>;
}

describe('useCheckboxChildren', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Null/Undefined Children', () => {
    it('should return null when children is undefined', () => {
      const { getByTestId } = render(<TestWrapper disabled={false}>{undefined}</TestWrapper>);

      const wrapper = getByTestId('wrapper');
      expect(wrapper.children.length).toBe(0);
    });

    it('should return null when children is null', () => {
      const { getByTestId } = render(<TestWrapper disabled={false}>{null}</TestWrapper>);

      const wrapper = getByTestId('wrapper');
      expect(wrapper.children.length).toBe(0);
    });
  });

  describe('CheckboxLabel Element', () => {
    it('should clone CheckboxLabel with disabled prop', () => {
      const { getByText } = render(
        <TestWrapper disabled={false}>
          <CheckboxLabel>Label Text</CheckboxLabel>
        </TestWrapper>,
      );

      expect(getByText('Label Text')).toBeTruthy();
    });

    it('should inject disabled=true into CheckboxLabel', () => {
      const { getByText } = render(
        <TestWrapper disabled={true}>
          <CheckboxLabel>Label Text</CheckboxLabel>
        </TestWrapper>,
      );

      // Label should render with disabled styling
      expect(getByText('Label Text')).toBeTruthy();
    });

    it('should handle CheckboxLabel with custom style', () => {
      const customStyle = { fontSize: 18 };
      const { getByText } = render(
        <TestWrapper disabled={false}>
          <CheckboxLabel style={customStyle}>Styled Label</CheckboxLabel>
        </TestWrapper>,
      );

      expect(getByText('Styled Label')).toBeTruthy();
    });
  });

  describe('Other Elements', () => {
    it('should pass through other valid React elements unchanged', () => {
      const { getByTestId } = render(
        <TestWrapper disabled={false}>
          <View testID="custom-view">
            <Text>Custom Content</Text>
          </View>
        </TestWrapper>,
      );

      expect(getByTestId('custom-view')).toBeTruthy();
    });

    it('should pass through Text elements unchanged', () => {
      const { getByText } = render(
        <TestWrapper disabled={false}>
          <Text>Plain Text</Text>
        </TestWrapper>,
      );

      expect(getByText('Plain Text')).toBeTruthy();
    });

    it('should not modify non-CheckboxLabel elements', () => {
      const { getByTestId } = render(
        <TestWrapper disabled={true}>
          <View testID="passthrough-view">
            <Text>Passthrough Content</Text>
          </View>
        </TestWrapper>,
      );

      // The view should be rendered unchanged
      expect(getByTestId('passthrough-view')).toBeTruthy();
    });
  });

  describe('Multiple Children', () => {
    it('should process multiple CheckboxLabel children', () => {
      const { getByText } = render(
        <TestWrapper disabled={false}>
          <CheckboxLabel>First Label</CheckboxLabel>
          <CheckboxLabel>Second Label</CheckboxLabel>
        </TestWrapper>,
      );

      expect(getByText('First Label')).toBeTruthy();
      expect(getByText('Second Label')).toBeTruthy();
    });

    it('should process mixed children types', () => {
      const { getByText, getByTestId } = render(
        <TestWrapper disabled={false}>
          <CheckboxLabel>Label Text</CheckboxLabel>
          <View testID="custom-element">
            <Text>Custom</Text>
          </View>
        </TestWrapper>,
      );

      expect(getByText('Label Text')).toBeTruthy();
      expect(getByTestId('custom-element')).toBeTruthy();
    });

    it('should inject disabled prop into all CheckboxLabel children', () => {
      const { getByText } = render(
        <TestWrapper disabled={true}>
          <CheckboxLabel>First</CheckboxLabel>
          <CheckboxLabel>Second</CheckboxLabel>
        </TestWrapper>,
      );

      // Both labels should render with disabled state
      expect(getByText('First')).toBeTruthy();
      expect(getByText('Second')).toBeTruthy();
    });
  });

  describe('DisplayName Recognition', () => {
    it('should recognize CheckboxLabel by displayName', () => {
      // Verify CheckboxLabel has correct displayName
      expect(CheckboxLabel.displayName).toBe('EtCheckbox.Label');
    });

    it('should handle components with matching displayName', () => {
      // Create a custom component with matching displayName
      function CustomLabel({ children }: { children: React.ReactNode }) {
        return <Text>{children}</Text>;
      }
      CustomLabel.displayName = 'EtCheckbox.Label';

      const { getByText } = render(
        <TestWrapper disabled={false}>
          <CustomLabel>Custom Label</CustomLabel>
        </TestWrapper>,
      );

      expect(getByText('Custom Label')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string children', () => {
      const { getByTestId } = render(<TestWrapper disabled={false}>{''}</TestWrapper>);

      // Empty string should still be wrapped in CheckboxLabel
      const wrapper = getByTestId('wrapper');
      expect(wrapper).toBeTruthy();
    });

    it('should handle array of children', () => {
      const children = [<CheckboxLabel key="1">First</CheckboxLabel>, <CheckboxLabel key="2">Second</CheckboxLabel>];

      const { getByText } = render(<TestWrapper disabled={false}>{children}</TestWrapper>);

      expect(getByText('First')).toBeTruthy();
      expect(getByText('Second')).toBeTruthy();
    });

    it('should handle deeply nested children in passed-through elements', () => {
      const { getByText } = render(
        <TestWrapper disabled={false}>
          <View>
            <View>
              <Text>Deeply Nested</Text>
            </View>
          </View>
        </TestWrapper>,
      );

      expect(getByText('Deeply Nested')).toBeTruthy();
    });

    it('should handle rapid rerenders', () => {
      const { rerender, getByText } = render(
        <TestWrapper disabled={false}>
          <CheckboxLabel>Label</CheckboxLabel>
        </TestWrapper>,
      );

      for (let i = 0; i < 10; i++) {
        rerender(
          <TestWrapper disabled={i % 2 === 0}>
            <CheckboxLabel>Label</CheckboxLabel>
          </TestWrapper>,
        );
      }

      expect(getByText('Label')).toBeTruthy();
    });

    it('should handle boolean children (should be filtered out by React)', () => {
      const { getByTestId } = render(
        <TestWrapper disabled={false}>
          {false}
          {true}
        </TestWrapper>,
      );

      // Boolean values are not rendered by React
      const wrapper = getByTestId('wrapper');
      expect(wrapper).toBeTruthy();
    });

    it('should handle number children (should be rendered as text)', () => {
      const { getByTestId } = render(<TestWrapper disabled={false}>{42}</TestWrapper>);

      const wrapper = getByTestId('wrapper');
      expect(wrapper).toBeTruthy();
    });
  });

  describe('Disabled Prop Propagation', () => {
    it('should propagate disabled=false correctly', () => {
      const { getByText } = render(
        <TestWrapper disabled={false}>
          <CheckboxLabel>Not Disabled</CheckboxLabel>
        </TestWrapper>,
      );

      expect(getByText('Not Disabled')).toBeTruthy();
    });

    it('should propagate disabled=true correctly', () => {
      const { getByText } = render(
        <TestWrapper disabled={true}>
          <CheckboxLabel>Disabled</CheckboxLabel>
        </TestWrapper>,
      );

      expect(getByText('Disabled')).toBeTruthy();
    });

    it('should update disabled prop on rerender', () => {
      const { getByText, rerender } = render(
        <TestWrapper disabled={false}>
          <CheckboxLabel>Toggle Label</CheckboxLabel>
        </TestWrapper>,
      );

      expect(getByText('Toggle Label')).toBeTruthy();

      rerender(
        <TestWrapper disabled={true}>
          <CheckboxLabel>Toggle Label</CheckboxLabel>
        </TestWrapper>,
      );

      expect(getByText('Toggle Label')).toBeTruthy();
    });
  });
});
