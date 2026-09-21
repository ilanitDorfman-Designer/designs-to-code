import { useCallback, useEffect, useMemo, useState } from 'react';
import { type NativeSyntheticEvent, Platform, type TextLayoutEventData, type TextStyle } from 'react-native';

import type { EtTextProps } from '../api/types';
import { getVariantConfig, type TextVariant } from '../utils/variant-config';

const DEFAULT_SCALE_STEP = 0.05;
const DEFAULT_MIN_FONT_SCALE = 0.85;

export interface UseEtShrinkTextModelParams {
  enabled?: boolean;
  variant?: TextVariant;
  minimumFontScale?: number;
  scaleStep?: number;
  children: EtTextProps['children'];
  onTextLayout?: EtTextProps['onTextLayout'];
}

export interface UseEtShrinkTextModelResult {
  handleTextLayout: NonNullable<EtTextProps['onTextLayout']>;
  androidFontStyle: TextStyle | null;
}

/**
 * Drives cross-platform single-line shrink: iOS uses native `adjustsFontSizeToFit`; Android steps
 * `fontSize` down via `onTextLayout` until one line or `minimumFontScale` is reached.
 */
export function useEtShrinkTextModel({
  enabled = true,
  variant = 'body-base-regular',
  minimumFontScale = DEFAULT_MIN_FONT_SCALE,
  scaleStep = DEFAULT_SCALE_STEP,
  children,
  onTextLayout,
}: UseEtShrinkTextModelParams): UseEtShrinkTextModelResult {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!enabled) return;
    setScale(1);
  }, [children, enabled]);

  const handleTextLayout = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      onTextLayout?.(event);
      if (!enabled || Platform.OS === 'ios') return;
      const lines = event.nativeEvent.lines;
      if (lines.length > 1) {
        setScale((prev) => Math.max(prev - scaleStep, minimumFontScale));
      }
    },
    [enabled, onTextLayout, scaleStep, minimumFontScale],
  );

  const androidFontStyle = useMemo(() => {
    if (!enabled || Platform.OS !== 'android' || scale >= 1) return null;
    const baseSize = getVariantConfig(variant).size;
    return { fontSize: baseSize * scale };
  }, [enabled, scale, variant]);

  return { handleTextLayout, androidFontStyle };
}
