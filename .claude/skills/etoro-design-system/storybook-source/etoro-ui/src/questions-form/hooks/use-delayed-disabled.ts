import { useEffect, useState } from 'react';

/**
 * Defers a CTA's transition to `disabled` so a transient invalid edit doesn't
 * flicker the button. Enabling is reflected immediately, so a valid form stays
 * actionable without delay.
 *
 * Mirrors the KYC screen behaviour (`useDelayedDisabled` in
 * `@etoro/features/onboarding/kyc/rn/hooks`); kept local so `etoro-ui` has no
 * feature dependency.
 */
export const DEFAULT_DISABLED_DELAY_MS = 700;

/**
 * @param disabled - The immediate disabled state (e.g. `!isValid`).
 * @param delayMs - How long to defer the transition to `disabled`.
 * @returns The debounced disabled value.
 */
export function useDelayedDisabled(disabled: boolean, delayMs = DEFAULT_DISABLED_DELAY_MS): boolean {
  const [delayedDisabled, setDelayedDisabled] = useState(disabled);

  useEffect(() => {
    // Enabling is reflected without delay.
    if (!disabled) {
      setDelayedDisabled(false);
      return;
    }
    const timer = setTimeout(() => setDelayedDisabled(true), delayMs);
    return () => clearTimeout(timer);
  }, [disabled, delayMs]);

  return delayedDisabled;
}
