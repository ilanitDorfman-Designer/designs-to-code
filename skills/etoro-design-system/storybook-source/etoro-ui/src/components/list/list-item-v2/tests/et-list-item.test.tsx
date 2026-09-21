import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleProp, ViewStyle } from 'react-native';
import { Text } from 'react-native';

import { EtListItem } from '../et-list-item';

/**
 * Flattens a style prop (which may be an array or a single object) into a plain object.
 */
function flattenStyle(style: StyleProp<ViewStyle>): Record<string, unknown> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.filter(Boolean));
  }
  return (style as Record<string, unknown>) ?? {};
}

// Mock useEtoroTheme hook
jest.mock('../../../../core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

describe('EtListItem V2', () => {
  // ========== Rendering ==========

  describe('Rendering', () => {
    it('renders with Start slot only', () => {
      render(
        <EtListItem testID="list-item">
          <EtListItem.Start testID="start">
            <Text>Start content</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      expect(screen.getByTestId('list-item')).toBeTruthy();
      expect(screen.getByTestId('start')).toBeTruthy();
      expect(screen.getByText('Start content')).toBeTruthy();
    });

    it('renders with Start and End slots', () => {
      render(
        <EtListItem testID="list-item">
          <EtListItem.Start testID="start">
            <Text>Start</Text>
          </EtListItem.Start>
          <EtListItem.End testID="end">
            <Text>End</Text>
          </EtListItem.End>
        </EtListItem>,
      );

      expect(screen.getByTestId('start')).toBeTruthy();
      expect(screen.getByTestId('end')).toBeTruthy();
      expect(screen.getByText('Start')).toBeTruthy();
      expect(screen.getByText('End')).toBeTruthy();
    });

    it('renders with Start, Middle, and End slots', () => {
      render(
        <EtListItem testID="list-item">
          <EtListItem.Start testID="start">
            <Text>Start</Text>
          </EtListItem.Start>
          <EtListItem.Middle testID="middle">
            <Text>Middle</Text>
          </EtListItem.Middle>
          <EtListItem.End testID="end">
            <Text>End</Text>
          </EtListItem.End>
        </EtListItem>,
      );

      expect(screen.getByTestId('start')).toBeTruthy();
      expect(screen.getByTestId('middle')).toBeTruthy();
      expect(screen.getByTestId('end')).toBeTruthy();
    });
  });

  // ========== Layout Modes ==========

  describe('Layout modes', () => {
    it('start-only: Start slot gets flex: 1', () => {
      render(
        <EtListItem>
          <EtListItem.Start testID="start">
            <Text>Start</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      const startSlot = screen.getByTestId('start');
      const flatStyle = flattenStyle(startSlot.props.style);
      expect(flatStyle.flex).toBe(1);
    });

    it('start-end: End slot gets flexShrink: 0 (content-sized)', () => {
      render(
        <EtListItem>
          <EtListItem.Start testID="start">
            <Text>Start</Text>
          </EtListItem.Start>
          <EtListItem.End testID="end">
            <Text>End</Text>
          </EtListItem.End>
        </EtListItem>,
      );

      const endSlot = screen.getByTestId('end');
      const flatStyle = flattenStyle(endSlot.props.style);
      expect(flatStyle.flexShrink).toBe(0);
    });

    it('start-middle-end: all slots get flex: 1 (equal width)', () => {
      render(
        <EtListItem>
          <EtListItem.Start testID="start">
            <Text>Start</Text>
          </EtListItem.Start>
          <EtListItem.Middle testID="middle">
            <Text>Middle</Text>
          </EtListItem.Middle>
          <EtListItem.End testID="end">
            <Text>End</Text>
          </EtListItem.End>
        </EtListItem>,
      );

      const startSlot = screen.getByTestId('start');
      const middleSlot = screen.getByTestId('middle');
      const endSlot = screen.getByTestId('end');

      const flatStart = flattenStyle(startSlot.props.style);
      const flatMiddle = flattenStyle(middleSlot.props.style);
      const flatEnd = flattenStyle(endSlot.props.style);

      expect(flatStart.flex).toBe(1);
      expect(flatMiddle.flex).toBe(1);
      expect(flatEnd.flex).toBe(1);
    });
  });

  // ========== Slot Alignment ==========

  describe('Slot alignment defaults', () => {
    it('Start slot uses flex-start alignment by default', () => {
      render(
        <EtListItem>
          <EtListItem.Start testID="start">
            <Text>Start</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      const startSlot = screen.getByTestId('start');
      const flatStyle = flattenStyle(startSlot.props.style);
      expect(flatStyle.alignItems).toBe('flex-start');
    });

    it('Middle slot defaults to center alignment', () => {
      render(
        <EtListItem>
          <EtListItem.Start>
            <Text>Start</Text>
          </EtListItem.Start>
          <EtListItem.Middle testID="middle">
            <Text>Middle</Text>
          </EtListItem.Middle>
          <EtListItem.End>
            <Text>End</Text>
          </EtListItem.End>
        </EtListItem>,
      );

      const middleSlot = screen.getByTestId('middle');
      const flatStyle = flattenStyle(middleSlot.props.style);
      expect(flatStyle.alignItems).toBe('center');
    });

    it('End slot defaults to flex-end alignment', () => {
      render(
        <EtListItem>
          <EtListItem.Start>
            <Text>Start</Text>
          </EtListItem.Start>
          <EtListItem.End testID="end">
            <Text>End</Text>
          </EtListItem.End>
        </EtListItem>,
      );

      const endSlot = screen.getByTestId('end');
      const flatStyle = flattenStyle(endSlot.props.style);
      expect(flatStyle.alignItems).toBe('flex-end');
    });
  });

  // ========== Divider ==========

  describe('Divider', () => {
    it('renders divider when EtListItem.Divider is included', () => {
      const { toJSON } = render(
        <EtListItem testID="list-item">
          <EtListItem.Start>
            <Text>Start</Text>
          </EtListItem.Start>
          <EtListItem.Divider testID="divider" />
        </EtListItem>,
      );

      expect(screen.getByTestId('divider')).toBeTruthy();
      const tree = toJSON();
      expect(tree).toBeTruthy();
    });

    it('does not render divider when EtListItem.Divider is omitted', () => {
      const { toJSON } = render(
        <EtListItem testID="list-item">
          <EtListItem.Start>
            <Text>Start</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      expect(screen.queryByTestId('divider')).toBeNull();
      const tree = toJSON();
      expect(tree).toBeTruthy();
    });

    it('uses paddingTop only when divider is present', () => {
      render(
        <EtListItem testID="list-item">
          <EtListItem.Start>
            <Text>Start</Text>
          </EtListItem.Start>
          <EtListItem.Divider />
        </EtListItem>,
      );

      const listItem = screen.getByTestId('list-item');
      const flatStyle = flattenStyle(listItem.props.style);
      // With divider: paddingTop only (no paddingVertical)
      expect(flatStyle.paddingTop).toBe(16);
      expect(flatStyle.paddingVertical).toBeUndefined();
    });
  });

  // ========== Skeleton ==========

  describe('Skeleton states', () => {
    it('renders 1-line skeleton as compound child', () => {
      const { toJSON } = render(
        <EtListItem testID="list-item">
          <EtListItem.Skeleton variant="1-line" />
        </EtListItem>,
      );

      expect(screen.getByTestId('list-item')).toBeTruthy();
      expect(toJSON()).toBeTruthy();
    });

    it('renders 2-lines skeleton as compound child', () => {
      const { toJSON } = render(
        <EtListItem testID="list-item">
          <EtListItem.Skeleton variant="2-lines" />
        </EtListItem>,
      );

      expect(screen.getByTestId('list-item')).toBeTruthy();
      expect(toJSON()).toBeTruthy();
    });

    it('renders asset-1-line skeleton as compound child', () => {
      const { toJSON } = render(
        <EtListItem testID="list-item">
          <EtListItem.Skeleton variant="asset-1-line" />
        </EtListItem>,
      );

      expect(screen.getByTestId('list-item')).toBeTruthy();
      expect(toJSON()).toBeTruthy();
    });

    it('renders asset-2-lines skeleton as compound child', () => {
      const { toJSON } = render(
        <EtListItem testID="list-item">
          <EtListItem.Skeleton variant="asset-2-lines" />
        </EtListItem>,
      );

      expect(screen.getByTestId('list-item')).toBeTruthy();
      expect(toJSON()).toBeTruthy();
    });

    it('inherits small size from parent EtListItem', () => {
      render(
        <EtListItem size="small" testID="list-item">
          <EtListItem.Skeleton variant="1-line" />
        </EtListItem>,
      );

      const skeleton = screen.getByTestId('list-item');
      const flatStyle = flattenStyle(skeleton.props.style);
      expect(flatStyle.paddingVertical).toBe(12);
    });

    it('inherits large size from parent EtListItem by default', () => {
      render(
        <EtListItem testID="list-item">
          <EtListItem.Skeleton variant="1-line" />
        </EtListItem>,
      );

      const skeleton = screen.getByTestId('list-item');
      const flatStyle = flattenStyle(skeleton.props.style);
      expect(flatStyle.paddingVertical).toBe(16);
    });

    it('skeleton size prop overrides parent size', () => {
      render(
        <EtListItem size="large" testID="list-item">
          <EtListItem.Skeleton variant="1-line" size="small" />
        </EtListItem>,
      );

      const skeleton = screen.getByTestId('list-item');
      const flatStyle = flattenStyle(skeleton.props.style);
      expect(flatStyle.paddingVertical).toBe(12);
    });
  });

  // ========== Size ==========

  describe('Size', () => {
    it('defaults to large size', () => {
      render(
        <EtListItem testID="list-item">
          <EtListItem.Start>
            <Text>Start</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      const listItem = screen.getByTestId('list-item');
      const flatStyle = flattenStyle(listItem.props.style);
      // Large size: paddingVertical = X4 = 16
      expect(flatStyle.paddingVertical).toBe(16);
    });

    it('applies small size padding', () => {
      render(
        <EtListItem size="small" testID="list-item">
          <EtListItem.Start>
            <Text>Start</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      const listItem = screen.getByTestId('list-item');
      const flatStyle = flattenStyle(listItem.props.style);
      // Small size: paddingVertical matches large (always X4 = 16)
      expect(flatStyle.paddingVertical).toBe(16);
    });
  });

  // ========== Context Error ==========

  describe('Disabled', () => {
    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      render(
        <EtListItem testID="list-item" onPress={onPress} disabled>
          <EtListItem.Start>
            <Text>Row</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      fireEvent.press(screen.getByTestId('list-item'));

      expect(onPress).not.toHaveBeenCalled();
    });

    it('calls onPress when not disabled', () => {
      const onPress = jest.fn();
      render(
        <EtListItem testID="list-item" onPress={onPress}>
          <EtListItem.Start>
            <Text>Row</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      fireEvent.press(screen.getByTestId('list-item'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('calls onLongPress on long press, alongside onPress for taps', () => {
      const onPress = jest.fn();
      const onLongPress = jest.fn();
      render(
        <EtListItem testID="list-item" onPress={onPress} onLongPress={onLongPress}>
          <EtListItem.Start>
            <Text>Row</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      fireEvent(screen.getByTestId('list-item'), 'longPress');

      expect(onLongPress).toHaveBeenCalledTimes(1);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('renders as a pressable when only onLongPress is provided', () => {
      const onLongPress = jest.fn();
      render(
        <EtListItem testID="list-item" onLongPress={onLongPress}>
          <EtListItem.Start>
            <Text>Row</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      fireEvent(screen.getByTestId('list-item'), 'longPress');

      expect(onLongPress).toHaveBeenCalledTimes(1);
    });

    it('dims the row and exposes accessibilityState when disabled', () => {
      render(
        <EtListItem testID="list-item" disabled>
          <EtListItem.Start>
            <Text>Row</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      const item = screen.getByTestId('list-item');
      expect(flattenStyle(item.props.style).opacity).toBe(0.5);
      expect(item.props.accessibilityState).toEqual({ disabled: true });
    });

    it('merges caller accessibility state while preserving disabled', () => {
      render(
        <EtListItem testID="list-item" disabled accessibilityState={{ selected: true, disabled: false }}>
          <EtListItem.Start>
            <Text>Selected row</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      expect(screen.getByTestId('list-item').props.accessibilityState).toEqual({
        selected: true,
        disabled: true,
      });
    });

    it('does not dim the row when not disabled', () => {
      render(
        <EtListItem testID="list-item">
          <EtListItem.Start>
            <Text>Row</Text>
          </EtListItem.Start>
        </EtListItem>,
      );

      expect(flattenStyle(screen.getByTestId('list-item').props.style).opacity).toBeUndefined();
    });
  });

  describe('Context validation', () => {
    it('throws error when slot is used outside EtListItem', () => {
      // Suppress console.error for expected error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(
          <EtListItem.Start>
            <Text>Orphan slot</Text>
          </EtListItem.Start>,
        );
      }).toThrow('EtListItem slot components (Start, Middle, End) must be used within an EtListItem component');

      consoleSpy.mockRestore();
    });
  });
});
