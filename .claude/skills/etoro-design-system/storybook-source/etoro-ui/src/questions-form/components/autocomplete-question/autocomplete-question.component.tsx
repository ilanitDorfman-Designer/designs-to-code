import { useDebouncedValue } from '@etoro/common/utils/rn';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { ReactElement } from 'react';
import { useMemo, useRef, useState } from 'react';
import type { Control, RegisterOptions } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { EtSelect } from '../../../components/controls/select/et-select';
import { EtSearchInput } from '../../../components/input/search-input';
import { EtBottomSheet as EtBottomSheetV2 } from '../../../components/overlays/bottom-sheet-v2';
import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text/et-text';
import { useQuestionRenderer, useResolveText } from '../../contexts';
import type { CustomValidation, OptionsQuestion, Question, QuestionMessage, QuestionOption, QuestionsFormValues } from '../../interfaces';
import { AnimatedContainer } from '../animated-container';
import { QuestionMessageBox } from '../question-message-box';
import { createStyles } from './autocomplete-question.styles';

const DEFAULT_SEARCH_PLACEHOLDER = 'questionsForm.searchPlaceholder'; // "Select"
const DEFAULT_SELECT_PLACEHOLDER = 'questionsForm.selectPlaceholder'; // "Select an option"

// Module-level constant so the snap points keep a stable identity across
// renders (a fresh array would re-init the gorhom sheet on every value change).
const SNAP_POINTS = ['80%'];

/**
 * Props for the AutocompleteQuestion component.
 * Text resolution is provided via QuestionsFormTextProvider context.
 */
export interface AutocompleteQuestionProps {
  /** The options question to render (selectType must be 'autoComplete') */
  question: OptionsQuestion;
  /** React Hook Form control instance */
  control: Control<QuestionsFormValues>;
  /** Full set of questions (for inner questions resolution) */
  allQuestions?: Question[];
  /** Outer questions to render below the select trigger */
  visibleOuterQuestions?: Question[];
  /** Returns the form field name for the question */
  getFieldName: (q: Question) => string;
  /** Returns react-hook-form rules for the question */
  getFieldRules: (q: Question) => RegisterOptions | undefined;
}

/**
 * Renders a searchable dropdown for long option lists.
 * Uses EtBottomSheetV2 pattern:
 * - EtSearchInput in EtBottomSheetV2.Header
 * - EtBottomSheetV2.List for filtered options
 * - useDebouncedValue for search filtering
 *
 * @param props - Component props
 * @returns Rendered autocomplete question
 */
