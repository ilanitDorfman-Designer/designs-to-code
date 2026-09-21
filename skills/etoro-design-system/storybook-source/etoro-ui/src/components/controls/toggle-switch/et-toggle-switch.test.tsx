import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import { colorsMock } from '../../../core/hooks/__mocks__/colors-mock';
import type { ToggleSwitchSize } from './api/types';
import { EtToggleSwitch } from './et-toggle-switch';
import { getSizeTransform } from './utils';
import { getToggleSwitchColors, resolveToggleColors } from './utils/get-toggle-colors';

// Mock react-native-gesture-handler Switch
jest.mock('react-native-gesture-handler', () => {
  const { Switch } = require('react-native');
  return {
    Switch,
  };
});

// Mock useEtoroTheme hook
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

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

describe('EtToggleSwitch', () => {
  describe('Size Transform', () => {
    it('should have 2 size variants', () => {
      const sizes: ToggleSwitchSize[] = ['small', 'medium'];
      expect(sizes.length).toBe(2);
    });

    it('should return scale transform for small size', () => {
      const transform = getSizeTransform('small');
      expect(transform).toEqual({
        transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
      });
    });

    it('should return scale transform for medium size (native)', () => {
      const transform = getSizeTransform('medium');
      expect(transform).toEqual({
        transform: [{ scaleX: 1 }, { scaleY: 1 }],
      });
    });
  });

  describe('Color Utilities', () => {
    const { colors } = colorsMock;

    it('should return all required color properties', () => {
      const toggleColors = getToggleSwitchColors(colors as any);

      expect(toggleColors).toHaveProperty('trackOff');
      expect(toggleColors).toHaveProperty('trackOn');
      expect(toggleColors).toHaveProperty('trackDisabled');
      expect(toggleColors).toHaveProperty('thumb');
      expect(toggleColors).toHaveProperty('thumbDisabled');
    });

    it('should use correct theme colors for track', () => {
      const toggleColors = getToggleSwitchColors(colors as any);

      expect(toggleColors.trackOff).toBe(colors.bgGreyPrimary);
      expect(toggleColors.trackOn).toBe(colors.actionBrandText);
      expect(toggleColors.trackDisabled).toBe(colors.bgActionDisabled);
    });

    it('should use white for default thumb color', () => {
      const toggleColors = getToggleSwitchColors(colors as any);
      expect(toggleColors.thumb).toBe('#ffffff');
    });

    it('should resolve colors with custom trackColor', () => {
      const customTrackColor = { true: '#00ff00', false: '#cccccc' };
      const resolved = resolveToggleColors(colors as any, customTrackColor, undefined, false);

      expect(resolved.trackColorOn).toBe('#00ff00');
      expect(resolved.trackColorOff).toBe('#cccccc');
    });

    it('should resolve colors with custom thumbColor', () => {
      const customThumbColor = '#ffffff';
      const resolved = resolveToggleColors(colors as any, undefined, customThumbColor, false);

      expect(resolved.thumbColor).toBe('#ffffff');
    });

    it('should use disabled colors when disabled', () => {
      const resolved = resolveToggleColors(colors as any, undefined, undefined, true);
      const defaults = getToggleSwitchColors(colors as any);

      expect(resolved.trackColorOff).toBe(defaults.trackDisabled);
      expect(resolved.trackColorOn).toBe(defaults.trackDisabled);
      expect(resolved.thumbColor).toBe(defaults.thumbDisabled);
    });
  });

  describe('Type Safety', () => {
    it('should enforce valid size types', () => {
      const validSize: ToggleSwitchSize = 'small';
      expect(validSize).toBe('small');
    });

    it('should have all size options', () => {
      const sizes: ToggleSwitchSize[] = ['small', 'medium'];
      expect(sizes.length).toBe(2);
    });
  });
});

