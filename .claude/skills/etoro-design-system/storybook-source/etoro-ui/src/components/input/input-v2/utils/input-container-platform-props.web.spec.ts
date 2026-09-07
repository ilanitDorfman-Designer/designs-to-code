import { getInputContainerPressablePlatformProps, getInputContainerPressablePlatformStyle } from './input-container-platform-props.web';

describe('input container web platform props', () => {
  it('keeps the clickable input chrome from becoming a second focus target', () => {
    expect(getInputContainerPressablePlatformProps()).toEqual(expect.objectContaining({ focusable: false, tabIndex: -1 }));
  });

  it('removes browser focus outline from the input chrome', () => {
    expect(getInputContainerPressablePlatformStyle()).toEqual(expect.objectContaining({ outlineStyle: 'none', outlineWidth: 0 }));
  });
});
