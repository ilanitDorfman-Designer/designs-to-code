import { fireEvent, render, screen } from '@testing-library/react-native';

import { EtButtonGroup } from './et-button-group';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: 'light',
  },
}));

// Mock useEtoroTheme
jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      bgButtonGroupNormal: '#F2F2F2',
      bgButtonGroupPressed: '#66666625',
      textPrimaryNeutral: '#000000',
    },
  }),
}));

// Mock EtoroIcon
jest.mock('etoro-ui/foundations/icon-assets/et-icon', () => ({
  EtoroIcon: ({ icon }: { icon: { iconName: string }; appearance: { size: number; color: string } }) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={`etoro-icon-${icon.iconName}`}>
        <Text>{icon.iconName}</Text>
      </View>
    );
  },
}));

// Add cancelAnimation to the existing Reanimated mock
const reanimatedModule = jest.requireMock('react-native-reanimated');
if (reanimatedModule && !reanimatedModule.cancelAnimation) {
  reanimatedModule.cancelAnimation = jest.fn();
}

describe('EtButtonGroup', () => {
  describe('rendering', () => {
    it('renders with two items', () => {
      render(
        <EtButtonGroup testID="button-group">
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} testID="item-1" />
          <EtButtonGroup.Item iconName="expand" onPress={() => {}} testID="item-2" />
        </EtButtonGroup>,
      );

      expect(screen.getByTestId('button-group')).toBeTruthy();
      expect(screen.getByTestId('item-1')).toBeTruthy();
      expect(screen.getByTestId('item-2')).toBeTruthy();
    });

    it('renders with a single item', () => {
      render(
        <EtButtonGroup testID="button-group">
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} testID="single-item" />
        </EtButtonGroup>,
      );

      expect(screen.getByTestId('button-group')).toBeTruthy();
      expect(screen.getByTestId('single-item')).toBeTruthy();
    });
  });

  describe('press handling', () => {
    it('calls onPress when item is pressed', () => {
      const onPress = jest.fn();

      render(
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={onPress} testID="pressable-item" />
        </EtButtonGroup>,
      );

      fireEvent.press(screen.getByTestId('pressable-item'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();

      render(
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={onPress} disabled testID="disabled-item" />
        </EtButtonGroup>,
      );

      fireEvent.press(screen.getByTestId('disabled-item'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('handles multiple items with different press handlers', () => {
      const onPress1 = jest.fn();
      const onPress2 = jest.fn();

      render(
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={onPress1} testID="item-1" />
          <EtButtonGroup.Item iconName="expand" onPress={onPress2} testID="item-2" />
        </EtButtonGroup>,
      );

      fireEvent.press(screen.getByTestId('item-1'));
      expect(onPress1).toHaveBeenCalledTimes(1);
      expect(onPress2).not.toHaveBeenCalled();

      fireEvent.press(screen.getByTestId('item-2'));
      expect(onPress2).toHaveBeenCalledTimes(1);
    });
  });

  describe('haptic feedback', () => {
    it('triggers haptic feedback on press', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      render(
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} testID="haptic-item" />
        </EtButtonGroup>,
      );

      fireEvent.press(screen.getByTestId('haptic-item'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('does not trigger haptic feedback when disabled', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      render(
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} disabled testID="disabled-haptic-item" />
        </EtButtonGroup>,
      );

      fireEvent.press(screen.getByTestId('disabled-haptic-item'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has correct accessibility role', () => {
      render(
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} testID="accessible-item" accessibilityLabel="Price alert" />
        </EtButtonGroup>,
      );

      const item = screen.getByTestId('accessible-item');
      expect(item.props.accessibilityRole).toBe('button');
      expect(item.props.accessibilityLabel).toBe('Price alert');
    });

    it('has correct accessibility state when disabled', () => {
      render(
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} disabled testID="disabled-accessible-item" />
        </EtButtonGroup>,
      );

      const item = screen.getByTestId('disabled-accessible-item');
      expect(item.props.accessibilityState).toEqual({ disabled: true });
    });

    it('has correct accessibility state when enabled', () => {
      render(
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} testID="enabled-accessible-item" />
        </EtButtonGroup>,
      );

      const item = screen.getByTestId('enabled-accessible-item');
      expect(item.props.accessibilityState).toEqual({ disabled: false });
    });
  });

  describe('validation', () => {
    it('throws error for invalid children', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        const { View, Text } = require('react-native');
        render(
          <EtButtonGroup>
            <View>
              <Text>Invalid child</Text>
            </View>
          </EtButtonGroup>,
        );
      }).toThrow('EtButtonGroup: Invalid child passed. Only <EtButtonGroup.Item> components are valid children.');

      consoleError.mockRestore();
    });
  });
});
