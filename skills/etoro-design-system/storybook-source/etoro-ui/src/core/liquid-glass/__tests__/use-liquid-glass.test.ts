import { renderHook } from '@testing-library/react-native';
import { Platform } from 'react-native';

import { registerGlassEffect, resetGlassEffect } from '../glass-effect-registry';
import { useLiquidGlass } from '../use-liquid-glass';

const mockIsLiquidGlassAvailable = jest.fn(() => true);
const mockIsGlassEffectAPIAvailable = jest.fn(() => true);

const mockGlassModule = {
  GlassView: jest.fn(),
  isLiquidGlassAvailable: mockIsLiquidGlassAvailable,
  isGlassEffectAPIAvailable: mockIsGlassEffectAPIAvailable,
};

describe('useLiquidGlass', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { value: originalOS, writable: true });
    jest.clearAllMocks();
    resetGlassEffect();
  });

  describe('on iOS', () => {
    beforeEach(() => {
      Object.defineProperty(Platform, 'OS', { value: 'ios', writable: true });
      registerGlassEffect(mockGlassModule);
    });

    it('returns supportsLiquidGlass: true when both checks pass', () => {
      mockIsLiquidGlassAvailable.mockReturnValue(true);
      mockIsGlassEffectAPIAvailable.mockReturnValue(true);

      const { result } = renderHook(() => useLiquidGlass());
      expect(result.current.supportsLiquidGlass).toBe(true);
    });

    it('returns supportsLiquidGlass: false when isLiquidGlassAvailable returns false', () => {
      mockIsLiquidGlassAvailable.mockReturnValue(false);
      mockIsGlassEffectAPIAvailable.mockReturnValue(true);

      const { result } = renderHook(() => useLiquidGlass());
      expect(result.current.supportsLiquidGlass).toBe(false);
    });

    it('returns supportsLiquidGlass: false when isGlassEffectAPIAvailable returns false', () => {
      mockIsLiquidGlassAvailable.mockReturnValue(true);
      mockIsGlassEffectAPIAvailable.mockReturnValue(false);

      const { result } = renderHook(() => useLiquidGlass());
      expect(result.current.supportsLiquidGlass).toBe(false);
    });
  });

  describe('on Android', () => {
    beforeEach(() => {
      Object.defineProperty(Platform, 'OS', { value: 'android', writable: true });
      registerGlassEffect(mockGlassModule);
    });

    it('returns supportsLiquidGlass: false without calling native module', () => {
      const { result } = renderHook(() => useLiquidGlass());

      expect(result.current.supportsLiquidGlass).toBe(false);
      expect(mockIsLiquidGlassAvailable).not.toHaveBeenCalled();
      expect(mockIsGlassEffectAPIAvailable).not.toHaveBeenCalled();
    });
  });

  describe('without registration', () => {
    beforeEach(() => {
      Object.defineProperty(Platform, 'OS', { value: 'ios', writable: true });
    });

    it('returns supportsLiquidGlass: false when module is not registered', () => {
      const { result } = renderHook(() => useLiquidGlass());
      expect(result.current.supportsLiquidGlass).toBe(false);
    });
  });
});
