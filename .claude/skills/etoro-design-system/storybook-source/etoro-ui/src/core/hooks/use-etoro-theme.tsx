import { useTheme } from '@react-navigation/native';
import { useMemo } from 'react';

import { eToroDarkTheme, eToroLightTheme } from '../styles/colors';

export const useEtoroTheme = () => {
  const { colors, dark } = useTheme() as unknown as eToroLightTheme | eToroDarkTheme;
  return useMemo(() => ({ colors, dark }) as unknown as eToroLightTheme | eToroDarkTheme, [colors, dark]);
};
