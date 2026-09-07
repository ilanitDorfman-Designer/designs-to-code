// ==============================================
// eToro Core Hooks Library
// ==============================================
// This file provides a clean API surface for all custom React hooks.

// ========== UI & Animation ==========
export { useAnimatedHeader } from './use-animated-header';
export { useScreenScroll } from './use-screen-scroll';
export { useScrollHandler } from './use-scroll-handler';
export type { UseWebDragToScrollParams } from './use-web-drag-to-scroll';
export { useWebDragToScroll } from './use-web-drag-to-scroll';
export type { UseWebDraggableCarouselParams } from './use-web-draggable-carousel';
export { useWebDraggableCarousel } from './use-web-draggable-carousel';
export type { UseWebScrollSettleParams, WebScrollSettleOffset } from './use-web-scroll-settle';
export { useWebScrollSettle } from './use-web-scroll-settle';

// ========== Layout ==========
export { useBreakpoint } from './use-breakpoint';
export { useBreakpointTier } from './use-breakpoint-tier';
export type { LayoutDirection } from './use-layout-direction';
export { useLayoutDirection } from './use-layout-direction';

// ========== Interaction ==========
export type { UseHoverResult } from './use-hover';
export { useHover } from './use-hover';

// ========== Theme ==========
export { useEtoroTheme } from './use-etoro-theme';

// ========== Performance ==========
export { withFocusedObserver } from './with-focused-observer';

// ========== Accessibility ==========
export { useReducedMotion } from './accessibility';

// ========== Liquid Glass ==========
export type {
  EtGlassViewProps,
  GlassEffectModule,
  GlassEffectStyle,
  GlassSurface,
  GlassSurfaceBlurLayerProps,
  GlassSurfaceBlurProps,
  LiquidGlassContextValue,
} from '../liquid-glass';
export {
  EtGlassView,
  GlassSurfaceBlurLayer,
  LiquidGlassContext,
  registerGlassEffect,
  resetGlassEffect,
  useGlassSurface,
  useLiquidGlass,
  useLiquidGlassContext,
} from '../liquid-glass';

// ========== Skia Readiness ==========
export { EtCanvas } from '../skia/et-canvas';
export type { SkiaRuntimeSnapshot, SkiaRuntimeStatus } from '../skia/skia-ready';
export { configureSkiaRuntimeLoader, markSkiaReady, requestSkiaRuntime, retrySkiaRuntime, useSkiaReady, useSkiaRuntime } from '../skia/skia-ready';
