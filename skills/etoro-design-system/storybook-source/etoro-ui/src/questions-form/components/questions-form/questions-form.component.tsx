import type { ComponentType, ReactNode, Ref } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EtScreen } from '../../../components/screen/et-screen';
import { ET_SCREEN_CONTENT_SAFE_AREA_EDGES } from '../../../components/screen/subcomponents/screen-content-renderer';
import type { QuestionRendererProps, QuestionsFormContextValue } from '../../contexts';
import {
  QuestionRendererProvider,
  QuestionsFormContext,
  QuestionsFormTextProvider,
  useQuestionsFormAnimations,
  useQuestionsFormCtx,
} from '../../contexts';
import { useDelayedDisabled } from '../../hooks/use-delayed-disabled';
import { useQuestionsForm } from '../../hooks/use-questions-form';
import type {
  Question,
  QuestionsFormConfig,
  QuestionsFormSubmitMeta,
  QuestionsFormValues,
  QuestionsFormValuesDiff,
  QuestionValidatorRegistry,
} from '../../interfaces';
import { filterVisibleMessages, isAutoSubmitIdleEmpty } from '../../utils';
import { QuestionHeader } from '../question-header';
import { QuestionMessageBox } from '../question-message-box';
import { QuestionRenderer } from '../question-renderer';
import { styles } from './questions-form.styles';

// ─── Submit Compound Component ────────────────────────────────

/**
 * Props for QuestionsForm.Submit compound component.
 */
export interface QuestionsFormSubmitProps {
  /**
   * Called when form is submitted with valid values. `meta.isAutoSubmit` is
   * `true` when submit was triggered automatically by an auto-select/auto-next
   * answer; `false` when triggered by an explicit tap on the submit CTA or
   * imperative `ref.submit()`.
   */
  onSubmit: (values: QuestionsFormValues, meta?: QuestionsFormSubmitMeta) => void;
  /**
   * When returns true, hides the submit button and auto-submits when valid.
   * After the first auto-submit, any further value change switches to manual mode.
   */
  isAutoSubmit?: (question: Question, values: QuestionsFormValues, isValid: boolean, isDirty: boolean) => boolean;
  /** Label for the submit button */
  label?: string;
  /**
   * Externally-controlled loading state. When provided, it overrides the
   * internal press-driven loading state (e.g. drive it from a facade's
   * submitting flag). When omitted, the button shows a loader from the moment
   * it's pressed until the question changes.
   */
  loading?: boolean;
  /** Extra content to render below the submit button */
  children?: ReactNode;
}

function QuestionsFormSubmit({ onSubmit, isAutoSubmit, label, loading, children }: QuestionsFormSubmitProps) {
  const { question, isValid, isDirty, getValues, createSubmitHandler, questionValueKey, hasAutoSubmitted, markAutoSubmitted } = useQuestionsFormCtx();
  const { submitButtonEntering, submitButtonExiting } = useQuestionsFormAnimations();

  const [autoSubmitUsed, setAutoSubmitUsed] = useState(hasAutoSubmitted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoSubmitTriggeredRef = useRef(false);
  const onSubmitRef = useRef(onSubmit);

  // Reset the press-driven loader whenever the question changes (e.g. after the
  // submit advances to the next step), so a fresh question starts un-loaded.
  useEffect(() => {
    void questionValueKey;
    setIsSubmitting(false);
  }, [question, questionValueKey]);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  });

  const autoSubmitMode = useMemo(() => {
    void questionValueKey; // getValues ref is stable; key busts memo when this question's value changes
    if (autoSubmitUsed || !isAutoSubmit || !question) return false;
    const values = getValues();
    return isAutoSubmitIdleEmpty(question, values) || isAutoSubmit(question, values, true, true);
  }, [autoSubmitUsed, isAutoSubmit, question, getValues, questionValueKey]);

  const shouldAutoSubmit = useMemo(() => {
    void questionValueKey;
    if (!autoSubmitMode || !isAutoSubmit || !question) return false;
    const values = getValues();
    return isAutoSubmit(question, values, isValid, isDirty);
  }, [autoSubmitMode, isAutoSubmit, question, getValues, questionValueKey, isValid, isDirty]);

  useEffect(() => {
    if (shouldAutoSubmit && !autoSubmitTriggeredRef.current) {
      autoSubmitTriggeredRef.current = true;
      markAutoSubmitted();
      setAutoSubmitUsed(true);
      onSubmitRef.current(getValues(), { isAutoSubmit: true });
    }
  }, [shouldAutoSubmit, getValues, markAutoSubmitted]);

  useEffect(() => {
    if (autoSubmitUsed) {
      autoSubmitTriggeredRef.current = false;
    }
  }, [autoSubmitUsed]);

  // Defer disabling so a transient invalid edit doesn't flicker the button
  // (enabling stays immediate). Matches the KYC field-validation delay.
  const disabled = useDelayedDisabled(!isValid);

  // Show the loader on press; an explicit `loading` prop wins when provided.
  const isLoading = loading ?? isSubmitting;

  const handleSubmit = useMemo(
    () =>
      createSubmitHandler((values) => {
        setIsSubmitting(true);
        onSubmit(values, { isAutoSubmit: false });
      }),
    [createSubmitHandler, onSubmit],
  );

  if (autoSubmitMode || autoSubmitTriggeredRef.current) return null;

  return (
    <EtScreen.Footer>
      {/* Mount the button only while it's actionable so it animates out instead
          of lingering greyed-out when disabled (matches the KYC welcome CTA). */}
      {!disabled && (
        <Animated.View style={styles.submitButtonWrap} entering={submitButtonEntering} exiting={submitButtonExiting}>
          <EtScreen.Footer.Primary testID="questions-form-submit-button" loading={isLoading} disabled={isLoading} onPress={handleSubmit}>
            {label}
          </EtScreen.Footer.Primary>
        </Animated.View>
      )}
      {children}
    </EtScreen.Footer>
  );
}

