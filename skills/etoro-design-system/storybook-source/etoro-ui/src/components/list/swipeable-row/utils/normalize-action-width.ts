const DEFAULT_BUTTON_WIDTH = 70;

/** Returns the given width when it is a positive finite number, otherwise the default (70). */
export function normalizeActionWidth(width: number | undefined, fallback: number = DEFAULT_BUTTON_WIDTH): number {
  return width != null && width > 0 && Number.isFinite(width) ? width : fallback;
}

export { DEFAULT_BUTTON_WIDTH };
