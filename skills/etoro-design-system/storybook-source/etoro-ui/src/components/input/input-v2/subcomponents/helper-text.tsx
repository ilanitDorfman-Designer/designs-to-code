import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X1, X4 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { useInputValue } from '../context';

interface HelperTextProps {
  error?: string | null;
  showCharCounter?: boolean;
  maxLength?: number;
}

/**
 * Renders validation error and/or character counter below the input surface.
 */
export function HelperText({ error, showCharCounter, maxLength }: HelperTextProps) {
  const { colors } = useEtoroTheme();
  const { currentValue } = useInputValue();

  const shouldShowCounter = showCharCounter && maxLength && !error;

  const justifyContent = error ? 'flex-start' : 'flex-end';

  return (
    <View style={[styles.container, { justifyContent }]}>
      {error && (
        <EtText variant="body-tiny-regular" style={{ color: colors.verdictNegative500 }}>
          {error}
        </EtText>
      )}

      {shouldShowCounter && (
        <EtText variant="body-tiny-regular">
          {currentValue.length}/{maxLength}
        </EtText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: X1,
    paddingHorizontal: X4,
  },
});
