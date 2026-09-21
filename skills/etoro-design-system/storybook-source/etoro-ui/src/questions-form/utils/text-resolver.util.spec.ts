import { resolveText } from './text-resolver.util';

describe('resolveText', () => {
  it('GIVEN undefined text WHEN resolved THEN returns empty string', () => {
    // GIVEN
    const text = undefined;

    // WHEN
    const result = resolveText(text);

    // THEN
    expect(result).toBe('');
  });

  it('GIVEN text "hello" with textAsKeys=false WHEN resolved THEN returns "hello"', () => {
    // GIVEN
    const text = 'hello';
    const textAsKeys = false;

    // WHEN
    const result = resolveText(text, textAsKeys);

    // THEN
    expect(result).toBe('hello');
  });

  it('GIVEN text "hello" with textAsKeys undefined WHEN resolved THEN returns "hello"', () => {
    // GIVEN
    const text = 'hello';

    // WHEN
    const result = resolveText(text);

    // THEN
    expect(result).toBe('hello');
  });

  it('GIVEN key "my.key" with textAsKeys=true and getText function WHEN resolved THEN returns getText result', () => {
    // GIVEN
    const text = 'my.key';
    const textAsKeys = true;
    const getText = jest.fn().mockReturnValue('Translated text');

    // WHEN
    const result = resolveText(text, textAsKeys, getText);

    // THEN
    expect(getText).toHaveBeenCalledWith('my.key');
    expect(result).toBe('Translated text');
  });

  it('GIVEN text with textAsKeys=true but no getText WHEN resolved THEN returns raw text', () => {
    // GIVEN
    const text = 'raw.key';
    const textAsKeys = true;
    const getText = undefined;

    // WHEN
    const result = resolveText(text, textAsKeys, getText);

    // THEN
    expect(result).toBe('raw.key');
  });

  it('GIVEN empty string WHEN resolved THEN returns empty string', () => {
    // GIVEN
    const text = '';

    // WHEN
    const result = resolveText(text);

    // THEN
    expect(result).toBe('');
  });

  it('GIVEN null text WHEN resolved THEN returns empty string (covers ?? fallback)', () => {
    // GIVEN - null can be passed at runtime despite type
    const text = null as unknown as string;

    // WHEN
    const result = resolveText(text);

    // THEN
    expect(result).toBe('');
  });
});
