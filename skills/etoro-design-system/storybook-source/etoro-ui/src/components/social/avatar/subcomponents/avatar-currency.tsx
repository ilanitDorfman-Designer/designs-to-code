import { StyleSheet, View } from 'react-native';

import { EtText } from '../../../../foundations/text';
import { useAvatarContext } from '../utils/context';
import type { AvatarCurrencyProps } from '../utils/types';

/**
 * EtAvatar.Currency - centered currency symbol for currency avatars.
 */
export function AvatarCurrency({ children, style }: AvatarCurrencyProps) {
  useAvatarContext();

  return (
    <View pointerEvents="none" style={styles.currency}>
      <EtText variant="display-compact" style={[styles.currencyText, style]}>
        {children}
      </EtText>
    </View>
  );
}

AvatarCurrency.displayName = 'EtAvatar.Currency';

const styles = StyleSheet.create({
  currency: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyText: {
    color: '#FFFFFF',
  },
});
