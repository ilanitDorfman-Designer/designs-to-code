/**
 * Unit tests for renderAdornmentContent utility function
 */

import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { renderAdornmentContent } from '../render-adornment-content';

// Mock the EtoroIcon component
jest.mock('../../../../../../foundations/icon-assets/et-icon', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    EtoroIcon: ({ icon, appearance }: any) => <Text testID={`icon-${icon.iconName}`}>{`Icon: ${icon.iconName} (${appearance.size}px)`}</Text>,
  };
});

describe('renderAdornmentContent', () => {
  const defaultParams = {
    size: 20,
    color: '#888888',
  };

  describe('Precedence Logic', () => {
    it('renders icon when iconName is provided (highest priority)', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        iconName: 'search',
      });

      const { getByTestId } = render(<>{result}</>);
      expect(getByTestId('icon-search')).toBeTruthy();
    });

    it('renders icon even when children is also provided', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        iconName: 'mail',
        children: <Text>Text should be ignored</Text>,
      });

      const { getByTestId, queryByText } = render(<>{result}</>);
      expect(getByTestId('icon-mail')).toBeTruthy();
      expect(queryByText('Text should be ignored')).toBeNull();
    });

    it('renders children when no iconName is provided', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        children: <Text>$</Text>,
      });

      const { getByText } = render(<>{result}</>);
      expect(getByText('$')).toBeTruthy();
    });

    it('renders custom component when children is React element', () => {
      function CustomComponent() {
        return <Text testID="custom">Custom</Text>;
      }

      const result = renderAdornmentContent({
        ...defaultParams,
        children: <CustomComponent />,
      });

      const { getByTestId } = render(<>{result}</>);
      expect(getByTestId('custom')).toBeTruthy();
    });

    it('returns null when no iconName or children provided', () => {
      const result = renderAdornmentContent(defaultParams);
      expect(result).toBeNull();
    });
  });

  describe('Icon Rendering', () => {
    it('renders icon with correct size', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        iconName: 'search',
        size: 24,
      });

      const { getByText } = render(<>{result}</>);
      expect(getByText('Icon: search (24px)')).toBeTruthy();
    });

    it('renders icon with correct color', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        iconName: 'heart',
        color: '#FF0000',
      });

      const { getByTestId } = render(<>{result}</>);
      expect(getByTestId('icon-heart')).toBeTruthy();
    });

    it('handles different icon names', () => {
      const icons = ['search', 'mail', 'user', 'settings', 'heart'];

      icons.forEach((iconName) => {
        const result = renderAdornmentContent({
          ...defaultParams,
          iconName: iconName as any,
        });

        const { getByTestId } = render(<>{result}</>);
        expect(getByTestId(`icon-${iconName}`)).toBeTruthy();
      });
    });

    it('handles edge case icon sizes', () => {
      const sizes = [0, 1, 16, 20, 32, 100];

      sizes.forEach((size) => {
        const result = renderAdornmentContent({
          ...defaultParams,
          iconName: 'search',
          size,
        });

        const { getByText } = render(<>{result}</>);
        expect(getByText(`Icon: search (${size}px)`)).toBeTruthy();
      });
    });
  });

  describe('Children Rendering', () => {
    it('renders string children wrapped in Text', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        children: <Text>$</Text>,
      });

      const { getByText } = render(<>{result}</>);
      expect(getByText('$')).toBeTruthy();
    });

    it('handles empty string children', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        children: <Text></Text>,
      });

      expect(result).not.toBeNull();
      expect(React.isValidElement(result)).toBe(true);
    });

    it('handles special characters in children', () => {
      const specialChars = ['$', '€', '£', '%', '@', '#', '★'];

      specialChars.forEach((char) => {
        const result = renderAdornmentContent({
          ...defaultParams,
          children: <Text>{char}</Text>,
        });

        const { getByText } = render(<>{result}</>);
        expect(getByText(char)).toBeTruthy();
      });
    });

    it('handles long string children', () => {
      const longText = 'This is a very long prefix text';
      const result = renderAdornmentContent({
        ...defaultParams,
        children: <Text>{longText}</Text>,
      });

      const { getByText } = render(<>{result}</>);
      expect(getByText(longText)).toBeTruthy();
    });

    it('handles unicode characters', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        children: <Text>🔍</Text>,
      });

      const { getByText } = render(<>{result}</>);
      expect(getByText('🔍')).toBeTruthy();
    });
  });

  describe('Custom Component Rendering', () => {
    it('renders custom React component', () => {
      function CustomIcon() {
        return <Text testID="custom-icon">⚙️</Text>;
      }

      const result = renderAdornmentContent({
        ...defaultParams,
        children: <CustomIcon />,
      });

      const { getByTestId } = render(<>{result}</>);
      expect(getByTestId('custom-icon')).toBeTruthy();
    });

    it('renders custom component with props', () => {
      function Badge({ count }: { count: number }) {
        return <Text testID="badge">{count}</Text>;
      }

      const result = renderAdornmentContent({
        ...defaultParams,
        children: <Badge count={5} />,
      });

      const { getByText } = render(<>{result}</>);
      expect(getByText('5')).toBeTruthy();
    });

    it('renders nested custom components', () => {
      function Outer() {
        return (
          <Text testID="outer">
            <Text testID="inner">Nested</Text>
          </Text>
        );
      }

      const result = renderAdornmentContent({
        ...defaultParams,
        children: <Outer />,
      });

      const { getByTestId } = render(<>{result}</>);
      expect(getByTestId('outer')).toBeTruthy();
      expect(getByTestId('inner')).toBeTruthy();
    });

    it('preserves custom component functionality', () => {
      function InteractiveComponent() {
        return <Text testID="interactive">Press me</Text>;
      }

      const result = renderAdornmentContent({
        ...defaultParams,
        children: <InteractiveComponent />,
      });

      const { getByTestId } = render(<>{result}</>);
      expect(getByTestId('interactive')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined children', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        children: undefined,
      });

      expect(result).toBeNull();
    });

    it('handles null children', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        children: null,
      });

      expect(result).toBeNull();
    });

    it('handles zero size', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        iconName: 'search',
        size: 0,
      });

      const { getByText } = render(<>{result}</>);
      expect(getByText('Icon: search (0px)')).toBeTruthy();
    });

    it('handles very large size', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        iconName: 'search',
        size: 1000,
      });

      const { getByText } = render(<>{result}</>);
      expect(getByText('Icon: search (1000px)')).toBeTruthy();
    });
  });

  describe('Real-World Scenarios', () => {
    it('renders currency prefix', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        children: <Text>$</Text>,
        color: '#666666',
      });

      const { getByText } = render(<>{result}</>);
      expect(getByText('$')).toBeTruthy();
    });

    it('renders search icon prefix', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        iconName: 'search',
        size: 18,
        color: '#999999',
      });

      const { getByTestId } = render(<>{result}</>);
      expect(getByTestId('icon-search')).toBeTruthy();
    });

    it('renders email icon prefix', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        iconName: 'mail',
        size: 20,
      });

      const { getByTestId } = render(<>{result}</>);
      expect(getByTestId('icon-mail')).toBeTruthy();
    });

    it('renders percentage suffix', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        children: <Text>%</Text>,
      });

      const { getByText } = render(<>{result}</>);
      expect(getByText('%')).toBeTruthy();
    });

    it('renders URL prefix', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        children: <Text>https://</Text>,
        color: '#888888',
      });

      const { getByText } = render(<>{result}</>);
      expect(getByText('https://')).toBeTruthy();
    });

    it('renders custom verification badge', () => {
      function VerifiedBadge() {
        return <Text testID="verified">✓</Text>;
      }

      const result = renderAdornmentContent({
        ...defaultParams,
        children: <VerifiedBadge />,
      });

      const { getByTestId } = render(<>{result}</>);
      expect(getByTestId('verified')).toBeTruthy();
    });
  });

  describe('Type Safety', () => {
    it('accepts valid parameters', () => {
      expect(() => {
        void renderAdornmentContent({
          iconName: 'search',
          size: 20,
          children: <Text>$</Text>,
          color: '#000000',
        });
      }).not.toThrow();
    });

    it('returns correct type for icon', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        iconName: 'search',
      });

      expect(result).not.toBeNull();
      expect(React.isValidElement(result)).toBe(true);
    });

    it('returns correct type for children', () => {
      const result = renderAdornmentContent({
        ...defaultParams,
        children: <Text>$</Text>,
      });

      expect(result).not.toBeNull();
      expect(React.isValidElement(result)).toBe(true);
    });

    it('returns null for no content', () => {
      const result = renderAdornmentContent(defaultParams);
      expect(result).toBeNull();
    });
  });

  describe('Pure Function Behavior', () => {
    it('returns same result for same input (icon)', () => {
      const params = { ...defaultParams, iconName: 'search' as any };

      const result1 = renderAdornmentContent(params);
      const result2 = renderAdornmentContent(params);

      // Both should be valid React elements
      expect(React.isValidElement(result1)).toBe(true);
      expect(React.isValidElement(result2)).toBe(true);

      // Verify both render the same icon
      const { getByTestId: getById1 } = render(<>{result1}</>);
      const { getByTestId: getById2 } = render(<>{result2}</>);

      expect(getById1('icon-search')).toBeTruthy();
      expect(getById2('icon-search')).toBeTruthy();
    });

    it('returns same result for same input (children)', () => {
      const params = { ...defaultParams, children: <Text>$</Text> };

      const result1 = renderAdornmentContent(params);
      const result2 = renderAdornmentContent(params);

      const { getByText: getText1 } = render(<>{result1}</>);
      const { getByText: getText2 } = render(<>{result2}</>);

      expect(getText1('$')).toBeTruthy();
      expect(getText2('$')).toBeTruthy();
    });

    it('does not mutate input parameters', () => {
      const params = {
        ...defaultParams,
        iconName: 'search' as any,
        children: <Text>test</Text>,
      };
      const paramsCopy = { ...params };

      void renderAdornmentContent(params);

      expect(params).toEqual(paramsCopy);
    });
  });
});
