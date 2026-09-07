import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { EtText } from '../../../../foundations/text/et-text';
import { MAX_FONT_SIZE_MULTIPLIER } from '../../../../foundations/text/utils/variant-config';
import { InputFieldLabelProps } from '../../api/types';
import { useDatepickerConfig, useDatepickerInteraction } from '../../context';

/**
 * `Animated.Text` (not `EtText`) — Jest’s Reanimated mock does not support `createAnimatedComponent` on custom components.
 * Typography matches DS via `animatedLabelTextStyle` from `use-datepicker-animations`.
 */
const AnimatedText = Animated.createAnimatedComponent(Text);

/**
 * Floating label overlay: large idle → compact when focused/filled (InputV2 chrome).
 * Keep `required` asterisk API.
 */
export function InputFieldLabel({ children = '', required = false }: InputFieldLabelProps) {
  const { colors } = useEtoroTheme();
  const { disabled } = useDatepickerConfig();
  const { animatedLabelTextStyle, isCompact } = useDatepickerInteraction();

  if (disabled) {
    const textVariant = isCompact ? 'body-tiny-medium' : 'body-base-regular';
    return (
      <View style={styles.wrap}>
        <EtText variant={textVariant} style={[{ color: colors.carbon500 }, styles.animatedTextBase]}>
          {children}
          {required ? ' *' : ''}
        </EtText>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <AnimatedText maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER} style={[styles.animatedTextBase, animatedLabelTextStyle]}>
        {children}
        {required ? ' *' : ''}
      </AnimatedText>
    </View>
  );
}

InputFieldLabel.displayName = 'EtDatepicker.Label';

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
  },
  animatedTextBase: {
    textAlign: 'left',
  },
});
