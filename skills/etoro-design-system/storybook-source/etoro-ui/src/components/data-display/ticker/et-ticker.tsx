import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtTickerProps } from './api';
import { EtTickerContent, Marquee } from './components';

export function EtTicker({ tickersData, speed = 0.2, style, accessibility, gradient = true }: EtTickerProps) {
  const { colors } = useEtoroTheme();
  const displayContent = tickersData?.length > 0 && (
    <View style={styles.contentWrapper}>
      <EtTickerContent items={tickersData} colors={colors} />
    </View>
  );

  const defaultAccessibilityLabel = tickersData?.length
    ? `Financial ticker displaying ${tickersData.length} stock${tickersData.length === 1 ? '' : 's'} with prices and changes`
    : 'Financial ticker displaying stock prices and changes';

  if (!displayContent) {
    return null;
  }

  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibility?.accessibilityLabel || defaultAccessibilityLabel}
      accessibilityHint={accessibility?.accessibilityHint || 'Swipe to interact with scrolling ticker'}
      accessibilityRole="text"
      testID={accessibility?.testID}
    >
      <Marquee
        speed={speed}
        reverse={false} // false means right-to-left by default
        withGesture={true}
        style={styles.marqueeContainer}
      >
        {displayContent}
      </Marquee>

      {gradient && (
        <>
          {/* Left gradient: solid background on left (x=0), transparent on right (x=1) */}
          <LinearGradient
            colors={[colors.bgNeutralPrimary, `${colors.bgNeutralPrimary}00`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.leftGradient}
          />

          {/* Right gradient: transparent on left (x=0), solid background on right (x=1) */}
          <LinearGradient
            colors={[`${colors.bgNeutralPrimary}00`, colors.bgNeutralPrimary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rightGradient}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 16,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  marqueeContainer: {
    flex: 1,
    height: '100%',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 30,
    height: '100%',
    zIndex: 1,
  },
  rightGradient: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 30,
    height: '100%',
    zIndex: 2,
  },
});
