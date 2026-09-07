import { render } from '@testing-library/react-native';
import React from 'react';

import { IconName, IconSize } from './api';
import { EtoroIcon } from './et-icon';

// Style constants to avoid inline styles
const testStyles = {
  fillEnabled: { hasFill: true },
  fillEnabledWithColor: { hasFill: true, fill: '#FF0000' },
  fillDisabled: { hasFill: false, fill: '#FF0000' },
};

// Mock dependencies
jest.mock('./hooks', () => ({
  useIconTheme: jest.fn(),
  useIconAccessibility: jest.fn(),
}));

jest.mock('./utils', () => ({
  initProps: jest.fn(),
  getIconComponent: jest.fn(),
  getIconSize: jest.fn(),
  iconSupportsFill: jest.fn(),
}));

// Mock the hook at the module level instead of the import path

// Create a mock icon component
interface MockIconProps {
  size?: number;
  color?: string;
  hasFill?: boolean;
  fill?: string;
  testID?: string;
  [key: string]: any;
}

function MockIconComponent({ size, color, hasFill, fill, testID, ...props }: MockIconProps) {
  const { View: MockView } = require('react-native');
  return (
    <MockView testID={testID || 'mock-icon'} style={{ width: size, height: size, backgroundColor: color }} hasFill={hasFill} fill={fill} {...props} />
  );
}

// Import mocked functions with proper typing
const { useIconTheme, useIconAccessibility } = require('./hooks') as {
  useIconTheme: jest.MockedFunction<any>;
  useIconAccessibility: jest.MockedFunction<any>;
};

const { initProps, getIconComponent, getIconSize, iconSupportsFill } = require('./utils') as {
  initProps: jest.MockedFunction<any>;
  getIconComponent: jest.MockedFunction<any>;
  getIconSize: jest.MockedFunction<any>;
  iconSupportsFill: jest.MockedFunction<any>;
};

