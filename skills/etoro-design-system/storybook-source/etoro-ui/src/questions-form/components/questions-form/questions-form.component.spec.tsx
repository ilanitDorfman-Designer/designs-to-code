import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { createRef, type ReactNode } from 'react';
import { useController } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

import type { QuestionRendererProps } from '../../contexts';
import type { OptionsQuestion, QuestionsFormConfig } from '../../interfaces';
import { isAutoSubmit } from '../../utils';
import { QuestionsForm, type QuestionsFormRef } from './questions-form.component';

// ---------------------------------------------------------------------------
// Mocks — keep the test focused on onSubmit meta, not on the heavy EtScreen /
// QuestionRenderer trees. Reanimated is already globally mocked by the shared
// RN test setup (see libs/common/testing/react).
// ---------------------------------------------------------------------------

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children?: ReactNode }) => children,
}));

jest.mock('../../../components/screen/subcomponents/screen-content-renderer', () => ({
  ET_SCREEN_CONTENT_SAFE_AREA_EDGES: [],
}));

jest.mock('../../../components/screen/et-screen', () => {
  const ReactLib = require('react');
  const { View, Text: RNText, Pressable: RNPressable } = require('react-native');

  const EtScreen = ({ children }: { children?: ReactNode }) => ReactLib.createElement(View, null, children);
  EtScreen.ScrollView = ({ children }: { children?: ReactNode }) => ReactLib.createElement(View, null, children);

  const Content = ({ children }: { children?: ReactNode }) => ReactLib.createElement(View, null, children);
  Content.Title = ({ children }: { children?: ReactNode }) => ReactLib.createElement(RNText, null, children);
  Content.Subtitle = ({ children }: { children?: ReactNode }) => ReactLib.createElement(RNText, null, children);
  Content.Body = ({ children }: { children?: ReactNode }) => ReactLib.createElement(View, null, children);
  EtScreen.Content = Content;

  const Footer = ({ children }: { children?: ReactNode }) => ReactLib.createElement(View, null, children);
  Footer.Primary = ({ children, onPress, testID, disabled }: Record<string, unknown>) =>
    ReactLib.createElement(
      RNPressable,
      { onPress, testID, disabled, accessibilityRole: 'button' },
      ReactLib.createElement(RNText, null, children as ReactNode),
    );
  EtScreen.Footer = Footer;

  return { EtScreen };
});

// The default question renderer pulls in the whole select/input/autocomplete
// stack — the specs below always supply their own lightweight `renderer`.
jest.mock('../question-renderer', () => ({ QuestionRenderer: () => null }));
jest.mock('../question-header', () => ({ QuestionHeader: () => null }));
jest.mock('../question-message-box', () => ({ QuestionMessageBox: () => null }));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Minimal renderer that exposes a press target which selects the question's
 * first option — enough to drive value changes without the real UI kit.
 */
function TestRenderer({ question, control, getFieldName, getFieldRules }: QuestionRendererProps) {
  const name = getFieldName(question);
  const { field } = useController({ name, control, rules: getFieldRules?.(question) });
  const firstOption = (question as OptionsQuestion).options?.[0]?.value ?? 'a';
  return (
    <Pressable testID={`pick-${question.id}`} onPress={() => field.onChange(firstOption)}>
      <Text>pick</Text>
    </Pressable>
  );
}

const createSingleSelectConfig = (overrides?: Partial<OptionsQuestion>): QuestionsFormConfig => ({
  questions: [
    {
      id: 'q1',
      type: 'select',
      text: 'Pick one',
      optionsDefaultStyle: 'check',
      disableUnselect: true,
      options: [
        { value: 'a', text: 'Option A' },
        { value: 'b', text: 'Option B' },
      ],
      validations: [],
      ...overrides,
    } as OptionsQuestion,
  ],
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('QuestionsForm — onSubmit meta', () => {
  describe('manual submit (button press)', () => {
    it('GIVEN a manual submit footer WHEN the submit button is pressed THEN onSubmit fires with isAutoSubmit false', async () => {
      const onSubmit = jest.fn();
      const config = createSingleSelectConfig();

      const { getByTestId } = render(
        <QuestionsForm config={config} renderer={TestRenderer}>
          <QuestionsForm.Submit onSubmit={onSubmit} label="Next" />
        </QuestionsForm>,
      );

      // Select a value so the form is valid and the submit button mounts (no
      // isAutoSubmit predicate here, so selecting does not auto-submit).
      fireEvent.press(getByTestId('pick-q1'));

      const button = await waitFor(() => getByTestId('questions-form-submit-button'));
      fireEvent.press(button);

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      expect(onSubmit).toHaveBeenCalledWith(expect.anything(), { isAutoSubmit: false });
    });
  });

  describe('auto submit (select-on-tap)', () => {
    it('GIVEN an isAutoSubmit predicate WHEN the selection triggers it THEN onSubmit fires with isAutoSubmit true', async () => {
      const onSubmit = jest.fn();
      const config = createSingleSelectConfig();

      const { getByTestId } = render(
        <QuestionsForm config={config} renderer={TestRenderer}>
          <QuestionsForm.Submit onSubmit={onSubmit} isAutoSubmit={isAutoSubmit} label="Next" />
        </QuestionsForm>,
      );

      // A check-style single-select auto-submits on selection.
      fireEvent.press(getByTestId('pick-q1'));

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ q1: 'a' }), { isAutoSubmit: true });
    });

    it('GIVEN the host unmounts the footer after an auto-submit WHEN it mounts it back THEN onSubmit does not fire again', async () => {
      const onSubmit = jest.fn();
      const config = createSingleSelectConfig();

      function Host({ showFooter }: { showFooter: boolean }) {
        return (
          <QuestionsForm config={config} renderer={TestRenderer}>
            {showFooter ? <QuestionsForm.Submit onSubmit={onSubmit} isAutoSubmit={isAutoSubmit} label="Next" /> : null}
          </QuestionsForm>
        );
      }

      const { getByTestId, rerender } = render(<Host showFooter />);

      fireEvent.press(getByTestId('pick-q1'));
      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

      // KYC hides the CTA while the flow is busy and shows it again once the
      // submit settles — a toggle the auto-submit itself causes, so replaying it
      // on remount would loop the submit forever.
      await act(async () => {
        rerender(<Host showFooter={false} />);
      });
      await act(async () => {
        rerender(<Host showFooter />);
      });

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('imperative submit()', () => {
    it('GIVEN a ref WHEN submit() is called THEN onSubmit fires with isAutoSubmit false', async () => {
      const onSubmit = jest.fn();
      const config = createSingleSelectConfig({ validations: [] });
      const ref = createRef<QuestionsFormRef>();

      render(<QuestionsForm ref={ref} config={config} renderer={TestRenderer} onSubmit={onSubmit} />);

      await act(async () => {
        ref.current?.submit();
      });

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      expect(onSubmit).toHaveBeenCalledWith(expect.anything(), { isAutoSubmit: false });
    });
  });
});
