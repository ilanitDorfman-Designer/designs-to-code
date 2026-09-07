import type { ComponentProps, ComponentType, ReactElement, ReactNode } from 'react';
import { isValidElement } from 'react';

export function isElementOf<C extends ComponentType<any>>(child: ReactNode, component: C): child is ReactElement<ComponentProps<C>> {
  return isValidElement(child) && child.type === component;
}
