import { EtButton } from '../../../../components/button/et-button';
import { ButtonIcon } from '../../../../components/button/subcomponents/button-icon';
import { ButtonLabel } from '../../../../components/button/subcomponents/button-label';
import type { EtButtonProps } from '../../../../components/button/utils/types';
import { useWizardContext } from '../context';

export type WizardButtonProps = EtButtonProps;

/**
 * EtWizard.Button - Pre-configured CTA button for wizard footers.
 *
 * Thin compositional wrapper around EtButton with wizard defaults
 * (large, stretch, primary-filled). Compose content using
 * EtWizard.Button.Label and EtWizard.Button.Icon subcomponents.
 *
 * Defaults `onPress` to `goToNext` from wizard context when not provided.
 *
 * @example
 * ```tsx
 * <EtWizard.Footer>
 *   <EtWizard.Button>
 *     <EtWizard.Button.Icon name="star" />
 *     <EtWizard.Button.Label>Next</EtWizard.Button.Label>
 *   </EtWizard.Button>
 * </EtWizard.Footer>
 * ```
 *
 * @example String shorthand (no icon)
 * ```tsx
 * <EtWizard.Button>Next</EtWizard.Button>
 * ```
 */
export function WizardButtonBase({ variant = 'primary-filled', size = 'large', stretch = true, onPress, children, ...rest }: WizardButtonProps) {
  const { goToNext } = useWizardContext();
  return (
    <EtButton variant={variant} size={size} stretch={stretch} onPress={onPress ?? goToNext} {...rest}>
      {children}
    </EtButton>
  );
}

WizardButtonBase.displayName = 'EtWizard.Button';

export const WizardButton = Object.assign(WizardButtonBase, {
  Label: ButtonLabel,
  Icon: ButtonIcon,
});
