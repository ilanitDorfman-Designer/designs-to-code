import { type ReactNode, useEffect } from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { type Control, FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import { QuestionRendererProvider } from '../../contexts';
import type { Question, QuestionsFormValues } from '../../interfaces';
import { mapValidationsToRhfRules } from '../../utils/validation-mapper.util';
import { QuestionRenderer } from '../question-renderer';

export const getFieldName = (q: Question) => q.id;

export const getFieldRules = (q: Question): RegisterOptions | undefined =>
  q.validations?.length ? mapValidationsToRhfRules(q.validations, q) : undefined;

interface QuestionsFormTestHarnessProps {
  defaultValues?: QuestionsFormValues;
  onFormReady?: (form: UseFormReturn<QuestionsFormValues>) => void;
  children: (ctx: { form: UseFormReturn<QuestionsFormValues>; control: Control<QuestionsFormValues> }) => ReactNode;
}

/**
 * Shared provider stack for select-group component specs (RHF + question renderer).
 */
export function QuestionsFormTestHarness({ defaultValues, onFormReady, children }: QuestionsFormTestHarnessProps) {
  const form = useForm<QuestionsFormValues>({ defaultValues });
  useEffect(() => {
    onFormReady?.(form);
  }, [form, onFormReady]);

  return (
    <QuestionRendererProvider renderer={QuestionRenderer}>
      <FormProvider {...form}>{children({ form, control: form.control })}</FormProvider>
    </QuestionRendererProvider>
  );
}
