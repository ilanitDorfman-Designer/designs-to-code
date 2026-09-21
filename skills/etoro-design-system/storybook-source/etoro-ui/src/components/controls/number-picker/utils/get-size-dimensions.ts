export type NumberPickerSize = 'small' | 'medium' | 'large';

export interface SizeDimensions {
  buttonSize: number;
  numberFontSize: number;
  containerHeight: number;
  containerPadding: number;
}

export const getSizeDimensions = (size: NumberPickerSize): SizeDimensions => {
  switch (size) {
    case 'small':
      return {
        buttonSize: 32,
        numberFontSize: 18,
        containerHeight: 50,
        containerPadding: 12,
      };
    case 'medium':
      return {
        buttonSize: 40,
        numberFontSize: 24,
        containerHeight: 60,
        containerPadding: 16,
      };
    case 'large':
      return {
        buttonSize: 48,
        numberFontSize: 32,
        containerHeight: 70,
        containerPadding: 20,
      };
    default:
      return {
        buttonSize: 44,
        numberFontSize: 24,
        containerHeight: 60,
        containerPadding: 16,
      };
  }
};
