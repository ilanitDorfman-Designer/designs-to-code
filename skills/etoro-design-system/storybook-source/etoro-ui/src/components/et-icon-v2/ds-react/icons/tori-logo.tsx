import { useId } from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/**
 * DS — React `tori-logo` (generated from Figma SVG export, node 64911:413313 "Tori temporary").
 *
 * A gradient brand mark: the knot's diagonal gradient is variable-bound in
 * Figma — primary-divider → carbon800 in BOTH themes (light #B2B2B24D→#242628,
 * dark #B2B2B240→#F7F7F7) — so it reads the theme itself and deliberately
 * ignores the `color` prop the registry passes to tintable icons.
 */
export function DsReactIconToriLogo({ size }: DsReactLocalIconProps) {
  const { colors } = useEtoroTheme();
  // SVG defs are document-global on web — fixed ids collide across instances.
  const id = useId();
  const fillId = `tori-logo-fill-${id}`;
  const strokeId = `tori-logo-stroke-${id}`;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 23.9979" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.4616 3.11838C21.9278 4.64765 20.7527 8.26973 17.8345 11.9834C20.8014 15.7199 22.0156 19.366 20.5551 20.8923C19.0318 22.4841 15.0771 21.2708 11.0368 18.1962C7.61449 20.3854 4.48623 21.0892 3.15998 19.7059C1.83817 18.3272 2.66315 15.2474 4.97682 11.9331C2.69761 8.65314 1.88339 5.62315 3.18124 4.26689C4.48572 2.90367 7.57337 3.59771 10.9709 5.75621C14.9895 2.70858 18.9289 1.51969 20.4616 3.11838ZM3.94242 19.4348C2.84488 18.29 3.58092 15.6721 5.58269 12.7653C5.6874 12.9029 5.79456 13.0407 5.90409 13.1786C6.67091 14.144 7.55475 15.1155 8.53963 16.058C9.28047 16.7669 10.0352 17.418 10.7886 18.0051C7.75368 19.9383 5.05382 20.594 3.94242 19.4348ZM10.7235 5.94613C9.96273 6.53712 9.20084 7.19396 8.45359 7.91037C7.35832 8.96042 6.38959 10.0473 5.56927 11.1222C3.64711 8.28696 2.95507 5.74391 4.03211 4.61838C5.12464 3.47664 7.75454 4.08935 10.7235 5.94613ZM17.6337 12.2357C20.2073 15.5372 21.2797 18.6641 20.0515 19.9476C18.7818 21.2745 15.4358 20.2318 11.8942 17.6207C11.8105 17.559 11.7268 17.4964 11.6429 17.433C10.8124 16.8049 9.97359 16.0919 9.15059 15.3044C9.07877 15.2356 9.00751 15.1668 8.93682 15.0978C7.8765 14.0628 6.94431 12.9986 6.16563 11.9582C6.98805 10.87 7.97561 9.7573 9.09981 8.6795C9.92876 7.88476 10.7736 7.16505 11.6099 6.53078C11.6919 6.4686 11.7738 6.40724 11.8556 6.34672C15.4204 3.70912 18.7874 2.64951 20.0628 3.97977C21.213 5.17957 20.3493 7.99747 18.1252 11.0703L18.0972 11.1088C17.9475 11.3147 17.7918 11.5217 17.6301 11.7293C17.6125 11.752 17.5947 11.7747 17.577 11.7974L17.5525 11.8286L17.5346 11.8512L17.5075 11.8856L17.4997 11.8955L17.4718 11.9306L17.4537 11.9534L17.432 11.9805C17.5002 12.0657 17.5674 12.1507 17.6337 12.2357Z"
        fill={`url(#${fillId})`}
        stroke={`url(#${strokeId})`}
        strokeWidth={0.5}
      />
      <Defs>
        <LinearGradient id={fillId} x1="20.7031" y1="3.34688" x2="4.1447" y2="20.6508" gradientUnits="userSpaceOnUse">
          <Stop stopColor={colors.carbonPrimaryDivider} />
          <Stop offset="1" stopColor={colors.carbon800} />
        </LinearGradient>
        <LinearGradient id={strokeId} x1="20.7031" y1="3.34688" x2="4.1447" y2="20.6508" gradientUnits="userSpaceOnUse">
          <Stop stopColor={colors.carbonPrimaryDivider} />
          <Stop offset="1" stopColor={colors.carbon800} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
