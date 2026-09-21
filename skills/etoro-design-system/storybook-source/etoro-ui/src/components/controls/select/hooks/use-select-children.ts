import { Children, isValidElement, ReactNode, useMemo } from 'react';

export interface SelectChildrenResult {
  /** EtSelect.Label child (filled variant label) */
  labelChild: ReactNode | undefined;
  /** EtSelect.Value child or string content */
  valueChild: ReactNode | undefined;
  /** EtSelect.LeadingContent child */
  leadingContentChild: ReactNode | undefined;
}

/**
 * Extracts compound children by displayName.
 * String/number children are treated as value text.
 */
export function useSelectChildren(children: ReactNode | undefined): SelectChildrenResult {
  return useMemo(() => {
    if (children === undefined || children === null) {
      return {
        labelChild: undefined,
        valueChild: undefined,
        leadingContentChild: undefined,
      };
    }

    const childArray = Children.toArray(children);

    let labelChild: ReactNode | undefined;
    let valueChild: ReactNode | undefined;
    let leadingContentChild: ReactNode | undefined;

    for (const child of childArray) {
      if (isValidElement(child)) {
        const displayName = (child.type as { displayName?: string }).displayName;

        switch (displayName) {
          case 'EtSelect.Label':
            labelChild = child;
            break;
          case 'EtSelect.Value':
            valueChild = child;
            break;
          case 'EtSelect.LeadingContent':
            leadingContentChild = child;
            break;
          default:
            break;
        }
      } else if (typeof child === 'string' || typeof child === 'number') {
        if (valueChild === undefined) {
          valueChild = child;
        }
      }
    }

    return { labelChild, valueChild, leadingContentChild };
  }, [children]);
}
