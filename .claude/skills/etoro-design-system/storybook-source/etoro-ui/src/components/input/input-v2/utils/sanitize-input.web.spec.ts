import { sanitizeInputText } from './sanitize-input.web';

describe('sanitizeInputText web adapter', () => {
  describe('type "number"', () => {
    it('strips letters, keeping only digits', () => {
      expect(sanitizeInputText('number', '12a3b4')).toBe('1234');
    });

    it('keeps a single decimal separator and drops later ones', () => {
      expect(sanitizeInputText('number', '1.2.3')).toBe('1.23');
    });

    it('preserves the separator the user typed (comma)', () => {
      expect(sanitizeInputText('number', '1,2,3')).toBe('1,23');
    });

    it('strips pasted currency symbols and letters, keeping the first separator', () => {
      expect(sanitizeInputText('number', '$1234.56 USD')).toBe('1234.56');
    });

    it('returns empty string when no numeric chars remain', () => {
      expect(sanitizeInputText('number', 'abc')).toBe('');
    });
  });

  describe('type "phone"', () => {
    it('strips letters, keeping only digits', () => {
      expect(sanitizeInputText('phone', '12a3b4')).toBe('1234');
    });

    it('keeps a single leading plus', () => {
      expect(sanitizeInputText('phone', '+1 (555) 123-4567')).toBe('+15551234567');
    });

    it('drops a non-leading plus', () => {
      expect(sanitizeInputText('phone', '55+5')).toBe('555');
    });
  });

  it.each(['text', 'email', 'password', undefined] as const)('leaves type %s untouched', (type) => {
    expect(sanitizeInputText(type, 'abc123!@#')).toBe('abc123!@#');
  });
});
