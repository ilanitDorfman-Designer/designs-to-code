import { colorsMock } from './colors-mock';

export const useEtoroTheme = () => ({
  dark: colorsMock.dark,
  colors: colorsMock.colors,
  gradients: {} as Record<string, unknown>,
  fonts: colorsMock.fonts ?? {},
});
