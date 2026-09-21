import { sanitizeInputText } from './sanitize-input';

describe('sanitizeInputText', () => {
  it('is a no-op for number on native', () => {
    expect(sanitizeInputText('number', '12a3.4.5')).toBe('12a3.4.5');
  });

  it('is a no-op for phone on native', () => {
    expect(sanitizeInputText('phone', '+1 (555) abc')).toBe('+1 (555) abc');
  });
});
