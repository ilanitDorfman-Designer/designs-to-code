import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '../../../foundations/icon-assets/api';

/**
 * Props for EtFabMenu.Button - individual action button in the FAB menu
 */
export interface EtFabMenuButtonProps {
  /** Icon name from the icon library */
  iconName: IconName;
  /** Label text displayed next to the icon */
  label: string;
  /** Callback when the action is pressed. Menu closes automatically after selection. */
  onPress: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label (defaults to label if not provided) */
  accessibilityLabel?: string;
}

/**
 * Props for EtFabMenu.Trigger - the main FAB button that toggles the menu
 */
export interface EtFabMenuTriggerProps {
  /** The trigger button content. Receives isOpen for conditional rendering (e.g. icon swap). Omit for default FAB. */
  children?: ReactNode | ((isOpen: boolean) => ReactNode);
}

/**
 * Props for EtFabMenu.Actions - container for action buttons
 */
export interface EtFabMenuActionsProps {
  /** EtFabMenu.Button components */
  children: ReactNode;
}

/**
 * Context value shared with FAB menu subcomponents
 */
export interface FabMenuContextValue {
  /** Whether the menu is expanded */
  isOpen: boolean;
  /** Toggle the menu open/closed */
  toggle: () => void;
  /** Close the menu (e.g. after action selection or outside press) */
  close: () => void;
}

/**
 * Valid children for EtFabMenu
 */
export type EtFabMenuChildren =
  | ReactElement<EtFabMenuTriggerProps>
  | ReactElement<EtFabMenuActionsProps>
  | (ReactElement<EtFabMenuTriggerProps | EtFabMenuActionsProps> | null)[];

/**
 * Props for EtFabMenu root component
 */
export interface EtFabMenuProps {
  /** Compound children: EtFabMenu.Trigger and EtFabMenu.Actions */
  children: EtFabMenuChildren;
  /** Optional style for the root container */
  style?: StyleProp<ViewStyle>;
  /** Whether to close the menu when pressing outside (default: true) */
  closeOnOutsidePress?: boolean;
  /** Inset from bottom/right when menu is open in Modal. Managed by parent to match FAB position. */
  contentInset?: { bottom?: number; right?: number };
  /** Test ID for the root */
  testID?: string;
}
