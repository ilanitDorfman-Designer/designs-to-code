import { getInputFieldPlatformProps, getInputFieldPlatformStyle, getInputFieldSubmitBehavior } from './input-field-platform-props.web';

describe('input field web platform props', () => {
  it('turns Enter into onSubmitEditing before blurring', () => {
    const calls: string[] = [];
    const onSubmitEditing = jest.fn(() => calls.push('submit'));
    const blur = jest.fn(() => calls.push('blur'));
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();
    const props = getInputFieldPlatformProps({ onSubmitEditing, value: 'abc' });

    (props.onKeyDown as (event: unknown) => void)({ key: 'Enter', currentTarget: { blur }, preventDefault, stopPropagation });

    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
    expect(onSubmitEditing).toHaveBeenCalledWith({ nativeEvent: { text: 'abc' } });
    expect(blur).toHaveBeenCalled();
    expect(calls).toEqual(['submit', 'blur']);
  });

  it('also handles React Native Web onKeyPress events', () => {
    const onSubmitEditing = jest.fn();
    const preventDefault = jest.fn();
    const props = getInputFieldPlatformProps({ onSubmitEditing, value: 'abc' });

    (props.onKeyPress as (event: unknown) => void)({ nativeEvent: { key: 'Enter' }, preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(onSubmitEditing).toHaveBeenCalledWith({ nativeEvent: { text: 'abc' } });
  });

  it('ignores Shift+Enter and non-Enter keys', () => {
    const onSubmitEditing = jest.fn();
    const props = getInputFieldPlatformProps({ onSubmitEditing, value: 'abc' });

    (props.onKeyDown as (event: unknown) => void)({ key: 'Enter', shiftKey: true });
    (props.onKeyDown as (event: unknown) => void)({ key: 'Tab' });

    expect(onSubmitEditing).not.toHaveBeenCalled();
  });

  it('removes browser focus outline from the real input', () => {
    expect(getInputFieldPlatformStyle()).toEqual(expect.objectContaining({ outlineStyle: 'none', outlineWidth: 0 }));
  });

  it('keeps submit events from blurring before the web Enter bridge runs', () => {
    expect(getInputFieldSubmitBehavior()).toBe('submit');
  });
});
