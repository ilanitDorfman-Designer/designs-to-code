import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Calendar({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <G fill={hasFill ? fill : 'none'} stroke={color || colors.textPrimaryNeutral} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.1">
          <Path
            fill={colors.textPrimaryNeutral}
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5 0C5.41421 0 5.75 0.33578 5.75 0.75V2.33331H14.25V0.75C14.25 0.33578 14.5858 0 15 0C15.4142 0 15.75 0.33578 15.75 0.75V2.33331H18C19.1046 2.33331 20 3.22874 20 4.33331V16.8333C20 17.9379 19.1046 18.8333 18 18.8333H2C0.89543 18.8333 0 17.9379 0 16.8333V4.33331C0 3.22874 0.89543 2.33331 2 2.33331H4.25V0.75C4.25 0.33578 4.58579 0 5 0ZM14.3054 3.83331C14.4171 4.10708 14.686 4.3 15 4.3C15.314 4.3 15.5829 4.10708 15.6946 3.83331H18C18.2761 3.83331 18.5 4.05717 18.5 4.33331V6.3833H1.5V4.33331C1.5 4.05717 1.72386 3.83331 2 3.83331H4.30536C4.41713 4.10708 4.68603 4.3 5 4.3C5.31397 4.3 5.58287 4.10708 5.69464 3.83331H14.3054ZM1.5 7.88331V16.8333C1.5 17.1094 1.72386 17.3333 2 17.3333H18C18.2761 17.3333 18.5 17.1094 18.5 16.8333V7.88331H1.5Z"
          />
        </G>
      </Svg>
    </View>
  );
}

export default Calendar;
