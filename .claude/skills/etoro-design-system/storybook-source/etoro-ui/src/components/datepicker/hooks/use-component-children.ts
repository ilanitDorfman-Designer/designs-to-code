import React, { ReactNode, useMemo } from 'react';

import { InputFieldLabel } from '../subcomponents/input-field-label';

export function hasDisplayName(child: ReactNode, displayName: string): boolean {
  return React.isValidElement(child) && (child.type as { displayName?: string }).displayName === displayName;
}

function getDisplayName(child: ReactNode): string | undefined {
  if (React.isValidElement(child)) {
    return (child.type as { displayName?: string }).displayName;
  }
  return undefined;
}

const ALLOWED_DISPLAY_NAMES = new Set(['EtDatepicker.Label', 'EtDatepicker.Field', 'EtDatepicker.CalendarIcon', 'EtDatepicker.CompactFieldDisplay']);

/**
 * Separates Datepicker children into label and input row components
 * using displayName for identification.
 *
 * Supports string shorthand: a bare string/number child is treated as
 * `<EtDatepicker.Label>{text}</EtDatepicker.Label>`.
 *
 * Validates compound children and warns when an unknown displayName
 * is encountered.
 */
interface ComponentChildren {
  labelChild: ReactNode | undefined;
  inputRowChildren: ReactNode[];
  hasCompactFieldDisplay: boolean;
}

export function useComponentChildren(children: ReactNode): ComponentChildren {
  return useMemo(() => {
    const childrenArray = React.Children.toArray(children);

    // ── Separate string/number children from React element children ───
    const stringChildren: string[] = [];
    const elementChildren: ReactNode[] = [];

    for (const child of childrenArray) {
      if (typeof child === 'string' || typeof child === 'number') {
        stringChildren.push(String(child));
      } else {
        elementChildren.push(child);
      }
    }

    // ── Validate compound children displayNames ──────────────────────
    for (const child of elementChildren) {
      const displayName = getDisplayName(child);
      if (__DEV__ && displayName && !ALLOWED_DISPLAY_NAMES.has(displayName)) {
        console.error(
          `[EtDatepicker] Unknown child component with displayName "${displayName}". ` +
            `Allowed children: ${Array.from(ALLOWED_DISPLAY_NAMES).join(', ')}.`,
        );
      }
    }

    // ── Resolve label child ──────────────────────────────────────────
    // Explicit <EtDatepicker.Label> takes precedence over string shorthand
    const explicitLabel = elementChildren.find((child) => hasDisplayName(child, 'EtDatepicker.Label'));

    let labelChild: ReactNode | undefined;

    if (explicitLabel && React.isValidElement(explicitLabel)) {
      labelChild = explicitLabel;
    } else if (stringChildren.length > 0) {
      // String shorthand: wrap concatenated strings in a virtual label
      const labelText = stringChildren.join('');
      labelChild = React.createElement(InputFieldLabel, null, labelText);
    }

    // ── Derive input row children (exclude label elements) ───────────
    const inputRowChildren = elementChildren.filter((child) => !hasDisplayName(child, 'EtDatepicker.Label'));

    // ── Detect presence of compactFieldDisplay ──────────────────────
    // `InputFieldContainer` derives its own calendar-icon slot inline via filter+find
    // because it needs the element itself, not just a boolean — so no `hasCalendarIcon` here.
    const hasCompactFieldDisplay = elementChildren.some((child) => hasDisplayName(child, 'EtDatepicker.CompactFieldDisplay'));

    return {
      labelChild,
      inputRowChildren,
      hasCompactFieldDisplay,
    };
  }, [children]);
}
