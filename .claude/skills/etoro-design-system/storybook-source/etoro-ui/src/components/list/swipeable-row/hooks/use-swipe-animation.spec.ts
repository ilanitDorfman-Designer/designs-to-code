import { act, renderHook } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { Gesture, PanGesture } from 'react-native-gesture-handler';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { useSwipeAnimation } from './use-swipe-animation';

// Override the global gesture-handler mock so we can capture per-gesture callbacks
jest.mock('react-native-gesture-handler', () => ({
  Gesture: {
    Pan: jest.fn(),
  },
}));

const SNAP_VELOCITY_THRESHOLD = 300;

describe('useSwipeAnimation', () => {
  let onBeginHandler: () => void;
  let onUpdateHandler: (event: { translationX: number }) => void;
  let onEndHandler: (event: { velocityX: number }) => void;

  function createPanMock() {
    const pan = {
      activeOffsetX: jest.fn(() => pan),
      failOffsetY: jest.fn(() => pan),
      onBegin: jest.fn((handler: () => void) => {
        onBeginHandler = handler;
        return pan;
      }),
      onUpdate: jest.fn((handler: (event: { translationX: number }) => void) => {
        onUpdateHandler = handler;
        return pan;
      }),
      onEnd: jest.fn((handler: (event: { velocityX: number }) => void) => {
        onEndHandler = handler;
        return pan;
      }),
    } as unknown as PanGesture;
    return pan;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    (Gesture.Pan as jest.Mock).mockReturnValue(createPanMock());
  });

  type AnimationProps = {
    totalSwipeWidth: number;
    rowWidthValue?: number;
    enableFullSwipe?: boolean;
    fullSwipeThreshold?: number;
    onSwipeStart?: (closeSwipe: () => void) => void;
    onFullSwipeCommit?: () => void;
  };

  const renderAnimation = (initialProps: AnimationProps) =>
    renderHook(
      (props: AnimationProps) => {
        const rowWidth = useSharedValue(props.rowWidthValue ?? 350);
        return useSwipeAnimation({
          totalSwipeWidth: props.totalSwipeWidth,
          rowWidth,
          enableFullSwipe: props.enableFullSwipe ?? true,
          fullSwipeThreshold: props.fullSwipeThreshold ?? 0.6,
          onSwipeStart: props.onSwipeStart,
          onFullSwipeCommit: props.onFullSwipeCommit,
        });
      },
      { initialProps },
    );

  // ========== closeSwipe ==========

  describe('closeSwipe', () => {
    it('animates translateX back to 0 via an eased timing glide', () => {
      const { result } = renderAnimation({ totalSwipeWidth: 100 });

      act(() => {
        result.current.closeSwipe();
      });

      expect(withTiming).toHaveBeenCalledWith(0, expect.objectContaining({ duration: 240 }));
    });

    it('sets isOpen to false', () => {
      const { result } = renderAnimation({ totalSwipeWidth: 100, enableFullSwipe: false });

      act(() => {
        onEndHandler({ velocityX: -(SNAP_VELOCITY_THRESHOLD + 1) });
      });
      expect(result.current.isOpen.get()).toBe(true);

      act(() => {
        result.current.closeSwipe();
      });

      expect(result.current.isOpen.get()).toBe(false);
    });

    it('is idempotent when called on an already-closed row', () => {
      const { result } = renderAnimation({ totalSwipeWidth: 100 });

      expect(() => {
        act(() => {
          result.current.closeSwipe();
        });
      }).not.toThrow();

      expect(result.current.isOpen.get()).toBe(false);
    });
  });

  // ========== Threshold crossing haptic ==========

  describe('Threshold haptic', () => {
    it('fires a single medium impact haptic when crossing the full-swipe threshold', () => {
      renderAnimation({ totalSwipeWidth: 140, rowWidthValue: 350, fullSwipeThreshold: 0.6 });
      // threshold = 350 * 0.6 = 210

      act(() => {
        onBeginHandler();
        onUpdateHandler({ translationX: -100 }); // below threshold
        onUpdateHandler({ translationX: -220 }); // crosses threshold
        onUpdateHandler({ translationX: -260 }); // still past threshold
      });

      expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
    });

    it('does not fire haptic when full-swipe is disabled, even past threshold', () => {
      renderAnimation({ totalSwipeWidth: 140, rowWidthValue: 350, enableFullSwipe: false });

      act(() => {
        onBeginHandler();
        onUpdateHandler({ translationX: -300 });
      });

      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('fires the haptic at most once per gesture even when the user wiggles back and forth', () => {
      renderAnimation({ totalSwipeWidth: 140, rowWidthValue: 350, fullSwipeThreshold: 0.6 });

      act(() => {
        onBeginHandler();
        onUpdateHandler({ translationX: -100 }); // below threshold
        onUpdateHandler({ translationX: -240 }); // crosses threshold (haptic fires)
        onUpdateHandler({ translationX: -180 }); // retreats below threshold
        onUpdateHandler({ translationX: -260 }); // crosses again (must NOT re-fire)
      });

      expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
    });
  });

  // ========== Full-swipe commit ==========

  describe('Full-swipe commit', () => {
    it('snaps translateX to -rowWidth when releasing past the threshold', () => {
      renderAnimation({ totalSwipeWidth: 140, rowWidthValue: 350, fullSwipeThreshold: 0.6 });
      (withSpring as jest.Mock).mockClear();

      act(() => {
        onBeginHandler();
        onUpdateHandler({ translationX: -240 }); // past threshold (210)
        onEndHandler({ velocityX: 0 });
      });

      expect(withSpring).toHaveBeenCalledWith(-350, expect.any(Object), expect.any(Function));
    });

    it('falls back to the existing snap behavior when releasing below the threshold', () => {
      renderAnimation({ totalSwipeWidth: 140, rowWidthValue: 350, fullSwipeThreshold: 0.6 });
      (withSpring as jest.Mock).mockClear();

      act(() => {
        onBeginHandler();
        onUpdateHandler({ translationX: -100 }); // below threshold (210)
        onEndHandler({ velocityX: 0 });
      });

      // Below threshold => no -rowWidth commit snap.
      expect(withSpring).not.toHaveBeenCalledWith(-350, expect.anything(), expect.any(Function));
      // ...and the existing 50%/velocity snap path still runs.
      expect(withSpring).toHaveBeenCalled();
    });

    it('does not commit when enableFullSwipe is false, even past threshold', () => {
      renderAnimation({ totalSwipeWidth: 140, rowWidthValue: 350, enableFullSwipe: false });
      (withSpring as jest.Mock).mockClear();

      act(() => {
        onBeginHandler();
        onUpdateHandler({ translationX: -300 });
        onEndHandler({ velocityX: 0 });
      });

      // Existing snap behavior: open at -totalSwipeWidth (=-140) since past 50% of actions and not the full row.
      expect(withSpring).not.toHaveBeenCalledWith(-350, expect.anything(), expect.any(Function));
    });

    it('invokes onFullSwipeCommit on the JS thread once the spring completes', () => {
      const onFullSwipeCommit = jest.fn();
      renderAnimation({
        totalSwipeWidth: 140,
        rowWidthValue: 350,
        fullSwipeThreshold: 0.6,
        onFullSwipeCommit,
      });

      act(() => {
        onBeginHandler();
        onUpdateHandler({ translationX: -240 });
        onEndHandler({ velocityX: 0 });
      });

      // The reanimated mock doesn't auto-invoke the spring callback, so simulate completion
      // by extracting and invoking the callback passed to withSpring.
      const lastSpringCall = (withSpring as jest.Mock).mock.calls.find((call) => call[0] === -350);
      expect(lastSpringCall).toBeDefined();
      const completionCallback = lastSpringCall?.[2];
      expect(typeof completionCallback).toBe('function');

      act(() => {
        completionCallback?.(true);
      });

      expect(onFullSwipeCommit).toHaveBeenCalledTimes(1);
    });
  });

  // ========== resetCommit ==========

  describe('resetCommit', () => {
    it('springs translateX back to 0 and clears isOpen / isCommitting after a full-swipe commit', () => {
      const { result } = renderAnimation({ totalSwipeWidth: 140, rowWidthValue: 350, fullSwipeThreshold: 0.6 });

      // Force the row into a "post-commit" state.
      act(() => {
        onBeginHandler();
        onUpdateHandler({ translationX: -240 });
        onEndHandler({ velocityX: 0 });
      });

      expect(result.current.isCommitting.get()).toBe(true);
      expect(result.current.isOpen.get()).toBe(true);

      (withSpring as jest.Mock).mockClear();

      act(() => {
        result.current.resetCommit();
      });

      expect(result.current.isCommitting.get()).toBe(false);
      expect(result.current.isOpen.get()).toBe(false);
      expect(withSpring).toHaveBeenCalledWith(0, expect.objectContaining({ damping: 50, stiffness: 300, overshootClamping: true }));
    });

    it('is safe to call when the row is already closed', () => {
      const { result } = renderAnimation({ totalSwipeWidth: 140, rowWidthValue: 350 });

      expect(() => {
        act(() => {
          result.current.resetCommit();
        });
      }).not.toThrow();

      expect(result.current.isCommitting.get()).toBe(false);
      expect(result.current.isOpen.get()).toBe(false);
    });
  });

  // ========== Takeover shared value ==========

  describe('Takeover SV', () => {
    it('starts at 0 before the user has dragged anywhere', () => {
      const { result } = renderAnimation({ totalSwipeWidth: 140, rowWidthValue: 350 });

      expect(result.current.takeover.get()).toBe(0);
    });

    it('hard-resets takeover to 0 on onBegin (so an interrupted commit does not leak in)', () => {
      const { result } = renderAnimation({ totalSwipeWidth: 140, rowWidthValue: 350, fullSwipeThreshold: 0.6 });

      // Simulate a stale takeover value left over from a previous gesture.
      act(() => {
        result.current.takeover.set(0.7);
      });
      expect(result.current.takeover.get()).toBe(0.7);

      act(() => {
        onBeginHandler();
      });

      expect(result.current.takeover.get()).toBe(0);
    });
  });
});
