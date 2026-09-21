import { act, renderHook } from '@testing-library/react-native';

import { useInputState } from './use-input-state';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
}));

describe('useInputState', () => {
  it('GIVEN no initialPasswordVisible WHEN mounted THEN starts with isPasswordVisible=false', () => {
    const { result } = renderHook(() => useInputState({ haptics: false }));

    expect(result.current.isPasswordVisible).toBe(false);
  });

  it('GIVEN initialPasswordVisible=true WHEN mounted THEN starts with isPasswordVisible=true', () => {
    const { result } = renderHook(() => useInputState({ haptics: false, initialPasswordVisible: true }));

    expect(result.current.isPasswordVisible).toBe(true);
  });

  it('GIVEN initialPasswordVisible=true WHEN toggling THEN flips to false', () => {
    const { result } = renderHook(() => useInputState({ haptics: false, initialPasswordVisible: true }));

    act(() => {
      result.current.handlePasswordVisibility();
    });

    expect(result.current.isPasswordVisible).toBe(false);
  });

  it('GIVEN initialPasswordVisible=false WHEN toggling THEN flips to true', () => {
    const { result } = renderHook(() => useInputState({ haptics: false, initialPasswordVisible: false }));

    act(() => {
      result.current.handlePasswordVisibility();
    });

    expect(result.current.isPasswordVisible).toBe(true);
  });
});
