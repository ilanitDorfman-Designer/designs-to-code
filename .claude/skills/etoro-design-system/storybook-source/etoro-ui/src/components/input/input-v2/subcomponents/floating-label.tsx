import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text/et-text';
import { MAX_FONT_SIZE_MULTIPLIER } from '../../../../foundations/text/utils/variant-config';
import { InputLabelProps } from '../api/types';
import { InputConfigContext } from '../context/config-context';
import { InputStateContext } from '../context/state-context';

/**
 * `Animated.Text` (not `EtText`) — Jest’s Reanimated mock does not support `createAnimatedComponent` on custom components.
 * Typography matches DS via `animatedLabelTextStyle` from `use-input-animations` (sizes, `letterSpacing`, `getFontFamily`, colors).
 */
const AnimatedText = Animated.createAnimatedComponent(Text);

/**
 * Floating label: large `body-base-regular` when empty & blurred (vertically aligned with value area);
 * `body-tiny-medium` when focused or filled (Figma DS) — with smooth size/position animation via Reanimated.
 * Must be rendered under `EtInput` (throws if `InputProvider` / state context is missing — not a standalone label).
 *
 * `style` is optional and merged last, so it can override the DS-driven typography (e.g. a per-instance
 * Figma spec that diverges from the default animated variant) without affecting any other consumer.
 */
export function FloatingLabel({ children, required, numberOfLines, ellipsizeMode, style }: InputLabelProps) {
  const { colors } = useEtoroTheme();
  const state = useContext(InputStateContext);
  const config = useContext(InputConfigContext);

  if (state == null || config == null) {
    throw new Error('FloatingLabel must be used within an EtInput (InputProvider) tree.');
  }

  const { animatedLabelTextStyle, isFocused, hasValue } = state;
  const disabled = Boolean(config.disabled);
  const compact = config.staticLabel || isFocused || hasValue;

  if (disabled) {
    const textVariant = compact ? 'body-tiny-medium' : 'body-base-regular';
    return (
      <View style={styles.wrap}>
        <EtText
          variant={textVariant}
          numberOfLines={numberOfLines}
          ellipsizeMode={ellipsizeMode}
          style={[disabled && { color: colors.carbon500 }, styles.animatedTextBase, style]}
        >
          {children}
          {required ? ' *' : ''}
        </EtText>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <AnimatedText
        maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        style={[styles.animatedTextBase, animatedLabelTextStyle, style]}
      >
        {children}
        {required ? ' *' : ''}
      </AnimatedText>
    </View>
  );
}

FloatingLabel.displayName = 'EtInput.Label';

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
  },
  /** Same base as EtText: animation hook supplies dynamic typography. */
  animatedTextBase: {
    textAlign: 'left',
  },
});
