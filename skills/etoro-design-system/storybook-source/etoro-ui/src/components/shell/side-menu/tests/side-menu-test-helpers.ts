import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

/** Flattens any style prop into a plain object (empty object for undefined). */
export const flat = (style: unknown): ViewStyle & TextStyle => StyleSheet.flatten(style as StyleProp<ViewStyle & TextStyle>) ?? {};

export const isHostElement = (node: ReactTestInstance): boolean => typeof node.type === 'string';

/**
 * Finds the rail or panel layer by its width — they are the only nodes that
 * carry BOTH an exact width and a pointerEvents style (rail = railWidth,
 * panel = PANEL_WIDTH). Throws when the layer is absent or ambiguous.
 */
export const findLayerByWidth = (root: ReactTestInstance, width: number): ReactTestInstance => {
  const matches = root.findAll((node) => {
    if (!isHostElement(node)) {
      return false;
    }
    const style = flat(node.props.style);
    return style.width === width && style.pointerEvents !== undefined;
  });
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one layer with width ${width}, found ${matches.length}`);
  }
  return matches[0];
};

/** Returns the transform array of the (single) transformed node inside a toggle/trigger. */
export const glyphTransform = (toggle: ReactTestInstance): ViewStyle['transform'] => {
  const nodes = toggle.findAll((node) => isHostElement(node) && flat(node.props.style).transform !== undefined);
  if (nodes.length === 0) {
    throw new Error('No transformed glyph wrapper found inside the given node');
  }
  return flat(nodes[0].props.style).transform;
};

/** Returns the `name` of the (single) EtIconV2 rendered inside a toggle/trigger. */
export const glyphIconName = (toggle: ReactTestInstance): string => {
  const nodes = toggle.findAll((node) => !isHostElement(node) && typeof node.props?.name === 'string');
  if (nodes.length === 0) {
    throw new Error('No named icon found inside the given node');
  }
  return nodes[0].props.name as string;
};
