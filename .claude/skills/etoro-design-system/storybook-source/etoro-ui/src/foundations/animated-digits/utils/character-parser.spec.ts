import { parseCharacters } from './character-parser';

describe('animated-digits character-parser', () => {
  describe('place computation', () => {
    it('GIVEN an integer WHEN parsed THEN places count up from the units digit (rightmost = 1)', () => {
      const result = parseCharacters('999');

      expect(result.map((c) => c.place)).toEqual([3, 2, 1]);
    });

    it('GIVEN a grouped integer WHEN parsed THEN the comma and digits keep stable places', () => {
      const result = parseCharacters('1,000');

      expect(result.map((c) => c.place)).toEqual([5, 4, 3, 2, 1]);
    });

    it('GIVEN 999 grows to 1,000 THEN the shared digit places overlap so identity is preserved', () => {
      const before = parseCharacters('999').map((c) => c.place);
      const after = parseCharacters('1,000').map((c) => c.place);

      // The rightmost three digits (places 1,2,3) exist in both -> reused/rolled.
      expect(before).toEqual([3, 2, 1]);
      expect(after.slice(2)).toEqual([3, 2, 1]);
      // Places 4 (comma) and 5 (leading digit) are new -> enter.
      expect(after.slice(0, 2)).toEqual([5, 4]);
    });

    it('GIVEN 9,999 grows to 10,000 THEN the comma stays at place 4', () => {
      const before = parseCharacters('9,999');
      const after = parseCharacters('10,000');

      expect(before.find((c) => c.char === ',')?.place).toBe(4);
      expect(after.find((c) => c.char === ',')?.place).toBe(4);
    });

    it('GIVEN decimals WHEN parsed THEN the decimal point is place 0 and fractional digits are negative', () => {
      const result = parseCharacters('1.55');

      expect(result.map((c) => ({ char: c.char, place: c.place }))).toEqual([
        { char: '1', place: 1 },
        { char: '.', place: 0 },
        { char: '5', place: -1 },
        { char: '5', place: -2 },
      ]);
    });

    it('GIVEN a comma-decimal locale value WHEN parsed with a comma separator THEN the comma is place 0 and fractional digits are negative', () => {
      const result = parseCharacters('1,55', ',');

      expect(result.map((c) => ({ char: c.char, place: c.place }))).toEqual([
        { char: '1', place: 1 },
        { char: ',', place: 0 },
        { char: '5', place: -1 },
        { char: '5', place: -2 },
      ]);
    });

    it('GIVEN a trailing dot while typing WHEN parsed THEN the integer digit keeps its place', () => {
      const result = parseCharacters('1.');

      expect(result.map((c) => ({ char: c.char, place: c.place }))).toEqual([
        { char: '1', place: 1 },
        { char: '.', place: 0 },
      ]);
    });
  });

  describe('digit metadata', () => {
    it('GIVEN a formatted string WHEN parsed THEN flags digits and separators', () => {
      const result = parseCharacters('1,2');

      expect(result).toEqual([
        { char: '1', isDigit: true, digit: 1, place: 3 },
        { char: ',', isDigit: false, digit: 0, place: 2 },
        { char: '2', isDigit: true, digit: 2, place: 1 },
      ]);
    });
  });
});
