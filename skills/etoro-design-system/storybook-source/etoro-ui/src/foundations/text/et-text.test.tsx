import { act, fireEvent, render, renderHook } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { createRef } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

import { EtTextProps } from './api';
import { EtText } from './et-text';
import { useEtShrinkTextModel } from './hooks/use-et-shrink-text-model';
import { ENABLE_LIGHT_MODE_TEXT_SHADOW } from './hooks/use-text-styles';
import { getVariantConfig } from './utils/variant-config';

let mockIsDarkMode = false;

// Mock useEtoroTheme hook
jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({
    dark: mockIsDarkMode,
    colors: {
      carbon900: '#1B1E21',
      carbon500: '#999999',
      carbon400: '#CCCCCC',
    },
  }),
}));

// Mock utils
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  getFontSize: jest.fn((size) => {
    const sizes: Record<string, number> = {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    };
    return typeof size === 'number' ? size : sizes[size] || 16;
  }),
  getFontFamily: jest.fn((weight) => {
    const weights: Record<string, string> = {
      light: 'eToro-Light',
      regular: 'eToro-Regular',
      medium: 'eToro-Medium',
      semiBold: 'eToro-Semibold',
      bold: 'eToro-Bold',
      extraBold: 'eToro-Extrabold',
    };
    return weights[weight] || 'eToro-Regular';
  }),
  getVariantConfig: jest.fn((variant) => {
    const configs: Record<string, any> = {
      'body-base-regular': {
        size: 'base',
        weight: 'regular',
        colorKey: 'carbon900',
        lineHeight: 24,
        letterSpacing: 0,
      },
      'body-secondary-medium': {
        size: 'sm',
        weight: 'medium',
        colorKey: 'carbon500',
        lineHeight: 18,
        letterSpacing: 0,
      },
      'heading-base': {
        size: 'xl',
        weight: 'semiBold',
        colorKey: 'carbon900',
        lineHeight: 26,
        letterSpacing: -0.25,
      },
    };
    return configs[variant] || configs['body-base-regular'];
  }),
}));

// Removed unused DEFAULT_STYLE and createDefaultProps

