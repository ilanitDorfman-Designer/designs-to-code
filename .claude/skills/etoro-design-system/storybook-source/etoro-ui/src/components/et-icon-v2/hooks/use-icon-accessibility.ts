import { useMemo } from 'react';
import { AccessibilityRole } from 'react-native';

interface UseIconAccessibilityProps {
  /** Icon name for generating default label */
  name: string;
  /** Custom accessibility label */
  accessibilityLabel?: string;
  /** Custom accessibility role */
  accessibilityRole?: AccessibilityRole;
  /** Press handler - if provided, icon is interactive */
  onPress?: () => void;
  /** Explicit accessible value */
  accessible?: boolean;
}

interface IconAccessibilityResult {
  accessibilityLabel: string | undefined;
  accessibilityRole: AccessibilityRole;
  accessible: boolean;
}

/**
 * Converts icon name to readable text
 * e.g., "settingsGear" -> "settings gear", "arrow-left" -> "arrow left"
 */
function formatIconName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Hook for icon accessibility props
 * Handles label generation, role determination, and accessible state
 */
export function useIconAccessibility({
  name,
  accessibilityLabel,
  accessibilityRole,
  onPress,
  accessible,
}: UseIconAccessibilityProps): IconAccessibilityResult {
  return useMemo(() => {
    const isInteractive = !!onPress;

    // Determine label (only auto-generate for interactive icons)
    const label = accessibilityLabel ?? (isInteractive ? `${formatIconName(name)} icon` : undefined);

    // Determine role
    const role: AccessibilityRole = accessibilityRole ?? (isInteractive ? 'button' : 'image');

    // Determine if accessible
    const isAccessible = accessible ?? (!!label || isInteractive);

    return {
      accessibilityLabel: label,
      accessibilityRole: role,
      accessible: isAccessible,
    };
  }, [name, accessibilityLabel, accessibilityRole, onPress, accessible]);
}