// ─── Ref ──────────────────────────────────────────────────────

/**
 * Imperative handle exposed by QuestionsForm when used with a ref.
 */
export interface QuestionsFormRef {
  /** Whether the form is currently valid */
  isValid: boolean;
  /** Returns the current form values */
  getValues: () => QuestionsFormValues;
  /** Triggers form submission (runs validation and onSubmit if valid) */
  submit: () => void;
}

// ─── Props ────────────────────────────────────────────────────

/**
 * Props for the QuestionsForm component.
 */
export interface QuestionsFormProps {
  /** Form configuration (questions, options) */
  config: QuestionsFormConfig;
  /** Called when form values change */
  onValuesChange?: (diff: QuestionsFormValuesDiff) => void;
  /** Called when form is submitted with valid values (legacy — prefer QuestionsForm.Submit) */
  onSubmit?: (values: QuestionsFormValues, meta?: QuestionsFormSubmitMeta) => void;
  /** Optional registry of custom validators */
  validatorRegistry?: QuestionValidatorRegistry;
  /** Label for the submit button (legacy — prefer QuestionsForm.Submit) */
  submitLabel?: string;
  /** Extra content to render in the footer (legacy — prefer QuestionsForm.Submit) */
  footerExtra?: ReactNode;
  /** Auto-submit predicate (legacy — prefer QuestionsForm.Submit) */
  isAutoSubmit?: (question: Question, values: QuestionsFormValues, isValid: boolean, isDirty: boolean) => boolean;
  /**
   * Optional custom question renderer. Defaults to the built-in
   * `QuestionRenderer`. Used for both the current question body and the
   * `QuestionRendererProvider` (so nested outer/inner questions use it too),
   * letting hosts render custom field types (e.g. `inputType: 'country'`)
   * without coupling `etoro-ui` to feature code.
   */
  renderer?: ComponentType<QuestionRendererProps>;
  /** Composition children — use QuestionsForm.Submit to control the footer */
  children?: ReactNode;
}

// ─── Component ────────────────────────────────────────────────

