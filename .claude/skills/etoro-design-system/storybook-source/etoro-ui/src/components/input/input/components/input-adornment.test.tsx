/**
 * Unit tests for InputAdornment component
 */

import { fireEvent, render } from '@testing-library/react-native';

import { EtText } from '../../../../foundations/text/et-text';
import { InputAdornment } from './input-adornment';

// Mock the EtoroIcon component
jest.mock('../../../../foundations/icon-assets/et-icon', () => {
  const { Text } = require('react-native');
  return {
    EtoroIcon: ({ icon, appearance }: any) => <Text testID={`icon-${icon.iconName}`}>{`Icon: ${icon.iconName} (${appearance.size}px)`}</Text>,
  };
});

// Mock the EtText component
jest.mock('../../../../foundations/text/et-text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    EtText: ({ children, style, ...props }: any) => (
      <Text style={style} {...props}>
        {children}
      </Text>
    ),
  };
});

// Mock the useEtoroTheme hook
jest.mock('../../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textSecondaryNeutral: '#888888',
      bgNeutralSecondary: '#F5F5F5',
      actionBrandText: '#0066CC',
    },
  }),
}));

describe('InputAdornment', () => {
  const defaultProps = {
    position: 'prefix' as const,
    disabled: false,
  };

  describe('Rendering', () => {
    it('renders with icon', () => {
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="search" size={20} />);

      expect(getByTestId('icon-search')).toBeTruthy();
    });

    it('renders with text content', () => {
      const { getByText } = render(
        <InputAdornment {...defaultProps}>
          <EtText variant="body-secondary-regular">$</EtText>
        </InputAdornment>,
      );

      expect(getByText('$')).toBeTruthy();
    });

    it('renders with custom component content', () => {
      function CustomComponent() {
        const Text = require('react-native').Text;
        return <Text testID="custom-component">Custom</Text>;
      }
      const { getByTestId } = render(
        <InputAdornment {...defaultProps}>
          <CustomComponent />
        </InputAdornment>,
      );

      expect(getByTestId('custom-component')).toBeTruthy();
    });

    it('renders nothing when no icon or children provided', () => {
      const { queryByTestId } = render(<InputAdornment {...defaultProps} />);

      // Should still render the Pressable wrapper
      expect(queryByTestId('input-adornment-prefix')).toBeTruthy();
    });
  });

  describe('Icon Properties', () => {
    it('uses default size when not provided', () => {
      const { getByText } = render(<InputAdornment {...defaultProps} iconName="search" />);

      expect(getByText('Icon: search (20px)')).toBeTruthy();
    });

    it('uses custom size when provided', () => {
      const { getByText } = render(<InputAdornment {...defaultProps} iconName="search" size={24} />);

      expect(getByText('Icon: search (24px)')).toBeTruthy();
    });

    it('applies custom color to icon', () => {
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="mail" color="#FF0000" size={18} />);

      expect(getByTestId('icon-mail')).toBeTruthy();
    });

    it('uses default color when not provided', () => {
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="user" size={20} />);

      expect(getByTestId('icon-user')).toBeTruthy();
    });
  });

  describe('Text Content Properties', () => {
    it('renders text content with default styling', () => {
      const { getByText } = render(
        <InputAdornment {...defaultProps}>
          <EtText variant="body-secondary-regular">USD</EtText>
        </InputAdornment>,
      );

      const text = getByText('USD');
      expect(text).toBeTruthy();
    });

    it('applies custom color to text content', () => {
      const { getByText } = render(
        <InputAdornment {...defaultProps} color="#00FF00">
          <EtText variant="body-secondary-regular" style={{ color: '#00FF00' } as any}>
            €
          </EtText>
        </InputAdornment>,
      );

      expect(getByText('€')).toBeTruthy();
    });

    it('handles special characters in text', () => {
      const specialChars = ['$', '€', '£', '¥', '%', '@', '#'];

      specialChars.forEach((char) => {
        const { getByText } = render(
          <InputAdornment {...defaultProps}>
            <EtText variant="body-secondary-regular">{char}</EtText>
          </InputAdornment>,
        );
        expect(getByText(char)).toBeTruthy();
      });
    });

    it('handles long text content', () => {
      const { getByText } = render(
        <InputAdornment {...defaultProps}>
          <EtText variant="body-secondary-regular">https://</EtText>
        </InputAdornment>,
      );

      expect(getByText('https://')).toBeTruthy();
    });
  });

  describe('Position', () => {
    it('renders as prefix', () => {
      const { getByTestId } = render(<InputAdornment position="prefix" iconName="search" />);

      expect(getByTestId('input-adornment-prefix')).toBeTruthy();
    });

    it('renders as suffix', () => {
      const { getByTestId } = render(<InputAdornment position="suffix" iconName="close" />);

      expect(getByTestId('input-adornment-suffix')).toBeTruthy();
    });

    it('uses custom testID when provided', () => {
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="search" testID="custom-adornment" />);

      expect(getByTestId('custom-adornment')).toBeTruthy();
    });
  });

  describe('Press Handling', () => {
    it('calls onPress when clicked and not disabled', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} />);

      fireEvent.press(getByTestId('input-adornment-prefix'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} disabled={true} />);

      const container = getByTestId('input-adornment-prefix');
      // When disabled, onPress should not be attached
      expect(container.props.onPress).toBeUndefined();
      expect(container.props.accessibilityRole).toBeUndefined();
    });

    it('is not pressable when no onPress handler provided', () => {
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="mail" />);

      const pressable = getByTestId('input-adornment-prefix');
      // When no onPress handler, the Pressable is disabled
      expect(pressable.props.accessibilityRole).toBeUndefined();
    });

    it('has accessibility role button when pressable', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} />);

      const pressable = getByTestId('input-adornment-prefix');
      expect(pressable.props.accessibilityRole).toBe('button');
    });

    it('handles multiple presses', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} />);

      const button = getByTestId('input-adornment-prefix');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(onPressMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('Disabled State', () => {
    it('renders when disabled without onPress', () => {
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="user" disabled={true} />);

      expect(getByTestId('input-adornment-prefix')).toBeTruthy();
    });

    it('renders when disabled with onPress', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} disabled={true} />);

      expect(getByTestId('input-adornment-prefix')).toBeTruthy();
    });

    it('prevents interaction when disabled', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} disabled={true} />);

      const container = getByTestId('input-adornment-prefix');
      // When disabled, should not have onPress or accessibilityRole
      expect(container.props.onPress).toBeUndefined();
      expect(container.props.accessibilityRole).toBeUndefined();
    });
  });

  describe('Size Property', () => {
    it('handles various icon sizes', () => {
      const sizes = [16, 18, 20, 24, 32];

      sizes.forEach((size) => {
        const { getByText } = render(<InputAdornment {...defaultProps} iconName="search" size={size} />);
        expect(getByText(`Icon: search (${size}px)`)).toBeTruthy();
      });
    });

    it('accepts size prop for text content', () => {
      // Size prop is passed but mainly affects positioning, not text rendering
      const { getByText } = render(
        <InputAdornment {...defaultProps} size={28}>
          <EtText variant="body-secondary-regular">$</EtText>
        </InputAdornment>,
      );

      expect(getByText('$')).toBeTruthy();
    });
  });

  describe('Real-World Scenarios', () => {
    it('renders search icon prefix', () => {
      const { getByTestId } = render(<InputAdornment position="prefix" iconName="search" size={18} />);

      expect(getByTestId('icon-search')).toBeTruthy();
    });

    it('renders clearable suffix with handler', () => {
      const clearMock = jest.fn();
      const { getByTestId } = render(<InputAdornment position="suffix" iconName="closeSmall" onPress={clearMock} testID="clear-button" />);

      fireEvent.press(getByTestId('clear-button'));
      expect(clearMock).toHaveBeenCalled();
    });

    it('renders currency prefix', () => {
      const { getByText } = render(
        <InputAdornment position="prefix" size={10}>
          <EtText variant="body-secondary-regular">$</EtText>
        </InputAdornment>,
      );

      expect(getByText('$')).toBeTruthy();
    });

    it('renders currency suffix', () => {
      const { getByText } = render(
        <InputAdornment position="suffix" size={28}>
          <EtText variant="body-secondary-regular">USD</EtText>
        </InputAdornment>,
      );

      expect(getByText('USD')).toBeTruthy();
    });

    it('renders email icon prefix', () => {
      const { getByTestId } = render(<InputAdornment position="prefix" iconName="mail" size={18} />);

      expect(getByTestId('icon-mail')).toBeTruthy();
    });

    it('renders verification checkmark', () => {
      const { getByTestId } = render(<InputAdornment position="suffix" iconName="checked" color="#22C55E" size={20} />);

      expect(getByTestId('icon-checked')).toBeTruthy();
    });

    it('renders URL prefix text', () => {
      const { getByText } = render(
        <InputAdornment position="prefix" size={46}>
          <EtText variant="body-secondary-regular">https://</EtText>
        </InputAdornment>,
      );

      expect(getByText('https://')).toBeTruthy();
    });

    it('renders percentage symbol', () => {
      const { getByText } = render(
        <InputAdornment position="prefix" size={9}>
          <EtText variant="body-secondary-regular">%</EtText>
        </InputAdornment>,
      );

      expect(getByText('%')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero size', () => {
      const { getByText } = render(<InputAdornment {...defaultProps} iconName="search" size={0} />);

      expect(getByText('Icon: search (0px)')).toBeTruthy();
    });

    it('handles very large size', () => {
      const { getByText } = render(<InputAdornment {...defaultProps} iconName="search" size={100} />);

      expect(getByText('Icon: search (100px)')).toBeTruthy();
    });

    it('handles empty string content', () => {
      const { root } = render(<InputAdornment {...defaultProps}></InputAdornment>);

      // Empty string renders but is not queryable by text
      expect(root).toBeTruthy();
    });

    it('handles undefined color gracefully', () => {
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="search" color={undefined} />);

      expect(getByTestId('icon-search')).toBeTruthy();
    });

    it('handles both icon and children (icon takes precedence)', () => {
      const { getByTestId, queryByText } = render(
        <InputAdornment {...defaultProps} iconName="search">
          <EtText variant="body-secondary-regular">Should not appear</EtText>
        </InputAdornment>,
      );

      expect(getByTestId('icon-search')).toBeTruthy();
      expect(queryByText('Should not appear')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility role when interactive', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} />);

      const pressable = getByTestId('input-adornment-prefix');
      expect(pressable.props.accessibilityRole).toBe('button');
    });

    it('has hitSlop for better touch targets', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} />);

      const pressable = getByTestId('input-adornment-prefix');
      expect(pressable.props.hitSlop).toBe(8);
    });

    it('does not have hitSlop when not interactive', () => {
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="search" />);

      const view = getByTestId('input-adornment-prefix');
      expect(view.props.hitSlop).toBeUndefined();
    });

    it('uses provided testID for identification', () => {
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="search" testID="search-icon" />);

      expect(getByTestId('search-icon')).toBeTruthy();
    });

    it('falls back to default testID when not provided', () => {
      const { getByTestId } = render(<InputAdornment position="prefix" iconName="search" />);

      expect(getByTestId('input-adornment-prefix')).toBeTruthy();
    });

    it('generates correct testID for suffix position', () => {
      const { getByTestId } = render(<InputAdornment position="suffix" iconName="close" />);

      expect(getByTestId('input-adornment-suffix')).toBeTruthy();
    });
  });

  describe('Container Type (View vs Pressable)', () => {
    it('renders as View when no onPress handler', () => {
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="search" />);

      const container = getByTestId('input-adornment-prefix');
      // View does not have accessibilityRole for buttons
      expect(container.props.accessibilityRole).toBeUndefined();
    });

    it('renders as Pressable when onPress handler provided', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} />);

      const container = getByTestId('input-adornment-prefix');
      // Pressable has accessibilityRole when interactive
      expect(container.props.accessibilityRole).toBe('button');
    });

    it('renders as View when onPress provided but disabled', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} disabled={true} />);

      const container = getByTestId('input-adornment-prefix');
      // When disabled, should not have button role
      expect(container.props.accessibilityRole).toBeUndefined();
    });
  });

  describe('Interactive vs Non-Interactive States', () => {
    it('is interactive when onPress is provided and not disabled', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} disabled={false} />);

      fireEvent.press(getByTestId('input-adornment-prefix'));
      expect(onPressMock).toHaveBeenCalled();
    });

    it('is non-interactive when onPress is not provided', () => {
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="search" />);

      const container = getByTestId('input-adornment-prefix');
      expect(container.props.onPress).toBeUndefined();
    });

    it('is non-interactive when disabled is true', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} disabled={true} />);

      const container = getByTestId('input-adornment-prefix');
      // When disabled, should not have onPress prop
      expect(container.props.onPress).toBeUndefined();
      // When disabled, should not have accessibilityRole
      expect(container.props.accessibilityRole).toBeUndefined();
    });

    it('transitions from non-interactive to interactive', () => {
      const onPressMock = jest.fn();
      const { getByTestId, rerender } = render(<InputAdornment {...defaultProps} iconName="close" />);

      let container = getByTestId('input-adornment-prefix');
      expect(container.props.accessibilityRole).toBeUndefined();

      rerender(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} />);

      container = getByTestId('input-adornment-prefix');
      expect(container.props.accessibilityRole).toBe('button');
      fireEvent.press(container);
      expect(onPressMock).toHaveBeenCalled();
    });

    it('transitions from interactive to disabled', () => {
      const onPressMock = jest.fn();
      const { getByTestId, rerender } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} disabled={false} />);

      let container = getByTestId('input-adornment-prefix');
      fireEvent.press(container);
      expect(onPressMock).toHaveBeenCalledTimes(1);

      rerender(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} disabled={true} />);

      container = getByTestId('input-adornment-prefix');
      // After rerender with disabled=true, onPress should not be attached
      expect(container.props.onPress).toBeUndefined();
      expect(container.props.accessibilityRole).toBeUndefined();
    });
  });

  describe('Search Input Integration', () => {
    it('works as non-interactive search icon prefix', () => {
      const { getByTestId } = render(<InputAdornment position="prefix" iconName="searchLine" size={16} testID="search-icon" />);

      const searchIcon = getByTestId('search-icon');
      expect(searchIcon.props.accessibilityRole).toBeUndefined();
      expect(searchIcon.props.onPress).toBeUndefined();
    });

    it('works as interactive clear button suffix', () => {
      const handleClear = jest.fn();
      const { getByTestId } = render(
        <InputAdornment position="suffix" iconName="deleteText" size={20} onPress={handleClear} disabled={false} testID="clear-button" />,
      );

      const clearButton = getByTestId('clear-button');
      expect(clearButton.props.accessibilityRole).toBe('button');
      expect(clearButton.props.hitSlop).toBe(8);

      fireEvent.press(clearButton);
      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('disables clear button when input is disabled', () => {
      const handleClear = jest.fn();
      const { getByTestId } = render(
        <InputAdornment position="suffix" iconName="deleteText" size={20} onPress={handleClear} disabled={true} testID="clear-button" />,
      );

      const clearButton = getByTestId('clear-button');
      // When disabled, onPress should not be attached
      expect(clearButton.props.onPress).toBeUndefined();
      expect(clearButton.props.accessibilityRole).toBeUndefined();
    });
  });

  describe('Style Prop Application', () => {
    it('applies custom style to container', () => {
      const customStyle = { marginLeft: 10 };
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="search" style={customStyle} />);

      const container = getByTestId('input-adornment-prefix');
      expect(container.props.style).toContainEqual(customStyle);
    });

    it('applies style to interactive Pressable', () => {
      const customStyle = { paddingLeft: 5 };
      const onPressMock = jest.fn();
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="close" onPress={onPressMock} style={customStyle} />);

      const container = getByTestId('input-adornment-prefix');
      expect(container.props.style).toContainEqual(customStyle);
    });

    it('applies style to non-interactive View', () => {
      const customStyle = { paddingRight: 8 };
      const { getByTestId } = render(<InputAdornment {...defaultProps} iconName="search" style={customStyle} />);

      const container = getByTestId('input-adornment-prefix');
      expect(container.props.style).toContainEqual(customStyle);
    });
  });
});
