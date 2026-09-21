import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { usePostContext } from '../../context';
import { triggerHaptic } from '../../utils';
import type { PollAnswer } from '../poll/api';
import { usePollContext } from '../poll/context';
import { PollProvider, PollProviderProps } from '../poll/context/poll-provider';
import {
  PollFooterContent,
  PollFrame,
  PollOptionsList,
  PollQuestion,
  PollResultOption,
  PollUndoButton,
  PollVotableOption,
  PollVoteCount,
  PollVoterAvatars,
} from '../poll/subcomponents';
import { useIsSharedAttachment } from '../shared-post';

// ============================================================================
// Types
// ============================================================================

export interface PollRendererProps {
  /** Poll answers data */
  answers: PollAnswer[];
  /** Total vote count */
  voteCount?: number;
  /** Question text */
  question?: string;
  /** Called when answer is selected */
  onVote?: (answerId: string) => void;
  /** Called when undo is pressed */
  onUndo?: () => void;
  /** Controlled selected ID (optional - uses internal state if not provided) */
  selectedId?: string;
  /** Avatar URLs (max 3) */
  avatarUrls?: string[];
  /** Additional voters count */
  additionalVotersCount?: number;
  /** Override default styles */
  style?: StyleProp<ViewStyle>;
  /** Force results view even without a vote (e.g. poll creator). */
  showResults?: boolean;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
}

// ============================================================================
// Inner Layout Component
// ============================================================================

/**
 * PollRendererLayout - Reads usePollContext() to decide pre-vote vs post-vote layout.
 *
 * This is a separate inner component because PollProvider supports uncontrolled mode:
 * after a vote, PollProvider's internal state changes (hasVoted flips) but the
 * renderer's props don't change. By reading context inside PollProvider's subtree,
 * this component re-renders correctly when internal state updates.
 */
function PollRendererLayoutBase({ testID }: { testID?: string }) {
  const { state } = usePollContext();
  const isShared = useIsSharedAttachment();

  const frameStyle = isShared ? sharedOverrides.frame : undefined;

  if (state.showResults) {
    // Post-vote or creator: show results (Figma — question inside card, no footer divider)
    return (
      <PollFrame style={frameStyle} testID={testID ? `${testID}-frame` : undefined}>
        {state.question != null && <PollQuestion>{state.question}</PollQuestion>}
        <PollOptionsList>
          {state.answers.map((answer) => (
            <PollResultOption key={answer.id} answerId={answer.id} testID={testID ? `${testID}-result-${answer.id}` : undefined} />
          ))}
        </PollOptionsList>
        <PollFooterContent>
          <PollVoterAvatars />
          {state.hasVoted && (
            <View style={styles.footerTrailing}>
              <PollUndoButton />
            </View>
          )}
        </PollFooterContent>
      </PollFrame>
    );
  }

  // Pre-vote: show votable options
  return (
    <PollFrame style={frameStyle} testID={testID ? `${testID}-frame` : undefined}>
      {state.question != null && <PollQuestion>{state.question}</PollQuestion>}
      <PollOptionsList>
        {state.answers.map((answer) => (
          <PollVotableOption key={answer.id} answerId={answer.id} testID={testID ? `${testID}-option-${answer.id}` : undefined} />
        ))}
      </PollOptionsList>
      <PollFooterContent>
        <PollVoteCount />
      </PollFooterContent>
    </PollFrame>
  );
}

const PollRendererLayout = React.memo(PollRendererLayoutBase);

// ============================================================================
// Component
// ============================================================================

/**
 * PollRenderer - Sub-component of EtPost
 *
 * Renders an interactive poll with votable options (pre-vote) or
 * result bars with percentages (post-vote).
 *
 * Wraps EtPoll's PollProvider internally, so consumers don't need to
 * set up context themselves.
 *
 * Use as `<EtPost.Poll answers={[...]} question="..." onVote={handler} />`.
 */
function PollRendererBase({
  answers,
  voteCount,
  question,
  onVote,
  onUndo,
  selectedId,
  showResults,
  avatarUrls,
  additionalVotersCount,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: PollRendererProps) {
  const { haptics } = usePostContext();
  const { t } = useTranslation('feed');

  const handleVote = useCallback(
    (answerId: string) => {
      triggerHaptic(haptics);
      onVote?.(answerId);
    },
    [onVote, haptics],
  );

  const handleUndo = useCallback(() => {
    triggerHaptic(haptics);
    onUndo?.();
  }, [onUndo, haptics]);

  const providerProps: Omit<PollProviderProps, 'children'> = {
    answers,
    voteCount,
    question,
    onVote: handleVote,
    onUndo: handleUndo,
    selectedId,
    showResults,
    avatarUrls,
    additionalVotersCount,
  };

  return (
    <View style={style} testID={testID} accessibilityLabel={accessibilityLabel ?? t('poll.pollAttachment')} accessibilityHint={accessibilityHint}>
      <PollProvider {...providerProps}>
        <PollRendererLayout testID={testID} />
      </PollProvider>
    </View>
  );
}

export const PollRenderer = React.memo(PollRendererBase);
PollRenderer.displayName = 'EtPost.Poll';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  footerTrailing: {
    marginLeft: 'auto',
  },
});

const sharedOverrides = StyleSheet.create({
  frame: { marginHorizontal: 0 },
});
