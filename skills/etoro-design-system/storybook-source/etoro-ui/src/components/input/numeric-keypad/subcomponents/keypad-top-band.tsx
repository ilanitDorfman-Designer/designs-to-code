import { memo, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector, type GestureType } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { KEYPAD_EDGE_DRAW_DASH_PAD, useEdgeDrawAnimation } from '../animations';
import {
  KEYPAD_EDGE_FADE_HEIGHT,
  KEYPAD_EDGE_STROKE_WIDTH,
  KEYPAD_GRABBER_HEIGHT,
  KEYPAD_GRABBER_WIDTH,
  KEYPAD_TOP_BAND_HEIGHT,
  KEYPAD_TOP_RADIUS,
} from '../constants';
import { buildTopEdgeLeftPath, buildTopEdgeRightPath, edgeRadius } from '../utils/build-top-edge-path';

interface KeypadTopBandProps {
  /** When provided, the band becomes the drag handle for the drawer dismiss gesture. */
  panGesture?: GestureType;
  accessibilityLabel?: string;
  testID?: string;
}

const EDGE_GRADIENT_ID = 'kbTopEdgeFade';
const AnimatedPath = Animated.createAnimatedComponent(Path);
// Keep the top edge + corners crisp; start dissolving only once the corner ends,
// so the rails fade out completely right at the end of the curve.
const FADE_START = KEYPAD_TOP_RADIUS / KEYPAD_EDGE_FADE_HEIGHT;

/**
 * The handle above the key rows — a hairline outline that traces the panel's
 * rounded top edge and corners, then fades out down both sides (Figma "Keyboard
 * Top"), cradling a centered grabber pill. On mount the outline draws itself from
 * the top-center apex outward to both corners and down the sides (two half-paths
 * revealed via strokeDashoffset). The fade is a vertical gradient on the stroke:
 * crisp across the top, dissolving as the side rails descend.
 *
 * Purely presentational: when `panGesture` is provided it wraps the band in a
 * `GestureDetector` so the owning keypad can drive a drawer-style drag dismiss.
 */
function KeypadTopBandBase({ panGesture, accessibilityLabel, testID }: KeypadTopBandProps) {
  const { colors, dark } = useEtoroTheme();
  const strokeColor = dark ? colors.carbon200 : colors.carbon300;
  const { width: windowWidth } = useWindowDimensions();
  // Seed with the window width so the outline paints on the first frame (the band
  // is full-bleed) instead of waiting a layout round-trip; onLayout refines it.
  const [width, setWidth] = useState(windowWidth);

  const handleLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    if (next > 0 && next !== width) setWidth(next);
  };

  // Each half is ~top-run + corner-arc + side-rail long; dashing by that (plus pad)
  // makes strokeDashoffset reveal the outline outward from the apex across (nearly)
  // the whole animation, finishing right at the end.
  const r = edgeRadius(width);
  const dashLength = width / 2 - r + (r * Math.PI) / 2 + (KEYPAD_EDGE_FADE_HEIGHT - r) + KEYPAD_EDGE_DRAW_DASH_PAD;
  const drawProps = useEdgeDrawAnimation(dashLength);

  const isInteractive = !!panGesture;
  const stroke = `url(#${EDGE_GRADIENT_ID})`;

  const band = (
    <View
      style={styles.band}
      onLayout={handleLayout}
      // Drag-to-dismiss is a pan gesture with no discrete activation, so the band is exposed as a
      // labelled element (screen readers announce it) but NOT as a `button` — a role that would imply
      // a tap affordance that doesn't exist.
      accessible={isInteractive}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <View style={styles.edge} pointerEvents="none">
        <Svg
          width={width}
          height={KEYPAD_EDGE_FADE_HEIGHT}
          viewBox={`0 0 ${width} ${KEYPAD_EDGE_FADE_HEIGHT}`}
          // Top-align without vertical stretch: if the viewport ends up taller than the
          // viewBox, the outline stays its true height at the top (rails don't get scaled
          // long, which would squash the fade into the very bottom).
          preserveAspectRatio="xMinYMin meet"
        >
          <Defs>
            {/* Object-bounding-box space (relative 0→1 down each half-path's own box) so the
                fade is robust to the Svg's `preserveAspectRatio="none"` scaling. */}
            <LinearGradient id={EDGE_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={strokeColor} stopOpacity={1} />
              <Stop offset={FADE_START} stopColor={strokeColor} stopOpacity={1} />
              <Stop offset="1" stopColor={strokeColor} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <AnimatedPath
            d={buildTopEdgeLeftPath(width, KEYPAD_EDGE_FADE_HEIGHT)}
            stroke={stroke}
            strokeWidth={KEYPAD_EDGE_STROKE_WIDTH}
            fill="none"
            strokeDasharray={dashLength}
            animatedProps={drawProps}
          />
          <AnimatedPath
            d={buildTopEdgeRightPath(width, KEYPAD_EDGE_FADE_HEIGHT)}
            stroke={stroke}
            strokeWidth={KEYPAD_EDGE_STROKE_WIDTH}
            fill="none"
            strokeDasharray={dashLength}
            animatedProps={drawProps}
          />
        </Svg>
      </View>
      <View style={styles.grabberRow} pointerEvents="none">
        <View style={[styles.grabber, { backgroundColor: colors.carbon300 }]} />
      </View>
    </View>
  );

  if (!panGesture) return band;

  return <GestureDetector gesture={panGesture}>{band}</GestureDetector>;
}

export const KeypadTopBand = memo(KeypadTopBandBase);
KeypadTopBand.displayName = 'KeypadTopBand';

const styles = StyleSheet.create({
  band: {
    width: '100%',
    height: KEYPAD_TOP_BAND_HEIGHT,
  },
  edge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: KEYPAD_EDGE_FADE_HEIGHT,
  },
  grabberRow: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grabber: {
    width: KEYPAD_GRABBER_WIDTH,
    height: KEYPAD_GRABBER_HEIGHT,
    borderRadius: 2.5,
    borderCurve: 'continuous',
  },
});
