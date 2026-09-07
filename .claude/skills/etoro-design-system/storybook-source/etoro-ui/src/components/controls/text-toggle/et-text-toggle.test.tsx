import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { EtTextToggle } from './et-text-toggle';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
  },
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  const ReactLib = require('react');

  const AnimatedView = ReactLib.forwardRef((props: Record<string, unknown>, ref: React.Ref<typeof RN.View>) => {
    return ReactLib.createElement(RN.View, { ...props, ref });
  });
  AnimatedView.displayName = 'Animated.View';

  const AnimatedPressable = ReactLib.forwardRef((props: Record<string, unknown>, ref: React.Ref<typeof RN.Pressable>) => {
    return ReactLib.createElement(RN.Pressable, { ...props, ref });
  });
  AnimatedPressable.displayName = 'Animated.Pressable';

  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      createAnimatedComponent: () => AnimatedPressable,
    },
    View: AnimatedView,
    useSharedValue: <T,>(v: T) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withSpring: <T,>(v: T) => v,
  };
});

// Mock useEtoroTheme
jest.mock('../../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: () => ({
    colors: {
      // V1 keys retained while the rest of the suite still references them indirectly.
      dividerTertiary: '#DEE2E6',
      bgNeutralQuaternary: '#FFFFFF',
      textPrimaryNeutral: '#212529',
      textSecondaryNeutral: '#6C757D',
      textQuaternaryNeutral: '#ADB5BD',
      textDark: '#000000',
      // V2 tokens used by the migrated component.
      carbon500: '#999999',
      carbon600: '#666666',
      carbon900: '#1B1E21',
      carbonStatic900: '#1B1E21',
      carbonPrimaryDivider: '#B2B2B24D',
    },
  }),
}));

// Mock EtText
jest.mock('../../../foundations/text', () => ({
  EtText: ({ children, style }: { children: React.ReactNode; style?: unknown }) => {
    const RN = require('react-native');
    const ReactLib = require('react');
    return ReactLib.createElement(RN.Text, { style }, children);
  },
}));

describe('EtTextToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders correctly with Option subcomponents', () => {
      const { getByText } = render(
        <EtTextToggle selectedId="option1" onSelectionChange={jest.fn()}>
          <EtTextToggle.Option id="option1" label="Option 1" />
          <EtTextToggle.Option id="option2" label="Option 2" />
          <EtTextToggle.Option id="option3" label="Option 3" />
        </EtTextToggle>,
      );

      expect(getByText('Option 1')).toBeTruthy();
      expect(getByText('Option 2')).toBeTruthy();
      expect(getByText('Option 3')).toBeTruthy();
    });

    it('renders with testID', () => {
      const { getByTestId } = render(
        <EtTextToggle selectedId="option1" onSelectionChange={jest.fn()} testID="my-toggle">
          <EtTextToggle.Option id="option1" label="Option 1" />
          <EtTextToggle.Option id="option2" label="Option 2" />
        </EtTextToggle>,
      );

      expect(getByTestId('my-toggle')).toBeTruthy();
    });

    it('renders options with testID', () => {
      const { getByTestId } = render(
        <EtTextToggle selectedId="option1" onSelectionChange={jest.fn()}>
          <EtTextToggle.Option id="option1" label="Option 1" testID="custom-option" />
          <EtTextToggle.Option id="option2" label="Option 2" />
        </EtTextToggle>,
      );

      expect(getByTestId('custom-option')).toBeTruthy();
      expect(getByTestId('toggle-option-option2')).toBeTruthy();
    });
  });

  describe('Selection Behavior', () => {
    it('calls onSelectionChange when an option is pressed', () => {
      const onSelectionChange = jest.fn();

      const { getByText } = render(
        <EtTextToggle selectedId="option1" onSelectionChange={onSelectionChange}>
          <EtTextToggle.Option id="option1" label="Option 1" />
          <EtTextToggle.Option id="option2" label="Option 2" />
        </EtTextToggle>,
      );

      fireEvent.press(getByText('Option 2'));

      expect(onSelectionChange).toHaveBeenCalledWith('option2');
    });

    it('does not call onSelectionChange when the selected option is pressed', () => {
      const onSelectionChange = jest.fn();

      const { getByText } = render(
        <EtTextToggle selectedId="option1" onSelectionChange={onSelectionChange}>
          <EtTextToggle.Option id="option1" label="Option 1" />
          <EtTextToggle.Option id="option2" label="Option 2" />
        </EtTextToggle>,
      );

      fireEvent.press(getByText('Option 1')); // Already selected

      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('does not call onSelectionChange when toggle is disabled', () => {
      const onSelectionChange = jest.fn();

      const { getByText } = render(
        <EtTextToggle selectedId="option1" onSelectionChange={onSelectionChange} disabled>
          <EtTextToggle.Option id="option1" label="Option 1" />
          <EtTextToggle.Option id="option2" label="Option 2" />
        </EtTextToggle>,
      );

      fireEvent.press(getByText('Option 2'));

      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('does not call onSelectionChange when individual option is disabled', () => {
      const onSelectionChange = jest.fn();

      const { getByText } = render(
        <EtTextToggle selectedId="option1" onSelectionChange={onSelectionChange}>
          <EtTextToggle.Option id="option1" label="Option 1" />
          <EtTextToggle.Option id="option2" label="Option 2" disabled />
        </EtTextToggle>,
      );

      fireEvent.press(getByText('Option 2'));

      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe('Compound Component Assembly', () => {
    it('has Option subcomponent', () => {
      expect(EtTextToggle.Option).toBeDefined();
    });
  });

  describe('Display Names', () => {
    it('has correct display name for root component', () => {
      expect(EtTextToggle.displayName).toBe('EtTextToggle');
    });

    it('has correct display name for Option', () => {
      expect(EtTextToggle.Option.displayName).toBe('EtTextToggle.Option');
    });
  });

  describe('Props', () => {
    it('renders with fullWidth prop', () => {
      const { getByTestId } = render(
        <EtTextToggle selectedId="option1" onSelectionChange={jest.fn()} testID="full-width-toggle">
          <EtTextToggle.Option id="option1" label="Option 1" />
          <EtTextToggle.Option id="option2" label="Option 2" />
        </EtTextToggle>,
      );

      const toggle = getByTestId('full-width-toggle');
      expect(toggle).toBeTruthy();
    });

    it('renders with small size', () => {
      const { getByTestId } = render(
        <EtTextToggle selectedId="option1" onSelectionChange={jest.fn()} size="small" testID="small-toggle">
          <EtTextToggle.Option id="option1" label="Option 1" />
          <EtTextToggle.Option id="option2" label="Option 2" />
        </EtTextToggle>,
      );

      expect(getByTestId('small-toggle')).toBeTruthy();
    });
  });
});
