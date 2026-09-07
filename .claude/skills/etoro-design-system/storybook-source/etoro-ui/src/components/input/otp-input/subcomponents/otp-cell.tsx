import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EtText } from '../../../../foundations/text';
import { TextVariant } from '../../../../foundations/text/utils/variant-config';
import { OtpCellColors, OtpCellDimensions } from '../hooks/use-otp-config';

interface OtpCellProps {
  /** Character to display in this cell */
  char: string;
  /** Whether this cell is the "active" (next to fill) cell */
  isCellFocused: boolean;
  /** Whether the overall input is focused */
  isInputFocused: boolean;
  /** Whether to mask the character */
  isSecure: boolean;
  /** Error state */
  error: boolean;
  /** Resolved dimensions from config */
  dimensions: OtpCellDimensions;
  /** Resolved colors from config */
  colors: OtpCellColors;
  /** EtText variant for digit rendering */
  textVariant: TextVariant;
  /** Size of the secure dot */
  dotSize: number;
  /** Test ID for querying in tests */
  testID?: string;
}

function OtpCellBase({ char, isCellFocused, isInputFocused, isSecure, error, dimensions, colors, textVariant, dotSize, testID }: OtpCellProps) {
  const isFilled = char !== '';

  /** Active slot: next empty cell — stronger border; all slots keep a 1px outline for visibility */
  const isActive = isCellFocused && isInputFocused && !isFilled;

  const borderColor = isActive ? colors.focusedBorder : colors.idleBorder;
  const backgroundColor = colors.cellBackgroundDefault;

  const textColor = error ? colors.errorText : colors.filledText;
  const dotColor = error ? colors.secureDotError : colors.secureDot;

  const cellFrameStyle = useMemo(
    () => ({
      width: dimensions.width,
      height: dimensions.height,
      borderRadius: dimensions.borderRadius,
      backgroundColor,
      borderColor,
      borderWidth: 1,
    }),
    [backgroundColor, borderColor, dimensions.borderRadius, dimensions.height, dimensions.width],
  );

  return (
    <View testID={testID} style={[styles.cell, cellFrameStyle]}>
      {isFilled && isSecure && (
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: dotColor,
            },
          ]}
        />
      )}
      {isFilled && !isSecure && (
        <EtText variant={textVariant} style={{ color: textColor }}>
          {char}
        </EtText>
      )}
    </View>
  );
}

export const OtpCell = React.memo(OtpCellBase);

OtpCell.displayName = 'EtOtpInput.Cell';

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {},
});
