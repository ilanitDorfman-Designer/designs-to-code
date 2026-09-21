import { resolveMediaCardVariantColors } from './resolve-variant-colors';

const colors = {
  carbonStatic050: '#FFFFFF',
  carbonStatic900: '#1B1E21',
  bgDarkSurface: '#333333',
  bgNeutralSecondary: '#F2F3F7',
  dividerQuinary: '#E5E5E5',
} as never;

describe('resolveMediaCardVariantColors', () => {
  it('maps bright → carbonStatic900 text and carbonStatic050 fill', () => {
    const result = resolveMediaCardVariantColors('bright', colors);
    expect(result.foregroundColor).toBe('#1B1E21');
    expect(result.defaultBackgroundColor).toBe('#FFFFFF');
    expect(result.borderColor).toBe('#E5E5E5');
  });

  it('maps standard → carbonStatic050 text', () => {
    const result = resolveMediaCardVariantColors('standard', colors);
    expect(result.foregroundColor).toBe('#FFFFFF');
    expect(result.defaultBackgroundColor).toBe('#F2F3F7');
  });

  it('maps dark → carbonStatic050 text and bgDarkSurface fill', () => {
    const result = resolveMediaCardVariantColors('dark', colors);
    expect(result.foregroundColor).toBe('#FFFFFF');
    expect(result.defaultBackgroundColor).toBe('#333333');
  });
});
