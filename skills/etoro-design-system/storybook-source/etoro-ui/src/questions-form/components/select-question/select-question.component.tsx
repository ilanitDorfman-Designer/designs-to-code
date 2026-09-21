import type { ReactElement } from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import type { SelectionTileVariant } from '../../../components/controls/selection-tile-group/api/types';
import { EtSelectionTileGroup } from '../../../components/controls/selection-tile-group/et-selection-tile-group';
import { useQuestionRenderer, useQuestionsFormAnimations, useResolveNode, useResolveText } from '../../contexts';
import type { CustomValidation, OptionsQuestion, QuestionMessage } from '../../interfaces';
import { filterVisibleMessages, isOptionMessageVisible } from '../../utils/message-filter.util';
import { getInnerQuestions } from '../../utils/question-resolver.util';
import { AnimatedContainer } from '../animated-container';
import { QuestionMessageBox } from '../question-message-box';
import { ChipSelectGroup } from './chip-select-group.component';
import { createStyles, tileOptionStyles } from './select-question.styles';
import type { SelectQuestionProps } from './select-question.types';
import { ToggleSwitchSelectGroup } from './toggle-switch-select-group.component';

function buildValidationErrorMessage(question: OptionsQuestion, error: { type?: string; message?: string }): QuestionMessage | null {
  if (!error.message) return null;

  const customItem = question.validations?.flatMap((v) => ('custom' in v ? (v as CustomValidation).custom : [])).find((c) => c.name === error.type);

  return {
    message: error.message,
    type: 'error',
    border: customItem?.border,
    icon: customItem?.icon,
  };
}

const OPTION_STYLE_TO_TILE_VARIANT = {
  check: 'icon',
  checkBox: 'radio',
  checkRound: 'radio',
} as const;

type TileStyleKey = keyof typeof OPTION_STYLE_TO_TILE_VARIANT;

function isTileStyle(style: string): style is TileStyleKey {
  return style in OPTION_STYLE_TO_TILE_VARIANT;
}

/**
 * Renders single-select or multi-select question using EtSelectionTileGroup.
 */
export function SelectQuestion(props: SelectQuestionProps): ReactElement | null {
  const { question } = props;
  const optionStyle = question.optionsDefaultStyle ?? 'check';
  const disableUnselect = question.disableUnselect ?? false;
  const isMultiple = question.isMultipleSelection ?? false;
  const readOnly = question.readOnly ?? false;

  if (optionStyle === 'chip') {
    return <ChipSelectGroup {...props} />;
  }

  if (optionStyle === 'checkRound' && isMultiple) {
    return <ToggleSwitchSelectGroup {...props} />;
  }

  if (isTileStyle(optionStyle)) {
    // Multi-select requires toggle/toggleInput variant; use 'toggle' for check/checkBox multi-select.
    const tileVariant = isMultiple ? 'toggle' : OPTION_STYLE_TO_TILE_VARIANT[optionStyle];
    return (
      <TileGroupSelectQuestion
        {...props}
        tileVariant={tileVariant}
        optionStyle={optionStyle}
        disableUnselect={disableUnselect}
        isMultiple={isMultiple}
        readOnly={readOnly}
      />
    );
  }

  return null;
}

interface TileGroupSelectQuestionProps extends SelectQuestionProps {
  tileVariant: SelectionTileVariant;
  optionStyle: TileStyleKey;
  disableUnselect: boolean;
  isMultiple: boolean;
  readOnly: boolean;
}

/**
 * Renders check/checkBox questions via EtSelectionTileGroup (single- and multi-select).
 */
function TileGroupSelectQuestion({
  question,
  control,
  allQuestions,
  visibleOuterQuestions = [],
  getFieldName,
  getFieldRules,
  tileVariant,
  optionStyle,
  disableUnselect,
  isMultiple,
  readOnly,
}: TileGroupSelectQuestionProps): ReactElement {
  const QuestionRenderer = useQuestionRenderer();
  const resolveText = useResolveText();
  const { optionEntering } = useQuestionsFormAnimations();
  const resolveNode = useResolveNode();
  const styles = createStyles();
  const fieldName = getFieldName(question);
  const rules = getFieldRules(question);

  return (
    <Controller
      control={control}
      name={fieldName}
      rules={rules}
      render={({ field, fieldState }) => {
        const rawValue = field.value as string | string[] | null;
        const currentValue = isMultiple
          ? Array.isArray(rawValue)
            ? rawValue
            : rawValue != null
              ? [String(rawValue)]
              : []
          : ((rawValue as string | null) ?? null);

        const handleSingleChange = (optionValue: string | null) => {
          if (readOnly) return;
          field.onChange(optionValue);
        };

        const handleMultiChange = (nextValues: string[]) => {
          if (readOnly) return;
          const unselectAllOpt = (question.options ?? []).find((o) => o.behavior === 'unselectAll');
          if (unselectAllOpt) {
            const hadUnselectAll = (currentValue as string[]).includes(unselectAllOpt.value);
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

        const options = question.options ?? [];
        const optionElements = options.map((opt, idx) => {
          const selected = isMultiple ? (currentValue as string[]).includes(opt.value) : currentValue === opt.value;
          const innerQuestions =
            selected && opt.innerQuestionsIds?.length && allQuestions?.length ? getInnerQuestions(opt.innerQuestionsIds, allQuestions) : [];
          const displayText = resolveText(opt.text ?? opt.value);
          const displayNode = resolveNode(opt.text ?? opt.value);
          const displaySubText = opt.subText ? resolveNode(opt.subText) : undefined;

          return (
            <Animated.View key={`${opt.value}-${idx}`} entering={optionEntering?.(idx)} style={styles.optionGroup}>
              <EtSelectionTileGroup.Option
                value={opt.value}
                subtitle={displaySubText}
                disabled={readOnly || (opt.disabled ?? false)}
                testID={`select-option-${opt.value}`}
                accessibilityLabel={displayText}
                style={
                  optionStyle === 'checkBox'
                    ? tileOptionStyles.compactCheckBox
                    : optionStyle === 'checkRound'
                      ? tileOptionStyles.compactCheckRound
                      : tileOptionStyles.compact
                }
              >
                {displayNode}
              </EtSelectionTileGroup.Option>
              {filterVisibleMessages(opt.messages)
                .filter((msg) => isOptionMessageVisible(msg, selected))
                .map((msg, i) => (
                  <QuestionMessageBox key={`${opt.value}-msg-${i}`} message={msg} />
                ))}
              {innerQuestions.length > 0 ? (
                <AnimatedContainer>
                  <View style={styles.innerQuestions}>
                    {innerQuestions.map((innerQ) => (
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
            </Animated.View>
          );
        });

        const errorMessage = fieldState.error?.message ? buildValidationErrorMessage(question, fieldState.error) : null;

        return (
          <View style={styles.container}>
            {isMultiple ? (
              <EtSelectionTileGroup
                variant={tileVariant as 'toggle' | 'toggleInput'}
                selectionMode="multi"
                value={currentValue as string[]}
                onChange={handleMultiChange}
                disabled={readOnly}
                haptics={!disableUnselect}
              >
                {optionElements}
              </EtSelectionTileGroup>
            ) : (
              <EtSelectionTileGroup
                variant={tileVariant}
                value={currentValue as string | null}
                onChange={handleSingleChange}
                disabled={readOnly}
                haptics={!disableUnselect}
              >
                {optionElements}
              </EtSelectionTileGroup>
            )}
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
            {errorMessage ? <QuestionMessageBox message={errorMessage} /> : null}
          </View>
        );
      }}
    />
  );
}