function QuestionsFormBase(
  { config, onValuesChange, onSubmit, validatorRegistry, submitLabel, footerExtra, isAutoSubmit, renderer, children }: QuestionsFormProps,
  ref: Ref<QuestionsFormRef>,
) {
  // Screen-level container transitions are supplied by the host via
  // `QuestionsFormAnimationsProvider`; the form itself stays animation-agnostic.
  const { screenEntering, screenExiting } = useQuestionsFormAnimations();
  const ActiveRenderer = renderer ?? QuestionRenderer;
  const insets = useSafeAreaInsets();
  // Clear the bottom system inset on the scroll container so the last
  // question/option (especially on auto-submit steps that render no footer)
  // never overlaps the Android nav bar / iOS home indicator. Zero-inset devices
  // keep the original layout (paddingBottom: 0) — no growth, no shrink. On steps
  // with an inline `QuestionsForm.Submit` footer, the footer's own `paddingBottom: X6`
  // sits on top of this inset, so there is no double padding to subtract.
  const scrollContentContainerStyle = useMemo(() => ({ paddingBottom: insets.bottom }), [insets.bottom]);

  const { form, question, isValid, getValues, textResolver, questionValueKey, getFieldName, getFieldRules, visibleOuterQuestions } = useQuestionsForm(
    {
      config,
      validatorRegistry,
      onValuesChange,
    },
  );

  const createSubmitHandler = useCallback((cb: (values: QuestionsFormValues) => void) => form.handleSubmit(() => cb(getValues())), [form, getValues]);

  const autoSubmitUsedRef = useRef(false);
  const hasAutoSubmitted = useCallback(() => autoSubmitUsedRef.current, []);
  const markAutoSubmitted = useCallback(() => {
    autoSubmitUsedRef.current = true;
  }, []);

  const contextValue: QuestionsFormContextValue = useMemo(
    () => ({
      question,
      isValid,
      isDirty: form.formState.isDirty,
      getValues,
      createSubmitHandler,
      questionValueKey,
      hasAutoSubmitted,
      markAutoSubmitted,
    }),
    [question, isValid, form.formState.isDirty, getValues, createSubmitHandler, questionValueKey, hasAutoSubmitted, markAutoSubmitted],
  );

  useImperativeHandle(
    ref,
    () => ({
      get isValid() {
        return form.formState.isValid;
      },
      getValues,
      submit: () => form.handleSubmit(() => onSubmit?.(getValues(), { isAutoSubmit: false }))(),
    }),
    [form, getValues, onSubmit],
  );

  if (!question) {
    return null;
  }

  const resolvedText = textResolver.resolveText(question.text);
  const resolvedSubText = textResolver.resolveText(question.subText);

  const renderQuestionBody = () => (
    <ActiveRenderer
      question={question}
      control={form.control}
      allQuestions={config.allQuestions}
      visibleOuterQuestions={visibleOuterQuestions}
      getFieldName={getFieldName}
      getFieldRules={getFieldRules}
    />
  );

  const renderFooter = () => {
    if (children) return children;
    if (!onSubmit) return null;
    return (
      <QuestionsFormSubmit onSubmit={onSubmit} isAutoSubmit={isAutoSubmit} label={submitLabel}>
        {footerExtra}
      </QuestionsFormSubmit>
    );
  };

  return (
    <QuestionsFormContext.Provider value={contextValue}>
      <QuestionRendererProvider renderer={ActiveRenderer}>
        <QuestionsFormTextProvider resolver={textResolver}>
          {/* QuestionsForm does not render EtScreen.TopBar; host supplies top chrome / safe area. */}
          <EtScreen edges={ET_SCREEN_CONTENT_SAFE_AREA_EDGES} entering={screenEntering} exiting={screenExiting}>
            <EtScreen.ScrollView keyboardAware keyboardShouldPersistTaps="handled" contentContainerStyle={scrollContentContainerStyle}>
              <EtScreen.Content testID={`question-${question.id}`}>
                {resolvedText ? <EtScreen.Content.Title variant="display-compact">{resolvedText}</EtScreen.Content.Title> : null}
                {resolvedSubText ? <EtScreen.Content.Subtitle>{resolvedSubText}</EtScreen.Content.Subtitle> : null}
                <EtScreen.Content.Body>
                  {(question.title ?? question.img) ? <QuestionHeader title={question.title} img={question.img} /> : null}
                  <View style={styles.content}>{renderQuestionBody()}</View>
                </EtScreen.Content.Body>
              </EtScreen.Content>
              <View style={styles.spacer} />
              <View style={styles.footer}>{renderFooter()}</View>
              {(() => {
                const visibleMessages = filterVisibleMessages(question.messages);
                return visibleMessages.length ? (
                  <View style={styles.messages}>
                    {visibleMessages.map((msg, i) => (
                      <QuestionMessageBox key={`q-msg-${i}`} message={msg} centered />
                    ))}
                  </View>
                ) : null;
              })()}
            </EtScreen.ScrollView>
          </EtScreen>
        </QuestionsFormTextProvider>
      </QuestionRendererProvider>
    </QuestionsFormContext.Provider>
  );
}

/**
 * Config-driven questionnaire form that renders one question at a time.
 * Supports select (single/multi), input, and autocomplete question types.
 *
 * Composition API:
 * ```tsx
 * <QuestionsForm config={config}>
 *   <QuestionsForm.Submit onSubmit={handleSubmit} isAutoSubmit={isAutoSubmit} />
 * </QuestionsForm>
 * ```
 */
export const QuestionsForm = Object.assign(forwardRef<QuestionsFormRef, QuestionsFormProps>(QuestionsFormBase), { Submit: QuestionsFormSubmit });
