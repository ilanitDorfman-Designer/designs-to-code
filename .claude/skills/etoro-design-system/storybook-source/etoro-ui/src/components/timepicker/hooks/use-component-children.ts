import React, { ReactNode, useMemo } from 'react';

interface ComponentChildren {
  labelChild: ReactNode | undefined;
  inputRowChildren: ReactNode[];
  hasClockIcon: boolean;
  hasCompactFieldDisplay: boolean;
}

const ALLOWED_DISPLAY_NAMES = new Set([
  'EtTimepicker.Label',
  'EtTimepicker.ClockIcon',
  'EtTimepicker.CompactFieldDisplay',
  'EtTimepicker.Field',
  'EtTimepicker.InputFieldContainer',
  'EtTimepicker.TimepickerAndroid',
  'EtTimepicker.TimepickerModalIOS',
]);

function hasDisplayName(child: ReactNode, displayName: string): boolean {
  return React.isValidElement(child) && (child.type as { displayName?: string }).displayName === displayName;
}

function getDisplayName(child: ReactNode): string | undefined {
  if (React.isValidElement(child)) {
    return (child.type as { displayName?: string }).displayName;
  }
  return undefined;
}

/**
 * Separates Timepicker children into label and input row components
 * using displayName for identification.
 * Validates compound children and supports string shorthand for labels.
 */
export function useComponentChildren(children: ReactNode | null = null): ComponentChildren {
  return useMemo(() => {
    const childrenArray = React.Children.toArray(children);

    let labelChild: ReactNode | undefined;
    const inputRowChildren: ReactNode[] = [];
    let clockIconChild: ReactNode | undefined;
    let compactFieldDisplayChild: ReactNode | undefined;

    for (const child of childrenArray) {
      // Skip raw string children
      if (typeof child === 'string') {
        continue;
      }

      // Skip non-element children (e.g., numbers, booleans)
      if (!React.isValidElement(child)) {
        continue;
      }

      if (hasDisplayName(child, 'EtTimepicker.Label')) {
        labelChild = child;
        continue;
      }

      if (hasDisplayName(child, 'EtTimepicker.ClockIcon')) {
        clockIconChild = child;
      }

      if (hasDisplayName(child, 'EtTimepicker.CompactFieldDisplay')) {
        compactFieldDisplayChild = child;
      }

      // Validate that the child has an allowed displayName
      const displayName = getDisplayName(child);
      if (!ALLOWED_DISPLAY_NAMES.has(displayName || '')) {
        if (__DEV__) {
          console.warn(
            `[EtTimepicker] Unexpected child with displayName "${displayName || 'unknown'}". ` +
              `Only EtTimepicker compound components (${Array.from(ALLOWED_DISPLAY_NAMES).join(', ')}) are allowed.`,
          );
        }
        continue;
      }

      inputRowChildren.push(child);
    }

    return {
      labelChild,
      inputRowChildren,
      hasClockIcon: !!clockIconChild,
      hasCompactFieldDisplay: !!compactFieldDisplayChild,
    };
  }, [children]);
}
