import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import type { EtSymbolProps } from './api/types';
import { DEFAULT_SYMBOL_BG_COLOR } from './constants';
import { SymbolContext } from './context/symbol-context';
import { useSymbolConfig } from './hooks/use-symbol-config';
import { SymbolCurrency, SymbolDate, SymbolIcon, SymbolText } from './subcomponents';

/**
 * EtSymbol - A styled box for displaying currency symbols, icons, or dates
 *
 * @example Currency
 * ```tsx
 * <EtSymbol backgroundColor="#005ca4">
 *   <EtSymbol.Currency>€</EtSymbol.Currency>
 * </EtSymbol>
 * ```
 *
 * @example Icon
 * ```tsx
 * <EtSymbol shape="sharp">
 *   <EtSymbol.Icon name="direct-debit-payment" />
 * </EtSymbol>
 * ```
 *
 * @example Date
 * ```tsx
 * <EtSymbol shape="sharp">
 *   <EtSymbol.Date day="29" month="Apr" />
 * </EtSymbol>
 * ```
 *
 * @example Text
 * ```tsx
 * <EtSymbol>
 *   <EtSymbol.Text>PNG</EtSymbol.Text>
 * </EtSymbol>
 * ```
 */
function EtSymbolRoot({ children, size = 'medium', shape = 'rounded', backgroundColor, style, ...rest }: EtSymbolProps) {
  const { colors } = useEtoroTheme();
  const config = useSymbolConfig({ size, shape });

  const containerStyle = {
    width: config.sizeValue,
    height: config.sizeValue,
    borderRadius: config.borderRadius,
    backgroundColor: backgroundColor ?? DEFAULT_SYMBOL_BG_COLOR,
  };

  const gradientColors = [colors.avatarOverlayTop, colors.avatarOverlayBottom] as const;
  const gradientStyle = [StyleSheet.absoluteFill, { borderRadius: config.borderRadius }];

  return (
    <SymbolContext.Provider value={config.contextValue}>
      <View style={[styles.container, containerStyle, style]} {...rest}>
        {children}
        <LinearGradient colors={gradientColors} style={gradientStyle} pointerEvents="none" />
      </View>
    </SymbolContext.Provider>
  );
}

EtSymbolRoot.displayName = 'EtSymbol';

export const EtSymbol = Object.assign(EtSymbolRoot, {
  Currency: SymbolCurrency,
  Icon: SymbolIcon,
  Date: SymbolDate,
  Text: SymbolText,
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
