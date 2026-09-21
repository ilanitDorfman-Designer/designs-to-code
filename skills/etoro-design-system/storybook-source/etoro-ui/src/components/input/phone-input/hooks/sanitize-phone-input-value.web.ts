export function sanitizePhoneInputValue(text: string): string {
  return text.replace(/[^0-9]/g, '');
}
