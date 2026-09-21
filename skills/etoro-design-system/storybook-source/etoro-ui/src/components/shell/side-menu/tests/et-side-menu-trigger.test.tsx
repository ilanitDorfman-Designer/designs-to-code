import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TRIGGER_SIZE } from '../constants';
import { EtSideMenuTrigger } from '../et-side-menu-trigger';
import { flat, glyphIconName, glyphTransform } from './side-menu-test-helpers';

jest.mock('../../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

jest.mock('../../../../core/hooks/accessibility/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}));

let mockDirection: 'ltr' | 'rtl' = 'ltr';
jest.mock('../../../../core/hooks/use-layout-direction', () => ({
  useLayoutDirection: () => mockDirection,
}));

describe('EtSideMenuTrigger', () => {
  beforeEach(() => {
    mockDirection = 'ltr';
  });

  it('renders without any side-menu provider (context-free)', () => {
    render(<EtSideMenuTrigger onPress={jest.fn()} testID="trigger" />);
    expect(screen.getByTestId('trigger')).toBeTruthy();
  });

  it('is a 44px button with the default "Open menu" accessibility label', () => {
    render(<EtSideMenuTrigger onPress={jest.fn()} testID="trigger" />);
    const trigger = screen.getByTestId('trigger');
    const style = flat(trigger.props.style);
    expect(style.width).toBe(TRIGGER_SIZE);
    expect(style.height).toBe(TRIGGER_SIZE);
    expect(trigger.props.accessibilityRole).toBe('button');
    expect(trigger.props.accessibilityLabel).toBe('Open menu');
  });

  it('accepts a custom accessibility label', () => {
    render(<EtSideMenuTrigger accessibilityLabel="Show navigation" onPress={jest.fn()} />);
    expect(screen.getByLabelText('Show navigation')).toBeTruthy();
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    render(<EtSideMenuTrigger onPress={onPress} testID="trigger" />);
    fireEvent.press(screen.getByTestId('trigger'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('LTR: uses the expand-pointing DS glyph, unrotated', () => {
    render(<EtSideMenuTrigger onPress={jest.fn()} testID="trigger" />);
    expect(glyphIconName(screen.getByTestId('trigger'))).toBe('collapse-fill-right');
    expect(glyphTransform(screen.getByTestId('trigger'))).toEqual([{ scaleX: 1 }]);
  });

  it('RTL: same glyph, mirrored via scaleX(-1)', () => {
    mockDirection = 'rtl';
    render(<EtSideMenuTrigger onPress={jest.fn()} testID="trigger" />);
    expect(glyphIconName(screen.getByTestId('trigger'))).toBe('collapse-fill-right');
    expect(glyphTransform(screen.getByTestId('trigger'))).toEqual([{ scaleX: -1 }]);
  });

  it('is memoized with the correct displayName', () => {
    expect((EtSideMenuTrigger as { $$typeof?: symbol }).$$typeof).toBe(Symbol.for('react.memo'));
    expect(EtSideMenuTrigger.displayName).toBe('EtSideMenuTrigger');
  });
});
