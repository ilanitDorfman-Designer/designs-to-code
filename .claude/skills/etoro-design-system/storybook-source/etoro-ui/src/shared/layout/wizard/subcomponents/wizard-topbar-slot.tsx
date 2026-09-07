import type { ReactNode } from 'react';

export interface WizardTopbarSlotProps {
  children?: ReactNode;
}

/**
 * EtWizard.TopbarStart - Content rendered in the topbar's start (left) slot.
 * Typically used for a back button.
 */
export function WizardTopbarStart({ children }: WizardTopbarSlotProps) {
  return <>{children}</>;
}

WizardTopbarStart.displayName = 'EtWizard.TopbarStart';

/**
 * EtWizard.TopbarMiddle - Content rendered in the topbar's middle (center) slot.
 * Typically used for a title.
 */
export function WizardTopbarMiddle({ children }: WizardTopbarSlotProps) {
  return <>{children}</>;
}

WizardTopbarMiddle.displayName = 'EtWizard.TopbarMiddle';

/**
 * EtWizard.TopbarEnd - Content rendered in the topbar's end (right) slot.
 * Typically used for a close button or contextual actions.
 */
export function WizardTopbarEnd({ children }: WizardTopbarSlotProps) {
  return <>{children}</>;
}

WizardTopbarEnd.displayName = 'EtWizard.TopbarEnd';
