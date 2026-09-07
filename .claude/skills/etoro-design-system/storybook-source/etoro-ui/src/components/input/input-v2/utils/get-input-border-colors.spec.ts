import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import { getInputBorderColors } from './get-input-border-colors';

describe('getInputBorderColors', () => {
  const { colors } = colorsMock;

  it('GIVEN an error message WHEN resolving colors THEN both border stops are verdictNegative600', () => {
    const result = getInputBorderColors(colors, { disabled: false, readonly: false, error: 'Required' });

    expect(result).toEqual({ unfocused: colors.verdictNegative600, focused: colors.verdictNegative600 });
  });

  it('GIVEN an error AND disabled WHEN resolving colors THEN error still wins', () => {
    const result = getInputBorderColors(colors, { disabled: true, readonly: false, error: 'Required' });

    expect(result).toEqual({ unfocused: colors.verdictNegative600, focused: colors.verdictNegative600 });
  });

  it('GIVEN no error and disabled WHEN resolving colors THEN both border stops are carbon300', () => {
    const result = getInputBorderColors(colors, { disabled: true, readonly: false, error: null });

    expect(result).toEqual({ unfocused: colors.carbon300, focused: colors.carbon300 });
  });

  it('GIVEN no error, not disabled, and readonly WHEN resolving colors THEN unfocused is transparent and focused stays hidden', () => {
    const result = getInputBorderColors(colors, { disabled: false, readonly: true, error: null });

    expect(result).toEqual({ unfocused: 'transparent', focused: 'transparent' });
  });

  it('GIVEN no error, not disabled, not readonly WHEN resolving colors THEN unfocused is transparent and focused is carbon600', () => {
    const result = getInputBorderColors(colors, { disabled: false, readonly: false, error: null });

    expect(result).toEqual({ unfocused: 'transparent', focused: colors.carbon600 });
  });
});
