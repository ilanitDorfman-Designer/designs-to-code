import type { ReactElement, ReactNode } from 'react';
import { Children, isValidElement, useMemo } from 'react';

import { TopbarEnd, TopbarMiddle, TopbarStart } from '../subcomponents';
import type { TopbarStepProgressProps } from '../subcomponents/topbar-step-progress';
import { createSlot, getSlotName, isElementOf } from '../utils';

const SLOT_COMPONENTS = {
  start: TopbarStart,
  middle: TopbarMiddle,
  end: TopbarEnd,
} as const;

function isStepProgressElement(child: ReactNode): child is ReactElement<TopbarStepProgressProps> {
  return isValidElement(child) && (child.type as { etTopbarStepProgress?: boolean }).etTopbarStepProgress === true;
}

export function useSlots(children: ReactNode) {
  return useMemo(() => {
    const slots = {
      start: createSlot(),
      middle: createSlot(),
      end: createSlot(),
    };
    let hasAnySlot = false;
    let stepProgressElement: ReactElement<TopbarStepProgressProps> | null = null;

    Children.forEach(children, (child) => {
      if (child == null) return;

      if (isStepProgressElement(child)) {
        if (stepProgressElement != null) {
          if (__DEV__) {
            console.warn('EtTopbar useSlots: Duplicate <EtTopbar.StepProgress> detected. Only the first StepProgress is rendered.');
          }
          return;
        }
        stepProgressElement = child;
        return;
      }

      const slotName = getSlotName(child);
      const slotComponent = slotName ? SLOT_COMPONENTS[slotName] : null;

      if (slotName && slotComponent && isElementOf(child, slotComponent)) {
        hasAnySlot = true;
        const slot = slots[slotName];
        const { children: slotChildren, style, testID, ...rest } = child.props;
        slot.children.push(slotChildren);
        if (style) slot.styles.push(style);
        if (!slot.testID && testID) slot.testID = testID;
        slot.additionalProps.push(rest);
      }
    });

    return {
      start: slots.start,
      middle: slots.middle,
      end: slots.end,
      hasAnySlot,
      stepProgressElement,
    };
  }, [children]);
}
