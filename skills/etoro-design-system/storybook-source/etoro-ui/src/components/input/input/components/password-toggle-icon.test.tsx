import { fireEvent, render } from '@testing-library/react-native';
import { Platform } from 'react-native';

import { PasswordToggleIcon } from './password-toggle-icon';

// Mock EtoroIcon component
jest.mock('../../../../foundations/icon-assets/et-icon', () => ({
  EtoroIcon: ({ icon, appearance, ...props }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="etoro-icon" {...props}>
        <Text>{`${icon.iconName}-${appearance.size}`}</Text>
      </View>
    );
  },
}));

const defaultProps = {
  isPasswordVisible: false,
  onPress: jest.fn(),
};

describe('PasswordToggleIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} />);

    expect(getByTestId('password-toggle-icon')).toBeTruthy();
    expect(getByTestId('etoro-icon')).toBeTruthy();
  });

  it('renders eyeOff icon when password is hidden (isPasswordVisible: false)', () => {
    const { getByText } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={false} />);

    expect(getByText('eyeOff-20')).toBeTruthy();
  });

  it('renders eye icon when password is visible (isPasswordVisible: true)', () => {
    const { getByText } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={true} />);

    expect(getByText('eye-20')).toBeTruthy();
  });

  it('calls onPress callback when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} onPress={mockOnPress} />);

    fireEvent.press(getByTestId('password-toggle-icon'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility properties when password is hidden', () => {
    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={false} />);

    const button = getByTestId('password-toggle-icon');
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityLabel).toBe('Show password');
    expect(button.props.accessibilityHint).toBe('Toggles password visibility');
  });

  it('has correct accessibility properties when password is visible', () => {
    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={true} />);

    const button = getByTestId('password-toggle-icon');
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityLabel).toBe('Hide password');
    expect(button.props.accessibilityHint).toBe('Toggles password visibility');
  });

  it('applies correct iOS positioning styles', () => {
    const originalOS = Platform.OS;
    (Platform as any).OS = 'ios';

    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} />);

    const button = getByTestId('password-toggle-icon');
    expect(button.props.style).toEqual({
      position: 'absolute',
      end: 8,
    });

    (Platform as any).OS = originalOS;
  });

  it('applies correct Android positioning styles', () => {
    const originalOS = Platform.OS;
    (Platform as any).OS = 'android';

    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} />);

    const button = getByTestId('password-toggle-icon');
    expect(button.props.style).toEqual({
      position: 'absolute',
      end: 8,
    });

    (Platform as any).OS = originalOS;
  });

  it('passes correct props to EtoroIcon for hidden password', () => {
    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={false} />);

    const icon = getByTestId('etoro-icon');
    expect(icon).toBeTruthy();

    // Verify the icon content shows the correct icon name and size
    const { getByText } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={false} />);
    expect(getByText('eyeOff-20')).toBeTruthy();
  });

  it('passes correct props to EtoroIcon for visible password', () => {
    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={true} />);

    const icon = getByTestId('etoro-icon');
    expect(icon).toBeTruthy();

    // Verify the icon content shows the correct icon name and size
    const { getByText } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={true} />);
    expect(getByText('eye-20')).toBeTruthy();
  });

  it('toggles between icons correctly when isPasswordVisible changes', () => {
    const { getByText, rerender } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={false} />);

    // Initially shows eyeOff (masked)
    expect(getByText('eyeOff-20')).toBeTruthy();

    // Re-render with password visible
    rerender(<PasswordToggleIcon {...defaultProps} isPasswordVisible={true} />);

    // Now shows eye
    expect(getByText('eye-20')).toBeTruthy();
  });

  it('maintains consistent icon size regardless of visibility state', () => {
    const { getByText: getByTextHidden } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={false} />);
    const { getByText: getByTextVisible } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={true} />);

    const hiddenIconText = getByTextHidden('eyeOff-20');
    const visibleIconText = getByTextVisible('eye-20');

    expect(hiddenIconText).toBeTruthy();
    expect(visibleIconText).toBeTruthy();

    // Both should have size 20
    expect(hiddenIconText.children[0]).toContain('20');
    expect(visibleIconText.children[0]).toContain('20');
  });

  it('uses RTL-aware positioning with end property', () => {
    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} />);

    const button = getByTestId('password-toggle-icon');
    const style = button.props.style;

    // Should use 'end' property for RTL support, not 'right'
    expect(style.end).toBe(8);
    expect(style.right).toBeUndefined();
  });

  it('handles multiple rapid press events', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} onPress={mockOnPress} />);

    const button = getByTestId('password-toggle-icon');

    // Simulate rapid presses
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(3);
  });

  it('component structure is correct', () => {
    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} />);

    const button = getByTestId('password-toggle-icon');
    const icon = getByTestId('etoro-icon');

    expect(button).toBeTruthy();
    expect(icon).toBeTruthy();

    // Verify the icon is inside the button by checking children
    expect(button.props.children).toBeTruthy();
  });

  it('handles edge case: undefined onPress', () => {
    // This test ensures the component handles the case where onPress might be undefined
    // Although TypeScript interface requires it, runtime safety is important
    const { getByTestId } = render(<PasswordToggleIcon isPasswordVisible={false} onPress={undefined as any} />);

    const button = getByTestId('password-toggle-icon');

    // Should not throw when pressing
    expect(() => {
      fireEvent.press(button);
    }).not.toThrow();
  });

  it('applies absolute positioning correctly', () => {
    const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} />);

    const button = getByTestId('password-toggle-icon');

    expect(button.props.style.position).toBe('absolute');
  });

  it('maintains correct positioning across different platforms', () => {
    const platforms = ['ios', 'android', 'web'] as const;
    const originalOS = Platform.OS;

    platforms.forEach((platform) => {
      (Platform as any).OS = platform;
      const { getByTestId } = render(<PasswordToggleIcon {...defaultProps} />);

      const button = getByTestId('password-toggle-icon');

      expect(button.props.style.end).toBe(8);
      expect(button.props.style.position).toBe('absolute');
    });

    (Platform as any).OS = originalOS;
  });

  it('accessibility label changes correctly with visibility state', () => {
    const { getByTestId, rerender } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={false} />);

    let button = getByTestId('password-toggle-icon');
    expect(button.props.accessibilityLabel).toBe('Show password');

    rerender(<PasswordToggleIcon {...defaultProps} isPasswordVisible={true} />);

    button = getByTestId('password-toggle-icon');
    expect(button.props.accessibilityLabel).toBe('Hide password');
  });

  it('has consistent accessibility hint regardless of state', () => {
    const { getByTestId: getByTestIdHidden } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={false} />);
    const { getByTestId: getByTestIdVisible } = render(<PasswordToggleIcon {...defaultProps} isPasswordVisible={true} />);

    const buttonHidden = getByTestIdHidden('password-toggle-icon');
    const buttonVisible = getByTestIdVisible('password-toggle-icon');

    expect(buttonHidden.props.accessibilityHint).toBe('Toggles password visibility');
    expect(buttonVisible.props.accessibilityHint).toBe('Toggles password visibility');
  });
});
