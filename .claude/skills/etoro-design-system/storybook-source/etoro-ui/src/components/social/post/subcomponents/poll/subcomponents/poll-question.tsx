import { memo } from 'react';

import { EtReadMoreText } from '../../../../../et-read-more-text';
import { PollQuestionProps } from '../api';

const DEFAULT_MAX_LINES = 4;

/**
 * EtPoll.Question - Poll question/title component with Show More/Less
 *
 * Uses EtReadMoreText for long questions so they can be truncated and expanded.
 * Reads question text from children (string).
 */
function PollQuestionComponent({ children, maxLines = DEFAULT_MAX_LINES }: PollQuestionProps) {
  const text = typeof children === 'string' ? children : String(children ?? '');

  return <EtReadMoreText text={text} maxLines={maxLines} textVariant="label-primary-semibold" />;
}

export const PollQuestion = memo(PollQuestionComponent);
PollQuestion.displayName = 'EtPoll.Question';
