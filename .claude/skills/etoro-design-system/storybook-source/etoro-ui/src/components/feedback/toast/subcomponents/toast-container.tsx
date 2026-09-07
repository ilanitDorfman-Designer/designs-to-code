import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { ToastConfig, ToastContainerProps, ToastStackGeometry } from '../api/types';
import { DEFAULT_VISIBLE_TOASTS, TOAST_ANIMATION, TOAST_DIMENSIONS, toastExitSign } from '../api/types';
import { EtToast } from '../et-toast';

const STACK_GAP = TOAST_ANIMATION.STACK_GAP as number;
const COLLAPSE_OFFSET = TOAST_ANIMATION.STACK_COLLAPSE_OFFSET as number;
const SCALE_STEP = TOAST_ANIMATION.STACK_SCALE_STEP as number;
const MIN_SCALE = TOAST_ANIMATION.STACK_MIN_SCALE as number;

interface ComputeGeometryParams {
  toasts: ToastConfig[];
  heightMap: Map<string, number>;
  expanded: boolean;
  visibleToasts: number;
}

/**
 * Computes each toast's position in the pile (ported from `expo-dynamic-toast`).
 *
 * The newest toast (last in the array) is the front of the stack (`frontIndex`
 * 0). Walking from the front backwards:
 * - **Collapsed**: each deeper toast peeks `COLLAPSE_OFFSET` px past the one
 *   in front and scales down by `SCALE_STEP`, forming a tidy pile. Toasts past
 *   `visibleToasts` fade to 0.
 * - **Expanded**: toasts spread out by the measured heights of those in front
 *   (+ gap) and return to full scale, so every message is fully readable.
 *
 * The pile always grows *into* the screen and away from the anchored edge, so a
 * bottom-anchored stack extends upward and a top-anchored one downward.
 */
function computeStackGeometry({ toasts, heightMap, expanded, visibleToasts }: ComputeGeometryParams): Map<string, ToastStackGeometry> {
  const geometry = new Map<string, ToastStackGeometry>();
  const count = toasts.length;
  // Accumulates height (+ gap) of toasts in front of the current one, used for
  // the expanded layout so multi-line toasts never overlap.
  let cumulativeHeight = 0;

  for (let i = count - 1; i >= 0; i--) {
    const toast = toasts[i];
    const frontIndex = count - 1 - i;
    const height = heightMap.get(toast.id) ?? TOAST_DIMENSIONS.MIN_HEIGHT;

    const magnitude = expanded ? cumulativeHeight : frontIndex * COLLAPSE_OFFSET;
    // Grow away from the anchored edge: bottom-anchored piles move up (negative),
    // top-anchored piles move down (positive).
    const growthSign = -toastExitSign(toast.position);

    geometry.set(toast.id, {
      offset: growthSign * magnitude,
      scale: expanded ? 1 : Math.max(MIN_SCALE, 1 - frontIndex * SCALE_STEP),
      opacity: frontIndex < visibleToasts ? 1 : 0,
      frontIndex,
    });

    cumulativeHeight += height + STACK_GAP;
  }

  return geometry;
}

const EMPTY_GEOMETRY: ToastStackGeometry = { offset: 0, scale: 1, opacity: 1, frontIndex: 0 };

/**
 * ToastContainer - Renders all active toasts as a Sonner-style stack.
 *
 * Toasts anchor to the top of the screen by default (each toast may opt into
 * `position: 'bottom'`). By default they collapse
 * into a peeking pile (newest in front); tapping the pile expands it so every
 * toast is fully visible. Positions animate via transform/opacity on the UI
 * thread (no layout writes).
 *
 * Expanding is a read gesture, so it freezes every auto-dismiss timer for as
 * long as the stack stays open, and the stack collapses itself after
 * `EXPANDED_IDLE_TIMEOUT` of quiet. Collapse (tap or idle) then gives each
 * toast a short `POST_READ_DISMISS_DURATION` grace period — the pile was
 * already read, so leftover original duration is discarded.
 */
