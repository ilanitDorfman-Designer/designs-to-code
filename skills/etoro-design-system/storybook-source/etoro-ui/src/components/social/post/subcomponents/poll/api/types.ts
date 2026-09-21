import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// ========== Sub-interfaces ==========

/**
 * Poll answer option
 */
export interface PollAnswer {
  id: string;
  value: string;
  /** Vote count for this answer (optional) */
  votes?: number;
  /** Percentage for this answer (optional, calculated if not provided) */
  percentage?: number;
}

// ========== Child Component Props ==========

/**
 * Props for EtPoll.Question subcomponent
 */
export interface PollQuestionProps {
  children: ReactNode;
  /** Max lines before "Show More" (default: 4) */
  maxLines?: number;
}

/**
 * Props for EtPoll.OptionsList subcomponent
 */
export interface PollOptionsListProps {
  children?: ReactNode;
}

/**
 * Props for EtPoll.FooterContent subcomponent
 */
export interface PollFooterContentProps {
  children: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Props for EtPoll.Frame subcomponent
 */
export interface PollFrameProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Props for EtPoll.ResultOption subcomponent
 */
export interface PollResultOptionProps {
  answerId: string;
  testID?: string;
}

/**
 * Props for EtPoll.VotableOption subcomponent
 */
export interface PollVotableOptionProps {
  answerId: string;
  testID?: string;
}
