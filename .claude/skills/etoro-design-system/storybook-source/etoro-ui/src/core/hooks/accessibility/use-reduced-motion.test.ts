import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { useReducedMotionState } from './use-reduced-motion';

describe('useReducedMotionState', () => {
  beforeEach(() => {
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as never);
  });

  it('fails closed when the initial reduced-motion query rejects', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockRejectedValue(new Error('native unavailable'));

    const { result } = renderHook(() => useReducedMotionState());

    await waitFor(() => {
      expect(result.current.hasResolved).toBe(true);
    });

    expect(result.current.isReducedMotionEnabled).toBe(true);
  });
});
