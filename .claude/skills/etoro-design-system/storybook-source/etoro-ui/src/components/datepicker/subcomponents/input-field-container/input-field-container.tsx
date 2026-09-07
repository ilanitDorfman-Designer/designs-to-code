import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { X2 } from '../../../../core/styles/spacing';
import { INPUT_LAYOUT_METRICS } from '../../../input/input-v2';
import { useDatepickerConfig, useDatepickerInteraction } from '../../context';
import { hasDisplayName, useComponentChildren } from '../../hooks/use-component-children';
import { CalendarIcon } from '../calendar-icon';
import { HelperText } from '../helper-text';
import { NativePickerModal } from '../native-picker-modal';

export interface InputFieldContainerProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function InputFieldContainer({ style, children }: InputFieldContainerProps) {
  const { colors } = useEtoroTheme();
  const { disabled, readonly, error } = useDatepickerConfig();
  const { animatedBorderStyle, animatedFieldRowStyle, animatedLabelContainerStyle, isPickerOpen } = useDatepickerInteraction();
  const { labelChild, inputRowChildren } = useComponentChildren(children);

  const shouldShowHelperText = Boolean(error);

  // Field row = everything except Label and CalendarIcon; icon sits in the trailing slot (V2 adornment).
  const fieldChildren = inputRowChildren.filter((child) => !hasDisplayName(child, 'EtDatepicker.CalendarIcon'));
  const customCalendarIcon = inputRowChildren.find((child) => hasDisplayName(child, 'EtDatepicker.CalendarIcon'));
  const trailingIcon = readonly
    ? null
    : (customCalendarIcon ?? <CalendarIcon testID="datepicker-calendar-icon" accessibilityLabel="Open date picker" />);

  return (
    <View style={style}>
      <Animated.View
        // D8: disabled swallows touches; no opacity wash — border stays at idle carbon300 via animation.
        pointerEvents={disabled ? 'none' : 'auto'}
        style={[styles.inputContainer, { backgroundColor: `${colors.carbon900}0D` }, animatedBorderStyle]}
      >
        <View style={[styles.contentRow, trailingIcon != null && styles.contentRowWithIcon]}>
          <View style={styles.inputColumn}>
            <Animated.View style={[styles.fieldRow, styles.fieldRowLayer, labelChild ? animatedFieldRowStyle : undefined]}>
              {fieldChildren}
            </Animated.View>
            {labelChild ? (
              <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, styles.labelOverlay, animatedLabelContainerStyle]}>
                {labelChild}
              </Animated.View>
            ) : null}
          </View>
          {trailingIcon != null ? <View style={styles.iconWrap}>{trailingIcon}</View> : null}
        </View>
      </Animated.View>
      {shouldShowHelperText && <HelperText error={error} />}
      {isPickerOpen && <NativePickerModal />}
    </View>
  );
}

InputFieldContainer.displayName = 'EtDatepicker.InputFieldContainer';

const styles = StyleSheet.create({
  inputContainer: {
    paddingVertical: INPUT_LAYOUT_METRICS.paddingVertical,
    paddingHorizontal: INPUT_LAYOUT_METRICS.paddingHorizontal,
    height: INPUT_LAYOUT_METRICS.containerHeight,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  contentRow: {
    flex: 1,
    width: '100%',
    minHeight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  contentRowWithIcon: {
    gap: X2,
  },
  inputColumn: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  fieldRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: 0,
  },
  fieldRowLayer: {
    zIndex: 2,
  },
  labelOverlay: {
    zIndex: 1,
    alignItems: 'flex-start',
  },
  iconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
});
