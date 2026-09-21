import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { eToroTheme } from '../../../../core/styles/colors';
import {
  blueOpacity,
  greenOpacity,
  mintOpacity,
  neutralOpacity,
  orangeOpacity,
  purpleOpacity,
  red,
  violetOpacity,
  yellowOpacity,
} from '../../../../core/styles/colors/primitives';
import { BadgeColor, BadgeColors } from '../api/types';

/**
 * Background colors for badge variants (using opacity, same for light/dark)
 */
const backgrounds: Record<BadgeColor, string> = {
  neutral: neutralOpacity['200.2'],
  red: red['400.15'],
  orange: orangeOpacity['500.2'],
  yellow: yellowOpacity['500.2'],
  green: greenOpacity['400.2'],
  mint: mintOpacity['500.2'],
  blue: blueOpacity['500.2'],
  purple: purpleOpacity['500.2'],
  violet: violetOpacity['500.2'],
};

/**
 * Maps badge color prop to theme color key.
 *
 * NOTE: Partial V2 migration. `neutral`, `red`, `green` use V2 tokens (carbon500,
 * verdictNegative600, verdictPositive600). The 6 color-family variants
 * (orange/yellow/mint/blue/purple/violet) remain on V1 `status*` tokens because
 * the V2 palette does not yet provide carbon/primary/verdict equivalents for
 * those families. These will migrate when the V2 palette is extended.
 */
const textColorKeys: Record<BadgeColor, keyof eToroTheme['colors']> = {
  neutral: 'carbon500',
  red: 'verdictNegative600',
  orange: 'statusOrange',
  yellow: 'statusYellow',
  green: 'verdictPositive600',
  mint: 'statusMint',
  blue: 'statusBlue',
  purple: 'statusPurple',
  violet: 'statusViolet',
};

/**
 * Hook that returns badge colors for a given color variant
 * Uses theme colors for text (auto light/dark mode)
 *
 * @param color - Badge color variant
 * @returns Object with background and text colors
 */
export const useBadgeColors = (color: BadgeColor): BadgeColors => {
  const { colors } = useEtoroTheme();

  return {
    background: backgrounds[color],
    text: colors[textColorKeys[color]],
  };
};
