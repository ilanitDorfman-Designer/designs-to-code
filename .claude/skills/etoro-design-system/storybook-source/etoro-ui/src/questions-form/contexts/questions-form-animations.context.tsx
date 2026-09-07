import { createContext, type ReactNode, useContext } from 'react';
import type { EntryOrExitLayoutType } from 'react-native-reanimated';

/**
 * Animation set consumed by `QuestionsForm` and its child components.
 *
 * The questions-form lib is animation-agnostic: it ships **no** default
 * animations of its own. Consumers (e.g. the KYC feature) provide a
 * `QuestionsFormAnimations` value via {@link QuestionsFormAnimationsProvider}
 * so the component cascade matches the host screen's motion language.
 *
 * Every slot is optional — when omitted, the corresponding view renders with
 * no enter/exit animation.
 */
export interface QuestionsFormAnimations {
  /** Entering animation for the screen container that wraps the form. */
  screenEntering?: EntryOrExitLayoutType;
  /** Exiting animation for the screen container that wraps the form. */
  screenExiting?: EntryOrExitLayoutType;
  /**
   * Entering animation for tile/select options. Receives the option's index in
   * the visible list so the consumer can stagger the cascade.
   */
  optionEntering?: (index: number) => EntryOrExitLayoutType;
  /** Entering animation for accordion/inner-question expanding content. */
  contentEntering?: EntryOrExitLayoutType;
  /** Exiting animation for accordion/inner-question collapsing content. */
  contentExiting?: EntryOrExitLayoutType;
  /** Entering animation for the submit footer button. */
  submitButtonEntering?: EntryOrExitLayoutType;
  /** Exiting animation for the submit footer button. */
  submitButtonExiting?: EntryOrExitLayoutType;
}

const QuestionsFormAnimationsContext = createContext<QuestionsFormAnimations>({});

/**
 * Provides a `QuestionsFormAnimations` set to all `QuestionsForm` child
 * components via context. Wrap `<QuestionsForm>` with this provider when a
 * specific motion language is required.
 *
 * @example
 * ```tsx
 * const animations: QuestionsFormAnimations = {
 *   screenEntering: FadeInRight.duration(240),
 *   screenExiting: FadeOut.duration(160),
 *   optionEntering: (index) => FadeInUp.delay(120 + index * 80).duration(175),
 *   contentEntering: FadeIn.duration(175),
 *   contentExiting: FadeOut.duration(175),
 *   submitButtonEntering: FadeInUp.duration(175),
 *   submitButtonExiting: FadeOutDown.duration(175),
 * };
 *
 * <QuestionsFormAnimationsProvider value={animations}>
 *   <QuestionsForm config={config}>
 *     <QuestionsForm.Submit onSubmit={onSubmit} />
 *   </QuestionsForm>
 * </QuestionsFormAnimationsProvider>
 * ```
 */
export function QuestionsFormAnimationsProvider({ value, children }: { value: QuestionsFormAnimations; children: ReactNode }) {
  return <QuestionsFormAnimationsContext.Provider value={value}>{children}</QuestionsFormAnimationsContext.Provider>;
}

/**
 * Hook consumed by `QuestionsForm` child components to read the active
 * animation set. Returns an empty bag (no animations) when no provider wraps
 * the tree.
 */
export function useQuestionsFormAnimations(): QuestionsFormAnimations {
  return useContext(QuestionsFormAnimationsContext);
}
