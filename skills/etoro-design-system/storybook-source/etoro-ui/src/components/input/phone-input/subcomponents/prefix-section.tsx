import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import ChevronDown from '../../../../core/icons/chevron-down';
import { HALF, X1, X3, X4 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { EtCountryFlag } from '../../../country-flag';
import { usePhoneInputContext } from '../contexts';

const FLAG_SIZE = 25;
const FLAG_TEXT_GAP = HALF + X1; // 6px (2 + 4)
const CHEVRON_SIZE = 20;
const BOX_HEIGHT = 64;
const PADDING_VERTICAL = X3 + HALF / 2; // 13px (12 + 1)

function PrefixSectionBase() {
  const { prefix, isoCode, prefixTextColor, prefixBorderColor, backgroundColor, prefixDisabled, onPrefixPress, testID } = usePhoneInputContext();

  return (
    <Pressable
      style={[
        styles.container,
        {
          borderColor: prefixBorderColor,
          backgroundColor,
        },
        prefixDisabled && styles.disabled,
      ]}
      onPress={onPrefixPress}
      disabled={prefixDisabled}
      accessibilityRole="button"
      accessibilityLabel={`Country code ${prefix}`}
      accessibilityHint="Opens country picker"
      testID={testID ? `${testID}-prefix` : undefined}
    >
      <View style={styles.flagAndText}>
        <EtCountryFlag isoCode={isoCode} size={FLAG_SIZE} />
        <EtText style={[styles.prefixText, { color: prefixTextColor }]} numberOfLines={1}>
          {prefix}
        </EtText>
      </View>
      <View style={styles.chevronContainer}>
        <ChevronDown size={CHEVRON_SIZE} color={prefixTextColor} />
      </View>
    </Pressable>
  );
}

PrefixSectionBase.displayName = 'EtPhoneInput.PrefixSection';

export const PrefixSection = memo(PrefixSectionBase);

const styles = StyleSheet.create({
  container: {
    height: BOX_HEIGHT,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: X4, // 16px
    paddingRight: X4 + CHEVRON_SIZE + X3, // 16px + 20px (chevron) + 12px (gap) = 48px total right padding
    paddingVertical: PADDING_VERTICAL, // 13px per Figma (X3 + HALF/2)
    justifyContent: 'center',
  },
  flagAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FLAG_TEXT_GAP, // 6px (HALF + X1) gap between flag and prefix text
  },
  chevronContainer: {
    position: 'absolute',
    right: 12, // 12px from right edge
    width: CHEVRON_SIZE,
    height: CHEVRON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefixText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    fontVariant: ['lining-nums'],
  },
  disabled: {
    opacity: 0.6,
  },
});
