import { IconName } from '../api/types';
import { getIconMetadata, isValidIconSize } from '../utils';

interface UseIconAccessibilityProps {
  iconName: IconName;
  size?: number;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  isInteractive?: boolean;
}

/**
 * Custom hook for icon accessibility and validation
 * @param props Icon accessibility props
 * @returns Accessibility attributes and validation info
 */
export function useIconAccessibility({ iconName, size, accessibilityLabel, accessibilityRole, isInteractive = false }: UseIconAccessibilityProps) {
  const metadata = getIconMetadata(iconName);

  // Generate appropriate accessibility label if not provided
  const getAccessibilityLabel = (): string | undefined => {
    if (accessibilityLabel) return accessibilityLabel;

    // Don't add labels for decorative icons
    if (!isInteractive && !accessibilityRole) return undefined;

    // Generate label from icon name and metadata
    if (metadata) {
      const keywords = metadata.keywords.join(', ');
      return `${metadata.name} icon - ${keywords}`;
    }

    return `${iconName} icon`;
  };

  // Determine accessibility role
  const getAccessibilityRole = (): string => {
    if (accessibilityRole) return accessibilityRole;

    if (isInteractive) return 'button';

    return 'image';
  };

  // Validate icon properties
  const getValidationWarnings = (): string[] => {
    const warnings: string[] = [];

    if (!metadata) {
      warnings.push(`Icon "${iconName}" not found in registry`);
    }

    if (size && !isValidIconSize(size)) {
      warnings.push(`Icon size ${size} is outside recommended range (8-256px)`);
    }

    if (isInteractive && !accessibilityLabel && !accessibilityRole) {
      warnings.push('Interactive icon should have accessibility label or role');
    }

    return warnings;
  };

  // Check if icon exists and is valid
  const isValid = !!metadata;
  const warnings = getValidationWarnings();
  const computedAccessibilityLabel = getAccessibilityLabel();
  const computedAccessibilityRole = getAccessibilityRole();

  return {
    accessibilityLabel: computedAccessibilityLabel,
    accessibilityRole: computedAccessibilityRole,
    isValid,
    warnings,
    metadata,
    // Accessibility props ready for component
    accessibilityProps: {
      accessibilityLabel: computedAccessibilityLabel,
      accessibilityRole: computedAccessibilityRole,
      accessible: !!computedAccessibilityLabel || isInteractive,
    },
  };
}
