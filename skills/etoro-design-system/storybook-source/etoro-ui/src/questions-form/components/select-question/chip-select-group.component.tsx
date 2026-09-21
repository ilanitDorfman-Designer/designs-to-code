import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { View } from 'react-native';

import type { ChipsGroupItem } from '../../../form';
import { EtFormChipGroup } from '../../../form';
import { useQuestionRenderer, useResolveText } from '../../contexts';
import { filterVisibleMessages } from '../../utils/message-filter.util';
import { getInnerQuestions } from '../../utils/question-resolver.util';
import { AnimatedContainer } from '../animated-container';
import { QuestionMessageBox } from '../question-message-box';
import { createStyles } from './select-question.styles';
import type { SelectQuestionProps } from './select-question.types';

/**
 * Renders chip-style options using EtFormChipGroup compound component.
 * Delegates chip rendering to EtChipsGroupV2 via items data.
 */
export function ChipSelectGroup({
  question,
  control,
  allQuestions,
  visibleOuterQuestions = [],
  getFieldName,
  getFieldRules,
}: SelectQuestionProps): ReactElement {
  const QuestionRenderer = useQuestionRenderer();
  const resolveText = useResolveText();
  const styles = createStyles();
  const fieldName = getFieldName(question);
  const rules = getFieldRules(question);
  const readOnly = question.readOnly ?? false;
  const options = useMemo(() => question.options ?? [], [question.options]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- QuestionsFormValues is union-typed; safe for string[] chip fields
  const typedControl = control as any;
  const currentValue = useWatch({ control, name: fieldName }) as string | string[] | null;

  const items: ChipsGroupItem[] = useMemo(
    () => options.map((opt) => ({ id: opt.value, label: resolveText(opt.text ?? opt.value), icon: opt.icon as ChipsGroupItem['icon'] })),
    [options, resolveText],
  );

  const selectedInnerQuestions = options.flatMap((opt) => {
    const selected = Array.isArray(currentValue) ? currentValue.includes(opt.value) : currentValue === opt.value;
    return selected && opt.innerQuestionsIds?.length && allQuestions?.length ? getInnerQuestions(opt.innerQuestionsIds, allQuestions) : [];
  });

  return (
    <View style={styles.container}>
      <EtFormChipGroup name={fieldName} control={typedControl} rules={rules}>
        <EtFormChipGroup.Control items={items} disabled={readOnly} haptics={false} testID={`select-option-${fieldName}`} />
        <EtFormChipGroup.ErrorMessage />
      </EtFormChipGroup>
      {options
        .filter((opt) => {
          const selected = Array.isArray(currentValue) ? currentValue.includes(opt.value) : currentValue === opt.value;
          return selected && opt.messages?.length;
        })
        .flatMap((opt) => filterVisibleMessages(opt.messages).map((msg, i) => <QuestionMessageBox key={`${opt.value}-msg-${i}`} message={msg} />))}
      {selectedInnerQuestions.length > 0 ? (
        <AnimatedContainer>
          <View style={styles.innerQuestions}>
            {selectedInnerQuestions.map((innerQ) => (
              <QuestionRenderer
                key={innerQ.id}
                question={innerQ}
                control={control}
                allQuestions={allQuestions}
                getFieldName={getFieldName}
                getFieldRules={getFieldRules}
              />
            ))}
          </View>
        </AnimatedContainer>
      ) : null}
      {visibleOuterQuestions.length > 0 ? (
        <AnimatedContainer>
          <View style={styles.outerQuestions}>
            {visibleOuterQuestions.map((outerQ) => (
              <QuestionRenderer
                key={outerQ.id}
                question={outerQ}
                control={control}
                allQuestions={allQuestions}
                getFieldName={getFieldName}
                getFieldRules={getFieldRules}
              />
            ))}
          </View>
        </AnimatedContainer>
      ) : null}
    </View>
  );
}
