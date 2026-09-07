import React from 'react';
import Animated from 'react-native-reanimated';

import { buildDropInEntering } from '../animations';

/**
 * Leading-mode digit. Only the newly typed (trailing) digit carries the `entering` drop-in; every other
 * slot renders in place. `entering` runs on the UI thread at view creation, so it always animates and
 * stays in sync with the make-room reflow regardless of JS-thread load. The parent slot clips overflow,
 * so a digit starting at translateY -height is hidden above until it slides into view.
 *
 * The inner view is keyed by `digit` so an in-place value change (e.g. the zero placeholder `0` -> typed
 * `2`, or deleting back to `0`) remounts the cell and re-fires `entering`. Without the key the slot keeps
 * its identity and only swaps text, so the first keystroke off an empty field wouldn't animate.
 */
export function LeadingDigitCell({
  digit,
  height,
  width,
  animateEntrance,
  renderDigitCell,
}: {
  digit: number;
  height: number;
  width: number;
  animateEntrance: boolean;
  renderDigitCell: (value: number) => React.ReactNode;
}) {
  return (
    <Animated.View key={digit} entering={animateEntrance ? buildDropInEntering(height) : undefined} style={{ width, height }}>
      {renderDigitCell(digit)}
    </Animated.View>
  );
}
