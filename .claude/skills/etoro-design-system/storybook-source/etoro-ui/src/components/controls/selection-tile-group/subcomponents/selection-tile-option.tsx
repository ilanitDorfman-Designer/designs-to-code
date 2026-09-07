import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { X2, X3, X4, X5 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { EtIconV2 } from '../../../et-icon-v2';
import { EtInput } from '../../../input/input-v2/et-input';
import { RadioIndicator } from '../../radio-group/components/radio-indicator';
import { EtToggleSwitch } from '../../toggle-switch/et-toggle-switch';
import { SelectionTileOptionProps } from '../api/types';
import { useSelectionTileGroupContext } from '../context/selection-tile-group-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TILE_BORDER_RADIUS = 12;
const BACKGROUND_OPACITY = '0D'; // ~5%
const ICON_SIZE = 20;
const DEFAULT_ICON_NAME = 'angle-right';
const LARGE_TILE_MIN_HEIGHT = 84;

export function SelectionTileOption({
  value,
  children,
  subtitle,
  iconName,
  input,
  disabled: optionDisabled = false,
  style,
  testID,
  accessibilityLabel,
  titleVariant: titleVariantProp,
  entering,
  exiting,
  innerEntering,
  innerExiting,
}: SelectionTileOptionProps) {
  const { colors } = useEtoroTheme();
  const { value: selectedValue, onSelect, disabled: groupDisabled, variant, selectionMode, size } = useSelectionTileGroupContext();

  const isLarge = size === 'large';
  const isMulti = selectionMode === 'multi';
  const selectedValues = isMulti && Array.isArray(selectedValue) ? selectedValue : [];
  const isSelected = isMulti ? selectedValues.includes(value) : selectedValue === value;
  const isDisabled = groupDisabled || optionDisabled;
  const isToggleVariant = variant === 'toggle' || variant === 'toggleInput';
  const isToggleInputVariant = variant === 'toggleInput';
  const showBorder = !isToggleVariant && isSelected;

  const handlePress = () => {
    if (isSelected && !isToggleVariant) return;
    onSelect(value);
  };

  const backgroundColor = `${colors.textPrimaryNeutral}${BACKGROUND_OPACITY}`;
  const borderColor = showBorder ? colors.textPrimaryNeutral : 'transparent';

  /**
   * In read-only / review scenarios an unselected option should dim so the user's selected picks
   * stand out. Dimming a selected option as well flattens the distinction to just the subtle
   * toggle/radio indicator position, which is hard to read at a glance.
   */
  const shouldDim = isDisabled && !isSelected;

  const renderRightElement = () => {
    switch (variant) {
      case 'radio':
        return <RadioIndicator selected={isSelected} disabled={isDisabled} error={false} />;
      case 'toggle':
      case 'toggleInput':
        return (
          <View style={styles.toggleContainer}>
            <EtToggleSwitch value={isSelected} onValueChange={handlePress} disabled={isDisabled} haptics={false} size="small" />
          </View>
        );
      case 'icon':
      default:
        return <EtIconV2 name={iconName ?? DEFAULT_ICON_NAME} size={ICON_SIZE} color={colors.textSecondaryNeutral} />;
    }
  };

  const titleVariant = titleVariantProp ?? (isToggleVariant ? 'body-secondary-medium' : 'heading-compact');

  const renderContent = () => {
    if (subtitle) {
      return (
        <View style={styles.textContainer}>
          <EtText variant={titleVariant} style={{ color: colors.textPrimaryNeutral }}>
            {children}
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral }}>
            {subtitle}
          </EtText>
        </View>
      );
    }
    return (
      <View style={styles.textContainer}>
        <EtText variant={titleVariant} style={{ color: colors.textPrimaryNeutral }}>
          {children}
        </EtText>
      </View>
    );
  };

  const renderInlineInput = () => {
    if (!isToggleInputVariant || !isSelected || !input) {
      return null;
    }

    const inlineInputConfig = input;
    const fieldProps = inlineInputConfig.fieldProps ?? {};

    const inlineInputContent = (
      <>
        <EtInput defaultValue={inlineInputConfig.defaultValue} readonly backgroundColor="transparent">
          {inlineInputConfig.label ? <EtInput.Label>{inlineInputConfig.label}</EtInput.Label> : null}
          <EtInput.Field {...fieldProps} editable={fieldProps.editable ?? !isDisabled} />
        </EtInput>
        {inlineInputConfig.errorMessage ? (
          <EtText variant="body-tiny-regular" style={[styles.inputError, { color: colors.statusNegative }]}>
            {inlineInputConfig.errorMessage}
          </EtText>
        ) : null}
      </>
    );
    const inlineInputStyle = [styles.inlineInputContainer, inlineInputConfig.style];

    if (!innerEntering && !innerExiting) {
      return <View style={inlineInputStyle}>{inlineInputContent}</View>;
    }

    return (
      <Animated.View entering={innerEntering} exiting={innerExiting} style={inlineInputStyle}>
        {inlineInputContent}
      </Animated.View>
    );
  };

  if (isToggleInputVariant) {
    const flatStyle = StyleSheet.flatten(style) as ViewStyle | undefined;
    const pressablePaddingOverride: ViewStyle = {
      ...(flatStyle?.paddingHorizontal !== undefined && { paddingHorizontal: flatStyle.paddingHorizontal }),
      ...(flatStyle?.paddingVertical !== undefined && { paddingVertical: flatStyle.paddingVertical }),
      ...(flatStyle?.padding !== undefined && { padding: flatStyle.padding }),
    };

    const tileContent = (
      <>
        <Pressable
          onPress={handlePress}
          disabled={isDisabled}
          style={[styles.toggleInputPressable, styles.toggleInputPressableWithoutInput, pressablePaddingOverride]}
          testID={testID}
          accessibilityRole="switch"
          accessibilityState={{
            selected: isSelected,
            disabled: isDisabled,
          }}
          accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
        >
          {renderContent()}
          {renderRightElement()}
        </Pressable>
        {renderInlineInput()}
      </>
    );
    const tileStyle = [
      styles.tile,
      isLarge && styles.tileLarge,
      styles.toggleInputTile,
      { backgroundColor, borderColor },
      shouldDim && styles.disabled,
      style,
      styles.toggleInputTileOverride,
    ];

    if (!entering && !exiting) {
      return <View style={tileStyle}>{tileContent}</View>;
    }

    return (
      <Animated.View entering={entering} exiting={exiting} style={tileStyle}>
        {tileContent}
      </Animated.View>
    );
  }

  return (
    <AnimatedPressable
      entering={entering}
      exiting={exiting}
      onPress={handlePress}
      disabled={isDisabled}
      style={[styles.tile, isLarge && styles.tileLarge, { backgroundColor, borderColor }, shouldDim && styles.disabled, style]}
      testID={testID}
      accessibilityRole={isToggleVariant ? 'switch' : 'radio'}
      accessibilityState={{
        selected: isSelected,
        disabled: isDisabled,
      }}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
    >
      {renderContent()}
      {renderRightElement()}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: TILE_BORDER_RADIUS,
    padding: X4,
  },
  tileLarge: {
    minHeight: LARGE_TILE_MIN_HEIGHT,
  },
  toggleInputTile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  toggleInputTileOverride: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  toggleInputPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: X4,
  },
  toggleInputPressableWithoutInput: {
    paddingVertical: X3,
  },
  disabled: {
    opacity: 0.5,
  },
  textContainer: {
    flex: 1,
    marginRight: X4,
  },
  toggleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineInputContainer: {
    marginTop: -X5,
    paddingHorizontal: 0,
    paddingBottom: X2,
  },
  inputError: {
    paddingHorizontal: X4,
    paddingBottom: X3,
    marginTop: -X2,
  },
});

SelectionTileOption.displayName = 'EtSelectionTileGroup.Option';
