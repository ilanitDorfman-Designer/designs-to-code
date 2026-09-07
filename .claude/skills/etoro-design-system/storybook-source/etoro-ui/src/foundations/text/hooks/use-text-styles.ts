import { useMemo } from 'react';
import { StyleSheet, TextStyle } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { FontWeightKey, getFontFamily, getFontSize, getVariantConfig, TextVariant } from '../utils';
import { fontWeightToKey } from '../utils/font-mapping';

export const ENABLE_LIGHT_MODE_TEXT_SHADOW = false;

export const useTextStyles = ({
  variant,
  colors,
  dark,
  weightProp,
  fontWeightOverride,
}: {
  variant: TextVariant;
  colors: ReturnType<typeof useEtoroTheme>['colors'];
  dark: ReturnType<typeof useEtoroTheme>['dark'];
  weightProp?: FontWeightKey;
  fontWeightOverride?: TextStyle['fontWeight'];
}) => {
  return useMemo(() => {
    const config = getVariantConfig(variant);
    const fontSize = getFontSize(config.size);

    // Priority: weight prop > style fontWeight > variant default
    const weight: FontWeightKey = weightProp ? weightProp : fontWeightOverride ? fontWeightToKey(fontWeightOverride) : config.weight;

    const fontFamily = getFontFamily(weight);
    const color = colors[config.colorKey];

    const styles = StyleSheet.create({
      text: {
        fontSize,
        color,
        fontFamily,
        lineHeight: config.lineHeight,
        letterSpacing: config.letterSpacing,
        ...(ENABLE_LIGHT_MODE_TEXT_SHADOW && dark === false
          ? {
              textShadowColor: color,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 0.15,
            }
          : {}),
      },
    });

    return styles;
  }, [variant, colors, dark, weightProp, fontWeightOverride]);
};