describe('EtText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsDarkMode = false;
  });

  describe('Basic Rendering', () => {
    it('renders text content correctly', () => {
      const { getByText } = render(<EtText variant="body-base-regular">Hello World</EtText>);

      expect(getByText('Hello World')).toBeDefined();
    });

    it('renders empty string when no children provided', () => {
      const props = {
        variant: 'body-base-regular',
        children: '',
      } as EtTextProps;
      const { UNSAFE_root } = render(<EtText {...props} />);

      expect(UNSAFE_root).toBeDefined();
    });
  });

  describe('Variant Configuration', () => {
    it('applies variant configuration correctly', () => {
      const { getByText } = render(<EtText variant="body-secondary-medium">Test</EtText>);

      const textElement = getByText('Test');
      expect(textElement).toBeDefined();
    });

    it('handles all variant types', () => {
      const variants: Array<'body-base-regular' | 'body-secondary-medium' | 'heading-base' | 'label-primary-bold'> = [
        'body-base-regular',
        'body-secondary-medium',
        'heading-base',
        'label-primary-bold',
      ];

      variants.forEach((variant) => {
        const { getByText } = render(<EtText variant={variant}>Test</EtText>);

        expect(getByText('Test')).toBeDefined();
      });
    });
  });

  describe('Style Override', () => {
    it('applies custom styles', () => {
      const customStyle = { marginTop: 10, paddingLeft: 5 };

      const { getByText } = render(
        <EtText variant="body-base-regular" style={customStyle}>
          Test
        </EtText>,
      );

      const textElement = getByText('Test');
      expect(textElement.props.style).toContainEqual(customStyle);
    });

    it('merges variant styles with custom styles', () => {
      const customStyle = { marginTop: 10 };

      const { getByText } = render(
        <EtText variant="body-base-regular" style={customStyle}>
          Test
        </EtText>,
      );

      const textElement = getByText('Test');
      expect(textElement.props.style).toBeDefined();
      expect(Array.isArray(textElement.props.style)).toBe(true);
    });

    it('handles array of styles', () => {
      const styleArray = [{ color: 'red' }, { marginTop: 5 }];

      const { getByText } = render(
        <EtText variant="body-base-regular" style={styleArray}>
          Test
        </EtText>,
      );

      const textElement = getByText('Test');
      expect(textElement.props.style).toBeDefined();
    });

    it('allows color override via style prop', () => {
      const { getByText } = render(
        <EtText variant="body-base-regular" style={{ color: '#FF0000' } as any}>
          Test
        </EtText>,
      );

      const textElement = getByText('Test');
      expect(textElement.props.style).toBeDefined();
    });

    it('honors the light mode text shadow toggle', () => {
      const { getByText } = render(<EtText variant="body-base-regular">Test</EtText>);

      const textElement = getByText('Test');
      const flattenedStyle = StyleSheet.flatten(textElement.props.style);

      if (ENABLE_LIGHT_MODE_TEXT_SHADOW) {
        expect(flattenedStyle.textShadowColor).toBe('#1B1E21');
        expect(flattenedStyle.textShadowOffset).toEqual({ width: 0, height: 0 });
        expect(flattenedStyle.textShadowRadius).toBe(0.5);
      } else {
        expect(flattenedStyle.textShadowColor).toBeUndefined();
        expect(flattenedStyle.textShadowOffset).toBeUndefined();
        expect(flattenedStyle.textShadowRadius).toBeUndefined();
      }
    });

    it('does not apply the text shadow in dark mode', () => {
      mockIsDarkMode = true;

      const { getByText } = render(<EtText variant="body-base-regular">Test</EtText>);

      const textElement = getByText('Test');
      const flattenedStyle = StyleSheet.flatten(textElement.props.style);

      expect(flattenedStyle.textShadowColor).toBeUndefined();
      expect(flattenedStyle.textShadowOffset).toBeUndefined();
      expect(flattenedStyle.textShadowRadius).toBeUndefined();
    });
  });

  describe('React Native Text Props', () => {
    it('applies numberOfLines', () => {
      const { getByText } = render(
        <EtText variant="body-base-regular" numberOfLines={2}>
          Test
        </EtText>,
      );

      const textElement = getByText('Test');
      expect(textElement.props.numberOfLines).toBe(2);
    });

    it('applies ellipsizeMode', () => {
      const { getByText } = render(
        <EtText variant="body-base-regular" ellipsizeMode="tail">
          Test
        </EtText>,
      );

      const textElement = getByText('Test');
      expect(textElement.props.ellipsizeMode).toBe('tail');
    });

    it('applies selectable', () => {
      const { getByText } = render(
        <EtText variant="body-base-regular" selectable>
          Test
        </EtText>,
      );

      const textElement = getByText('Test');
      expect(textElement.props.selectable).toBe(true);
    });

    it('applies testID', () => {
      const { getByTestId } = render(
        <EtText variant="body-base-regular" testID="text-element">
          Test
        </EtText>,
      );

      expect(getByTestId('text-element')).toBeDefined();
    });

    it('applies accessibilityLabel', () => {
      const { getByText } = render(
        <EtText variant="body-base-regular" accessibilityLabel="Custom label">
          Test
        </EtText>,
      );

      const textElement = getByText('Test');
      expect(textElement.props.accessibilityLabel).toBe('Custom label');
    });

    it('applies accessibilityRole', () => {
      const { getByText } = render(
        <EtText variant="body-base-regular" accessibilityRole="header">
          Test
        </EtText>,
      );

      const textElement = getByText('Test');
      expect(textElement.props.accessibilityRole).toBe('header');
    });
  });

  describe('Animation Props', () => {
    it('uses Animated.Text when entering prop is provided', () => {
      const mockEntering = {} as any;
      const { getByText } = render(
        <EtText variant="body-base-regular" entering={mockEntering}>
          Test
        </EtText>,
      );

      const textElement = getByText('Test');
      expect(textElement).toBeDefined();
    });

    it('uses Animated.Text when exiting prop is provided', () => {
      const mockExiting = {} as any;
      const { getByText } = render(
        <EtText variant="body-base-regular" exiting={mockExiting}>
          Test
        </EtText>,
      );

      const textElement = getByText('Test');
      expect(textElement).toBeDefined();
    });

    it('uses regular Text when no animation props', () => {
      const { getByText } = render(<EtText variant="body-base-regular">Test</EtText>);

      const textElement = getByText('Test');
      expect(textElement).toBeDefined();
    });
  });

  describe('Ref Support', () => {
    it('applies ref correctly', () => {
      const ref = createRef<Text>();

      render(
        <EtText variant="body-base-regular" ref={ref}>
          Test
        </EtText>,
      );

      expect(ref).toBeDefined();
    });
  });

  describe('Complex Configurations', () => {
    it('handles all props together', () => {
      const ref = createRef<Text>();
      const props: EtTextProps = {
        variant: 'heading-base',
        children: 'Complex test',
        numberOfLines: 3,
        ellipsizeMode: 'tail',
        selectable: true,
        style: { marginTop: 10 },
        testID: 'complex-text',
        accessibilityLabel: 'Complex label',
        accessibilityRole: 'header',
      };

      const { getByTestId } = render(<EtText {...props} ref={ref} />);

      const textElement = getByTestId('complex-text');
      expect(textElement.props.children).toBe('Complex test');
      expect(textElement.props.numberOfLines).toBe(3);
      expect(textElement.props.ellipsizeMode).toBe('tail');
      expect(textElement.props.selectable).toBe(true);
      expect(textElement.props.accessibilityLabel).toBe('Complex label');
      expect(textElement.props.accessibilityRole).toBe('header');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined children', () => {
      const props = {
        variant: 'body-base-regular' as const,
        children: undefined,
      } as any;
      const { UNSAFE_root } = render(<EtText {...props} />);

      expect(UNSAFE_root).toBeDefined();
    });

    it('handles null children', () => {
      const props = {
        variant: 'body-base-regular' as const,
        children: null,
      } as any;
      const { UNSAFE_root } = render(<EtText {...props} />);

      expect(UNSAFE_root).toBeDefined();
    });

    it('handles React elements as children', () => {
      const { Text } = require('react-native');
      const childElement = <Text>Child element</Text>;
      const { UNSAFE_root } = render(<EtText variant="body-base-regular">{childElement}</EtText>);

      expect(UNSAFE_root).toBeDefined();
    });

    it('handles zero numberOfLines', () => {
      const { getByText } = render(
        <EtText variant="body-base-regular" numberOfLines={0}>
          Test
        </EtText>,
      );

      expect(getByText('Test').props.numberOfLines).toBe(0);
    });
  });

  describe('shrinkToFit', () => {
    const originalOS = Platform.OS;

    afterEach(() => {
      Platform.OS = originalOS;
    });

    it('GIVEN shrinkToFit WHEN rendered THEN uses single line and native shrink props', () => {
      Platform.OS = 'ios';
      const { UNSAFE_getByType } = render(
        <EtText variant="num-s-medium" shrinkToFit>
          Long value
        </EtText>,
      );
      const text = UNSAFE_getByType(Text);
      expect(text.props.numberOfLines).toBe(1);
      expect(text.props.adjustsFontSizeToFit).toBe(true);
      expect(text.props.minimumFontScale).toBe(0.85);
    });

    it('GIVEN custom minimumFontScale WHEN shrinkToFit THEN forwards prop', () => {
      Platform.OS = 'ios';
      const { UNSAFE_getByType } = render(
        <EtText variant="num-s-medium" shrinkToFit minimumFontScale={0.75}>
          Value
        </EtText>,
      );
      expect(UNSAFE_getByType(Text).props.minimumFontScale).toBe(0.75);
    });

    it('GIVEN onTextLayout WHEN shrinkToFit on iOS THEN forwards event', () => {
      Platform.OS = 'ios';
      const onTextLayout = jest.fn();
      const { UNSAFE_getByType } = render(
        <EtText variant="num-s-medium" shrinkToFit onTextLayout={onTextLayout}>
          Value
        </EtText>,
      );
      fireEvent(UNSAFE_getByType(Text), 'textLayout', { nativeEvent: { lines: [{}, {}] } });
      expect(onTextLayout).toHaveBeenCalled();
    });
  });
});

