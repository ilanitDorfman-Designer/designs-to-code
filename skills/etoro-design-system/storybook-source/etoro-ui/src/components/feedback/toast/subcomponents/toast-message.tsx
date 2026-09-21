import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { EtText } from '../../../../foundations/text/et-text';
import { useToastInternalContext } from '../api/toast-context';
import type { ToastMessageProps } from '../api/types';

/**
 * ToastMessage - Displays the toast message content
 *
 * Supports both plain strings and ReactNode for rich text formatting.
 *
 * Text color is variant-aware, always pairing with the solid surface so it
 * stays legible in both themes:
 * - `default` variant → `carbon900` (on the `carbon050` surface).
 * - `inverted` variant → `carbon050` (on the `carbon900` surface).
 *
 * Both `carbon050`/`carbon900` flip with the theme, so each pairing is
 * max-contrast in light and dark mode alike.
 *
 * ReactNode messages are rendered as-is — callers wanting variant-aware
 * coloring should consume `useToastInternalContext` themselves or use the
 * string form. NOTE: the default surface is now light in light mode, so
 * ReactNode messages must not hardcode a light text color (e.g. `'white'`).
 */
export function ToastMessage({ children }: ToastMessageProps) {
  const { variant } = useToastInternalContext();
  const { colors } = useEtoroTheme();
  const textColor = variant === 'inverted' ? colors.carbon050 : colors.carbon900;

  return (
    <View style={styles.container}>
      {typeof children === 'string' ? (
        <EtText testID="toast-message" variant="body-secondary-regular" style={{ color: textColor }} numberOfLines={3}>
          {children}
        </EtText>
      ) : (
        children
      )}
    </View>
  );
}

ToastMessage.displayName = 'ToastMessage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
