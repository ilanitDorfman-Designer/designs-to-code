import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Search({ size = 24, fill }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 17 16" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.859 15.5641C16.3779 15.0439 16.3779 14.1076 15.8071 13.5874L11.759 9.47783C13.0046 7.5011 13.0046 4.95214 11.759 2.92339C9.94257 0.0102978 6.10211 -0.874032 3.19582 0.946647C0.289519 2.76733 -0.644648 6.56475 1.17179 9.47783C2.98822 12.3909 6.82869 13.2753 9.73498 11.4546L13.8868 15.6161C14.4058 16.1363 15.34 16.1363 15.859 15.5641ZM6.46456 1.72695C8.95567 1.72695 10.9278 3.75571 10.9278 6.20062C10.9278 8.69755 8.90377 10.6743 6.46456 10.6743C3.97345 10.6743 2.00132 8.64554 2.00132 6.20062C2.00132 3.75571 3.97345 1.72695 6.46456 1.72695Z"
          fill={fill || colors.textPrimaryNeutral}
        />
      </Svg>
    </View>
  );
}

export default Search;