export function ToastContainer({ toasts, onDismiss, visibleToasts = DEFAULT_VISIBLE_TOASTS, expandByDefault = false }: ToastContainerProps) {
  const heightMapRef = useRef(new Map<string, number>());
  const [expanded, setExpanded] = useState(expandByDefault);
  const [geometry, setGeometry] = useState<Map<string, ToastStackGeometry>>(() => new Map());
  // Timestamp of the last interaction with a *user-expanded* stack, or `null`
  // when nobody is reading. Non-null freezes every toast's auto-dismiss timer
  // and arms the idle collapse below.
  const [readingSince, setReadingSince] = useState<number | null>(null);
  const isReading = readingSince !== null;

  const recompute = useCallback(
    (nextExpanded: boolean) => {
      setGeometry(computeStackGeometry({ toasts, heightMap: heightMapRef.current, expanded: nextExpanded, visibleToasts }));
    },
    [toasts, visibleToasts],
  );

  const handleHeightMeasured = useCallback(
    (id: string, height: number) => {
      const prev = heightMapRef.current.get(id);
      if (prev === height) return;

      heightMapRef.current.set(id, height);
      recompute(expanded);
    },
    [expanded, recompute],
  );

  const handleToggleExpand = useCallback(() => {
    const next = !expanded;
    setExpanded(next);
    // Only a deliberate expand counts as reading. An `expandByDefault` stack is
    // permanently spread out, so pausing there would mean toasts never leave.
    setReadingSince(next && !expandByDefault ? Date.now() : null);
  }, [expanded, expandByDefault]);

  const handleDismiss = useCallback(
    (id: string) => {
      // Swiping one away means the user is still working through the pile, so
      // push the idle collapse back rather than letting it fire mid-read.
      setReadingSince((since) => (since === null ? null : Date.now()));
      onDismiss(id);
    },
    [onDismiss],
  );

  // A pile of one (or none) has nothing to expand — keep it collapsed unless
  // the consumer asked for an always-expanded stack.
  useEffect(() => {
    if (toasts.length <= 1 && !expandByDefault && expanded) {
      setExpanded(false);
      setReadingSince(null);
    }
  }, [toasts.length, expandByDefault, expanded]);

  // Reading freezes every timer, so the expanded state needs its own ceiling:
  // collapse once the user goes quiet. Each toast then gets a short post-read
  // grace period instead of resuming whatever was left on the original clock.
  useEffect(() => {
    if (readingSince === null) return;

    const idleTimer = setTimeout(() => {
      setExpanded(false);
      setReadingSince(null);
    }, TOAST_ANIMATION.EXPANDED_IDLE_TIMEOUT);

    return () => clearTimeout(idleTimer);
  }, [readingSince]);

  useLayoutEffect(() => {
    const toastIds = new Set(toasts.map((t) => t.id));
    for (const id of heightMapRef.current.keys()) {
      if (!toastIds.has(id)) heightMapRef.current.delete(id);
    }
    recompute(expanded);
  }, [toasts, expanded, recompute]);

  const count = toasts.length;

  if (count === 0) {
    return null;
  }

  // This container no longer mints its own `FullWindowOverlay`.
  // iOS z-order above sheets is handled by the consolidated `AppFloatOverlayHost`
  // (see `libs/etoro-ui/src/components/overlays/app-float-overlay/`). The toast
  // registrar (`context.tsx`) subscribes this container to that host at
  // `OverlayPriority.Toast`, so the host's shared `FullWindowOverlay` +
  // `GestureHandlerRootView` wrap us on iOS without a per-container overlay.
  // On Android the container renders inline in the provider's tree (as before).
  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => {
        const geo = geometry.get(toast.id) ?? EMPTY_GEOMETRY;
        return (
          <EtToast
            key={toast.id}
            config={toast}
            onDismiss={handleDismiss}
            stackOffset={geo.offset}
            stackScale={geo.scale}
            stackOpacity={geo.opacity}
            frontIndex={geo.frontIndex}
            stackCount={count}
            expanded={expanded}
            timerPaused={isReading}
            onToggleExpand={handleToggleExpand}
            onHeightMeasured={handleHeightMeasured}
          />
        );
      })}
    </View>
  );
}

ToastContainer.displayName = 'ToastContainer';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    alignItems: 'center',
  },
});