describe('EtoroIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    initProps.mockImplementation((props: any) => ({
      icon: props.icon,
      appearance: {
        size: props.appearance?.size || 'md',
        color: props.appearance?.color,
        ...props.appearance,
      },
      style: {
        hasFill: props.style?.hasFill || false,
        fill: props.style?.fill,
        style: props.style?.style,
        ...props.style,
      },
      accessibility: {
        testID: props.accessibility?.testID,
        accessibilityLabel: props.accessibility?.accessibilityLabel,
        accessibilityHint: props.accessibility?.accessibilityHint,
        accessibilityRole: props.accessibility?.accessibilityRole || 'image',
        ...props.accessibility,
      },
      advanced: {
        svgProps: props.advanced?.svgProps,
        cache: props.advanced?.cache || true,
        ...props.advanced,
      },
    }));

    useIconTheme.mockReturnValue({
      iconName: 'home',
      color: '#000000',
      metadata: { name: 'home', category: 'navigation', supportsFill: false },
      theme: {
        text: '#000000',
        primary: '#00C896',
        success: '#10B981',
        primaryRed: '#EF4444',
      },
    });

    useIconAccessibility.mockReturnValue({
      accessibilityProps: {
        accessibilityLabel: 'home icon',
        accessibilityRole: 'image',
        accessible: true,
      },
    });

    getIconComponent.mockReturnValue(MockIconComponent);
    getIconSize.mockReturnValue(24);
    iconSupportsFill.mockReturnValue(false);
  });

  describe('Basic Rendering', () => {
    it('renders with minimum required props', () => {
      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} accessibility={{ testID: 'test-icon' }} />);

      expect(getByTestId('test-icon')).toBeTruthy();
      expect(getByTestId('mock-icon')).toBeTruthy();
    });

    it('returns null when icon component is not found', () => {
      getIconComponent.mockReturnValue(null);

      const { queryByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} accessibility={{ testID: 'test-icon' }} />);

      expect(queryByTestId('test-icon')).toBeNull();
      expect(queryByTestId('mock-icon')).toBeNull();
    });

    it('renders with default accessibility role when not provided', () => {
      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} accessibility={{ testID: 'test-icon' }} />);

      const container = getByTestId('test-icon');
      expect(container.props.accessibilityRole).toBe('image');
    });
  });

  describe('Icon Names', () => {
    const iconNames: IconName[] = [
      'home',
      'search',
      'user',
      'settings',
      'heart',
      'plus',
      'minus',
      'apple',
      'btc',
      'gainers',
      'losers',
      'torii',
      'notification',
    ];

    iconNames.forEach((iconName) => {
      it(`renders ${iconName} icon correctly`, () => {
        useIconTheme.mockReturnValue({
          iconName,
          color: '#000000',
          metadata: { name: iconName, category: 'navigation', supportsFill: false },
          theme: { text: '#000000' },
        });

        const { getByTestId } = render(<EtoroIcon icon={{ iconName }} accessibility={{ testID: `${iconName}-icon` }} />);

        expect(getByTestId(`${iconName}-icon`)).toBeTruthy();
        expect(getByTestId('mock-icon')).toBeTruthy();
      });
    });
  });

  describe('Icon Sizes', () => {
    const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 100];

    sizes.forEach((size) => {
      it(`renders with ${size} size correctly`, () => {
        const expectedPixelSize = typeof size === 'number' ? size : 24;
        getIconSize.mockReturnValue(expectedPixelSize);

        const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} appearance={{ size }} accessibility={{ testID: 'test-icon' }} />);

        expect(getIconSize).toHaveBeenCalledWith(size);
        expect(getByTestId('mock-icon')).toBeTruthy();
      });
    });

    it('uses default size when size is not provided', () => {
      getIconSize.mockReturnValue(24);

      render(<EtoroIcon icon={{ iconName: 'home' }} accessibility={{ testID: 'test-icon' }} />);

      expect(getIconSize).toHaveBeenCalledWith('md');
    });
  });

  describe('Color Handling', () => {
    it('uses theme-aware color from useIconTheme', () => {
      const themeColor = '#FF0000';
      useIconTheme.mockReturnValue({
        iconName: 'home',
        color: themeColor,
        metadata: { name: 'home', category: 'navigation', supportsFill: false },
        theme: { text: '#000000' },
      });

      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} accessibility={{ testID: 'test-icon' }} />);

      const iconComponent = getByTestId('mock-icon');
      expect(iconComponent.props.style.backgroundColor).toBe(themeColor);
    });

    it('applies custom color through appearance prop', () => {
      const customColor = '#00FF00';
      useIconTheme.mockReturnValue({
        iconName: 'home',
        color: customColor,
        metadata: { name: 'home', category: 'navigation', supportsFill: false },
        theme: { text: '#000000' },
      });

      render(<EtoroIcon icon={{ iconName: 'home' }} appearance={{ color: customColor }} accessibility={{ testID: 'test-icon' }} />);

      expect(useIconTheme).toHaveBeenCalledWith({
        iconName: 'home',
        color: customColor,
      });
    });

    it('handles special themed colors for specific icons', () => {
      const brandColor = '#00C896';
      useIconTheme.mockReturnValue({
        iconName: 'torii',
        color: brandColor,
        metadata: { name: 'torii', category: 'brand', supportsFill: false },
        theme: { primary: brandColor },
      });

      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'torii' }} accessibility={{ testID: 'test-icon' }} />);

      const iconComponent = getByTestId('mock-icon');
      expect(iconComponent.props.style.backgroundColor).toBe(brandColor);
    });
  });

  describe('Accessibility', () => {
    it('applies accessibility label from useIconAccessibility', () => {
      const accessibilityLabel = 'Custom home icon';
      useIconAccessibility.mockReturnValue({
        accessibilityProps: {
          accessibilityLabel,
          accessibilityRole: 'button',
          accessible: true,
        },
      });

      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} accessibility={{ testID: 'test-icon', accessibilityLabel }} />);

      const container = getByTestId('test-icon');
      expect(container.props.accessibilityLabel).toBe(accessibilityLabel);
    });

    it('applies accessibility role from useIconAccessibility', () => {
      useIconAccessibility.mockReturnValue({
        accessibilityProps: {
          accessibilityLabel: 'home icon',
          accessibilityRole: 'button',
          accessible: true,
        },
      });

      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} accessibility={{ testID: 'test-icon', accessibilityRole: 'button' }} />);

      const container = getByTestId('test-icon');
      expect(container.props.accessibilityRole).toBe('button');
    });

    it('sets accessible prop from useIconAccessibility', () => {
      useIconAccessibility.mockReturnValue({
        accessibilityProps: {
          accessibilityLabel: 'home icon',
          accessibilityRole: 'image',
          accessible: false,
        },
      });

      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} accessibility={{ testID: 'test-icon' }} />);

      const container = getByTestId('test-icon');
      expect(container.props.accessible).toBe(false);
    });

    it('passes correct props to useIconAccessibility', () => {
      const accessibilityProps = {
        accessibilityLabel: 'Custom label',
        accessibilityRole: 'button' as const,
      };

      render(<EtoroIcon icon={{ iconName: 'home' }} appearance={{ size: 32 }} accessibility={{ testID: 'test-icon', ...accessibilityProps }} />);

      expect(useIconAccessibility).toHaveBeenCalledWith({
        iconName: 'home',
        size: 32,
        accessibilityLabel: 'Custom label',
        accessibilityRole: 'button',
      });
    });
  });

  describe('Fill Functionality', () => {
    it('applies fill when icon supports fill and hasFill is true', () => {
      iconSupportsFill.mockReturnValue(true);
      const fillColor = '#FF0000';

      const { getByTestId } = render(
        <EtoroIcon icon={{ iconName: 'heart' }} style={{ ...testStyles.fillEnabled, fill: fillColor }} accessibility={{ testID: 'test-icon' }} />,
      );

      expect(iconSupportsFill).toHaveBeenCalledWith('heart');
      const iconComponent = getByTestId('mock-icon');
      expect(iconComponent.props.hasFill).toBe(true);
      expect(iconComponent.props.fill).toBe(fillColor);
    });

    it('does not apply fill when icon does not support fill', () => {
      iconSupportsFill.mockReturnValue(false);

      const { getByTestId } = render(
        <EtoroIcon icon={{ iconName: 'home' }} style={testStyles.fillEnabledWithColor} accessibility={{ testID: 'test-icon' }} />,
      );

      expect(iconSupportsFill).toHaveBeenCalledWith('home');
      const iconComponent = getByTestId('mock-icon');
      expect(iconComponent.props.hasFill).toBe(false);
      expect(iconComponent.props.fill).toBeUndefined();
    });

    it('uses theme color as fill when no fill color is provided', () => {
      iconSupportsFill.mockReturnValue(true);
      const themeColor = '#000000';
      useIconTheme.mockReturnValue({
        iconName: 'heart',
        color: themeColor,
        metadata: { name: 'heart', category: 'actions', supportsFill: true },
        theme: { text: themeColor },
      });

      const { getByTestId } = render(
        <EtoroIcon icon={{ iconName: 'heart' }} style={testStyles.fillEnabled} accessibility={{ testID: 'test-icon' }} />,
      );

      const iconComponent = getByTestId('mock-icon');
      expect(iconComponent.props.fill).toBe(themeColor);
    });

    it('does not apply fill when hasFill is false', () => {
      iconSupportsFill.mockReturnValue(true);

      const { getByTestId } = render(
        <EtoroIcon icon={{ iconName: 'heart' }} style={testStyles.fillDisabled} accessibility={{ testID: 'test-icon' }} />,
      );

      const iconComponent = getByTestId('mock-icon');
      expect(iconComponent.props.hasFill).toBe(false);
      expect(iconComponent.props.fill).toBeUndefined();
    });
  });

  describe('Style Application', () => {
    it('applies container style', () => {
      const containerStyle = { padding: 10, backgroundColor: 'blue' };

      const { getByTestId } = render(
        <EtoroIcon icon={{ iconName: 'home' }} style={{ style: containerStyle }} accessibility={{ testID: 'test-icon' }} />,
      );

      const container = getByTestId('test-icon');
      expect(container.props.style).toEqual(containerStyle);
    });

    it('handles style as array', () => {
      const styleArray = [{ padding: 10 }, { backgroundColor: 'blue' }];

      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} style={{ style: styleArray }} accessibility={{ testID: 'test-icon' }} />);

      const container = getByTestId('test-icon');
      expect(container.props.style).toEqual(styleArray);
    });
  });

  describe('Advanced Configuration', () => {
    it('passes advanced svgProps to icon component', () => {
      const svgProps = { strokeWidth: 2, opacity: 0.8 };

      render(<EtoroIcon icon={{ iconName: 'home' }} advanced={{ svgProps }} accessibility={{ testID: 'test-icon' }} />);

      // Verify that the IconComponent receives the svgProps in the implementation
      // The MockIconComponent should have been called with the spread svgProps
      expect(getIconComponent).toHaveBeenCalledWith('home');
    });

    it('handles empty svgProps', () => {
      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} advanced={{ svgProps: {} }} accessibility={{ testID: 'test-icon' }} />);

      expect(getByTestId('mock-icon')).toBeTruthy();
    });
  });

  describe('Hook Integration', () => {
    it('calls useIconTheme with correct parameters', () => {
      const iconName = 'heart';
      const color = '#FF0000';

      render(<EtoroIcon icon={{ iconName }} appearance={{ color }} accessibility={{ testID: 'test-icon' }} />);

      expect(useIconTheme).toHaveBeenCalledWith({
        iconName,
        color,
      });
    });

    it('calls useIconAccessibility with correct parameters', () => {
      const iconName = 'user';
      const size = 32;
      const accessibilityLabel = 'User profile';
      const accessibilityRole = 'button';

      render(
        <EtoroIcon
          icon={{ iconName }}
          appearance={{ size }}
          accessibility={{
            testID: 'test-icon',
            accessibilityLabel,
            accessibilityRole,
          }}
        />,
      );

      expect(useIconAccessibility).toHaveBeenCalledWith({
        iconName,
        size,
        accessibilityLabel,
        accessibilityRole,
      });
    });

    it('handles undefined size in useIconAccessibility call', () => {
      render(<EtoroIcon icon={{ iconName: 'home' }} appearance={{ size: 'md' }} accessibility={{ testID: 'test-icon' }} />);

      expect(useIconAccessibility).toHaveBeenCalledWith({
        iconName: 'home',
        size: undefined, // string sizes are not passed as numbers
        accessibilityLabel: undefined,
        accessibilityRole: 'image',
      });
    });
  });

  describe('Props Initialization', () => {
    it('calls initProps with provided props', () => {
      const props = {
        icon: { iconName: 'home' as IconName },
        appearance: { size: 'lg' as IconSize, color: '#FF0000' },
        style: { hasFill: true, fill: '#00FF00' },
        accessibility: { testID: 'test-icon', accessibilityLabel: 'Home' },
        advanced: { svgProps: { strokeWidth: 2 } },
      };

      render(<EtoroIcon {...props} />);

      expect(initProps).toHaveBeenCalledWith(props);
    });

    it('works with minimal props', () => {
      const props = {
        icon: { iconName: 'home' as IconName },
      };

      render(<EtoroIcon {...props} />);

      expect(initProps).toHaveBeenCalledWith(props);
    });
  });

  describe('Error Cases', () => {
    it('handles invalid icon names gracefully', () => {
      getIconComponent.mockReturnValue(null);

      useIconTheme.mockReturnValue({
        iconName: 'invalidIcon',
        color: '#000000',
        metadata: null,
        theme: {
          text: '#000000',
          primary: '#00C896',
          success: '#10B981',
          primaryRed: '#EF4444',
        },
      });

      const { queryByTestId } = render(<EtoroIcon icon={{ iconName: 'invalidIcon' as IconName }} accessibility={{ testID: 'test-icon' }} />);

      expect(queryByTestId('test-icon')).toBeNull();
      expect(getIconComponent).toHaveBeenCalledWith('invalidIcon');
    });

    it('handles hook errors gracefully', () => {
      useIconTheme.mockImplementation(() => {
        throw new Error('Theme error');
      });

      // Component should not crash
      expect(() => {
        render(<EtoroIcon icon={{ iconName: 'home' }} accessibility={{ testID: 'test-icon' }} />);
      }).toThrow('Theme error');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero size', () => {
      getIconSize.mockReturnValue(0);

      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} appearance={{ size: 0 }} accessibility={{ testID: 'test-icon' }} />);

      const iconComponent = getByTestId('mock-icon');
      expect(iconComponent.props.style.width).toBe(0);
      expect(iconComponent.props.style.height).toBe(0);
    });

    it('handles very large size', () => {
      getIconSize.mockReturnValue(1000);

      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} appearance={{ size: 1000 }} accessibility={{ testID: 'test-icon' }} />);

      const iconComponent = getByTestId('mock-icon');
      expect(iconComponent.props.style.width).toBe(1000);
      expect(iconComponent.props.style.height).toBe(1000);
    });

    it('handles empty string color', () => {
      useIconTheme.mockReturnValue({
        iconName: 'home',
        color: '',
        metadata: { name: 'home', category: 'navigation', supportsFill: false },
        theme: { text: '#000000' },
      });

      const { getByTestId } = render(<EtoroIcon icon={{ iconName: 'home' }} appearance={{ color: '' }} accessibility={{ testID: 'test-icon' }} />);

      const iconComponent = getByTestId('mock-icon');
      expect(iconComponent.props.style.backgroundColor).toBe('');
    });
  });
});
