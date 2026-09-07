import { useMemo } from 'react';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { TextCopyButtonContextValue } from '../context';

export interface TextCopyButtonConfig {
  /** Context value for subcomponents */
  contextValue: TextCopyButtonContextValue;
}

/**
 * Processes props into component configuration.
 * Computes theme-aware colors based on copied state.
 */
export function useTextCopyButtonConfig({ isCopied }: { isCopied: boolean }): TextCopyButtonConfig {
  const { colors } = useEtoroTheme();

  return useMemo(() => {
    // Colors: green
    const iconColor = colors.indicatorPositive;
    const textColor = colors.textPrimaryNeutral;

    // Context value for subcomponents
    const contextValue: TextCopyButtonContextValue = {
      isCopied,
      iconColor,
      textColor,
    };

    return {
      contextValue,
    };
  }, [isCopied, colors]);
}
