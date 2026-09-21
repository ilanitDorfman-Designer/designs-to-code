import { getTextInputPlatformStyle, getTextInputSubmitBehavior } from './text-input-platform-props.web';

describe('text input web platform props', () => {
  it('removes browser focus chrome from react-native TextInput nodes', () => {
    expect(getTextInputPlatformStyle()).toEqual(expect.objectContaining({ outlineStyle: 'none', outlineWidth: 0, boxShadow: 'none' }));
  });

  it('preserves blur-and-submit behavior for base inputs on web', () => {
    expect(getTextInputSubmitBehavior()).toBe('blurAndSubmit');
  });
});
