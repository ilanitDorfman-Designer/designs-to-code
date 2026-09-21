import { EtAnimatedCount } from '../../../../foundations/animated-digits';
import { create } from '../../../../utils';
import { useAmountInputDisplayConfigContext, useAmountInputDisplayValueContext } from '../context';

function AmountInputDisplayValueBase() {
  const { fontSize, digitHeight, digitWidth, weight, digitAnchor, numberColor } = useAmountInputDisplayConfigContext();
  const { value } = useAmountInputDisplayValueContext();

  return (
    <EtAnimatedCount
      number={value}
      digitAnchor={digitAnchor}
      fontSize={fontSize}
      lineHeight={digitHeight}
      textDigitHeight={digitHeight}
      textDigitWidth={digitWidth}
      variant="num-xxl"
      weight={weight}
      color={numberColor}
      allowFontScaling={false}
    />
  );
}

export const AmountInputDisplayValue = create(AmountInputDisplayValueBase, 'EtAmountInputDisplay.Value');
