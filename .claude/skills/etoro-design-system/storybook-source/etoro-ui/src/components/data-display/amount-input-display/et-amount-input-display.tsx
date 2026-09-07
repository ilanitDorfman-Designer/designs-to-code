import { Children, useMemo } from 'react';
import { View } from 'react-native';
import Reanimated from 'react-native-reanimated';

import { create } from '../../../utils';
import { makeRoomTransition, useAmountInputDisplayAnimations } from './animations';
import type { EtAmountInputDisplayProps } from './api/types';
import { AmountInputDisplayProvider, type AmountInputDisplayStateContextValue, type AmountInputDisplayValueContextValue } from './context';
import { useAmountInputDisplayConfig } from './hooks/use-amount-input-display-config';
import { useAmountInputDisplayState } from './hooks/use-amount-input-display-state';
import { styles } from './styles';
import { AmountInputDisplayCaret, AmountInputDisplayCurrency, AmountInputDisplayUnit, AmountInputDisplayValue } from './subcomponents';

function EtAmountInputDisplayBase(props: EtAmountInputDisplayProps) {
  const { value, currencySymbol, unitLabel, showCursor = false, shakeTrigger = 0, autoScale = true, children, testID } = props;

  const config = useAmountInputDisplayConfig(props);
  const state = useAmountInputDisplayState();
  const animations = useAmountInputDisplayAnimations({
    value,
    availableWidth: state.availableWidth,
    affixWidth: state.affixWidth,
    digitWidth: config.digitWidth,
    autoScale,
    showCursor,
    shakeTrigger,
    shrinkStartDigits: props.shrinkStartDigits,
    shrinkStepPerDigit: props.shrinkStepPerDigit,
    progressiveMinScale: props.progressiveMinScale,
    overflowMinScale: props.overflowMinScale,
  });

  const stateContextValue = useMemo<AmountInputDisplayStateContextValue>(
    () => ({ caretOpacity: animations.caretOpacity, registerAffixWidth: state.registerAffixWidth, clearAffixWidth: state.clearAffixWidth }),
    [animations.caretOpacity, state.registerAffixWidth, state.clearAffixWidth],
  );
  const valueContextValue = useMemo<AmountInputDisplayValueContextValue>(() => ({ value }), [value]);

  const hasChildren = Children.count(children) > 0;

  return (
    <View style={styles.container} onLayout={state.handleContainerLayout} testID={testID ?? 'amount-input-display-container'}>
      {/* Outer layer animates the centered row's re-position; the layout animation is kept off the
          scaled inner view to avoid clashing with its transform. */}
      <Reanimated.View style={[styles.rowOuter, animations.shakeStyle]} layout={makeRoomTransition}>
        {/* The whole row scales as one unit so currency + number + unit shrink together, stay
            centered, and never truncate. */}
        <Reanimated.View style={[styles.row, animations.scaleStyle]} testID="amount-input-display-row">
          <AmountInputDisplayProvider config={config} state={stateContextValue} value={valueContextValue}>
            {hasChildren ? (
              children
            ) : (
              <>
                {currencySymbol ? <AmountInputDisplayCurrency>{currencySymbol}</AmountInputDisplayCurrency> : null}
                <AmountInputDisplayValue />
                <AmountInputDisplayCaret />
                {unitLabel ? <AmountInputDisplayUnit>{unitLabel}</AmountInputDisplayUnit> : null}
              </>
            )}
          </AmountInputDisplayProvider>
        </Reanimated.View>
      </Reanimated.View>
    </View>
  );
}

export const EtAmountInputDisplay = Object.assign(create(EtAmountInputDisplayBase, 'EtAmountInputDisplay'), {
  Currency: AmountInputDisplayCurrency,
  Value: AmountInputDisplayValue,
  Caret: AmountInputDisplayCaret,
  Unit: AmountInputDisplayUnit,
});

export { EtAmountInputDisplayBase };
