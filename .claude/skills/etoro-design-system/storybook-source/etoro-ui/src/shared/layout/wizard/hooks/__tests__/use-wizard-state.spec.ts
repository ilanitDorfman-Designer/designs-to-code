import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useWizardState } from '../use-wizard-state';

describe('useWizardState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialisation', () => {
    it('starts at initialStep when within bounds', () => {
      const { result } = renderHook(() => useWizardState({ totalSteps: 5, initialStep: 2 }));

      expect(result.current.currentStep).toBe(2);
    });

    it('clamps initialStep that exceeds totalSteps', () => {
      const { result } = renderHook(() => useWizardState({ totalSteps: 3, initialStep: 10 }));

      expect(result.current.currentStep).toBe(2);
    });

    it('clamps negative initialStep to 0', () => {
      const { result } = renderHook(() => useWizardState({ totalSteps: 3, initialStep: -5 }));

      expect(result.current.currentStep).toBe(0);
    });
  });

  describe('goToNext', () => {
    it('advances to the next step', () => {
      const onStepChange = jest.fn();
      const { result } = renderHook(() => useWizardState({ totalSteps: 3, initialStep: 0, onStepChange }));

      act(() => result.current.goToNext());

      expect(result.current.currentStep).toBe(1);
      expect(onStepChange).toHaveBeenCalledWith(1);
    });

    it('calls onComplete instead of advancing past the last step', () => {
      const onComplete = jest.fn();
      const onStepChange = jest.fn();
      const { result } = renderHook(() => useWizardState({ totalSteps: 2, initialStep: 1, onStepChange, onComplete }));

      act(() => result.current.goToNext());

      expect(result.current.currentStep).toBe(1);
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onStepChange).not.toHaveBeenCalled();
    });

    it('calls onComplete only once even if goToNext is invoked multiple times on the last step', () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() => useWizardState({ totalSteps: 1, initialStep: 0, onComplete }));

      act(() => result.current.goToNext());
      act(() => result.current.goToNext());
      act(() => result.current.goToNext());

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('allows goToNext again after going back from the completed state', () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() => useWizardState({ totalSteps: 2, initialStep: 1, onComplete }));

      act(() => result.current.goToNext());
      expect(onComplete).toHaveBeenCalledTimes(1);

      act(() => result.current.goToPrevious());
      expect(result.current.currentStep).toBe(0);

      act(() => result.current.goToNext());
      expect(result.current.currentStep).toBe(1);

      act(() => result.current.goToNext());
      expect(onComplete).toHaveBeenCalledTimes(2);
    });
  });

  describe('goToPrevious', () => {
    it('moves to the previous step', () => {
      const onStepChange = jest.fn();
      const { result } = renderHook(() => useWizardState({ totalSteps: 3, initialStep: 2, onStepChange }));

      act(() => result.current.goToPrevious());

      expect(result.current.currentStep).toBe(1);
      expect(onStepChange).toHaveBeenCalledWith(1);
    });

    it('does not go below step 0', () => {
      const onStepChange = jest.fn();
      const { result } = renderHook(() => useWizardState({ totalSteps: 3, initialStep: 0, onStepChange }));

      act(() => result.current.goToPrevious());

      expect(result.current.currentStep).toBe(0);
      expect(onStepChange).not.toHaveBeenCalled();
    });
  });

  describe('totalSteps change (clamp effect)', () => {
    it('clamps currentStep when totalSteps shrinks below it', () => {
      const onStepChange = jest.fn();
      const { result, rerender } = renderHook(({ totalSteps }) => useWizardState({ totalSteps, initialStep: 4, onStepChange }), {
        initialProps: { totalSteps: 5 },
      });

      expect(result.current.currentStep).toBe(4);

      rerender({ totalSteps: 3 });

      expect(result.current.currentStep).toBe(2);
      expect(onStepChange).toHaveBeenCalledWith(2);
    });

    it('resets completed state when totalSteps expands past the current step', () => {
      const onStepChange = jest.fn();
      const onComplete = jest.fn();
      const { result, rerender } = renderHook(({ totalSteps }) => useWizardState({ totalSteps, initialStep: 1, onStepChange, onComplete }), {
        initialProps: { totalSteps: 2 },
      });

      expect(result.current.currentStep).toBe(1);

      act(() => result.current.goToNext());
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(result.current.currentStep).toBe(1);

      rerender({ totalSteps: 5 });

      act(() => result.current.goToNext());
      expect(result.current.currentStep).toBe(2);
      expect(onStepChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Callback ref stability', () => {
    it('picks up a new onStepChange without re-creating goToNext', () => {
      const first = jest.fn();
      const second = jest.fn();
      const { result, rerender } = renderHook(({ cb }) => useWizardState({ totalSteps: 3, initialStep: 0, onStepChange: cb }), {
        initialProps: { cb: first },
      });

      const goToNextBefore = result.current.goToNext;
      rerender({ cb: second });
      const goToNextAfter = result.current.goToNext;

      expect(goToNextBefore).toBe(goToNextAfter);

      act(() => result.current.goToNext());

      expect(second).toHaveBeenCalledWith(1);
      expect(first).not.toHaveBeenCalled();
    });
  });
});
