import type { ReactElement } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { WizardButtonProps } from '../subcomponents/wizard-button';
import type { WizardIconProps } from '../subcomponents/wizard-icon';
import type { WizardStepProps } from '../subcomponents/wizard-step';
import type { WizardSubtitleProps } from '../subcomponents/wizard-subtitle';
import type { WizardTitleProps } from '../subcomponents/wizard-title';
import type { WizardTopbarSlotProps } from '../subcomponents/wizard-topbar-slot';

type WizardChildElement =
  | ReactElement<WizardStepProps>
  | ReactElement<WizardTopbarSlotProps>
  | ReactElement<WizardTitleProps>
  | ReactElement<WizardSubtitleProps>
  | ReactElement<WizardIconProps>
  | ReactElement<WizardButtonProps>;

/** Valid compound children for EtWizard */
export type WizardChildren = WizardChildElement | Array<WizardChildElement | null | undefined | boolean>;

export interface EtWizardProps {
  children: WizardChildren;

  /** Duration in ms for each segment's auto-fill animation. Default: 5000 */
  stepDuration?: number;
  /** Enable auto-progress animation. Default: false */
  autoPlay?: boolean;
  /** Enable left/right tap zones for step navigation and press-to-pause. Default: false */
  tapGestures?: boolean;
  /** Initial step index (0-based). Default: 0 */
  initialStep?: number;
  /** Called when the active step changes */
  onStepChange?: (step: number) => void;
  /** Called when all steps are completed (last segment finishes or user advances past the last step) */
  onComplete?: () => void;

  /** Override step progress bar fill color (defaults to theme-based) */
  progressColor?: string;

  /** Accessibility label for the left (previous) tap zone */
  accessibilityLabelLeft?: string;
  /** Accessibility label for the right (next) tap zone */
  accessibilityLabelRight?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface WizardContextValue {
  currentStep: number;
  totalSteps: number;
  goToNext: () => void;
  goToPrevious: () => void;
}
