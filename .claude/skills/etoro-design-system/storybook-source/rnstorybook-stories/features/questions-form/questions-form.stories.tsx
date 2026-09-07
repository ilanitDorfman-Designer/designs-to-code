import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Alert, Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  QuestionsForm,
  QuestionsFormTextProvider,
  isAutoSubmit,
  type QuestionsFormTextResolver,
  type QuestionsFormConfig,
  type QuestionsFormValues,
  type Question,
  type QuestionValidatorRegistry,
} from 'etoro-ui/questions-form';
import { ScrollProvider } from 'etoro-ui';
import { Page, Section, Title, Desc, Preview, CodeBlock, PropsTable, SubTitle, useTheme } from '../../utils/storybook-template';

type Story = StoryObj<typeof QuestionsForm>;

const FORM_HEIGHT = 600;

const onSubmit = (v: QuestionsFormValues) => Alert.alert('Submitted', JSON.stringify(v, null, 2));

const applyAnswersToQuestions = (questions: Question[] | undefined, savedValues: QuestionsFormValues): Question[] | undefined =>
  questions?.map((q) => (Object.prototype.hasOwnProperty.call(savedValues, q.id) ? { ...q, value: savedValues[q.id] } : q));

const meta: Meta<typeof QuestionsForm> = {
  title: 'eToro-UI/Features/QuestionsForm',
  component: QuestionsForm,
  argTypes: {
    config: { control: false },
    onValuesChange: { control: false },
  },
  decorators: [
    (Story) => (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ScrollProvider hideHalo>
            <Story />
          </ScrollProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    ),
  ],
};

export default meta;

// ─────────────────────────────────────────────────────────────
// SingleSelectCheck
// ─────────────────────────────────────────────────────────────

