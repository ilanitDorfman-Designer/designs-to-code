import { Circle, G, Path, Svg } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';

function Discover({ size = 24, color = 'gray' }) {
  const { colors } = useEtoroTheme();
  return (
    <Svg width={23} height={size} viewBox="0 0 23 22">
      <G fill={colors.textSecondaryNeutral} stroke={color} strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="11.5695" cy="10.753" r="10.753" fill={color ? color : colors.textSecondaryNeutral} />
        <Path
          ill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.6439 9.8143C14.2651 8.86733 13.1901 7.79237 12.2431 7.4135L7.09816 5.35537C6.15118 4.97674 5.69023 5.43746 6.06909 6.38444L8.12722 11.5294C8.50609 12.4764 9.58105 13.5514 10.528 13.9302L15.673 15.9881C16.62 16.367 17.0808 15.9063 16.7021 14.9593L14.6439 9.8143Z"
          fill={colors.bgNeutralPrimary}
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          strokeWidth="1"
          d="M12.6401 11.8238C12.0319 12.432 11.0592 12.4458 10.468 11.8543C9.8765 11.263 9.89027 10.2904 10.4985 9.68214C11.1068 9.07389 12.0795 9.06013 12.6706 9.65141C13.2623 10.2429 13.2484 11.2155 12.6401 11.8238Z"
          fill={color ?? colors.textSecondaryNeutral}
        />
      </G>
    </Svg>
  );
}
export default Discover;
