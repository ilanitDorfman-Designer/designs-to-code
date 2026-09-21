import { sanitizePhoneInputValue } from './sanitize-phone-input-value';

describe('sanitizePhoneInputValue', () => {
  it('is a no-op on native', () => {
    expect(sanitizePhoneInputValue('+1 (555) abc')).toBe('+1 (555) abc');
  });
});
