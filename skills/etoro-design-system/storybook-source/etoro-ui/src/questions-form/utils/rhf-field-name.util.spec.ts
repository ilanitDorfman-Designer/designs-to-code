import { decodeQuestionsFormRhfFieldName, decodeQuestionsFormValues, encodeQuestionsFormRhfFieldName } from './rhf-field-name.util';

describe('rhf-field-name', () => {
  describe('GIVEN ids with dots (inner question pattern)', () => {
    describe('WHEN encoding then decoding', () => {
      it('THEN round-trips', () => {
        const raw = '32>106.text';
        expect(decodeQuestionsFormRhfFieldName(encodeQuestionsFormRhfFieldName(raw))).toBe(raw);
      });
    });
  });

  describe('GIVEN encoded form state from RHF', () => {
    describe('WHEN decoding values', () => {
      it('THEN maps keys back to question ids', () => {
        const encodedKey = encodeQuestionsFormRhfFieldName('32>106.text');
        const decoded = decodeQuestionsFormValues({ [encodedKey]: 'hello', q1: 'a' });
        expect(decoded['32>106.text']).toBe('hello');
        expect(decoded.q1).toBe('a');
      });
    });
  });
});
