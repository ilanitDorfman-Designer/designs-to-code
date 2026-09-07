import { memo } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

export function TopbarEndRoot({ children, style, ...rest }: ViewProps) {
  return (
    <View style={[styles.end, style]} {...rest}>
      {children}
    </View>
  );
}

TopbarEndRoot.displayName = 'TopbarEnd';

export const TopbarEnd = Object.assign(memo(TopbarEndRoot), {
  etTopbarSlot: 'end' as const,
});

const styles = StyleSheet.create({
  end: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
});
