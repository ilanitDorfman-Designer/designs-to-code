import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function SortDescending({ color, size = 18 }: IconProps) {
  const { colors } = useEtoroTheme();

  // Viewbox is 18x12; height is proportional to width
  const height = Math.round((size * 12) / 18);

  return (
    <Svg width={size} height={height} viewBox="0 0 18 12" fill="none">
      <Path
        d="M17.9165 0.625C17.9165 0.279822 17.6367 0 17.2915 0H0.624838C0.279659 0 -0.000162125 0.279822 -0.000162125 0.625C-0.000162125 0.970179 0.279659 1.25 0.624838 1.25H17.2915C17.6367 1.25 17.9165 0.970179 17.9165 0.625Z"
        fill={color || colors.textPrimaryNeutral}
      />
      <Path
        d="M12.0832 10.625C12.0832 10.2798 11.8033 10 11.4582 10H6.45817C6.11299 10 5.83317 10.2798 5.83317 10.625C5.83317 10.9702 6.11299 11.25 6.45817 11.25H11.4582C11.8033 11.25 12.0832 10.9702 12.0832 10.625Z"
        fill={color || colors.textPrimaryNeutral}
      />
      <Path
        d="M14.3748 5C14.72 5 14.9998 5.27982 14.9998 5.625C14.9998 5.97018 14.72 6.25 14.3748 6.25L3.5415 6.25C3.19633 6.25 2.9165 5.97018 2.9165 5.625C2.9165 5.27982 3.19633 5 3.5415 5L14.3748 5Z"
        fill={color || colors.textPrimaryNeutral}
      />
    </Svg>
  );
}

export default SortDescending;
