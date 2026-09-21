import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, Text, type Text as TextType } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../core/hooks';
import { EtTextProps } from './api';
import { useTextStyles } from './hooks';
import { useEtShrinkTextModel } from './hooks/use-et-shrink-text-model';
import { MAX_FONT_SIZE_MULTIPLIER } from './utils/variant-config';

const EtTextComponent = forwardRef<TextType, EtTextProps>((props, ref) => {
  const { colors, dark } = useEtoroTheme();

  const {
    variant = 'body-base-regular',
    weight,
    style: styleOverride,
    children,
    entering,
    exiting,
    maxFontSizeMultiplier = MAX_FONT_SIZE_MULTIPLIER,
    shrinkToFit = false,
    minimumFontScale: minimumFontScaleProp,
    scaleStep = 0.05,
    numberOfLines,
    adjustsFontSizeToFit,
    onTextLayout,
    ...rest
  } = props;

  const shrinkMinimumFontScale = minimumFontScaleProp ?? 0.85;

  const { handleTextLayout, androidFontStyle } = useEtShrinkTextModel({
    enabled: shrinkToFit,
    variant,
    minimumFontScale: shrinkMinimumFontScale,
    scaleStep,
    children,
    onTextLayout,
  });

  // Flatten style to check for fontWeight override (lower priority than weight prop)
  const flattenedStyle = useMemo(() => StyleSheet.flatten(styleOverride) || {}, [styleOverride]);
  const fontWeightOverride = flattenedStyle.fontWeight;

  const styles = useTextStyles({
    variant,
    colors,
    dark,
    weightProp: weight,
    // Only use style fontWeight if weight prop is not provided
    fontWeightOverride: weight ? undefined : fontWeightOverride,
  });

  const TextComponent = entering || exiting ? Animated.Text : Text;

  const { fontWeight, ...styleWithoutFontWeight } = flattenedStyle;
  const finalStyleOverride = fontWeight ? styleWithoutFontWeight : styleOverride;

  return (
    <TextComponent
      ref={ref}
      style={[styles.text, finalStyleOverride, androidFontStyle]}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      numberOfLines={shrinkToFit ? 1 : numberOfLines}
      adjustsFontSizeToFit={shrinkToFit ? true : adjustsFontSizeToFit}
      minimumFontScale={shrinkToFit ? shrinkMinimumFontScale : minimumFontScaleProp}
      onTextLayout={shrinkToFit ? handleTextLayout : onTextLayout}
      {...rest}
    >
      {children}
    </TextComponent>
  );
});

EtTextComponent.displayName = 'EtText';
export const EtText = React.memo(EtTextComponent);
