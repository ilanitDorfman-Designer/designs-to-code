import type { ReactElement } from 'react';
import type { Control, FieldValues, RegisterOptions } from 'react-hook-form';
import { View } from 'react-native';

import { EtInput } from '../../../components/input/input-v2/et-input';
import { useEtoroTheme } from '../../../core/hooks';
import { FormField } from '../../../form';
import { useResolveText } from '../../contexts';
import type { InputQuestion as InputQuestionType, Question, QuestionsFormValues } from '../../interfaces';
import { QuestionMessageBox } from '../question-message-box';
import { createStyles } from './input-question.styles';

const DEFAULT_INPUT_PLACEHOLDER = 'questionsForm.inputPlaceholder';

/**
 * Props for the InputQuestion component.
 * Text resolution is provided via QuestionsFormTextProvider context.
 */
export interface InputQuestionProps {
  /** The input question to render */
  question: InputQuestionType;
  /** React Hook Form control instance */
  control: Control<QuestionsFormValues>;
  /** Returns the form field name for the question */
  getFieldName: (q: Question) => string;
  /** Returns react-hook-form rules for the question */
  getFieldRules: (q: Question) => RegisterOptions | undefined;
}

/**
 * Renders a text input, number input, or multiline textbox using EtInput + FormField.
 * Uses the floating label pattern so the placeholder is visible when the field is empty.
 *
 * @param props - Component props
 * @returns Rendered input question
 */
export function InputQuestion({ question, control, getFieldName, getFieldRules }: InputQuestionProps): ReactElement {
  const { colors } = useEtoroTheme();
  const resolveText = useResolveText();
  const styles = createStyles(colors);
  const fieldName = getFieldName(question);
  const rules = getFieldRules(question);
  const placeholder = resolveText(question.placeholderText || DEFAULT_INPUT_PLACEHOLDER);
  const accessibilityLabel = resolveText(question.text) || placeholder;
  const isTextbox = question.inputType === 'textbox';
  const isNumber = question.inputType === 'number';

  const controlType = isNumber ? 'number' : 'text';
  const inputBackgroundColor = `${colors.textPrimaryNeutral}0D`;

  return (
    <View style={styles.inputContainer}>
      <FormField name={fieldName} control={control as Control<FieldValues>} rules={rules} showError={false}>
        {(field, error) => {
          const inputValue = typeof field.value === 'string' ? field.value : '';

          return (
            <EtInput
              defaultValue={inputValue}
              type={controlType}
              readonly={question.readOnly ?? false}
              error={error?.message ?? null}
              disabled={field.disabled}
              style={isTextbox ? styles.textboxContainer : undefined}
              backgroundColor={inputBackgroundColor}
            >
              <EtInput.Label>{placeholder}</EtInput.Label>
              <EtInput.Field
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder={placeholder}
                multiline={isTextbox}
                keyboardType={isNumber ? 'numeric' : 'default'}
                editable={!question.readOnly}
                testID={`input-question-${question.id}`}
                accessibilityLabel={accessibilityLabel}
              />
            </EtInput>
          );
        }}
      </FormField>
      {question.messages?.length ? (
        <View style={styles.messagesContainer}>
          {question.messages.map((msg, i) => (
            <QuestionMessageBox key={`input-msg-${i}`} message={msg} />
          ))}
        </View>
      ) : null}
    </View>
  );
}
