import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { rtlSign } from '../../../../utils/rtl';

interface RangeCursorProps {
  position: number; // normalized 0-1
  trackWidth: number;
  height?: number;
  isPositive?: boolean;
}

const BASE_HEIGHT = 37;
const BASE_WIDTH = 32;

export function RangeCursor({ position, trackWidth, height = BASE_HEIGHT, isPositive = true }: RangeCursorProps) {
  const { colors } = useEtoroTheme();
  const width = (height / BASE_HEIGHT) * BASE_WIDTH;
  // Verdict 300 → 600 gradient (top → bottom). 300 is the lighter shade,
  // 600 the darker — both shift automatically with the active theme.
  const gradientStops = isPositive
    ? [<Stop key="g1" offset="0" stopColor={colors.verdictPositive300} />, <Stop key="g2" offset="0.488763" stopColor={colors.verdictPositive600} />]
    : [<Stop key="r1" offset="0" stopColor={colors.verdictNegative300} />, <Stop key="r2" offset="0.488763" stopColor={colors.verdictNegative600} />];

  const maxTranslate = Math.max(trackWidth - width, 0);
  // `left`/`right` swap in RTL, so `left: 0` already anchors to the start
  // (min) edge. `translateX` stays physical — multiply by rtlSign so higher
  // values move toward the end edge instead of off-track.
  const translateX = position * maxTranslate * rtlSign();

  return (
    <View style={[styles.cursor, { transform: [{ translateX }] }]}>
      <View
        style={[
          styles.cursorInner,
          {
            height,
            width,
            transform: [{ translateY: -height / 2 }],
          },
        ]}
      >
        <Svg width={width} height={height} viewBox="0 0 32 37" fill="none">
          <Defs>
            <LinearGradient id="cursorGradient" x1="16" y1="13.5" x2="16" y2="22" gradientUnits="userSpaceOnUse">
              {gradientStops}
            </LinearGradient>
          </Defs>
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.7835 13.9909C14.856 13.4261 15.3862 13 16.0164 13C16.6489 13 17.1802 13.4291 17.2499 13.9963L17.9876 19.9969C18.1189 21.0655 17.1917 22 16 22C14.8044 22 13.876 21.0597 14.0135 19.9882L14.7835 13.9909Z"
            fill="url(#cursorGradient)"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cursor: {
    position: 'absolute',
    top: '50%',
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cursorInner: {},
});