export function AutocompleteQuestion({
  question,
  control,
  allQuestions,
  visibleOuterQuestions = [],
  getFieldName,
  getFieldRules,
}: AutocompleteQuestionProps): ReactElement {
  const { colors } = useEtoroTheme();
  const resolveText = useResolveText();
  const QuestionRenderer = useQuestionRenderer();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  // WORKAROUND for @gorhom/bottom-sheet >=5.2.11 (issue #2669): calling
  // dismiss() on a modal whose status is still INITIAL permanently corrupts
  // it to DISMISSING, after which present() silently no-ops (the sheet never
  // reopens). Track presented state so we only dismiss() a sheet that was
  // actually opened, and never dismiss() from the onClose callback (which
  // fires AFTER gorhom has reset status to INITIAL).
  const hasPresentedRef = useRef(false);
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebouncedValue(searchText, 300);
  const inputBackgroundColor = `${colors.textPrimaryNeutral}0D`;

  const fieldName = getFieldName(question);
  const rules = getFieldRules(question);
  const placeholder = resolveText(question.placeholderText || DEFAULT_SELECT_PLACEHOLDER);
  const searchPlaceholder = resolveText(question.placeholderText || DEFAULT_SEARCH_PLACEHOLDER);

  const options = useMemo(() => question.options ?? [], [question.options]);
  const filteredOptions = useMemo(() => {
    const normalizedSearch = debouncedSearchText.trim().toLowerCase();
    if (!normalizedSearch) {
      return options;
    }
    return options.filter((opt) => {
      const displayText = resolveText(opt.text ?? opt.value).toLowerCase();
      return displayText.includes(normalizedSearch);
    });
  }, [debouncedSearchText, options, resolveText]);

  const openSheet = () => {
    setSearchText('');
    hasPresentedRef.current = true;
    bottomSheetRef.current?.present();
  };

  // Programmatic close (used when the user picks an option). Skips dismiss()
  // if the sheet was never presented to avoid the upstream INITIAL-status
  // corruption in @gorhom/bottom-sheet >=5.2.11 (issue #2669).
  const closeSheet = () => {
    if (!hasPresentedRef.current) return;
    hasPresentedRef.current = false;
    bottomSheetRef.current?.dismiss();
  };

  // Callback for EtBottomSheetV2.onClose, which fires AFTER the modal has
  // finished closing (gorhom has already reset its status to INITIAL). Must
  // NOT call dismiss() here — only reset our gate and clear local state.
  const handleSheetClosed = () => {
    hasPresentedRef.current = false;
    setSearchText('');
  };

  const handleSelectOption = (opt: QuestionOption, onChange: (value: string | null) => void) => {
    if (opt.disabled) return;
    onChange(opt.value);
    closeSheet();
  };

  return (
    <Controller
      control={control}
      name={fieldName}
      rules={rules}
      render={({ field, fieldState }) => {
        const selectedValue = field.value as string | null | undefined;
        const selectedOption = options.find((o) => o.value === selectedValue);
        const displayText = selectedOption ? resolveText(selectedOption.text ?? selectedOption.value) : '';

        const triggerAccessibilityLabel = displayText || placeholder;
        return (
          <View style={styles.container}>
            <EtSelect
              type="field"
              onPress={openSheet}
              width="auto"
              testID="autocomplete-trigger"
              accessibilityLabel={triggerAccessibilityLabel}
              style={{ backgroundColor: inputBackgroundColor }}
            >
              <EtSelect.Value>{displayText ? <Text style={{ color: colors.textPrimaryNeutral }}>{displayText}</Text> : placeholder}</EtSelect.Value>
            </EtSelect>

            <EtBottomSheetV2 bottomSheetRef={bottomSheetRef} snapPoints={SNAP_POINTS} onClose={handleSheetClosed} accessibilityLabel="Select option">
              <EtBottomSheetV2.Header>
                <View>
                  <EtSearchInput value={searchText} onChangeText={setSearchText} placeholder={searchPlaceholder} testID="autocomplete-search" />
                </View>
              </EtBottomSheetV2.Header>

              <EtBottomSheetV2.List
                data={filteredOptions}
                initialNumToRender={15}
                keyExtractor={(item: QuestionOption) => item.value}
                renderItem={({ item }: { item: QuestionOption }) => (
                  <Pressable
                    onPress={() => handleSelectOption(item, field.onChange)}
                    disabled={item.disabled}
                    style={styles.optionRow}
                    testID={`autocomplete-option-${item.value}`}
                  >
                    <EtText
                      variant="body-base-semibold"
                      style={{ color: item.disabled ? colors.textTertiaryNeutral : colors.textPrimaryNeutral }}
                      numberOfLines={1}
                    >
                      {resolveText(item.text ?? item.value)}
                    </EtText>
                  </Pressable>
                )}
                ItemSeparatorComponent={() => <View style={styles.optionSeparator} />}
                ListEmptyComponent={<View style={styles.emptyState} />}
                keyboardShouldPersistTaps="handled"
              />
            </EtBottomSheetV2>

            {fieldState.error?.message ? (
              <QuestionMessageBox
                message={{
                  message: fieldState.error.message,
                  type: 'error',
                  ...((): Pick<QuestionMessage, 'border' | 'icon'> => {
                    const customItem = question.validations
                      ?.flatMap((v) => ('custom' in v ? (v as CustomValidation).custom : []))
                      .find((c) => c.name === fieldState.error?.type);
                    return { border: customItem?.border, icon: customItem?.icon };
                  })(),
                }}
              />
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
      }}
    />
  );
}
