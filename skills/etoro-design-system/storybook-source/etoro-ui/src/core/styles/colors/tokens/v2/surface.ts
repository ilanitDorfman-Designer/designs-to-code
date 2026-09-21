import { neutralV2, neutralV2Opacity, verdictNegative, verdictPositive } from '../../primitives';

const surfaceLight = {
  backgroundBase: neutralV2[50],
  backgroundShell: neutralV2[50],
  backgroundMenu: neutralV2[50],
  // Until design ships a real light value, the light Elevated surface paints the light
  // background. This is the ONE place the decision lives — `resolveSurface` only maps role → token.
  backgroundElevated: neutralV2[50],
  overlayTop: neutralV2Opacity[800.92],
  overlayBottom: neutralV2Opacity[900.95],

  cardDefault: neutralV2Opacity[900.04],
  cardOverlay: neutralV2[200],
  cardDisabled: neutralV2Opacity[900.03],
  cardRaised: neutralV2Opacity[900.04],
  cardPositive: verdictPositive[50],
  cardNegative: verdictNegative[50],
};

const surfaceDark = {
  backgroundBase: neutralV2[1000],
  backgroundShell: neutralV2[800],
  backgroundMenu: neutralV2[800],
  backgroundElevated: neutralV2[900],
  overlayTop: neutralV2Opacity[800.92],
  overlayBottom: neutralV2Opacity[900.95],

  cardDefault: neutralV2Opacity[50.1],
  cardOverlay: neutralV2[700],
  cardDisabled: neutralV2Opacity[900.03],
  cardRaised: neutralV2Opacity[50.1],
  cardPositive: '#242A25',
  cardNegative: '#2A2424',
};

export type SurfaceTokensLight = typeof surfaceLight;
export type SurfaceTokensDark = typeof surfaceDark;

export { surfaceDark, surfaceLight };
