import { ReactNode, useContext, useEffect, useMemo } from 'react';

import { useScreenContext } from '../../api/context';
import { TopBarStateContext } from '../../api/top-bar-context';
import { EtScreenTopBarRootProps } from '../../api/top-bar-types';

interface ScreenTopBarContentProps extends Omit<EtScreenTopBarRootProps, 'children'> {
  raw?: boolean;
  rawContent?: ReactNode;
}

/**
 * Content component that consumes TopBar context (when in slot mode) and registers the
 * resolved config with EtScreen. Separated so TopBarContext is available to slot consumers.
 *
 * In `raw` mode, the slot context is skipped entirely — {@link rawContent} is forwarded as-is
 * for {@link AnimatedHeaderContainer} to render in place of the standard `TopBarRenderer`.
 */
export function ScreenTopBarContent({
  isInnerScreen = false,
  animation = 'collapse',
  animationOptions,
  blurEffect = true,
  transparent = false,
  style,
  raw = false,
  rawContent,
}: ScreenTopBarContentProps) {
  const { registerTopBar, unregisterTopBar } = useScreenContext();
  // Read TopBarStateContext directly (not via useTopBarContext, which throws when no provider is
  // mounted). In `raw` mode the parent intentionally skips TopBarContextProvider so the value is
  // null — that's fine because slot values are ignored when raw is set.
  const slotState = useContext(TopBarStateContext);

  const config = useMemo(
    () => ({
      isInnerScreen,
      animation,
      animationOptions,
      blurEffect,
      transparent,
      style,
      raw,
      rawContent: raw ? rawContent : undefined,
      start: raw ? null : (slotState?.start ?? null),
      middle: raw ? null : (slotState?.middle ?? null),
      end: raw ? null : (slotState?.end ?? null),
    }),
    [
      isInnerScreen,
      animation,
      animationOptions,
      blurEffect,
      transparent,
      style,
      raw,
      rawContent,
      slotState?.start,
      slotState?.middle,
      slotState?.end,
    ],
  );

  // Split register/unregister like Overlay + TopBar slots: config identity churns whenever
  // slot children are re-published. Chaining unregister→register briefly nulls `topBarConfig`
  // and rematerializes Liquid Glass chrome on every parent re-render (PAH-788).
  useEffect(() => {
    registerTopBar(config);
  }, [config, registerTopBar]);

  useEffect(() => {
    return () => {
      unregisterTopBar();
    };
  }, [unregisterTopBar]);

  return null;
}
