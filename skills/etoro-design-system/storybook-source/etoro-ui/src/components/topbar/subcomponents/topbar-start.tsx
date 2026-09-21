import { StyleSheet, View, ViewProps } from 'react-native';

export function TopbarStartRoot({ children, style, ...rest }: ViewProps) {
  return (
    <View style={[styles.start, style]} {...rest}>
      {children}
    </View>
  );
}

TopbarStartRoot.displayName = 'TopbarStart';

export const TopbarStart = Object.assign(TopbarStartRoot, {
  etTopbarSlot: 'start' as const,
});

const styles = StyleSheet.create({
  start: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 2,
  },
});
