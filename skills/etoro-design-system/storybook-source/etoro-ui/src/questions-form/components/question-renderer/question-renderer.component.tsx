import type { ReactElement } from 'react';

import type { QuestionRendererProps } from '../../contexts';
import { AutocompleteQuestion } from '../autocomplete-question';
import { InputQuestion } from '../input-question';
import { SelectQuestion } from '../select-question';

export type { QuestionRendererProps } from '../../contexts';

/**
 * Renders a question by type (input or select).
 * Used by QuestionsForm and SelectQuestion to avoid circular imports.
 * Text resolution is provided via QuestionsFormTextProvider context.
 */
export function QuestionRenderer({
  question,
  control,
  allQuestions,
  visibleOuterQuestions,
  getFieldName,
  getFieldRules,
}: QuestionRendererProps): ReactElement | null {
  switch (question.type) {
    case 'input':
      return <InputQuestion question={question} control={control} getFieldName={getFieldName} getFieldRules={getFieldRules} />;
    case 'select':
      if (question.selectType === 'autoComplete') {
        return (
          <AutocompleteQuestion
            question={question}
            control={control}
            allQuestions={allQuestions}
            visibleOuterQuestions={visibleOuterQuestions}
            getFieldName={getFieldName}
            getFieldRules={getFieldRules}
          />
        );
      }
      return (
        <SelectQuestion
          question={question}
          control={control}
          allQuestions={allQuestions}
          visibleOuterQuestions={visibleOuterQuestions}
          getFieldName={getFieldName}
          getFieldRules={getFieldRules}
        />
      );
    default:
      return null;
  }
}
