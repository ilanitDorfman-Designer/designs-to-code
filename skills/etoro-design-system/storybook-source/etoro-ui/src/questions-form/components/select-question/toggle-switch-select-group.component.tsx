import { type ReactElement, type ReactNode, useMemo } from 'react';
import { Controller, useController } from 'react-hook-form';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import type { SelectionTileOptionInputProps } from '../../../components/controls/selection-tile-group/api/types';
import { EtSelectionTileGroup } from '../../../components/controls/selection-tile-group/et-selection-tile-group';
import { useQuestionRenderer, useQuestionsFormAnimations, useResolveNode, useResolveText } from '../../contexts';
import type { CustomValidation, InputQuestion, QuestionOption } from '../../interfaces';
import { filterVisibleMessages, isOptionMessageVisible } from '../../utils/message-filter.util';
import { getInnerQuestions } from '../../utils/question-resolver.util';
import { AnimatedContainer } from '../animated-container';
import { QuestionMessageBox } from '../question-message-box';
import { createStyles, tileOptionStyles } from './select-question.styles';
import type { SelectQuestionProps } from './select-question.types';

/**
 * Renders checkRound-style multi-select options via EtSelectionTileGroup toggleInput variant.
 * Options with innerQuestionsIds (type=input) get an inline input inside the tile.
 * Handles `unselectAll` behavior and mixed-style options.
 */
