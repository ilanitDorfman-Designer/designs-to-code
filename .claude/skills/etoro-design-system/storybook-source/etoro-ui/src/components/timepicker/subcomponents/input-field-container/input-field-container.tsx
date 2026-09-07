import React from 'react';
import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { X1, X2, X5 } from '../../../../core/styles/spacing';
import { useTimepickerConfig, useTimepickerInteraction } from '../../context';
import { useComponentChildren } from '../../hooks/use-component-children';
import { ClockIcon } from '../clock-icon';
import { HelperText } from '../helper-text';
import { NativePickerModal } from '../native-picker-modal';

export interface InputFieldContainerProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

function InputFieldContainerComponent({ style, children }: InputFieldContainerProps) {
  const { colors } = useEtoroTheme();
  const { disabled, readonly, error } = useTimepickerConfig();
  const { animatedBorderStyle, isPickerOpen } = useTimepickerInteraction();
  const { labelChild, inputRowChildren, hasClockIcon } = useComponentChildren(children);

  // Filter out user-supplied ClockIcon children when readonly
  const filteredInputRowChildren = readonly
    ? inputRowChildren.filter(
        (child) =>
          !(
            React.isValidElement(child) &&
            typeof child.type === 'object' &&
            child.type !== null &&
            (child.type as { displayName?: string }).displayName === 'EtTimepicker.ClockIcon'
          ),
      )
    : inputRowChildren;

  const effectiveHasClockIcon = readonly ? false : hasClockIcon;
  const shouldShowHelperText = Boolean(error);

  return (
    <View style={style}>
      <Animated.View
        style={[
          styles.inputContainer,
          animatedBorderStyle,
          disabled && [styles.disabledContainer, { backgroundColor: `${colors.bgNeutralPrimary}50` }],
        ]}
      >
        {labelChild}
        <View style={styles.inputRow}>
          {filteredInputRowChildren}
          {!readonly && !effectiveHasClockIcon && <ClockIcon testID="timepicker-clock-icon" accessibilityLabel="Open time picker" />}
        </View>
      </Animated.View>
      {shouldShowHelperText && <HelperText error={error} />}
      {isPickerOpen && <NativePickerModal />}
    </View>
  );
}

export const InputFieldContainer = React.memo(InputFieldContainerComponent);
InputFieldContainer.displayName = 'EtTimepicker.InputFieldContainer';

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    paddingTop: X5,
    paddingBottom: X1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
  },
  disabledContainer: {
    opacity: 0.6,
  },
});
