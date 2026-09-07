# Questions Form Interfaces

Type definitions for the `QuestionsForm` component and its configuration, validation, and callbacks.

## Overview

The questions-form interfaces define a flexible, type-safe schema for building dynamic forms with multiple question types. The design uses a **discriminated union** pattern so TypeScript can narrow question types based on the `type` field.

## Type Hierarchy

```
QuestionBase (abstract base)
├── InputQuestion   (type: 'input')  — text, number, textbox inputs
└── OptionsQuestion (type: 'select') — single/multi-select with chips, radio, checkbox, or autocomplete

Supporting types:
├── QuestionOption      — option for select questions
├── QuestionMessage     — message displayed with questions/options
├── QuestionValidation  — validation rules (required, min/max length, pattern, custom)
├── QuestionsFormConfig — form configuration
├── QuestionsFormCallbacks — form lifecycle callbacks
└── QuestionValidatorRegistry — custom validator lookup
```

## Discriminated Union Pattern

`Question` is a union of `InputQuestion | OptionsQuestion`. Each variant has a literal `type` field:

- `InputQuestion`: `type: 'input'`
- `OptionsQuestion`: `type: 'select'`

Use `question.type` to narrow the type in switch/if statements:

```typescript
function renderQuestion(question: Question) {
  switch (question.type) {
    case 'input':
      // question is InputQuestion — inputType, placeholderText available
      return <TextInput type={question.inputType} placeholder={question.placeholderText} />;
    case 'select':
      // question is OptionsQuestion — options, isMultipleSelection available
      return <OptionsList options={question.options} multiple={question.isMultipleSelection} />;
  }
}
```

## Import Paths

### From etoro-ui package

```typescript
import type {
  Question,
  InputQuestion,
  OptionsQuestion,
  QuestionBase,
  QuestionOption,
  QuestionMessage,
  QuestionValidation,
  QuestionsFormConfig,
  QuestionsFormCallbacks,
  QuestionsFormValues,
  QuestionsFormValuesDiff,
  QuestionValidatorRegistry,
  CustomValidatorFn,
  QuestionType,
  QuestionInputType,
  QuestionSelectType,
  QuestionOptionStyle,
} from 'etoro-ui/questions-form';
```

### From source (relative)

```typescript
import type { Question, InputQuestion, OptionsQuestion } from './question.interface';
import type { QuestionBase } from './question-base.interface';
import type { QuestionOption } from './question-option.interface';
import type { QuestionMessage } from './question-message.interface';
import type { QuestionValidation } from './question-validation.interface';
import type { QuestionsFormConfig } from './questions-form-config.interface';
import type { QuestionsFormCallbacks, QuestionsFormValues } from './questions-form-callbacks.interface';
import type { QuestionValidatorRegistry } from './question-validator-registry.interface';
```

## Usage Examples

### Basic input question

```typescript
const inputQuestion: InputQuestion = {
  id: 'email',
  type: 'input',
  inputType: 'text',
  placeholderText: 'Enter your email',
  text: 'What is your email address?',
  validations: [{ required: true, errorMessage: 'Email is required' }],
};
```

### Select question with options

```typescript
const selectQuestion: OptionsQuestion = {
  id: 'country',
  type: 'select',
  text: 'Select your country',
  options: [
    { value: 'us', text: 'United States' },
    { value: 'uk', text: 'United Kingdom' },
    { value: 'il', text: 'Israel' },
  ],
  isMultipleSelection: false,
  validations: [{ required: true, errorMessage: 'Please select a country' }],
};
```

### Form configuration

```typescript
const config: QuestionsFormConfig = {
  questions: [inputQuestion, selectQuestion],
  allQuestions: [inputQuestion, selectQuestion],
  textAsKeys: false,
  getText: (key) => t(key),
};
```

### Form callbacks

```typescript
const callbacks: QuestionsFormCallbacks = {
  onSubmit: (values: QuestionsFormValues, meta) => {
    console.log('Submitted:', values, meta?.isAutoSubmit ? 'auto' : 'manual');
  },
  onValuesChange: (diff) => {
    console.log('Changed:', diff.diff, 'Valid:', diff.valid);
  },
};
```

### Custom validator registry

```typescript
const registry: QuestionValidatorRegistry = {
  get(name: string) {
    const validators: Record<string, CustomValidatorFn> = {
      email: (value) => (/^[^@]+@[^@]+$/.test(String(value)) ? null : 'Invalid email'),
      phone: (value) => (/^\d{10}$/.test(String(value)) ? null : 'Invalid phone'),
    };
    return validators[name];
  },
};
```

## Validation Types

| Type                  | Discriminator                         | Purpose                 |
| --------------------- | ------------------------------------- | ----------------------- |
| `RequiredValidation`  | `required: true`                      | Field must have a value |
| `MinLengthValidation` | `minlength: number`                   | Minimum character count |
| `MaxLengthValidation` | `maxlength: number`                   | Maximum character count |
| `PatternValidation`   | `pattern: string`                     | Regex validation        |
| `CustomValidation`    | `custom: Array<{name, errorMessage}>` | Named custom validators |

## File Reference

| File                                       | Exports                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `question-base.interface.ts`               | `QuestionBase`, `QuestionType`, `QuestionInputType`, `QuestionSelectType`, `QuestionOptionStyle` (`'check'` gray card + chevron, `'checkBox'` radio circle right, `'checkRound'` round checkbox left, `'chip'` pill tags)                                                                                                                                                                                                             |
| `input-question.interface.ts`              | `InputQuestion`                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `options-question.interface.ts`            | `OptionsQuestion`                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `question.interface.ts`                    | `Question`                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `question-option.interface.ts`             | `QuestionOption`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `question-message.interface.ts`            | `QuestionMessage`, `QuestionMessageType`, `QuestionMessageBehavior`, `DependOnFn` — messages may be gated by `dependOnFn`; mobile consumers often run `filterVisibleMessages` from `message-filter.util.ts` to hide CCM-only dependencies; `QuestionMessageBox` renders optional border/icon; legacy `ets-icon-*` names are normalized to `EtIconV2` names during questionnaire config normalization (`normalizeQuestionnaireConfig`) |
| `question-validation.interface.ts`         | `QuestionValidation`, `RequiredValidation`, `MinLengthValidation`, etc.                                                                                                                                                                                                                                                                                                                                                               |
| `questions-form-config.interface.ts`       | `QuestionsFormConfig`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `questions-form-callbacks.interface.ts`    | `QuestionsFormCallbacks`, `QuestionsFormSubmitMeta`, `QuestionsFormValues`, `QuestionsFormValuesDiff`                                                                                                                                                                                                                                                                                                                                 |
| `question-validator-registry.interface.ts` | `QuestionValidatorRegistry`, `CustomValidatorFn`                                                                                                                                                                                                                                                                                                                                                                                      |
