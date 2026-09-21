// ==============================================
// eToro Core Constants Library
// ==============================================
// This file provides a clean API surface for all core constants.

// ========== Theme & Styling ==========
export * from './breakpoints';
export * from './color.utils';
export * from './colors';
export * from './spacing';
export * from './z-index';

/*
 * `./surface` is deliberately NOT re-exported here. This is a constants barrel with ~46 importers
 * that only want spacing and colour tokens; the surface layer is a React context, and re-exporting
 * it drags the hooks barrel — liquid glass, the Skia canvas and runtime — into every one of their
 * module graphs, under a barrel that is not tree-shaken and whose requires Metro makes eager.
 * Import it from `etoro-ui/core/styles/surface` instead.
 */

// ========== Application ==========
export * from './constants';
