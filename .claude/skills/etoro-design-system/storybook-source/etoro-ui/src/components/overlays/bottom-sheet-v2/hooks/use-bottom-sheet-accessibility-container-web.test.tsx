import { describe, expect, it, jest } from '@jest/globals';
import { act, render, renderHook } from '@testing-library/react-native';
import React from 'react';
import { Modal, Text } from 'react-native';

import { useBottomSheetAccessibilityContainer as useNativeAccessibilityContainer } from './use-bottom-sheet-accessibility-container';
import { useBottomSheetAccessibilityContainer } from './use-bottom-sheet-accessibility-container.web';

describe('useBottomSheetAccessibilityContainer', () => {
  it('keeps the native container unchanged', () => {
    const { result } = renderHook(() =>
      useNativeAccessibilityContainer({
        isDismissible: true,
        onDismiss: jest.fn(),
      }),
    );

    expect(result.current).toBeUndefined();
  });

  it('wraps web sheet content in the platform Modal contract', () => {
    const { result } = renderHook(() =>
      useBottomSheetAccessibilityContainer({
        isDismissible: true,
        onDismiss: jest.fn(),
      }),
    );
    const Container = result.current;

    const { UNSAFE_getByType } = render(
      <Container>
        <Text>Content</Text>
      </Container>,
    );
    const modal = UNSAFE_getByType(Modal);

    expect(modal.props.animationType).toBe('none');
    expect(modal.props.transparent).toBe(true);
    expect(modal.props.onRequestClose).toEqual(expect.any(Function));
  });

  it('honours dismissibility and onBeforeClose', () => {
    const onBeforeClose = jest.fn(() => false);
    const onDismiss = jest.fn();
    const { result, rerender } = renderHook(
      (params: { isDismissible: boolean; onBeforeClose?: () => boolean | void }) =>
        useBottomSheetAccessibilityContainer({ ...params, onDismiss }),
      {
        initialProps: { isDismissible: false, onBeforeClose },
      },
    );
    const Container = result.current;

    const { UNSAFE_getByType } = render(
      <Container>
        <Text>Content</Text>
      </Container>,
    );
    const onRequestClose = UNSAFE_getByType(Modal).props.onRequestClose as () => void;

    act(onRequestClose);
    expect(onBeforeClose).not.toHaveBeenCalled();
    expect(onDismiss).not.toHaveBeenCalled();

    rerender({ isDismissible: true, onBeforeClose });
    act(onRequestClose);
    expect(onBeforeClose).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();

    onBeforeClose.mockReturnValue(true);
    act(onRequestClose);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('keeps the container mounted while using the latest callbacks', () => {
    const firstDismiss = jest.fn();
    const secondDismiss = jest.fn();
    const { result, rerender } = renderHook(
      ({ onDismiss }) => useBottomSheetAccessibilityContainer({ isDismissible: true, onDismiss }),
      { initialProps: { onDismiss: firstDismiss } },
    );
    const Container = result.current;

    rerender({ onDismiss: secondDismiss });
    expect(result.current).toBe(Container);

    const { UNSAFE_getByType } = render(
      <Container>
        <Text>Content</Text>
      </Container>,
    );
    act(UNSAFE_getByType(Modal).props.onRequestClose as () => void);

    expect(firstDismiss).not.toHaveBeenCalled();
    expect(secondDismiss).toHaveBeenCalledTimes(1);
  });
});
