import { sanitizePhoneInputValue } from './sanitize-phone-input-value.web';

describe('sanitizePhoneInputValue web adapter', () => {
  it('keeps digits only because the country prefix is stored separately', () => {
    expect(sanitizePhoneInputValue('+1 (555) abc')).toBe('1555');
  });
});
