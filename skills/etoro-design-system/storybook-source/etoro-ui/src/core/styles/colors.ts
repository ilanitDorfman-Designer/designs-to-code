import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import {
  actionsDark as actionsBackgroundDark,
  actionsLight as actionsBackgroundLight,
  negativeDark,
  negativeLight,
  positiveDark,
  positiveLight,
  surfaceDark,
  surfaceLight,
} from './colors/tokens/background';
import {
  actionsDark,
  actionsLight,
  dividersDark,
  dividersLight,
  neutralDark,
  neutralLight,
  statusDark,
  statusLight,
  uniqueDark,
  uniqueLight,
} from './colors/tokens/text';
import {
  accentTokensDark,
  accentTokensLight,
  carbonDark,
  carbonLight,
  primaryTokensDark,
  primaryTokensLight,
  riskLevelDark,
  riskLevelLight,
  surfaceDark as surfaceV2Dark,
  surfaceLight as surfaceV2Light,
  verdictNegativeTokensDark,
  verdictNegativeTokensLight,
  verdictPositiveTokensDark,
  verdictPositiveTokensLight,
} from './colors/tokens/v2';

export type eToroTheme = typeof eToroLightColors;

/**
 * Light theme implementation with all colors flattened
 */
export const eToroLightColors = {
  dark: false,
  colors: {
    // Text, icons & borders
    ...DefaultTheme.colors,
    ...neutralLight,
    ...dividersLight,
    ...actionsLight,
    ...statusLight,
    ...uniqueLight,

    // Backgrounds
    ...actionsBackgroundLight,
    ...positiveLight,
    ...negativeLight,
    ...surfaceLight,

    // ===== Full Transparent =====
    transparent: 'transparent',
    avatarOverlayTop: 'rgba(255,255,255,0.25)',
    avatarOverlayBottom: 'rgba(44, 44, 44, 0.0001)',

    // V2 tokens
    ...carbonLight,
    ...primaryTokensLight,
    ...verdictPositiveTokensLight,
    ...verdictNegativeTokensLight,
    ...riskLevelLight,
    ...accentTokensLight,
    ...surfaceV2Light,
  },
  fonts: {
    ...DefaultTheme.fonts,
  },
};

/**
 * Dark theme implementation with all colors flattened
 */
export const eToroDarkColors = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    // Text, icons & borders
    ...neutralDark,
    ...dividersDark,
    ...actionsDark,
    ...statusDark,
    ...uniqueDark,

    // Backgrounds
    ...actionsBackgroundDark,
    ...positiveDark,
    ...negativeDark,
    ...surfaceDark,

    avatarOverlayTop: 'rgba(255,255,255,0.25)',
    avatarOverlayBottom: 'rgba(44, 44, 44, 0.0001)',

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
export interface eToroLightTheme {
  dark: boolean;
  colors: eToroTheme['colors'];
}

export interface eToroDarkTheme {
  dark: boolean;
  colors: eToroTheme['colors'];
}
