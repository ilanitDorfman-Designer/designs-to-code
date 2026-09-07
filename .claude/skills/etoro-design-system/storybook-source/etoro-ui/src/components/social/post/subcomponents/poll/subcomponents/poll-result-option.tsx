import { memo, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../../../core/hooks/use-etoro-theme';
import { X2, X5, X9 } from '../../../../../../core/styles/spacing';
import { EtText } from '../../../../../../foundations/text/et-text';
import { PollResultOptionProps } from '../api';
import { usePollContext } from '../context';

const PROGRESS_DURATION = 400;
const FADE_DURATION = 300;
const FADE_DELAY = 150;

/**
 * EtPoll.ResultOption - Answer option showing results
 * Displays with progress bar and percentage (Figma: no check icon on selected)
 */
function PollResultOptionComponent({ answerId, testID }: PollResultOptionProps) {
  const { state } = usePollContext();
  const { colors } = useEtoroTheme();

  const answer = useMemo(() => state.answers.find((a) => a.id === answerId), [state.answers, answerId]);

  const displayPercentage = useMemo(() => {
    const raw = answer?.percentage ?? 0;
    return Math.min(100, Math.max(0, raw));
  }, [answer]);

  // Animate progress bar using scaleX (GPU-accelerated, no layout recalculation)
  const progressScale = useSharedValue(0);

  useEffect(() => {
    progressScale.set(
      withTiming(displayPercentage / 100, {
        duration: PROGRESS_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [displayPercentage, progressScale]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progressScale.get() }],
  }));

  if (!answer) return null;

  const isSelected = state.selectedId === answerId;
  const roundedPercentage = Math.round(displayPercentage);
  const pillFillColor = isSelected ? colors.primary600 : `${colors.carbon900}14`;
  const labelColor = isSelected ? colors.carbon050 : colors.carbon900;
  const percentageColor = isSelected ? colors.verdictPositive600 : colors.carbon900;

  return (
    <Animated.View style={styles.answerRow} testID={testID} exiting={FadeOut.duration(FADE_DURATION)}>
      <View style={styles.option}>
        {/* Animated progress fill — scaleX 0 → percentage/100 from the leading edge */}
        <Animated.View style={[styles.progressFill, { backgroundColor: pillFillColor }, progressAnimatedStyle]} />

        <View style={styles.buttonContent}>
          <EtText variant="body-secondary-medium" style={{ color: labelColor }}>
            {answer.value}
          </EtText>
        </View>
      </View>

      {/* Animated percentage — fades in just after the fill begins growing */}
      <Animated.View entering={FadeIn.duration(FADE_DURATION).delay(FADE_DELAY)} style={styles.percentageOuter}>
        <EtText variant="num-s-medium" style={{ color: percentageColor }}>
          {roundedPercentage}%
        </EtText>
      </Animated.View>
    </Animated.View>
  );
}

export const PollResultOption = memo(PollResultOptionComponent);
PollResultOption.displayName = 'EtPoll.ResultOption';

const styles = StyleSheet.create({
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  option: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: X2,
    paddingHorizontal: X5,
    borderRadius: X9,
    minWidth: 72,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    borderRadius: X9,
    transformOrigin: 'left center',
  },
  buttonContent: {
    zIndex: 1,
  },
  percentageOuter: {
    marginLeft: X2,
    minWidth: 48,
    alignItems: 'flex-end',
  },
});
