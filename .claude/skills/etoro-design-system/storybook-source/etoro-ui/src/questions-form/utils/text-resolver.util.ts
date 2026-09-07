/**
 * Resolves a text value. If textAsKeys is true and getText is provided,
 * treats the value as a translation key. Otherwise returns the raw string.
 * Returns empty string if text is null or undefined.
 *
 * @param text - Raw text or translation key
 * @param textAsKeys - Whether to resolve as key
 * @param getText - Translation function
 * @returns Resolved display string
 */
export function resolveText(text: string | undefined, textAsKeys?: boolean, getText?: (key: string) => string): string {
  if (text == null) {
    return '';
  }
  if (textAsKeys && getText) {
    return getText(text);
  }
  return text;
}
