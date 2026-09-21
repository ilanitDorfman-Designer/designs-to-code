import { FC, memo, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { EtText } from '../../../../foundations/text';
import { useAvatarContext } from '../utils/context';
import { getBorderRadius, getSizeValue } from '../utils/styles';
import type { AvatarFallbackProps } from '../utils/types';

/**
 * EtAvatar.Fallback - Fallback content when image fails to load
 * Only renders when image has error or hasn't loaded (with optional delay)
 */
function AvatarFallbackBase({ children, delayMs, style, ...rest }: AvatarFallbackProps) {
  const { colors } = useEtoroTheme();
  const { size, shape, imageLoaded, imageError } = useAvatarContext();
  const [canRender, setCanRender] = useState(delayMs === undefined);

  const sizeValue = getSizeValue(size);
  const borderRadius = getBorderRadius(size, shape);

  // Handle delay before showing fallback
  useEffect(() => {
    if (delayMs === undefined) {
      setCanRender(true);
      return;
    }
    const timer = setTimeout(() => setCanRender(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  // Memoize container style to avoid inline object creation
  const containerStyle = useMemo(
    () => ({
      width: sizeValue,
      height: sizeValue,
      borderRadius,
      backgroundColor: colors.cardDefault,
    }),
    [sizeValue, borderRadius, colors.cardDefault],
  );

  // Memoize text style to avoid inline object creation
  const textStyle = useMemo(() => ({ color: colors.carbon500 }), [colors.carbon500]);

  // Don't render if image loaded successfully
  if (imageLoaded && !imageError) {
    return null;
  }

  // Don't render if delay hasn't passed
  if (!canRender) {
    return null;
  }

  return (
    <View style={[styles.fallback, containerStyle, style]} {...rest}>
      {typeof children === 'string' ? (
        <EtText variant="label-tertiary-semibold" style={textStyle}>
          {children}
        </EtText>
      ) : (
        children
      )}
    </View>
  );
}

AvatarFallbackBase.displayName = 'EtAvatar.Fallback';

export const AvatarFallback: FC<AvatarFallbackProps> = memo(AvatarFallbackBase);

const styles = StyleSheet.create({
  fallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
