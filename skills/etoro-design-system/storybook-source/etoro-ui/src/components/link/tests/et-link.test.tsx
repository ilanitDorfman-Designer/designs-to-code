import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { colorsMock } from '../../../core/hooks/__mocks__/colors-mock';
import { X3, X4 } from '../../../core/styles/spacing';
import type { LinkSize, LinkVariant } from '../api/types';
import { EtLink } from '../et-link';
import { LinkIcon } from '../subcomponents/link-icon';
import { LinkLabel } from '../subcomponents/link-label';
import { getVariantStyles, ICON_SIZES } from '../utils/styles';

// Mock useEtoroTheme hook with actual colors
jest.mock('../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock react-native-reanimated (match loader/expandable-card pattern so Animated.View resolves)
jest.mock('react-native-reanimated', () => {
  const { View, Animated: RNAnimated } = require('react-native');
  return {
    __esModule: true,
    default: {
      ...RNAnimated,
      View,
    },
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((toValue) => toValue),
    createAnimatedComponent: (Component: unknown) => Component,
  };
});

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

describe('EtLink', () => {
  describe('ICON_SIZES', () => {
    it('should have correct icon size values', () => {
      expect(ICON_SIZES.small).toBe(16);
      expect(ICON_SIZES.medium).toBe(20);
      expect(ICON_SIZES.large).toBe(24);
    });

    it('should have all required size properties', () => {
      const sizes: LinkSize[] = ['small', 'medium', 'large'];

      sizes.forEach((size) => {
        expect(ICON_SIZES[size]).toBeDefined();
        expect(typeof ICON_SIZES[size]).toBe('number');
      });
    });
  });

  describe('getVariantStyles', () => {
    const { colors } = colorsMock;

    const allVariants: LinkVariant[] = ['primary', 'info', 'negative'];

    it('should return styles for all variants', () => {
      allVariants.forEach((variant) => {
        const styles = getVariantStyles(colors as any, variant);
        expect(styles).toBeDefined();
        expect(styles).toHaveProperty('textColor');
        expect(styles).toHaveProperty('iconColor');
        expect(styles).toHaveProperty('pressedTextColor');
        expect(styles).toHaveProperty('pressedIconColor');
        expect(styles).toHaveProperty('disabledTextColor');
      });
    });

    it('should return primary styles correctly', () => {
      const styles = getVariantStyles(colors as any, 'primary');
      expect(styles.textColor).toBe(colors.primary600);
      expect(styles.iconColor).toBe(colors.primary600);
      expect(styles.pressedTextColor).toBe(colors.primary500);
    });

    it('should return negative styles correctly', () => {
      const styles = getVariantStyles(colors as any, 'negative');
      expect(styles.textColor).toBe(colors.verdictNegative600);
      expect(styles.iconColor).toBe(colors.verdictNegative600);
      expect(styles.pressedTextColor).toBe(colors.verdictNegative500);
    });

    it('should return info styles correctly', () => {
      const styles = getVariantStyles(colors as any, 'info');
      expect(styles.textColor).toBe(colors.carbon900);
      expect(styles.iconColor).toBe(colors.carbon900);
      expect(styles.pressedTextColor).toBe(colors.carbon800);
    });

    it('should include disabled styles for all variants', () => {
      allVariants.forEach((variant) => {
        const styles = getVariantStyles(colors as any, variant);
        expect(styles).toHaveProperty('disabledTextColor');
        expect(styles.disabledTextColor).toBe(colors.carbon300);
      });
    });
  });

  describe('Subcomponents', () => {
    describe('LinkLabel', () => {
      it('should be a valid React component (memo-wrapped)', () => {
        // React.memo returns an object with $$typeof symbol, not a function
        expect(LinkLabel).toBeDefined();
        expect(typeof LinkLabel).toBe('object');
        expect((LinkLabel as any).$$typeof).toBeDefined();
      });

      it('should have correct displayName', () => {
        expect(LinkLabel.displayName).toBe('EtLink.Label');
      });
    });

    describe('LinkIcon', () => {
      it('should be a valid React component (memo-wrapped)', () => {
        // React.memo returns an object with $$typeof symbol, not a function
        expect(LinkIcon).toBeDefined();
        expect(typeof LinkIcon).toBe('object');
        expect((LinkIcon as any).$$typeof).toBeDefined();
      });

      it('should have correct displayName', () => {
        expect(LinkIcon.displayName).toBe('EtLink.Icon');
      });
    });
  });

  describe('Link Variants', () => {
    const variants: LinkVariant[] = ['primary', 'info', 'negative'];
    const mockOnPress = jest.fn();

    variants.forEach((variant) => {
      it(`renders ${variant} variant with expected text color`, () => {
        const { getByRole, getByTestId } = render(
          <EtLink variant={variant} onPress={mockOnPress}>
            {variant}
          </EtLink>,
        );

        expect(getByRole('link')).toBeTruthy();
        const label = getByTestId('et-text');
        expect(label).toBeTruthy();
        const style = label.props.style;
        const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : (style ?? {});
        const expectedColor = getVariantStyles(colorsMock.colors as Parameters<typeof getVariantStyles>[0], variant).textColor;
        expect(flatStyle).toMatchObject({ color: expectedColor });
      });
    });
  });

  describe('Link Sizes', () => {
    const sizes: LinkSize[] = ['small', 'medium', 'large'];
    const mockOnPress = jest.fn();

    sizes.forEach((size) => {
      it(`renders ${size} size and passes icon size to EtoroIcon`, () => {
        const { getByRole, getByTestId } = render(
          <EtLink size={size} onPress={mockOnPress}>
            <EtLink.Label>Label</EtLink.Label>
            <EtLink.Icon name="chevronRight" />
          </EtLink>,
        );

        expect(getByRole('link')).toBeTruthy();
        const iconSizeNode = getByTestId('icon-size');
        expect(iconSizeNode).toBeTruthy();
        const renderedSize = typeof iconSizeNode.props.children === 'number' ? iconSizeNode.props.children : Number(iconSizeNode.props.children);
        expect(renderedSize).toBe(ICON_SIZES[size]);
      });
    });
  });

  describe('Link Icon Positions', () => {
    const mockOnPress = jest.fn();

    it('renders leading icon position (icon before label) with both visible', () => {
      const { getByRole, getByTestId, getByText } = render(
        <EtLink onPress={mockOnPress}>
          <EtLink.Icon name="share" />
          <EtLink.Label>Share</EtLink.Label>
        </EtLink>,
      );

      const link = getByRole('link');
      expect(link).toBeTruthy();
      expect(getByTestId('etoro-icon')).toBeTruthy();
      expect(getByText('Share')).toBeTruthy();
    });

    it('renders trailing icon position (label before icon) with both visible', () => {
      const { getByRole, getByTestId, getByText } = render(
        <EtLink onPress={mockOnPress}>
          <EtLink.Label>View details</EtLink.Label>
          <EtLink.Icon name="chevronRight" />
        </EtLink>,
      );

      const link = getByRole('link');
      expect(link).toBeTruthy();
      expect(getByTestId('etoro-icon')).toBeTruthy();
      expect(getByText('View details')).toBeTruthy();
    });
  });

  describe('LinkIcon runtime behavior', () => {
    const mockOnPress = jest.fn();

    it('renders icon with given icon name in DOM', () => {
      const { getByTestId } = render(
        <EtLink onPress={mockOnPress}>
          <EtLink.Label>Open</EtLink.Label>
          <EtLink.Icon name="chevronRight" />
        </EtLink>,
      );

      const iconNameNode = getByTestId('icon-name');
      expect(iconNameNode).toBeTruthy();
      expect(iconNameNode.props.children).toBe('chevronRight');
    });
  });

  describe('Edge Cases', () => {
    it('should handle all variant styles without errors', () => {
      const variants: LinkVariant[] = ['primary', 'info', 'negative'];

      expect(() => {
        variants.forEach((variant) => {
          getVariantStyles(colorsMock.colors as any, variant);
        });
      }).not.toThrow();
    });
  });
});

describe('EtLink Component Rendering', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with string shorthand children', () => {
      const { getByText } = render(<EtLink onPress={mockOnPress}>Learn more</EtLink>);

      expect(getByText('Learn more')).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByRole } = render(<EtLink onPress={mockOnPress}>Default Link</EtLink>);

      expect(getByRole('link')).toBeTruthy();
    });

    it('renders with testID prop', () => {
      const { getByTestId } = render(
        <EtLink testID="test-link" onPress={mockOnPress}>
          Test Link
        </EtLink>,
      );

      expect(getByTestId('test-link')).toBeTruthy();
    });

    it('renders with EtLink.Label subcomponent', () => {
      const { getByText } = render(
        <EtLink onPress={mockOnPress}>
          <EtLink.Label>Label Text</EtLink.Label>
        </EtLink>,
      );

      expect(getByText('Label Text')).toBeTruthy();
    });

    it('renders with EtLink.Icon subcomponent', () => {
      const { getByTestId } = render(
        <EtLink onPress={mockOnPress}>
          <EtLink.Label>With Icon</EtLink.Label>
          <EtLink.Icon name="chevronRight" />
        </EtLink>,
      );

      expect(getByTestId('etoro-icon')).toBeTruthy();
    });

    it('renders with both Label and Icon subcomponents (trailing)', () => {
      const { getByText, getByTestId } = render(
        <EtLink onPress={mockOnPress}>
          <EtLink.Label>View details</EtLink.Label>
          <EtLink.Icon name="chevronRight" />
        </EtLink>,
      );

      expect(getByText('View details')).toBeTruthy();
      expect(getByTestId('etoro-icon')).toBeTruthy();
    });

    it('renders Icon before Label when Icon comes first (leading)', () => {
      const { getByText, getByTestId } = render(
        <EtLink onPress={mockOnPress}>
          <EtLink.Icon name="share" />
          <EtLink.Label>Share</EtLink.Label>
        </EtLink>,
      );

      expect(getByText('Share')).toBeTruthy();
      expect(getByTestId('etoro-icon')).toBeTruthy();
    });
  });

  describe('Variant Rendering', () => {
    const variants: LinkVariant[] = ['primary', 'info', 'negative'];

    variants.forEach((variant) => {
      it(`renders ${variant} variant without crashing`, () => {
        const { getByText } = render(
          <EtLink variant={variant} onPress={mockOnPress}>
            {variant}
          </EtLink>,
        );

        expect(getByText(variant)).toBeTruthy();
      });
    });
  });

  describe('Size Rendering', () => {
    const sizes: LinkSize[] = ['small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`renders ${size} size without crashing`, () => {
        const { getByText } = render(
          <EtLink size={size} onPress={mockOnPress}>
            {size}
          </EtLink>,
        );

        expect(getByText(size)).toBeTruthy();
      });
    });
  });

  describe('Press Events', () => {
    it('calls onPress when pressed', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtLink testID="press-link" onPress={handlePress}>
          Press Me
        </EtLink>,
      );

      fireEvent.press(getByTestId('press-link'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('triggers haptic feedback by default on press', () => {
      const Haptics = require('expo-haptics');
      const { getByTestId } = render(
        <EtLink testID="haptic-link" onPress={mockOnPress}>
          Haptic Link
        </EtLink>,
      );

      fireEvent.press(getByTestId('haptic-link'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('does not trigger haptic feedback when haptics is false', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtLink testID="no-haptic-link" haptics={false} onPress={mockOnPress}>
          No Haptic
        </EtLink>,
      );

      fireEvent.press(getByTestId('no-haptic-link'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('does not call onPress when disabled', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtLink testID="disabled-link" disabled onPress={handlePress}>
          Disabled
        </EtLink>,
      );

      fireEvent.press(getByTestId('disabled-link'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('sets accessibility state to disabled', () => {
      const { getByTestId } = render(
        <EtLink testID="disabled-link" disabled onPress={mockOnPress}>
          Disabled
        </EtLink>,
      );

      const link = getByTestId('disabled-link');
      expect(link.props.accessibilityState).toEqual({
        disabled: true,
        busy: false,
      });
    });

    it('link is not interactive when disabled', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtLink testID="disabled-link" disabled onPress={handlePress}>
          Disabled
        </EtLink>,
      );

      fireEvent.press(getByTestId('disabled-link'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('does not trigger haptics when disabled', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtLink testID="disabled-link" disabled onPress={mockOnPress}>
          Disabled
        </EtLink>,
      );

      fireEvent.press(getByTestId('disabled-link'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('sets accessibility state to disabled and busy', () => {
      const { getByTestId } = render(
        <EtLink testID="loading-link" loading onPress={mockOnPress}>
          Loading
        </EtLink>,
      );

      const link = getByTestId('loading-link');
      expect(link.props.accessibilityState).toEqual({
        disabled: true,
        busy: true,
      });
    });

    it('does not call onPress when loading', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtLink testID="loading-link" loading onPress={handlePress}>
          Loading
        </EtLink>,
      );

      fireEvent.press(getByTestId('loading-link'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('renders the loader icon when loading', () => {
      const { getAllByTestId } = render(
        <EtLink testID="loading-link" loading onPress={mockOnPress}>
          Loading
        </EtLink>,
      );

      const icons = getAllByTestId('etoro-icon');
      expect(icons.length).toBeGreaterThanOrEqual(1);
    });

    it('Icon subcomponent does not render when loading', () => {
      const { getAllByTestId, getByText } = render(
        <EtLink testID="loading-link" loading onPress={mockOnPress}>
          <EtLink.Label>Save</EtLink.Label>
          <EtLink.Icon name="chevronRight" />
        </EtLink>,
      );

      const icons = getAllByTestId('etoro-icon');
      expect(icons).toHaveLength(1);
      expect(getByText('loader')).toBeTruthy();
    });
  });

  describe('Children Validation', () => {
    const invalidChildMessage = 'EtLink: Invalid child passed. Only string, <EtLink.Label>, or <EtLink.Icon> are valid children.';

    it('logs error for invalid children (View) and does not throw', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtLink onPress={mockOnPress}>
            <View>
              <Text>Invalid</Text>
            </View>
          </EtLink>,
        );
      }).not.toThrow();

      expect(consoleError).toHaveBeenCalledWith(invalidChildMessage);
      consoleError.mockRestore();
    });

    it('logs error for invalid children (Text) and does not throw', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtLink onPress={mockOnPress}>
            <Text>Invalid Text</Text>
          </EtLink>,
        );
      }).not.toThrow();

      expect(consoleError).toHaveBeenCalledWith(invalidChildMessage);
      consoleError.mockRestore();
    });

    it('accepts string child', () => {
      expect(() => {
        render(<EtLink onPress={mockOnPress}>Valid String</EtLink>);
      }).not.toThrow();
    });

    it('accepts EtLink.Label child', () => {
      expect(() => {
        render(
          <EtLink onPress={mockOnPress}>
            <EtLink.Label>Valid Label</EtLink.Label>
          </EtLink>,
        );
      }).not.toThrow();
    });

    it('accepts EtLink.Icon child with Label', () => {
      expect(() => {
        render(
          <EtLink onPress={mockOnPress}>
            <EtLink.Label>Label</EtLink.Label>
            <EtLink.Icon name="chevronRight" />
          </EtLink>,
        );
      }).not.toThrow();
    });

    it('accepts combination of Label and Icon', () => {
      expect(() => {
        render(
          <EtLink onPress={mockOnPress}>
            <EtLink.Icon name="share" />
            <EtLink.Label>Text</EtLink.Label>
          </EtLink>,
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('has link accessibility role', () => {
      const { getByRole } = render(<EtLink onPress={mockOnPress}>Accessible</EtLink>);

      expect(getByRole('link')).toBeTruthy();
    });

    it('has correct accessibility state when enabled', () => {
      const { getByTestId } = render(
        <EtLink testID="enabled-link" onPress={mockOnPress}>
          Enabled
        </EtLink>,
      );

      const link = getByTestId('enabled-link');
      expect(link.props.accessibilityState).toEqual({
        disabled: false,
        busy: false,
      });
    });

    it('has correct accessibility state when disabled', () => {
      const { getByTestId } = render(
        <EtLink testID="disabled-link" disabled onPress={mockOnPress}>
          Disabled
        </EtLink>,
      );

      const link = getByTestId('disabled-link');
      expect(link.props.accessibilityState).toEqual({
        disabled: true,
        busy: false,
      });
    });
  });

  describe('Style Customization', () => {
    it('applies custom style to link', () => {
      const customStyle = { margin: X3 };
      const { getByTestId } = render(
        <EtLink testID="styled-link" style={customStyle} onPress={mockOnPress}>
          Styled
        </EtLink>,
      );

      // Style is applied to the outer Animated.View (parent of the Pressable)
      const link = getByTestId('styled-link');
      expect(link).toBeTruthy();

      // Traverse up to find the Animated.View with our custom style
      // The structure is: Animated.View (with style) > Pressable (with testID)
      let currentNode = link.parent;
      let foundCustomStyle = false;

      // Search up to 3 levels for the custom style
      for (let i = 0; i < 3 && currentNode; i++) {
        const style = currentNode.props?.style;
        if (style) {
          const flatStyle = Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;
          if (flatStyle.margin === customStyle.margin) {
            foundCustomStyle = true;
            break;
          }
        }
        currentNode = currentNode.parent;
      }

      expect(foundCustomStyle).toBe(true);
    });
  });

  describe('Component Structure', () => {
    it('has Label and Icon as static properties', () => {
      expect(EtLink.Label).toBeDefined();
      expect(EtLink.Icon).toBeDefined();
    });

    it('EtLink.Label is the LinkLabel component', () => {
      expect(EtLink.Label).toBe(LinkLabel);
    });

    it('EtLink.Icon is the LinkIcon component', () => {
      expect(EtLink.Icon).toBe(LinkIcon);
    });

    it('is callable as a function', () => {
      expect(typeof EtLink).toBe('function');
    });
  });

  describe('Props Integration', () => {
    it('handles all props together', () => {
      const handlePress = jest.fn();
      const { getByTestId, getByText } = render(
        <EtLink testID="full-link" variant="negative" size="large" disabled={false} haptics={true} style={{ margin: X4 }} onPress={handlePress}>
          <EtLink.Icon name="trash" />
          <EtLink.Label>Delete</EtLink.Label>
        </EtLink>,
      );

      expect(getByTestId('full-link')).toBeTruthy();
      expect(getByText('Delete')).toBeTruthy();
      expect(getByTestId('etoro-icon')).toBeTruthy();
    });

    it('handles variant and size combinations', () => {
      const variants: LinkVariant[] = ['primary', 'info', 'negative'];
      const sizes: LinkSize[] = ['small', 'medium', 'large'];

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { getByText } = render(
            <EtLink variant={variant} size={size} onPress={mockOnPress}>
              {`${variant}-${size}`}
            </EtLink>,
          );

          expect(getByText(`${variant}-${size}`)).toBeTruthy();
        });
      });
    });
  });

  describe('Animation', () => {
    it('uses animation hook', () => {
      const reanimated = require('react-native-reanimated');

      render(
        <EtLink testID="animated-link" onPress={mockOnPress}>
          Animated
        </EtLink>,
      );

      expect(reanimated.useSharedValue).toHaveBeenCalled();
      expect(reanimated.useAnimatedStyle).toHaveBeenCalled();
    });

    it('does not trigger animation handlers when disabled', () => {
      const { getByTestId } = render(
        <EtLink testID="disabled-animated" disabled onPress={mockOnPress}>
          Disabled Animated
        </EtLink>,
      );

      const link = getByTestId('disabled-animated');
      // onPressIn should be undefined when disabled
      expect(link.props.onPressIn).toBeUndefined();
      expect(link.props.onPressOut).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string child', () => {
      const { getByTestId } = render(
        <EtLink testID="empty-link" onPress={mockOnPress}>
          {''}
        </EtLink>,
      );

      expect(getByTestId('empty-link')).toBeTruthy();
    });

    it('handles undefined onPress gracefully', () => {
      expect(() => {
        render(<EtLink>No Handler</EtLink>);
      }).not.toThrow();
    });

    it('handles rapid successive renders', () => {
      const variants: LinkVariant[] = ['primary', 'info', 'negative'];

      expect(() => {
        variants.forEach((variant) => {
          render(
            <EtLink variant={variant} onPress={mockOnPress}>
              Rapid Render
            </EtLink>,
          );
        });
      }).not.toThrow();
    });

    it('handles whitespace-only string children', () => {
      const { getByTestId } = render(
        <EtLink testID="whitespace-link" onPress={mockOnPress}>
          {'   '}
        </EtLink>,
      );

      expect(getByTestId('whitespace-link')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('handles batch rendering operations', () => {
      const batchSize = 50;

      expect(() => {
        for (let i = 0; i < batchSize; i++) {
          render(
            <EtLink variant={i % 2 === 0 ? 'primary' : 'info'} size={i % 3 === 0 ? 'small' : i % 3 === 1 ? 'medium' : 'large'} onPress={mockOnPress}>
              {`Link ${i}`}
            </EtLink>,
          );
        }
      }).not.toThrow();
    });
  });
});