export const SingleSelectCheck: Story = {
  render: () => {
    const config: QuestionsFormConfig = {
      questions: [
        {
          id: 'q1',
          type: 'select',
          text: 'What are your investment goals?',
          optionsDefaultStyle: 'check',
          disableUnselect: true,
          options: [
            { value: 'short', text: 'Short-term returns' },
            { value: 'long', text: 'Long-term growth' },
            { value: 'income', text: 'Passive income' },
          ],
          validations: [{ required: true }],
        },
      ],
    };
    return (
      <Page>
        <Section>
          <Title>Check Style (Single-Select)</Title>
          <Desc>Gray card with chevron always visible on right. Tap to select.</Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              <QuestionsForm config={config}>
                <QuestionsForm.Submit label="Continue" onSubmit={onSubmit} />
              </QuestionsForm>
            </View>
          </Preview>
          <CodeBlock
            code={`{
  type: 'select',
  optionsDefaultStyle: 'check',
  disableUnselect: true,
  options: [
    { value: 'short', text: 'Short-term returns' },
    { value: 'long', text: 'Long-term growth' },
  ],
}`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// SingleSelectCheckBox
// ─────────────────────────────────────────────────────────────

export const SingleSelectCheckBox: Story = {
  render: () => {
    const config: QuestionsFormConfig = {
      questions: [
        {
          id: 'q1',
          type: 'select',
          text: 'What is your risk tolerance?',
          optionsDefaultStyle: 'checkBox',
          disableUnselect: true,
          options: [
            { value: 'conservative', text: 'Very conservative', subText: 'Low tolerance for risk' },
            { value: 'moderate', text: 'Moderate', subText: 'Some tolerance for risk' },
            { value: 'aggressive', text: 'Aggressive', subText: 'High tolerance for risk' },
          ],
          validations: [{ required: true }],
        },
      ],
    };
    return (
      <Page>
        <Section>
          <Title>CheckBox Style (Single-Select)</Title>
          <Desc>Card with radio circle on right. Supports subText on options.</Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              <QuestionsForm config={config}>
                <QuestionsForm.Submit label="Continue" onSubmit={onSubmit} />
              </QuestionsForm>
            </View>
          </Preview>
          <CodeBlock
            code={`{
  type: 'select',
  optionsDefaultStyle: 'checkBox',
  options: [
    { value: 'conservative', text: 'Very conservative', subText: 'Low tolerance for risk' },
    { value: 'moderate', text: 'Moderate', subText: 'Some tolerance for risk' },
  ],
}`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// MultiSelectCheckRound
// ─────────────────────────────────────────────────────────────

export const MultiSelectCheckRound: Story = {
  render: () => {
    const config: QuestionsFormConfig = {
      questions: [
        {
          id: 'q1',
          type: 'select',
          text: 'What is your trading knowledge?',
          subText: "This doesn't apply to most people",
          isMultipleSelection: true,
          optionsDefaultStyle: 'checkRound',
          options: [
            { value: 'cert', text: 'Professional certificate', innerQuestionsIds: ['32>106.text'] },
            { value: 'degree', text: 'University degree' },
            { value: 'courses', text: 'Trading courses' },
            { value: 'none', text: 'None of these apply', behavior: 'unselectAll', optionDefaultStyle: 'check' },
          ],
          validations: [
            {
              required: true,
              errorMessage: 'This field is required',
              border: false,
            },
          ],
        },
      ],
      allQuestions: [
        {
          id: '32>106.text',
          type: 'input',
          inputType: 'text',
          placeholderText: 'Describe your role',
          isPersistValue: true,
          validations: [
            { required: true, errorMessage: 'This field is required' },
            { maxlength: 100, errorMessage: 'This field is too long' },
          ],
        },
      ],
    };
    return (
      <Page>
        <Section>
          <Title>CheckRound Style (Multi-Select)</Title>
          <Desc>Round checkbox on the left. Supports unselectAll behavior.</Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              <QuestionsForm config={config}>
                <QuestionsForm.Submit label="Continue" onSubmit={onSubmit} />
              </QuestionsForm>
            </View>
          </Preview>
          <CodeBlock
            code={`{
  type: 'select',
  isMultipleSelection: true,
  optionsDefaultStyle: 'checkRound',
  options: [
    { value: 'cert', text: 'Professional certificate' },
    { value: 'none', text: 'None of these apply', behavior: 'unselectAll' },
  ],
}`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// MultiSelectChips
// ─────────────────────────────────────────────────────────────

export const MultiSelectChips: Story = {
  render: () => {
    const otherInputQuestion: Question = {
      id: '15>105.text',
      type: 'input',
      inputType: 'text',
      placeholderText: 'Please specify',
      isPersistValue: true,
      validations: [
        { required: true, errorMessage: 'Please specify your answer' },
        { maxlength: 100, errorMessage: 'Text is too long' },
      ],
    };
    const selectQuestion: Question = {
      id: 'q1',
      type: 'select',
      text: 'What are you interested in?',
      isMultipleSelection: true,
      optionsDefaultStyle: 'chip',
      options: [
        { value: 'stocks', text: 'Stocks' },
        { value: 'crypto', text: 'Crypto' },
        { value: 'etf', text: 'ETFs' },
        { value: 'forex', text: 'Forex' },
        { value: 'commodities', text: 'Commodities' },
        { value: 'indices', text: 'Indices' },
        { value: 'other', text: 'Other', innerQuestionsIds: ['15>105.text'] },
      ],
      validations: [{ required: true }],
    };
    const config: QuestionsFormConfig = {
      questions: [selectQuestion],
      allQuestions: [selectQuestion, otherInputQuestion],
    };
    return (
      <Page>
        <Section>
          <Title>Chips Style (Multi-Select)</Title>
          <Desc>Compact pill/tag toggleable chips with an "Other" option that reveals an inner text input.</Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              <QuestionsForm config={config}>
                <QuestionsForm.Submit label="Continue" onSubmit={onSubmit} />
              </QuestionsForm>
            </View>
          </Preview>
          <CodeBlock
            code={`{
  type: 'select',
  isMultipleSelection: true,
  optionsDefaultStyle: 'chip',
  options: [
    { value: 'stocks', text: 'Stocks' },
    { value: 'crypto', text: 'Crypto' },
    { value: 'other', text: 'Other', innerQuestionsIds: ['other-input'] },
  ],
}
// Inner question (in allQuestions):
{ id: 'other-input', type: 'input', inputType: 'text', placeholderText: 'Please specify',
  validations: [{ required: true }, { maxlength: 100 }] }`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// AutocompleteQuestion
// ─────────────────────────────────────────────────────────────

export const AutocompleteQuestion: Story = {
  render: () => {
    const employerInput: Question = {
      id: '150',
      type: 'input',
      answerId: '350',
      placeholderText: 'Employer name',
      inputType: 'text',
      messages: [{ message: 'We never reach out to employers.', type: 'default', behavior: 'static' }],
      validations: [
        { required: true, errorMessage: 'Employer name is required' },
        { maxlength: 100, errorMessage: 'Text is too long' },
      ],
    };
    const industries = [
      'Finance Industry',
      'Public services',
      'Healthcare/Medical Services',
      'Legal Services/Public Safety',
      'Computer/IT Services',
      'Architecture/Engineering',
    ];
    const selectQuestion: Question = {
      id: 'q1',
      type: 'select',
      selectType: 'autoComplete',
      text: "What's your field of work?",
      subText: 'Please provide your current employment details.',
      placeholderText: 'Industry',
      options: industries.map((name) => ({
        value: name.toLowerCase().replace(/[\s/]+/g, '-'),
        text: name,
        sharedOuterQuestionsIds: ['150'],
      })),
      validations: [{ required: true, errorMessage: 'Please select an industry' }],
    };
    const config: QuestionsFormConfig = {
      questions: [selectQuestion],
      allQuestions: [selectQuestion, employerInput],
    };
    return (
      <Page>
        <Section>
          <Title>AutocompleteQuestion</Title>
          <Desc>Searchable dropdown with outer question revealed on selection.</Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              <QuestionsForm config={config}>
                <QuestionsForm.Submit label="Continue" onSubmit={onSubmit} />
              </QuestionsForm>
            </View>
          </Preview>
          <CodeBlock
            code={`{
  type: 'select',
  selectType: 'autoComplete',
  text: "What's your field of work?",
  placeholderText: 'Industry',
  options: [...].map(name => ({
    value: '...', text: name,
    sharedOuterQuestionsIds: ['150'],
  })),
  messages: [{ message: '...', type: 'default', behavior: 'static' }],
}`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// Messages
// ─────────────────────────────────────────────────────────────

export const Messages: Story = {
  render: () => {
    const config: QuestionsFormConfig = {
      questions: [
        {
          id: 'q1',
          type: 'select',
          text: 'Question with message variants',
          messages: [
            { message: 'Info message', type: 'info' },
            { message: 'Warning message', type: 'warning' },
            { message: 'Warning message with border', type: 'warning', border: true },
            { message: 'Error message', type: 'error' },
            { message: 'Error message with border', type: 'error', border: true },
          ],
          options: [
            {
              value: 'a',
              text: 'Option A',
              messages: [
                { message: 'Option error without border', type: 'error' },
                { message: 'Option warning with border', type: 'warning', border: true },
              ],
            },
            { value: 'b', text: 'Option B' },
          ],
          validations: [{ required: true }],
        },
      ],
    };
    return (
      <Page>
        <Section>
          <Title>Messages</Title>
          <Desc>Info, warning, error messages on questions and options.</Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              <QuestionsForm config={config}>
                <QuestionsForm.Submit label="Continue" onSubmit={onSubmit} />
              </QuestionsForm>
            </View>
          </Preview>
          <CodeBlock
            code={`messages: [
  { message: 'Info', type: 'info' },
  { message: 'Warning', type: 'warning' },
  { message: 'Warning with border', type: 'warning', border: true },
  { message: 'Error', type: 'error' },
  { message: 'Error with border', type: 'error', border: true },
]`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// ReadOnly
// ─────────────────────────────────────────────────────────────

export const ReadOnly: Story = {
  render: () => {
    const config: QuestionsFormConfig = {
      questions: [
        {
          id: 'q1',
          type: 'select',
          text: 'Persisted read-only multi-select',
          isMultipleSelection: true,
          optionsDefaultStyle: 'checkRound',
          value: ['cert', 'courses'],
          readOnly: true,
          options: [
            { value: 'cert', text: 'Professional certificate' },
            { value: 'degree', text: 'University degree' },
            { value: 'courses', text: 'Trading courses' },
            { value: 'none', text: 'None of these apply' },
          ],
          validations: [],
        },
      ],
    };
    return (
      <Page>
        <Section>
          <Title>ReadOnly</Title>
          <Desc>Persisted read-only multi-select. Selected options are highlighted but cannot be changed.</Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              <QuestionsForm config={config}>
                <QuestionsForm.Submit label="Next" onSubmit={onSubmit} />
              </QuestionsForm>
            </View>
          </Preview>
          <CodeBlock
            code={`{
  type: 'select',
  isMultipleSelection: true,
  optionsDefaultStyle: 'checkRound',
  value: ['cert', 'courses'],
  readOnly: true,
  options: [
    { value: 'cert', text: 'Professional certificate' },
    { value: 'degree', text: 'University degree' },
    { value: 'courses', text: 'Trading courses' },
    { value: 'none', text: 'None of these apply' },
  ],
}`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// PersistValue
// ─────────────────────────────────────────────────────────────

export const PersistValue: Story = {
  render: () => {
    const config: QuestionsFormConfig = {
      questions: [
        {
          id: '18',
          type: 'select',
          isMultipleSelection: false,
          selectType: 'autoComplete',
          disableUnselect: true,
          placeholderText: 'occupation.primaryOccupation',
          text: 'occupation.title',
          subText: 'occupation.subText',
          value: '110',
          options: [
            { value: '110', text: 'financialStatus.occupationAccounting', sharedOuterQuestionsIds: ['150'] },
            { value: '131', text: 'financialStatus.agricultural', sharedOuterQuestionsIds: ['150'] },
            { value: '70', text: 'financialStatus.occupationArchitecture', sharedOuterQuestionsIds: ['150'] },
            { value: '77', text: 'financialStatus.occupationStudent' },
            { value: '111', text: 'financialStatus.occupationDefenseArms', sharedOuterQuestionsIds: ['150'] },
            { value: '82', text: 'financialStatus.occupationNone' },
          ],
          validations: [{ required: true, errorMessage: 'occupation.primaryOccupationRequired' }],
        },
      ],
      allQuestions: [
        {
          id: '150',
          type: 'input',
          inputType: 'text',
          placeholderText: 'occupation.employerName',
          value: 'eToro',
          validations: [
            { required: true, errorMessage: 'occupation.employerNameRequired' },
            { maxlength: 100, errorMessage: 'questionnaire.textTooLongError' },
          ],
        },
      ],
    };
    return (
      <Page>
        <Section>
          <Title>PersistValue</Title>
          <Desc>
            Autocomplete select with a persisted industry and a persisted employer name input. Uses the occupation config with
            sharedOuterQuestionsIds.
          </Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              <QuestionsFormTextProvider resolver={storyTextResolver}>
                <QuestionsForm config={config}>
                  <QuestionsForm.Submit label="Continue" onSubmit={onSubmit} />
                </QuestionsForm>
              </QuestionsFormTextProvider>
            </View>
          </Preview>
          <CodeBlock
            code={`{
  questions: [{
    id: '18',
    type: 'select',
    selectType: 'autoComplete',
    value: '110', // persisted industry
    options: [
      { value: '110', text: 'Accounting / Finance', sharedOuterQuestionsIds: ['150'] },
      { value: '77', text: 'Student' }, // no employer input
    ],
  }],
  allQuestions: [{
    id: '150',
    type: 'input',
    inputType: 'text',
    value: 'eToro', // persisted employer name
    placeholderText: 'Employer name',
  }],
}`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// PersistValueWithValidationError
// ─────────────────────────────────────────────────────────────

const INELIGIBLE_INDUSTRY = '82'; // Unemployed

const persistValueValidatorRegistry: QuestionValidatorRegistry = {
  get(name: string) {
    if (name === 'eligibleIndustry') {
      return (value) => (value === INELIGIBLE_INDUSTRY ? 'Unemployed individuals are not eligible to open a trading account.' : null);
    }
    if (name === 'totalWorth') {
      return (value, question) => {
        const options = (question as { options?: { value: string; amount?: number }[] }).options ?? [];
        const selected = options.find((o) => o.value === value);
        if (selected?.amount != null && selected.amount > 50000) {
          return 'Your liquid assets exceed the threshold. Please review your deposit plan.';
        }
        return null;
      };
    }
    return undefined;
  },
};

export const PersistValueWithValidationError: Story = {
  render: function PersistValueWithValidationErrorStory() {
    const configs: QuestionsFormConfig[] = [
      {
        id: 'step_occupation',
        questions: [
          {
            id: '18',
            type: 'select',
            isMultipleSelection: false,
            selectType: 'autoComplete',
            disableUnselect: true,
            placeholderText: 'Industry',
            text: "What's your field of work?",
            subText: 'Please provide your current employment details.',
            value: INELIGIBLE_INDUSTRY,
            options: [
              { value: '110', text: 'Supported industry' },
              { value: '82', text: 'Unsupported industry' },
            ],
            validations: [
              { required: true, errorMessage: 'Please select an industry' },
              {
                custom: [
                  {
                    name: 'eligibleIndustry',
                    errorMessage: 'Unemployed individuals are not eligible to open a trading account.',
                    border: false,
                    icon: 'exclamation-triangle',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'step_liquid_assets',
        questions: [
          {
            id: '11',
            type: 'select',
            isMultipleSelection: false,
            optionsDefaultStyle: 'check',
            disableUnselect: true,
            text: 'What are your total liquid assets?',
            subText: 'Cash, savings, and investments you can quickly convert to cash.',
            value: '79', // persisted — $200,001–$500,000 (amount: 500000, triggers totalWorth)
            options: [
              { value: '81', text: 'Over $1,000,000', amount: 5000000 },
              { value: '80', text: '$500,001 – $1,000,000', amount: 1000000 },
              { value: '79', text: '$200,001 – $500,000', amount: 500000 },
              { value: '36', text: '$50,001 – $200,000', amount: 200000 },
              { value: '35', text: '$10,001 – $50,000', amount: 50000 },
              { value: '34', text: 'Up to $10,000', amount: 10000 },
            ],
            validations: [
              { required: true, errorMessage: 'Please select an option', border: false },
              {
                custom: [
                  {
                    name: 'totalWorth',
                    errorMessage: 'Your liquid assets exceed the threshold. Please review your deposit plan.',
                    border: true,
                    icon: 'exclamation-triangle',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const { c } = useTheme();
    const [step, setStep] = useState(0);
    const answersRef = useRef<Record<number, QuestionsFormValues>>({});

    const handleSubmit = useCallback(
      (values: QuestionsFormValues) => {
        answersRef.current[step] = values;
        if (step < configs.length - 1) {
          setStep((s) => s + 1);
        } else {
          Alert.alert('Done', JSON.stringify(answersRef.current, null, 2));
        }
      },
      [step, configs.length],
    );

    const handleBack = useCallback(() => {
      if (step > 0) setStep((s) => s - 1);
    }, [step]);

    const currentConfig = configs[step];
    const savedValues = answersRef.current[step];

    const configWithValues: QuestionsFormConfig = savedValues
      ? { ...currentConfig, questions: applyAnswersToQuestions(currentConfig.questions, savedValues) ?? currentConfig.questions }
      : currentConfig;

    return (
      <Page>
        <Section>
          <Title>PersistValue — Validation Error</Title>
          <Desc>{`Step ${step + 1} of ${configs.length} — ${currentConfig.id}`}</Desc>
          <Desc>
            Each step has a persisted value that fails a custom validator on mount. The error fires immediately with a caution icon and border.
          </Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              {step > 0 && (
                <Pressable onPress={handleBack} style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 12 }}>
                  <Text style={{ color: c.accent, fontSize: 16 }}>← Back</Text>
                </Pressable>
              )}
              <QuestionsForm key={step} config={configWithValues} validatorRegistry={persistValueValidatorRegistry}>
                <QuestionsForm.Submit label={step < configs.length - 1 ? 'Continue' : 'Finish'} onSubmit={handleSubmit} />
              </QuestionsForm>
            </View>
          </Preview>
          <CodeBlock
            code={`// Custom validator registry
const validatorRegistry: QuestionValidatorRegistry = {
  get(name) {
    if (name === 'eligibleIndustry') {
      return (value) => value === '82' ? 'Unemployed individuals are not eligible...' : null;
    }
    if (name === 'totalWorth') {
      return (value, question) => {
        const opt = question.options?.find((o) => o.value === value);
        return opt?.amount > 50000 ? 'Your liquid assets exceed the threshold...' : null;
      };
    }
    return undefined;
  },
};`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// AutoSubmit
// ─────────────────────────────────────────────────────────────
// These stories intentionally use the shared `isAutoSubmit` util from `etoro-ui/questions-form`.
// They do not define a local auto-submit predicate.

export const AutoSubmitSingleSelect: Story = {
  render: () => {
    const config: QuestionsFormConfig = {
      questions: [
        {
          id: 'q1',
          type: 'select',
          text: 'What is your trading strategy?',
          optionsDefaultStyle: 'check',
          disableUnselect: true,
          options: [
            { value: 'day', text: 'Day trader' },
            { value: 'position', text: 'Position trader' },
            { value: 'long', text: 'Long-term investor' },
          ],
          validations: [{ required: true }],
        },
      ],
    };
    return (
      <Page>
        <Section>
          <Title>Auto-Submit (Single-Select)</Title>
          <Desc>Single-select with `optionsDefaultStyle: 'check'`.</Desc>
          <Desc>CTA is hidden initially. Selecting any option auto-submits. After the first auto-submit, later changes use manual mode.</Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              <QuestionsForm config={config}>
                <QuestionsForm.Submit label="Continue" onSubmit={onSubmit} isAutoSubmit={isAutoSubmit} />
              </QuestionsForm>
            </View>
          </Preview>
        </Section>
      </Page>
    );
  },
};

export const AutoSubmitMultiSelectCheck: Story = {
  render: () => {
    const config: QuestionsFormConfig = {
      questions: [
        {
          id: 'q1',
          type: 'select',
          text: 'What is your trading knowledge?',
          subText: 'Select all that apply',
          isMultipleSelection: true,
          optionsDefaultStyle: 'checkRound',
          options: [
            { value: 'cert', text: 'Professional certificate' },
            { value: 'degree', text: 'University degree' },
            { value: 'courses', text: 'Trading courses' },
            { value: 'none', text: 'None of these apply', behavior: 'unselectAll', optionDefaultStyle: 'check' },
          ],
          validations: [{ required: true }],
        },
      ],
    };
    return (
      <Page>
        <Section>
          <Title>Auto-Submit (Multi-Select with Check Option)</Title>
          <Desc>Multi-select with mixed styles: `checkRound` options plus one `check` option.</Desc>
          <Desc>Empty selection hides the CTA. Selecting `checkRound` options shows it. Selecting the `check` option auto-submits.</Desc>
          <Desc>Clearing all `checkRound` selections hides the CTA again. After the first auto-submit, later changes use manual mode.</Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              <QuestionsForm config={config}>
                <QuestionsForm.Submit label="Continue" onSubmit={onSubmit} isAutoSubmit={isAutoSubmit} />
              </QuestionsForm>
            </View>
          </Preview>
          <CodeBlock
            code={`// Multi-select: regular options show the button, but the 'check' option auto-submits
{
  type: 'select',
  isMultipleSelection: true,
  optionsDefaultStyle: 'checkRound',
  options: [
    { value: 'cert', text: 'Professional certificate' },
    { value: 'degree', text: 'University degree' },
    { value: 'none', text: 'None of these apply', behavior: 'unselectAll', optionDefaultStyle: 'check' },
  ],
}`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// Translations (shared by FullConfig & TextProvider)
// ─────────────────────────────────────────────────────────────

const translations: Record<string, string> = {
  // PEP exposure (q32)
  'pepQuestions.title': 'Are you or a family member a politically exposed person?',
  'pepQuestions.subtitle': 'A PEP is someone in a prominent public role, or a close associate or family member of one.',
  'pepQuestions.Q1': 'I am a PEP',
  'pepQuestions.Q2': 'A family member is a PEP',
  'pepQuestions.Q3': 'A close associate is a PEP',
  'pepQuestions.Q5': 'None of these apply',
  'pepQuestions.Q1placeholder': 'Describe your role',
  'pepQuestions.Q2placeholder': 'Describe their role',
  'pepQuestions.Q3placeholder': 'Describe the association',
  'pepQuestions.textError': 'Please provide details',

  // Purpose of trading (q8)
  'purposeOfTrading.header': 'What is your main purpose of trading?',
  'purposeOfTrading.subtitle': 'This helps us tailor your experience.',
  'purposeOfTrading.shortTermAnswer': 'Short-term trading profits',
  'purposeOfTrading.additionalRevenueAnswer': 'Additional source of revenue',
  'purposeOfTrading.futurePlaningAnswer': 'Planning for the future',
  'purposeOfTrading.SavingHomeAnswer': 'Saving for a home',
  'purposeOfTrading.CryptoTradingAndOrConversion': 'Crypto trading / conversion',

  // Attitude to risk (q9)
  'attitudeToRisk.header': 'What is your attitude to risk?',
  'attitudeToRisk.subtitle': 'This helps us understand your risk profile.',
  'attitudeToRisk.option1': 'Very conservative',
  'attitudeToRisk.option1SubText': 'Prefer to avoid risk entirely',
  'attitudeToRisk.option2': 'Conservative',
  'attitudeToRisk.option2SubText': 'Accept minimal risk for modest returns',
  'attitudeToRisk.option3': 'Moderate',
  'attitudeToRisk.option3SubText': 'Comfortable with some risk',
  'attitudeToRisk.option4': 'Aggressive',
  'attitudeToRisk.option4SubText': 'Willing to accept higher risk for higher returns',
  'attitudeToRisk.option5': 'Very aggressive',
  'attitudeToRisk.option5SubText': 'Comfortable with significant risk',

  // Main income source (q15)
  'mainIncomeSource.title': 'What are your main sources of income?',
  'mainIncomeSource.subtitle': 'Select all that apply.',
  'mainIncomeSource.salary': 'Salary / Employment',
  'mainIncomeSource.investments': 'Investments',
  'mainIncomeSource.savings': 'Savings',
  'mainIncomeSource.pension': 'Pension',
  'mainIncomeSource.inheritance': 'Inheritance / Gift',
  'mainIncomeSource.socialSecurity': 'Social security',
  'mainIncomeSource.familyIncome': 'Family income',
  'mainIncomeSource.severance': 'Severance',
  'mainIncomeSource.cryptoRelatedGains': 'Crypto-related gains',
  'mainIncomeSource.other': 'Other',
  'mainIncomeSource.otherPlaceholder': 'Please specify',
  'mainIncomeSource.errorOther': 'Please specify your income source',

  // Occupation (q18)
  'occupation.title': 'What’s your field of work?',
  'occupation.subText': 'Please provide your current employment details.',
  'occupation.primaryOccupation': 'Industry',
  'occupation.primaryOccupationRequired': 'Please select an industry',
  'occupation.employerName': 'Employer name',
  'occupation.employerNameRequired': 'Employer name is required',
  'financialStatus.occupationAccounting': 'Accounting / Finance',
  'financialStatus.agricultural': 'Agriculture',
  'financialStatus.occupationArchitecture': 'Architecture / Engineering',
  'financialStatus.occupationStudent': 'Student',
  'financialStatus.occupationDefenseArms': 'Defense / Arms',
  'financialStatus.occupationNone': 'Unemployed',

  // Liquid assets (q11) — also used by TextProvider / other stories
  'liquidAssets.title': 'What are your total liquid assets?',
  'liquidAssets.subTitle': 'Cash, savings, and investments you can quickly convert to cash.',
  'liquidAssets.OverOneM': 'Over $1,000,000',
  'liquidAssets.OneM': '$500,001 – $1,000,000',
  'liquidAssets.FiveHundredK': '$200,001 – $500,000',
  'liquidAssets.TwoHundredK': '$50,001 – $200,000',
  'liquidAssets.FiftyK': '$10,001 – $50,000',
  'liquidAssets.TenK': 'Up to $10,000',

  // Shared
  'trustBuilder.financialDisclaimer':
    'Financial regulations require us to collect this information. We use bank-grade encryption to keep your data secure.',
  'questionnaire.requiredFieldError': 'Please select an option',
  'questionnaire.textTooLongError': 'Text is too long',
};

class StoryTextResolver implements QuestionsFormTextResolver {
  resolveText(text: string | undefined): string {
    if (!text) return '';
    return translations[text] ?? text;
  }
}

const storyTextResolver = new StoryTextResolver();

// ─────────────────────────────────────────────────────────────
// FullConfig
// ─────────────────────────────────────────────────────────────

export const FullConfig: Story = {
  render: function FullConfigStory() {
    const configs: QuestionsFormConfig[] = [
      {
        id: 'questionnaire_investment-risks_8',
        questions: [
          {
            id: '8',
            type: 'select',
            isMultipleSelection: false,
            options: [
              { value: '19', text: 'purposeOfTrading.shortTermAnswer' },
              { value: '20', text: 'purposeOfTrading.additionalRevenueAnswer' },
              { value: '21', text: 'purposeOfTrading.futurePlaningAnswer' },
              { value: '22', text: 'purposeOfTrading.SavingHomeAnswer' },
              { value: '903', text: 'purposeOfTrading.CryptoTradingAndOrConversion' },
            ],
            optionsDefaultStyle: 'check',
            disableUnselect: true,
            text: 'purposeOfTrading.header',
            subText: 'purposeOfTrading.subtitle',
            validations: [{ required: true, errorMessage: 'questionnaire.requiredFieldError' }],
          },
        ],
      },
      {
        id: 'questionnaire_investment-risks_9',
        questions: [
          {
            id: '9',
            type: 'select',
            isMultipleSelection: false,
            options: [
              { value: '23', text: 'attitudeToRisk.option1', subText: 'attitudeToRisk.option1SubText' },
              { value: '24', text: 'attitudeToRisk.option2', subText: 'attitudeToRisk.option2SubText' },
              { value: '25', text: 'attitudeToRisk.option3', subText: 'attitudeToRisk.option3SubText' },
              { value: '26', text: 'attitudeToRisk.option4', subText: 'attitudeToRisk.option4SubText' },
              { value: '27', text: 'attitudeToRisk.option5', subText: 'attitudeToRisk.option5SubText' },
            ],
            optionsDefaultStyle: 'checkBox',
            disableUnselect: true,
            text: 'attitudeToRisk.header',
            subText: 'attitudeToRisk.subtitle',
            validations: [{ required: true, errorMessage: 'questionnaire.requiredFieldError' }],
          },
        ],
      },
      {
        id: 'questionnaire_pep-exposure_32',
        questions: [
          {
            id: '32',
            type: 'select',
            isMultipleSelection: true,
            options: [
              { value: '106', text: 'pepQuestions.Q1', innerQuestionsIds: ['32>106.text'] },
              { value: '107', text: 'pepQuestions.Q2', innerQuestionsIds: ['32>107.text'] },
              { value: '108', text: 'pepQuestions.Q3', innerQuestionsIds: ['32>108.text'] },
              { value: '109', text: 'pepQuestions.Q5', optionDefaultStyle: 'check', behavior: 'unselectAll' },
            ],
            optionsDefaultStyle: 'checkRound',
            disableUnselect: false,
            text: 'pepQuestions.title',
            subText: 'pepQuestions.subtitle',
            validations: [{ required: true, errorMessage: 'questionnaire.requiredFieldError' }],
          },
        ],
        allQuestions: [
          {
            id: '32>106.text',
            type: 'input',
            inputType: 'text',
            placeholderText: 'pepQuestions.Q1placeholder',
            isPersistValue: true,
            validations: [
              { required: true, errorMessage: 'pepQuestions.textError' },
              { maxlength: 100, errorMessage: 'questionnaire.textTooLongError' },
            ],
          },
          {
            id: '32>107.text',
            type: 'input',
            inputType: 'text',
            placeholderText: 'pepQuestions.Q2placeholder',
            isPersistValue: true,
            validations: [
              { required: true, errorMessage: 'pepQuestions.textError' },
              { maxlength: 100, errorMessage: 'questionnaire.textTooLongError' },
            ],
          },
          {
            id: '32>108.text',
            type: 'input',
            inputType: 'text',
            placeholderText: 'pepQuestions.Q3placeholder',
            isPersistValue: true,
            validations: [
              { required: true, errorMessage: 'pepQuestions.textError' },
              { maxlength: 100, errorMessage: 'questionnaire.textTooLongError' },
            ],
          },
        ],
      },
      {
        id: 'questionnaire_financial_15',
        questions: [
          {
            id: '15',
            type: 'select',
            isMultipleSelection: true,
            options: [
              { value: '63', text: 'mainIncomeSource.salary' },
              { value: '64', text: 'mainIncomeSource.investments' },
              { value: '47', text: 'mainIncomeSource.savings' },
              { value: '65', text: 'mainIncomeSource.pension' },
              { value: '45', text: 'mainIncomeSource.inheritance' },
              { value: '89', text: 'mainIncomeSource.socialSecurity' },
              { value: '90', text: 'mainIncomeSource.familyIncome' },
              { value: '91', text: 'mainIncomeSource.severance' },
              { value: '904', text: 'mainIncomeSource.cryptoRelatedGains' },
              { value: '105', text: 'mainIncomeSource.other', innerQuestionsIds: ['15>105.text'] },
            ],
            optionsDefaultStyle: 'chip',
            disableUnselect: false,
            text: 'mainIncomeSource.title',
            subText: 'mainIncomeSource.subtitle',
            messages: [{ message: 'trustBuilder.financialDisclaimer', type: 'info', behavior: 'static' }],
            validations: [{ required: true, errorMessage: 'questionnaire.requiredFieldError' }],
          },
        ],
        allQuestions: [
          {
            id: '15>105.text',
            type: 'input',
            inputType: 'text',
            placeholderText: 'mainIncomeSource.otherPlaceholder',
            isPersistValue: true,
            validations: [
              { required: true, errorMessage: 'mainIncomeSource.errorOther' },
              { maxlength: 100, errorMessage: 'questionnaire.textTooLongError' },
            ],
          },
        ],
      },
      {
        id: 'questionnaire_financial_18',
        questions: [
          {
            id: '18',
            type: 'select',
            isMultipleSelection: false,
            selectType: 'autoComplete',
            disableUnselect: true,
            placeholderText: 'occupation.primaryOccupation',
            text: 'occupation.title',
            subText: 'occupation.subText',
            messages: [{ message: 'trustBuilder.financialDisclaimer', type: 'info', behavior: 'static' }],
            options: [
              { value: '110', text: 'financialStatus.occupationAccounting', sharedOuterQuestionsIds: ['150'] },
              { value: '131', text: 'financialStatus.agricultural', sharedOuterQuestionsIds: ['150'] },
              { value: '70', text: 'financialStatus.occupationArchitecture', sharedOuterQuestionsIds: ['150'] },
              { value: '77', text: 'financialStatus.occupationStudent' },
              { value: '111', text: 'financialStatus.occupationDefenseArms', sharedOuterQuestionsIds: ['150'] },
              { value: '82', text: 'financialStatus.occupationNone' },
            ],
            validations: [{ required: true, errorMessage: 'occupation.primaryOccupationRequired' }],
          },
        ],
        allQuestions: [
          {
            id: '150',
            type: 'input',
            inputType: 'text',
            placeholderText: 'occupation.employerName',
            validations: [
              { required: true, errorMessage: 'occupation.employerNameRequired' },
              { maxlength: 100, errorMessage: 'questionnaire.textTooLongError' },
            ],
          },
        ],
      },
    ];

    const { c } = useTheme();
    const [step, setStep] = useState(0);
    const answersRef = useRef<Record<number, QuestionsFormValues>>({});

    const handleSubmit = useCallback(
      (values: QuestionsFormValues) => {
        answersRef.current[step] = values;
        if (step < configs.length - 1) {
          setStep((s) => s + 1);
        } else {
          Alert.alert('Done', JSON.stringify(answersRef.current, null, 2));
        }
      },
      [step, configs.length],
    );

    const handleBack = useCallback(() => {
      if (step > 0) setStep((s) => s - 1);
    }, [step]);

    const currentConfig = configs[step];
    const savedValues = answersRef.current[step];

    const configWithValues: QuestionsFormConfig = savedValues
      ? {
          ...currentConfig,
          questions: applyAnswersToQuestions(currentConfig.questions, savedValues) ?? currentConfig.questions,
          allQuestions: applyAnswersToQuestions(currentConfig.allQuestions, savedValues),
        }
      : currentConfig;

    return (
      <Page>
        <Section>
          <Title>FullConfig</Title>
          <Desc>{`Step ${step + 1} of ${configs.length} — ${currentConfig.id ?? ''}`}</Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              {step > 0 && (
                <Pressable onPress={handleBack} style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 12 }}>
                  <Text style={{ color: c.accent, fontSize: 16 }}>← Back</Text>
                </Pressable>
              )}
              <QuestionsFormTextProvider resolver={storyTextResolver}>
                <QuestionsForm key={step} config={configWithValues}>
                  <QuestionsForm.Submit
                    onSubmit={handleSubmit}
                    isAutoSubmit={isAutoSubmit}
                    label={step < configs.length - 1 ? 'Continue' : 'Finish'}
                  />
                </QuestionsForm>
              </QuestionsFormTextProvider>
            </View>
          </Preview>
        </Section>
      </Page>
    );
  },
};

export const TextProvider: Story = {
  render: () => {
    const config: QuestionsFormConfig = {
      questions: [
        {
          id: '11',
          type: 'select',
          isMultipleSelection: false,
          options: [
            { value: '81', text: 'liquidAssets.OverOneM' },
            { value: '80', text: 'liquidAssets.OneM' },
            { value: '79', text: 'liquidAssets.FiveHundredK' },
            { value: '36', text: 'liquidAssets.TwoHundredK' },
            { value: '35', text: 'liquidAssets.FiftyK' },
            { value: '34', text: 'liquidAssets.TenK' },
          ],
          optionsDefaultStyle: 'check',
          disableUnselect: true,
          text: 'liquidAssets.title',
          subText: 'liquidAssets.subTitle',
          messages: [{ message: 'trustBuilder.financialDisclaimer', type: 'info', behavior: 'static' }],
          validations: [{ required: true, errorMessage: 'questionnaire.requiredFieldError' }],
        },
      ],
    };

    return (
      <Page>
        <Section>
          <Title>TextProvider (DI pattern)</Title>
          <Desc>
            Wrap QuestionsForm with QuestionsFormTextProvider to supply text resolution via context instead of config.getText. All child components
            resolve text keys through the provider — no prop drilling needed.
          </Desc>
          <Preview>
            <View style={{ height: FORM_HEIGHT }}>
              <QuestionsFormTextProvider resolver={storyTextResolver}>
                <QuestionsForm config={config}>
                  <QuestionsForm.Submit label="Continue" onSubmit={onSubmit} />
                </QuestionsForm>
              </QuestionsFormTextProvider>
            </View>
          </Preview>
          <CodeBlock
            code={`import {
  QuestionsForm,
  QuestionsFormTextProvider,
  type QuestionsFormTextResolver,
  type QuestionsFormConfig,
} from 'etoro-ui/questions-form';

class MyTextResolver implements QuestionsFormTextResolver {
  resolveText(text: string | undefined): string {
    if (!text) return '';
    return i18n.t(text) ?? text;
  }
}

const resolver = new MyTextResolver();

const config: QuestionsFormConfig = {
  questions: [
    {
      id: '11',
      type: 'select',
      text: 'liquidAssets.title', // resolved by provider
      subText: 'liquidAssets.subTitle',
      messages: [{ message: 'trustBuilder.financialDisclaimer', type: 'info', behavior: 'static' }],
      options: [
        { value: '81', text: 'liquidAssets.OverOneM' },
        { value: '34', text: 'liquidAssets.TenK' },
      ],
    },
  ],
};

<QuestionsFormTextProvider resolver={resolver}>
  <QuestionsForm config={config}>
    <QuestionsForm.Submit onSubmit={handleSubmit} />
  </QuestionsForm>
</QuestionsFormTextProvider>`}
          />
        </Section>
      </Page>
    );
  },
};

// ─────────────────────────────────────────────────────────────
// APIReference (ALWAYS LAST)
// ─────────────────────────────────────────────────────────────

export const APIReference: Story = {
  render: () => (
    <Page>
      <Section>
        <Title>API Reference</Title>
      </Section>

      <Section>
        <SubTitle>QuestionsForm</SubTitle>
        <Desc>Config-driven questionnaire form. Renders one question at a time. Supports select (single/multi), input, and autocomplete.</Desc>
        <PropsTable
          data={[
            { prop: 'config', type: 'QuestionsFormConfig', default: '-' },
            { prop: 'onValuesChange', type: '(diff: QuestionsFormValuesDiff) => void', default: '-' },
            { prop: 'validatorRegistry', type: 'QuestionValidatorRegistry', default: '-' },
            { prop: 'children', type: 'ReactNode (QuestionsForm.Submit)', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>QuestionsForm.Submit</SubTitle>
        <Desc>Compound component that controls the submit button and auto-submit behavior.</Desc>
        <PropsTable
          data={[
            { prop: 'onSubmit', type: '(values: QuestionsFormValues) => void', default: '-' },
            {
              prop: 'isAutoSubmit',
              type: '(question: Question, values: QuestionsFormValues, isValid: boolean, isDirty: boolean) => boolean',
              default: '-',
            },
            { prop: 'label', type: 'string', default: '-' },
            { prop: 'children', type: 'ReactNode', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>QuestionsFormConfig</SubTitle>
        <PropsTable
          data={[
            { prop: 'questions', type: 'Question[]', default: '-' },
            { prop: 'allQuestions', type: 'Question[]', default: 'questions' },
            { prop: 'textAsKeys', type: 'boolean', default: 'false' },
            { prop: 'getText', type: '(key: string) => string', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>QuestionsFormTextProvider</SubTitle>
        <Desc>Context provider for text resolution (DI pattern). Wrap QuestionsForm to supply translations without prop drilling.</Desc>
        <PropsTable
          data={[
            { prop: 'resolver', type: 'QuestionsFormTextResolver', default: '-' },
            { prop: 'children', type: 'ReactNode', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>QuestionsFormTextResolver</SubTitle>
        <Desc>Interface for the text resolver class/object provided to QuestionsFormTextProvider.</Desc>
        <PropsTable data={[{ prop: 'resolveText', type: '(text: string | undefined) =&gt; string', default: '-' }]} />
      </Section>

      <Section>
        <SubTitle>Question (select)</SubTitle>
        <PropsTable
          data={[
            { prop: 'id', type: 'string', default: '-' },
            { prop: 'type', type: '"select"', default: '-' },
            { prop: 'text', type: 'string', default: '-' },
            { prop: 'options', type: 'QuestionOption[]', default: '-' },
            { prop: 'isMultipleSelection', type: 'boolean', default: 'false' },
            { prop: 'selectType', type: '"default" | "autoComplete"', default: '"default"' },
            { prop: 'optionsDefaultStyle', type: '"check" | "checkBox" | "checkRound" | "chip"', default: '-' },
            { prop: 'disableUnselect', type: 'boolean', default: 'false' },
            { prop: 'validations', type: 'QuestionValidation[]', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>Question (input)</SubTitle>
        <PropsTable
          data={[
            { prop: 'id', type: 'string', default: '-' },
            { prop: 'type', type: '"input"', default: '-' },
            { prop: 'text', type: 'string', default: '-' },
            { prop: 'inputType', type: '"text" | "number" | "textbox"', default: '-' },
            { prop: 'placeholderText', type: 'string', default: '-' },
            { prop: 'validations', type: 'QuestionValidation[]', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>QuestionOption</SubTitle>
        <PropsTable
          data={[
            { prop: 'value', type: 'string', default: '-' },
            { prop: 'text', type: 'string', default: '-' },
            { prop: 'subText', type: 'string', default: '-' },
            { prop: 'optionDefaultStyle', type: '"check" | "checkBox" | "checkRound" | "chip"', default: '-' },
            { prop: 'behavior', type: '"unselectAll"', default: '-' },
            { prop: 'innerQuestionsIds', type: 'string[]', default: '-' },
            { prop: 'sharedOuterQuestionsIds', type: 'string[]', default: '-' },
            { prop: 'messages', type: 'QuestionMessage[]', default: '-' },
          ]}
        />
      </Section>

      <Section>
        <SubTitle>QuestionValidation</SubTitle>
        <PropsTable
          data={[
            { prop: 'required', type: 'true', default: '-' },
            { prop: 'minlength', type: 'number', default: '-' },
            { prop: 'maxlength', type: 'number', default: '-' },
            { prop: 'pattern', type: 'string', default: '-' },
            { prop: 'errorMessage', type: 'string', default: '-' },
          ]}
        />
      </Section>
    </Page>
  ),
};
