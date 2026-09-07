import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { EtTextCopyButton } from './et-text-copy-button';

const mockClipboardCopy = jest.fn(() => Promise.resolve(true));

jest.mock('etoro-ui/core/styles', () => ({
  X3: 8,
  X4: 12,
}));

jest.mock('etoro-ui/core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      indicatorPositive: '#33C728',
      textPrimaryNeutral: '#262626',
    },
  })),
}));

jest.mock('@etoro/common/di/react', () => ({
  useEtInject: () => ({
    copy: mockClipboardCopy,
  }),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#000000',
      text: '#000000',
    },
  }),
}));

describe('EtTextCopyButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClipboardCopy.mockResolvedValue(true);
  });

  it('renders with compound components', () => {
    const { getByText } = render(
      <EtTextCopyButton textToCopy="123456789">
        <EtTextCopyButton.Icon />
        <EtTextCopyButton.Text>123456789</EtTextCopyButton.Text>
      </EtTextCopyButton>,
    );

    expect(getByText('123456789')).toBeTruthy();
  });

  it('renders with string shorthand', () => {
    const { getByText } = render(<EtTextCopyButton textToCopy="Tal Ben Simon">Tal Ben Simon</EtTextCopyButton>);

    expect(getByText('Tal Ben Simon')).toBeTruthy();
  });

  it('calls ClipboardService.copy with text on press when onCopy is not provided', async () => {
    const { getByRole } = render(<EtTextCopyButton textToCopy="123456789">123456789</EtTextCopyButton>);

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockClipboardCopy).toHaveBeenCalledWith('123456789');
    });
  });

  it('calls onCopy with text on press when onCopy is provided (no implicit clipboard)', async () => {
    const onCopy = jest.fn(() => Promise.resolve(true));
    const afterCopy = jest.fn();
    const { getByRole } = render(
      <EtTextCopyButton textToCopy="123456789" onCopy={onCopy} afterCopy={afterCopy}>
        123456789
      </EtTextCopyButton>,
    );

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(onCopy).toHaveBeenCalledWith('123456789');
      expect(mockClipboardCopy).not.toHaveBeenCalled();
      expect(afterCopy).toHaveBeenCalledTimes(1);
    });
  });

  it('does not trigger haptics or set isCopied when onCopy returns false', async () => {
    const onCopy = jest.fn(() => Promise.resolve(false));
    const { getByRole } = render(
      <EtTextCopyButton textToCopy="123456789" onCopy={onCopy}>
        123456789
      </EtTextCopyButton>,
    );

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(onCopy).toHaveBeenCalledWith('123456789');
    });

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(getByRole('button', { selected: false })).toBeTruthy();
  });

  it('calls onError when onCopy rejects', async () => {
    const onError = jest.fn();
    const onCopy = jest.fn(() => Promise.reject(new Error('Clipboard access denied')));
    const { getByRole } = render(
      <EtTextCopyButton textToCopy="123456789" onCopy={onCopy} onError={onError}>
        123456789
      </EtTextCopyButton>,
    );

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Clipboard access denied');
    });
  });

  it('calls onError when onCopy returns false', async () => {
    const onError = jest.fn();
    const onCopy = jest.fn(() => Promise.resolve(false));
    const { getByRole } = render(
      <EtTextCopyButton textToCopy="123456789" onCopy={onCopy} onError={onError}>
        123456789
      </EtTextCopyButton>,
    );

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Failed to copy text');
    });
  });

  it('triggers haptic feedback when copy succeeds', async () => {
    const { getByRole } = render(<EtTextCopyButton textToCopy="123456789">123456789</EtTextCopyButton>);

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });
  });

  it('disables haptics when haptics prop is false', async () => {
    const { getByRole } = render(
      <EtTextCopyButton textToCopy="123456789" haptics={false}>
        123456789
      </EtTextCopyButton>,
    );

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockClipboardCopy).toHaveBeenCalled();
    });

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('does not trigger haptics or set isCopied when ClipboardService.copy rejects', async () => {
    mockClipboardCopy.mockRejectedValueOnce(new Error('Clipboard access denied'));

    const { getByRole } = render(<EtTextCopyButton textToCopy="123456789">123456789</EtTextCopyButton>);

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockClipboardCopy).toHaveBeenCalledWith('123456789');
    });

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(getByRole('button', { selected: false })).toBeTruthy();
  });

  it('calls onError when ClipboardService.copy rejects', async () => {
    const onError = jest.fn();
    mockClipboardCopy.mockRejectedValueOnce(new Error('Clipboard access denied'));

    const { getByRole } = render(
      <EtTextCopyButton textToCopy="123456789" onError={onError}>
        123456789
      </EtTextCopyButton>,
    );

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Clipboard access denied');
    });
  });

  it('calls afterCopy when copy succeeds', async () => {
    const afterCopy = jest.fn();

    const { getByRole } = render(
      <EtTextCopyButton textToCopy="123456789" afterCopy={afterCopy}>
        123456789
      </EtTextCopyButton>,
    );

    fireEvent.press(getByRole('button'));

    await waitFor(() => {
      expect(mockClipboardCopy).toHaveBeenCalledWith('123456789');
      expect(afterCopy).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call afterCopy when copy fails (rejects)', async () => {
    const afterCopy = jest.fn();
    mockClipboardCopy.mockRejectedValueOnce(new Error('Failed'));

    const { getByRole } = render(
      <EtTextCopyButton textToCopy="123456789" afterCopy={afterCopy}>
        123456789
      </EtTextCopyButton>,
    );

    fireEvent.press(getByRole('button'));

    await waitFor(() => {
      expect(mockClipboardCopy).toHaveBeenCalledWith('123456789');
    });
    expect(afterCopy).not.toHaveBeenCalled();
  });

  it('does not call afterCopy when ClipboardService.copy returns false', async () => {
    const afterCopy = jest.fn();
    const onError = jest.fn();
    mockClipboardCopy.mockResolvedValueOnce(false);

    const { getByRole } = render(
      <EtTextCopyButton textToCopy="123456789" afterCopy={afterCopy} onError={onError}>
        123456789
      </EtTextCopyButton>,
    );

    fireEvent.press(getByRole('button'));

    await waitFor(() => {
      expect(mockClipboardCopy).toHaveBeenCalledWith('123456789');
      expect(onError).toHaveBeenCalledWith('Failed to copy text');
    });
    expect(afterCopy).not.toHaveBeenCalled();
  });

  it('shows checkmark icon when copy succeeds', async () => {
    const { getByRole } = render(
      <EtTextCopyButton textToCopy="123456789">
        <EtTextCopyButton.Icon />
        <EtTextCopyButton.Text>123456789</EtTextCopyButton.Text>
      </EtTextCopyButton>,
    );

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockClipboardCopy).toHaveBeenCalled();
    });

    expect(getByRole('button', { selected: true })).toBeTruthy();
  });

  it('uses custom testID', () => {
    const { getByTestId } = render(
      <EtTextCopyButton textToCopy="123456789" testID="copy-button">
        123456789
      </EtTextCopyButton>,
    );

    expect(getByTestId('copy-button')).toBeTruthy();
  });

  it('uses custom accessibility label', () => {
    const { getByLabelText } = render(
      <EtTextCopyButton textToCopy="123456789" accessibilityLabel="Copy account number">
        123456789
      </EtTextCopyButton>,
    );

    expect(getByLabelText('Copy account number')).toBeTruthy();
  });

  it('respects custom successDuration', async () => {
    jest.useFakeTimers();
    const { getByRole } = render(
      <EtTextCopyButton textToCopy="123456789" successDuration={500}>
        123456789
      </EtTextCopyButton>,
    );

    const button = getByRole('button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(getByRole('button', { selected: true })).toBeTruthy();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(getByRole('button', { selected: false })).toBeTruthy();
    });

    jest.useRealTimers();
  });
});
