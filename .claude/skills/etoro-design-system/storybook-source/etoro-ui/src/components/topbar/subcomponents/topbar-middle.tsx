import { StyleSheet, View, ViewProps } from 'react-native';

/**
 * Middle slot is positioned absolutely to keep its content centered
 * even when Left/Right have different widths.
 *
 * It uses pointerEvents="box-none" so it won't block touches on Left/Right.
 */
export function TopbarMiddleRoot({ children, style, pointerEvents = 'box-none', ...rest }: ViewProps) {
  return (
    <View {...rest} pointerEvents={pointerEvents} style={[styles.middle, style]}>
      {children}
    </View>
  );
}

TopbarMiddleRoot.displayName = 'TopbarMiddleRoot';

export const TopbarMiddle = Object.assign(TopbarMiddleRoot, {
  etTopbarSlot: 'middle' as const,
});

const styles = StyleSheet.create({
  middle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
