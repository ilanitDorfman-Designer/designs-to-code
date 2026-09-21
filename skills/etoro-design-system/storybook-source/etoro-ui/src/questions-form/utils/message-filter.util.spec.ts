import type { QuestionMessage } from '../interfaces';
import { filterVisibleMessages, isOptionMessageVisible } from './message-filter.util';

describe('filterVisibleMessages', () => {
  describe('GIVEN undefined or empty input', () => {
    it('WHEN undefined THEN returns empty array', () => {
      expect(filterVisibleMessages(undefined)).toEqual([]);
    });

    it('WHEN empty array THEN returns empty array', () => {
      expect(filterVisibleMessages([])).toEqual([]);
    });
  });

  describe('GIVEN messages without dependOnFn', () => {
    it('WHEN messages have no dependencies THEN all are visible', () => {
      // GIVEN
      const messages: QuestionMessage[] = [
        { message: 'Info message', type: 'info' },
        { message: 'Warning message', type: 'warning' },
      ];

      // WHEN
      const result = filterVisibleMessages(messages);

      // THEN
      expect(result).toEqual(messages);
    });

    it('WHEN dependOnFn is empty array THEN message is visible', () => {
      // GIVEN
      const messages: QuestionMessage[] = [{ message: 'No deps', dependOnFn: [] }];

      // WHEN
      const result = filterVisibleMessages(messages);

      // THEN
      expect(result).toHaveLength(1);
      expect(result[0].message).toBe('No deps');
    });
  });

  describe('GIVEN messages with CCM dependency', () => {
    it('WHEN message depends on CCM THEN it is excluded', () => {
      // GIVEN
      const messages: QuestionMessage[] = [
        { message: 'Visible', type: 'info' },
        { message: 'CCM only', dependOnFn: [{ type: 'ccm' }] },
      ];

      // WHEN
      const result = filterVisibleMessages(messages);

      // THEN
      expect(result).toHaveLength(1);
      expect(result[0].message).toBe('Visible');
    });

    it('WHEN all messages depend on CCM THEN returns empty array', () => {
      // GIVEN
      const messages: QuestionMessage[] = [
        { message: 'CCM 1', dependOnFn: [{ type: 'ccm' }] },
        { message: 'CCM 2', dependOnFn: [{ type: 'ccm', key: 'some-key' }] },
      ];

      // WHEN
      const result = filterVisibleMessages(messages);

      // THEN
      expect(result).toEqual([]);
    });
  });

  describe('GIVEN messages with non-CCM dependency', () => {
    it('WHEN message depends on riskCountry THEN it is visible', () => {
      // GIVEN
      const messages: QuestionMessage[] = [{ message: 'Risk info', dependOnFn: [{ type: 'riskCountry' }] }];

      // WHEN
      const result = filterVisibleMessages(messages);

      // THEN
      expect(result).toHaveLength(1);
      expect(result[0].message).toBe('Risk info');
    });
  });

  describe('GIVEN messages with mixed dependencies', () => {
    it('WHEN message has both CCM and riskCountry deps THEN it is excluded', () => {
      // GIVEN
      const messages: QuestionMessage[] = [{ message: 'Mixed deps', dependOnFn: [{ type: 'riskCountry' }, { type: 'ccm' }] }];

      // WHEN
      const result = filterVisibleMessages(messages);

      // THEN
      expect(result).toEqual([]);
    });
  });
});

describe('isOptionMessageVisible', () => {
  it('GIVEN no behavior WHEN option not selected THEN false (legacy default = selected-only)', () => {
    expect(isOptionMessageVisible({ message: 'tradingKnowledge.newTraderDisclaimer', type: 'info' }, false)).toBe(false);
  });

  it('GIVEN no behavior WHEN option selected THEN true', () => {
    expect(isOptionMessageVisible({ message: 'tradingKnowledge.newTraderDisclaimer', type: 'info' }, true)).toBe(true);
  });

  it('GIVEN behavior static WHEN option not selected THEN true', () => {
    expect(isOptionMessageVisible({ message: 'always', behavior: 'static' }, false)).toBe(true);
  });

  it('GIVEN behavior selected WHEN option not selected THEN false', () => {
    expect(isOptionMessageVisible({ message: 'only-when-selected', behavior: 'selected' }, false)).toBe(false);
  });

  it('GIVEN behavior selected WHEN option selected THEN true', () => {
    expect(isOptionMessageVisible({ message: 'only-when-selected', behavior: 'selected' }, true)).toBe(true);
  });
});
