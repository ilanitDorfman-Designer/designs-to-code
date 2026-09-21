import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import { EtButton } from '../button/et-button';
import { EtFabMenu } from './et-fab-menu';

// The RN jest preset resolves the native no-op split — force the web dismiss
// stack so the ESC behaviour is actually under test.
jest.mock('../../core/web/use-dismissable', () => jest.requireActual('../../core/web/use-dismissable.web'));

jest.mock('../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 1, Medium: 2, Heavy: 3 },
}));

describe('EtFabMenu', () => {
  it('renders trigger and actions when provided', () => {
    render(
      <EtFabMenu>
        <EtFabMenu.Trigger />
        <EtFabMenu.Actions>
          <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
        </EtFabMenu.Actions>
      </EtFabMenu>,
    );

    expect(screen.getByTestId('et-fab-menu-trigger')).toBeTruthy();
  });

  it('expands menu when trigger is pressed', () => {
    render(
      <EtFabMenu>
        <EtFabMenu.Trigger />
        <EtFabMenu.Actions>
          <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
        </EtFabMenu.Actions>
      </EtFabMenu>,
    );

    const trigger = screen.getByTestId('et-fab-menu-trigger');
    fireEvent.press(trigger);

    expect(screen.getByTestId('et-fab-menu-actions')).toBeTruthy();
    expect(screen.getByText('Action 01')).toBeTruthy();
  });

  it('closes menu when action is pressed', () => {
    const onPress = jest.fn();

    render(
      <EtFabMenu>
        <EtFabMenu.Trigger />
        <EtFabMenu.Actions>
          <EtFabMenu.Button iconName="star" label="Action 01" onPress={onPress} />
        </EtFabMenu.Actions>
      </EtFabMenu>,
    );

    fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
    expect(screen.getByTestId('et-fab-menu-actions')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: /Action 01/i }));
    expect(onPress).toHaveBeenCalled();
    expect(screen.queryByTestId('et-fab-menu-actions')).toBeNull();
  });

  it('toggles menu when trigger is pressed twice', () => {
    render(
      <EtFabMenu closeOnOutsidePress={false}>
        <EtFabMenu.Trigger />
        <EtFabMenu.Actions>
          <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
        </EtFabMenu.Actions>
      </EtFabMenu>,
    );

    const trigger = screen.getByTestId('et-fab-menu-trigger');

    fireEvent.press(trigger);
    expect(screen.getByTestId('et-fab-menu-actions')).toBeTruthy();

    fireEvent.press(trigger);
    expect(screen.queryByTestId('et-fab-menu-actions')).toBeNull();
  });

  it('closes menu when overlay is pressed (closeOnOutsidePress)', () => {
    render(
      <EtFabMenu closeOnOutsidePress>
        <EtFabMenu.Trigger />
        <EtFabMenu.Actions>
          <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
        </EtFabMenu.Actions>
      </EtFabMenu>,
    );

    fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
    expect(screen.getByTestId('et-fab-menu-actions')).toBeTruthy();

    fireEvent.press(screen.getByTestId('et-fab-menu-overlay'));
    expect(screen.queryByTestId('et-fab-menu-actions')).toBeNull();
  });

  describe('closeOnOutsidePress behavior', () => {
    it('shows overlay when menu is open and closeOnOutsidePress is true', () => {
      render(
        <EtFabMenu closeOnOutsidePress>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      expect(screen.getByTestId('et-fab-menu-overlay')).toBeTruthy();
    });

    it('does not show overlay when closeOnOutsidePress is false', () => {
      render(
        <EtFabMenu closeOnOutsidePress={false}>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      expect(screen.queryByTestId('et-fab-menu-overlay')).toBeNull();
    });
  });

  describe('contentInset', () => {
    it('renders and opens menu with contentInset', () => {
      render(
        <EtFabMenu closeOnOutsidePress contentInset={{ bottom: 100, right: 16 }}>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      expect(screen.getByTestId('et-fab-menu-overlay')).toBeTruthy();
      expect(screen.getByTestId('et-fab-menu-actions')).toBeTruthy();
    });
  });

  describe('actions layout', () => {
    it('renders actions in vertical stack when menu is open', () => {
      render(
        <EtFabMenu>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      expect(screen.getByTestId('et-fab-menu-actions')).toBeTruthy();
    });
  });

  describe('disabled button', () => {
    it('does not call onPress when action button is disabled', () => {
      const onPress = jest.fn();

      render(
        <EtFabMenu closeOnOutsidePress={false}>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={onPress} disabled />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      fireEvent.press(screen.getByRole('button', { name: /Action 01/i }));

      expect(onPress).not.toHaveBeenCalled();
    });

    it('does not close menu when disabled action is pressed', () => {
      render(
        <EtFabMenu closeOnOutsidePress={false}>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} disabled />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      fireEvent.press(screen.getByRole('button', { name: /Action 01/i }));

      expect(screen.getByTestId('et-fab-menu-actions')).toBeTruthy();
    });
  });

  describe('custom trigger', () => {
    it('renders with EtButton as custom trigger', () => {
      render(
        <EtFabMenu closeOnOutsidePress={false}>
          <EtFabMenu.Trigger>
            <EtButton>
              <EtButton.Icon name="plus" />
            </EtButton>
          </EtFabMenu.Trigger>
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.press(trigger);

      expect(screen.getByTestId('et-fab-menu-actions')).toBeTruthy();
    });

    it('renders with render prop pattern for trigger', () => {
      render(
        <EtFabMenu closeOnOutsidePress={false}>
          <EtFabMenu.Trigger>
            {(isOpen) => (
              <EtButton>
                <EtButton.Icon name={isOpen ? 'close' : 'plus'} />
              </EtButton>
            )}
          </EtFabMenu.Trigger>
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeTruthy();

      fireEvent.press(trigger);
      expect(screen.getByTestId('et-fab-menu-actions')).toBeTruthy();
    });
  });

  describe('ESC key (web)', () => {
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();
    let keydownHandler: ((e: { key: string }) => void) | undefined;

    beforeEach(() => {
      jest.clearAllMocks();
      keydownHandler = undefined;
      mockAddEventListener.mockImplementation((type: string, handler: (e: { key: string }) => void) => {
        if (type === 'keydown') keydownHandler = handler;
      });
      Object.defineProperty(globalThis, 'document', {
        value: {
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
        },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      delete (globalThis as { document?: unknown }).document;
    });

    it('registers keydown listener when menu is open on web', () => {
      render(
        <EtFabMenu closeOnOutsidePress={false}>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('closes menu when Escape key is pressed on web', async () => {
      render(
        <EtFabMenu closeOnOutsidePress={false}>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      expect(screen.getByTestId('et-fab-menu-actions')).toBeTruthy();

      await act(() => {
        keydownHandler?.({ key: 'Escape' });
      });

      await waitFor(() => {
        expect(screen.queryByTestId('et-fab-menu-actions')).toBeNull();
      });
    });
  });

  describe('accessibility', () => {
    it('trigger has button role and correct label when closed', () => {
      render(
        <EtFabMenu>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      const trigger = screen.getByRole('button', { name: /open menu/i });
      expect(trigger).toBeTruthy();
    });

    it('trigger has expanded state when menu is open', () => {
      render(
        <EtFabMenu closeOnOutsidePress={false}>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      const trigger = screen.getByRole('button', { name: /close menu/i });
      expect(trigger).toBeTruthy();
      expect(trigger.props.accessibilityState).toEqual(expect.objectContaining({ expanded: true }));
    });

    it('overlay is present and accessible when open', () => {
      render(
        <EtFabMenu closeOnOutsidePress>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      const overlay = screen.getByTestId('et-fab-menu-overlay');
      expect(overlay).toBeTruthy();
      expect(overlay.props.accessibilityRole).toBe('button');
      expect(overlay.props.accessibilityLabel).toBeTruthy();
    });

    it('action button has correct accessibility label', () => {
      render(
        <EtFabMenu closeOnOutsidePress={false}>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} accessibilityLabel="Custom action label" />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      expect(screen.getByRole('button', { name: /custom action label/i })).toBeTruthy();
    });

    it('disabled action has disabled accessibility state', () => {
      render(
        <EtFabMenu closeOnOutsidePress={false}>
          <EtFabMenu.Trigger />
          <EtFabMenu.Actions>
            <EtFabMenu.Button iconName="star" label="Action 01" onPress={jest.fn()} disabled />
          </EtFabMenu.Actions>
        </EtFabMenu>,
      );

      fireEvent.press(screen.getByTestId('et-fab-menu-trigger'));
      const actionButton = screen.getByRole('button', { name: /Action 01/i });
      expect(actionButton.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    });
  });
});
