import { Children, isValidElement, ReactNode } from 'react';

import { EtBottomSheetHeaderAction } from './et-bottom-sheet-header-action';
import { EtBottomSheetHeaderTitle } from './et-bottom-sheet-header-title';

export function isAction(child: ReactNode): boolean {
  return isValidElement(child) && child.type === EtBottomSheetHeaderAction;
}

export function isTitle(child: ReactNode): boolean {
  return isValidElement(child) && child.type === EtBottomSheetHeaderTitle;
}

export function hasCompoundChildren(children: ReactNode): boolean {
  const childArray = Children.toArray(children);
  return childArray.some((child) => isAction(child) || isTitle(child));
}
