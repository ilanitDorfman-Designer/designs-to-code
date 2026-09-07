import { Canvas } from '@shopify/react-native-skia';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { useSkiaReady } from './skia-ready';

type EtCanvasProps = ComponentProps<typeof Canvas> & {
  /** Shown until CanvasKit is ready on web. */
  fallback?: ReactNode;
};

// Web-safe Skia Canvas: flattens `style` (Skia's web Canvas forwards it to the DOM, so an array crashes react-dom)
// and gates on CanvasKit readiness (renders `fallback` until the WASM loads). Native behaves like a plain Canvas.
export function EtCanvas({ style, fallback = null, children, ...rest }: EtCanvasProps) {
  const skiaReady = useSkiaReady();
  if (!skiaReady) {
    return fallback;
  }
  return (
    <Canvas style={StyleSheet.flatten(style)} {...rest}>
      {children}
    </Canvas>
  );
}