describe('useEtShrinkTextModel', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it('GIVEN Android overflow WHEN onTextLayout reports multiple lines THEN reduces fontSize', () => {
    Platform.OS = 'android';
    const { result } = renderHook(() =>
      useEtShrinkTextModel({
        variant: 'num-s-medium',
        children: 'Very long amount string',
        scaleStep: 0.05,
        minimumFontScale: 0.85,
      }),
    );

    act(() => {
      result.current.handleTextLayout({ nativeEvent: { lines: [{}, {}] } } as never);
    });

    const baseSize = getVariantConfig('num-s-medium').size;
    expect(result.current.androidFontStyle).toEqual({ fontSize: baseSize * 0.95 });
  });

  it('GIVEN children change WHEN hook re-runs THEN resets Android scale', () => {
    Platform.OS = 'android';
    const { result, rerender } = renderHook(
      ({ children }) =>
        useEtShrinkTextModel({
          variant: 'num-s-medium',
          children,
          scaleStep: 0.05,
          minimumFontScale: 0.85,
        }),
      { initialProps: { children: 'First' as ReactNode } },
    );

    const baseSize = getVariantConfig('num-s-medium').size;
    act(() => {
      result.current.handleTextLayout({ nativeEvent: { lines: [{}, {}] } } as never);
    });
    expect(result.current.androidFontStyle).toEqual({ fontSize: baseSize * 0.95 });

    rerender({ children: 'Second' });
    expect(result.current.androidFontStyle).toBeNull();
  });
});
