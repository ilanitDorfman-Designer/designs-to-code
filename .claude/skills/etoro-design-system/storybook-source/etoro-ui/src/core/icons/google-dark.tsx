import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function GoogleDark({ size = 40 }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 20 18">
        <G strokeWidth="1" fill={colors.textPrimaryNeutral}>
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.8363 9.00005C17.8363 8.45222 17.7545 7.90439 17.6727 7.35657H16.9363H14.2363H9.16357V10.6435H14.3181C13.9908 11.7392 13.2545 12.7566 12.3545 13.3827L14.9727 15.4174C16.6908 13.8522 17.8363 11.5044 17.8363 9.00005Z"
          />
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.32733 3.91303C10.6364 3.91303 11.7819 4.38259 12.6819 5.08694L15.1364 2.73912C13.5819 1.33042 11.5364 0.469551 9.24551 0.469551C5.72733 0.39129 2.61824 2.34781 1.14551 5.1652L4.17278 7.35651C4.90914 5.32172 6.9546 3.91303 9.32733 3.91303Z"
          />
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.22721 12.913L4.09085 10.7217C3.92721 10.1739 3.84539 9.70429 3.84539 9.0782C3.84539 8.45212 3.92721 7.90429 4.17267 7.2782L1.14539 5.16516C0.572665 6.33907 0.163574 7.59125 0.163574 8.99994C0.163574 10.4086 0.572665 11.7391 1.22721 12.913Z"
          />
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.09093 10.7217L1.22729 12.913C2.78184 15.6521 5.80911 17.6086 9.16366 17.6086C11.4546 17.6086 13.4182 16.7478 14.9727 15.4173L12.3546 13.3825C11.5364 14.0086 10.4727 14.3217 9.3273 14.3217C6.95457 14.3217 4.82729 12.8347 4.09093 10.7217Z"
          />
        </G>
      </Svg>
    </View>
  );
}

export default GoogleDark;
