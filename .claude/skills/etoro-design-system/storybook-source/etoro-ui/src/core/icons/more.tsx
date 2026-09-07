import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function More({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const iconColor = hasFill ? fill : color || colors.textPrimaryNeutral;

  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M10.0684 5.30099C10.0684 4.24537 10.9338 3.3895 12.0009 3.3895C13.068 3.3895 13.9334 4.24537 13.9334 5.30099C13.9334 6.35662 13.068 7.21249 12.0009 7.21249C10.9338 7.21249 10.0684 6.35662 10.0684 5.30099ZM10.0684 12C10.0684 10.9444 10.9338 10.0885 12.0009 10.0885C13.068 10.0885 13.9334 10.9444 13.9334 12C13.9334 13.0557 13.068 13.9115 12.0009 13.9115C10.9338 13.9115 10.0684 13.0557 10.0684 12ZM10.0684 18.6991C10.0684 17.6434 10.9338 16.7876 12.0009 16.7876C13.068 16.7876 13.9334 17.6434 13.9334 18.6991C13.9334 19.7547 13.068 20.6106 12.0009 20.6106C10.9338 20.6106 10.0684 19.7547 10.0684 18.6991Z"
          fill={iconColor}
        />
      </Svg>
    </View>
  );
}

export default More;
