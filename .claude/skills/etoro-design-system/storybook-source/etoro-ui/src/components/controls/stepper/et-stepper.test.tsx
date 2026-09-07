import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { EtStepper } from './et-stepper';

jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: { Light: 'Light' },
  impactAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#111',
      textTertiaryNeutral: '#555',
      actionDisabledText: '#aaa',
      dividerPrimary: '#000',
      dividerTertiary: '#ccc',
      dividerQuinary: '#eee',
      bgNeutralSecondary: '#f5f5f5',
    },
  }),
}));

jest.mock('etoro-ui/foundations/icon-assets', () => ({
  EtoroIcon: ({ icon }: { icon: { iconName: string } }) => icon.iconName,
}));

describe('EtStepper', () => {
  it('renders value text', () => {
    const { getByText } = render(<EtStepper value={3} onChange={jest.fn()} />);

    expect(getByText('3')).toBeTruthy();
  });

  it('calls onChange when incrementing', () => {
    const onChange = jest.fn();
    const { getAllByRole } = render(<EtStepper value={1} onChange={onChange} min={0} max={5} />);

    const buttons = getAllByRole('button');
    fireEvent.press(buttons[1]); // plus

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onChange when decrementing', () => {
    const onChange = jest.fn();
    const { getAllByRole } = render(<EtStepper value={2} onChange={onChange} min={0} max={5} />);

    const buttons = getAllByRole('button');
    fireEvent.press(buttons[0]); // minus

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('does not exceed max or min', () => {
    const onChange = jest.fn();
    const { rerender, getAllByRole } = render(<EtStepper value={5} onChange={onChange} min={0} max={5} />);
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[1]); // at max, plus should not fire
    expect(onChange).not.toHaveBeenCalled();

    rerender(<EtStepper value={0} onChange={onChange} min={0} max={5} />);
    fireEvent.press(getAllByRole('button')[0]); // at min, minus should not fire
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not respond when disabled', () => {
    const onChange = jest.fn();
    const { getAllByRole } = render(<EtStepper value={1} onChange={onChange} disabled />);

    const buttons = getAllByRole('button');
    fireEvent.press(buttons[0]);
    fireEvent.press(buttons[1]);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders xs size without crashing', () => {
    const { getAllByRole, getByText } = render(<EtStepper value={9} onChange={jest.fn()} size="xs" />);

    expect(getAllByRole('button')).toHaveLength(2);
    expect(getByText('9')).toBeTruthy();
  });

  it('triggers haptics when enabled', () => {
    const Haptics = require('expo-haptics');
    const onChange = jest.fn();
    const { getAllByRole } = render(<EtStepper value={1} onChange={onChange} min={0} max={5} haptics />);
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[1]); // plus
    expect(Haptics.impactAsync).toHaveBeenCalled();
  });

  it('skips haptics when disabled via prop', () => {
    const Haptics = require('expo-haptics');
    Haptics.impactAsync.mockClear();
    const onChange = jest.fn();
    const { getAllByRole } = render(<EtStepper value={1} onChange={onChange} min={0} max={5} haptics={false} />);
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[1]); // plus
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
});
