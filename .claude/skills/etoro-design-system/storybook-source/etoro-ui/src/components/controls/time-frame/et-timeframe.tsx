import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { TimeFrameSelectorProps } from './api';
import { TimeFrameButton } from './components/timeframe-button';

/** @deprecated not actively maintained — no AGENTS.mdc */
export function TimeFrameSelector({
  timeFrames = ['1W', '1M', '3M', '6M', '1Y'],
  selectedTimeFrame,
  onTimeFrameChange,
  fontSize = 14,
}: TimeFrameSelectorProps) {
  const { colors } = useEtoroTheme();

  return (
    <View style={styles.buttonContainer} testID="timeframe-selector">
      {timeFrames.map((frame) => {
        const isSelected = selectedTimeFrame === frame;

        return (
          <TimeFrameButton
            key={frame}
            frame={frame}
            isSelected={isSelected}
            onPress={() => onTimeFrameChange(frame)}
            fontSize={fontSize}
            colors={colors}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12, // Reduced gap for better spacing
  },
});
