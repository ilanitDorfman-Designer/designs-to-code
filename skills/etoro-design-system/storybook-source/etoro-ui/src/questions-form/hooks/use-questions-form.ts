import { type ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { type RegisterOptions, useForm, type UseFormReturn } from 'react-hook-form';

import { type QuestionsFormTextResolver, useExternalTextResolver } from '../contexts';
import type {
  OptionsQuestion,
  Question,
  QuestionsFormConfig,
  QuestionsFormValues,
  QuestionsFormValuesDiff,
  QuestionValidatorRegistry,
} from '../interfaces';
import { collectOuterQuestionIds as collectOuterIds, getInnerQuestions, getOuterQuestions } from '../utils/question-resolver.util';
import { decodeQuestionsFormValues, encodeQuestionsFormRhfFieldName } from '../utils/rhf-field-name.util';
import { resolveText as resolveTextUtil } from '../utils/text-resolver.util';
import { mapValidationsToRhfRules } from '../utils/validation-mapper.util';

/**
 * Options for the useQuestionsForm hook.
 */
export interface UseQuestionsFormOptions {
  /** Form configuration (questions, textAsKeys, getText) */
  config: QuestionsFormConfig;
  /** Optional registry of custom validators for validation rules */
  validatorRegistry?: QuestionValidatorRegistry;
  /** Called when form values change (for real-time validation/analytics) */
  onValuesChange?: (diff: QuestionsFormValuesDiff) => void;
  /** Optional resolver; wins over QuestionsFormTextProvider and config getText/util */
  resolveText?: (text: string | undefined) => string;
}

/**
 * Return value of the useQuestionsForm hook.
 */
export interface UseQuestionsFormReturn {
  /** react-hook-form instance for field registration and submission */
  form: UseFormReturn<QuestionsFormValues>;
  /** Current question to display (first in the list for single-step) */
  question: Question | undefined;
  /** Inner questions (for nested/conditional flows) */
  visibleInnerQuestions: Question[];
  /** Outer questions (for multi-step flows) */
  visibleOuterQuestions: Question[];
  /** Whether the form passes all validations */
  isValid: boolean;
  /** Returns current form values */
  getValues: () => QuestionsFormValues;
  /** Text resolver: use as `QuestionsFormTextProvider` `resolver`, or call `textResolver.resolveText` */
  textResolver: QuestionsFormTextResolver;
  /** Serialized current-question field value; changes when that value updates (for memo busting) */
  questionValueKey: string;
  /** Returns the form field name for a question (id or text) */
  getFieldName: (q: Question) => string;
  /** Returns react-hook-form RegisterOptions for a question's validations */
  getFieldRules: (q: Question) => RegisterOptions | undefined;
}

function getFieldName(question: Question, textAsKeys: boolean): string {
  const raw = textAsKeys ? (question.text ?? question.id) : question.id;
  return encodeQuestionsFormRhfFieldName(raw);
}

function toFormValue(value: unknown): string | string[] | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (Array.isArray(value)) {
    return value.map(String);
  }
  return String(value);
}

/**
 * Hook that manages form state, validation, and question flow for the QuestionsForm.
 * Integrates with react-hook-form and supports configurable validators and value change callbacks.
 *
 * @param options - Configuration and callbacks
 * @returns Form instance, current question, validation state, and helpers
 */
function collectInnerQuestionIds(question: OptionsQuestion, selectedValue: string | string[] | null): string[] {
  if (!selectedValue || !question.options?.length) return [];
  const ids: string[] = [];
  const selected = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
  const seen = new Set<string>();
  for (const opt of question.options) {
    if (selected.includes(opt.value) && opt.innerQuestionsIds?.length) {
      for (const id of opt.innerQuestionsIds) {
        if (!seen.has(id)) {
          seen.add(id);
          ids.push(id);
        }
      }
    }
  }
  return ids;
}

