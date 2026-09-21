import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function DeleteText({ size = 20, hasFill = true, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = hasFill ? fill || color || colors.textSecondaryNeutral : 'none';

  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <Path
          d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM13.5547 6.44531C13.3092 6.19985 12.9115 6.19986 12.666 6.44531L9.99805 9.11133L7.33203 6.44531C7.08658 6.19985 6.68881 6.19986 6.44336 6.44531C6.1983 6.6908 6.19804 7.08866 6.44336 7.33398L9.10938 10L6.44336 12.667C6.19842 12.9124 6.19828 13.3103 6.44336 13.5557C6.68867 13.801 7.08655 13.8007 7.33203 13.5557L9.99805 10.8887L12.665 13.5557C12.9104 13.801 13.3082 13.8007 13.5537 13.5557C13.799 13.3102 13.7991 12.9124 13.5537 12.667L10.8867 10L13.5547 7.33398C13.8 7.08865 13.7997 6.6908 13.5547 6.44531Z"
          fill={fillColor}
        />
      </Svg>
    </View>
  );
}

export default DeleteText;
