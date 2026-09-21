import { FC, memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { EtText } from '../../../../foundations/text';
import { useAvatarGroupContext } from '../utils/context';
import { getBorderRadius, getSizeValue, GROUP_COUNT_CONFIGS } from '../utils/styles';
import type { AvatarGroupCountProps } from '../utils/types';

/**
 * EtAvatar.GroupCount - Count indicator for avatar groups (+N)
 *
 * Renders as a pill that grows to fit its text (never narrower than the avatar
 * size), so counts like `+5` or `+120` stay legible and centered at every size.
 */
function AvatarGroupCountBase({ children, size, shape = 'circle', style, ...rest }: AvatarGroupCountProps) {
  const { colors } = useEtoroTheme();
  const group = useAvatarGroupContext();

  // Size precedence: explicit prop > enclosing group's size > medium default.
  const resolvedSize = size ?? group?.size ?? 'medium';
  const sizeValue = getSizeValue(resolvedSize);
  const borderRadius = getBorderRadius(resolvedSize, shape);
  const { fontSize, paddingHorizontal } = GROUP_COUNT_CONFIGS[resolvedSize];

  // Grow-to-fit pill: fixed height, min width = avatar size, horizontal padding for wider counts.
  const containerStyle = useMemo(
    () => ({
      height: sizeValue,
      minWidth: sizeValue,
      paddingHorizontal,
      borderRadius,
      backgroundColor: colors.cardDefault,
    }),
    [sizeValue, paddingHorizontal, borderRadius, colors.cardDefault],
  );

  // lineHeight pinned to the bubble height keeps the single line vertically centered at any size.
  const textStyle = useMemo(
    () => ({ color: colors.carbon500, fontSize, lineHeight: sizeValue, textAlign: 'center' as const }),
    [colors.carbon500, fontSize, sizeValue],
  );

  return (
    <View style={[styles.container, containerStyle, style]} {...rest}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <EtText variant="label-tertiary-semibold" style={textStyle}>
          {children}
        </EtText>
      ) : (
        children
      )}
    </View>
  );
}

AvatarGroupCountBase.displayName = 'EtAvatar.GroupCount';

export const AvatarGroupCount: FC<AvatarGroupCountProps> = memo(AvatarGroupCountBase);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
