import { X1, X2, X6, X9, X12 } from '../../../../core/styles/spacing';
import type { SymbolShape, SymbolSize, SymbolSizeConfig } from '../api/types';

export const SIZE_CONFIGS: Record<SymbolSize, SymbolSizeConfig> = {
  small: {
    size: X6, // 24px container
    roundedRadius: X1, // 4px
    currencyVariant: 'body-base-semibold',
    dateDay: 'num-xxs',
    dateMonth: 'caption-regular',
    textVariant: 'caption-regular',
    iconSize: 14,
  },
  medium: {
    size: X9, // 36px container
    roundedRadius: X2, // 8px
    currencyVariant: 'heading-large',
    dateDay: 'label-secondary-semibold',
    dateMonth: 'caption-regular',
    textVariant: 'caption-medium',
    iconSize: 20,
  },
  large: {
    size: X12, // 48px container
    roundedRadius: X2, // 8px
    currencyVariant: 'display-hero',
    dateDay: 'label-primary-semibold',
    dateMonth: 'caption-regular',
    textVariant: 'body-secondary-semibold',
    iconSize: 24,
  },
};

export function getSizeValue(size: SymbolSize): number {
  return SIZE_CONFIGS[size].size;
}

export function getBorderRadius(size: SymbolSize, shape: SymbolShape): number {
  if (shape === 'sharp') return 0;
  return SIZE_CONFIGS[size].roundedRadius;
}

export function getSizeConfig(size: SymbolSize): SymbolSizeConfig {
  return SIZE_CONFIGS[size];
}
