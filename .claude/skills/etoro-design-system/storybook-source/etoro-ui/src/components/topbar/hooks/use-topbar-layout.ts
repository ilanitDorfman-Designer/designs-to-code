import { useMemo } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { useLiquidGlass } from '../../../core/liquid-glass';
import type { TopbarChildren } from '../api';
import { useSlots } from './use-slots';

export function useTopbarLayout(children: TopbarChildren) {
  const { colors } = useEtoroTheme();
  const { supportsLiquidGlass: isLiquidGlass } = useLiquidGlass();
  const slots = useSlots(children);

  const backgroundStyle = useMemo(() => ({ backgroundColor: colors.backgroundBase }), [colors.backgroundBase]);

  const liquidGlassContextValue = useMemo(() => ({ isLiquidGlass }), [isLiquidGlass]);

  return { slots, backgroundStyle, liquidGlassContextValue };
}
