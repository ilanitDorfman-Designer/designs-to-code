import { Children, isValidElement, ReactNode } from 'react';

/**
 * Display name for EtText component used for validation
 */
const ET_TEXT_DISPLAY_NAME = 'EtText';

/**
 * Gets the displayName from a React element type, handling:
 * - Function components (displayName on function)
 * - React.memo wrapped components (displayName on wrapper or inner type)
 * - Class components
 */
function getDisplayName(type: unknown): string | undefined {
  if (!type) {
    return undefined;
  }

  // Handle function components and class components
  if (typeof type === 'function') {
    return (type as { displayName?: string }).displayName;
  }

  // Handle React.memo and other object-based wrappers
  if (typeof type === 'object') {
    const typeObj = type as {
      displayName?: string;
      type?: { displayName?: string };
    };

    // Direct displayName on memo wrapper
    if (typeObj.displayName) {
      return typeObj.displayName;
    }

    // React.memo wrapped component - check inner type
    if (typeObj.type?.displayName) {
      return typeObj.type.displayName;
    }
  }

  return undefined;
}

/**
 * Gets a readable name for a React element type for error messages
 */
function getTypeName(type: unknown): string {
  if (typeof type === 'function') {
    return (type as { name?: string }).name || 'unknown';
  }
  if (typeof type === 'string') {
    return type;
  }
  return 'unknown component';
}

/**
 * Validates that all children are EtText components.
 * Throws an error if invalid children are found.
 *
 * @param children - React children to validate
 * @param componentName - Name of the parent component for error messages
 * @throws Error if any child is not an EtText component
 */
export function validateEtTextChildren(children: ReactNode, componentName: string): void {
  Children.forEach(children, (child) => {
    if (child === null || child === undefined) {
      return;
    }

    // Check if it's a valid React element
    if (!isValidElement(child)) {
      throw new Error(
        `${componentName} only accepts EtText components as children. ` +
          `Received: ${typeof child === 'string' ? `string "${child}"` : typeof child}`,
      );
    }

    // Check if the element is an EtText component by displayName
    // Handles both regular components and React.memo wrapped components
    const displayName = getDisplayName(child.type);

    if (displayName !== ET_TEXT_DISPLAY_NAME) {
      throw new Error(`${componentName} only accepts EtText components as children. ` + `Received: ${displayName || getTypeName(child.type)}`);
    }
  });
}
