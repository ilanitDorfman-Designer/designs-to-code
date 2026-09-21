import type { EtAnimatedCountProps } from '../api';
import { createCommonProps, initProps } from './init-props';

describe('animated-digits init-props', () => {
  describe('weight handling', () => {
    it('GIVEN no weight WHEN initProps THEN defaults to semiBold', () => {
      const props: EtAnimatedCountProps = { number: 1234 };

      const result = initProps(props);

      expect(result.weight).toBe('semiBold');
    });

    it('GIVEN an explicit weight WHEN initProps THEN preserves the override', () => {
      const props: EtAnimatedCountProps = { number: 1234, weight: 'regular' };

      const result = initProps(props);

      expect(result.weight).toBe('regular');
    });

    it('GIVEN processed props WHEN createCommonProps THEN forwards the weight', () => {
      const processed = initProps({ number: 1234, weight: 'regular' });

      const common = createCommonProps(processed, { color: 'red' });

      expect(common.weight).toBe('regular');
    });
  });

  describe('length-change flags', () => {
    it('GIVEN animateLengthChanges and enterFromBlank WHEN createCommonProps THEN preserves both flags', () => {
      const processed = initProps({ number: 1234, weight: 'regular' });

      const common = createCommonProps(processed, { color: 'red' }, true, true);

      expect(common.weight).toBe('regular');
      expect(common.animateLengthChanges).toBe(true);
      expect(common.enterFromBlank).toBe(true);
    });
  });
});
