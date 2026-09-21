import { type ComponentType, type ExoticComponent, isValidElement, type ReactNode } from 'react';

type ComponentLike<T> = ComponentType<T> | ExoticComponent<T>;

/** Filters children by component type */
export function getChildrenByType<T>(children: ReactNode[], type: ComponentLike<T>): ReactNode[] {
  const name = (type as { displayName?: string }).displayName || (type as { name?: string }).name;
  return children.filter((child) => {
    if (!isValidElement(child)) return false;
    const childType = child.type as any;
    return (
      childType === type ||
      childType?.type === type ||
      childType?.render === type ||
      (name != null && (childType?.displayName === name || childType?.name === name))
    );
  });
}
