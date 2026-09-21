import { InputType } from '../api/types';

/**
 * On web, `keyboardType` only maps to a DOM `inputMode` hint. It restricts
 * nothing, so number / phone fields still accept letters typed or pasted.
 */
export function sanitizeInputText(type: InputType | undefined, text: string): string {
  switch (type) {
    case 'number':
      return sanitizeNumeric(text);
    case 'phone':
      return sanitizePhone(text);
    default:
      return text;
  }
}

function sanitizeNumeric(text: string): string {
  const cleaned = text.replace(/[^0-9.,]/g, '');
  const firstSep = cleaned.search(/[.,]/);
  if (firstSep === -1) return cleaned;
  const intPart = cleaned.slice(0, firstSep);
  const separator = cleaned[firstSep];
  const fracPart = cleaned.slice(firstSep + 1).replace(/[.,]/g, '');
  return `${intPart}${separator}${fracPart}`;
}

function sanitizePhone(text: string): string {
  const hasLeadingPlus = text.startsWith('+');
  const digits = text.replace(/[^0-9]/g, '');
  return hasLeadingPlus ? `+${digits}` : digits;
}
