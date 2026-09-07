import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { useInstrumentIslandContext } from '../api/context';
import { LABEL_HEIGHT } from '../utils';

/**
 * The label beneath the rail, naming the currently centered instrument. It
 * tracks `displayIndex` (updated cheaply per-crossing) and renders the text
 * directly — no per-change layout animation, so fast scrubs never spawn a burst
 * of mount/unmount animations that would stutter.
 */
function IslandLabelBase() {
  const { items, displayIndex } = useInstrumentIslandContext();
  const { colors } = useEtoroTheme();
  const focused = items[displayIndex];
  if (focused == null) return null;

  const text = focused.label ?? focused.symbol;

  return (
    <View style={styles.container}>
      <EtText variant="body-secondary-semibold" numberOfLines={1} style={{ color: colors.textPrimaryNeutral }}>
        {text}
      </EtText>
    </View>
  );
}

export const IslandLabel = memo(IslandLabelBase);
IslandLabel.displayName = 'EtInstrumentIsland.Label';

const styles = StyleSheet.create({
  container: {
    height: LABEL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
