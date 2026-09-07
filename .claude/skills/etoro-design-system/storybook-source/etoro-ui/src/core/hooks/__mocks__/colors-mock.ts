import { DarkTheme } from '@react-navigation/native';
import { actionsDark as actionsBackgroundDark, negativeDark, positiveDark, surfaceDark } from '../../styles/colors/tokens/background';
import { actionsDark, dividersDark, neutralDark, statusDark, uniqueDark } from '../../styles/colors/tokens/text';
import {
  accentTokensDark,
  carbonDark,
  primaryTokensDark,
  riskLevelDark,
  surfaceDark as surfaceV2Dark,
  verdictNegativeTokensDark,
  verdictPositiveTokensDark,
} from '../../styles/colors/tokens/v2';

export const colorsMock = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    // Text, icons & borders
    ...neutralDark,
    ...dividersDark,
    ...actionsDark,
    ...statusDark,
    ...uniqueDark,
    ...carbonDark,

    // Backgrounds
    ...actionsBackgroundDark,
    ...positiveDark,
    ...negativeDark,
    ...surfaceDark,

    avatarOverlayTop: 'rgba(255,255,255,0.75)',
    avatarOverlayBottom: 'rgba(44, 44, 44, 0)',

    // ===== Full Transparent =====
    transparent: 'transparent',

    // V2 tokens
    ...carbonDark,
    ...primaryTokensDark,
    ...verdictPositiveTokensDark,
    ...verdictNegativeTokensDark,
    ...riskLevelDark,
    ...accentTokensDark,
    ...surfaceV2Dark,
  },
  fonts: {
    ...DarkTheme.fonts,
  },
};
