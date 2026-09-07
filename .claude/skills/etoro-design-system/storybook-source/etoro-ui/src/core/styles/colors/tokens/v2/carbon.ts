import { neutralV2, neutralV2Opacity } from '../../primitives';

const carbonLight = {
  carbon050: neutralV2[50],
  carbon100: neutralV2[100],
  carbon200: neutralV2[200],
  carbon300: neutralV2[300],
  carbon400: neutralV2[400],
  carbon500: neutralV2[500],
  carbon600: neutralV2[600],
  carbon700: neutralV2[700],
  carbon800: neutralV2[800],
  carbon900: neutralV2[900],
  carbonStatic900: neutralV2[900],
  carbonStatic1000: neutralV2[1000],
  carbon900Inverted: neutralV2[50],
  carbonStatic050: neutralV2[50],
  carbonOpacity500: neutralV2[50],
  carbonOverlayTop: neutralV2Opacity[800.92],
  carbonOverlayBottom: neutralV2Opacity[900.95],

  carbonPrimaryDivider: neutralV2Opacity[500.3],
  carbonSecondaryDivider: neutralV2Opacity[500.15],

  carbonEffectPrimaryShadow: neutralV2Opacity[900.06],
};

const carbonDark = {
  carbon050: neutralV2[900],
  carbon100: neutralV2[800],
  carbon200: neutralV2[700],
  carbon300: neutralV2[600],
  carbon400: neutralV2[500],
  carbon500: neutralV2[400],
  carbon600: neutralV2[300],
  carbon700: neutralV2[200],
  carbon800: neutralV2[100],
  carbon900: neutralV2[50],
  carbonStatic900: neutralV2[900],
  carbonStatic1000: neutralV2[1000],
  carbon900Inverted: neutralV2[900],
  carbonStatic050: neutralV2[50],
  carbonOpacity500: neutralV2[700],
  carbonOverlayTop: neutralV2Opacity[800.92],
  carbonOverlayBottom: neutralV2Opacity[900.95],

  carbonPrimaryDivider: neutralV2Opacity[500.25],
  carbonSecondaryDivider: neutralV2Opacity[500.15],

  carbonEffectPrimaryShadow: neutralV2Opacity[900.06],
};

export type CarbonLight = typeof carbonLight;
export type CarbonDark = typeof carbonDark;

export { carbonDark, carbonLight };
