import React, { ReactNode, useMemo } from 'react';

interface ComponentChildren {
  labelChild: ReactNode | undefined;
  fieldChild: ReactNode | undefined;
  adornmentChildren: ReactNode[];
}

/**
 * Separates Input children into label, Field, and trailing adornments (text / icon).
 */
export function useComponentChildren(children: ReactNode): ComponentChildren {
  return useMemo(() => {
    const childrenArray = React.Children.toArray(children);

    const isLabel = (child: ReactNode): boolean =>
      React.isValidElement(child) && (child.type as { displayName?: string }).displayName === 'EtInput.Label';

    const FIELD_DISPLAY_NAMES = new Set(['EtInput.Field', 'EtFormInput.Field']);
    const isField = (child: ReactNode): boolean =>
      React.isValidElement(child) && FIELD_DISPLAY_NAMES.has((child.type as { displayName?: string }).displayName ?? '');

    const labelChild = childrenArray.find(isLabel);
    const fieldChildren = childrenArray.filter(isField);
    if (fieldChildren.length > 1) {
      throw new Error('EtInput allows at most one field child (EtInput.Field or EtFormInput.Field).');
    }
    const fieldChild = fieldChildren[0];
    const adornmentChildren = childrenArray.filter((child) => !isLabel(child) && !isField(child));

    return { labelChild, fieldChild, adornmentChildren };
  }, [children]);
}
