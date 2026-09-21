import { describe, expect, it } from '@jest/globals';

import { BREAKPOINT_ASIDE_INLINE, SHELL_TIERS } from '../../../../core/styles/breakpoints';
import { eToroDarkColors, eToroLightColors } from '../../../../core/styles/colors';
import { neutralV2 } from '../../../../core/styles/colors/primitives';
import { resolveSurface } from '../../../../core/styles/surface';
import { Z_SHELL_ASIDE, Z_SHELL_CONTENT } from '../../../../core/styles/z-index';
import {
  COLLAPSE_MS as MENU_COLLAPSE_MS,
  EASE_ACCELERATE as MENU_EASE_ACCELERATE,
  EASE_DECELERATE as MENU_EASE_DECELERATE,
  EXPAND_MS as MENU_EXPAND_MS,
  HOVER_IN_MS as MENU_HOVER_IN_MS,
  HOVER_OUT_MS as MENU_HOVER_OUT_MS,
  REDUCED_MOTION_FADE_MS as MENU_REDUCED_MOTION_FADE_MS,
} from '../../side-menu/constants';
import {
  ASIDE_GAP_INLINE,
  ASIDE_GAP_OVERLAY,
  ASIDE_WIDTH_TIERS,
  COLLAPSE_MS,
  EASE_ACCELERATE,
  EASE_DECELERATE,
  EXPAND_MS,
  HOVER_IN_MS,
  HOVER_OUT_MS,
  PANEL_WIDTH_BY_TIER,
  panelWidthForTier,
  RAIL_HOVER_WIDTH,
  RAIL_WIDTH,
  REDUCED_MOTION_FADE_MS,
} from '../constants';

describe('app-layout constants', () => {
  it('flips overlay → inline at 1440, without touching SHELL_TIERS', () => {
    expect(BREAKPOINT_ASIDE_INLINE).toBe(1440);
    expect(SHELL_TIERS).toEqual([1024, 1366, 1720]);
  });

  it('paints the aside above Main in the Body-row sibling scope', () => {
    expect(Z_SHELL_ASIDE).toBeGreaterThan(Z_SHELL_CONTENT);
  });

  it('matches the design table: panel widths per width tier', () => {
    expect(ASIDE_WIDTH_TIERS).toEqual([1024, 1280, 1366, 1720]);
    expect(PANEL_WIDTH_BY_TIER).toEqual([344, 360, 368, 376, 384]);
    expect(panelWidthForTier(-1)).toBe(344); // 768–1023
    expect(panelWidthForTier(0)).toBe(360); // 1024–1279
    expect(panelWidthForTier(1)).toBe(368); // 1280–1365
    expect(panelWidthForTier(2)).toBe(376); // 1366–1719
    expect(panelWidthForTier(3)).toBe(384); // ≥1720
  });

  it('matches the design table: rail widths and gaps', () => {
    expect(RAIL_WIDTH).toBe(60);
    expect(RAIL_HOVER_WIDTH).toBe(68);
    expect(ASIDE_GAP_OVERLAY).toBe(8);
    expect(ASIDE_GAP_INLINE).toBe(12);
  });

  it('mirrors the left-menu animation constants exactly', () => {
    expect(EXPAND_MS).toBe(MENU_EXPAND_MS);
    expect(COLLAPSE_MS).toBe(MENU_COLLAPSE_MS);
    expect(HOVER_IN_MS).toBe(MENU_HOVER_IN_MS);
    expect(HOVER_OUT_MS).toBe(MENU_HOVER_OUT_MS);
    expect(REDUCED_MOTION_FADE_MS).toBe(MENU_REDUCED_MOTION_FADE_MS);
    expect(EASE_DECELERATE).toEqual(MENU_EASE_DECELERATE);
    expect(EASE_ACCELERATE).toEqual(MENU_EASE_ACCELERATE);
  });

  // Design contract: the Elevated surface reads as a raised plane in dark and, until design ships a real
  // light value, as the page itself in light. Asserted as that contract, not as a literal — the
  // literal is the token file's to choose.
  it('resolves the elevated surface role against the theme (light elevated = light background)', () => {
    expect(resolveSurface('elevated', eToroDarkColors.colors)).toBe(neutralV2[900]);
    expect(resolveSurface('elevated', eToroDarkColors.colors)).not.toBe(resolveSurface('base', eToroDarkColors.colors));
    expect(resolveSurface('elevated', eToroLightColors.colors)).toBe(resolveSurface('base', eToroLightColors.colors));
  });
});
