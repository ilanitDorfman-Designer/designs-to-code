import { Children, cloneElement, FC, isValidElement, memo, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import type { AvatarGroupContextValue } from '../utils/context';
import { AvatarGroupContext } from '../utils/context';
import { GROUP_COUNT_GAP, GROUP_OVERLAP_BY_SIZE, GROUP_STYLES } from '../utils/styles';
import type { AvatarGroupProps } from '../utils/types';
import { AvatarGroupCount } from './avatar-group-count';

/**
 * EtAvatar.Group - Container for grouped avatars with overlap
 *
 * Applies a glass pill background and a size-aware overlap between avatars.
 * Cascades `size` (default `'medium'`) to nested avatars that don't set their
 * own `size`. Pass `size="xsmall"` for the 16px stacked-logo pattern. The `+N`
 * count bubble sits with a small gap (not overlap) and on top, so its leading
 * `+` is always visible.
 */
function AvatarGroupBase({ children, size = 'medium', style, ...rest }: AvatarGroupProps) {
  const { colors } = useEtoroTheme();

  // Memoize container style to avoid inline object creation
  const containerStyle = useMemo(() => ({ backgroundColor: colors.cardDefault }), [colors.cardDefault]);

  // Stable overlap margin derived from the group's size
  const overlapStyle = useMemo(() => ({ marginLeft: GROUP_OVERLAP_BY_SIZE[size] }), [size]);

  // Memoize children mapping to avoid recreation on every render
  const renderedChildren = useMemo(() => {
    const childArray = Children.toArray(children);
    return childArray.map((child, index) => {
      if (!isValidElement<{ style?: StyleProp<ViewStyle> }>(child)) return child;

      const isCount = child.type === AvatarGroupCount;

      // Avatars overlap; the count bubble gets a small positive gap and sits on
      // top (zIndex) so its leading `+` never hides under the previous avatar.
      let marginStyle: ViewStyle | undefined;
      if (index > 0) {
        marginStyle = isCount ? { marginLeft: GROUP_COUNT_GAP, zIndex: index + 1 } : overlapStyle;
      }

      return cloneElement(child, {
        key: child.key ?? index,
        style: [child.props.style, marginStyle],
      });
    });
  }, [children, overlapStyle]);

  // Stable context value so nested avatars inherit the group's size
  const groupContextValue = useMemo<AvatarGroupContextValue>(() => ({ size }), [size]);

  return (
    <AvatarGroupContext.Provider value={groupContextValue}>
      <View style={[styles.container, containerStyle, style]} {...rest}>
        {renderedChildren}
      </View>
    </AvatarGroupContext.Provider>
  );
}

AvatarGroupBase.displayName = 'EtAvatar.Group';

export const AvatarGroup: FC<AvatarGroupProps> = memo(AvatarGroupBase);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: GROUP_STYLES.containerPaddingLeft,
    paddingRight: GROUP_STYLES.containerPaddingRight,
    paddingVertical: GROUP_STYLES.containerPaddingVertical,
    borderRadius: GROUP_STYLES.containerRadius,
  },
});
