import { buildCharacterKeys } from './character-keys';
import { parseCharacters } from './character-parser';

const keysFor = (value: string, anchor: 'decimal' | 'leading') => buildCharacterKeys(parseCharacters(value), anchor);

describe('animated-digits character-keys', () => {
  describe("'decimal' anchor (default odometer)", () => {
    it('keys by place so a growing value keeps the units slot stable', () => {
      expect(keysFor('99', 'decimal')).toEqual(['pos-2', 'pos-1']);
      expect(keysFor('100', 'decimal')).toEqual(['pos-3', 'pos-2', 'pos-1']);
    });

    it('defaults to the decimal anchor when the anchor argument is omitted', () => {
      expect(buildCharacterKeys(parseCharacters('100'))).toEqual(['pos-3', 'pos-2', 'pos-1']);
    });
  });

  describe("'leading' anchor (typed input)", () => {
    it('keys digits by typed order so existing digits keep identity and a new digit is added on the right', () => {
      const before = keysFor('34,055', 'leading');
      const after = keysFor('340,555', 'leading');

      // Every digit that already existed keeps its key (no roll); only dig-5 is new.
      expect(before.filter((k) => k.startsWith('dig-'))).toEqual(['dig-0', 'dig-1', 'dig-2', 'dig-3', 'dig-4']);
      expect(after.filter((k) => k.startsWith('dig-'))).toEqual(['dig-0', 'dig-1', 'dig-2', 'dig-3', 'dig-4', 'dig-5']);
    });

    it('keeps the three 9s stable and adds a new digit + comma when crossing a grouping boundary', () => {
      const before = keysFor('999', 'leading');
      const after = keysFor('9,999', 'leading');

      expect(before).toEqual(['dig-0', 'dig-1', 'dig-2']);
      expect(after).toEqual(['dig-0', 'sep-0', 'dig-1', 'dig-2', 'dig-3']);
    });

    it('uses a stable dot key and continues the digit sequence into the fractional part', () => {
      expect(keysFor('12.3', 'leading')).toEqual(['dig-0', 'dig-1', 'dot', 'dig-2']);
      expect(keysFor('12.34', 'leading')).toEqual(['dig-0', 'dig-1', 'dot', 'dig-2', 'dig-3']);
    });
  });
});
