/**
 * Unit tests for EtSearchInput component
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { X3 } from '../../../core/styles/spacing';
import { EtSearchInput } from './et-search-input';

// Mock the EtoroIcon component
jest.mock('../../../foundations/icon-assets/et-icon', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    EtoroIcon: ({ icon, appearance }: any) => <Text testID={`icon-${icon.iconName}`}>{`Icon: ${icon.iconName} (${appearance.size}px)`}</Text>,
  };
});

// Mock EtText (Cancel label)
jest.mock('../../../foundations/text', () => ({
  EtText: function MockEtText({ children, style, ...props }: any) {
    const { Text } = require('react-native');
    return (
      <Text style={style} {...props}>
        {children}
      </Text>
    );
  },
}));

// Mock the useEtoroTheme hook
jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#000000',
      textSecondaryNeutral: '#666666',
      textTertiaryNeutral: '#999999',
      textQuaternaryNeutral: '#CCCCCC',
      bgNeutralPrimary: '#FFFFFF',
      bgNeutralGreyPrimary: '#F0F0F0',
      bgNeutralTertiary: '#F5F5F5',
      bgGreyTransparentPrimary: '#F0F0F0',
      dividerPrimary: '#333333',
      actionBrandText: '#0066CC',
      carbon300: '#D0D4D9',
      carbon900: '#1B1E21',
    },
  }),
}));

// Mock the useInputState hook
jest.mock('../input/hooks', () => ({
  useInputState: jest.fn(() => ({
    isFocused: false,
    handleFocus: jest.fn(),
    handleBlur: jest.fn(),
  })),
}));

// Force Liquid Glass support so `liquidGlass` prop tests exercise the glass render path.
// Other exports (EtGlassView, LiquidGlassContext, useLiquidGlassContext) stay real —
// with no native glass module registered, EtGlassView falls back to a plain View.
jest.mock('../../../core/liquid-glass', () => ({
  ...jest.requireActual('../../../core/liquid-glass'),
  useLiquidGlass: () => ({ supportsLiquidGlass: true }),
}));

describe('EtSearchInput', () => {
  const defaultProps = {
    value: '',
    onChangeText: jest.fn(),
    testID: 'search-input',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} />);

      expect(getByTestId('search-input')).toBeTruthy();
    });

    it('renders with custom placeholder', () => {
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} placeholder="Search stocks..." />);

      expect(getByPlaceholderText('Search stocks...')).toBeTruthy();
    });

    it('renders with default placeholder when not provided', () => {
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} />);

      expect(getByPlaceholderText('Search')).toBeTruthy();
    });

    it('renders search icon prefix', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} />);

      expect(getByTestId('search-input-search')).toBeTruthy();
    });

    it('does not render Cancel when value is empty and not focused', () => {
      const { queryByTestId } = render(<EtSearchInput {...defaultProps} />);

      expect(queryByTestId('search-input-cancel')).toBeNull();
    });

    it('renders Cancel when value is present', () => {
      const { getByTestId, getByText } = render(<EtSearchInput {...defaultProps} value="test" />);

      expect(getByTestId('search-input-cancel')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
    });

    it('renders Cancel when focused even if value is empty', () => {
      const useInputState = require('../input/hooks').useInputState;
      useInputState.mockImplementationOnce(() => ({
        isFocused: true,
        handleFocus: jest.fn(),
        handleBlur: jest.fn(),
      }));

      const { getByTestId, getByText } = render(<EtSearchInput {...defaultProps} />);

      expect(getByTestId('search-input-cancel')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
    });
  });

  describe('Value and Text Change', () => {
    it('displays the provided value', () => {
      const { getByDisplayValue } = render(<EtSearchInput {...defaultProps} value="AAPL" />);

      expect(getByDisplayValue('AAPL')).toBeTruthy();
    });

    it('calls onChangeText when text changes', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} onChangeText={onChangeTextMock} />);

      const input = getByPlaceholderText('Search');
      fireEvent.changeText(input, 'TSLA');

      expect(onChangeTextMock).toHaveBeenCalledWith('TSLA');
    });

    it('handles empty string value', () => {
      const { getByDisplayValue } = render(<EtSearchInput {...defaultProps} value="" />);

      expect(getByDisplayValue('')).toBeTruthy();
    });

    it('handles multiple text changes', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} onChangeText={onChangeTextMock} />);

      const input = getByPlaceholderText('Search');
      fireEvent.changeText(input, 'A');
      fireEvent.changeText(input, 'AA');
      fireEvent.changeText(input, 'AAP');
      fireEvent.changeText(input, 'AAPL');

      expect(onChangeTextMock).toHaveBeenCalledTimes(4);
      expect(onChangeTextMock).toHaveBeenLastCalledWith('AAPL');
    });
  });

  describe('Cancel control', () => {
    it('clears input when Cancel is pressed', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(<EtSearchInput {...defaultProps} value="test" onChangeText={onChangeTextMock} />);

      fireEvent.press(getByTestId('search-input-cancel'));

      expect(onChangeTextMock).toHaveBeenCalledWith('');
    });

    it('calls onCancel when Cancel is pressed', () => {
      const onCancelMock = jest.fn();
      const { getByTestId } = render(<EtSearchInput {...defaultProps} value="test" onCancel={onCancelMock} />);

      fireEvent.press(getByTestId('search-input-cancel'));

      expect(onCancelMock).toHaveBeenCalledTimes(1);
    });

    it('clears input and calls onCancel', () => {
      const onChangeTextMock = jest.fn();
      const onCancelMock = jest.fn();
      const { getByTestId } = render(<EtSearchInput {...defaultProps} value="test" onChangeText={onChangeTextMock} onCancel={onCancelMock} />);

      fireEvent.press(getByTestId('search-input-cancel'));

      expect(onChangeTextMock).toHaveBeenCalledWith('');
      expect(onCancelMock).toHaveBeenCalledTimes(1);
    });

    it('works without onCancel callback', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(<EtSearchInput {...defaultProps} value="test" onChangeText={onChangeTextMock} />);

      fireEvent.press(getByTestId('search-input-cancel'));

      expect(onChangeTextMock).toHaveBeenCalledWith('');
    });

    it('does not call onCancel when Cancel is not pressed', () => {
      const onCancelMock = jest.fn();
      render(<EtSearchInput {...defaultProps} value="test" onCancel={onCancelMock} />);

      expect(onCancelMock).not.toHaveBeenCalled();
    });

    it('uses custom cancelLabel', () => {
      const { getByText } = render(<EtSearchInput {...defaultProps} value="x" cancelLabel="Clear search" />);
      expect(getByText('Clear search')).toBeTruthy();
    });
  });

  describe('Disabled State', () => {
    it('renders when disabled', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} disabled={true} />);

      expect(getByTestId('search-input')).toBeTruthy();
    });

    it('passes disabled state to input field', () => {
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} disabled={true} />);

      const input = getByPlaceholderText('Search');
      expect(input.props.editable).toBe(false);
    });

    it('does not call onChangeText when disabled', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} disabled={true} onChangeText={onChangeTextMock} />);

      const input = getByPlaceholderText('Search');
      fireEvent.changeText(input, 'test');

      expect(onChangeTextMock).not.toHaveBeenCalled();
    });
  });

  describe('Max Length', () => {
    it('applies maxLength prop', () => {
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} maxLength={50} />);

      const input = getByPlaceholderText('Search');
      expect(input.props.maxLength).toBe(50);
    });

    it('works without maxLength prop', () => {
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} />);

      const input = getByPlaceholderText('Search');
      expect(input.props.maxLength).toBeUndefined();
    });
  });

  describe('Focus and Blur', () => {
    it('handles focus event', () => {
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} />);

      const input = getByPlaceholderText('Search');
      fireEvent(input, 'focus');

      // useInputState mock is called, focus handled internally
      expect(input).toBeTruthy();
    });

    it('handles blur event', () => {
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} />);

      const input = getByPlaceholderText('Search');
      fireEvent(input, 'blur');

      // useInputState mock is called, blur handled internally
      expect(input).toBeTruthy();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to TextInput', () => {
      const ref = React.createRef<TextInput>();
      render(<EtSearchInput {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(TextInput);
    });

    it('allows programmatic focus via ref', () => {
      const ref = React.createRef<TextInput>();
      render(<EtSearchInput {...defaultProps} ref={ref} />);

      const focusMock = jest.fn();
      if (ref.current) {
        ref.current.focus = focusMock;
        ref.current.focus();
      }

      expect(focusMock).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('applies accessibilityLabel', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} accessibilityLabel="Stock search input" />);

      const container = getByTestId('search-input');
      expect(container.props.accessibilityLabel).toBe('Stock search input');
    });

    it('applies accessibilityHint', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} accessibilityHint="Search for stocks by name or symbol" />);

      const container = getByTestId('search-input');
      expect(container.props.accessibilityHint).toBe('Search for stocks by name or symbol');
    });

    it('is accessible by default', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} />);

      const container = getByTestId('search-input');
      expect(container.props.accessible).toBe(true);
    });

    it('Cancel has accessibility role', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} value="test" />);

      const cancel = getByTestId('search-input-cancel');
      expect(cancel.props.accessibilityRole).toBe('button');
    });
  });

  describe('Styling', () => {
    it('uses fixed 64pt outer height', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} />);

      const container = getByTestId('search-input');
      const flat = StyleSheet.flatten(container.props.style);
      expect(flat.height).toBe(64);
    });

    it('uses X3 border radius', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} />);

      const container = getByTestId('search-input');
      const flat = StyleSheet.flatten(container.props.style);
      expect(flat.borderRadius).toBe(X3);
    });

    it('applies custom container style', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(<EtSearchInput {...defaultProps} style={customStyle} />);

      const container = getByTestId('search-input');
      expect(container.props.style).toContainEqual(customStyle);
    });

    it('applies custom containerStyle', () => {
      const customStyle = { paddingHorizontal: 10 };
      const { getByTestId } = render(<EtSearchInput {...defaultProps} containerStyle={customStyle} />);

      // containerStyle is applied to inner Animated.View
      expect(getByTestId('search-input')).toBeTruthy();
    });

    it('uses carbon900 at 8% opacity for the field background', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} />);

      const container = getByTestId('search-input');
      const flat = StyleSheet.flatten(container.props.style);
      expect(flat.backgroundColor).toBe('#1B1E2114');
    });

    it('uses compact variant dimensions', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} variant="compact" />);

      const container = getByTestId('search-input');
      const flat = StyleSheet.flatten(container.props.style);
      expect(flat.height).toBe(44);
      expect(flat.borderRadius).toBe(999);
    });
  });

  describe('Liquid Glass', () => {
    it('applies custom style prop to the outer container in glass mode', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(<EtSearchInput {...defaultProps} liquidGlass={true} style={customStyle} />);

      const container = getByTestId('search-input');
      expect(container.props.style).toContainEqual(customStyle);
    });

    it('applies testID and accessibility props to the outer container in glass mode', () => {
      const { getByTestId } = render(
        <EtSearchInput {...defaultProps} liquidGlass={true} accessibilityLabel="Stock search input" accessibilityHint="Search for stocks" />,
      );

      const container = getByTestId('search-input');
      expect(container.props.accessible).toBe(true);
      expect(container.props.accessibilityLabel).toBe('Stock search input');
      expect(container.props.accessibilityHint).toBe('Search for stocks');
    });

    it('falls back to the solid style path when Liquid Glass is unavailable', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(<EtSearchInput {...defaultProps} liquidGlass={false} style={customStyle} />);

      const container = getByTestId('search-input');
      const flat = StyleSheet.flatten(container.props.style);
      expect(flat.height).toBe(64);
      expect(container.props.style).toContainEqual(customStyle);
    });
  });

  describe('Compact Variant', () => {
    it('does not render Cancel text action for compact variant', () => {
      const { queryByTestId, queryByText } = render(<EtSearchInput {...defaultProps} value="test" variant="compact" />);

      expect(queryByTestId('search-input-cancel')).toBeNull();
      expect(queryByText('Cancel')).toBeNull();
    });

    it('renders inline clear icon for compact variant with text', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} value="test" variant="compact" />);

      expect(getByTestId('search-input-clear')).toBeTruthy();
    });

    it('clears input when compact clear icon is pressed', () => {
      const onChangeTextMock = jest.fn();
      const onCancelMock = jest.fn();
      const { getByTestId } = render(
        <EtSearchInput {...defaultProps} value="test" variant="compact" onChangeText={onChangeTextMock} onCancel={onCancelMock} />,
      );

      fireEvent.press(getByTestId('search-input-clear'));

      expect(onChangeTextMock).toHaveBeenCalledWith('');
      expect(onCancelMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Haptics', () => {
    it('passes haptics prop to useInputState', () => {
      render(<EtSearchInput {...defaultProps} haptics={true} />);

      const useInputState = require('../input/hooks').useInputState;
      expect(useInputState).toHaveBeenCalledWith(
        expect.objectContaining({
          haptics: true,
          disabled: false,
        }),
      );
    });

    it('defaults haptics to false', () => {
      render(<EtSearchInput {...defaultProps} />);

      const useInputState = require('../input/hooks').useInputState;
      expect(useInputState).toHaveBeenCalledWith(
        expect.objectContaining({
          haptics: false,
          disabled: false,
        }),
      );
    });
  });

  describe('Real-World Scenarios', () => {
    it('handles stock search flow', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText, getByTestId, rerender } = render(
        <EtSearchInput {...defaultProps} placeholder="Search stocks..." onChangeText={onChangeTextMock} />,
      );

      // User types stock symbol
      const input = getByPlaceholderText('Search stocks...');
      fireEvent.changeText(input, 'AAPL');
      expect(onChangeTextMock).toHaveBeenCalledWith('AAPL');

      // Re-render with the new value to show Cancel
      rerender(<EtSearchInput {...defaultProps} placeholder="Search stocks..." value="AAPL" onChangeText={onChangeTextMock} />);

      expect(getByTestId('search-input-cancel')).toBeTruthy();
    });

    it('handles crypto search flow', () => {
      const onChangeTextMock = jest.fn();
      const onCancelMock = jest.fn();
      const { getByPlaceholderText, getByTestId, rerender } = render(
        <EtSearchInput {...defaultProps} placeholder="Search crypto..." onChangeText={onChangeTextMock} onCancel={onCancelMock} />,
      );

      // User types crypto symbol
      const input = getByPlaceholderText('Search crypto...');
      fireEvent.changeText(input, 'BTC');
      expect(onChangeTextMock).toHaveBeenCalledWith('BTC');

      // Re-render with the new value to show Cancel
      rerender(
        <EtSearchInput {...defaultProps} placeholder="Search crypto..." value="BTC" onChangeText={onChangeTextMock} onCancel={onCancelMock} />,
      );

      fireEvent.press(getByTestId('search-input-cancel'));
      expect(onChangeTextMock).toHaveBeenCalledWith('');
      expect(onCancelMock).toHaveBeenCalled();
    });

    it('handles people search with max length', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = render(
        <EtSearchInput {...defaultProps} placeholder="Search people..." maxLength={50} onChangeText={onChangeTextMock} />,
      );

      const input = getByPlaceholderText('Search people...');
      expect(input.props.maxLength).toBe(50);

      fireEvent.changeText(input, 'john_doe');
      expect(onChangeTextMock).toHaveBeenCalledWith('john_doe');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid text changes', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} onChangeText={onChangeTextMock} />);

      const input = getByPlaceholderText('Search');
      for (let i = 0; i < 10; i++) {
        fireEvent.changeText(input, `test${i}`);
      }

      expect(onChangeTextMock).toHaveBeenCalledTimes(10);
    });

    it('does not show Cancel when value is empty and not focused', () => {
      const onChangeTextMock = jest.fn();
      const { queryByTestId } = render(<EtSearchInput {...defaultProps} value="" onChangeText={onChangeTextMock} />);

      expect(queryByTestId('search-input-cancel')).toBeNull();
    });

    it('handles special characters in search', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} onChangeText={onChangeTextMock} />);

      const input = getByPlaceholderText('Search');
      const specialText = '@#$%^&*()';
      fireEvent.changeText(input, specialText);

      expect(onChangeTextMock).toHaveBeenCalledWith(specialText);
    });

    it('handles very long search text', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} onChangeText={onChangeTextMock} />);

      const input = getByPlaceholderText('Search');
      const longText = 'a'.repeat(200);
      fireEvent.changeText(input, longText);

      expect(onChangeTextMock).toHaveBeenCalledWith(longText);
    });

    it('handles unicode characters', () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} onChangeText={onChangeTextMock} />);

      const input = getByPlaceholderText('Search');
      const unicodeText = '比特币 🚀 €¥£';
      fireEvent.changeText(input, unicodeText);

      expect(onChangeTextMock).toHaveBeenCalledWith(unicodeText);
    });
  });

  describe('TestID', () => {
    it('uses custom testID', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} testID="custom-search" />);

      expect(getByTestId('custom-search')).toBeTruthy();
    });

    it('generates correct testIDs for child elements', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} value="test" testID="my-search" />);

      expect(getByTestId('my-search-search')).toBeTruthy();
      expect(getByTestId('my-search-cancel')).toBeTruthy();
    });

    it('works with undefined testID', () => {
      const { getByPlaceholderText } = render(<EtSearchInput value="" onChangeText={jest.fn()} />);

      expect(getByPlaceholderText('Search')).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    it('integrates with InputAdornment for search icon', () => {
      const { getByTestId } = render(<EtSearchInput {...defaultProps} />);

      expect(getByTestId('search-input-search')).toBeTruthy();
    });

    it('renders Cancel as text action (not icon)', () => {
      const { getByTestId, getByText } = render(<EtSearchInput {...defaultProps} value="test" />);

      expect(getByTestId('search-input-cancel')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
    });

    it('integrates with InputField', () => {
      const { getByPlaceholderText } = render(<EtSearchInput {...defaultProps} />);

      expect(getByPlaceholderText('Search')).toBeTruthy();
    });
  });
});
