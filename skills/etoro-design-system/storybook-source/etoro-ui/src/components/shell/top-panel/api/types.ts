import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

/** `__SLOT_TYPE` static values used to classify the panel's children. */
export type TopPanelSlotType = 'leading' | 'search' | 'tori' | 'actions';

export interface EtTopPanelProps {
  /**
   * From `useBreakpoint(BREAKPOINT_DESKTOP_S)` — the kit never measures the
   * window itself. `false` ⇒ 76px, `true` ⇒ 84px; the 44px bar row is
   * unchanged, only the vertical padding grows.
   */
  tall: boolean;
  /**
   * Leading | Search | ToriBadge | Actions slot children, classified by type:
   * Leading and Actions hug their edges while Search + ToriBadge render as one
   * group centered in the flexible zone between them.
   */
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface EtTopPanelLeadingProps {
  /**
   * The menu opener (`EtSideMenuTrigger`) at tier -1, plus whatever the screen
   * on top handed up (its back control and title). With no children the slot
   * renders nothing — the centered search group owes it no geometry.
   */
  children?: ReactNode;
  testID?: string;
}

export interface EtTopPanelSearchProps {
  /** Rendered as the pill's single-line text AND the default accessibility label. */
  placeholder: string;
  /** The pill is a press target, not an input — it must never focus a keyboard. */
  onPress: () => void;
  /** Defaults to `placeholder`. */
  accessibilityLabel?: string;
  testID?: string;
}

export interface EtTopPanelToriBadgeProps {
  /** The neutral part of the label ("Ask"), painted in the primary text color. */
  label: string;
  /** The brand part of the label ("Tori"), painted in the positive accent. */
  accentLabel: string;
  /** Swaps the badge for a same-footprint skeleton pill while Tori availability loads. */
  loading?: boolean;
  /** When given the badge is a button; without it, a plain view (wiring lands with the Tori surface). */
  onPress?: () => void;
  /**
   * Button form only — defaults to `label` + `accentLabel`. The plain-view
   * form carries no container label (its text announces itself; a label on a
   * role-less element is invalid ARIA), so this prop is ignored there.
   */
  accessibilityLabel?: string;
  testID?: string;
}

export interface EtTopPanelActionsProps {
  /**
   * The bell action, in the trailing Figma slot.
   */
  children?: ReactNode;
  /**
   * The screen's handed-up action, rendered RAW before the bell's slot — never
   * boxed, so content that renders null holds no phantom geometry. The cluster
   * hugs its content.
   */
  leading?: ReactNode;
  testID?: string;
}
