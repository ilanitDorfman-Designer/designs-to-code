import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';

/**
 * Resolves the skeleton base color from the active theme.
 *
 * `base` is the resting placeholder color. It pulses in opacity to signal
 * loading without any gradient compositing.
 */
export function useSkeletonTheme() {
  const { colors } = useEtoroTheme();
  // Theme-adaptive carbon surface: in dark mode `bgNeutralGreyPrimary` (v1 neutral-800)
  // read too gray/bright against the near-black page ground — `carbon100` (#242628 dark)
  // is the same fill the app's chip/card surfaces use, so placeholders sit INTO the page
  // instead of on top of it, in both themes.
  const base = colors.carbon100;

  return { base };
}
