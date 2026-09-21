import { act, renderHook } from '@testing-library/react-native';

import { useAutoDismissTimer } from './use-auto-dismiss-timer';

const DURATION = 3000;

describe('useAutoDismissTimer', () => {
  const advanceBy = (ms: number) => act(() => void jest.advanceTimersByTime(ms));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('expires after the duration', () => {
    const onExpire = jest.fn();
    renderHook(() => useAutoDismissTimer({ duration: DURATION, onExpire }));

    advanceBy(DURATION - 1);
    expect(onExpire).not.toHaveBeenCalled();

    advanceBy(1);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('does not expire when duration is zero', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() => useAutoDismissTimer({ duration: 0, onExpire }));

    advanceBy(DURATION);
    act(() => result.current.pauseTimer());
    act(() => result.current.resumeTimer());
    advanceBy(DURATION);

    expect(onExpire).not.toHaveBeenCalled();
  });

  it('holds indefinitely while paused and resumes from the remaining time', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() => useAutoDismissTimer({ duration: DURATION, onExpire }));

    advanceBy(1000);
    act(() => result.current.pauseTimer());
    advanceBy(DURATION * 5);
    expect(onExpire).not.toHaveBeenCalled();

    act(() => result.current.resumeTimer());
    advanceBy(1999);
    expect(onExpire).not.toHaveBeenCalled();

    advanceBy(1);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('ignores a resume while the timer is still running', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() => useAutoDismissTimer({ duration: DURATION, onExpire }));

    // A stray resume must not restart the countdown from the full remaining
    // time — callers pause for several independent reasons and can double-resume.
    advanceBy(2000);
    act(() => result.current.resumeTimer());

    advanceBy(1000);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('expires immediately when resumed with no time left', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() => useAutoDismissTimer({ duration: DURATION, onExpire }));

    advanceBy(DURATION - 1);
    act(() => result.current.pauseTimer());
    act(() => result.current.setRemainingTime(0));
    act(() => result.current.resumeTimer());

    expect(onExpire).toHaveBeenCalledTimes(1);
  });
});
