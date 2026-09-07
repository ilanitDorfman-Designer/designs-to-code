/**
 * Form values map.
 * Keys are question IDs (or text when textAsKeys is true).
 * Values are string for single-select, string[] for multi-select, or null when empty.
 */
export type QuestionsFormValues = Record<string, string | string[] | null>;

/**
 * Diff of form values with validation status.
 * Emitted on value changes for incremental updates.
 */
export interface QuestionsFormValuesDiff {
  /** Current full form values */
  current: QuestionsFormValues;
  /** Changed fields since last emission */
  diff: Partial<QuestionsFormValues>;
  /** Whether the form is currently valid */
  valid: boolean;
}

/**
 * Metadata describing which path triggered a `QuestionsForm` submit.
 */
export interface QuestionsFormSubmitMeta {
  /**
   * `true` when submit was triggered automatically by an auto-select/auto-next
   * answer; `false` when triggered by an explicit tap on the submit CTA or
   * imperative `ref.submit()`.
   */
  isAutoSubmit: boolean;
}

/**
 * Callbacks for form lifecycle events.
 */
export interface QuestionsFormCallbacks {
  /**
   * Called when the form is submitted. `meta.isAutoSubmit` is `true` when
   * submit was triggered automatically by an auto-select/auto-next answer;
   * `false` when triggered by an explicit tap on the submit CTA or imperative
   * `ref.submit()`.
   */
  onSubmit: (values: QuestionsFormValues, meta?: QuestionsFormSubmitMeta) => void;
  /** Called when form values change (optional, for real-time validation/analytics) */
  onValuesChange?: (diff: QuestionsFormValuesDiff) => void;
}
