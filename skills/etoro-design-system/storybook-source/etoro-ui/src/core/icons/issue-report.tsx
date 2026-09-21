import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { useEtoroTheme } from '../hooks/use-etoro-theme';
import { IconProps } from './models/icon-props';

function IssueReport({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = hasFill ? fill : color || colors.textPrimaryNeutral;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_55390_140078)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.7168 4.99543C1.7168 3.39338 3.01525 2.09492 4.6173 2.09492H19.3859C20.988 2.09492 22.2864 3.39338 22.2864 4.99543V14.9985C22.2864 16.6005 20.988 17.899 19.3859 17.899H15.5905L13.5394 20.9883C12.8096 22.088 11.1937 22.088 10.464 20.9883L8.41295 17.899H4.61751C3.01546 17.899 1.717 16.6005 1.717 14.9985L1.7168 4.99543ZM4.6173 3.6772C3.88946 3.6772 3.29908 4.26758 3.29908 4.99543V14.9985C3.29908 15.7273 3.88946 16.3167 4.6173 16.3167H8.83705C9.10209 16.3167 9.3493 16.4502 9.49568 16.6707L11.7821 20.1122C11.8859 20.2695 12.1173 20.2695 12.2212 20.1122L14.5075 16.6707C14.6539 16.4502 14.9011 16.3167 15.1662 16.3167H19.3859C20.1138 16.3167 20.7041 15.7273 20.7041 14.9985V4.99543C20.7041 4.26758 20.1138 3.6772 19.3859 3.6772H4.6173Z"
          fill={fillColor}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0021 6.15173C12.4392 6.15173 12.7932 6.50576 12.7932 6.94287V11.2041C12.7932 11.6413 12.4392 11.9953 12.0021 11.9953C11.565 11.9953 11.2109 11.6413 11.2109 11.2041V6.94287C11.2109 6.50576 11.565 6.15173 12.0021 6.15173Z"
          fill={fillColor}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0021 12.7973C12.4392 12.7973 12.7932 13.1513 12.7932 13.5884V13.63C12.7932 14.0671 12.4392 14.4211 12.0021 14.4211C11.565 14.4211 11.2109 14.0671 11.2109 13.63V13.5884C11.2109 13.1513 11.565 12.7973 12.0021 12.7973Z"
          fill={fillColor}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_55390_140078">
          <Rect width={20.7595} height={20} fill="white" transform="translate(1.62109 2)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IssueReport;
