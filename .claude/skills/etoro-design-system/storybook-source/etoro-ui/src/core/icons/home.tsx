import { G, Path, Svg } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Home({ size = 24, color = 'gray', hasFill = false }: IconProps) {
  const { colors } = useEtoroTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 22 22">
      <G fill={hasFill ? colors.textSecondaryNeutral : 'none'} stroke={color} strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round">
        <Path
          fill={color ? color : colors.textSecondaryNeutral}
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.03832 0.815517C9.94689 0.308567 11.0532 0.308565 11.9618 0.815511L20.3059 5.47117C20.9446 5.84036 21.1866 6.69961 20.845 7.39141C20.6094 7.8694 20.155 8.1421 19.6864 8.1421C19.4782 8.1421 19.2661 8.08899 19.0692 7.97464L12.0063 3.87432C11.0749 3.33363 9.92522 3.33363 8.99387 3.87431L1.93082 7.97464C1.29117 8.34506 0.495167 8.08135 0.154772 7.39141C-0.186421 6.69961 0.0553998 5.84036 0.694367 5.47117L9.03832 0.815517ZM9.00606 6.21273C9.93068 5.68215 11.0674 5.68209 11.9921 6.21257L17.0698 9.12568C18.002 9.6605 18.5769 10.6531 18.5769 11.7279V15.3118C18.5769 16.9687 17.2338 18.3118 15.5769 18.3118H5.42308C3.76622 18.3118 2.42308 16.9687 2.42308 15.3118V11.7276C2.42308 10.653 2.99787 9.66049 3.92993 9.12563L9.00606 6.21273Z"
        />
      </G>
    </Svg>
  );
}

export default Home;