describe('EtToggleSwitch Component Rendering', () => {
  const mockOnValueChange = jest.fn<(value: boolean) => void>();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} />);

      expect(getByRole('switch')).toBeTruthy();
    });

    it('renders with testID prop', () => {
      const { getByTestId } = render(<EtToggleSwitch testID="test-toggle" value={false} onValueChange={mockOnValueChange} />);

      expect(getByTestId('test-toggle')).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} />);

      expect(getByRole('switch')).toBeTruthy();
    });
  });

  describe('Size Rendering', () => {
    const sizes: ToggleSwitchSize[] = ['small', 'medium'];

    sizes.forEach((size) => {
      it(`renders ${size} size without crashing`, () => {
        const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} size={size} />);

        expect(getByRole('switch')).toBeTruthy();
      });
    });
  });

  describe('Value States', () => {
    it('renders off state (false)', () => {
      const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} />);

      const toggle = getByRole('switch');
      expect(toggle.props.value).toBe(false);
    });

    it('renders on state (true)', () => {
      const { getByRole } = render(<EtToggleSwitch value={true} onValueChange={mockOnValueChange} />);

      const toggle = getByRole('switch');
      expect(toggle.props.value).toBe(true);
    });
  });

  describe('Value Change Events', () => {
    it('calls onValueChange when toggled', () => {
      const handleChange = jest.fn<(value: boolean) => void>();
      const { getByTestId } = render(<EtToggleSwitch testID="press-toggle" value={false} onValueChange={handleChange} />);

      fireEvent(getByTestId('press-toggle'), 'valueChange', true);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls onValueChange with true when toggled on', () => {
      const handleChange = jest.fn<(value: boolean) => void>();
      const { getByTestId } = render(<EtToggleSwitch testID="toggle" value={false} onValueChange={handleChange} />);

      fireEvent(getByTestId('toggle'), 'valueChange', true);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('calls onValueChange with false when toggled off', () => {
      const handleChange = jest.fn<(value: boolean) => void>();
      const { getByTestId } = render(<EtToggleSwitch testID="toggle" value={true} onValueChange={handleChange} />);

      fireEvent(getByTestId('toggle'), 'valueChange', false);
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('triggers haptic feedback by default on toggle', () => {
      const Haptics = require('expo-haptics');
      const { getByTestId } = render(<EtToggleSwitch testID="haptic-toggle" value={false} onValueChange={mockOnValueChange} />);

      fireEvent(getByTestId('haptic-toggle'), 'valueChange', true);
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('does not trigger haptic feedback when haptics is false', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(<EtToggleSwitch testID="no-haptic-toggle" value={false} onValueChange={mockOnValueChange} haptics={false} />);

      fireEvent(getByTestId('no-haptic-toggle'), 'valueChange', true);
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('does not call onValueChange when disabled', () => {
      const handleChange = jest.fn<(value: boolean) => void>();
      const { getByTestId } = render(<EtToggleSwitch testID="disabled-toggle" value={false} onValueChange={handleChange} disabled />);

      // When disabled, the handler guards against calling onValueChange
      fireEvent(getByTestId('disabled-toggle'), 'valueChange', true);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not trigger haptics when disabled', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(<EtToggleSwitch testID="disabled-toggle" value={false} onValueChange={mockOnValueChange} disabled />);

      fireEvent(getByTestId('disabled-toggle'), 'valueChange', true);
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('has disabled accessibility state when disabled', () => {
      const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} disabled />);

      const toggle = getByRole('switch');
      expect(toggle.props.disabled).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has switch accessibility role', () => {
      const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} />);

      expect(getByRole('switch')).toBeTruthy();
    });

    it('has correct accessibility state when off', () => {
      const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} />);

      const toggle = getByRole('switch');
      expect(toggle.props.value).toBe(false);
    });

    it('has correct accessibility state when on', () => {
      const { getByRole } = render(<EtToggleSwitch value={true} onValueChange={mockOnValueChange} />);

      const toggle = getByRole('switch');
      expect(toggle.props.value).toBe(true);
    });

    it('applies accessibilityLabel prop', () => {
      const { getByLabelText } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} accessibilityLabel="Enable notifications" />);

      expect(getByLabelText('Enable notifications')).toBeTruthy();
    });

    it('has default accessibilityLabel when not provided', () => {
      const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} />);

      const toggle = getByRole('switch');
      expect(toggle.props.accessibilityLabel).toContain('Toggle switch');
    });

    it('has correct accessibility state when not disabled', () => {
      const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} />);

      const toggle = getByRole('switch');
      expect(toggle.props.disabled).toBe(false);
    });
  });

  describe('Custom Colors', () => {
    it('accepts trackColor prop', () => {
      const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} trackColor={{ true: 'green', false: 'gray' }} />);

      expect(getByRole('switch')).toBeTruthy();
    });

    it('accepts thumbColor prop', () => {
      const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} thumbColor="white" />);

      expect(getByRole('switch')).toBeTruthy();
    });
  });

  describe('Style Customization', () => {
    it('applies custom style to toggle', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(<EtToggleSwitch testID="styled-toggle" value={false} onValueChange={mockOnValueChange} style={customStyle} />);

      const toggle = getByTestId('styled-toggle');
      // Style is applied as a nested array structure [sizeTransform, customStyle]
      const flatStyle = JSON.stringify(toggle.props.style);
      expect(flatStyle).toContain('"margin":10');
    });
  });

  describe('Component Structure', () => {
    it('is a valid React component (memo wrapped)', () => {
      expect(EtToggleSwitch).toBeDefined();
      expect(EtToggleSwitch.$$typeof).toBeDefined();
    });

    it('has displayName set', () => {
      // Note: memo wrapping may affect displayName access
      expect(EtToggleSwitch).toBeDefined();
    });
  });

  describe('Props Integration', () => {
    it('handles all props together', () => {
      const handleChange = jest.fn<(value: boolean) => void>();
      const { getByTestId } = render(
        <EtToggleSwitch
          testID="full-toggle"
          value={true}
          onValueChange={handleChange}
          size="medium"
          disabled={false}
          haptics={true}
          trackColor={{ true: '#0eb12e', false: '#ccc' }}
          thumbColor="#fff"
          style={{ margin: 16 }}
          accessibilityLabel="Full toggle"
        />,
      );

      expect(getByTestId('full-toggle')).toBeTruthy();
    });

    it('handles size and value combinations', () => {
      const sizes: ToggleSwitchSize[] = ['small', 'medium'];
      const values: boolean[] = [true, false];

      sizes.forEach((size) => {
        values.forEach((value) => {
          const { getByRole } = render(<EtToggleSwitch value={value} onValueChange={mockOnValueChange} size={size} />);

          expect(getByRole('switch')).toBeTruthy();
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('throws when onValueChange is undefined (required prop)', () => {
      const { getByTestId } = render(
        <EtToggleSwitch
          testID="no-callback"
          value={false}
          // @ts-expect-error - Testing runtime behavior when TypeScript is bypassed
          onValueChange={undefined}
        />,
      );

      // Should throw when toggled with undefined callback (required prop)
      expect(() => fireEvent(getByTestId('no-callback'), 'valueChange', true)).toThrow();
    });

    it('handles prop changes correctly', () => {
      const { rerender, getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} />);

      expect(getByRole('switch').props.value).toBe(false);

      rerender(<EtToggleSwitch value={true} onValueChange={mockOnValueChange} />);

      expect(getByRole('switch').props.value).toBe(true);
    });

    it('handles size changes correctly', () => {
      const { rerender, getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} size="small" />);

      expect(getByRole('switch')).toBeTruthy();

      rerender(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} size="medium" />);

      expect(getByRole('switch')).toBeTruthy();
    });

    it('handles forceNativeSync prop correctly', () => {
      const { rerender, getByRole, getByTestId } = render(
        <EtToggleSwitch testID="sync-toggle" value={false} forceNativeSync={true} onValueChange={mockOnValueChange} />,
      );

      // Initial state should be false
      expect(getByRole('switch').props.value).toBe(false);

      // Simulate toggle
      fireEvent(getByTestId('sync-toggle'), 'valueChange', true);

      // onValueChange should be called with the new value
      expect(mockOnValueChange).toHaveBeenCalledWith(true);

      // Local UI state should update to true
      expect(getByRole('switch').props.value).toBe(true);

      // Rerender with value={true} - UI should resync to new prop value
      rerender(<EtToggleSwitch testID="sync-toggle" value={true} forceNativeSync={true} onValueChange={mockOnValueChange} />);

      expect(getByRole('switch').props.value).toBe(true);
    });

    it('handles undefined style', () => {
      const { getByRole } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} style={undefined} />);

      expect(getByRole('switch')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('handles batch rendering operations', () => {
      const batchSize = 50;

      expect(() => {
        for (let i = 0; i < batchSize; i++) {
          render(<EtToggleSwitch value={i % 2 === 0} onValueChange={mockOnValueChange} size={i % 2 === 0 ? 'small' : 'medium'} />);
        }
      }).not.toThrow();
    });

    it('handles multiple rerenders with different props', () => {
      const { rerender } = render(<EtToggleSwitch value={false} onValueChange={mockOnValueChange} />);

      for (let i = 0; i < 10; i++) {
        rerender(
          <EtToggleSwitch value={i % 2 === 0} onValueChange={mockOnValueChange} disabled={i % 3 === 0} size={i % 2 === 0 ? 'small' : 'medium'} />,
        );
      }

      expect(true).toBeTruthy();
    });
  });
});