export function useQuestionsForm({
  config,
  validatorRegistry,
  onValuesChange,
  resolveText: resolveTextOverride,
}: UseQuestionsFormOptions): UseQuestionsFormReturn {
  const questions = useMemo(() => config?.questions ?? [], [config?.questions]);
  const allQuestions = useMemo(() => config?.allQuestions ?? questions, [config?.allQuestions, questions]);
  const question = questions[0] as Question | undefined;
  const textAsKeys = config?.textAsKeys ?? false;
  const getText = config?.getText;

  const externalResolver = useExternalTextResolver();
  const contextResolveText = useMemo(() => (externalResolver && !getText ? externalResolver.resolveText : undefined), [externalResolver, getText]);
  const contextResolveNode = useMemo(() => (externalResolver && !getText ? externalResolver.resolveNode : undefined), [externalResolver, getText]);

  const defaultValues = useMemo((): QuestionsFormValues => {
    const values: QuestionsFormValues = {};
    for (const q of questions) {
      const key = getFieldName(q, textAsKeys);
      values[key] = q.type === 'input' ? (toFormValue(q.value) ?? '') : toFormValue(q.value);
    }
    for (const q of allQuestions) {
      const key = getFieldName(q, textAsKeys);
      if (key in values) continue;
      if (q.value != null) {
        values[key] = q.type === 'input' ? (toFormValue(q.value) ?? '') : toFormValue(q.value);
      }
    }
    return values;
  }, [questions, allQuestions, textAsKeys]);

  const form = useForm<QuestionsFormValues>({
    defaultValues,
    mode: 'onChange',
  });

  const { watch, getValues: formGetValues, formState, unregister, setValue } = form;
  const watchedValues = watch();
  const prevValuesRef = useRef<QuestionsFormValues | null>(null);
  const prevValidRef = useRef<boolean | null>(null);
  const prevInnerIdsRef = useRef<string[]>([]);
  const prevOuterIdsRef = useRef<string[]>([]);
  const persistedValuesRef = useRef<QuestionsFormValues>({});
  const onValuesChangeRef = useRef(onValuesChange);
  onValuesChangeRef.current = onValuesChange;

  const questionsRef = useRef(questions);
  questionsRef.current = questions;

  const questionsByFieldName = useMemo(() => {
    const map = new Map<string, Question>();
    for (const q of allQuestions) {
      map.set(getFieldName(q, textAsKeys), q);
    }
    return map;
  }, [allQuestions, textAsKeys]);

  const visibleInnerQuestions = useMemo((): Question[] => {
    if (!question || question.type !== 'select') return [];
    const fieldName = getFieldName(question, textAsKeys);
    const selectedValue = watchedValues[fieldName] as string | string[] | null | undefined;
    const ids = collectInnerQuestionIds(question as OptionsQuestion, selectedValue ?? null);
    return getInnerQuestions(ids, allQuestions);
  }, [question, watchedValues, textAsKeys, allQuestions]);

  const visibleOuterQuestions = useMemo((): Question[] => {
    if (!question || question.type !== 'select') return [];
    const fieldName = getFieldName(question, textAsKeys);
    const selectedValue = watchedValues[fieldName] as string | string[] | null | undefined;
    const ids = collectOuterIds(question as OptionsQuestion, selectedValue ?? null);
    return getOuterQuestions(ids, allQuestions);
  }, [question, watchedValues, textAsKeys, allQuestions]);

  useEffect(() => {
    const currentIds = visibleInnerQuestions.map((q) => getFieldName(q, textAsKeys));
    const prevIds = prevInnerIdsRef.current;
    for (const prevId of prevIds) {
      if (!currentIds.includes(prevId)) {
        const q = questionsByFieldName.get(prevId);
        if (q?.isPersistValue) {
          persistedValuesRef.current[prevId] = formGetValues(prevId);
        }
        unregister(prevId);
      }
    }
    prevInnerIdsRef.current = currentIds;
  }, [visibleInnerQuestions, textAsKeys, unregister, questionsByFieldName, formGetValues]);

  useEffect(() => {
    const currentIds = visibleOuterQuestions.map((q) => getFieldName(q, textAsKeys));
    const prevIds = prevOuterIdsRef.current;
    for (const prevId of prevIds) {
      if (!currentIds.includes(prevId)) {
        const q = questionsByFieldName.get(prevId);
        if (q?.isPersistValue) {
          persistedValuesRef.current[prevId] = formGetValues(prevId);
        }
        unregister(prevId);
      }
    }
    prevOuterIdsRef.current = currentIds;
  }, [visibleOuterQuestions, textAsKeys, unregister, questionsByFieldName, formGetValues]);

  useEffect(() => {
    for (const q of visibleInnerQuestions) {
      const key = getFieldName(q, textAsKeys);
      const current = formGetValues(key);
      if (current === undefined) {
        const persisted = persistedValuesRef.current[key];
        const initial = q.type === 'input' ? (toFormValue(q.value) ?? '') : toFormValue(q.value);
        setValue(key, q.isPersistValue && persisted !== undefined ? persisted : initial);
      }
    }
  }, [visibleInnerQuestions, textAsKeys, formGetValues, setValue]);

  useEffect(() => {
    for (const q of visibleOuterQuestions) {
      const key = getFieldName(q, textAsKeys);
      const current = formGetValues(key);
      if (current === undefined) {
        const persisted = persistedValuesRef.current[key];
        const initial = q.type === 'input' ? (toFormValue(q.value) ?? '') : toFormValue(q.value);
        setValue(key, q.isPersistValue && persisted !== undefined ? persisted : initial);
      }
    }
  }, [visibleOuterQuestions, textAsKeys, formGetValues, setValue]);

  useEffect(() => {
    if (!onValuesChangeRef.current) return;
    const current = decodeQuestionsFormValues(formGetValues() as Record<string, unknown>);
    const prev = prevValuesRef.current;
    const diff: Partial<QuestionsFormValues> = {};
    for (const key of Object.keys(current)) {
      const nextVal = current[key];
      const prevVal = prev?.[key];
      if (prevVal !== nextVal) {
        diff[key] = nextVal;
      }
    }
    const validChanged = prevValidRef.current !== formState.isValid;
    if (Object.keys(diff).length === 0 && !validChanged) return;
    prevValuesRef.current = current;
    prevValidRef.current = formState.isValid;
    onValuesChangeRef.current({
      current,
      diff,
      valid: formState.isValid,
    });
  }, [watchedValues, formGetValues, formState.isValid]);

  const getValues = useCallback(() => decodeQuestionsFormValues(formGetValues() as Record<string, unknown>), [formGetValues]);

  const configResolveText = useCallback((text: string | undefined) => resolveTextUtil(text, textAsKeys, getText), [textAsKeys, getText]);

  const resolveText = useCallback(
    (text: string | undefined) => {
      if (text == null || text === '') {
        return '';
      }
      return (resolveTextOverride ?? contextResolveText ?? configResolveText)(text);
    },
    [resolveTextOverride, contextResolveText, configResolveText],
  );

  const resolveNode = useCallback(
    (text: string | undefined): ReactNode => {
      if (text == null || text === '') {
        return '';
      }
      return (contextResolveNode ?? resolveText)(text);
    },
    [contextResolveNode, resolveText],
  );

  const textResolver = useMemo((): QuestionsFormTextResolver => ({ resolveText, resolveNode }), [resolveText, resolveNode]);

  const getFieldNameFn = useCallback((q: Question) => getFieldName(q, textAsKeys), [textAsKeys]);

  const currentQuestionFieldName = question ? getFieldNameFn(question) : '';
  const currentQuestionValue = currentQuestionFieldName ? watch(currentQuestionFieldName) : undefined;

  const questionValueKey = useMemo(
    () => (currentQuestionFieldName ? JSON.stringify(currentQuestionValue) : ''),
    [currentQuestionFieldName, currentQuestionValue],
  );

  const getFieldRules = useCallback(
    (q: Question): RegisterOptions | undefined => {
      if (!q?.validations?.length) return undefined;
      return mapValidationsToRhfRules(q.validations, q, validatorRegistry, textResolver.resolveText);
    },
    [validatorRegistry, textResolver],
  );

  const getFieldRulesRef = useRef(getFieldRules);
  getFieldRulesRef.current = getFieldRules;
  const getFieldNameFnRef = useRef(getFieldNameFn);
  getFieldNameFnRef.current = getFieldNameFn;
  const formGetValuesRef = useRef(formGetValues);
  formGetValuesRef.current = formGetValues;
  const formSetErrorRef = useRef(form.setError);
  formSetErrorRef.current = form.setError;

  useEffect(() => {
    for (const q of questionsRef.current) {
      const rules = getFieldRulesRef.current(q);
      if (!rules?.validate || typeof rules.validate !== 'object') continue;

      const fieldName = getFieldNameFnRef.current(q);
      const value = formGetValuesRef.current(fieldName);
      const validators = rules.validate as Record<string, (v: unknown) => string | boolean>;

      for (const [name, fn] of Object.entries(validators)) {
        const result = fn(value);
        if (typeof result === 'string') {
          formSetErrorRef.current(fieldName as string & keyof QuestionsFormValues, { type: name, message: result });
          break;
        }
      }
    }
  }, []);

  return {
    form,
    question,
    visibleInnerQuestions,
    visibleOuterQuestions,
    isValid: formState.isValid,
    getValues,
    textResolver,
    questionValueKey,
    getFieldName: getFieldNameFn,
    getFieldRules,
  };
}
