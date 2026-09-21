import { renderHook } from '@testing-library/react-native';

import { VARIANT_CONFIG } from '../../../../foundations/text/utils/variant-config';
import { useInputAnimations } from './use-input-animations';

const LABEL_IDLE = VARIANT_CONFIG['body-base-regular'];
const LABEL_COMPACT = VARIANT_CONFIG['body-tiny-medium'];

const baseProps = {
  unfocusedBorderColor: 'transparent',
  focusedBorderColor: '#000000',
  idleLabelColor: '#111111',
  compactLabelColor: '#222222',
};

describe('useInputAnimations', () => {
  it('keeps the label in the idle position when blurred and empty (no staticLabel)', () => {
    const { result } = renderHook(() =>
      useInputAnimations({
        ...baseProps,
        isFocused: false,
        hasValue: false,
      }),
    );

    expect(result.current.animatedLabelTextStyle.fontSize).toBe(LABEL_IDLE.size);
    expect(result.current.animatedFieldRowStyle.paddingTop).toBe(0);
  });

  it('promotes the label to the compact position when staticLabel is set, even while blurred and empty', () => {
    const { result } = renderHook(() =>
      useInputAnimations({
        ...baseProps,
        isFocused: false,
        hasValue: false,
        staticLabel: true,
      }),
    );

    expect(result.current.animatedLabelTextStyle.fontSize).toBe(LABEL_COMPACT.size);
    expect(result.current.animatedLabelContainerStyle.paddingTop).toBe(0);
    expect(result.current.animatedFieldRowStyle.paddingTop).not.toBe(0);
  });

  it('keeps the label compact when focused regardless of staticLabel', () => {
    const { result } = renderHook(() =>
      useInputAnimations({
        ...baseProps,
        isFocused: true,
        hasValue: false,
      }),
    );

    expect(result.current.animatedLabelTextStyle.fontSize).toBe(LABEL_COMPACT.size);
  });
});
