import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @param totalSteps Must be >= 1. Determines the upper bound for navigation.
 * @param initialStep Should satisfy 0 <= initialStep < totalSteps. Out-of-range values
 *   are clamped rather than rejected, so callers are responsible for providing valid bounds.
 * @param onStepChange Optional callback invoked with the new step index after navigation.
 *   Identity changes do not cause re-renders (stored in a ref internally).
 * @param onComplete Optional callback invoked when `goToNext` is called on the last step.
 *   Identity changes do not cause re-renders (stored in a ref internally).
 */
interface UseWizardStateParams {
  totalSteps: number;
  initialStep: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
}

function clampStep(step: number, totalSteps: number): number {
  return Math.max(0, Math.min(step, totalSteps - 1));
}

/**
 * Manages wizard step state and navigation.
 *
 * Upstream contract (not validated at runtime):
 * - `totalSteps >= 1`
 * - `0 <= initialStep < totalSteps` (out-of-range values are clamped)
 * - `onStepChange` / `onComplete` need not be memoised by the caller
 */
export function useWizardState({ totalSteps, initialStep, onStepChange, onComplete }: UseWizardStateParams) {
  const [currentStep, setCurrentStep] = useState(() => clampStep(initialStep, totalSteps));
  const currentStepRef = useRef(clampStep(initialStep, totalSteps));

  const onStepChangeRef = useRef(onStepChange);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  useEffect(() => {
    onStepChangeRef.current = onStepChange;
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const clamped = clampStep(currentStepRef.current, totalSteps);
    if (clamped !== currentStepRef.current) {
      currentStepRef.current = clamped;
      setCurrentStep(clamped);
      onStepChangeRef.current?.(clamped);
    }
    if (completedRef.current && currentStepRef.current < totalSteps - 1) {
      completedRef.current = false;
    }
  }, [totalSteps]);

  const goToNext = useCallback(() => {
    if (completedRef.current || totalSteps === 0) return;
    if (currentStepRef.current >= totalSteps - 1) {
      completedRef.current = true;
      onCompleteRef.current?.();
      return;
    }
    const next = currentStepRef.current + 1;
    currentStepRef.current = next;
    setCurrentStep(next);
    onStepChangeRef.current?.(next);
  }, [totalSteps]);

  const goToPrevious = useCallback(() => {
    if (currentStepRef.current <= 0) return;
    completedRef.current = false;
    const next = currentStepRef.current - 1;
    currentStepRef.current = next;
    setCurrentStep(next);
    onStepChangeRef.current?.(next);
  }, []);

  return { currentStep, goToNext, goToPrevious };
}