export function ToggleSwitchSelectGroup({
  question,
  control,
  allQuestions,
  visibleOuterQuestions = [],
  getFieldName,
  getFieldRules,
}: SelectQuestionProps): ReactElement {
  const QuestionRenderer = useQuestionRenderer();
  const resolveText = useResolveText();
  const resolveNode = useResolveNode();
  const { optionEntering } = useQuestionsFormAnimations();
  const styles = createStyles();
  const fieldName = getFieldName(question);
  const rules = getFieldRules(question);
  const readOnly = question.readOnly ?? false;
  const options = question.options ?? [];
  const unselectAllOpt = options.find((o) => o.behavior === 'unselectAll');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- QuestionsFormValues is union-typed; safe for string[] toggle fields
  const typedControl = control as any;

  return (
    <Controller
      control={typedControl}
      name={fieldName}
      rules={rules}
      render={({ field, fieldState }) => {
        const raw = field.value as string[] | string | null;
        const currentValues = Array.isArray(raw) ? raw : raw != null && raw !== '' ? [String(raw)] : [];

        const handleChange = (nextValues: string[]) => {
          if (readOnly) return;

          if (unselectAllOpt) {
            const hadUnselectAll = currentValues.includes(unselectAllOpt.value);
            const hasUnselectAll = nextValues.includes(unselectAllOpt.value);

            if (!hadUnselectAll && hasUnselectAll) {
              field.onChange([unselectAllOpt.value]);
              return;
            }
            if (hadUnselectAll && nextValues.length > 1) {
              field.onChange(nextValues.filter((v) => v !== unselectAllOpt.value));
              return;
            }
          }

          field.onChange(nextValues.length ? nextValues : null);
        };

        const handleLegacyPress = (opt: QuestionOption) => {
          if (readOnly || opt.disabled) return;

          if (opt.behavior === 'unselectAll') {
            field.onChange([opt.value]);
            return;
          }

          const next = [...currentValues];
          if (unselectAllOpt) {
            const uIdx = next.indexOf(unselectAllOpt.value);
            if (uIdx >= 0) next.splice(uIdx, 1);
          }

          const idx = next.indexOf(opt.value);
          if (idx >= 0) {
            next.splice(idx, 1);
          } else {
            next.push(opt.value);
          }
          field.onChange(next.length ? next : null);
        };

        const toggleOptions = options.filter((o) => o.behavior !== 'unselectAll');
        const unselectAllOptions = options.filter((o) => o.behavior === 'unselectAll');

        const renderOptionContent = (opt: QuestionOption) => {
          const selected = currentValues.includes(opt.value);
          const innerQuestions =
            selected && opt.innerQuestionsIds?.length && allQuestions?.length ? getInnerQuestions(opt.innerQuestionsIds, allQuestions) : [];
          const singleInputInner = innerQuestions.length === 1 && innerQuestions[0].type === 'input' ? (innerQuestions[0] as InputQuestion) : null;
          const nonInputInnerQuestions = singleInputInner ? [] : innerQuestions;

          return (
            <>
              {filterVisibleMessages(opt.messages)
                .filter((msg) => isOptionMessageVisible(msg, selected))
                .map((msg, i) => (
                  <QuestionMessageBox key={`${opt.value}-msg-${i}`} message={msg} />
                ))}
              {nonInputInnerQuestions.length > 0 ? (
                <AnimatedContainer>
                  <View style={styles.innerQuestions}>
                    {nonInputInnerQuestions.map((innerQ) => (
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
            </>
          );
        };

        const toggleOptionElements = toggleOptions.map((opt, idx) => {
          const optStyle = opt.optionDefaultStyle ?? question.optionsDefaultStyle ?? 'checkRound';
          const displayText = resolveText(opt.text ?? opt.value);
          const displayNode = resolveNode(opt.text ?? opt.value);
          const selected = currentValues.includes(opt.value);
          const innerQuestions =
            selected && opt.innerQuestionsIds?.length && allQuestions?.length ? getInnerQuestions(opt.innerQuestionsIds, allQuestions) : [];
          const singleInputInner = innerQuestions.length === 1 && innerQuestions[0].type === 'input' ? (innerQuestions[0] as InputQuestion) : null;

          return (
            <Animated.View key={`${opt.value}-${idx}`} entering={optionEntering?.(idx)} style={styles.optionGroup}>
              {optStyle === 'checkRound' ? (
                singleInputInner ? (
                  <ToggleInputOption
                    opt={opt}
                    innerQuestion={singleInputInner}
                    displayText={displayText}
                    displayNode={displayNode}
                    readOnly={readOnly}
                    control={control}
                    getFieldName={getFieldName}
                    getFieldRules={getFieldRules}
                  />
                ) : (
                  <EtSelectionTileGroup.Option
                    value={opt.value}
                    disabled={readOnly || (opt.disabled ?? false)}
                    testID={`select-option-${opt.value}`}
                    accessibilityLabel={displayText}
                    style={tileOptionStyles.compactCheckRound}
                  >
                    {displayNode}
                  </EtSelectionTileGroup.Option>
                )
              ) : (
                <EtSelectionTileGroup.Option
                  value={opt.value}
                  disabled={readOnly || (opt.disabled ?? false)}
                  testID={`select-option-${opt.value}`}
                  accessibilityLabel={displayText}
                >
                  {displayNode}
                </EtSelectionTileGroup.Option>
              )}
              {renderOptionContent(opt)}
            </Animated.View>
          );
        });

        const unselectAllElements = unselectAllOptions.map((opt, idx) => {
          const displayText = resolveText(opt.text ?? opt.value);
          return (
            <Animated.View key={`unselectAll-${opt.value}-${idx}`} entering={optionEntering?.(toggleOptions.length + idx)} style={styles.optionGroup}>
              <EtSelectionTileGroup.Option
                value={opt.value}
                disabled={readOnly || (opt.disabled ?? false)}
                testID={`select-option-${opt.value}`}
                accessibilityLabel={displayText}
                style={tileOptionStyles.compactCheckRound}
                titleVariant="body-secondary-medium"
              >
                {displayText}
              </EtSelectionTileGroup.Option>
              {renderOptionContent(opt)}
            </Animated.View>
          );
        });

        const handleUnselectAllChange = (value: string | null) => {
          if (readOnly || value == null) return;
          const opt = unselectAllOptions.find((o) => String(o.value) === value);
          if (opt) handleLegacyPress(opt);
        };

        return (
          <View style={styles.container}>
            <EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={currentValues} onChange={handleChange} disabled={readOnly}>
              {toggleOptionElements}
            </EtSelectionTileGroup>
            {unselectAllElements.length > 0 ? (
              <EtSelectionTileGroup
                value={unselectAllOpt && currentValues.includes(unselectAllOpt.value) ? unselectAllOpt.value : null}
                onChange={handleUnselectAllChange}
                disabled={readOnly}
              >
                {unselectAllElements}
              </EtSelectionTileGroup>
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
            {fieldState.error?.message ? (
              <QuestionMessageBox
                message={{
                  message: fieldState.error.message,
                  type: 'error',
                  border: question.validations
                    ?.flatMap((v) => ('custom' in v ? (v as CustomValidation).custom : []))
                    .find((c) => c.name === fieldState.error?.type)?.border,
                }}
              />
            ) : null}
          </View>
        );
      }}
    />
  );
}

interface ToggleInputOptionProps {
  opt: QuestionOption;
  innerQuestion: InputQuestion;
  displayText: string;
  displayNode: ReactNode;
  readOnly: boolean;
  control: SelectQuestionProps['control'];
  getFieldName: SelectQuestionProps['getFieldName'];
  getFieldRules: SelectQuestionProps['getFieldRules'];
}

/**
 * Wraps EtSelectionTileGroup.Option with toggleInput wiring:
 * binds the inline input to the inner question's RHF field.
 */
function ToggleInputOption({ opt, innerQuestion, displayText, displayNode, readOnly, control, getFieldName, getFieldRules }: ToggleInputOptionProps) {
  const resolveText = useResolveText();
  const { contentEntering } = useQuestionsFormAnimations();
  const innerFieldName = getFieldName(innerQuestion);
  const innerRules = getFieldRules(innerQuestion);

  const { field: innerField, fieldState: innerFieldState } = useController({
    name: innerFieldName,
    control: control as Parameters<typeof useController>[0]['control'],
    rules: innerRules,
  });

  const inputConfig: SelectionTileOptionInputProps = useMemo(
    () => ({
      label: innerQuestion.placeholderText ? resolveText(innerQuestion.placeholderText) : undefined,
      defaultValue: (innerField.value as string) ?? '',
      fieldProps: {
        onChangeText: innerField.onChange as (text: string) => void,
        onBlur: innerField.onBlur,
        placeholder: innerQuestion.placeholderText ? resolveText(innerQuestion.placeholderText) : undefined,
      },
      errorMessage: innerFieldState.error?.message ?? null,
    }),
    [innerQuestion.placeholderText, innerField.value, innerField.onChange, innerField.onBlur, resolveText, innerFieldState.error?.message],
  );

  return (
    <EtSelectionTileGroup.Option
      value={opt.value}
      disabled={readOnly || (opt.disabled ?? false)}
      testID={`select-option-${opt.value}`}
      accessibilityLabel={displayText}
      input={inputConfig}
      innerEntering={contentEntering}
      style={tileOptionStyles.compactCheckRound}
    >
      {displayNode}
    </EtSelectionTileGroup.Option>
  );
}
