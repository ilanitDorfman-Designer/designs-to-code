import type { ComponentType, ReactElement, ReactNode } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import type { AnimatedProps } from 'react-native-reanimated';

import type { TopbarEnd, TopbarMiddle, TopbarStart } from '../subcomponents';

export type SlotName = 'start' | 'middle' | 'end';

export type SlotComponent = ComponentType<ViewProps> & {
  etTopbarSlot?: SlotName;
};

export type SlotData = {
  children: ReactNode[];
  styles: StyleProp<ViewStyle>[];
  testID?: string;
  additionalProps: Omit<ViewProps, 'children' | 'style' | 'testID'>[];
};

/** A React element produced by a topbar slot component (Start, Middle, or End). */
export type TopbarSlotElement =
  | ReactElement<ViewProps, typeof TopbarStart>
  | ReactElement<ViewProps, typeof TopbarMiddle>
  | ReactElement<ViewProps, typeof TopbarEnd>;

/** Allowed children for EtTopbar / EtTopbar.Animated. Only slot wrappers are accepted. */
export type TopbarChildren = TopbarSlotElement | Array<TopbarSlotElement | null | undefined | boolean> | null | undefined;

export interface EtTopbarRootProps extends Omit<ViewProps, 'children'> {
  children?: TopbarChildren;
  /** When true, Liquid Glass wrapping on Start/End slots is suppressed even on iOS 26+. */
  disableLiquidGlass?: boolean;
}

export interface EtTopbarAnimatedRootProps extends Omit<EtTopbarAnimatedProps, 'children'> {
  children?: TopbarChildren;
}

/** Props for the EtTopbar component (regular View). */
export type EtTopbarProps = ViewProps;

/**
 * Props for EtTopbar.Animated (Animated.View).
 * Supports Reanimated animated styles for scroll-driven animations.
 */
export interface EtTopbarAnimatedProps extends Omit<AnimatedProps<ViewProps>, 'children'> {
  children?: ReactNode;
}
