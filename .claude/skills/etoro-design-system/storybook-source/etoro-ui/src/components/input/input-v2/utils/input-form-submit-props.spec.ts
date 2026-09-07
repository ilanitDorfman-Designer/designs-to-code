import { getInputFormSubmitProps } from './input-form-submit-props';
import { getInputFormSubmitProps as getWebInputFormSubmitProps } from './input-form-submit-props.web';

describe('getInputFormSubmitProps', () => {
  it('keeps native form wiring on end editing', () => {
    const onEndEditing = jest.fn();
    const onSubmitEditing = jest.fn();

    expect(getInputFormSubmitProps({ onEndEditing, onSubmitEditing })).toEqual({ onEndEditing });
  });

  it('wires web form submit to submit editing', () => {
    const onEndEditing = jest.fn();
    const onSubmitEditing = jest.fn();

    expect(getWebInputFormSubmitProps({ onEndEditing, onSubmitEditing })).toEqual({ onSubmitEditing });
  });

  it('omits native props when only a web submit handler is supplied', () => {
    expect(getInputFormSubmitProps({ onSubmitEditing: jest.fn() })).toEqual({});
  });
});
