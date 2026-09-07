import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function BarChart({ size = 24, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = fill || color || colors.textPrimaryNeutral;

  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 14 15">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.372 1.313C9.372.588 8.784 0 8.06 0H5.436c-.725 0-1.312.588-1.312 1.313V7.64H1.313C.588 7.64 0 8.228 0 8.953v4.71c0 .724.588 1.312 1.313 1.312H12.183c.725 0 1.313-.588 1.313-1.313V5.46c0-.725-.588-1.312-1.313-1.312H9.372V1.313Zm-8.247 7.64c0-.103.084-.187.188-.187h2.81v5.084h-2.81a.188.188 0 0 1-.188-.187v-4.71Zm4.313-7.828a.188.188 0 0 0-.188.188v12.536h2.998V1.312a.188.188 0 0 0-.187-.187H5.438Zm6.745 12.724h-2.81V5.273h2.81c.104 0 .188.084.188.187v8.202a.188.188 0 0 1-.188.187Z"
          fill={fillColor}
        />
      </Svg>
    </View>
  );
}

export default BarChart;
