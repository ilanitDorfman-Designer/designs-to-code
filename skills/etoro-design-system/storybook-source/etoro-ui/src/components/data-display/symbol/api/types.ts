import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

import type { TextVariant } from '../../../../foundations/text/utils/variant-config';

/**
 * Symbol box size options
 */
export type SymbolSize = 'small' | 'medium' | 'large';

/**
 * Symbol box shape options
 * - rounded: rounded rectangle with border radius
 * - sharp: square with no border radius
 */
export type SymbolShape = 'rounded' | 'sharp';

/**
 * Context value shared with subcomponents
 */
export interface SymbolContextValue {
  size: SymbolSize;
  sizeValue: number;
}

/**
 * Main EtSymbol props
 *
 * @example
 * ```tsx
 * <EtSymbol backgroundColor="#005ca4">
 *   <EtSymbol.Currency>€</EtSymbol.Currency>
 * </EtSymbol>
 * ```
 */
export interface EtSymbolProps extends ViewProps {
  children: ReactNode;
  /** Symbol box size. Default: 'medium' */
  size?: SymbolSize;
  /** Symbol box shape. Default: 'rounded' */
  shape?: SymbolShape;
  /** Background color of the symbol box. Defaults to #232733 */
  backgroundColor?: string;
}

/**
 * Currency subcomponent props
 */
export interface SymbolCurrencyProps {
  /** Currency symbol text (e.g., "€", "$", "£", "A$") */
  children: string;
  /** Text color. Defaults to white */
  color?: string;
}

/**
 * Icon subcomponent props
 */
export interface SymbolIconProps {
  /** EtIconV2 icon name */
  name: string;
  /** Icon color. Defaults to white */
  color?: string;
}

/**
 * Date subcomponent props
 */
export interface SymbolDateProps {
  /** Day number, e.g. "29" */
  day: string;
  /** Month abbreviation, e.g. "Apr" */
  month: string;
  /** Text color. Defaults to white */
  color?: string;
}

/**
 * Text subcomponent props
 */
export interface SymbolTextProps {
  /** Text content to display (e.g., "PNG", "JPG", short codes) */
  children: string;
  /** Text color. Defaults to white */
  color?: string;
}

/**
 * Size configuration for each symbol size
 */
export interface SymbolSizeConfig {
  size: number;
  roundedRadius: number;
  currencyVariant: TextVariant;
  dateDay: TextVariant;
  dateMonth: TextVariant;
  textVariant: TextVariant;
  iconSize: number;
}
