import type { QuestionMessage } from '../interfaces';

/**
 * Returns true if the message should be visible.
 * Messages that depend on CCM are excluded because CCM is not available in the mobile app.
 */
function isMessageVisible(msg: QuestionMessage): boolean {
  if (!msg.dependOnFn?.length) return true;
  // TODO: Add support for CCM dependency.
  return !msg.dependOnFn.some((dep) => dep.type === 'ccm');
}

/** Filters out messages whose `dependOnFn` includes a CCM dependency. */
export function filterVisibleMessages(messages: QuestionMessage[] | undefined): QuestionMessage[] {
  if (!messages?.length) return [];
  return messages.filter(isMessageVisible);
}

/**
 * Whether an option-level message should render for the current selection.
 * Matches legacy KYCx: `behavior === 'static' || selected`.
 * Messages with no `behavior` (e.g. newTraderDisclaimer on "I haven't") only show when selected.
 */
export function isOptionMessageVisible(message: QuestionMessage, selected: boolean): boolean {
  return message.behavior === 'static' || selected;
}
