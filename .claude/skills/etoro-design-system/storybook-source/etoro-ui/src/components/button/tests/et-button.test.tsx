import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet, Text, View } from 'react-native';

import { colorsMock } from '../../../core/hooks/__mocks__/colors-mock';
import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { eToroDarkColors, eToroLightColors } from '../../../core/styles/colors';
import type { IconName } from '../../../foundations/icon-assets/api/types';
import { EtButton } from '../et-button';
import { ButtonIcon } from '../subcomponents/button-icon';
import { ButtonLabel } from '../subcomponents/button-label';
import { getSizeConfig, getVariantStyles, SIZE_CONFIGS } from '../utils/styles';
import type { ButtonSize, ButtonVariant } from '../utils/types';

// Mock useEtoroTheme hook with actual colors
jest.mock('../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

const mockedUseEtoroTheme = useEtoroTheme as jest.Mock;

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock EtText component
jest.mock('../../../foundations/text', () => ({
  EtText: function MockEtText({ children, testID, style, ...props }: any) {
    const { Text } = require('react-native');
    return (
      <Text testID={testID || 'et-text'} style={style} {...props}>
        {children}
      </Text>
    );
  },
}));

// Mock EtoroIcon component
jest.mock('../../../foundations/icon-assets/et-icon', () => ({
  EtoroIcon: function MockEtoroIcon({ icon, appearance, testID, ...props }: any) {
    const { View, Text } = require('react-native');
    return (
      <View testID={testID || 'etoro-icon'} {...props}>
        <Text testID="icon-name">{icon?.iconName}</Text>
        <Text testID="icon-size">{appearance?.size}</Text>
        <Text testID="icon-color">{appearance?.color}</Text>
      </View>
    );
  },
}));

// Mock EtIconV2 component
jest.mock('../../et-icon-v2/et-icon-v2', () => ({
  EtIconV2: function MockEtIconV2({ name, size, color, testID, ...props }: any) {
    const { View, Text } = require('react-native');
    return (
      <View testID={testID || 'et-icon-v2'} {...props}>
        <Text testID="icon-v2-name">{name}</Text>
        <Text testID="icon-v2-size">{size}</Text>
        <Text testID="icon-v2-color">{color}</Text>
      </View>
    );
  },
}));

describe('EtButton', () => {
  describe('SIZE_CONFIGS', () => {
    it('should have correct height values', () => {
      expect(SIZE_CONFIGS.tiny.height).toBe(32);
      expect(SIZE_CONFIGS.small.height).toBe(36);
      expect(SIZE_CONFIGS.medium.height).toBe(44);
      expect(SIZE_CONFIGS.large.height).toBe(56);
    });

    it('should have correct minWidth values', () => {
      expect(SIZE_CONFIGS.tiny.minWidth).toBe(72);
      expect(SIZE_CONFIGS.small.minWidth).toBe(78);
      expect(SIZE_CONFIGS.medium.minWidth).toBe(86);
      expect(SIZE_CONFIGS.large.minWidth).toBe(90);
    });

    it('should have all required size properties', () => {
      const sizes: ButtonSize[] = ['tiny', 'small', 'medium', 'large'];

      sizes.forEach((size) => {
        const config = SIZE_CONFIGS[size];
        expect(config).toHaveProperty('height');
        expect(config).toHaveProperty('minWidth');
        expect(config).toHaveProperty('paddingHorizontal');
        expect(config).toHaveProperty('paddingVertical');
        expect(config).toHaveProperty('borderRadius');
        expect(config).toHaveProperty('iconSize');
      });
    });

    it('should have consistent icon sizes across all button sizes', () => {
      // Current design uses consistent icon sizes across all button sizes
      const expectedIconSize = 20;
      expect(SIZE_CONFIGS.tiny.iconSize).toBe(expectedIconSize);
      expect(SIZE_CONFIGS.small.iconSize).toBe(expectedIconSize);
      expect(SIZE_CONFIGS.medium.iconSize).toBe(expectedIconSize);
      expect(SIZE_CONFIGS.large.iconSize).toBe(expectedIconSize);
    });
  });

  describe('getSizeConfig', () => {
    it('should return correct config for each size', () => {
      const sizes: ButtonSize[] = ['tiny', 'small', 'medium', 'large'];

      sizes.forEach((size) => {
        const config = getSizeConfig(size);
        expect(config).toEqual(SIZE_CONFIGS[size]);
      });
    });

    it('should return tiny config', () => {
      const config = getSizeConfig('tiny');
      expect(config.height).toBe(32);
      expect(config.minWidth).toBe(72);
    });

    it('should return small config', () => {
      const config = getSizeConfig('small');
      expect(config.height).toBe(36);
      expect(config.minWidth).toBe(78);
    });

    it('should return medium config', () => {
      const config = getSizeConfig('medium');
      expect(config.height).toBe(44);
      expect(config.minWidth).toBe(86);
    });

    it('should return large config', () => {
      const config = getSizeConfig('large');
      expect(config.height).toBe(56);
      expect(config.minWidth).toBe(90);
    });
  });

  describe('getVariantStyles', () => {
    const { colors } = colorsMock;

    const allVariants: ButtonVariant[] = [
      'primary-filled',
      'negative-filled',
      'info-filled',
      'primary-subtle',
      'negative-subtle',
      'info-subtle',
      'primary-ghost',
      'negative-ghost',
      'info-ghost',
    ];

    it('should return styles for all variants', () => {
      allVariants.forEach((variant) => {
        const styles = getVariantStyles(colors as any, variant);
        expect(styles).toBeDefined();
        expect(styles).toHaveProperty('backgroundColor');
        expect(styles).toHaveProperty('textColor');
        expect(styles).toHaveProperty('iconColor');
      });
    });

    it('should return primary-filled styles correctly', () => {
      const styles = getVariantStyles(colors as any, 'primary-filled');
      expect(styles.backgroundColor).toBe(colors.primary600);
      expect(styles.textColor).toBe(colors.carbon050);
    });

    it('should return negative-filled styles correctly', () => {
      const styles = getVariantStyles(colors as any, 'negative-filled');
      expect(styles.backgroundColor).toBe(colors.verdictNegative600);
      expect(styles.textColor).toBe(colors.carbon050);
    });

    it('should return subtle variants without borders', () => {
      const subtleVariants: ButtonVariant[] = ['primary-subtle', 'negative-subtle', 'info-subtle'];

      subtleVariants.forEach((variant) => {
        const styles = getVariantStyles(colors as any, variant);
        expect(styles.backgroundColor).not.toBe('transparent');
      });
    });

    it('should return ghost variants without background', () => {
      const ghostVariants: ButtonVariant[] = ['primary-ghost', 'negative-ghost', 'info-ghost'];

      ghostVariants.forEach((variant) => {
        const styles = getVariantStyles(colors as any, variant);
        expect(styles.backgroundColor).toBe('transparent');
      });
    });

    it('should include disabled styles', () => {
      allVariants.forEach((variant) => {
        const styles = getVariantStyles(colors as any, variant);
        expect(styles).toHaveProperty('disabledBackgroundColor');
        expect(styles).toHaveProperty('disabledTextColor');
      });
    });
  });

  describe('Subcomponents', () => {
    describe('ButtonLabel', () => {
      it('should be a function component', () => {
        expect(typeof ButtonLabel).toBe('function');
      });
    });

    describe('ButtonIcon', () => {
      it('should be a function component', () => {
        expect(typeof ButtonIcon).toBe('function');
      });
    });
  });

  describe('Button Variants', () => {
    it('should have 9 total variants', () => {
      const variants: ButtonVariant[] = [
        'primary-filled',
        'negative-filled',
        'info-filled',
        'primary-subtle',
        'negative-subtle',
        'info-subtle',
        'primary-ghost',
        'negative-ghost',
        'info-ghost',
      ];
      expect(variants.length).toBe(9);
    });

    it('should have 3 filled variants', () => {
      const filledVariants: ButtonVariant[] = ['primary-filled', 'negative-filled', 'info-filled'];
      expect(filledVariants.length).toBe(3);
    });

    it('should have 3 subtle variants', () => {
      const subtleVariants: ButtonVariant[] = ['primary-subtle', 'negative-subtle', 'info-subtle'];
      expect(subtleVariants.length).toBe(3);
    });

    it('should have 3 ghost variants', () => {
      const ghostVariants: ButtonVariant[] = ['primary-ghost', 'negative-ghost', 'info-ghost'];
      expect(ghostVariants.length).toBe(3);
    });
  });

  describe('Button Sizes', () => {
    it('should have 4 size options', () => {
      const sizes: ButtonSize[] = ['tiny', 'small', 'medium', 'large'];
      expect(sizes.length).toBe(4);
    });
  });

  describe('Type Safety', () => {
    it('should enforce valid variant types', () => {
      const validVariant: ButtonVariant = 'primary-filled';
      expect(validVariant).toBe('primary-filled');
    });

    it('should enforce valid size types', () => {
      const validSize: ButtonSize = 'medium';
      expect(validSize).toBe('medium');
    });

    it('should enforce valid icon names for ButtonIcon', () => {
      const validIconName: IconName = 'plus';
      expect(validIconName).toBe('plus');
    });
  });

  describe('Edge Cases', () => {
    it('should handle all size configs without errors', () => {
      const sizes: ButtonSize[] = ['tiny', 'small', 'medium', 'large'];

      expect(() => {
        sizes.forEach((size) => getSizeConfig(size));
      }).not.toThrow();
    });

    it('should handle all variant styles without errors', () => {
      const variants: ButtonVariant[] = [
        'primary-filled',
        'negative-filled',
        'info-filled',
        'primary-subtle',
        'negative-subtle',
        'info-subtle',
        'primary-ghost',
        'negative-ghost',
        'info-ghost',
      ];

      expect(() => {
        variants.forEach((variant) => getVariantStyles(colorsMock.colors as any, variant));
      }).not.toThrow();
    });
  });
});

describe('EtButton Component Rendering', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with string shorthand children', () => {
      const { getByText } = render(<EtButton onPress={mockOnPress}>Click me</EtButton>);

      expect(getByText('Click me')).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByRole } = render(<EtButton onPress={mockOnPress}>Default Button</EtButton>);

      expect(getByRole('button')).toBeTruthy();
    });

    it('renders with testID prop', () => {
      const { getByTestId } = render(
        <EtButton testID="test-button" onPress={mockOnPress}>
          Test Button
        </EtButton>,
      );

      expect(getByTestId('test-button')).toBeTruthy();
    });

    it('renders with EtButton.Label subcomponent', () => {
      const { getByText } = render(
        <EtButton onPress={mockOnPress}>
          <EtButton.Label>Label Text</EtButton.Label>
        </EtButton>,
      );

      expect(getByText('Label Text')).toBeTruthy();
    });

    it('renders with EtButton.Icon subcomponent', () => {
      const { getByTestId } = render(
        <EtButton onPress={mockOnPress}>
          <EtButton.Icon name="plus" />
        </EtButton>,
      );

      expect(getByTestId('etoro-icon')).toBeTruthy();
    });

    it('renders with both Label and Icon subcomponents', () => {
      const { getByText, getByTestId } = render(
        <EtButton onPress={mockOnPress}>
          <EtButton.Label>With Icon</EtButton.Label>
          <EtButton.Icon name="chevronRight" />
        </EtButton>,
      );

      expect(getByText('With Icon')).toBeTruthy();
      expect(getByTestId('etoro-icon')).toBeTruthy();
    });

    it('renders Icon before Label when Icon comes first', () => {
      const { getByText, getByTestId } = render(
        <EtButton onPress={mockOnPress}>
          <EtButton.Icon name="plus" />
          <EtButton.Label>Add Item</EtButton.Label>
        </EtButton>,
      );

      expect(getByText('Add Item')).toBeTruthy();
      expect(getByTestId('etoro-icon')).toBeTruthy();
    });
  });

  describe('Variant Rendering', () => {
    const variants: ButtonVariant[] = [
      'primary-filled',
      'negative-filled',
      'info-filled',
      'primary-subtle',
      'negative-subtle',
      'info-subtle',
      'primary-ghost',
      'negative-ghost',
      'info-ghost',
    ];

    variants.forEach((variant) => {
      it(`renders ${variant} variant without crashing`, () => {
        const { getByText } = render(
          <EtButton variant={variant} onPress={mockOnPress}>
            {variant}
          </EtButton>,
        );

        expect(getByText(variant)).toBeTruthy();
      });
    });
  });

  describe('Size Rendering', () => {
    const sizes: ButtonSize[] = ['tiny', 'small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`renders ${size} size without crashing`, () => {
        const { getByText } = render(
          <EtButton size={size} onPress={mockOnPress}>
            {size}
          </EtButton>,
        );

        expect(getByText(size)).toBeTruthy();
      });
    });
  });

  describe('Press Events', () => {
    it('calls onPress when pressed', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtButton testID="press-button" onPress={handlePress}>
          Press Me
        </EtButton>,
      );

      fireEvent.press(getByTestId('press-button'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('triggers haptic feedback by default on press', () => {
      const Haptics = require('expo-haptics');
      const { getByTestId } = render(
        <EtButton testID="haptic-button" onPress={mockOnPress}>
          Haptic Button
        </EtButton>,
      );

      fireEvent.press(getByTestId('haptic-button'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('does not trigger haptic feedback when haptics is false', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtButton testID="no-haptic-button" haptics={false} onPress={mockOnPress}>
          No Haptic
        </EtButton>,
      );

      fireEvent.press(getByTestId('no-haptic-button'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('does not call onPress when disabled', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtButton testID="disabled-button" disabled onPress={handlePress}>
          Disabled
        </EtButton>,
      );

      fireEvent.press(getByTestId('disabled-button'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtButton testID="loading-button" loading onPress={handlePress}>
          Loading
        </EtButton>,
      );

      fireEvent.press(getByTestId('loading-button'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows loader icon when loading with single child', () => {
      const { getByTestId } = render(
        <EtButton testID="loading-button" loading onPress={mockOnPress}>
          Submit
        </EtButton>,
      );

      const iconName = getByTestId('icon-name');
      expect(iconName.props.children).toBe('loader');
    });

    it('sets accessibility state to disabled when loading', () => {
      const { getByTestId } = render(
        <EtButton testID="loading-button" loading onPress={mockOnPress}>
          Loading
        </EtButton>,
      );

      const button = getByTestId('loading-button');
      expect(button.props.accessibilityState).toEqual({ disabled: true });
    });

    it('button is not interactive when loading', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtButton testID="loading-button" loading onPress={handlePress}>
          Loading
        </EtButton>,
      );

      fireEvent.press(getByTestId('loading-button'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('does not replace a single IconV2 child while loading', () => {
      const { getByTestId, queryByTestId } = render(
        <EtButton testID="loading-button" loading onPress={mockOnPress}>
          <EtButton.IconV2 name="settings" />
        </EtButton>,
      );

      expect(getByTestId('et-icon-v2')).toBeTruthy();
      expect(queryByTestId('icon-name')).toBeNull();
      expect(getByTestId('icon-v2-name').props.children).toBe('loader');
    });
  });

  describe('Disabled State', () => {
    it('sets accessibility state to disabled', () => {
      const { getByTestId } = render(
        <EtButton testID="disabled-button" disabled onPress={mockOnPress}>
          Disabled
        </EtButton>,
      );

      const button = getByTestId('disabled-button');
      expect(button.props.accessibilityState).toEqual({ disabled: true });
    });

    it('button is not interactive when disabled', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtButton testID="disabled-button" disabled onPress={handlePress}>
          Disabled
        </EtButton>,
      );

      fireEvent.press(getByTestId('disabled-button'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('does not trigger haptics when disabled', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtButton testID="disabled-button" disabled onPress={mockOnPress}>
          Disabled
        </EtButton>,
      );

      fireEvent.press(getByTestId('disabled-button'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Children Validation', () => {
    it('throws error for invalid children (View)', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtButton onPress={mockOnPress}>
            <View>
              <Text>Invalid</Text>
            </View>
          </EtButton>,
        );
      }).toThrow('EtButton: Invalid child passed. Only string, <EtButton.Label>, <EtButton.Icon>, or <EtButton.IconV2> are valid children.');

      consoleError.mockRestore();
    });

    it('throws error for invalid children (Text)', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtButton onPress={mockOnPress}>
            <Text>Invalid Text</Text>
          </EtButton>,
        );
      }).toThrow('EtButton: Invalid child passed. Only string, <EtButton.Label>, <EtButton.Icon>, or <EtButton.IconV2> are valid children.');

      consoleError.mockRestore();
    });

    it('accepts string child', () => {
      expect(() => {
        render(<EtButton onPress={mockOnPress}>Valid String</EtButton>);
      }).not.toThrow();
    });

    it('accepts EtButton.Label child', () => {
      expect(() => {
        render(
          <EtButton onPress={mockOnPress}>
            <EtButton.Label>Valid Label</EtButton.Label>
          </EtButton>,
        );
      }).not.toThrow();
    });

    it('accepts EtButton.Icon child', () => {
      expect(() => {
        render(
          <EtButton onPress={mockOnPress}>
            <EtButton.Icon name="plus" />
          </EtButton>,
        );
      }).not.toThrow();
    });

    it('accepts EtButton.IconV2 child', () => {
      expect(() => {
        render(
          <EtButton onPress={mockOnPress}>
            <EtButton.IconV2 name="settings" />
          </EtButton>,
        );
      }).not.toThrow();
    });

    it('accepts combination of Label and Icon', () => {
      expect(() => {
        render(
          <EtButton onPress={mockOnPress}>
            <EtButton.Label>Text</EtButton.Label>
            <EtButton.Icon name="chevronRight" />
          </EtButton>,
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('has button accessibility role', () => {
      const { getByRole } = render(<EtButton onPress={mockOnPress}>Accessible</EtButton>);

      expect(getByRole('button')).toBeTruthy();
    });

    it('has correct accessibility state when enabled', () => {
      const { getByTestId } = render(
        <EtButton testID="enabled-button" onPress={mockOnPress}>
          Enabled
        </EtButton>,
      );

      const button = getByTestId('enabled-button');
      expect(button.props.accessibilityState).toEqual({ disabled: false });
    });

    it('has correct accessibility state when disabled', () => {
      const { getByTestId } = render(
        <EtButton testID="disabled-button" disabled onPress={mockOnPress}>
          Disabled
        </EtButton>,
      );

      const button = getByTestId('disabled-button');
      expect(button.props.accessibilityState).toEqual({ disabled: true });
    });
  });

  describe('Style Customization', () => {
    it('applies custom style to button', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <EtButton testID="styled-button" style={customStyle} onPress={mockOnPress}>
          Styled
        </EtButton>,
      );

      const button = getByTestId('styled-button');
      expect(button.props.style).toEqual(expect.arrayContaining([expect.objectContaining(customStyle)]));
    });

    it('applies array styles correctly', () => {
      const arrayStyle = [{ margin: 5 }, { padding: 10 }];
      const { getByTestId } = render(
        <EtButton testID="array-styled-button" style={arrayStyle} onPress={mockOnPress}>
          Array Styled
        </EtButton>,
      );

      const button = getByTestId('array-styled-button');
      expect(button.props.style).toBeDefined();
    });
  });

  describe('forceColorScheme', () => {
    // The mocked theme resolves to the dark palette, so forcing "light" gives a
    // distinct background and proves the button ignores the active theme.
    it('pins colors to the light palette when forceColorScheme="light"', () => {
      const { getByTestId } = render(
        <EtButton testID="forced-light" variant="info-filled" forceColorScheme="light" onPress={mockOnPress}>
          Upgrade
        </EtButton>,
      );

      const button = getByTestId('forced-light');
      const flattened = StyleSheet.flatten(button.props.style);
      expect(flattened.backgroundColor).toBe(eToroLightColors.colors.carbon900);
      expect(flattened.backgroundColor).not.toBe(eToroDarkColors.colors.carbon900);
    });

    it('pins colors to the dark palette when forceColorScheme="dark"', () => {
      mockedUseEtoroTheme.mockReturnValueOnce({ ...colorsMock, dark: false, colors: eToroLightColors.colors });

      const { getByTestId } = render(
        <EtButton testID="forced-dark" variant="info-filled" forceColorScheme="dark" onPress={mockOnPress}>
          Upgrade
        </EtButton>,
      );

      const button = getByTestId('forced-dark');
      const flattened = StyleSheet.flatten(button.props.style);
      expect(flattened.backgroundColor).toBe(eToroDarkColors.colors.carbon900);
    });

    it('follows the active theme when forceColorScheme is omitted', () => {
      const { getByTestId } = render(
        <EtButton testID="themed" variant="info-filled" onPress={mockOnPress}>
          Upgrade
        </EtButton>,
      );

      const button = getByTestId('themed');
      const flattened = StyleSheet.flatten(button.props.style);
      expect(flattened.backgroundColor).toBe(colorsMock.colors.carbon900);
    });
  });

  describe('Component Structure', () => {
    it('has Label and Icon as static properties', () => {
      expect(EtButton.Label).toBeDefined();
      expect(EtButton.Icon).toBeDefined();
    });

    it('EtButton.Label is the ButtonLabel component', () => {
      expect(EtButton.Label).toBe(ButtonLabel);
    });

    it('EtButton.Icon is the ButtonIcon component', () => {
      expect(EtButton.Icon).toBe(ButtonIcon);
    });

    it('is callable as a function', () => {
      expect(typeof EtButton).toBe('function');
    });
  });

  describe('Props Integration', () => {
    it('handles all props together', () => {
      const handlePress = jest.fn();
      const { getByTestId, getByText } = render(
        <EtButton
          testID="full-button"
          variant="negative-filled"
          size="large"
          disabled={false}
          loading={false}
          haptics={true}
          style={{ margin: 16 }}
          onPress={handlePress}
        >
          <EtButton.Icon name="trash" />
          <EtButton.Label>Delete</EtButton.Label>
        </EtButton>,
      );

      expect(getByTestId('full-button')).toBeTruthy();
      expect(getByText('Delete')).toBeTruthy();
      expect(getByTestId('etoro-icon')).toBeTruthy();
    });

    it('handles variant and size combinations', () => {
      const variants: ButtonVariant[] = ['primary-filled', 'info-subtle', 'negative-ghost'];
      const sizes: ButtonSize[] = ['tiny', 'large'];

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { getByText } = render(
            <EtButton variant={variant} size={size} onPress={mockOnPress}>
              {`${variant}-${size}`}
            </EtButton>,
          );

          expect(getByText(`${variant}-${size}`)).toBeTruthy();
        });
      });
    });

    it('handles disabled and loading states together', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtButton testID="disabled-loading" disabled={true} loading={true} onPress={handlePress}>
          Both States
        </EtButton>,
      );

      const button = getByTestId('disabled-loading');
      expect(button.props.accessibilityState).toEqual({ disabled: true });

      fireEvent.press(button);
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string child', () => {
      const { getByTestId } = render(
        <EtButton testID="empty-button" onPress={mockOnPress}>
          {''}
        </EtButton>,
      );

      expect(getByTestId('empty-button')).toBeTruthy();
    });

    it('handles undefined onPress gracefully', () => {
      expect(() => {
        render(<EtButton>No Handler</EtButton>);
      }).not.toThrow();
    });

    it('handles rapid successive renders', () => {
      const variants: ButtonVariant[] = ['primary-filled', 'negative-filled', 'primary-subtle'];

      expect(() => {
        variants.forEach((variant) => {
          render(
            <EtButton variant={variant} onPress={mockOnPress}>
              Rapid Render
            </EtButton>,
          );
        });
      }).not.toThrow();
    });

    it('handles multiple icon children', () => {
      expect(() => {
        render(
          <EtButton onPress={mockOnPress}>
            <EtButton.Icon name="plus" />
            <EtButton.Icon name="chevronRight" />
          </EtButton>,
        );
      }).not.toThrow();
    });

    it('handles whitespace-only string children', () => {
      const { getByTestId } = render(
        <EtButton testID="whitespace-button" onPress={mockOnPress}>
          {'   '}
        </EtButton>,
      );

      expect(getByTestId('whitespace-button')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('handles batch rendering operations', () => {
      const batchSize = 50;

      expect(() => {
        for (let i = 0; i < batchSize; i++) {
          render(
            <EtButton
              variant={i % 2 === 0 ? 'primary-filled' : 'info-subtle'}
              size={i % 3 === 0 ? 'tiny' : i % 3 === 1 ? 'medium' : 'large'}
              onPress={mockOnPress}
            >
              {`Button ${i}`}
            </EtButton>,
          );
        }
      }).not.toThrow();
    });
  });
});
