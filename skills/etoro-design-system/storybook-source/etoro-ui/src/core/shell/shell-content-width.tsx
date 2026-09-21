import { createContext, ReactNode, useContext } from 'react';
import { useWindowDimensions } from 'react-native';

/**
 * The width of the frame's content column, or `null` where there is no frame.
 *
 * Deliberately NOT a field on {@link Shell}: this number changes on every resize
 * pixel, and putting it there would re-render every `useShell()` consumer for
 * the whole of a window drag.
 */
const ShellContentWidthContext = createContext<number | null>(null);

export interface ShellContentWidthProviderProps {
  width: number | null;
  children: ReactNode;
}

/** Publishes the frame's content width. Mounted by the web frame and by nothing else. */
export function ShellContentWidthProvider({ width, children }: ShellContentWidthProviderProps) {
  return <ShellContentWidthContext.Provider value={width}>{children}</ShellContentWidthContext.Provider>;
}

/**
 * The width a screen actually gets — the window on native and on phone-width web,
 * and the frame's content column under the frame.
 *
 * Use this instead of `useWindowDimensions().width` wherever a screen sizes
 * something to "the page". The frame puts screens in a flex child sharing a row
 * with the rail and the aside, so the window is 140–156px too wide at 1024–1439
 * and up to ~480px too wide at ≥1440.
 */
export function useContentWidth(): number {
  const frameContentWidth = useContext(ShellContentWidthContext);
  const windowWidth = useWindowDimensions().width;
  return frameContentWidth ?? windowWidth;
}
