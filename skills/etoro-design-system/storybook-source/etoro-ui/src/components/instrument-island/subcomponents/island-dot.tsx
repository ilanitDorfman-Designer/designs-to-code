import { memo } from 'react';
import { View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { DOT_SIZE } from '../utils';

interface IslandDotProps {
  /** Dimmer dots sit further from the focused avatar. */
  faded?: boolean;
}

/**
 * A neighbour dot in the collapsed pill — a tiny marker hinting that more
 * instruments live to the side of the focused one.
 */
function IslandDotBase({ faded = false }: IslandDotProps) {
  const { colors } = useEtoroTheme();

  return (
    <View
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        backgroundColor: faded ? colors.dividerTertiary : colors.dividerSecondary,
      }}
    />
  );
}

export const IslandDot = memo(IslandDotBase);
IslandDot.displayName = 'EtInstrumentIsland.Dot';
