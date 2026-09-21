import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function SearchLine({ size = 16, hasFill = true, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = hasFill ? fill || color || colors.textSecondaryNeutral : 'none';

  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.2074 11.0771C9.12949 11.962 7.75007 12.4932 6.24658 12.4932C2.79669 12.4932 0 9.69647 0 6.24658C0 2.79669 2.79669 0 6.24658 0C9.69647 0 12.4932 2.79669 12.4932 6.24658C12.4932 7.76085 11.9544 9.14927 11.058 10.2306L15.8023 14.9526C16.0371 15.1864 16.038 15.5663 15.8043 15.8011C15.5705 16.036 15.1906 16.0369 14.9558 15.8031L10.2074 11.0771ZM11.2932 6.24658C11.2932 9.03373 9.03373 11.2932 6.24658 11.2932C3.45943 11.2932 1.2 9.03373 1.2 6.24658C1.2 3.45943 3.45943 1.2 6.24658 1.2C9.03373 1.2 11.2932 3.45943 11.2932 6.24658Z"
          fill={fillColor}
        />
      </Svg>
    </View>
  );
}

export default SearchLine;
